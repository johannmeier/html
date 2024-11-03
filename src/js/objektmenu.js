(() => {
    const MENU_ID = "objektmenu";
    function wire() {
        document.addEventListener('click', (event) => {
            const menu = document.getElementById(MENU_ID);
            if (!menu.contains(event.target) && !event.target.classList.contains("menu-button")) {
                menu.close();
            }
        });

        document.querySelectorAll("form[data-action]").forEach(form => {
            form.addEventListener("submit", (event) => {
                const button = event.submitter;
                const form = button.form;
                form.sys_requestname.value = button.dataset.requestname;
            });
        });

        document.querySelectorAll("button.menu-button").forEach(button => {
            button.addEventListener("click", (event) => {
                const button = event.target;
                const rect = button.getBoundingClientRect();
                const menu = document.getElementById(MENU_ID);
                menu.style.left = rect.left + "px";
                menu.style.top = rect.top + rect.height + "px";
                openMenu(menu, button.dataset.objname, button.dataset.objart, button.dataset.status);
            })
        });

        document.getElementById(MENU_ID).addEventListener("click", (event) => {
            const rect = event.target.getBoundingClientRect();
            if (rect.left > event.clientX ||
                rect.right < event.clientX ||
                rect.top > event.clientY ||
                rect.bottom < event.clientY
            ) {
                if (event.target.tagName === "DIALOG") {
                    event.target.close();
                }
            }
        });
    }

    function enableDisableItems(menu, objname, objart, status) {
        if (status === "E") {
            disableMenuItem(menu.querySelector("[data-requestname='freigeben']"));
        }
    }

    function openMenu(menu, objname, objart, status) {
        document.querySelectorAll("form[data-action]").forEach(form => {
            form.objname.value = objname;
            form.objart.value = objart;
        })

        enableDisableItems(menu, objname, objart, status);
        menu.querySelector("#menu-header").innerText = objname + "." + objart;
        menu.show();
    }

    function disableMenuItem(item) {
        if ("BUTTON" === item.tagName) {
            item.disabled = true;
        } else {
            item.childNodes.forEach(node => disableMenuItem(node));
        }
    }

    function enableMenuItem(item) {
        if ("BUTTON" === item.tagName) {
            item.disabled = false;
        } else {
            item.childNodes.forEach(node => enableMenuItem(node));
        }
    }

    wire();
})();
