import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, '..');
const PORT_ROOT = path.join(ROOT, 'gladiator-slot-port');
const PORT = 18792;
const ORIGINAL_URL = 'https://previews.customer.envatousercontent.com/files/730070676/index.html';
const LOCAL_URL = `http://127.0.0.1:${PORT}/`;
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].filter(Boolean);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitFor(check, description, timeoutMs = 30000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const value = await check();
      if (value) return value;
    } catch {
      // Retry until the deadline.
    }
    await sleep(250);
  }
  throw new Error(`Timed out waiting for ${description}`);
}

class CdpClient {
  constructor(url) {
    this.nextId = 1;
    this.pending = new Map();
    this.events = [];
    this.socket = new WebSocket(url);
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      this.events.push(message);
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.socket.close();
  }
}

async function evaluate(client, expression) {
  const result = await client.send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || 'Runtime evaluation failed');
  }
  return result.result.value;
}

async function startServer() {
  const child = spawn(process.execPath, ['server.js'], {
    cwd: PORT_ROOT,
    env: { ...process.env, PORT: String(PORT), HOST: '127.0.0.1' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let errorOutput = '';
  child.stderr.on('data', (chunk) => { errorOutput += chunk.toString(); });
  child.stdout.resume();
  child.once('exit', () => { errorOutput += '\nServer process exited.'; });
  try {
    await waitFor(async () => {
      if (child.exitCode !== null) {
        throw new Error(`Local server exited: ${errorOutput}`);
      }
      const response = await fetch(LOCAL_URL);
      const body = await response.text();
      return response.status === 200 && body.includes('js/slotGame.js');
    }, 'the local server', 10000);
    return child;
  } catch (error) {
    child.kill();
    throw new Error(`${error.message}\n${errorOutput}`);
  }
}

async function launchBrowser() {
  const chrome = CHROME_CANDIDATES.find((candidate) => existsSync(candidate));
  if (!chrome) throw new Error('No Chrome/Edge executable found. Set CHROME_PATH.');

  const profile = await mkdtemp(path.join(tmpdir(), 'gladiator-slot-browser-'));
  const debuggingPort = 9300 + Math.floor(Math.random() * 500);
  const child = spawn(chrome, [
    '--headless=new',
    '--window-size=784,469',
    '--disable-features=BlockInsecurePrivateNetworkRequests',
    '--unsafely-treat-insecure-origin-as-secure=https://previews.customer.envatousercontent.com',
    `--remote-debugging-port=${debuggingPort}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-renderer-backgrounding',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
    'about:blank',
  ], { stdio: 'ignore' });

  const target = await waitFor(async () => {
    const response = await fetch(`http://127.0.0.1:${debuggingPort}/json/list`);
    const targets = await response.json();
    return targets.find((item) => item.type === 'page');
  }, 'the Chrome DevTools target');
  return { child, profile, target };
}

async function auditPage(client, url, outputPath) {
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');
  await client.send('Network.setCacheDisabled', { cacheDisabled: true });
  await client.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `(() => {
      window.__audit = { errors: [], rejections: [], consoleErrors: [] };
      addEventListener('error', (event) => window.__audit.errors.push(String(event.message || event.error)));
      addEventListener('unhandledrejection', (event) => window.__audit.rejections.push(String(event.reason)));
      const original = console.error.bind(console);
      console.error = (...argumentsList) => {
        window.__audit.consoleErrors.push(argumentsList.map(String).join(' '));
        original(...argumentsList);
      };
    })();`,
  });

  client.events.length = 0;
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 784,
    height: 469,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Page.navigate', { url });
  await client.send('Page.bringToFront');
  await new Promise((resolve) => setTimeout(resolve, 2000));
  await waitFor(async () => {
    const ready = await evaluate(client, `(() => {
      if (typeof slotGame === 'undefined') return false;
      const game = slotGame;
      const scene = game && game.scene && game.scene.scenes && game.scene.scenes[0];
      return Boolean(scene && scene.stateMachine && scene.slotControls && document.visibilityState === 'visible');
    })()`);
    return ready;
  }, `${url} to initialize`, 90000);

  const readHud = async () => JSON.parse(await evaluate(client, `JSON.stringify({
    state: slotGame.scene.scenes[0].stateMachine.currentState.toString(),
    balance: slotGame.scene.scenes[0].slotControls.creditSumText.text.trim(),
    bet: slotGame.scene.scenes[0].slotControls.totalBetSumText.text.trim(),
    win: slotGame.scene.scenes[0].slotControls.winAmountText.text.trim()
  })`));

  const before = await readHud();
  const rectangle = await evaluate(client, `(() => {
    const rect = document.querySelector('canvas').getBoundingClientRect();
    return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  })()`);
  const x = rectangle.x + rectangle.width / 2;
  const y = rectangle.y + rectangle.height * 0.89;
  await client.send('Input.dispatchMouseEvent', { type: 'mousePressed', x, y, button: 'left', clickCount: 1 });
  await client.send('Input.dispatchMouseEvent', { type: 'mouseReleased', x, y, button: 'left', clickCount: 1 });

  const samples = [];
  await waitFor(async () => {
    const sample = await readHud();
    samples.push(sample);
    return samples.some((item) => ['WinState', 'LooseState', 'FreeInputWinState'].includes(item.state));
  }, 'the spin to resolve', 20000);

  const resources = JSON.parse(await evaluate(client, `JSON.stringify(performance.getEntriesByType('resource').map((entry) => entry.name))`));
  const pageAudit = JSON.parse(await evaluate(client, 'JSON.stringify(window.__audit)'));
  const runtimeErrors = client.events
    .filter((event) => event.method === 'Runtime.exceptionThrown')
    .map((event) => event.params.exceptionDetails.text || 'Runtime exception');
  const consoleErrors = client.events
    .filter((event) => event.method === 'Runtime.consoleAPICalled' && event.params.type === 'error')
    .map((event) => event.params.args.map((argument) => argument.value ?? argument.description ?? '').join(' '));

  const canvas = JSON.parse(await evaluate(client, `JSON.stringify((() => {
    const canvas = document.querySelector('canvas');
    return {
      width: canvas.width,
      height: canvas.height,
      payloadLength: canvas.toDataURL().length,
      visibility: document.visibilityState
    };
  })())`));

  const audit = {
    url: await evaluate(client, 'location.href'),
    title: await evaluate(client, 'document.title'),
    before,
    samples,
    audit: {
      errors: [...pageAudit.errors, ...runtimeErrors],
      rejections: pageAudit.rejections,
      consoleErrors: [...pageAudit.consoleErrors, ...consoleErrors],
    },
    canvas,
    resources,
  };
  await writeFile(outputPath, `${JSON.stringify(audit, null, 2)}\n`, 'utf8');
  return audit;
}

async function terminateTree(child) {
  if (!child.pid || child.exitCode !== null) return;
  if (process.platform === 'win32') {
    await new Promise((resolve) => {
      const killer = spawn('taskkill.exe', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
      killer.once('exit', resolve);
    });
  } else {
    child.kill('SIGTERM');
  }
  await Promise.race([
    new Promise((resolve) => child.once('exit', resolve)),
    sleep(3000),
  ]);
}

async function removeProfile(profile) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(profile, { recursive: true, force: true });
      return;
    } catch (error) {
      if (attempt === 4) throw error;
      await sleep(250);
    }
  }
}

async function main() {
  const server = await startServer();
  let browser;
  try {
    browser = await launchBrowser();
    const client = new CdpClient(browser.target.webSocketDebuggerUrl);
    await client.connect();
    try {
      const original = await auditPage(
        client,
        ORIGINAL_URL,
        path.join(PORT_ROOT, 'original-browser-audit.json'),
      );
      const local = await auditPage(
        client,
        LOCAL_URL,
        path.join(PORT_ROOT, 'local-browser-audit.json'),
      );
      console.log(`original=${original.before.state}->${original.samples.at(-1).state}`);
      console.log(`local=${local.before.state}->${local.samples.at(-1).state}`);
    } finally {
      client.close();
    }
  } finally {
    if (browser) {
      await terminateTree(browser.child);
      await removeProfile(browser.profile);
    }
    server.kill();
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
