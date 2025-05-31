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
class _c14fake {
    constructor() {
        this.svgs = {
            "cancel": "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
        };
        this.cached_images = {};
    }
    _f1(parent, id) {
        function a(self) {parent.appendChild(self.cached_images[id].cloneNode(true))};
        function b(self) {
            const __a = _b(undefined, "a");__a.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="${self.svgs[id]}"/></svg>`;
            self.cached_images[id] = __a.querySelector("svg");a(self);
        };
        this.cached_images[id] ? a(this) : b(this);
    }
}
_c14 = new _c14fake();
(function() {document.title = "o7 Shreklam";console.log(atob("ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4YiAgICAgICAgICBkOGIgICAgICAgICAgICAgIDg4OCAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWThQICAgICAgICAgIFk4UCAgICAgICAgICAgICAgODg4ICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4ODggICAgICAgICAgICAgICAgICAgICAKIDg4ODhiLiAgODg4ZDg4OCA4ODg4OGIuZDg4Yi4gIDg4OCA4ODg4OGIuICA4ODggIDg4ODhiLiAgICAgIDg4ODg4OCAuZDg4Yi4gIDg4ODg4Yi4gIAogICAgIjg4YiA4ODhQIiAgIDg4OCAiODg4ICI4OGIgODg4IDg4OCAiODhiIDg4OCAgICAgIjg4YiAgICAgODg4ICAgZDg4IiI4OGIgODg4ICI4OGIgCi5kODg4ODg4IDg4OCAgICAgODg4ICA4ODggIDg4OCA4ODggODg4ICA4ODggODg4IC5kODg4ODg4ICAgICA4ODggICA4ODggIDg4OCA4ODggIDg4OCAKODg4ICA4ODggODg4ICAgICA4ODggIDg4OCAgODg4IDg4OCA4ODggIDg4OCA4ODggODg4ICA4ODggZDhiIFk4OGIuIFk4OC4uODhQIDg4OCBkODhQIAoiWTg4ODg4OCA4ODggICAgIDg4OCAgODg4ICA4ODggODg4IDg4OCAgODg4IDg4OCAiWTg4ODg4OCBZOFAgICJZODg4ICJZODhQIiAgODg4ODhQIiAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4ODggICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4OCAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODg4ICAgIA=="));})()
function _c13(config) {
    var _ = (e, b) => {b.substring(1).split(".").forEach(e2 => e.classList.add(e2));};
    var __d11 = _b(document.querySelector(".popup-insert"), "div", ".popup--container")
    ,__d12 = _b(__d11, "div", ".shadow--default.absolute.w-100.h-100")
    ,__d13 = _b(__d11, "div", ".absolute.page-center.c-primary.popup--main.flex.column")
    ,__e1 = _b(__d13, "header", ".flex")
    ,__f1 = _b(__e1, "div", ".popup--main-title.c-primary.font-bold")
    ,__f2 = _b(__e1, "button", ".close-interaction-svg--container.no-background.no-border.flex.x-center.y-center")
    ,__e2 = _b(__d13, "main", ".content.container.flex.column")
    ,__f3 = _b(__e2, "p");
    _(__e1, ".no-padbottom");_(__e2, ".no-padtop");
    _c14._f1(__f2, "cancel");
    __f1.textContent = config.title;
    __f2.addEventListener("mousedown", () => _a(__f2, {}, {transform: "translateY(1px)"}, 60));
    function t11() {_a(__f2, {}, {transform: "translateY(0px)"}, 60);};
    __f2.addEventListener("mouseup", t11);__f2.addEventListener("mouseleave", t11);
    __f2.addEventListener("click", () => {a.hide();});
    const a = {"a_a": 0.14, "a_b": 0.12};
    function __a(arga, argb, argc) {arga.style.transition += `${argb} linear ${a[argc]}s`};
    __a(__d13, "transform", "a_a");__a(__d11, "opacity", "a_b");
    a.show = () => {
        setTimeout(() => {
            __d11.style.opacity = `1`;
            __d13.style.transform = `translate(-50%, -50%) scale(1)`;
        }, 20);
    };
    a.hide = () => {
        __d13.style.transform = `translate(-50%, -50%) scale(0.8)`;setTimeout(() => {__d11.style.opacity = 0;setTimeout(() => __d11.remove(), a["a_b"]*1000);}, a["a_b"]*500);
    };
    __f3.innerHTML = config.data;
    return a;
};
// setTimeout(() => _c13({title: "W.I.P", data: "This website is a work-in-progress and as of right now, only consists of this homepage."}).show(), 2000);
setTimeout(() => _c13({title: "W.I.P", data: `<a href=\"/index2.html\">Try our newest Sudoku Solver.<svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg></a>`}).show(), 2000);
function __processQueryParameters() {
    switch(new URLSearchParams(window.location.search).get("ref")) {
        case "404":
            new _c12({
                title: "404",
                data: "Site could not be fetched. Did you misspell something?",
                duration: 12000,
                state: "error"
            });
    };
};
__processQueryParameters();
