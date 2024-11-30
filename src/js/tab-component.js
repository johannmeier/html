(() => {
    function TabComponent(component) {
        let currentX = 1;
        let currentY = 1;
        let type;

        function focus(x, y) {
            const currentElement = getElement(x, y);
            if (currentElement) {
                component.querySelectorAll('[data-tab-x], [data-tab-y]').forEach(e => e.tabIndex = -1);
                currentElement.tabIndex = 0;
                setTimeout(() => {
                    currentElement.focus();
                }, 0);
                return true;
            } else {
                return false;
            }
        }

        function getElement(x, y) {
            if (type === "xy") {
                return component.querySelector(`[data-tab-x='${x}'][data-tab-y='${y}']`);
            }
            if (type === "x") {
                return component.querySelector(`[data-tab-x='${x}']`);
            }
            if (type === "y") {
                return component.querySelector(`[data-tab-y='${y}']`);
            }

            return null;
        }

        function setType() {
            if (component.querySelector("[data-tab-x][data-tab-y]")) {
                type = "xy";
            } else if (component.querySelector("[data-tab-x]")) {
                type = "x";
            } else {
                type = "y";
            }
        }

        const keys = new Map();
        keys.set(
            'ArrowUp', () => {
                if (focus(currentX, currentY - 1)) {
                    currentY--;
                }
            });
        keys.set(
            'ArrowLeft', () => {
                if (focus(currentX - 1, currentY)) {
                    currentX--;
                }
            });
        keys.set(
            'ArrowDown', () => {
                if (focus(currentX, currentY + 1)) {
                    currentY++;
                }
            });
        keys.set(
            'ArrowRight', () => {
                if (focus(currentX + 1, currentY)) {
                    currentX++;
                }
            });

        function wireXY() {
            component.addEventListener('keydown', function (event) {
                if (keys.has(event.key)) {
                    keys.get(event.key)();
                    event.preventDefault();
                }
            });
        }

        setType();
        wireXY();
    }

    function wire() {
        document.querySelectorAll(".tab-component").forEach(c => {
            new TabComponent(c);
        });
    }

    wire();
})();
