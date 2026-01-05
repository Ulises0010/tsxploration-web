/* ============================================================
   TSX SECURITY — Protección Global del Sistema
   ============================================================ */

// Tiempo máximo de sesión (10 minutos)
const MAX_SESSION_TIME = 10 * 60 * 1000;

// Tiempo máximo de inactividad (5 minutos)
const MAX_INACTIVIDAD = 5 * 60 * 1000;

// Verificar token
const token = sessionStorage.getItem("tsx_auth");
const inicioSesion = sessionStorage.getItem("tsx_auth_time");

// Si no hay token → regresar al login
if (!token || !inicioSesion) {
    window.location.href = "index.html";
}

// Verificar expiración de sesión
const ahora = Date.now();
if (ahora - inicioSesion > MAX_SESSION_TIME) {
    sessionStorage.clear();
    window.location.href = "index.html";
}

// Sistema de inactividad
let tiempoInactividad = 0;

setInterval(() => {
    tiempoInactividad += 1000;

    if (tiempoInactividad >= MAX_INACTIVIDAD) {
        sessionStorage.clear();
        window.location.href = "index.html";
    }
}, 1000);

// Resetear inactividad cuando el usuario hace algo
["mousemove", "keydown", "click", "scroll"].forEach(evento => {
    document.addEventListener(evento, () => {
        tiempoInactividad = 0;
    });
});
