const langs = {
    "DE": "Willkommen",
    "FR": "Bienvenue",
    "GB": "Welcome",
    "ES": "Bienvenida",
    "PL": "Powitanie",
    "IT": "Bienvenuta",
    "JP": "いらっしゃいませ"
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
function AnimatePopup(container) {
    const T = {};
    T.show = () => {
        Animate(container, {}, {top: "50%"}, 100);
        Animate(container, {}, {opacity: 1}, 200);
    };
    T.close = () => {
        Animate(container, {}, {opacity: 0}, 100);
        Animate(container, {}, {top: "60%"}, 200, () => container.remove());
    };
    return T
};
function CreateLogin() {
    const __Login = CreateElement(document.body, "div", "#login");
    __Login.classList.add("popup");
    __Login.classList.add("center");
    const __TitleContainer = CreateElement(__Login, "div", ".title.container");
    const __Title = CreateElement(__TitleContainer, "div", ".title");
    const __Close = CreateElement(__TitleContainer, "div", ".close.symbol");
    __Close.innerHTML = new SVGHandler().CreateSVG("cancel");
    const __ContentContainer = CreateElement(__Login, "div", ".content.container");
    const __Form = CreateElement(__ContentContainer, "div", ".form");
    const __Fields = CreateElement(__Form, "div", ".fields");
    const __ButtonLogin = CreateElement(__Form, "div", ".button.login");
    const __Icon = CreateElement(__ButtonLogin, "div", ".icon");
    __Icon.innerHTML = new SVGHandler().CreateSVG("login");
    const __Span = CreateElement(__ButtonLogin, "span");

    __Title.textContent = "Login to your account";
    __Span.textContent = "Login";

    const anim = AnimatePopup(__Login, __Close);
    anim.show();
    __Close.addEventListener("click", () => anim.close());

    __ButtonLogin.addEventListener("mouseenter", () => Animate(__ButtonLogin, {}, {background: "hsl(216, 60%, 56%)"}, 100));
    __ButtonLogin.addEventListener("mouseleave", () => Animate(__ButtonLogin, {}, {background: "hsl(216, 60%, 46%)"}, 100));
    __ButtonLogin.addEventListener("click", () => {
        const a = __Fields.querySelector(".accountname > input").value;
        const p = __Fields.querySelector(".accountpassword > input").value;
        new HTTP().HTTPRequest("/login", (xhr) => {
            console.log(xhr.responseText);
        }, (xhr) => {
            xhr.setRequestHeader("a", btoa(a));
            xhr.setRequestHeader("p", btoa(p));
        });
    });
    
    function CreateField(input_type, content_data) {
        const __Field = CreateElement(__Fields, "div", `.field.account${input_type}`);
        const __Content = CreateElement(__Field, "p", `.content.content-${input_type}`);
        __Content.textContent = content_data;
        const __Input = CreateElement(__Field, "input", `.${input_type}`);
    };
    CreateField("name", "Name");
    CreateField("password", "Password");
};
function CreateHelp() {
    const __Help = CreateElement(document.body, "div", "#help");
    __Help.classList.add("popup");
    __Help.classList.add("center");
    const __TitleContainer = CreateElement(__Help, "div", ".title.container");
    const __Title = CreateElement(__TitleContainer, "div", ".title");
    const __Close = CreateElement(__TitleContainer, "div", ".close.symbol");
    __Close.innerHTML = new SVGHandler().CreateSVG("cancel");
    const __ContentContainer = CreateElement(__Help, "div", ".content.container");
    const __Data = CreateElement(__ContentContainer, "p");

    __Title.textContent = `What is ${location.host}?`
    __Data.innerHTML = `${location.host} is a collection of useful services which are designed in a comical manner. If you have been asigned an account, you are welcome to participate in this fun journey to expand this website!`;

    const anim = AnimatePopup(__Help);
    anim.show();
    __Close.addEventListener("click", () => anim.close());
};

document.querySelector(".help.symbol").addEventListener("click", () => CreateHelp());

const login = document.querySelector(".login");
login.addEventListener("mouseenter", () => Animate(login, {}, {background: "hsl(133, 38%, 42%)"}, 100));
login.addEventListener("mouseleave", () => Animate(login, {}, {background: "hsl(133, 38%, 32%)"}, 100));
login.addEventListener("click", () => CreateLogin());

Object.values(document.querySelectorAll("[icon]")).forEach(e => {
    e.innerHTML = new SVGHandler().CreateSVG(e.getAttribute("icon"));
});