const date = new Date();
function GetDate(date, plan, bind, fordate) {
    const Day = date.getDate();
    const Month = date.getMonth() + 1;
    const Year = date.getFullYear();
    return (plan&&(String(Year) + String("0").repeat(2 - String(Month).length) + String(Month) + String("0").repeat(2 - String(Day).length) + String(Day))||bind&&(`${Day}.${Month}.${Year}`)||fordate&&(`${Year}-${String("0").repeat(2 - String(Month).length)}${Month}-${String("0").repeat(2 - String(Day).length)}${Day}`)||(String("0").repeat(2 - String(Day).length) + String(Day) +
    String("0").repeat(2 - String(Month).length) + String(Month) +
    String(Year)));
};
function CreateElement(parent, type, classes) {
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
function CSSVar(data) { // Gets CSS Variables
    const style = getComputedStyle(document.body);
    return style.getPropertyValue(data);
};
class UIElement {
    constructor(parent, type) {
        if(!parent||!type) {return;};
        const elements = {
            "close": (...args) => {
                const __Close = CreateElement(parent, "ui-element-close");
                NewSVGHandler.CreateSVG(__Close, "cancel");
                __Close.addEventListener("mouseenter", () => {Animate(__Close, {}, {background: CSSVar("--popup-elements-button-hover-background")}, 40);});
                __Close.addEventListener("mouseleave", () => {Animate(__Close, {}, {background: "none"}, 40);});
                new UIElement(true, "button-click", __Close, ...args);
            },
            "button-click": (...args) => {
                args[0].addEventListener("mouseleave", () => {Animate(args[0], {}, {transform: "translateY(0px)"}, 40);});
                args[0].addEventListener("mousedown", () => {Animate(args[0], {}, {transform: "translateY(2px)"}, 40);});
                args[0].addEventListener("click", () => {Animate(args[0], {}, {transform: "translateY(0px)"}, 40); args.forEach(e => {if(typeof(e)==="function") {e();};})});
            }
        }
        const args = Array.from(arguments).reverse();
        args.pop();
        args.pop();
        args.reverse();
        return elements[type](...args);
    }
}
class SVGHandler {
    constructor() {
        this.svgs = {
            "add": "M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z",
            "trashcan": "M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z",
            "star": "m305-704 112-145q12-16 28.5-23.5T480-880q18 0 34.5 7.5T543-849l112 145 170 57q26 8 41 29.5t15 47.5q0 12-3.5 24T866-523L756-367l4 164q1 35-23 59t-56 24q-2 0-22-3l-179-50-179 50q-5 2-11 2.5t-11 .5q-32 0-56-24t-23-59l4-165L95-523q-8-11-11.5-23T80-570q0-25 14.5-46.5T135-647l170-57Zm49 69-194 64 124 179-4 191 200-55 200 56-4-192 124-177-194-66-126-165-126 165Zm126 135Z",
            "cancel": "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z",
            "refresh": "M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z",
            "settings": "m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z",
            "list": "M280-600v-80h560v80H280Zm0 160v-80h560v80H280Zm0 160v-80h560v80H280ZM160-600q-17 0-28.5-11.5T120-640q0-17 11.5-28.5T160-680q17 0 28.5 11.5T200-640q0 17-11.5 28.5T160-600Zm0 160q-17 0-28.5-11.5T120-480q0-17 11.5-28.5T160-520q17 0 28.5 11.5T200-480q0 17-11.5 28.5T160-440Zm0 160q-17 0-28.5-11.5T120-320q0-17 11.5-28.5T160-360q17 0 28.5 11.5T200-320q0 17-11.5 28.5T160-280Z",
            "home": "M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z",
            "login": "M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z",
            "language": "M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q83 0 155.5 31.5t127 86q54.5 54.5 86 127T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Zm0-82q26-36 45-75t31-83H404q12 44 31 83t45 75Zm-104-16q-18-33-31.5-68.5T322-320H204q29 50 72.5 87t99.5 55Zm208 0q56-18 99.5-55t72.5-87H638q-9 38-22.5 73.5T584-178ZM170-400h136q-3-20-4.5-39.5T300-480q0-21 1.5-40.5T306-560H170q-5 20-7.5 39.5T160-480q0 21 2.5 40.5T170-400Zm216 0h188q3-20 4.5-39.5T580-480q0-21-1.5-40.5T574-560H386q-3 20-4.5 39.5T380-480q0 21 1.5 40.5T386-400Zm268 0h136q5-20 7.5-39.5T800-480q0-21-2.5-40.5T790-560H654q3 20 4.5 39.5T660-480q0 21-1.5 40.5T654-400Zm-16-240h118q-29-50-72.5-87T584-782q18 33 31.5 68.5T638-640Zm-234 0h152q-12-44-31-83t-45-75q-26 36-45 75t-31 83Zm-200 0h118q9-38 22.5-73.5T376-782q-56 18-99.5 55T204-640Z",
            "help": "M424-320q0-81 14.5-116.5T500-514q41-36 62.5-62.5T584-637q0-41-27.5-68T480-732q-51 0-77.5 31T365-638l-103-44q21-64 77-111t141-47q105 0 161.5 58.5T698-641q0 50-21.5 85.5T609-475q-49 47-59.5 71.5T539-320H424Zm56 240q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z",
            "error": "M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z",
            "warn": "m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z",
            "success": "m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
        };
        this.cached_images = {};
        Object.keys(this.svgs).forEach(e => {
            const __Div = CreateElement(undefined, "div");
            __Div.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                    <path d="${this.svgs[e]}"/>
                </svg>
            `;
            this.cached_images[e] = __Div.querySelector("svg");
        });
        console.log(this.cached_images);
    }
    GetSVG(id) {
        return this.svgs[id]||"";
    }
    CreateSVG(parent, id) {
        parent.appendChild(this.cached_images[id].cloneNode(true));
    }
}
const NewSVGHandler = new SVGHandler();
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
document.title = "o7 Shreklam"; // Changes Title of Webpage
document.body.innerHTML = `
<!-- .d8888b. 88888888888 .d88888b.  8888888b.  
d88P  Y88b    888    d88P" "Y88b 888   Y88b 
Y88b.         888    888     888 888    888 
 "Y888b.      888    888     888 888   d88P 
    "Y88b.    888    888     888 8888888P"  
      "888    888    888     888 888        
Y88b  d88P    888    Y88b. .d88P 888        
 "Y8888P"     888     "Y88888P"  888 

 Bitte einmal den Text in der Konsole lesen x3!
 -->
${document.body.innerHTML}`;
const a = `${atob(`ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ4YiAgICAgICAgICBkOGIgICAgICAgICAgICAgIDg4OCAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgWThQICAgICAgICAgIFk4UCAgICAgICAgICAgICAgODg4ICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4ODggICAgICAgICAgICAgICAgICAgICAKIDg4ODhiLiAgODg4ZDg4OCA4ODg4OGIuZDg4Yi4gIDg4OCA4ODg4OGIuICA4ODggIDg4ODhiLiAgICAgIDg4ODg4OCAuZDg4Yi4gIDg4ODg4Yi4gIAogICAgIjg4YiA4ODhQIiAgIDg4OCAiODg4ICI4OGIgODg4IDg4OCAiODhiIDg4OCAgICAgIjg4YiAgICAgODg4ICAgZDg4IiI4OGIgODg4ICI4OGIgCi5kODg4ODg4IDg4OCAgICAgODg4ICA4ODggIDg4OCA4ODggODg4ICA4ODggODg4IC5kODg4ODg4ICAgICA4ODggICA4ODggIDg4OCA4ODggIDg4OCAKODg4ICA4ODggODg4ICAgICA4ODggIDg4OCAgODg4IDg4OCA4ODggIDg4OCA4ODggODg4ICA4ODggZDhiIFk4OGIuIFk4OC4uODhQIDg4OCBkODhQIAoiWTg4ODg4OCA4ODggICAgIDg4OCAgODg4ICA4ODggODg4IDg4OCAgODg4IDg4OCAiWTg4ODg4OCBZOFAgICJZODg4ICJZODhQIiAgODg4ODhQIiAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA4ODggICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDg4OCAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgODg4ICAgICAg`)}

${atob("SWNoIHdvbGx0ZSBudXIgbm9jaCBrdXJ6IHNhZ2VuLCBkYXNzIGljaCB2ZXJzdWNodCBoYWJlIGRlbiBDb2RlIGVpbmlnZXJtYd9lbiD8YmVyc2ljaHRsaWNoIHp1IGdlc3RhbHRlbiwgc28gZGFzcyBqZWRlciBlcyBndXQgZWluc2VoZW4gdW5kIHZlcnN0ZWhlbiBrYW5uIQ==")}
Viel Spaß! c:
`;
console.log(`${a}`);
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
function __cacheimage(key, src, alt) {
    const __Image = CreateElement(undefined, "img");
    __Image.src = src;
    __Image.alt = alt;
    cached_images[key] = __Image;
};
__cacheimage("ARNOLDSTOP", "/images/ArnoldStop.jpg", "STOP!"); // Cache Image
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
function CreatePopup() {
    const __Popup = CreateElement(document.body, "div", ".popup");
    const __PopupContainer = CreateElement(__Popup, "div", ".popup.container");
    const __TitleContainer = CreateElement(__PopupContainer, "div", ".title.container");
    const __Div = CreateElement(__TitleContainer, "div");
    const __ArnoldStop = cached_images["ARNOLDSTOP"].cloneNode();
    __ArnoldStop.style.width = "36px";
    __ArnoldStop.style.height = "36px";
    __Div.appendChild(__ArnoldStop);
    const __ContentContainer = CreateElement(__PopupContainer, "div", ".content.container");
    const __P = CreateElement(__ContentContainer, "p");
    __P.innerHTML = `<b>STOP!</b><br>
                    Wenn sie auf OK! drücken, gelangen sie zum Prototyp meines Stundenplans.
                    Dieser ist nicht funktionstüchtig und soll lediglich das Design veranschaulichen.<br>
                    (Das Design ist noch an meine Bildschirmeinstellungen angepasst und deshalb könnten manche Farben zu Dunkel angezeigt werden.)<br>
                    Sorry!<br><br>
                    <span style="font-size:12px;">(Drücken sie rechts oben auf "X" um dieses Fenster zu schließen)</span>`;
    const __ActionNavigator = CreateElement(__ContentContainer, "div", ".action-navigator");
    const __Item = CreateElement(__ActionNavigator, "a", ".item");
    const __ItemContentContainer = CreateElement(__Item, "div", ".content.container");
    const __Data = CreateElement(__ItemContentContainer, "p", ".data");
    __Item.href = "/PlanExperiment/index.html"; // Redirect to Plan
    __Data.textContent = "OK!";
    new UIElement(__PopupContainer, "close", () => {
        __Popup.style.opacity = "0";
        setTimeout(() => __Popup.remove(), 100);
        __PopupContainer.style.transform = `translate(-50%, -50%) scale(0.8)`;
    });
    setTimeout(() => {
        __Popup.style.opacity = "1";
        __PopupContainer.style.transform = `translate(-50%, -50%) scale(1)`;
    }, 0);
};
document.querySelector(".card > .content.container > .action-navigator > .item").addEventListener("click", () => CreatePopup());
