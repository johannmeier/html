window.dialog = (function () {
    const map = new Map([
        ["error", `<img class="type" alt="Error" src="/img/error.svg"/>`],
        ["warning", `<img class="type" alt="Warning" src="/img/warning.svg"/>`],
        ["info", `<img class="type" alt="Warning" src="/img/info.svg"/>`]
    ]);

    function closeDialog(event) {
        const rect = event.target.getBoundingClientRect();
        if (rect.left > event.clientX ||
            rect.right < event.clientX ||
            rect.top > event.clientY ||
            rect.bottom < event.clientY
        ) {
            event.target.close();
        }
    }

    function showDialog(content, type) {
        createHostAndDialog("dialogDiv",
            `${map.get(type) ? map.get(type) : ""}<span>${content}</span>`
        ).showModal();
    }

    function showOkCancelDialog(content, okCallback, type) {
        const dialog = createHostAndDialog("okCancelDialogDiv",
            `${map.get(type) ? map.get(type) : ""}<span>${content}</span>`,
            (dialog) => {
                const buttonDiv = document.createElement("div");
                buttonDiv.className = "buttons"
                buttonDiv.innerHTML = "<button form='dialog-form' value='ok'>Ok</button><button form='dialog-form' value='cancel'>Cancel</button>";
                dialog.appendChild(buttonDiv);

                dialog.addEventListener("close", () => {
                    if ('ok' === dialog.returnValue && okCallback) {
                        okCallback();
                    }
                });
            });
        dialog.showModal();
    }
    function showAjaxDialog(url) {
        const dialog = createHostAndDialog("ajaxDialogDiv",
            `<div id="ajaxTarget"></div>`
        );
        getData(url, dialog.querySelector("#ajaxTarget")).then(r => console.log(r));
        dialog.showModal();
    }

    function showIframeDialog(url) {
        function resizeIframe(event) {
            const iframe = event.currentTarget;
            let x = 5;
            iframe.height = iframe.contentWindow.document.documentElement.scrollHeight + x + "px";
            iframe.width = iframe.contentWindow.document.documentElement.scrollWidth + x + "px";
        }

        const dialog = createHostAndDialog("iframeDialogDiv", `<iframe class="iframe"</iframe>`,
            (dialog) => {
                dialog.querySelector("iframe").addEventListener("load", resizeIframe);
            })
        dialog.querySelector("iframe").src = url;
        dialog.showModal();
    }

    function createHostAndDialog(hostId, content, createdCallback) {
        let host = document.getElementById(hostId)
        if (!host) {
            host = document.createElement("div");
            host.id = hostId;
            document.body.appendChild(host);
            const shadow = host.attachShadow({mode: 'open'});
            shadow.innerHTML = getDialogHtml(content, hostId + "Dialog");
            const dialog = shadow.querySelector("dialog");
            dialog.addEventListener("click", closeDialog);
            if (createdCallback) {
                createdCallback(dialog)
            }
        }
        return host.shadowRoot.querySelector("dialog");
    }

    function getDialogHtml(contentElement, dialogId) {
        return `
         <link rel="stylesheet" href="/css/modalDialog.css">
         <dialog id="${dialogId}">
             <form method="dialog" id="dialog-form">
                 <button class="close" type="submit">✖️</button>
             </form>
             ${contentElement}
         </dialog>`;
    }

    async function getData(url, target) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            target.innerHTML = await response.text();
        } catch (error) {
            console.error(error.message);
        }
    }

    return {
        "showDialog": showDialog,
        "showOkCancelDialog": showOkCancelDialog,
        "showIframeDialog": showIframeDialog,
        "showAjaxDialog": showAjaxDialog
    }
})();
