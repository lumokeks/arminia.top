let __DATA = {schulwochen: [], freietage: [], klassen: [], kurse: {}}, __WEEK = 0, __KLASSE = localStorage.getItem("klasse"), __RUN_ID = 0, __SVGS = [];
let weekdays = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
let months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
let o_k = Object.keys, o_v = Object.values, a_f = Array.from, http = (url, f) => {
    let id = __log(undefined, ["fetching", url]);
    fetch(url, {
        method: "GET"
    }).then((res) => {
        if(res.ok) {__log(id, ["successfully fetched"]);res["text"]().then(e => f({success: true, data: e}));}
        else {__log(id, ["could not fetch"]);f({success: false});};
    });
}, __log = (id, data) => {
    if(!id) {__RUN_ID++; id = __RUN_ID;};
    console.log(`${new Date().toLocaleTimeString()} | ID: ${id}`, ...data);
    return id;
};
function ConvertDate(a1, type) {
    let d = 0, m = 0, y = 0;
    switch(type) {
        case "vp_to_datestr":
            d = a1.substring(a1.length, a1.length - 2), m = a1.substring(a1.length - 2, a1.length - 4), y = a1.substring(a1.length - 4, 0);
            return [`${"0".repeat(2 - d.length)}${d}`, `${"0".repeat(2 - m.length)}${m}`, y].join(".");
        case "date_to_datestr":
            d = `${a1.getDate()}`, m = `${a1.getMonth() + 1}`, y = `${a1.getFullYear()}`;
            return [`${"0".repeat(2 - d.length)}${d}`, `${"0".repeat(2 - m.length)}${m}`, y].join(".");
        case "datestr_to_date":
            a1 = a1.split("."); d = a1[0], m = a1[1], y = a1[2];
            return new Date([y, m, d].join("-"));
        case "datestr_to_vp":
            a1 = a1.split("."); d = a1[0], m = a1[1], y = a1[2];
            return [y, m, d].join("");
    };
};
class PlanRequest {
    constructor(school, auth, type, f, a) {
        if(!school||!auth) return;
        let url = `https://arminia.top/data/PlanDaten/${school}/`, token = "Basic " + btoa(`${auth.name}:${auth.password}`), URLS = {
            "p": `PlanKl${a}.xml`,
            "np": "Klassen.xml",
            "wp": "SPlanKl_Basis.xml"
        };
        http(`${url}${URLS[type]}`, (a) => {
            if(a.success) f(new DOMParser().parseFromString(decodeURI(a.data), "text/xml"));
            else f(undefined);
        });
    };
}
class XMLToInfo {
    constructor(data) {
        this.data = data;
    };
    GetKlasse(name) {
        return a_f(this.data.querySelectorAll("Kl")).find(e => e.querySelector("Kurz").textContent===name);
    };
    GetPlan(klasse) {
        let t = [];
        klasse.querySelectorAll("Pl > Std").forEach(e => {
            let ST = e.querySelector("St"), LE = e.querySelector("Le"), FA = e.querySelector("Fa"), RA = e.querySelector("Ra"), IF = e.querySelector("If"), NR = e.querySelector("Nr");
            t.push({
                stunde: {changed: false, data: ST.textContent},
                lehrer: {changed: LE.getAttribute("LeAe"), data: LE.textContent},
                fach: {changed: FA.getAttribute("FaAe"), data: FA.textContent},
                raum: {changed: RA.getAttribute("RaAe"), data: RA.textContent},
                info: {changed: false, data: (IF&&IF.textContent||!IF&&null)},
                nr: {changed: false, data: (NR&&NR.textContent||!NR&&null)}
            });
        });
        return t;
    };
    GetKurse(klasse) {
        let t = [];
        klasse.querySelectorAll("Unterricht > Ue > UeNr").forEach(e => t.push({lehrer: e.getAttribute("UeLe"), fach: e.getAttribute("UeFa"), kurs: e.getAttribute("UeGr"),
            enabled: true, uenr: e.textContent}));
        return t;
    };
    GetUnterrichtIndex(klasse, le, fa) {
        return a_f(klasse.querySelectorAll("Unterricht > Ue > UeNr")).find(e => e.getAttribute("UeLe")===le&&e.getAttribute("UeGr")===fa);
    };
    GetPlanHeaderDaten() {
        let t = {};
        t.zeitstempel = this.data.querySelector("Kopf > zeitstempel").textContent;
        let pdate = this.data.querySelector("Kopf > DatumPlan").textContent.split(", ");
        t.day = pdate[0];
        t.date = pdate[1];
        t.c_date = this.data.querySelector("datei").textContent.replaceAll("PlanKl", "").replaceAll(".xml", "");
        return t;
    };
    GetWPDaten() {
        let t = {};
        t.tpw = Number(this.data.querySelector("BaTageProWoche").textContent);
        t.sw = [];this.data.querySelectorAll("Schulwochen > Sw").forEach(e => {
            let date = ConvertDate(e.getAttribute("SwDatumVon"), "datestr_to_date"), days = [];
            for(let i = 0; i < t.tpw; i++) {days.push(ConvertDate(date, "date_to_datestr"));date.setDate(date.getDate() + 1);};
            t.sw.push({von: e.getAttribute("SwDatumVon"), bis: e.getAttribute("SwDatumBis"), type: e.getAttribute("SwWo"), days: days});
        });
        t.ft = [];this.data.querySelectorAll("FreieTage > ft").forEach(e => t.ft.push(e.textContent));
        let t2 = a_f(this.data.querySelectorAll("Kl > Kurz"));t2.forEach((a, b, c) => c[b] = a.textContent);
        t.klassen = t2;
        return t;
    };
}
class SVG {
    constructor(a, b) {
        this.svgs = {"close": "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"}
        let a2 = document.createElement("div"); a2.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="${this.svgs[b]}"/></svg>`;
        a.appendChild(a2.querySelector("svg"));
    };
}
function _CE(parent, type, classes) {
    if(!parent) return;
    let e = document.createElement(type);classes = classes.split(".");classes.splice(0, 1);
    classes.forEach(e2 => e.classList.add(e2));
    parent.appendChild(e);
    return e;
};
function CreateDay(data) {
    let xti = new XMLToInfo(data.xml), __item_day = document.querySelector(`.item.day:nth-of-type(${data.index + 1})`), __day_titlecontainer = __item_day.querySelector(".day-title--container"),
    __title_date = __day_titlecontainer.querySelector(".content.day-title--date"), __title_timestamp = __day_titlecontainer.querySelector(".content.day-title--timestamp"),
    __day_plancontainer = __item_day.querySelector(".day-plan--container");__day_plancontainer.innerHTML = "";
    if(data.xml) {
        let header_data = xti.GetPlanHeaderDaten();
        __title_date.textContent = header_data.date; __title_timestamp.textContent = header_data.zeitstempel;
        xti.GetPlan(xti.GetKlasse(__KLASSE)).forEach(e => {
            let __plan_stundecontainer = _CE(__day_plancontainer, "div", ".plan-stunde--container.flex.column");__plan_stundecontainer.setAttribute("lehrer", e.lehrer.data);__plan_stundecontainer.setAttribute("fach", e.fach.data);
            if(e.nr.data) {__plan_stundecontainer.setAttribute("i", e.nr.data);let a = __DATA.kurse[__KLASSE].find(e => e.uenr===e.nr.data);if(a&&!a.enabled) __plan_stundecontainer.style.display = "none";};
            let __stunden_maininfocontainer = _CE(__plan_stundecontainer, "div", ".stunden-main-info--container.flex");
            ["stunde", "lehrer", "fach", "raum"].forEach(e2 => {
                let __e = _CE(__stunden_maininfocontainer, "span", `.content.${e2}`);
                __e.textContent = e[e2].data;
                if(e[e2].changed) __e.classList.add("changed");
            });
            if(e.info.data.length>0) {
                let __stunden_infocontainer = _CE(__plan_stundecontainer, "div", ".stunden-info--container.flex");
                let __infocontent = _CE(__stunden_infocontainer, "span", ".content");
                __infocontent.textContent = e.info.data;
            };
        });
    } else {
        let a = data.date.split(".");
        __title_date.textContent = `${a[0]}. ${months[Number(a[1]) - 1]} ${a[2]}`;
    };
};
function LoadWeek(i) {
    let week_first = document.querySelector(".week.week-first"), week_last = document.querySelector(".week.week-last"), week_type = document.querySelector(".week-type"), day_plan__containers = document.querySelectorAll(".day-plan--container"),
    timestamps = document.querySelectorAll(".content.day-title--timestamp"), title_dates = document.querySelectorAll(".content.day-title--date");
    day_plan__containers.forEach(e => {
        e.innerHTML = "";})
    timestamps.forEach(e => e.textContent = "wird geladen..."); // lang
    title_dates.forEach(e => e.textContent = "wird geladen..."); // lang
    let week = __DATA.schulwochen[i];
    week_first.textContent = week.days[0];week_last.textContent = week.days[week.days.length - 1];week_type.textContent = week.type;
    for(let e of week.days) {
        CreateDay({index: week.days.findIndex(e2 => e2===e), date: e});
        new PlanRequest(10019573, {name: "schueler", password: "sm37721"}, "p", (a) => {
            (function() {
                if(!a||i!==__WEEK) {timestamps[week.days.findIndex(e2 => e2===e)].textContent = "nicht vorhanden";return;};
                CreateDay({index: week.days.findIndex(e2 => e2===e), xml: a});
            })();
        }, ConvertDate(e, "datestr_to_vp"));
    };
};
function GetWeekFromVPDate(date) {return __DATA.schulwochen.findIndex(e => e.days.find(e2 => e2===date));};
(function() {
    let id = __log(0, "Initialising"), _a = Date.now();
    function InitDay(i) {
        let __item_day = _CE(document.querySelector(".plan--container"), "div", ".item.day.flex.column");
        let __day_titlecontainer = _CE(__item_day, "div", ".day-title--container.flex.baseline");
        let __title_day = _CE(__day_titlecontainer, "span", ".content.day-title--day.flex.font-normal");
        let __title_date = _CE(__day_titlecontainer, "span", ".content.day-title--date.flex.font-normal");
        let __title_timestamp = _CE(__day_titlecontainer, "span", ".content.day-title--timestamp.flex.font-normal");
        let __day_plancontainer = _CE(__item_day, "div", ".day-plan--container.flex.column");
        __title_day.textContent = weekdays[i];
        __title_date.textContent = "N.V."; // lang
        __title_timestamp.textContent = "nicht vorhanden"; // lang
    };
    new PlanRequest(10019573, {name: "schueler", password: "sm37721"}, "wp", (a) => {
        (function() {
            if(!a) {console.log("data could not be fetched"); return;};
            let xti = new XMLToInfo(a), data = xti.GetWPDaten();
            __DATA.schulwochen = data.sw;
            __DATA.freietage = data.ft;
            __DATA.klassen = data.klassen;
            __DATA.tageprowoche = data.tpw;
            __KLASSE = __KLASSE||__DATA.klassen[0];
            for(let i = 0; i < data.tpw; i++) {InitDay(i);};
        })();
    });
    new PlanRequest(10019573, {name: "schueler", password: "sm37721"}, "np", (a) => {
        (function() {
            if(!a) {console.log("data could not be fetched"); return;};
            let xti = new XMLToInfo(a), header_data = xti.GetPlanHeaderDaten();
            __WEEK = GetWeekFromVPDate(ConvertDate(header_data.c_date, "vp_to_datestr"));let b = localStorage.getItem("kurse");if(b) b = JSON.parse(b);
            __DATA.klassen.forEach(e => {
                __DATA.kurse[e] = xti.GetKurse(xti.GetKlasse(e));if(b&&b[e]) {
                    __DATA.kurse[e].forEach(e2 => e2.enabled = b[e].find(e3 => e3.uenr===e2.uenr).enabled);
                };
            });
            __log(id, `Initialisation complete (${Date.now() - _a}ms)`);
            LoadWeek(__WEEK);
        })();
    });
})();
document.querySelector(".arrow--wrapper > .arrow--container.arrow-left").addEventListener("click", () => {if(__WEEK>0) {__WEEK--;LoadWeek(__WEEK);};});
document.querySelector(".arrow--wrapper > .arrow--container.arrow-right").addEventListener("click", () => {if(__WEEK<__DATA.schulwochen.length - 1) {__WEEK++;LoadWeek(__WEEK);};});
function ApplyButtonAnimations(e) {
    e.addEventListener("mouseleave", () => e.style.transform = "translateY(0%)");
    e.addEventListener("mouseup", () => e.style.transform = "translateY(0%)");
    e.addEventListener("mousedown", () => e.style.transform = "translateY(2%)");
    e.addEventListener("touchend", () => e.style.transform = "translateY(0%)");
    e.addEventListener("touchstart", () => e.style.transform = "translateY(2%)");
};
document.querySelectorAll("button").forEach(e => ApplyButtonAnimations(e));
function CreatePopup(title, seed) {
    let __popup_wrapper = _CE(document.querySelector(".popup--insert"), "div", ".popup--wrapper.fixed"), __popup_container = _CE(__popup_wrapper, "div", `.popup--container.flex.column.${seed}`),
    __title_container = _CE(__popup_container, "div", ".title--container.flex.y-center"), __title = _CE(__title_container, "div", ".title"), __title_content = _CE(__title, "span", ".content.font-bold"),
    __close = _CE(__title_container, "button", ".close"), __close_svg = new SVG(__close, "close"), __content_container = _CE(__popup_container, "div", ".content--container.flex.column");__title_content.textContent = title;
    function _close() {__popup_container.style.transition = "transform 1.6s ease, opacity 0.2s ease";__popup_container.style.transform = "scale(0)";__popup_container.style.opacity = "0";
        if(document.querySelectorAll(".popup--container").length===1) {document.querySelector(".shadow--container").style.opacity = "0";setTimeout(() => __popup_wrapper.remove(), 100)};
        if(seed==="kurse") {
            document.querySelectorAll(".plan-stunde--container").forEach(e => {let a = __DATA.kurse[__KLASSE].find(e2 => e2.uenr===e.getAttribute("i")); if(a&&!a.enabled) e.style.display = "none"; else e.style.display = "flex";});
            localStorage.setItem("kurse", JSON.stringify(__DATA.kurse));
        };
    };
    __close.addEventListener("click", _close);
    let seeds = {
        "klassen": () => {__DATA.klassen.forEach(e => {
            let a = _CE(__content_container, "button", ".item.klasse.flex"), b = _CE(a, "div", ".klasse--container.flex.y-center"), c = _CE(b, "span", ".content.flex.font-bold");
            c.textContent = e;
            a.addEventListener("click", () => {__KLASSE = e; localStorage.setItem("klasse", __KLASSE); LoadWeek(__WEEK); _close();});
        });},
        "kurse": () => {
            let __a = _CE(__popup_container, "div", ".specify--wrapper.flex"), __b = _CE(__a, "div", ".specify--container.flex.x-center"),
            __c = _CE(__b, "button", ".specify.alle--container"), __d = _CE(__b, "button", ".specify.keine--container");
            __c.textContent = "Alle";__d.textContent = "Keine"; // lang
            __c.setAttribute("set_status", true);__d.setAttribute("set_status", false);
            [__c, __d].forEach(a => a.addEventListener("click", () => __content_container.querySelectorAll(".toggle").forEach(e => {update_kurse(null, a.getAttribute("set_status"));e.setAttribute("status", a.getAttribute("set_status"));})));
            __DATA.kurse[__KLASSE].forEach(e => {
                let a = _CE(__content_container, "button", ".item.kurs.flex"), b = _CE(a, "div", ".kurs--container.flex.y-center"), c = _CE(b, "span", ".content.flex.font-bold"),
                d = _CE(b, "span", ".content.flex.font-normal"), f = _CE(b, "div", ".toggle");c.textContent = e.kurs||e.fach;d.textContent = `@${e.lehrer}`;
                f.setAttribute("status", __DATA.kurse[__KLASSE].find(e2 => e2===e).enabled);a.addEventListener("click", () => {f.setAttribute("status", (f.getAttribute("status")==="true"&&"false"||"true"));update_kurse(e, f.getAttribute("status"));})
            });
            function update_kurse(e, s) {s = (s==="false"&&false||s==="true"&&true);
                if(e) e.enabled = s; else
                __DATA.kurse[__KLASSE].forEach(e => e.enabled = s);
            };
        }
    };
    seeds[seed]();
    __popup_container.querySelectorAll("button").forEach(e => ApplyButtonAnimations(e));
    setTimeout(() => {
        __popup_container.style.opacity = "1";__popup_container.style.transition = "transform 0.2s ease, opacity 0.2s ease";__popup_container.style.transform = "scale(1)";
        document.querySelector(".shadow--container").style.opacity = "1";
    }, 0);
};
let actions = {klassen: () => CreatePopup("Klassenauswahl", "klassen"), kurse: () => CreatePopup("Kursauswahl", "kurse"), home: () => location.href = "https://arminia.top/", refresh: () => LoadWeek(__WEEK)};
o_k(actions).forEach(e => document.querySelectorAll(`[_=${e}]`).forEach(e2 => e2.addEventListener("click", () => actions[e]())));
