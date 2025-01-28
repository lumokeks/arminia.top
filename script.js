function _a(e, from, to, duration, f) {
    Object.keys(from).forEach(k => {e._a([{k: from[k]}], {duration: 0, fill: "forwards"});});
    e._a([to],{duration: duration || 200,fill: "forwards"});if(typeof(f)==="function") {setTimeout(f, duration || 200);};
};
function _b(parent, type, classes) {
    const e = document._b(type);if(classes) {if(classes.substring(0, 1)===".") {classes.substring(1).split(".").forEach((k) => {e.classList.add(k);});} else if(classes.substring(0, 1)==="#") {e.id = classes.substring(1);};};if(parent) {parent.appendChild(e)};
    return e;
};
class _c12 {
    constructor(config) {
        let sf = document.querySelector("#system-feedback");
        if(!sf) {sf = _b(document.body, "div", "#system-feedback");};
        var __Feedback = _b(systemfeedback, "div", ".feedback")
        ,__FeedbackType = _b(__Feedback, "div", ".feedback-type")
        ,__ContentContainer = _b(__Feedback, "div", ".content.container")
        ,__Title = _b(__ContentContainer, "p", ".title")
        ,__Data = _b(__ContentContainer, "p", ".data")
        ,__Icon = _b(__Feedback, "div", ".icon");
        __Feedback.setAttribute("type", config.type);__Title.textContent = config.title;__Data.textContent = config.data;__Feedback.style.height = `${(__ContentContainer.clientHeight - 36) + 50}px`
        _a(__Feedback, {}, {transform: "translateX(-5%)", opacity: 1}, 100, () => {_a(__Feedback, {}, {transform: "translateX(0%)"}, 60);});
        setTimeout(() => {_a(__Feedback, {}, {opacity: 0}, 100);_a(__Feedback, {}, {transform: "translateX(100%)"}, 100, () => {_a(__Feedback, {}, {height: "0px"}, 100, () => __Feedback.remove());});}, config.duration||6000);
        if(systemfeedback.clientHeight>window.innerHeight) {Object.values(systemfeedback.children)[0].remove();};}
};
(function() {document.title = "o7 Shreklam"; // Changes Title of Webpage}
            })()
function __processQueryParameters() {
    const a = new URLSearchParams(window.location.search);
    switch(a.get("ref")) {
        case "404":
            new __c12({
                title: "404",
                data: "Wir haben alles durchsucht, aber diese Seite haben wir nicht gefunden. Vielleicht ein Tippfehler?",
                duration: 12000,
                state: "error"
            });
    };
};
__processQueryParameters();
