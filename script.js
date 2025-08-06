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
        let sf = document.querySelector("#system-feedback--item-container");
        if(!sf) {sf = _b(document.body, "div", "#system-feedback--item-container");};
        var __d11 = _b(sf, "div", ".s-feedback--container.popup-bg.border.bg-300")
        ,__d12 = _b(__d11, "div", ".type")
        ,__d13 = _b(__d11, "div", ".content.container")
        ,__e1 = _b(__d13, "p", ".title.font-bold.text-colour-white-100")
        ,__e2 = _b(__d13, "p", ".data.font-normal.text-colour-white-200");
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
    }
    _f1(parent, id) {
        const __a = _b(undefined, "a");__a.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="${this.svgs[id]}"/></svg>`;
        if(parent) parent.appendChild(__a.querySelector("svg"));
    }
}
_c14 = new _c14fake();
(function() {document.title = "o7 Shreklam";console.log(atob("ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4YiAgICAgICAgICBkOGIgICAgICAgICAgICAgIDg4OCAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWThQICAgICAgICAgIFk4UCAgICAgICAgICAgICAgODg4ICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4ODggICAgICAgICAgICAgICAgICAgICAKIDg4ODhiLiAgODg4ZDg4OCA4ODg4OGIuZDg4Yi4gIDg4OCA4ODg4OGIuICA4ODggIDg4ODhiLiAgICAgIDg4ODg4OCAuZDg4Yi4gIDg4ODg4Yi4gIAogICAgIjg4YiA4ODhQIiAgIDg4OCAiODg4ICI4OGIgODg4IDg4OCAiODhiIDg4OCAgICAgIjg4YiAgICAgODg4ICAgZDg4IiI4OGIgODg4ICI4OGIgCi5kODg4ODg4IDg4OCAgICAgODg4ICA4ODggIDg4OCA4ODggODg4ICA4ODggODg4IC5kODg4ODg4ICAgICA4ODggICA4ODggIDg4OCA4ODggIDg4OCAKODg4ICA4ODggODg4ICAgICA4ODggIDg4OCAgODg4IDg4OCA4ODggIDg4OCA4ODggODg4ICA4ODggZDhiIFk4OGIuIFk4OC4uODhQIDg4OCBkODhQIAoiWTg4ODg4OCA4ODggICAgIDg4OCAgODg4ICA4ODggODg4IDg4OCAgODg4IDg4OCAiWTg4ODg4OCBZOFAgICJZODg4ICJZODhQIiAgODg4ODhQIiAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4ODggICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4OCAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODg4ICAgIA=="));
    const canvas = document.querySelector("canvas"), ctx = canvas.getContext("2d");let dots = [];
    function resize() {canvas.width = window.innerWidth;canvas.height = window.innerHeight;dots = [];create_dots();};resize();window.addEventListener("resize", resize);create_dots();
    function create_dots() {for(let i = 0; i < (canvas.clientWidth>500&&60||10); i++) dots.push({x: Math.random() * canvas.clientWidth, y: Math.random() * canvas.clientHeight, vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5, r: 2});};
    function draw_dots() {
        ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        dots.forEach(e => {
            ctx.beginPath();ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);ctx.fillStyle = "white";ctx.closePath();ctx.fill();
            e.x += e.vx;e.y += e.vy;if(e.x>canvas.clientWidth||e.x<0) e.vx *= -1;if(e.y>canvas.clientHeight||e.y<0) e.vy *= -1;
            for(const e2 of dots) {if(e2.x===e.x&&e2.y===e2.y) continue;
                let dx = e2.x - e.x, dy = e2.y - e.y, a = Math.sqrt(dx * dx + dy * dy);
                if(a<160) {ctx.beginPath();ctx.moveTo(e.x, e.y);ctx.lineTo(e2.x, e2.y);ctx.strokeStyle = "#ffffff0c";ctx.closePath();ctx.stroke();};};});};
    function animate() {draw_dots();requestAnimationFrame(animate);};animate();
})()
function _c13(config) {
    var _ = (e, b) => {b.substring(1).split(".").forEach(e2 => e.classList.add(e2));};
    var __d11 = _b(document.querySelector(".popup-insert"), "div", ".popup--container")
    ,__d12 = _b(__d11, "div", ".shadow--default.absolute.w-100.h-100")
    ,__d13 = _b(__d11, "div", ".absolute.page-center.popup--main.flex.column.bg-200")
    ,__e1 = _b(__d13, "header", ".flex")
    ,__f1 = _b(__e1, "div", ".popup--main-title.text-colour-white-100.font-bold")
    ,__f2 = _b(__e1, "button", ".close-interaction-svg--container.no-background.no-border.flex.x-center.y-center")
    ,__e2 = _b(__d13, "main", ".content.container.flex.column")
    ,__f3 = _b(__e2, "p", ".text-colour-white-200");
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
setTimeout(() => _c13({title: "W.I.P", data: "This website is a work-in-progress and as of right now, only consists of this homepage."}).show(), 2000);
function __processQueryParameters() {
    switch(new URLSearchParams(window.location.search).get("ref")) {
        case "404":
            new _c12({
                title: "404",
                data: "The requested resource could not be found",
                duration: 12000,
                state: "error"
            });
    };
};

__processQueryParameters();


