window.closeDialog = function (event) {
    let rect = event.target.getBoundingClientRect();
    if (rect.left > event.clientX ||
        rect.right < event.clientX ||
        rect.top > event.clientY ||
        rect.bottom < event.clientY
    ) {
        event.target.close();
    }
}

window.showDialog = function (content) {
    let host = document.getElementById("dialogDiv")
    if (!host) {
        host = document.createElement("div");
        host.id = "dialogDiv"
        document.body.appendChild(host);
        const shadow = host.attachShadow({mode: 'open'});
        shadow.innerHTML = window.getDialogHtml(`<span>${content}</span>`)
    }
    let dialog = host.shadowRoot.querySelector("dialog")
    dialog.showModal();
}

window.showOkCancelDialog = function (content, callback) {

}

window.showIframeDialog = function (url) {
    let host = document.getElementById("iframeDialogDiv")
    if (!host) {
        host = document.createElement("div");
        window.resizeIframe = function(iframe) {
            let x = 5;
            iframe.height = iframe.contentWindow.document.documentElement.scrollHeight + x + "px";
            iframe.width = iframe.contentWindow.document.documentElement.scrollWidth + x + "px";
        }
        host.id = "iframeDialogDiv"
        document.body.appendChild(host);
        const shadow = host.attachShadow({mode: 'open'});
        shadow.innerHTML = window.getDialogHtml(`<iframe style="border:none" onload="window.resizeIframe(this)"></iframe>`)
    }

    let dialog = host.shadowRoot.querySelector("dialog")
    dialog.showModal();
    dialog.querySelector("iframe").src = url;
}

window.showAjaxDialog = function (params) {

}

window.getDialogHtml = function (contentElement) {
    return `<style>
             dialog[open] {
                 background-color: aquamarine;
                 min-width: 200px;
             }
         </style>
         <dialog style="padding:0" onclick="closeDialog.apply(this, arguments)">
             <form method="dialog">
                 <button style="position:absolute;right:0;top:0;font-size:x-small;padding:0" type="submit">✖️</button>
             </form>
             ${contentElement}
         </dialog>`;
}
