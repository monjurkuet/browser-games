

const scriptsInEvents = {

	async History_Event37_Act1(runtime, localVars)
	{
		function generateRandomString() {
		    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		    let result = '';
		    for (let i = 0; i < 14; i++) {
		        result += characters.charAt(Math.floor(Math.random() * characters.length));
		    }
		    return result;
		}
		
		runtime.globalVars.Transaction = generateRandomString();
	},

	async Main_Event186_Act1(runtime, localVars)
	{
		window.close();
	},

	async Main_Event191_Act1(runtime, localVars)
	{
const styleElement = document.createElement('style');
styleElement.textContent = `
body {
    background-image: url(blurbg.png);
    background-position: center; /* Căn giữa hình ảnh */
    background-size: cover; /* Đảm bảo hình ảnh phủ kín không gian mà không mất tỉ lệ */
    background-repeat: no-repeat; /* Đảm bảo hình ảnh không lặp lại */
    margin: 0; /* Loại bỏ khoảng cách biên mặc định */
    height: 100vh; /* Chiều cao bằng 100% của viewport */
    width: 100vw; /* Chiều rộng bằng 100% của viewport */
    top: 0;
    left: 0;
}
`;
document.head.appendChild(styleElement);

	}
};

globalThis.C3.JavaScriptInEvents = scriptsInEvents;
