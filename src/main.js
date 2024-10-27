window.customElements.define('my-wizard',
    class extends HTMLElement {
        constructor() {
            super();

            const template = document.getElementById('custom-wizard');
            const templateContent = template.content;

            this.attachShadow({ mode: 'open' }).appendChild(
                templateContent.cloneNode(true)
            );
        }
    }
);
