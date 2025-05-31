function CreateElement(parent, type, classes) { const element = document.createElement(type);if(classes) {
        if(classes.substring(0, 1)===".") {classes.substring(1).split(".").forEach((k) => {element.classList.add(k);});}
        else if(classes.substring(0, 1)==="#") {element.id = classes.substring(1);};
    };if(parent) {parent.appendChild(element)};return element; };
function Animate(element, from, to, duration, f) {  Object.keys(from).forEach(k => { // Animates Element from start Properties to end Properties
        element.animate([{k: from[k]}], {duration: 0, fill: "forwards"});
    });element.animate([to],{duration: duration || 200,fill: "forwards"});if(typeof(f)==="function") {setTimeout(f, duration || 200);};   };
function CSSVar(data) {    const style = getComputedStyle(document.body);return style.getPropertyValue(data);   }; // Gets CSS Variables

// // self-made sudoku solver using random number generation (working on a solver using the backtracking algorithm!!)
// class Sudoku {
//     constructor(grid) {
//         grid = (grid||[]);for(let i = grid.length; i < 9; i++) grid.push([]);this.preset = [];
//         for(let i = 0; i < grid.length; i++) for(let i2 = 0; i2 < grid.length; i2++) grid[i][i2]&&this.preset.push(`${i},${i2}`);
//         this.safe_copy = (a) => {return JSON.parse(JSON.stringify(a));};this.grid = grid;
//     };
//     is_valid(grid, _nv, _mv, _b) {
//         function __return(a, cr, cc, t) {return {a: a, b: Number(cr), _mv: Number(cc), _b: _b};};
//         for(let i = 0; i < grid.length; i++) {let c1 = grid[i][_mv]===_b, c2 = grid[_nv][i]===_b;
//             if(c1||c2) return __return(false, c1&&String(i)||String(_nv), c2&&String(i)||String(_mv));};
//         let rS = Math.floor(_nv / 3) * 3, cS = Math.floor(_mv / 3) * 3;
//         for(let r2 = rS; r2 < rS + 3; r2++) for(let c2 = cS; c2 < cS + 3; c2++) if(grid[r2][c2]===_b) return __return(false, r2, c2);
//         return __return(true, _nv, _mv);
//     };
//     solve(f2) {
//         function __s(self, _a) {let __f = [1, 2, 3, 4, 5, 6, 7, 8, 9];function solve_row(self, _nv) {
//                     if(_nv>=_a.length) return;for(let _mv = 0; _mv < _a.length; _mv++) {if(!_a[_nv][_mv]) {let __a = [];
//                             __f.forEach(e => self.is_valid(_a, _nv, _mv, e).a&&__a.push(self.is_valid(_a, _nv, _mv, e)));
//                             if(__a.length) {_a[_nv][_mv] = __a[Math.floor(Math.random() * __a.length)]._b;} else return;};};
//                 };
//                 for(let i2 = 0; i2 < 9; i2++) solve_row(self, i2);
//                 let f = true;
//                 for(let i2 = 0; i2 < _a.length; i2++) for(let i3 = 0; i3 < _a.length; i3++) {if(!_a[i2][i3]) {f = false;};};
//                 if(f) {return _a;} else {return;};};
//         for(let i = 0; i < 10000; i++) { // recalling function everytime grid isn't complete (max. 10000 times)
//                 let g = __s(this, this.safe_copy(this.grid));if(g) {return g};};
//     };
// };
// sudoku solver using backtracking algorithm
function _c13(config) {
    let _a = Animate, _b = CreateElement;
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
setTimeout(() => _c13({title: "Test", data: "Test"}), 2000);
class Sudoku {
    constructor(board) {
        this.board = board||[];
        function __f(a2, b2) {if(a2===true) {return {r: Math.floor(b2 / 9), c: b2 % 9};} else {return a2*9+b2};};
        function is_valid(self, i, n) {let {r, c} = __f(true, i);for(let i2 = 0; i2 < 9; i2++) if(self.board[__f(r, i2)]===n||self.board[__f(i2, c)]===n) return false;
            let c1 = Math.floor(r / 3) * 3, c2 = Math.floor(c / 3) * 3;
            for(let r = c1; r < c1 + 3; r++) for(let c = c2; c < c2 + 3; c++) if(self.board[__f(r, c)]===n) return false;return true;};
        function allowed(self, i) {let t = [];for(let n = 1; n < 10; n++) if(is_valid(self, i, n)) if(u(self, i, n)) return [n]; else t.push(n);return t;};
        function u(self, i, n) {let {r, c} = __f(true, i);let c1 = Math.floor(r / 3) * 3, c2 = Math.floor(c / 3) * 3;
            for(let r = c1; r < c1 + 3; r++) for(let c = c2; c < c2 + 3; c++) {let i2 = __f(r, c);if(i2!==i&&!self.board[i]&&is_valid(self, i2, n)) return false;};return true;};
        this.s = (i) => {
            while(i<=80&&this.board[i]) i++;if(i>80) return true;
            for(const c of allowed(this, i)) {this.board[i] = c;if(this.s(i + 1)) return true;};this.board[i] = 0;return false;};
        this.tg = () => {
            let grid = [];for(let i = 0; i < 9; i++) grid.push([]);let t = this.solve();
            for(let i = 0; i < 81; i++) {let {r, c} = __f(true, i);grid[r][c] = board[i];};return grid;
        };
    };
    solve(to_grid) {if(this.s(0)) if(to_grid) return this.tg(); else return this.board; else return false;};
};
const grid = () => {return CreateElement(document.querySelector(".grid.outer.flex"), "div", ".grid.flex.column");};
const row = (a) => {return CreateElement(a, "div", ".row.flex");};
const col = (a) => {return CreateElement(CreateElement(a, "div", ".col.flex.x-center.y-center"), "span",".content.font-bold");};
function update_grid() {let a = window.innerWidth, b = window.innerHeight;document.querySelector(":root").style.setProperty("--grid-size", `${(a>b&&b||a) - 100}px`);};
window.onresize = update_grid;
update_grid();
// function vis_grid(t, hl) {
//     hl = hl||[];
//     let _a = Object.values(document.querySelectorAll(".col > span")), __a = -1;
//     if(!_a.length) {
//         _a = [];
//         for(let i = 0; i < 9; i++) {
//             if(i%3===0) {if(__a>=0) __a++;__a++;};
//             let a = grid(), b = undefined, _r = Math.floor(i/3)*9*3/9;
//             for(let i2 = 0; i2 < 9; i2++) {if(i2%3===0) {b = row(a);};let c = col(b);c.parentElement.setAttribute("i", (__a * 9) + (i * 3) + i2 + Math.floor(i2 / 3) * 6);_a.push(c);};
//         };
//     };
//     _a.sort((a, b) => Number(a.parentElement.getAttribute("i")) - Number(b.parentElement.getAttribute("i")));
//     const classes = ["marked"]; function __g(e) {classes.forEach(e2 => e.classList.remove(e2));};
//     for(let r = 0; r < 9; r++) for(let c = 0; c < 9; c++) {let h = _a[r*9+c].parentElement;h.setAttribute("r", r);h.setAttribute("c", c);_a[r*9+c].textContent = t[r][c]||"";__g(h);if(hl.find(e => e===`${r},${c}`)) h.classList.add("marked");};
// };
function vis_grid(t, m, init) {m = m||[]; init = init||[];
    const __f = (a, b) => {if(a===true) return {r: Math.floor(b / 9), c: b % 9}; else return a*9+b};let _a = document.querySelectorAll(".col > span");
    if(!_a.length) {_a = [];for(let i = 0; i < 9; i++) {let a = grid();for(let i2 = 0; i2 < 3; i2++) {let b = row(a);for(let i3 = 0; i3 < 3; i3++) {
                let c = col(b);let i4 = Math.floor(i / 3) * 18 + (i2 * 9 + (i * 3 + i3));let {r2, c2} = __f(true, i4);
                c.parentElement.setAttribute("i", i4);c.parentElement.setAttribute("r", r2);c.parentElement.setAttribute("c", c2);_a.push(c);};};};};
    const ehas = (t, e2, a) => {return t.find(e => e===e2.getAttribute("i"));};
    _a.forEach(e => {let _e = e.parentElement;e.textContent = t[Number(_e.getAttribute("i"))];
        if(ehas(m, _e)) _e.classList.add("marked"); else _e.classList.remove("marked");
        if(ehas(init, _e)) _e.classList.add("init"); else _e.classList.remove("init");});
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
    const __f = (a, b) => {if(a===true) return {r: Math.floor(b / 9), c: b % 9}; else return a*9+b};
    let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    if(nums.find(e2 => `${e2}`===e)||e==="0") {
        if(e!=="0") {t[i] = Number(e);};
        i++;if(i>80) {t = new Sudoku(t).solve(); i = -1;};
    } else if(e==="Backspace") {
        t[i] = undefined;
        i--;if(i<0) i = 0;
    };
    init = [];for(let i = 0; i < t.length; i++) if(t[i]) init.push(`${i}`);
    vis_grid(t, [`${i}`], init);
};
document.addEventListener("keyup", (e) => {
    __h(e.key);
});
document.querySelector(".nums.container").addEventListener("click", (e) => {
    console.log(e.target);
    if(e.target.classList.contains("num")) __h(e.target.textContent);
    else if(e.target.textContent==="AC") {t = []; i = 0;__h();}
    else if(e.target.nodeName==="BUTTON") __h("Backspace");
});
document.querySelector(".grid.outer").addEventListener("click", (e) => {
    e = e.target;if(!e.classList.contains("col")) e = e.parentElement;
    i = Number(e.getAttribute("i"));vis_grid(t, [`${i}`], init);
});
