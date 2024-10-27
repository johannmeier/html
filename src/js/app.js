function App() {

    function wire() {
        addEventListener("form", "submit", function (evnt) {
            const form = evnt.target;
            loadDoc(form.action, form.method);
            evnt.preventDefault();
        });

        addEventListener("a", "click", function(evnt) {
            const a = evnt.target;
            loadDoc(a.href, "get");
            evnt.preventDefault();
        });
    }

    function wireContent() {
        addEventListener("#content form", "submit", function (evnt) {
            const form = evnt.target;
            const formData = new FormData(form);
            loadDoc(form.action, form.method, formData);
            evnt.preventDefault();
        });

        addEventListener("#content a", "click", function(evnt) {
            const a = evnt.target;
            loadDoc(a.href, "get");
            evnt.preventDefault();
        });
    }

    function addEventListener(query, event, method) {
        const elements = document.querySelectorAll(query);
        for (let i = 0; i < elements.length; i++) {
            elements[i].addEventListener(event, method);
        }
    }

    function loadDoc(doc, method, formData) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            document.getElementById("content").innerHTML = this.responseText;
            wireContent();
        }

        let queryString = "?" + new URLSearchParams(formData).toString();

        if ('post' === method) {
            xhttp.open(method, doc, true);
            xhttp.send(formData);
        } else {
            if ('?' === queryString) {
                xhttp.open(method, doc, true);
            } else {
                xhttp.open(method, doc + queryString, true);
            }
            xhttp.send();
        }
    }

    wire();
}