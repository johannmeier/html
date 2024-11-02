window.dialog = (function () {
    function closeDialog(event) {
        let rect = event.target.getBoundingClientRect();
        if (rect.left > event.clientX ||
            rect.right < event.clientX ||
            rect.top > event.clientY ||
            rect.bottom < event.clientY
        ) {
            event.target.close();
        }
    }

    function showOkCancelDialog(content, okCallback) {
        const dialog = createHostAndDialog("okCancelDialogDiv", `<span>${content}</span>`,
            (dialog) => {
                const buttonDiv = document.createElement("div");
                buttonDiv.style.marginTop = "5px";
                buttonDiv.style.display = "flex";
                buttonDiv.style.justifyContent = "center";
                buttonDiv.style.gap = "5px";
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

    function showDialog(content, type) {
        let map = new Map([
            ["error", `<img style="float: left; height: 30px" alt="Error" src="/img/error.svg"/>`],
            ["warning", `<img style="float: left; height: 30px" alt="Warning" src="/img/warning.svg"/>`],
            ["info", `<img style="float: left; height: 30px" alt="Warning" src="/img/info.svg"/>`]
        ]);

        let img = map.get(type);
        if (!img) {
            img = "";
        }

        createHostAndDialog("dialogDiv",
            `${img}<span>${content}</span>`
        ).showModal();
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

        const dialog = createHostAndDialog("iframeDialogDiv", `<iframe style="border:none"</iframe>`,
            (dialog) => {
                dialog.querySelector("iframe").addEventListener("load", resizeIframe);
                dialog.style.padding = "0";
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
            shadow.innerHTML = getDialogHtml(content);
            const dialog = shadow.querySelector("dialog");
            dialog.addEventListener("click", closeDialog);
            if (createdCallback) {
                createdCallback(dialog)
            }
        }
        return host.shadowRoot.querySelector("dialog");
    }

    function getDialogHtml(contentElement) {
        return `<style>
             dialog[open] {
                 background-color: aquamarine;
                 min-width: 200px;
             }
         </style>
         <dialog style="padding: 5px">
             <form method="dialog" id="dialog-form">
                 <button style="position:absolute;right:0;top:0;font-size:x-small;padding:0" type="submit">✖️</button>
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
