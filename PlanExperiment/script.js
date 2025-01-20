const Data = {Schule: {}}
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
            "Plan": "/Plan/daten/PlanKl$1.xml",
            "NewestPlan": "/Plan/daten/Klassen.xml",
            "SchulData": "/Plan/daten/SPlanKl_Basis.xml"
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
        const xml = xhr.responseXML;
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
                        const xml = xhr.responseXML;
                        days.push({date: d, xml: xml});
                        if(days.length===s.days.length) {
                            CreateDays();
                            // document.querySelectorAll(".date > span.date")[0].textContent = TransformPlanDate(s.days[0].replaceAll("-", ".")).replaceAll("-", ".");
                            // document.querySelectorAll(".date > span.date")[1].textContent = TransformPlanDate(s.days[s.days.length - 1].replaceAll("-", ".")).replaceAll("-", ".");
                            // document.querySelector(".date.container > .woche").textContent = s.type;
                        };
                    });
                });
            };
        });
    });
};
function ChangeWeek(n) {
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
    const http = new HTTP();
    http.RequestNewestPlan({schule: 10019573, name: "schueler", password: "sm37721"}, (xhr) => {
        const xml = xhr.responseXML;
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
