window.dialog = (function () {
    // public
    function showDialog(content, type) {
        const dialog = createHostAndDialog("dialogHost", elementHtmlMap.get("spanTarget"));
        dialog.querySelector("#content").innerHTML = `${elementHtmlMap.get(type) ? elementHtmlMap.get(type) : ""}${content}`;
        dialog.showModal();
    }

    function showOkCancelDialog(content, okCallback, type) {
        const dialog = createHostAndDialog("okCancelDialogHost", elementHtmlMap.get("spanTarget"),
            (dialog) => {
                const buttonDiv = document.createElement("div");
                buttonDiv.className = "buttons"
                buttonDiv.innerHTML = elementHtmlMap.get("buttons");
                dialog.appendChild(buttonDiv);

                dialog.addEventListener("close", () => {
                    if ('ok' === dialog.returnValue && okCallback) {
                        okCallback();
                    }
                });
            });
        dialog.querySelector("#content").innerHTML = `${elementHtmlMap.get(type) ? elementHtmlMap.get(type) : ""}${content}`;
        dialog.showModal();
    }

    function showAjaxDialog(url) {
        const dialog = createHostAndDialog("ajaxDialogHost", elementHtmlMap.get("ajaxTarget"));
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

        const dialog = createHostAndDialog("iframeDialogHost", elementHtmlMap.get("iframeTarget"),
            (dialog) => {
                dialog.querySelector("iframe").addEventListener("load", resizeIframe);
            });
        dialog.querySelector("iframe").src = url;
        dialog.showModal();
    }

    // private
    const elementHtmlMap = new Map([
        ["error", `<img class="type" alt="Error" src="/img/error.svg"/>`],
        ["warning", `<img class="type" alt="Warning" src="/img/warning.svg"/>`],
        ["info", `<img class="type" alt="Info" src="/img/info.svg"/>`],
        ["buttons", `<button form='dialog-form' value='ok'>Ok</button><button form='dialog-form' value='cancel'>Cancel</button>`],
        ["ajaxTarget", `<div id="ajaxTarget"></div>`],
        ["iframeTarget", `<iframe class="iframe"</iframe>`],
        ["spanTarget", `<span id="content"></span>`]
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
