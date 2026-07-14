const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Configuración de Express
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Ruta del archivo JSON
const rutaPartidas = path.join(
    __dirname,
    "data",
    "partidas.json"
);

// Estado de la partida actual
let nombreJugador = "";
let numeroSecreto = 0;
let intentos = 0;
let partidaTerminada = false;
let puntaje = 0;
let mensaje = "";

// Leer partidas
function leerPartidas() {
    const contenido = fs.readFileSync(
        rutaPartidas,
        "utf-8"
    );

    return JSON.parse(contenido);
}

// Guardar partidas
function guardarPartidas(partidas) {
    fs.writeFileSync(
        rutaPartidas,
        JSON.stringify(partidas, null, 4)
    );
}

// Guardar una partida terminada
function registrarPartida() {
    const partidas = leerPartidas();

    const fecha = new Date().toLocaleString("es-CL");

    partidas.push({
        nombre: nombreJugador,
        puntaje: puntaje,
        fecha: fecha
    });

    guardarPartidas(partidas);
}

// Reiniciar variables del juego
function reiniciarJuego() {
    nombreJugador = "";
    numeroSecreto = 0;
    intentos = 0;
    partidaTerminada = false;
    puntaje = 0;
    mensaje = "";
}

// Página principal
app.get("/", (req, res) => {
    reiniciarJuego();

    res.render("inicio", {
        titulo: "Adivina el número",
        mensaje: ""
    });
});

// Comenzar partida
app.post("/comenzar", (req, res) => {
    const nombre = req.body.nombre;

    if (!nombre || nombre.trim() === "") {
        return res.render("inicio", {
            titulo: "Adivina el número",
            mensaje: "Debe ingresar su nombre."
        });
    }

    nombreJugador = nombre.trim();
    numeroSecreto = Math.floor(Math.random() * 10) + 1;
    intentos = 0;
    puntaje = 0;
    partidaTerminada = false;
    mensaje = "Ingrese un número entre 1 y 10.";

    res.redirect("/jugar");
});

// Mostrar juego
app.get("/jugar", (req, res) => {
    if (nombreJugador === "") {
        return res.redirect("/");
    }

    res.render("jugar", {
        titulo: "Jugar",
        nombreJugador,
        intentos,
        intentosRestantes: 5 - intentos,
        mensaje,
        partidaTerminada,
        puntaje,
        numeroSecreto
    });
});

// Procesar intento
app.post("/jugar", (req, res) => {
    if (nombreJugador === "") {
        return res.redirect("/");
    }

    if (partidaTerminada) {
        return res.redirect("/jugar");
    }

    const numeroIngresado = Number(req.body.numero);

    if (
        Number.isNaN(numeroIngresado) ||
        numeroIngresado < 1 ||
        numeroIngresado > 10
    ) {
        mensaje = "Debe ingresar un número entre 1 y 10.";

        return res.redirect("/jugar");
    }

    intentos++;

    if (numeroIngresado === numeroSecreto) {
        partidaTerminada = true;

        if (intentos === 1) {
            puntaje = 3;
        } else {
            puntaje = 1;
        }

        mensaje = "¡Adivinaste el número!";

        registrarPartida();
    } else if (intentos === 5) {
        partidaTerminada = true;
        puntaje = 0;

        mensaje = "No lograste adivinar el número.";

        registrarPartida();
    } else if (numeroIngresado < numeroSecreto) {
        mensaje = "El número secreto es mayor.";
    } else {
        mensaje = "El número secreto es menor.";
    }

    res.redirect("/jugar");
});

// Historial general
app.get("/historial", (req, res) => {
    const partidas = leerPartidas();

    let partidasGanadas = 0;
    let partidasPerdidas = 0;
    let puntajeTotal = 0;

    for (const partida of partidas) {
        puntajeTotal += partida.puntaje;

        if (partida.puntaje > 0) {
            partidasGanadas++;
        } else {
            partidasPerdidas++;
        }
    }

    res.render("historial", {
        titulo: "Historial",
        partidas,
        totalPartidas: partidas.length,
        partidasGanadas,
        partidasPerdidas,
        puntajeTotal
    });
});

// Formulario historial personal
app.get("/historial-personal", (req, res) => {
    res.render("historial-personal", {
        titulo: "Historial personal",
        nombreBuscado: "",
        partidasJugador: [],
        totalPartidas: 0,
        puntajeAcumulado: 0,
        promedio: 0,
        busquedaRealizada: false,
        mensaje: ""
    });
});

// Buscar historial personal
app.post("/historial-personal", (req, res) => {
    const nombreBuscado = req.body.nombre.trim();
    const partidas = leerPartidas();

    const partidasJugador = partidas.filter(
        partida =>
            partida.nombre.toLowerCase() ===
            nombreBuscado.toLowerCase()
    );

    let puntajeAcumulado = 0;

    for (const partida of partidasJugador) {
        puntajeAcumulado += partida.puntaje;
    }

    let promedio = 0;

    if (partidasJugador.length > 0) {
        promedio =
            puntajeAcumulado / partidasJugador.length;
    }

    res.render("historial-personal", {
        titulo: "Historial personal",
        nombreBuscado,
        partidasJugador,
        totalPartidas: partidasJugador.length,
        puntajeAcumulado,
        promedio,
        busquedaRealizada: true,
        mensaje:
            partidasJugador.length === 0
                ? "No se encontraron partidas para ese jugador."
                : ""
    });
});

// Eliminar historial de un jugador
app.post("/eliminar-jugador", (req, res) => {
    const nombre = req.body.nombre.trim();
    const partidas = leerPartidas();

    const partidasActualizadas = partidas.filter(
        partida =>
            partida.nombre.toLowerCase() !==
            nombre.toLowerCase()
    );

    guardarPartidas(partidasActualizadas);

    res.render("historial-personal", {
        titulo: "Historial personal",
        nombreBuscado: "",
        partidasJugador: [],
        totalPartidas: 0,
        puntajeAcumulado: 0,
        promedio: 0,
        busquedaRealizada: false,
        mensaje: `Se eliminó el historial de ${nombre}.`
    });
});

// Ranking
app.get("/ranking", (req, res) => {
    const partidas = leerPartidas();
    const ranking = [];

    for (const partida of partidas) {
        const jugadorExistente = ranking.find(
            jugador =>
                jugador.nombre.toLowerCase() ===
                partida.nombre.toLowerCase()
        );

        if (jugadorExistente) {
            jugadorExistente.puntaje += partida.puntaje;
        } else {
            ranking.push({
                nombre: partida.nombre,
                puntaje: partida.puntaje
            });
        }
    }

    ranking.sort((a, b) => b.puntaje - a.puntaje);

    res.render("ranking", {
        titulo: "Ranking",
        ranking
    });
});

// Configuración
app.get("/configuracion", (req, res) => {
    res.render("configuracion", {
        titulo: "Configuración",
        mensaje: ""
    });
});

// Reiniciar historial completo
app.post("/reiniciar-historial", (req, res) => {
    guardarPartidas([]);

    res.render("configuracion", {
        titulo: "Configuración",
        mensaje: "El historial fue eliminado correctamente."
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );
});