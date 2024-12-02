(() => {
    function TabComponent(component) {
        let type;

        const keys = new Map();
        keys.set('ArrowUp', arrowUp);
        keys.set('ArrowLeft', arrowLeft);
        keys.set('ArrowDown', arrowDown);
        keys.set('ArrowRight', arrowRight);

        function isHidden(element) {
            return (element.offsetParent === null) || !element.checkVisibility();
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

        function sortColElements(colElements) {
            return Array.from(colElements).sort((a,b) => {
                const aY = parseInt(a.dataset.tabY);
                const bY = parseInt(b.dataset.tabY);
                return aY - bY;
            })
        }

        function sortRowElements(rowElements) {
            return Array.from(rowElements).sort((a,b) => {
                const aX = parseInt(a.dataset.tabX);
                const bX = parseInt(b.dataset.tabX);
                return aX - bX;
            })
        }

        function getRowTabElements(element) {
            if (type === "xy") {
                return sortRowElements(component.querySelectorAll(`[data-tab-y="${element.dataset.tabY}"]`));
            } else {
                return sortRowElements(component.querySelectorAll(`[data-tab-x]`));
            }
        }

        function getColTabElements(element) {
            if (type === "xy") {
                return sortColElements(component.querySelectorAll(`[data-tab-x="${element.dataset.tabX}"]`));
            } else {
                return sortColElements(component.querySelectorAll(`[data-tab-y]`));
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
                    if (element.tagName === "INPUT" && element.type === "radio") {
                        element.click();
                    } else {
                        element.focus();
                    }
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

        function setMissingTabs() {
            component.querySelectorAll('[data-tab-x], [data-tab-y]').forEach(e => {
                if (!e.dataset.tabX) {
                    e.dataset.tabX = "1";
                }
                if (!e.dataset.tabY) {
                    e.dataset.tabY = "1";
                }
            });
        }

        function setType() {
            if (component.querySelector("[data-tab-x][data-tab-y]")) {
                type = "xy";
                setMissingTabs();
            } else if (component.querySelector("[data-tab-x]")) {
                type = "x";
            } else if (component.querySelector("[data-tab-y]")) {
                type = "y";
            } else {
                type = null;
            }
        }

        function setTabIndex() {
            if (type != null) {
                component.querySelectorAll('[data-tab-x], [data-tab-y]').forEach(e => e.tabIndex = -1);
                component.querySelector('[data-tab-x], [data-tab-y]').tabIndex = 0;
            }
        }

        function wire() {
            component.querySelectorAll("[data-tab-x],[data-tab-y]").forEach(e => e.addEventListener('keydown', function (event) {
                if (keys.has(event.key)) {
                    keys.get(event.key)(event.target);
                    event.preventDefault();
                }
            }));
            component.querySelectorAll("[data-tab-x],[data-tab-y]").forEach(e => e.addEventListener('click', function (event) {
                const target = event.target;
                if (target.dataset.tabX || target.dataset.tabY) {
                    component.querySelectorAll("[data-tab-x],[data-tab-y]").forEach(el => el.tabIndex = -1);
                    event.target.tabIndex = 0;
                    event.target.focus();
                }
            }));
        }

        setType();
        setTabIndex();
        wire();
    }

    function wire() {
        document.querySelectorAll(".tab-component").forEach(c => {
            TabComponent(c);
        });
    }

    wire();
})();
