let __MODE = "game", __PAUSED = false, __inputfocused = false;
function CreateElement(parent, type, classes) { const element = document.createElement(type);if(classes) {
        if(classes.substring(0, 1)===".") {classes.substring(1).split(".").forEach((k) => {element.classList.add(k);});}
        else if(classes.substring(0, 1)==="#") {element.id = classes.substring(1);};
    };if(parent) {parent.appendChild(element)};return element; };
function Animate(element, from, to, duration, f) {  Object.keys(from).forEach(k => { // Animates Element from start Properties to end Properties
        element.animate([{k: from[k]}], {duration: 0, fill: "forwards"});
    });element.animate([to],{duration: duration || 200,fill: "forwards"});if(typeof(f)==="function") {setTimeout(f, duration || 200);};   };
function CSSVar(data) {    const style = getComputedStyle(document.body);return style.getPropertyValue(data);   }; // Gets CSS Variables
class _c14fake {
    constructor() {
        this.svgs = {
            "cancel": "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
        };
        this.cached_images = {};
    }
    _f1(parent, id) {
        let _a = Animate, _b = CreateElement;
        function a(self) {parent.appendChild(self.cached_images[id].cloneNode(true))};
        function b(self) {
            const __a = _b(undefined, "a");__a.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="${self.svgs[id]}"/></svg>`;
            self.cached_images[id] = __a.querySelector("svg");a(self);
        };
        this.cached_images[id] ? a(this) : b(this);
    }
}
_c14 = new _c14fake();
function _c13(config) {
    let _a = Animate, _b = CreateElement;
    var _ = (e, b) => {b.substring(1).split(".").forEach(e2 => e.classList.add(e2));};
    var __d11 = _b(document.querySelector(".popup-insert"), "div", ".popup--container.custom-transition")
    ,__d12 = _b(__d11, "div", ".shadow--default.absolute.w-100.h-100")
    ,__d13 = _b(__d11, "div", ".absolute.page-center.popup--main.flex.column.custom-transition")
    ,__e1 = _b(__d13, "header", ".flex")
    ,__f1 = _b(__e1, "div", ".popup--main-title.font-bold")
    ,__f2 = _b(__e1, "button", ".close-interaction-svg--container.no-background.no-border.flex.x-center.y-center.custom-transition")
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
class _c12 {
    constructor(config) {
        let _a = Animate, _b = CreateElement;
        let sf = document.querySelector("#system-feedback--item-container");
        if(!sf) {sf = _b(document.body, "div", "#system-feedback--item-container");};
        var __d11 = _b(sf, "div", ".s-feedback--container")
        ,__d12 = _b(__d11, "div", ".type")
        ,__d13 = _b(__d11, "div", ".content.container")
        ,__e1 = _b(__d13, "p", ".title.font-bold")
        ,__e2 = _b(__d13, "p", ".data.font-normal");__d11.classList.add("popup-bg");__d11.classList.add("border");
        __d11.setAttribute("type", config.type);__e1.textContent = config.title;__e2.textContent = config.data;__d11.style.height = `${(__d13.clientHeight - 36) + 50}px`
        _a(__d11, {}, {transform: "translateX(-5%)", opacity: 1}, 100, () => {_a(__d11, {}, {transform: "translateX(0%)"}, 60);});
        this.close = () => {_a(__d11, {}, {opacity: 0}, 100);_a(__d11, {}, {transform: "translateX(100%)"}, 100, () => {_a(__d11, {}, {height: "0px"}, 100, () => __d11.remove());});};
        if(config.duration) setTimeout(() => this.close(), config.duration);
        if(sf.clientHeight>window.innerHeight) {Object.values(sf.children)[0].remove();};};
};
_c13({title: "[ Sudoku Solver | Welcome ]", data: "> please note that this version is not optimized for mobile devices, <i>fixing it soon!</i><br>> mode to play sudokus coming soon<br>> click the (?) button to get help<br><br>have fun!"}).show();
class Sudoku {
    constructor(board) {
        this.board = JSON.parse(JSON.stringify(board))||[];
        function __f(a2, b2) {if(a2===true) {return {r: Math.floor(b2 / 9), c: b2 % 9};} else {return a2*9+b2};};
        this.is_valid = (self, i, n) => {let {r, c} = __f(true, i);for(let i2 = 0; i2 < 9; i2++) {let a = __f(r, i2), b = __f(i2, c);if(self.board[a]===n||self.board[b]===n) return {valid: false, ci: self.board[a]===n&&a||self.board[b]===n&&b};};
            let c1 = Math.floor(r / 3) * 3, c2 = Math.floor(c / 3) * 3;
            for(let r = c1; r < c1 + 3; r++) for(let c = c2; c < c2 + 3; c++) if(self.board[__f(r, c)]===n) return {valid: false, ci: __f(r, c)};return {valid: true};};
        this.allowed = (self, i) => {let t = [];for(let n = 1; n < 10; n++) if(this.is_valid(self, i, n).valid) if(this.u(self, i, n)) return [n]; else t.push(n);return t;};
        this.u = (self, i, n) => {let {r, c} = __f(true, i);let c1 = Math.floor(r / 3) * 3, c2 = Math.floor(c / 3) * 3;
            for(let r = c1; r < c1 + 3; r++) for(let c = c2; c < c2 + 3; c++) {let i2 = __f(r, c);if(i2!==i&&!self.board[i]&&this.is_valid(self, i2, n).valid) return false;};return true;};
        this.i = () => {
            let lr = 0, lc = 0, li = 9, m = 0
            for(let r = 0; r < 9; r += 3) for(let c = 0; c < 9; c += 3) {m = 9;
                for(let r2 = r; r2 < r + 3; r2++) for(let c2 = c; c2 < c + 3; c2++) if(this.board[__f(r2, c2)]) m--;
                if(m<=li&&m!==0) {li = m; lr = r; lc = c};
            };
            for(let r = lr; r < lr + 3; r++) for(let c = lc; c < lc + 3; c++) if(!this.board[__f(r, c)]) return __f(r, c);
            return 81;
        };
        this.s = () => {
            let i = this.i();
            if(i>80) {return true;};
            for(const c of this.allowed(this, i)) {this.board[i] = c;if(this.s()) return true;};this.board[i] = 0;return false;};
        this.tg = () => {
            let grid = [];for(let i = 0; i < 9; i++) grid.push([]);let t = this.solve();
            for(let i = 0; i < 81; i++) {let {r, c} = __f(true, i);grid[r][c] = board[i];};return grid;
        };
        this.grid_valid = () => {let t = JSON.parse(JSON.stringify(this.board));
            for(let i2 = 0; i2 < 81; i2++) {if(!t[i2]) continue;this.board[i2] = 0;let json = this.is_valid(this, i2, t[i2]);this.board[i2] = t[i2];if(!json.valid) return {valid: false, i1: json.ci, i2: i2};};
            return {valid: true};
        };
    };
    solve(to_grid) {if(this.s(0)) if(to_grid) return this.tg(); else return this.board; else return false;};
};
const grid = () => {return CreateElement(document.querySelector(".grid.outer.flex"), "div", ".grid.flex.column");};
const row = (a) => {return CreateElement(a, "div", ".row.flex");};
const col = (a) => {return CreateElement(CreateElement(a, "div", ".col.flex.x-center.y-center.custom-transition"), "span",".content.font-bold");};
window.onresize = () => {
    if(window.innerWidth<1044) document.querySelector(".tools.container").appendChild(document.querySelector(".group"));
    else document.querySelectorAll(".tools.container")[1].appendChild(document.querySelector(".group"))
};window.onresize();
function vis_grid(t, m, init, coll) {m = m||[]; init = init||[]; coll = coll||[];
    const __f = (a, b) => {if(a===true) return {r: Math.floor(b / 9), c: b % 9}; else return a*9+b};let _a = document.querySelectorAll(".col > span");
    if(!_a.length) {_a = [];for(let i = 0; i < 9; i++) {let a = grid();for(let i2 = 0; i2 < 3; i2++) {let b = row(a);for(let i3 = 0; i3 < 3; i3++) {
                let c = col(b);let i4 = Math.floor(i / 3) * 18 + (i2 * 9 + (i * 3 + i3));let {r2, c2} = __f(true, i4);
                c.parentElement.setAttribute("i", i4);c.parentElement.setAttribute("r", r2);c.parentElement.setAttribute("c", c2);_a.push(c);};};};};
    const ehas = (t, e2, a) => {return t.find(e => e===e2.getAttribute("i"));};
    _a.forEach(e => {let _e = e.parentElement;e.textContent = t[Number(_e.getAttribute("i"))];
        if(ehas(m, _e)) _e.classList.add("marked"); else _e.classList.remove("marked");
        if(ehas(init, _e)) _e.classList.add("init"); else _e.classList.remove("init");
    if(ehas(coll, _e)) _e.classList.add("colliding"); else _e.classList.remove("colliding");});
    let a = "";for(let i = 0; i < t.length; i++) {a += `${t[i]||"."}`;};document.querySelector(".map-input").value = a + ".".repeat(81 - a.length);
};
let t = [], i = 0, init = [];
vis_grid(t, ["0"]);
function __g(i2) {
    let m = [`${i2}`];
    const __f = (a, b) => {if(a===true) return {r: Math.floor(b / 9), c: b % 9}; else return a*9+b};
    for(let i3 = 0; i3 < 81; i3++) if(t[i3]) m.push(`${i3}`);
    return m;
};
function __h(e) {
    if(__PAUSED) return;
    const __f = (a, b) => {if(a===true) return {r: Math.floor(b / 9), c: b % 9}; else return a*9+b};
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    init = [];  
    if(nums.find(e2 => `${e2}`===e)||e==="0") {
        if(e!=="0") {t[i] = Number(e);};if(i<80) i++;
    } else if(e==="Backspace") {
        let f = false;
        if(t[i]) {t[i] = undefined; f = true;};
        i--;if(i<0) i = 0;
        if(!f) t[i] = undefined;
    } else if(e==="solve") {
        let r = new _c12({title: "(!)", data: "Solving Sudoku...", type: "warn"});
        for(let i = 0; i < t.length; i++) if(t[i]) init.push(`${i}`);
        setTimeout(() => {let s = new Sudoku(t), x1 = Date.now(), _error = (json) => {r.close();new _c12({title: "(X)", data: "Invalid grid given; could not solve.", duration: 4000, type: "error"});i = 0;vis_grid(t, [], [], [`${json.i1}`, `${json.i2}`]);}, valid = s.grid_valid();
        if(!valid.valid) {_error(valid);return;};
        t = s.solve(), valid = s.grid_valid();
        if(valid.valid) {
        r.close();new _c12({title: "(V)", data: `Successfully solved Sudoku! (~${Date.now() - x1} ms, 200ms latency)`, duration: 4000, type: "success"});i = -1;vis_grid(t, [`${i}`], init);} else _error(valid);}, 200);
    };
    __mi.textContent = t.join("");vis_grid(t, [`${i}`], init);
};
document.addEventListener("keyup", (e) => {
    if(!__inputfocused) __h(e.key);
});
document.querySelector(".nums.container").addEventListener("click", (e) => {
    if(!__PAUSED) {if(e.target.classList.contains("num")) __h(e.target.textContent);
        else if(e.target.textContent==="AC") {t = []; i = 0;__h();}
        else if(e.target.textContent==="=") {i = 80; __h("solve");}
        else if(e.target.nodeName==="BUTTON"||e.target.nodeName==="svg"||e.target.nodeName==="path") __h("Backspace");};
});
document.querySelector(".grid.outer").addEventListener("click", (e) => {
    if(!__PAUSED) {e = e.target;if(!e.classList.contains("col")) e = e.parentElement;
        if(e.classList.contains("col")) {
        i = Number(e.getAttribute("i"));vis_grid(t, [`${i}`], init);};};
});
let __mi = document.querySelector(".map-input");
__mi.addEventListener("focus", () => __inputfocused = true);__mi.addEventListener("blur", () => {
    __inputfocused = false;
    let map = __mi.value.substring(0, 81), _a = "0123456789.".split("");
    t = map.replaceAll(".", "0").split("");t.forEach((a, b) => {if(a==="0"||!_a.find(e => e===a)) t[b] = undefined;});__h();
});
(function() {
    let __timer = document.querySelector("span.content.timer"), __tw = document.querySelector(".timer--wrapper"), __ti = document.querySelector(".timer-state-icon"), _tims = 0, _tis = 0, _tim = 0, _tih = 0, _tisx = 0,
    __add = () => {if(__PAUSED) return;_tims++;if(_tims>9) {_tims = 0; _tis++;};if(_tis>59) {_tis = 0; _tim++};if(_tim>59) {_tim = 0; _tih++;};__timer.textContent = `${_tih&&String(_tih)+"h"||""} ${_tim&&String(_tim)+"m"||""} ${_tis&&String(_tis)+"s"||""}`;}, _i = setInterval(__add, 100);
    __tw.addEventListener("click", () => {__PAUSED = !__PAUSED; if(__PAUSED) {document.querySelectorAll(".col").forEach(e => {e.classList.add("hidden");});} else {document.querySelectorAll(".col").forEach(e => e.classList.remove("hidden"));vis_grid(t, [`${i}`], init);}; __ti.setAttribute("state", __PAUSED&&"paused"||"playing")});
    let themes = {
        light: atob("OnJvb3Qgey0taWNvbi1zaXplOiAxN3B4OyAgICAtLWdhcC1pbm5lcjogMXB4OyAgICAtLWdhcC1vdXRlcjogMnB4OyAgICAtLXNpdGUtaGVhZGVyLWNvbG9yOiBoc2woMCwgMCUsIDAlKTsgICAgLS1tYWRlYnktY29sb3I6IGhzbCgwLCAwJSwgMCUpOyAgICAtLXN0YXR1cy1lcnJvcjogI2EzMDAwMDsgICAgLS1zdGF0dXMtc3VjY2VzczogIzBkYTEwMDsgICAgLS1zdGF0dXMtd2FybjogI2RkODUwMDsgICAgLS1ib2R5LWJhY2tncm91bmQ6IGhzbCgwLCAwJSwgMTAwJSk7ICAgIC0tZ3JpZC1vdXRlci1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDE4JSk7ICAgIC0tZ3JpZC1pbm5lci1iYWNrZ3JvdW5kOiBoc2woMjM4LCAxMDAlLCA5MSUpOyAgICAtLWNvbC1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDEwMCUpOyAgICAtLWNvbC1jb2xvcjogaHNsKDAsIDAlLCAwJSk7ICAgIC0tY29sLWluaXQtYmFja2dyb3VuZDogaHNsKDAsIDAlLCA5NCUpOyAgICAtLWNvbC1pbml0LWNvbG9yOiBoc2woMCwgMCUsIDMyJSk7ICAgIC0tY29sLWhpZGRlbi1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDEwMCUpOyAgICAtLWNvbC1tYXJrZWQtYmFja2dyb3VuZDogaHNsKDIzNiwgMTAwJSwgODclKTsgICAgLS1jb2wtbWFya2VkLWNvbG9yOiBoc2woMCwgMCUsIDAlKTsgICAgLS10b29sLWJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyAgICAtLXRvb2wtYm9yZGVyOiBoc2woMCwgMCUsIDE4JSk7ICAgIC0tdG9vbC1ob3Zlci1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDk4JSk7ICAgIC0tdG9vbC1jb2xvcjogaHNsKDAsIDAlLCAxMyUpOyAgICAtLXRvb2wtc3ZnLWZpbGw6IGhzbCgwLCAwJSwgMTMlKTsgICAgLS1udW1wYWQtYnV0dG9uLWJhY2tncm91bmQ6IHRyYW5zcGFyZW50OyAgICAtLW51bXBhZC1idXR0b24tYm9yZGVyOiB2YXIoLS10b29sLWJvcmRlcik7ICAgIC0tbnVtcGFkLWJ1dHRvbi1jb2xvcjogaHNsKDAsIDAlLCAwJSk7ICAgIC0tbnVtcGFkLWJ1dHRvbi1ob3Zlci1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDk4JSk7ICAgIC0taW5wdXQtYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7ICAgIC0taW5wdXQtYm9yZGVyOiBoc2woMCwgMCUsIDAlKTsgICAgLS1pbnB1dC1jb2xvcjogaHNsKDAsIDAlLCAwJSk7ICAgIC0taGVhZGVyLWljb24tYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7ICAgIC0taGVhZGVyLWljb24tYm9yZGVyOiBoc2woMCwgMCUsIDI0JSk7ICAgIC0taGVhZGVyLWljb24taG92ZXItYmFja2dyb3VuZDogaHNsKDAsIDAlLCA5OCUpOyAgICAtLWhlYWRlci1zdmctZmlsbDogdmFyKC0tdG9vbC1zdmctZmlsbCk7ICAgIC0tcG9wdXBzbGlkZS1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDk4JSk7ICAgIC0tcG9wdXBzbGlkZS10aXRsZS1jb2xvcjogaHNsKDAsIDAlLCAwJSk7ICAgIC0tcG9wdXBzbGlkZS1kYXRhLWNvbG9yOiBoc2woMCwgMCUsIDAlKTsgICAgLS1zaGFkb3ctYmFja2dyb3VuZDogaHNsYSgwLCAwJSwgMCUsIDAuNzYpOyAgICAtLXBvcHVwLWJhY2tncm91bmQ6IGhzbCgwLCAwJSwgMTAwJSk7ICAgIC0tcG9wdXAtdGl0bGUtY29sb3I6IGhzbCgwLCAwJSwgMCUpOyAgICAtLXBvcHVwLWRhdGEtY29sb3I6IGhzbCgwLCAwJSwgMCUpOyAgICAtLXBvcHVwLWNsb3NlLXN2Zy1ob3Zlci1iYWNrZ3JvdW5kOiBoc2xhKDAsIDAlLCA4OCUsIDAuODcpOyAgICAtLXBvcHVwLWNsb3NlLXN2Zy1maWxsOiBoc2woMCwgMCUsIDAlKTt9"),
        dark: atob("OnJvb3Qgey0taWNvbi1zaXplOiAxN3B4OyAgICAtLWdhcC1pbm5lcjogMXB4OyAgICAtLWdhcC1vdXRlcjogNHB4OyAgICAtLXNpdGUtaGVhZGVyLWNvbG9yOiBoc2woMCwgMCUsIDg0JSk7ICAgIC0tbWFkZWJ5LWNvbG9yOiBoc2woMCwgMCUsIDYwJSk7ICAgIC0tc3RhdHVzLWVycm9yOiAjZmY0ODQ4OyAgICAtLXN0YXR1cy1zdWNjZXNzOiAjNzNmZjY3OyAgICAtLXN0YXR1cy13YXJuOiAjZmZiODRkOyAgICAtLWJvZHktYmFja2dyb3VuZDogaHNsKDAsIDAlLCA0JSk7ICAgIC0tZ3JpZC1vdXRlci1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDIzJSk7ICAgIC0tZ3JpZC1pbm5lci1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDIyJSk7ICAgIC0tY29sLWJhY2tncm91bmQ6IGhzbCgwLCAwJSwgNyUpOyAgICAtLWNvbC1jb2xvcjogaHNsKDAsIDAlLCAxMDAlKTsgICAgLS1jb2wtaW5pdC1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDE0JSk7ICAgIC0tY29sLWluaXQtY29sb3I6IGhzbCgwLCAwJSwgNzglKTsgICAgLS1jb2wtaGlkZGVuLWJhY2tncm91bmQ6IGhzbCgwLCAwJSwgMjAlKTsgICAgLS1jb2wtbWFya2VkLWJhY2tncm91bmQ6IGhzbCgzOSwgMTAwJSwgNjYlKTsgICAgLS1jb2wtbWFya2VkLWNvbG9yOiBoc2woMCwgMCUsIDAlKTsgICAgLS10b29sLWJhY2tncm91bmQ6IGhzbCgwLCAwJSwgOCUpOyAgICAtLXRvb2wtYm9yZGVyOiBoc2woMCwgMCUsIDE4JSk7ICAgIC0tdG9vbC1ob3Zlci1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDEyJSk7ICAgIC0tdG9vbC1jb2xvcjogaHNsKDAsIDAlLCA4MCUpOyAgICAtLXRvb2wtc3ZnLWZpbGw6IGhzbCgwLCAwJSwgODAlKTsgICAgLS1udW1wYWQtYnV0dG9uLWJhY2tncm91bmQ6IGhzbCgwLCAwJSwgMTQlKTsgICAgLS1udW1wYWQtYnV0dG9uLWJvcmRlcjogdHJhbnNwYXJlbnQ7ICAgIC0tbnVtcGFkLWJ1dHRvbi1jb2xvcjogaHNsKDAsIDAlLCAxMDAlKTsgICAgLS1udW1wYWQtYnV0dG9uLWhvdmVyLWJhY2tncm91bmQ6IGhzbCgwLCAwJSwgMTklKTsgICAgLS1pbnB1dC1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDYlKTsgICAgLS1pbnB1dC1ib3JkZXI6IGhzbCgwLCAwJSwgMTIlKTsgICAgLS1pbnB1dC1jb2xvcjogaHNsKDAsIDAlLCAxMDAlKTsgICAgLS1oZWFkZXItaWNvbi1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDE0JSk7ICAgIC0taGVhZGVyLWljb24tYm9yZGVyOiBoc2woMCwgMCUsIDI0JSk7ICAgIC0taGVhZGVyLWljb24taG92ZXItYmFja2dyb3VuZDogaHNsKDAsIDAlLCAxOCUpOyAgICAtLWhlYWRlci1zdmctZmlsbDogdmFyKC0tdG9vbC1zdmctZmlsbCk7ICAgIC0tcG9wdXBzbGlkZS1iYWNrZ3JvdW5kOiBoc2woMCwgMCUsIDglKTsgICAgLS1wb3B1cHNsaWRlLXRpdGxlLWNvbG9yOiBoc2woMCwgMCUsIDg0JSk7ICAgIC0tcG9wdXBzbGlkZS1kYXRhLWNvbG9yOiBoc2woMCwgMCUsIDg0JSk7ICAgIC0tc2hhZG93LWJhY2tncm91bmQ6IGhzbGEoMCwgMCUsIDAlLCAwLjc2KTsgICAgLS1wb3B1cC1iYWNrZ3JvdW5kOiBoc2woMjM2LCAwJSwgNiUpOyAgICAtLXBvcHVwLXRpdGxlLWNvbG9yOiBoc2woMCwgMCUsIDg0JSk7ICAgIC0tcG9wdXAtZGF0YS1jb2xvcjogaHNsKDAsIDAlLCA4NCUpOyAgICAtLXBvcHVwLWNsb3NlLXN2Zy1ob3Zlci1iYWNrZ3JvdW5kOiBoc2xhKDIzNiwgNCUsIDE0JSwgMC44Nyk7ICAgIC0tcG9wdXAtY2xvc2Utc3ZnLWZpbGw6IGhzbCgwLCAwJSwgOTAlKTt9")
    }, _theme = "dark";
    let e = document.createElement("style");document.head.appendChild(e);
    function update_theme(a) {
        if(a) _theme = a; else _theme = _theme==="dark"&&"light"||"dark"; e.textContent = themes[_theme];localStorage.setItem("theme", _theme);
        document.querySelectorAll(".icon.theme > svg").forEach(e => {if(e.getAttribute("vis_on")===_theme) e.style.display = "flex"; else e.style.display = "none";});
    };update_theme(localStorage.getItem("theme")||"dark");
    document.querySelector(".icon.theme").addEventListener("click", () => update_theme());
    document.querySelector(".icon.help").addEventListener("click", () => _c13({title: "[ Sudoku Solver | Help ]", data: "\"<b>=</b>\": tries to solve | \"<b>AC</b>\" to clear grid | \"<b><=</b>\" to clear cell<br>> click on any cell to select it<br>> keyboard numbers are supported aswell<br>&nbsp;&nbsp;- enter <b>0</b> to skip selected cell<br>> \"<b>map</b>\" shows a flat map of the grid<br>&nbsp;&nbsp;- you can enter your own flat map aswell to translate it onto the grid<br><br>\"latency\" is the time it takes for \"Solving Sudoku...\" to fully unfold, otherwise it'd get stuck in the middle of the animation (due to the solving algorithm having already started, which using all the processing power)"}).show());
})();
