function _a(e, from, to, duration, f) {
    Object.keys(from).forEach(k => {e.animate([{k: from[k]}], {duration: 0, fill: "forwards"});});
    e.animate([to],{duration: duration || 200,fill: "forwards"});if(typeof(f)==="function") {setTimeout(f, duration || 200);};
};
function _b(parent, type, classes) {
    const e = document.createElement(type);if(classes) {if(classes.substring(0, 1)===".") {classes.substring(1).split(".").forEach((k) => {e.classList.add(k);});} else if(classes.substring(0, 1)==="#") {e.id = classes.substring(1);};};if(parent) {parent.appendChild(e)};
    return e;
};
class _c12 {
    constructor(config) {
        let sf = document.querySelector("#system-feedback.content.container");
        if(!sf) {sf = _b(document.body, "div", "#system-feedback--item-container");};
        var __d11 = _b(sf, "div", ".s-feedback--container")
        ,__d12 = _b(__d11, "div", ".type")
        ,__d13 = _b(__d11, "div", ".content.container")
        ,__e1 = _b(__d13, "p", ".title.font-bold.c-white")
        ,__e2 = _b(__d13, "p", ".data.font-normal.c-shade");__d11.classList.add("popup-bg");__d11.classList.add("border");
        __d11.setAttribute("type", config.type);__e1.textContent = config.title;__e2.textContent = config.data;__d11.style.height = `${(__d13.clientHeight - 36) + 50}px`
        _a(__d11, {}, {transform: "translateX(-5%)", opacity: 1}, 100, () => {_a(__d11, {}, {transform: "translateX(0%)"}, 60);});
        setTimeout(() => {_a(__d11, {}, {opacity: 0}, 100);_a(__d11, {}, {transform: "translateX(100%)"}, 100, () => {_a(__d11, {}, {height: "0px"}, 100, () => __d11.remove());});}, config.duration||6000);
        if(sf.clientHeight>window.innerHeight) {Object.values(sf.children)[0].remove();};}
};
(function() {document.title = "o7 Shreklam"; // Changes Title of Webpage
            })()
function __processQueryParameters() {
    switch(new URLSearchParams(window.location.search).get("ref")) {
        case "404":
            new _c12({
                title: "404",
                data: "Diese Seite wurde nicht gefunden. Vielleicht ein Tippfehler?",
                duration: 12000,
                state: "error"
            });
    };
};
__processQueryParameters();
