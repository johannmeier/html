/**
 - add keydown listener if element has a click listener and no keydown or keypress listener
 - two modes
 - cursor movement (class 'tab-component'):
 use cursor keys to move between tabbable elements
 - tab trap (class 'tab-component1') for dialogs:
 use cursor keys and tab key to move between tabbable elements
 -
 */
(() => {
    function TabComponent(component, onlyCursors) {
        const allTabElements = "button:not([type='button']),a[href],input[type='checkbox'],input[type='radio'],input[type='submit'],input[type='image'],[onclick],[data-tab-click]";
        let type;

        const keys = new Map();
        keys.set('ArrowUp', arrowUp);
        keys.set('ArrowLeft', arrowLeft);
        keys.set('ArrowDown', arrowDown);
        keys.set('ArrowRight', arrowRight);

        function getAllTabElements(element) {
            return element.querySelectorAll(allTabElements);
        }

        function isHidden(element) {
            return (element.offsetParent === null) || !element.checkVisibility();
        }

        function isDisabled(element) {
            return element.disabled || element.enabled === false;
        }

        function getNextTabElement(currentElement, elements) {
            for (let i = 0; i < elements.length - 1; i++) {
                const element = elements[i];
                if (element === currentElement) {
                    const nextElement = elements[i + 1];
                    if (isHidden(nextElement) || isDisabled(nextElement)) {
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
                    if (isHidden(previousElement) || isDisabled(previousElement)) {
                        return getPreviousTabElement(previousElement, elements);
                    } else {
                        return previousElement;
                    }
                }
            }
            return null;
        }

        function sortColElements(colElements) {
            return Array.from(colElements).sort((a, b) => {
                const aY = parseInt(a.dataset.tabY);
                const bY = parseInt(b.dataset.tabY);
                return aY - bY;
            })
        }

        function sortRowElements(rowElements) {
            return Array.from(rowElements).sort((a, b) => {
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
                if (!onlyCursors) {
                    component.querySelectorAll("[data-tab-x],[data-tab-y]").forEach(e => e.tabIndex = -1);
                }
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
            if (type === "x") {
                focus(getNextLeftTabElement(element));
            } else {
                focus(getNextUpperTabElement(element));
            }
        }

        function arrowLeft(element) {
            if (type === "y") {
                focus(getNextUpperTabElement(element));
            } else {
                focus(getNextLeftTabElement(element));
            }
        }

        function arrowDown(element) {
            if (type === "x") {
                focus(getNextRightTabElement(element));
            } else {
                focus(getNextLowerTabElement(element));
            }
        }

        function arrowRight(element) {
            if (type === "y") {
                focus(getNextLowerTabElement(element));
            } else {
                focus(getNextRightTabElement(element));
            }
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

        function isTabbable(element) {
            return element.onclick || element.dataset.tabClick || element.tabIndex === 0;
        }

        function hasClickListener(element) {
            return element.onclick || element.dataset.tabClick;
        }

        function checkClick(element) {
            if (hasClickListener(element) && !(element.onkeydown || element.onkeypress) && element.tagName !== 'BUTTON') {
                element.onkeydown = event => {
                    if (event.key === "Enter") {
                        element.click();
                        event.preventDefault();
                    }
                }
            }
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
                if (component.tagName === "TABLE") {
                    type = "xy";
                    const rows = component.querySelectorAll("tr");
                    for (let y = 0; y < rows.length; y++) {
                        const cols = rows[y].querySelectorAll("th,td");
                        for (let x = 0; x < cols.length; x++) {
                            const cell = cols[x];
                            if (isTabbable(cell)) {
                                cell.dataset.tabY = String(y + 1);
                                cell.dataset.tabX = String(x + 1);
                                checkClick(cell);
                            }
                            getAllTabElements(cell).forEach(e => {
                                e.dataset.tabY = String(y + 1);
                                e.dataset.tabX = String(x + 1);
                                checkClick(e);
                            })
                        }
                    }
                } else {
                    type = "y";
                    const elements = getAllTabElements(component);
                    for (let i = 0; i < elements.length; i++) {
                        checkClick(elements[i]);
                        elements[i].dataset.tabY = String(i + 1);
                    }
                }
            }
        }

        function setTabIndex() {
            if (type != null) {
                if (onlyCursors) {
                    getAllTabElements(component).forEach(tab => tab.tabIndex = 0)
                } else {
                    component.querySelectorAll('[data-tab-x], [data-tab-y]').forEach(e => e.tabIndex = -1);
                    for (const e of component.querySelectorAll('[data-tab-x], [data-tab-y]')) {
                        if (!isDisabled(e) && !isHidden(e)) {
                            e.tabIndex = 0;
                            break;
                        }
                    }
                }
            }
        }

        function wire() {
            component.addEventListener('keydown', function (event) {
                if (event.altKey || event.ctrlKey) {
                    return;
                }

                if (event.key === "Tab" && onlyCursors) {
                    const tabElements = [];
                    component.querySelectorAll("[data-tab-y], [data-tab-x]").forEach(e => {
                        if (!isHidden(e) && !isDisabled(e)) {
                            tabElements.push(e);
                        }
                    });

                    if (event.shiftKey) {
                        if (event.target === tabElements[0]) {
                            event.preventDefault()
                            tabElements[tabElements.length - 1].focus();
                        }
                    } else {
                        if (event.target === tabElements[tabElements.length - 1]) {
                            event.preventDefault()
                            tabElements[0].focus();
                        }
                    }
                }

                if (keys.has(event.key)) {
                    keys.get(event.key)(event.target);
                    event.preventDefault();
                }
            });

            component.querySelectorAll("[data-tab-x],[data-tab-y]").forEach(el =>
                el.addEventListener('click', function (event) {
                    if (!onlyCursors) {
                        component.querySelectorAll("[data-tab-x],[data-tab-y]").forEach(e => e.tabIndex = -1);
                        event.target.tabIndex = 0;
                    }
                }));
        }

        setType();
        setTabIndex();
        wire();
    }

    function wireComponents() {
        document.querySelectorAll(".tab-component").forEach(c => {
            TabComponent(c, false);
        });
        document.querySelectorAll(".tab-component1").forEach(c => {
            TabComponent(c, true);
        });
    }

    function wireListener() {
        EventTarget.prototype.tabComponentAddEventListener = EventTarget.prototype.addEventListener;

        EventTarget.prototype.addEventListener = function (eventName, listener, options) {
            this.tabComponentAddEventListener(eventName, listener, options);
            if (eventName === 'click' && 'dataset' in this) {
                this['dataset'].tabClick = "true";
            }
        };
    }

    if (!window.tabComponent) {
        window.addEventListener("load", () => {
            wireComponents();
        })

        wireListener();
        window.tabComponent = true;
    }
})();
