function Animate(element, from, to, duration, f) { // Animates Element from start Properties to end Properties
    Object.keys(from).forEach(k => {
        element.animate([{k: from[k]}], {duration: 0, fill: "forwards"});
    });
    element.animate(
        [
            to
        ],
        {
            duration: duration || 200,
            fill: "forwards"
        }
    );
    if(typeof(f)==="function") {setTimeout(f, duration || 200);};
};
function CreateElement(parent, type, classes) {
    // parent = (parent||document.body);
    const element = document.createElement(type);
    if(classes) {
        if(classes.substring(0, 1)===".") {
            classes.substring(1).split(".").forEach((k) => {
                element.classList.add(k);
            });
        } else if(classes.substring(0, 1)==="#") {
            element.id = classes.substring(1);
        };
    };
    if(parent) {parent.appendChild(element)};
    return element;
};
const langs = {
    "DE": "Willkommen",
    "FR": "Bienvenue",
    "GB": "Welcome",
    "ES": "Bienvenida",
    "PL": "Powitanie",
    "IT": "Bienvenuta",
    // "JP": "いらっしゃいませ" takes up too much space
};
const cached_images = {};
Object.keys(langs).forEach(e => {
    const img = CreateElement(undefined, "img", ".img");
    img.src = `https://flagsapi.com/${e}/flat/64.png`;
    cached_images[e] = img;
});
function index_langs() {
    let lastp = document.querySelector(".lang-welcome");
    if(!lastp) {
        lastp = CreateElement(document.querySelector(".title:not(.container)"), "p", ".lang-welcome");
    };
    function new_step(t, i) {
        if(!i) {index_langs(); return;};
        const l = langs[i];
        const p = CreateElement(document.querySelector(".title:not(.container)"), "p", ".lang-welcome");
        const lang = CreateElement(p, "span", ".lang")
        lang.innerHTML = l;
        if(i!=="_") {
            p.appendChild(cached_images[i]);
        };
        Animate(lastp, {}, {marginTop: "-40px"}, 600, () => {
            lastp.remove();
            lastp = p;
        });
        Animate(p, {}, {marginTop: "0px"}, 1000);
        setTimeout(() => new_step(t, Object.keys(langs)[t.findIndex(e => e===i) + 1]), 2000);
    };
    const t = langs;
    // pshh!
    const randint = Math.floor(Math.random() * 10);
    if(randint===9) {
        langs["_"] = `<span class="yeah"><3</span>`;
        new_step(Object.keys(t), Object.keys(langs)[0]);
    } else {
        index_langs();
    };
    // c:
    // new_step(Object.keys(t), Object.keys(langs)[0]);
};
index_langs();
