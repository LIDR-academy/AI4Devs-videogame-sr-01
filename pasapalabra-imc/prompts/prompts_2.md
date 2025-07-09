# Prompts utilizados en Cursor (agente ChatGPT o3)

## presentación y objetivos de esta parte
Ya con un prompt completo, creo la estructura de directorios y copio en "docs" las maquetaciones de las páginas que he realizado con ChatGPT y la base de datos de preguntas también generada con ChatGPT.

## Usuario
Vamos a desarrollar un juego HTML5 llamado Pasapalabra.
Las instrucciones completas para la implementación del juego están el el fichero "pasapalabra-imc\\docs\\pasapalabra_prompt_v3.md".
El directorio base del videojuego es pasapalabra-imc.
Según se indica en las intrucciones, hay disponibles plantillas HTML con el diseño de cada vista del juego, que hay que respetar perfectamente.
La base de datos de preguntas también se adjunta, y solo hay que copiarla en el directorio correspondiente.
Los directorios necesarios ya están creados, hay que respetar los directorios existentes.
Hay que ir almacenando cada prompt (éste y cualquier otro) y su respuesta en ficheros con formato markdown en el directorio prompts.
Hay que ir almacenando un log de cambios que se van aplicando en el código en el directorio logs.
Analiza el documento y hazme las preguntas que necesites antes de comenzar la implementación.
Después, dime qué pasos vas a realizar antes de editar ningún fichero.

---

## Asistente
Preguntas de aclaración:
1. ¿Deseas que también implementemos, desde la primera versión, el módulo opcional de reconocimiento por voz (`speech.js`) o prefieres dejarlo para más adelante?
2. Las pruebas unitarias indicadas para `normalize()`, `calculateScore()` y `updateRanking()` ¿son requisito para esta primera entrega o pueden posponerse hasta después de la funcionalidad básica?
3. El banco de preguntas `questions.json` que figura en `docs/` ya está completo con al menos tres pistas por letra. ¿Confirmas que simplemente lo copiamos tal cual a `src/data/questions.json`?
4. ¿Quieres que generemos el `README.md` inicial y la primera versión de `logs/CHANGELOG.md` en esta misma iteración o lo dejamos para cuando el código esté más avanzado?

Pasos que voy a realizar antes de modificar archivos:
1. Copiar las tres maquetas HTML (`maqueta_portada.html`, `maqueta_rosco.html`, `maqueta_resultados.html`) desde `docs/` a `src/`, renombrándolas a `index.html`, `game.html` y `results.html` respectivamente.
2. Copiar `docs/questions.json` a `src/data/questions.json`.
3. Crear la estructura de subdirectorios faltantes dentro de `src/` (`css/`, `js/`, `assets/`, `data/`) en caso de no existir.
4. Crear `src/css/styles.css` copiando los estilos contenidos en las maquetas y asegurando que la ruta relativa se mantenga.
5. Crear los ficheros vacíos de módulos JavaScript en `src/js/` (`config.js`, `app.js`, `dataLayer.js`, `ui.js`, `timer.js`, `rosco.js`, `speech.js`) junto a sus cabeceras JSDoc y exportaciones básicas.
6. Definir el contenido inicial de `config.js`, incluyendo la versión `1.0.0` y las constantes indicadas.
7. Añadir las etiquetas `<script type="module">` correspondientes en cada HTML, apuntando a `js/app.js`.
8. Generar `logs/CHANGELOG.md` con la entrada inicial `## [1.0.0] - 2025-07-09`.
9. Guardar este prompt y la respuesta en `prompts/<timestamp>_prompt.md`.
10. Registrar cada uno de los pasos anteriores en `logs/CHANGELOG.md` conforme se vayan completando. 

## Notas finales
A partir de este punto, el proceso ha sido bastante rápido, el asistente ha ido construyendo el código y, tras realizar algunos arreglos, todo parece funcionar correctamente.