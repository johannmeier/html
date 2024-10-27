function IframeApp() {
    let resizing = false;
    let x = 0;

    function wire() {
        addEventListener("a", "click", function (evnt) {
            evnt.preventDefault();
            const a = evnt.target;
            const iframe = document.getElementById("content");
            iframe.src = a.href;
        });

        addEventListener("#resizer", "mousedown", e => {
            if (e.button === 0) {
                resizing = true;
                x = e.pageX;
            }
        });

        addEventListener("body", "mousemove", e => {
            if (resizing && e.button === 0) {
                const debuggerDiv = document.getElementById("debugger");
                const length = x - e.pageX;
                if (length !== 0) {
                    debuggerDiv.style.width = (debuggerDiv.offsetWidth + length) + 'px';
                }
                x = e.pageX;
            }
        });

        addEventListener("body", "mouseup", e => {
            if (e.button === 0) {
                resizing = false;
            }
        });

        addEventListener("body", "mouseleave", e => {
            resizing = false;
        });

        addEventListener("#content", "mouseenter", e => {
            resizing = false;
        });
    }

    function addEventListener(query, event, method) {
        const elements = document.querySelectorAll(query);
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener(event, method);
        }
    }

    wire();
}