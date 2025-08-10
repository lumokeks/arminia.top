const CACHE = {
    LOGIN: {schulid: 10019573},
    SCHULDATA: {},
    WEEK: 0,
    KLASSE: "9.2"
}, DATE = new Date(), WEEKDAYS = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
function _CE(parent, type, classes) {
    if(!parent) return;
    let e = document.createElement(type);classes = classes.split(".");classes.splice(0, 1);
    classes.forEach(e2 => e.classList.add(e2));
    parent.appendChild(e);
    return e;
};
function remove_words(data) {
    data = `${data}`; const a = Array.from(arguments); a.splice(0, 1);
    for(const word of a) data = data.replaceAll(word, "");
    return data;
};
function http(url, f) {
    fetch(url, {method: "GET"}).then((res) => {
        if(!res.ok) {f({success: false});return;};
        res["text"]().then((res) => {
            if(!res) {f({success: false});return;};
            f({success: true, data: res});
        });
    }).catch(() => f({success: false}));
};
function PlanRequest(a, f, b) {
    const URLS = {
        __base: `https://arminia.top/data/PlanDaten/${CACHE.LOGIN.schulid}/`,
        NewestPlan: "Klassen.xml",
        Plan: `PlanKl${b}.xml`,
        PlanBasis: "SPlanKl_Basis.xml"
    };
    http(`${URLS.__base}${URLS[a]}`, (data) => {
        if(data.success) data.data = new DOMParser().parseFromString(decodeURI(data.data), "text/xml");
        f(data);
    });
};
function ConvertDate(date, data) {
    let d, m, y;
    switch(data) {
        case "vp_to_json":
            d = date.substring(date.length, date.length - 2), m = date.substring(date.length - 2, date.length - 4), y = date.substring(date.length - 4, 0);
            return {year: Number(y), month: Number(m), day: Number(d)};
        case "json_to_date":
            return new Date(`${date.year}-${remove_words(date.month, "0")}-${remove_words(date.day, "0")}`);
        case "json_to_string":
            d = `${date.day}`, m = `${date.month}`, y = `${date.year}`;
            d = "0".repeat(2 - d.length) + d; m = "0".repeat(2 - m.length) + m;
            return `${d}.${m}.${y}`;
        case "date_to_string":
            d = `${date.getDate()}`, m = `${date.getMonth() + 1}`, y = `${date.getFullYear()}`;
            d = "0".repeat(2 - d.length) + d; m = "0".repeat(2 - m.length) + m;
            return `${d}.${m}.${y}`;
        case "string_to_date":
            date = date.split(".");
            return new Date(`${date[2]}-${date[1]}-${date[0]}`);
        case "string_to_vp":
            date = date.split(".");
            return `${date[2]}${date[1]}${date[0]}`;
    };
};
class XMLToInfo {
    constructor(data) {
        this.data = data;
    };
    GetPlanHeaderDaten() {
        return {
            date: ConvertDate(ConvertDate(remove_words(this.data.querySelector("datei").textContent, "PlanKl", ".xml"), "vp_to_json"), "json_to_string"),
            timestamp: this.data.querySelector("zeitstempel").textContent
        };
    };
    GetWPDaten() {
        const t = {};
        let sw = Array.from(this.data.querySelectorAll("Schulwochen > Sw")), ft = Array.from(this.data.querySelectorAll("FreieTage > ft")), kl = Array.from(this.data.querySelectorAll("Klassen > Kl > Kurz"));
        t.ft = ft.map(a => a.textContent); t.kl = kl.map(a => a.textContent);
        t.tpw = Number(this.data.querySelector("BaTageProWoche").textContent);
        t.sw = []; sw.forEach(e => {
            let von = ConvertDate(e.getAttribute("SwDatumVon"), "string_to_date"), bis = ConvertDate(e.getAttribute("SwDatumBis"), "string_to_date"), date = von, days = [];
            for(let i = 0; i < t.tpw; i++) {days.push(ConvertDate(date, "date_to_string"));date.setDate(date.getDate() + 1);};
            t.sw.push({von: e.getAttribute("SwDatumVon"), bis: e.getAttribute("SwDatumBis"), type: e.getAttribute("SwWo"), days: days});
        });
        return t;
    };
    GetKlasse(name) {
        if(!name) return;
        return Array.from(this.data.querySelectorAll("Klassen > Kl")).find(e => e.querySelector("Kurz").textContent===name);
    };
    GetZusatzInfo() {
        return Array.from(this.data.querySelectorAll("ZusatzInfo > ZiZeile")||[]).map(e => e.textContent);
    };
    GetPlan(klasse) {
        if(!klasse) return;
        let plan = [], stunden = klasse.querySelectorAll("Pl > Std");
        stunden.forEach(e => {
            let t = {stunde: {}, lehrer: {}, fach: {}, raum: {}}, qs = (a) => e.querySelector(a), ch = (e, a, t) => {if(e.getAttribute(a + "Ae")) t.changed = true;};
            let st = qs("St"), le = qs("Le"), fa = qs("Fa"), ra = qs("Ra"), IF = qs("If");
            t.stunde.data = st.textContent;
            t.stunde.beginn = qs("Beginn").textContent;
            t.lehrer.data = le.textContent;
            t.fach.data = fa.textContent;
            t.raum.data = ra.textContent;
            if(IF) {t.info = {data: IF.textContent};};
            ch(le, "Le", t.lehrer);ch(fa, "Fa", t.fach);ch(ra, "Ra", t.raum);
            plan.push(t);
        });
        return plan;
    };
};
function CreateDay(i, data, date) {
    const __day__wrapper = document.querySelector(`[day_i="${i}"]`), __day__container = __day__wrapper.querySelector(".day--container"), __day_plan__container = __day__container.querySelector(".day-plan--container"),
    FULLDATE = __day__wrapper.querySelector("span.content.full-date"), TIMESTAMP = __day__wrapper.querySelector("span.content.timestamp");
    if(data.success) {
        console.log(data.data);
        let xti = new XMLToInfo(data.data), WPD = xti.GetPlanHeaderDaten(), klasse = xti.GetKlasse(CACHE.KLASSE), plan = xti.GetPlan(klasse), zi = xti.GetZusatzInfo();
        FULLDATE.textContent = WPD.date;
        TIMESTAMP.textContent = WPD.timestamp;
        plan.forEach(e => {
            const __plan_stunde__container = _CE(__day_plan__container, "div", ".plan-stunde--container"), __stunden_info__container = _CE(__plan_stunde__container, "div", ".stunden-info--container"),
            __content_stunde__container = _CE(__stunden_info__container, "div", ".content-stunde--container"), ce = (a, b, c) => {let span = _CE(a, "span", `.content.stunde-${b}`); span.textContent = c.data; if(c.changed) span.classList.add("stunde-changed")};
            ce(__content_stunde__container, "stunde", e.stunde);_CE(__content_stunde__container, "span", ".content.stunde-uhrzeit").textContent = e.stunde.beginn;
            ce(__stunden_info__container, "lehrer", e.lehrer);
            ce(__stunden_info__container, "fach", e.fach);
            ce(__stunden_info__container, "raum", e.raum);
            if(e.info) {
                const __stunden_zusatz_info__container = _CE(__plan_stunde__container, "div", ".stunden-zusatz-info--container");
                _CE(__stunden_zusatz_info__container, "span", ".content").textContent = e.info.data;
            };
        });
        if(zi.length>0) {
            const __day_zusatz_info__wrapper = _CE(__day__container, "div", ".day-zusatz-info--wrapper"), __day_zusatz_info__container = _CE(__day_zusatz_info__wrapper, "div", ".day-zusatz-info--container");
            zi.forEach(e => {
                _CE(__day_zusatz_info__container, "span", ".content").textContent = e;
            });
        };
    } else {TIMESTAMP.textContent = "nicht vorhanden";FULLDATE.textContent = date;};
};
function LoadWeek(i) {
    if(i>CACHE.SCHULDATA.schulwochen.length - 1) i = CACHE.SCHULDATA.schulwochen.length - 1; else if(i<0) i = 0;
    CACHE.WEEK = i;
    let week = CACHE.SCHULDATA.schulwochen[i], plancontainers = Array.from(document.querySelectorAll(".day-plan--container")), timestamps = Array.from(document.querySelectorAll("span.content.timestamp")),
    zusatzinfos = Array.from(document.querySelectorAll(".day-zusatz-info--wrapper")), week_von = document.querySelector(".week-timespan > span.content.week-1"), week_bis = document.querySelector(".week-timespan > span.content.week-2"),
    week_type = document.querySelector(".week-type > span.content");
    week_von.textContent = week.days[0];week_bis.textContent = week.days[week.days.length - 1];week_type.textContent = week.type;
    plancontainers.forEach(e => e.innerHTML = "");timestamps.forEach(e => e.textContent = "wird geladen...");zusatzinfos.forEach(e => e.remove());
    for(const e of week.days) {
        let i2 = week.days.findIndex(e2 => e2===e);
        PlanRequest("Plan", (data) => CreateDay(i2, data, e), ConvertDate(e, "string_to_vp"));
    };
};
(function() {
    function InitDay(i) {
        const __day__wrapper = _CE(document.querySelector(".plan--container"), "div", ".item.day.day--wrapper"), __day__container = _CE(__day__wrapper, "div", ".day--container"),
        __day_title__wrapper = _CE(__day__container, "div", ".day-title--wrapper"), __day_title__container = _CE(__day_title__wrapper, "div", ".day-title--container"), __date_info = _CE(__day_title__container, "div", ".date-info"),
        WEEKDAY = _CE(__date_info, "span", ".content.weekday"), FULLDATE = _CE(__date_info, "span", ".content.full-date"), __plan_info = _CE(__day_title__container, "div", ".plan-info"), TIMESTAMP = _CE(__plan_info, "span", ".content.timestamp"),
        __day_plan__wrapper = _CE(__day__container, "div", ".day-plan--wrapper"), __day_plan__container = _CE(__day_plan__wrapper, "div", ".day-plan--container");
        __day__wrapper.setAttribute("day_i", i);
        WEEKDAY.textContent = WEEKDAYS[i];
        FULLDATE.textContent = "N.V.";
        TIMESTAMP.textContent = "nicht vorhanden";
    };
    PlanRequest("PlanBasis", (data) => {
        if(data.success) {
            const xti = new XMLToInfo(data.data), WPD = xti.GetWPDaten();
                CACHE.SCHULDATA.schulwochen = WPD.sw;
                CACHE.SCHULDATA.freietage = WPD.ft;
                CACHE.SCHULDATA.tageprowoche = WPD.tpw;
                CACHE.SCHULDATA.klassen = WPD.kl;
                for(let i = 0; i < CACHE.SCHULDATA.tageprowoche; i++) InitDay(i);
                PlanRequest("NewestPlan", (data) => {
                    if(data.success) {
                        xti.data = data.data;
                        const {date} = xti.GetPlanHeaderDaten();
                        CACHE.WEEK = CACHE.SCHULDATA.schulwochen.findIndex(e => e.days.find(e2 => e2===date));
                        console.log(data.data, xti.GetPlan(xti.GetKlasse("8.2")));
                    LoadWeek(CACHE.WEEK);
                };
            });
        };
    });
    document.querySelectorAll("[action]").forEach(e => {
        let a = e.getAttribute("action"), f;
        if(a.split("_")[0]==="loadweek") f = () => LoadWeek(CACHE.WEEK + Number(a.split("_")[1])); else {
            if(a==="home") f = () => location.href = "https://arminia.top";
            else if(a==="refresh") f = () => LoadWeek(CACHE.WEEK);
        };
        e.addEventListener("click", f);
    });

})();
