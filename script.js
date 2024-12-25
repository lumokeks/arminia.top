function CreateElement(parent, type, classes) {
    parent = (parent||document.body);
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
const langs = {
    "DE": "Willkommen",
    "FR": "Bienvenue",
    "GB": "Welcome",
    "ES": "Bienvenida",
    "PL": "Powitanie",
    "IT": "Bienvenuta",
    "JP": "いらっしゃいませ"
};
const translate = {
    current: "EN",
    "DE": {
        "lang_welcome_description": "Mein Portfolio ist noch nicht fertig, aber sieht es nicht schon fantastisch aus?",
        "made_by_by": "von",
        "made_by_sillyname": "(lustiger name)",
        "project:lumokeks": "(Dieses Portfolio)"
    },
    "EN": {
        "lang_welcome_description": `My Portfolio isn't finalised, but it looks great already doesn't it? <span class="small">(no it doesn't)</span>`,
        "made_by_by": "by",
        "made_by_sillyname": "(silly name)",
        "project:lumokeks": "(This Portfolio)"
    }
};
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
            const img = CreateElement(p, "img", ".img");
            img.src = `https://flagsapi.com/${i}/flat/64.png`;
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
function Add_Project(config) {
    const __Project = CreateElement(document.querySelector(".projects"), "div", ".project");
    const __TitleContainer = CreateElement(__Project, "div", ".title.container");
    const __Title = CreateElement(__TitleContainer, "p", ".title");
    const __Description = CreateElement(__TitleContainer, "p", ".description");
    const __ContentContainer = CreateElement(__Project, "div", ".content.container");
    const __Image = CreateElement(__ContentContainer, "img");

    __Image.src = config.image||`${location.pathname}images/placeholder.png`;
    __Title.textContent = config.title;
    __Description.setAttribute("translation_id", `project:${config.description}`);
};
Add_Project({title: "ViacugeVP", description: "lumokeks"});
Object.values(document.querySelectorAll("[translation_id]")).forEach(e => {
    e.innerHTML = translate[translate.current][e.getAttribute("translation_id")];
});