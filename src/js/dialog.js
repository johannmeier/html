customElements.define(
    "my-dialog",
    class extends HTMLElement {
        constructor() {
            super();
            let template = document.getElementById("my-dialog");
            let templateContent = template.content;

            const shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(templateContent.cloneNode(true));
        }
    },
);

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

window.showDialog = function (options) {
    const dialog = document.querySelector("my-dialog").shadowRoot.getElementById("dialog");

    if (options.header) {
        dialog.querySelector(".header").innerText = options.header;
    }
    if (options.content) {
        dialog.querySelector(".content").innerText = options.content;
    }
    if (options.footer) {
        dialog.querySelector(".footer").innerText = options.footer;
    }

    dialog.showModal();
}
