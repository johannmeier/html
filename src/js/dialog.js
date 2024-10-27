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
