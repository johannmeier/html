(() => {
    function TabComponent(element) {
        let currentFocus = 1;

        function focus(x) {
            const currentElement = document.querySelector(`[data-tab-x='${x}']`);
            if (currentElement) {
                setTimeout(() => {
                    currentElement.focus();
                }, 0);
                return true;
            } else {
                return false;
            }
        }

        function wire() {
            element.addEventListener('keydown', function (event) {
                if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                    if (currentFocus > 0) {
                        if (focus(currentFocus - 1)) {
                            currentFocus--;
                        }
                    }
                    event.preventDefault();
                }
                if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                    if (focus(currentFocus + 1)) {
                        currentFocus++;
                    }
                    event.preventDefault();
                }
            });

            element.addEventListener('focus', function (event) {
                if (!event.relatedTarget.dataset.tabX) {
                    element.tabIndex = -1;
                    focus(currentFocus);
                }
            });

            element.addEventListener('blur', function (event) {
                if (event.relatedTarget.dataset.tabX) {
                    element.tabIndex = 0;
                }
            });
        }

        wire();
    }

    function wire() {
        document.querySelectorAll(".tab-component").forEach(c => {
            new TabComponent(c);
        });
    }

    wire();
})();
