const Data = {Schule: {}}
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
async function sha256(message) {
    return btoa(message); // for now hehe
};
function SetCookie(name, data, expiredays) {
    expiredays = (expiredays || 1);
    const expires = (expiredays * 24 * 60 * 60 * 1000);
    date.setTime(date.getTime() + expires);
    document.cookie = name + "=" + data + ";path=/;expires=" + expires;
};
function GetCookie(name) {
    let ToReturn = undefined;
    document.cookie.split("; ").forEach(cookie => {
        if(cookie.split("=")[0]===name) {
            ToReturn = cookie.split("=")[1];
        };
    });
    if(ToReturn==="undefined") {
        return;
    } else {
        return ToReturn;
    };
};
function GetTimeBetween(d1, d2) {
    const t = Math.abs(d1 - d2);
    let s = Math.floor((t / 1000) % 60);
    let m = Math.floor((t / 60000) % 60);
    let h = Math.floor((t / 3600000) % 60);
    function a(v) {
        return `${String("0").repeat(2 - String(v).length)}${String(v)}`;
    };
    return {h: a(h), m: a(m), s: a(s)};
};
function NewFeedback(config) {
    let systemfeedback = document.querySelector("#system-feedback");
    if(!systemfeedback) {systemfeedback = CreateElement(document.body, "div", "#system-feedback");};
    const __Feedback = CreateElement(systemfeedback, "div", ".feedback");
    const __FeedbackType = CreateElement(__Feedback, "div", ".feedback-type");
    const __ContentContainer = CreateElement(__Feedback, "div", ".content.container");
    const __Title = CreateElement(__ContentContainer, "p", ".title");
    const __Data = CreateElement(__ContentContainer, "p", ".data");
    const __Icon = CreateElement(__Feedback, "div", ".icon");
    __Feedback.setAttribute("type", config.type);
    __Title.textContent = config.title;
    __Data.textContent = config.data;
    // __Icon.innerHTML = new SVGHandler().CreateSVG(config.type);
    Animate(__Feedback, {}, {transform: "translateX(-5%)", opacity: 1}, 100, () => {
        Animate(__Feedback, {}, {transform: "translateX(0%)"}, 60);
    });
    setTimeout(() => {
        Animate(__Feedback, {}, {opacity: 0}, 100);
        Animate(__Feedback, {}, {transform: "translateX(100%)"}, 100, () => {
            Animate(__Feedback, {}, {height: "0px"}, 100, () => __Feedback.remove());
        });
    }, config.timeout||6000);
    if(systemfeedback.clientHeight>window.innerHeight) {
        Object.values(systemfeedback.children)[0].remove();
    };
};
class Popup {
    constructor(config) {
        const __Popup = CreateElement(document.body, "div", config.id);
        const __PopupContainer = CreateElement(__Popup, "div", ".popup.container");
        new UIElement(__PopupContainer, "close", () => {anim.hide();});
        const __TitleContainer = CreateElement(__PopupContainer, "div", ".title.container");
        const __Title = CreateElement(__TitleContainer, "div", ".title");
        const __ContentContainer = CreateElement(__PopupContainer, "div", ".content.container");
        __Title.textContent = config.title;
        const anim = {};
        anim.show = () => {
            setTimeout(() => {
                __Popup.style.opacity = "1";
                __PopupContainer.style.transform = `translate(-50%, -50%) scale(1)`;
            }, 0);
        };
        anim.hide = () => {
            __Popup.style.opacity = "0";
            setTimeout(() => __Popup.remove(), 100);
            __PopupContainer.style.transform = `translate(-50%, -50%) scale(0.8)`;
        };
        return {p: __PopupContainer, c: __ContentContainer, anim: anim};
    }
};
class UIElement {
    constructor(parent, type) {
        if(!parent||!type) {return;};
        const events = {down: ["mousedown"], up: ["mouseup"]};
        const elements = {
            "close": (...args) => {
                const __Close = CreateElement(parent, "ui-element-close");
                __Close.innerHTML = new SVGHandler().CreateSVG("cancel");
                function __focus() {Animate(__Close, {}, {background: CSSVar("--popup-elements-button-hover-background")}, 40);};
                function __blur() {Animate(__Close, {}, {background: "none"}, 40);};
                __Close.addEventListener("mouseenter", () => __focus());
                __Close.addEventListener("mouseleave", () => __blur());
                new UIElement(true, "button-click", __Close, __focus(), ...args);
            },
            "button-click": (...args) => {
                let focused = false;
                function __focus () {focused = true; Animate(args[0], {}, {transform: "translateY(2px)"}, 40);};
                function __blur() {focused = false; Animate(args[0], {}, {transform: "translateY(0px)"}, 40);};
                args[0].addEventListener("mouseleave", () => __blur());
                events.down.forEach(e => {args[0].addEventListener(e, () => __focus());});
                events.up.forEach(e => {args[0].addEventListener(e, () => __blur());});
                args[0].addEventListener("touchend", () => {__focus(); setTimeout(() => __blur(), 100);});
                args[0].addEventListener("click", () => {args.forEach(e => {if(typeof(e)==="function") {e();};})});
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
        }
    }
    GetSVG(id) {
        return this.svgs[id]||"";
    }
    CreateSVG(id) {
        return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="${this.GetSVG(id)}"/>
        </svg>
        `
    }
}
class KlassenInfo {
    constructor(xml, queries) {
        this.queries = queries;
        this.xml = xml;
    }
    GetKlassen() {
        return this.xml.querySelectorAll(this.queries.klasse.name);
    }
    GetKlasse(name) {
        this.GetKlassen().forEach(k => {
            if(k.querySelector(this.queries.klasse.klassen_name).textContent===name) {
                name = k;
                return;
            };
        });
        return name;
    }
    GetPlan(klasse) {
        let plan = [];
        function IsChanged(element) {
            return element.getAttributeNames().find(element => element.includes("Ae"))&&true||false;
        };
        klasse.querySelectorAll(`${this.queries.plan.name} > ${this.queries.plan.ganze_stunde}`).forEach(s => {
            let stunde = s.querySelector(this.queries.plan.stunde);
            let fach = s.querySelector(this.queries.plan.fach);
            let lehrer = s.querySelector(this.queries.plan.lehrer);
            let raum = s.querySelector(this.queries.plan.raum);
            let info = s.querySelector(this.queries.plan.info);
            plan.push({
                stunde: {data: Number(stunde.textContent), changed: IsChanged(stunde)},
                fach: {data: fach.textContent, changed: IsChanged(fach)},
                lehrer: {data: lehrer.textContent, changed: IsChanged(lehrer)},
                raum: {data: raum.textContent, changed: IsChanged(raum)},
                "stunden-information": {newline: true, data: info.textContent}
            })
        });
        return plan;
    }
    GetKurse(klasse) {
        const t = [];
        klasse.querySelectorAll(this.queries.klasse.kurse.name).forEach(e => {
            t.push({lehrer: e.getAttribute(this.queries.klasse.kurse.lehrer), fach: e.getAttribute(this.queries.klasse.kurse.fach)});
        });
        return t;
    }
    GetZusatz() {
        if(this.xml.querySelector(this.queries.zusatzinfo.name)) {
            let info = Object.values(this.xml.querySelectorAll(this.queries.zusatzinfo.name));
            if(info[0]&&info[info.length - 1]) {
                info.reverse();
                for(let i = info.length - 1; i > 0; i--) {
                    if(info[i].textContent.length===0) {
                        info.pop();
                    } else {
                        break;
                    };
                };
                info.reverse();
                if(info[info.length - 1].textContent.length===0) {info.pop();};
            };
            return [info];
        } else {return [];};
    }
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
// if(!GetCookie("sessionid")&&location.pathname.substring(0, 5)!=="/Home") {location.href = "/Home/index.html";};
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
class HTTP {
    constructor() {
        this.authorize = (auth) => {
            return (xhr) => {
                xhr.setRequestHeader("Authorization", `${auth.name}:${auth.password}`);
            };
        };
    }
    GetURL(url, replace) {
        const HOST = "/";
        const URLS = {
            "Plan": "/PlanExperiment/daten/PlanKl$1.txt",
            "NewestPlan": "/PlanExperiment/daten/Klassen.txt",
            "SchulData": "/PlanExperiment/daten/SPlanKl_Basis.txt"
        };
        let i = undefined;
        Object.keys(URLS).forEach(k => {
            if(k===url) {
                i = URLS[k];
                return;
            };
        });
        let c = 0;
        replace.forEach(r => {
            i = i.replaceAll(`$${c}`, r);
            c++;
        });
        return i
    }
    HTTPRequest(url, f, authorize) {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        f = (f||function(){})
        authorize = (authorize||function(){});
        authorize(xhr);
        xhr.onload = () => {
            f(xhr);
        };
        xhr.send();
    }
    RequestPlan(date, auth, f) {
        this.HTTPRequest(`${this.GetURL("Plan", [auth.schule, date])}?xml=true`, f, this.authorize(auth));
    }
    RequestNewestPlan(auth, f) {
        this.HTTPRequest(`${this.GetURL("NewestPlan", [auth.schule])}?xml=true`, f, this.authorize(auth));
    }
    RequestSchulData(auth, f) {
        this.HTTPRequest(`${this.GetURL("SchulData", [auth.schule])}?xml=true`, f, this.authorize(auth));
    }
};
const Queries = {
    schulwoche: {
        name: "Sw",
        von: "SwDatumVon",
        bis: "SwDatumBis",
        typ: "SwWo"
    },
    klasse: {
        name: "Kl",
        klassen_name: "Kurz",
        kurse: {
            name: "Unterricht > Ue > UeNr",
            lehrer: "UeLe",
            fach: "UeFa"
        }
    },
    date: {
        name: "VpMobil > Kopf > datei"
    },
    titleinfo: {
        day: "VpMobil > Kopf > DatumPlan",
        stand: "VpMobil > Kopf > zeitstempel"
    },
    plan: {
        name: "Pl",
        ganze_stunde: "Std",
        stunde: "St",
        fach: "Fa",
        lehrer: "Le",
        raum: "Ra",
        info: "If"
    },
    zusatzinfo: {
        name: "ZusatzInfo > ZiZeile"
    }
}
function TransformPlanDate(d) {
    return d.split(".").reverse().join("-");
};
function GetDaysBetween(date1, date2, maxn) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    const days = [GetDate(date1, false, false, true)];
    for(let i = 0; i < maxn; i++) {
        date1.setDate(date1.getDate() + 1);
        days.push(GetDate(date1, false, false, true));
        if(date1>=date2) {
            break;
        };
    };
    return days;
};
function GetTitleInfo(xml) {
    return {day: xml.querySelector(Queries.titleinfo.day).textContent, stand: xml.querySelector(Queries.titleinfo.stand).textContent};
};
function UpdateSchuldata(f) {
    const http = new HTTP();
    Data.Schule.Schulwochen = [];
    Data.Schule.Klassen = {all: [], current: ""};
    http.RequestSchulData({schule: 10019573, name: "schueler", password: "sm37721"}, (xhr) => {
        const xml = new window.DOMParser().parseFromString(xhr.responseText, "text/xml");
        xml.querySelectorAll(Queries.schulwoche.name).forEach((s) => {
            let von = TransformPlanDate(s.getAttribute(Queries.schulwoche.von));
            let bis = TransformPlanDate(s.getAttribute(Queries.schulwoche.bis));
            Data.Schule.Schulwochen.push({days: GetDaysBetween(von, bis, 7), type: s.getAttribute(Queries.schulwoche.typ)});
        });
        xml.querySelectorAll(`${Queries.klasse.name} > ${Queries.klasse.klassen_name}`).forEach((s) => {
            Data.Schule.Klassen.all.push(s.textContent);
            if(Data.Schule.Klassen.current.length===0) {
                Data.Schule.Klassen.current = s.textContent;
            };
        });
        f(Data);
    });
};
function GetDateFromPlan(xml) {
    const d = xml.querySelector(Queries.date.name).textContent.replaceAll("PlanKl", "").replaceAll(".xml", "");
    const Day = d.substring(d.length -  2, d.length);
    const Month = d.substring(d.length - 4, d.length - 2);
    const Year = d.substring(d.length - 4, 0);
    return `${Day}-${Month}-${Year}`;
};
function GetSchuldata(f) {
    if(Data.Schule.Schulwochen) {
        f(Data);
    } else {
        UpdateSchuldata(f);
    };
};
function __UpdateKlasse() {
    GetSchuldata((data) => {
        const CURRENT_KLASSE_INFO_ELEMENTS = Array.from(document.querySelectorAll("*[info-element-klasse]"));
        CURRENT_KLASSE_INFO_ELEMENTS.forEach(e => e.textContent = data.Schule.Klassen.current);
    });
};
function CreateWeek(d) {
    const http = new HTTP();
    if(d.querySelector) {d = TransformPlanDate(GetDateFromPlan(d).replaceAll("-", "."));};
    console.log(d);
    GetSchuldata((data) => {
        Data.Schule.Schulwochen.forEach(s => {
            let days = [];
            function CreateDays() {
                if(s.days.find(element => element===GetDate(date, false, false, true))) {
                    document.querySelector(".plan.container").innerHTML = "";
                    s.days.forEach(d => {
                        CreateDay(d, days.find(element => element.date===d).xml);
                    });
                };
            };
            console.log(s.days, d);
            if(s.days.find(element => element===d)) { // `${d.split("-")[0]}-${Number(d.split("-")[1])}-${Number(d.split("-")[2])}`
                date.setFullYear(s.days[0].split("-")[0]);
                date.setMonth(Number(s.days[0].split("-")[1]) - 1);
                date.setDate(s.days[0].split("-")[2]);
                const sd = document.querySelectorAll(".date > span.date");
                sd[0].textContent = TransformPlanDate(s.days[0].replaceAll("-", ".")).replaceAll("-", ".");
                sd[1].textContent = TransformPlanDate(s.days[s.days.length - 1].replaceAll("-", ".")).replaceAll("-", ".");
                document.querySelector(".date.container > .woche").textContent = s.type;
                s.days.forEach(d => {
                    days.push({date: d, xml: null});
                    if(s.days[s.days.length - 1]===d) {
                        CreateDays();
                        days = [];
                    };
                });
                s.days.forEach(d => {
                    http.RequestPlan(d.replaceAll("-", ""), {schule: 10019573, name: "schueler", password: "sm37721"}, (xhr) => {
                        let xml = null;
                        if(xhr.status!==404) {
                            xml = new window.DOMParser().parseFromString(xhr.responseText, "text/xml");
                        };
                        days.push({date: d, xml: xml});
                        if(days.length===s.days.length) {
                            CreateDays();
                        };
                    });
                });
            };
        });
    });
};
function ChangeWeek(n) {
    __UpdateKlasse();
    GetSchuldata((data) => {
        for(let i = 0; i < Data.Schule.Schulwochen.length; i++) {
            let s = Data.Schule.Schulwochen[i];
            if(s.days.find(element => element===GetDate(date, false, false, true))) {
                // CreateWeek(TransformPlanDate(Data.Schule.Schulwochen[i + n][0].replaceAll("-", ".")).replaceAll("-", "."))
                console.log(i, n, i + n);
                console.log(date.getMonth())
                CreateWeek(Data.Schule.Schulwochen[i + n].days[0]);
                break;
            };
        };
    });
};
function CreateNewestWeek() {
    __UpdateKlasse();
    const http = new HTTP();
    http.RequestNewestPlan({schule: 10019573, name: "schueler", password: "sm37721"}, (xhr) => {
        let xml = null;
        if(xhr.status!==404) {
            xml = new window.DOMParser().parseFromString(xhr.responseText, "text/xml");
        };
        CreateWeek(xml);
    });
};
const Days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
function CreateDay(d, xml) {
    console.log(xml);
    const __Day = CreateElement(document.querySelector(".plan.container"), "div", ".day");
    const __TitleContainer = CreateElement(__Day, "div", ".title.container.div-style");
    const __Title = CreateElement(__TitleContainer, "p", ".title");
    const __Date = CreateElement(__TitleContainer, "p", ".date");
    const __Stand = CreateElement(__TitleContainer, "p", ".stand");
    const __Plan = CreateElement(__Day, "div", ".plan.div-style");

    let dsplit = d.split("-");
    __Title.textContent = Days[new Date(d).getDay() - 1];
    __Date.textContent = `${dsplit[2]}.${dsplit[1]}.${dsplit[0]}`;
    __Stand.textContent = (xml&&GetTitleInfo(xml).stand||"Nicht Vorhanden");

    if(!xml) {
        return;
    };
    const klasseninfo = new KlassenInfo(xml, Queries);
    GetSchuldata((data) => {
        data.Schule.Klassen.current_klassen_info = klasseninfo;
    });
    GetSchuldata((data) => {
        klasseninfo.GetPlan(klasseninfo.GetKlasse(data.Schule.Klassen.current)).forEach(s => {
            const __PlanZeile = CreateElement(__Plan, "div", ".plan-zeile");
            const __StundenListe = CreateElement(__PlanZeile, "div", ".stunden-liste");
    
            Object.keys(s).forEach(e => {
                if(s[e].newline) {
                    const __Element = CreateElement(__PlanZeile, "div", `.${e}`);
                    __Element.textContent = `${s[e].data}`;
                } else {
                    const __Element = CreateElement(__StundenListe, "div", `.${e}.plan-element${s[e].changed&&".vertretung"||""}`);
                    __Element.textContent = `${s[e].data}`;
                };
            });
        });
        klasseninfo.GetZusatz().forEach(z => {
            const __ZusatzInfo = CreateElement(__Day, "div", ".zusatz.container.div-style");
            z.forEach(e => {
                const __ZusatzZeile = CreateElement(__ZusatzInfo, "div", ".zusatz-zeile");
                __ZusatzZeile.textContent = e.textContent;
            });
        });
    });
};
// Class Selection Popup
function CreateAuswahl() {
    const popupdata = new Popup({id: "#auswahl", title: "Klassen Auswahl"});
    const __Header = CreateElement(popupdata.c, "div", ".header");
    const __Search = CreateElement(__Header, "div", ".search");
    const __Input = CreateElement(__Search, "input", ".search-input");
    __Search.innerHTML += new SVGHandler().CreateSVG("cancel");
    const __Sort = CreateElement(__Header, "div", ".sort");
    const __Sort_All = CreateElement(__Sort, "div", ".all.used");
    const __Sort_All_Content = CreateElement(__Sort_All, "p", ".content");
    const __Sort_Favorites = CreateElement(__Sort, "div", ".favorites");
    __Sort_Favorites.setAttribute("allowed-classes", "is-favorite");
    const __Sort_Favorites_Content = CreateElement(__Sort_Favorites, "p", ".content");
    const __Klassen = CreateElement(popupdata.c, "div", ".selector.klassen");

    __Search.querySelector(".search-input").placeholder = "[ Suche ]";

    __Sort_All_Content.textContent = "Alle";
    __Sort_Favorites_Content.textContent = "⭐ Favoriten ⭐";

    popupdata.anim.show();

    const Sorts = [__Sort_All, __Sort_Favorites];
    function ChangeKlasseDisplay(element, type) {
        if(type=="show") {
            element.style.display = "flex";
            Animate(element, {}, {marginLeft: "0px", opacity: 1}, 100);
        } else {
            Animate(element, {}, {marginLeft: "100%", opacity: 0}, 100, () => {
                element.style.display = "none";
            });
        };
    };
    function UpdateKlassen() {
        const e = Sorts.find(element => element.classList.contains("used"));
        if(e.getAttribute("allowed-classes")) {
            Object.values(__Klassen.children).forEach(k => {
                if(k.classList.contains(e.getAttribute("allowed-classes"))) {
                    ChangeKlasseDisplay(k, "show");
                    k.classList.add("in-favorite-tab");
                } else {
                    ChangeKlasseDisplay(k, "hide");
                    k.classList.remove("in-favorite-tab");
                };
            });
        } else {
            Object.values(__Klassen.children).forEach(k => {
                ChangeKlasseDisplay(k, "show");
                k.classList.remove("in-favorite-tab");
            });
        };
    };
    Sorts.forEach(e => {
        e.addEventListener("click", () => {
            Sorts.forEach(e => {
                if(e.classList.contains("used")) {
                    e.classList.remove("used");
                };
            });
            e.classList.add("used");
            UpdateKlassen();
        });
    });
    __Search.querySelector(".search-input").addEventListener("input", () => {
        const data = __Search.querySelector(".search-input").value;
        const klassen = Object.values(__Klassen.children);
        klassen.forEach(e => {
            console.log(e);
            if(e.querySelector(".name").textContent.substring(0, data.length)==data) {
                ChangeKlasseDisplay(e, "show");
            } else {
                ChangeKlasseDisplay(e, "hide");
            };
        });
    });
    GetSchuldata((data) => {
        data.Schule.Klassen.all.forEach(k => {
            const __Klasse = CreateElement(__Klassen, "div", ".klasse.item");
            const __Name = CreateElement(__Klasse, "p", ".name");
            const __Icons = CreateElement(__Klasse, "div", ".icons");
            const __DeleteItem = CreateElement(__Icons, "div", ".delete-item");
            const __AddToFavorites = CreateElement(__Icons, "div", ".add-to-favorites");
            __DeleteItem.innerHTML = new SVGHandler().CreateSVG("trashcan");
            __AddToFavorites.innerHTML = new SVGHandler().CreateSVG("add");
            __Name.textContent = k

            __DeleteItem.addEventListener("mouseenter", () => {
                Animate(__DeleteItem.querySelector("svg"), {}, {transform: "translateY(-2px)"}, 100);
            });
            __DeleteItem.addEventListener("mouseleave", () => {
                Animate(__DeleteItem.querySelector("svg"), {}, {transform: "translateY(0px)"}, 100);
            });
            __DeleteItem.addEventListener("click", () => {
                __Klasse.classList.remove("is-favorite");
                __Klasse.classList.remove("is-focused");
                Animate(__DeleteItem.querySelector("svg"), {}, {transform: "rotate(45deg)"}, 100);
                Animate(__AddToFavorites.querySelector("svg"), {}, {transform: "rotate(360deg)", opacity: 0}, 200, () => {
                    __AddToFavorites.innerHTML = new SVGHandler().CreateSVG("add");
                    // Animate(__AddToFavorites, {}, {opacity: 1}, 100);
                    UpdateKlassen();
                });
            });
            
            function FocusAnimation(element) {
                Animate(element, {}, {color: "#FFFFFF", borderColor: CSSVar("--primary-color")}, 100);
                if(!element.classList.contains("is-favorite")) {
                    Animate(__AddToFavorites, {}, {opacity: 1}, 100);
                };
                if(element.classList.contains("in-favorite-tab")) {
                    __DeleteItem.style.display = "flex";
                    Animate(__DeleteItem, {}, {opacity: 1}, 100);
                };
            };
            function UnfocusAnimation(element) {
                Animate(element, {}, {color: "#a3a3a3", borderColor: CSSVar("--klassenauswahl-elements-klasseoption-border")}, 100);
                Animate(__DeleteItem, {}, {opacity: 0, marginTop: "0px"}, 100);
                if(!element.classList.contains("is-favorite")) {
                    Animate(__AddToFavorites, {}, {opacity: 0}, 100);
                };
            };

            __Klasse.addEventListener("mouseover", () => { // Focus (mouseenter)
                Object.values(__Klassen.children).forEach(e => {if(e!==__Klasse&&e.classList.contains("is-focused")) {e.classList.remove("is-focused"); e.classList.remove("is-clicked"); UnfocusAnimation(e);};});
                __Klasse.classList.add("is-focused");
                FocusAnimation(__Klasse);
            });
            __Klasse.addEventListener("mouseleave", () => { // Unfocus (mouseleave)
                __Klasse.classList.remove("is-focused");
                __Klasse.classList.remove("is-clicked");
                UnfocusAnimation(__Klasse);
            });

            __Name.addEventListener("click", () => {
                if(__Klasse.classList.contains("is-clicked")) {
                    GetSchuldata(data => {
                        data.Schule.Klassen.current = k;
                        ChangeWeek(0);
                    });
                    if(__Klasse.classList.contains("is-clicked")) {
                        popupdata.anim.hide();
                    };
                };
                __Klasse.classList.add("is-clicked");
            });

            function AddToFavoritesClickAnimation() {
                if(!__Klasse.classList.contains("is-favorite")) {
                    __Klasse.classList.add("is-favorite");
                    Animate(__AddToFavorites.querySelector("svg"), {}, {transform: "rotate(360deg)", opacity: 0}, 200, () => {
                        __AddToFavorites.innerHTML = new SVGHandler().CreateSVG("star");
                        Animate(__AddToFavorites, {}, {opacity: 1}, 100);
                    });
                };
            };
            __AddToFavorites.addEventListener("click", AddToFavoritesClickAnimation);
        });
    });
};
// Settings = Kurse
// Real Settings can be found in the home page
// Settings Popup
function CreateSettings() {
    const popupdata = new Popup({id: "#settings", title: "Kurs Auswahl"});
    popupdata.p.classList.add("kurse"); // different styling according to the popup container's classname
    const __Header = CreateElement(popupdata.c, "div", ".header");
    const __Search = CreateElement(__Header, "div", ".search"); // search not implemented
    const __Input = CreateElement(__Search, "input", ".search-input");
    __Search.innerHTML += new SVGHandler().CreateSVG("cancel");
    const __SelectActions = CreateElement(__Header, "div", ".select-actions");
    const __SelectAlle = CreateElement(__SelectActions, "div", ".select.alle");
    const __SelectKeine = CreateElement(__SelectActions, "div", ".select.keine");
    __SelectAlle.textContent = "Alle";
    __SelectKeine.textContent = "Keine";
    const __Kurse = CreateElement(popupdata.c, "div", ".selector.kurse");

    function SetToggleState(kurs, element, state) {
        Array.from(kurs.children).forEach(e => Animate(e, {}, {opacity: (state&&"1"||"0.6")}, 100));
        Animate(element, {}, {background: CSSVar(`--status-${state&&"success"||"error"}`)}, 100);
    };

    new UIElement(true, "button-click", __SelectAlle, () => Array.from(__Kurse.children).forEach(e => {e.querySelector(".icons > .toggled").setAttribute("toggled", true); SetToggleState(e, e.querySelector(".icons > .toggled"), true);}));
    new UIElement(true, "button-click", __SelectKeine, () => Array.from(__Kurse.children).forEach(e => {e.querySelector(".icons > .toggled").removeAttribute("toggled"); SetToggleState(e, e.querySelector(".icons > .toggled"), false);}));

    popupdata.anim.show();

    __Search.querySelector(".search-input").placeholder = "[ Suche ]";
    function ChangeKursDisplay(element, type) {
        if(type=="show") {
            element.style.display = "flex";
            Animate(element, {}, {marginLeft: "0px", opacity: 1}, 100);
        } else {
            Animate(element, {}, {marginLeft: "100%", opacity: 0}, 100, () => {
                element.style.display = "none";
            });
        };
    };
    __Search.querySelector(".search-input").addEventListener("input", () => {
        const data = __Search.querySelector(".search-input").value;
        const kurse = Object.values(__Kurse.children);
        kurse.forEach(e => {
            console.log(e);
            if(e.querySelector(".name").textContent.substring(0, data.length)==data) {
                ChangeKursDisplay(e, "show");
            } else {
                ChangeKursDisplay(e, "hide");
            };
        });
    });
    function CreateKurs(data) {
        const __Kurs = CreateElement(__Kurse, "div", ".item.kurs");
        const __Name = CreateElement(__Kurs, "p", ".name");
        const __Lehrer = CreateElement(__Kurs, "p", ".kurs-lehrer");
        const __Icons = CreateElement(__Kurs, "div", ".icons");
        const __Toggled = CreateElement(__Icons, "div", ".toggled");
        __Kurs.style.height = "36px";
        __Name.textContent = data.fach;
        __Lehrer.textContent = data.lehrer;
        __Toggled.setAttribute("toggled", true);
        __Kurs.addEventListener("click", () => {let t = __Toggled; t.getAttribute("toggled") ? t.removeAttribute("toggled") : t.setAttribute("toggled", true); SetToggleState(__Kurs, __Toggled, t.getAttribute("toggled"));});
    };
    GetSchuldata((data) => {
        const a = (data.Schule.Klassen.current_klassen_info);
        console.log(a);
        if(a) {
            a.GetKurse(a.GetKlasse(data.Schule.Klassen.current)).forEach(e => {CreateKurs(e)});
        };
    });
};
// actions are located on the header and the footer (if screen is too small)
// in this part we declare their query selector and the function to trigger when clicked
const actions = {
    "open-auswahl": () => CreateAuswahl(),
    "refresh-plan": () => ChangeWeek(0),
    "settings": () => CreateSettings()
};
Object.values(document.querySelectorAll(".actions")).forEach(e => {
    Object.values(e.children).forEach(e => {
        if(e.getAttribute("svg")) {
            e.innerHTML += new SVGHandler().CreateSVG(e.getAttribute("svg"));
        };
        if(Object.keys(actions).find(element => element===Object.values(e.classList)[0])) {
            e.addEventListener("click", actions[Object.values(e.classList)[0]]);
        };
    });
});
document.querySelector("#plan-next").addEventListener("click", () => ChangeWeek(1))
document.querySelector("#plan-last").addEventListener("click", () => ChangeWeek(-1))
CreateNewestWeek();
