(() => {
    let shortcut = 'aa';
    let global = true;
    const addEventListenerElements = [];
    let keys = "";

    function isHidden(el) {
        return (el.offsetParent === null) && !el.checkVisibility();
    }

    function isBehindOtherElement(element) {
        const boundingRect = element.getBoundingClientRect()

        // adjust coordinates to get more accurate results
        const left = boundingRect.left + 1
        const right = boundingRect.right - 1
        const top = boundingRect.top + 1
        const bottom = boundingRect.bottom - 1


        let visible = false;

        if (element.contains(document.elementFromPoint(left, top))) {
            visible = true;
        }
        if (element.contains(document.elementFromPoint(right, top))) {
            visible = true;
        }
        if (element.contains(document.elementFromPoint(left, bottom))) {
            visible = true;
        }
        if (element.contains(document.elementFromPoint(right, bottom))) {
            visible = true;
        }

        return !visible
    }

    function incrementShortcut() {
        shortcut = getNextStringId(shortcut);
    }

    function getNextStringId(str) {
        let index = str.length - 1;
        let baseCode;
        do {
            baseCode = str.charCodeAt(index);
            const strArr = str.split("");
            if (strArr[index] === "z") {
                strArr[index] = "a";
                if (index === 0) {
                    strArr.unshift("a");
                }
            } else {
                strArr[index] = String.fromCharCode(baseCode + 1);
            }
            str = strArr.join("");
            index--;
        } while (baseCode === "z".charCodeAt(0))
        return str;
    }

    function getPageOffset(elem) {
        let topOffset = elem.getBoundingClientRect().top;

        while (elem !== document.documentElement) {
            elem = elem.parentElement;
            topOffset += elem.scrollTop;
        }
        return topOffset;
    }

    function getBoundingElement(element) {
        const boundingRect = element.getBoundingClientRect()
        if (element.tagName === 'A' && boundingRect.width === 0 && boundingRect.height === 0) {
            const childImage = element.querySelector("img");
            if (childImage) {
                return childImage;
            }
        }
        return element;
    }

    function addShortcut(element) {
        element = getBoundingElement(element);
        if (!isHidden(element) && !isBehindOtherElement(element)) {
            const rect = element.getBoundingClientRect();
            const border = `border-width:1px;border-style:solid`;
            const top = getPageOffset(element);
            const height = rect.bottom - rect.top;
            const leftRight = `left:${rect.left + 3 + "px"};top:${top + height - 3 + "px"}`;
            document.body.insertAdjacentHTML("afterend", `
                     <div class='shortcut' title="${element.nodeName}.${element.innerText}"
                     style='position:absolute;display:flow;${leftRight};${border};background-color:aquamarine;font-size: small;font-family: "Courier", "sans-serif"'
                     >${shortcut.toUpperCase()}</div>
            `)

            element.dataset['shortcut'] = shortcut;
            incrementShortcut();
        }
    }

    function removeShortCuts() {
        document.querySelectorAll(".shortcut").forEach(e => e.remove())
        document.querySelectorAll("[data-shortcut]").forEach(e => e.removeAttribute("data-shortcut"));
    }

    function isEditable(target) {
        return target.tagName === 'INPUT' && (target.type !== 'radio' && target.type !== 'checkbox' && target.type !== 'button')
            || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';
    }

    function vimium(event) {
        const target = event.target;
        const key = event.key;
        if (global) {
            if (key === 'Escape') {
                document.activeElement.blur();
            }
            if (!isEditable(target)) {
                if (key === 'r' && !event.ctrlKey && !event.altKey) {
                    window.location.reload();
                }
                if (key === 'f' && !event.ctrlKey && !event.altKey) {
                    global = false;
                    const allSet = new Set();
                    addEventListenerElements.forEach(e => allSet.add(e))
                    document.querySelectorAll("button, input, select, textarea, a[href], [onclick]").forEach(e => allSet.add(e))

                    allSet.forEach(e => {
                        try {
                            if (e !== document) {
                                addShortcut(e);
                            }
                        } catch (error) {
                            console.log(e);
                        }
                    })
                }
            }
        } else {
            if (key === 'Escape') {
                keys = '';
                shortcut = 'aa';
                global = true;
                removeShortCuts();
                return;
            }
            if ('abcdefghijklmnopqrstuvwxyz'.indexOf(key) === -1) {
                return;
            }
            keys += key;
            const element = document.querySelector(`[data-shortcut='${keys}']`);
            if (element) {
                event.preventDefault();
                global = true;
                shortcut = 'aa';
                removeShortCuts();
                setTimeout(() => {
                    element.focus();
                    if (!isEditable(element)) {
                        element.click();
                    }
                }, 1)
                keys = '';
            }
        }
    }

    function wire() {
        EventTarget.prototype.realAddEventListener = EventTarget.prototype.addEventListener;

        EventTarget.prototype.addEventListener = function (a, b, c) {
            this.realAddEventListener(a, b, c);
            if (a === 'click') {
                addEventListenerElements.push(this);
            }
        };
    }

    if (!window.vimum) {
        window.addEventListener("keydown", vimium)
        wire();
        window.vimum = true;
    }
})()
