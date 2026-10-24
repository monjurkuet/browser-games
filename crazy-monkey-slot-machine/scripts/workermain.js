// Construct 3 workermain.js - worker entry point with XML polyfills
// Provide xmlDomLib that C3's XML plugin expects BEFORE loading c3runtime

// Minimal DOMParser for worker
self.DOMParser = class {
    parseFromString(str, mimeType) {
        const parser = new DOMParser();
        return parser.parseFromString(str, mimeType);
    }
};

// XPathResult with proper constants (matching native XPathResult)
self.XPathResult = class XPathResult {
    constructor() {
        this.resultType = 0;
        this.numberValue = 0;
        this.stringValue = "";
        this.booleanValue = false;
        this.singleNodeValue = null;
        this.snapshotLength = 0;
        this.invalidIteratorState = false;
    }
    iterateNext() { return null; }
    snapshotItem() { return null; }
};

// Add static constants
self.XPathResult.ANY_TYPE = 0;
self.XPathResult.NUMBER_TYPE = 1;
self.XPathResult.STRING_TYPE = 2;
self.XPathResult.BOOLEAN_TYPE = 3;
self.XPathResult.UNORDERED_NODE_ITERATOR_TYPE = 4;
self.XPathResult.ORDERED_NODE_ITERATOR_TYPE = 5;
self.XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE = 6;
self.XPathResult.ORDERED_NODE_SNAPSHOT_TYPE = 7;
self.XPathResult.ANY_UNORDERED_NODE_TYPE = 8;
self.XPathResult.FIRST_ORDERED_NODE_TYPE = 9;

// Minimal evaluate function - returns empty result
function evaluate(xpathExpression, contextNode, namespaceResolver, resultType, result) {
    return new self.XPathResult();
}

// Provide xmlDomLib that C3 XML plugin expects
self.xmlDomLib = {
    DOMParser: self.DOMParser,
    XPathResult: self.XPathResult,
    evaluate: evaluate
};

// Queue for messages received before c3runtime loads
const messageQueue = [];
let runtimeReady = false;

// Set up message handler SYNCHRONOUSLY to catch init-runtime
self.onmessage = function(e) {
    if (e.data.type === 'init-runtime') {
        if (runtimeReady) {
            handleInitRuntime(e.data, e.ports[0]);
        } else {
            // Queue it for later
            messageQueue.push({data: e.data, port: e.ports[0]});
        }
    }
};

async function handleInitRuntime(opts, messagePort) {
    try {
        const runtime = await self.C3_CreateRuntime(opts);
        // Pass messagePort as third argument to C3_InitRuntime (required for worker mode)
        await self.C3_InitRuntime(runtime, opts, messagePort);
        // Runtime should send "runtime-ready" via messagePort automatically
    } catch (err) {
        console.error('[workermain] Runtime init error:', err);
        if (messagePort) {
            messagePort.postMessage({type: "alert-error", message: String(err)});
        }
    }
}

// NOW load c3runtime.js via dynamic import (not hoisted)
import('./c3runtime.js').then(() => {
    runtimeReady = true;
    // Process queued messages
    for (const msg of messageQueue) {
        handleInitRuntime(msg.data, msg.port);
    }
    messageQueue.length = 0;
}).catch(err => {
    console.error('[workermain] Failed to load c3runtime:', err);
});