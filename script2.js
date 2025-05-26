function CreateElement(parent, type, classes) { const element = document.createElement(type);if(classes) {
        if(classes.substring(0, 1)===".") {classes.substring(1).split(".").forEach((k) => {element.classList.add(k);});}
        else if(classes.substring(0, 1)==="#") {element.id = classes.substring(1);};
    };if(parent) {parent.appendChild(element)};return element; };
function Animate(element, from, to, duration, f) {  Object.keys(from).forEach(k => { // Animates Element from start Properties to end Properties
        element.animate([{k: from[k]}], {duration: 0, fill: "forwards"});
    });element.animate([to],{duration: duration || 200,fill: "forwards"});if(typeof(f)==="function") {setTimeout(f, duration || 200);};   };
function CSSVar(data) {    const style = getComputedStyle(document.body);return style.getPropertyValue(data);   }; // Gets CSS Variables

class Sudoku {
    constructor(grid) {
        grid = (grid||[]);
        for(let i = grid.length; i < 9; i++) grid.push([]);
        this.preset = [];
        for(let i = 0; i < grid.length; i++) for(let i2 = 0; i2 < grid.length; i2++) grid[i][i2]&&this.preset.push(`${i},${i2}`);
        this.safe_copy = (a) => {return JSON.parse(JSON.stringify(a));};
        this.grid = grid;
        this.cache = [];
    };
    is_valid(grid, _nv, _mv, _b) {
        function __return(a, cr, cc, t) {return {a: a, b: Number(cr), _mv: Number(cc), _b: _b};};
        for(let i = 0; i < grid.length; i++) {
            let c1 = grid[i][_mv]===_b, c2 = grid[_nv][i]===_b;
            if(c1||c2) return __return(false, c1&&String(i)||String(_nv), c2&&String(i)||String(_mv));
        };
        let rS = Math.floor(_nv / 3) * 3, cS = Math.floor(_mv / 3) * 3;
        for(let r2 = rS; r2 < rS + 3; r2++) for(let c2 = cS; c2 < cS + 3; c2++) if(grid[r2][c2]===_b) return __return(false, r2, c2);
        return __return(true, _nv, _mv);
    };
    solve(_a, f2) {
        _a = _a||this.safe_copy(this.grid);
        let __f = [1, 2, 3, 4, 5, 6, 7, 8, 9];function solve_row(self, _nv) {
            if(_nv>=_a.length) return;for(let _mv = 0; _mv < _a.length; _mv++) {if(!_a[_nv][_mv]) {let __a = [];
                    __f.forEach(e => self.is_valid(_a, _nv, _mv, e).a&&__a.push(self.is_valid(_a, _nv, _mv, e)));
                    if(__a.length) {_a[_nv][_mv] = __a[Math.floor(Math.random() * __a.length)]._b;} else return;};};
        };
        for(let i2 = 0; i2 < 9; i2++) solve_row(this, i2);
        let f = true;
        for(let i2 = 0; i2 < _a.length; i2++) for(let i3 = 0; i3 < _a.length; i3++) {if(!_a[i2][i3]) {f = false;};};
        if(f) {return _a;} else {return this.solve();};
    };
}
const grid = () => {return CreateElement(document.querySelector(".grid.outer.flex"), "div", ".grid.flex.column");};
const row = (a) => {return CreateElement(a, "div", ".row.flex");};
const col = (a) => {return CreateElement(CreateElement(a, "div", ".col.flex.x-center.y-center"), "span", ".content.font-bold.c-primary");};
function update_grid() {let a = window.innerWidth, b = window.innerHeight;document.querySelector(":root").style.setProperty("--grid-size", `${(a>b&&b||a) - 100}px`);};
window.onresize = update_grid;
update_grid();
function visualize(a) {
    document.querySelector(".grid.outer.flex").innerHTML = "";
    let grid = []; for(let i = 0; i < 9; i++) {grid.push(grid()); for(let i2 = 0; i < 3; i2++) row(grid[i])};
    for(let i = 0; i < a.length; i++) {
        let index = Math.floor(i / 3) * i
        for(let i2 = 0; i2 < a.length; i2++) {
            let _c = col(Object.values(grid[index].children)[Math.floor(i2 / 3)]);
            _c.textContent = `${a[i][i2]||0}`; document.body.innerHTML = ´${index}, ${Math.floor(i2 / 3)}´
            return;
        };
    };
};
visualize(new Sudoku([]).solve());
// function _a() {visualize(new Sudoku([]).solve());setTimeout(_a, 100);};
// _a();
