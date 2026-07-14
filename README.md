# 🎮 Juego "Adivina el Número"

Aplicación web desarrollada con **Node.js**, **Express**, **EJS** y **Bootstrap** que permite jugar a adivinar un número aleatorio entre 1 y 10.

El proyecto incorpora **persistencia de datos mediante archivos JSON**, almacenando automáticamente el historial de todas las partidas realizadas.

Este proyecto fue desarrollado con fines educativos para practicar:

- Express
- EJS
- Formularios HTML
- Bootstrap
- Lectura y escritura de archivos JSON
- Manejo de rutas GET y POST
- Procesamiento de información almacenada en archivos

---

# Tecnologías utilizadas

- Node.js
- Express
- EJS
- Bootstrap 5
- Módulo **fs** de Node.js
- Archivos JSON

---

# Funcionalidades

- Registro del nombre del jugador.
- Generación de un número aleatorio entre 1 y 10.
- Máximo de cinco intentos por partida.
- Mensajes indicando si el número secreto es mayor o menor.
- Sistema de puntaje.
- Persistencia automática de las partidas.
- Historial completo de partidas.
- Historial personal por jugador.
- Ranking de jugadores según puntaje acumulado.
- Eliminación del historial de un jugador.
- Reinicio completo del historial.

---

# Sistema de puntaje

| Resultado | Puntaje |
|-----------|---------:|
| Acierta en el primer intento | 3 puntos |
| Acierta entre el segundo y quinto intento | 1 punto |
| No acierta | 0 puntos |

---

# Estructura del proyecto

```text
adivina-numero/
│
├── index.js
├── package.json
├── data/
│   └── partidas.json
└── views/
    ├── inicio.ejs
    ├── jugar.ejs
    ├── historial.ejs
    ├── historial-personal.ejs
    ├── ranking.ejs
    ├── configuracion.ejs
    └── partials/
        ├── head.ejs
        ├── navbar.ejs
        └── footer.ejs
```

---

# Archivo JSON

El proyecto utiliza el archivo:

```text
data/partidas.json
```

Contenido inicial:

```json
[]
```

Cada vez que termina una partida, se agrega un nuevo registro similar al siguiente:

```json
[
    {
        "nombre": "Camila",
        "puntaje": 3,
        "fecha": "15-07-2026 18:45"
    },
    {
        "nombre": "Pedro",
        "puntaje": 1,
        "fecha": "15-07-2026 19:10"
    }
]
```

---

# Instalación

Clonar el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar al proyecto:

```bash
cd adivina-numero
```

Instalar las dependencias:

```bash
npm install
```

---

# Ejecutar la aplicación

```bash
node index.js
```

Abrir el navegador en:

```
http://localhost:3000
```

---

# Rutas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal |
| `/jugar` | Realizar una partida |
| `/historial` | Mostrar el historial completo |
| `/historial-personal` | Buscar el historial de un jugador |
| `/ranking` | Mostrar el ranking de jugadores |
| `/configuracion` | Reiniciar el historial |

---

# Persistencia de datos

La aplicación utiliza el módulo **fs** de Node.js para almacenar la información de las partidas.

Cada vez que un jugador finaliza una partida:

- Se lee el archivo JSON.
- Se agrega un nuevo registro.
- Se guarda nuevamente el archivo.

Gracias a esto, la información permanece disponible incluso después de reiniciar el servidor.

---

# Validaciones implementadas

- No permite comenzar una partida sin ingresar un nombre.
- Solo acepta números entre 1 y 10.
- Limita la partida a cinco intentos.
- Registra cada partida una sola vez.
- Permite eliminar el historial de un jugador.
- Permite reiniciar completamente el historial.

---

# Funcionalidades adicionales

## Historial personal

Permite buscar todas las partidas de un jugador específico y mostrar:

- Total de partidas.
- Puntaje acumulado.
- Puntaje promedio.

Además, permite eliminar todas las partidas del jugador seleccionado.

---

## Ranking

Calcula automáticamente el puntaje acumulado de todos los jugadores y genera una tabla ordenada de mayor a menor puntaje.

---

## Configuración

Permite eliminar completamente el contenido del archivo `partidas.json`, dejando el historial vacío para comenzar nuevamente.

---

# Objetivos de aprendizaje

Este proyecto permite practicar:

- Express
- EJS
- Bootstrap
- Formularios HTML
- Rutas GET y POST
- Variables del servidor
- Lectura de archivos JSON
- Escritura de archivos JSON
- Manejo de objetos y arreglos
- Búsquedas y filtrado de información
- Cálculo de estadísticas
- Organización de proyectos mediante partials

---

# Posibles mejoras

- Uso de sesiones para permitir varios jugadores simultáneamente.
- Registro de fecha y hora con un formato personalizado.
- Diferentes niveles de dificultad.
- Ranking por cantidad de victorias.
- Exportación del historial a CSV.
- Uso de una base de datos (MySQL o PostgreSQL).
- Autenticación de usuarios.
- Panel de administración.

---

# Licencia

Proyecto desarrollado con fines educativos en el Bootcamp Fullstack Javascript v2.0.
