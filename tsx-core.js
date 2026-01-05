/* ============================================================
   TSXPLORATION 2.0 — LÓGICA PRINCIPAL
   ============================================================ */

/* ------------------------------
   1. SECUENCIA DE INICIO
--------------------------------*/
window.addEventListener("load", () => {
    const boot = document.getElementById("boot-sequence");
    setTimeout(() => {
        boot.style.opacity = "0";
        setTimeout(() => boot.style.display = "none", 800);
    }, 1800);
});
/* ------------------------------
   2. SISTEMA DE IDIOMAS
--------------------------------*/
const db = {
    es: {
        reqBtn: "SOLICITAR ACCESO",
        tagline: "The Solitary Xploration",
        auth: "// AUTENTICACIÓN NEXUS //",
        connect: "Conectar",
        aboutBtn: "i SOBRE TSXPLORATION",
        aboutDesc:
`Fundado por **Ulises Jimenez**. Una visión que nació en 2010 y evolucionó hace 9 años para convertirse en la insignia TS.

Cada ser humano posee una capacidad única, a menudo contenida por los muros del conformismo. TSXPLORATION es una reflexión sobre el universo infinito que habita en la mente.

Si en tu pensamiento puedes transformar un chocolate en una manzana, demuestras que la realidad es moldeable. Al derribar las barreras mentales, ese poder creativo trasciende al mundo físico.

La tecnología actual es la prueba: no es obra de una sola persona, sino la suma de miles de mentes soñando en conjunto.`,
        reqTitle: "SOLICITUD DE ACCESO",
        name: "Nombre / Alias",
        email: "Contacto",
        reason: "Propósito",
        send: "ENVIAR TRANSMISIÓN",
        sent: "SOLICITUD ENVIADA."
    },

    en: {
        reqBtn: "REQUEST ACCESS",
        tagline: "The Solitary Xploration",
        auth: "// NEXUS AUTH //",
        connect: "Connect",
        aboutBtn: "i ABOUT TSXPLORATION",
        aboutDesc:
`Founded by **Ulises Jimenez**. A vision born in 2010 that evolved 9 years ago into the TS insignia.

Every human possesses a unique capacity, often contained by the walls of conformity. TSXPLORATION is a reflection on the infinite universe within the mind.`,
        reqTitle: "ACCESS REQUEST",
        name: "Name / Alias",
        email: "Contact",
        reason: "Purpose",
        send: "TRANSMIT DATA",
        sent: "REQUEST SENT."
    }
};

// Cambiar idioma
function setLanguage(lang) {
    // Validar que el idioma sea uno de los soportados (allowlist)
    if (!db[lang]) lang = "es";
    localStorage.setItem("tsx_lang", lang);
    const t = db[lang];

    document.getElementById("btn-request").innerText = t.reqBtn;
    document.getElementById("txt-tagline").innerText = t.tagline;
    document.getElementById("txt-auth").innerText = t.auth;
    document.getElementById("btn-connect").innerText = t.connect;
    document.getElementById("btn-about").innerText = t.aboutBtn;

    document.getElementById("txt-about-desc").innerText = t.aboutDesc;

    document.getElementById("lbl-req-title").innerText = t.reqTitle;
    document.getElementById("lbl-name").innerText = t.name;
    document.getElementById("lbl-email").innerText = t.email;
    document.getElementById("lbl-reason").innerText = t.reason;
    document.getElementById("btn-send").innerText = t.send;

    document.querySelectorAll(".lang-btn").forEach(b => b.classList.remove("active"));
    document.querySelector(`[data-lang="${lang}"]`).classList.add("active");
}

// Cargar idioma guardado (con validación)
const savedLang = localStorage.getItem("tsx_lang");
setLanguage(db[savedLang] ? savedLang : "es");

// Eventos de idioma
document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

/* ------------------------------
   3. MODALES
--------------------------------*/
function abrirModal(id) {
    const modal = document.getElementById(id);
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("open"), 10);
}

function cerrarModal(id) {
    const modal = document.getElementById(id);
    modal.classList.remove("open");
    setTimeout(() => modal.style.display = "none", 500);
}

document.getElementById("btn-request").onclick = () => abrirModal("requestModal");
document.getElementById("btn-about").onclick = () => abrirModal("manifestoModal");

document.querySelectorAll("[data-close]").forEach(btn => {
    btn.addEventListener("click", () => {
        const modal = btn.closest(".ts-modal");
        cerrarModal(modal.id);
    });
});

/* ------------------------------
   4. LOGIN
--------------------------------*/
document.getElementById("btn-connect").onclick = verificarAcceso;

function verificarAcceso() {
    const val = document.getElementById("passInput").value.trim();
    const err = document.getElementById("error");

    if (val === "TSX2026") {
        sessionStorage.setItem("tsx_auth", "true");
        sessionStorage.setItem("tsx_auth_time", Date.now());
        err.style.display = "none";
        // acción adicional si se requiere (p. ej. redirigir o actualizar UI)
    } else if (val === "TSX-ART") {
        window.location.href = "proyectos.html";
    } else {
        err.style.display = "block";
        document.querySelector(".panel-glass").animate([
            { transform: "translateX(0)" },
            { transform: "translateX(-10px)" },
            { transform: "translateX(10px)" },
            { transform: "translateX(0)" }
        ], { duration: 300 });
    }
}

/* ------------------------------
   5. FORMULARIO NETLIFY
--------------------------------*/
const form = document.getElementById("accessForm");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const btn = document.getElementById("btn-send");
    btn.innerText = "...";
    btn.style.opacity = "0.5";
    btn.disabled = true;

    // Validación y saneamiento (truncar longitudes para protección básica)
    const nombre = (form.elements["nombre"].value || "").trim().slice(0, 200);
    const email = (form.elements["email"].value || "").trim().slice(0, 254);
    const motivo = (form.elements["motivo"].value || "").trim().slice(0, 1000);

    if (!nombre || !email || !motivo) {
        btn.innerText = "FALTAN DATOS";
        btn.style.background = "red";
        btn.disabled = false;
        btn.style.opacity = "1";
        return;
    }

    const formData = new URLSearchParams();
    formData.append("form-name", "solicitud-acceso");
    formData.append("nombre", nombre);
    formData.append("email", email);
    formData.append("motivo", motivo);

    fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
    })
    .then(() => {
        // Mostrar mensaje de éxito de forma segura (textContent)
        const lang = db[localStorage.getItem("tsx_lang")] ? localStorage.getItem("tsx_lang") : "es";
        const msg = document.createElement("h2");
        msg.style.color = "#00ff88";
        msg.style.marginTop = "30px";
        msg.textContent = db[lang].sent;
        // Deshabilitar inputs y añadir el mensaje
        form.querySelectorAll("input, textarea, button").forEach(el => el.disabled = true);
        form.appendChild(msg);
        setTimeout(() => cerrarModal("requestModal"), 2000);
    })
    .catch(() => {
        btn.innerText = "ERROR";
        btn.style.background = "red";
        btn.disabled = false;
        btn.style.opacity = "1";
    });
});

/* ------------------------------
   6. EASTER EGG OMEGA
--------------------------------*/
let buffer = "";

document.addEventListener("keyup", (e) => {
    buffer += e.key.toUpperCase();
    if (buffer.length > 5) buffer = buffer.slice(-5);

    if (buffer === "OMEGA") {
        abrirModal("nuclearModal");
        document.body.classList.add("nuclear-active");
    }
});

document.getElementById("btn-nuclear-stop").onclick = () => {
    cerrarModal("nuclearModal");
    document.body.classList.remove("nuclear-active");
};
