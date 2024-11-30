(() => {
    function TabComponent(component) {
        let type;

        const keys = new Map();
        keys.set('ArrowUp', arrowUp);
        keys.set('ArrowLeft', arrowLeft);
        keys.set('ArrowDown', arrowDown);
        keys.set('ArrowRight', arrowRight);

        function isHidden(element) {
            return element.style.display === 'none';
        }

        function getNextTabElement(currentElement, elements) {
            for (let i = 0; i < elements.length - 1; i++) {
                const element = elements[i];
                if (element === currentElement) {
                    const nextElement = elements[i + 1];
                    if (isHidden(nextElement)) {
                        return getNextTabElement(nextElement, elements);
                    } else {
                        return nextElement;
                    }
                }
            }
            return null;
        }

        function getPreviousTabElement(currentElement, elements) {
            for (let i = 1; i < elements.length; i++) {
                const element = elements[i];
                if (element === currentElement) {
                    const previousElement = elements[i - 1];
                    if (isHidden(previousElement)) {
                        return getPreviousTabElement(previousElement, elements);
                    } else {
                        return previousElement;
                    }
                }
            }
            return null;
        }

        function getRowTabElements(element) {
            if (type === "xy") {
                return component.querySelectorAll(`[data-tab-y="${element.dataset.tabY}"]`);
            } else {
                return component.querySelectorAll(`[data-tab-x]`);
            }
        }

        function getColTabElements(element) {
            if (type === "xy") {
                return component.querySelectorAll(`[data-tab-x="${element.dataset.tabX}"]`);
            } else {
                return component.querySelectorAll(`[data-tab-y]`);
            }
        }

        function getNextLeftTabElement(element) {
            return getPreviousTabElement(element, getRowTabElements(element));
        }

        function getNextRightTabElement(element) {
            return getNextTabElement(element, getRowTabElements(element));
        }

        function getNextUpperTabElement(element) {
            return getPreviousTabElement(element, getColTabElements(element));
        }

        function getNextLowerTabElement(element) {
            return getNextTabElement(element, getColTabElements(element));
        }

        function focus(element) {
            if (element) {
                component.querySelectorAll("[data-tab-x],[data-tab-y]").forEach(e => e.tabIndex = -1);
                setTimeout(() => {
                    element.tabIndex = 0;
                    element.focus();
                }, 0);
            }
        }

        function arrowUp(element) {
            focus(getNextUpperTabElement(element));
        }

        function arrowLeft(element) {
            focus(getNextLeftTabElement(element));
        }

        function arrowDown(element) {
            focus(getNextLowerTabElement(element));
        }

        function arrowRight(element) {
            focus(getNextRightTabElement(element));
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

        function setTabIndex() {
            component.querySelectorAll('[data-tab-x], [data-tab-y]').forEach(e => e.tabIndex = -1);
            component.querySelector('[data-tab-x], [data-tab-y]').tabIndex = 0;
        }

        function wireXY() {
            component.addEventListener('keydown', function (event) {
                if (keys.has(event.key)) {
                    keys.get(event.key)(event.target);
                    event.preventDefault();
                }
            });
        }

        setType();
        setTabIndex();
        wireXY();
    }

    function wire() {
        document.querySelectorAll(".tab-component").forEach(c => {
            new TabComponent(c);
        });
    }

    wire();
})();
