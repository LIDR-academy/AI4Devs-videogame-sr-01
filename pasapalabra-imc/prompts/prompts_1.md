# Prompt inicial - ChatGPT o3

## presentación y objetivos de esta parte
Primero, le pido a ChatGPT que me ayude a elaborar un buen prompt con la idea de juego que tengo, que es una adaptación del rosco de pasapalabra para un jugador y sacando las preguntas de una base de datos (un fichero JSON).
A continuación se muestran todas las interacciones hasta conseguir un prompt con el que acceder a cursor para empezar el trabajo. El proceso no fue del todo lineal, pues utilice la segunda versión para realizar un primer intento del videojuego, que me dio muchos problemas. Al encontrarme tantos problemas, decidí volver al punto de partida y solicitar cambios en el prompt de partida. La versión 3 (al final de este fichero) es la que he utilizado para la elaboración de la versión final del juego.

## Usuario
Eres un experto desarrollador de videojuegos en HTML5, javascript y css.
Necesito desarrollar un juego denominado "Pasapalabra", una versión en español del famoso juego "The Alphabet Game".
En concreto, se trata de emular La Ronda Final ("The Alphabet Round" o "El Rosco"), pero para un solo jugador.
La mecánica general es conocida, la resumo la funcionalidad a continuación: 
* Se muestra un rosco con las letras del alfabeto español, de la 'A' a la 'Z'. 
* Todas empiezan en un color neutro (por ejemplo, azul).
* Como el usuario tendrá que escribir la respuesta, sería muy interesante intentar mejorar la usabilidad permitiendo dictar la respuesta si el dispositivo tiene micrófono y está disponible (centrémonos en usabilidad para smartphones).
* El Cronómetro: Se pone en marcha el cronómetro con el total de segundos, que quedará predefinido a 120 segundos.
* El juego empieza mostrando el enunciado de una pregunta elegida aletariamente de la letra del alfabeto que toca, empezando por la "A".
* El usuario puede responder o pasar.
* Si decide responder y acierta, la letra se pone en color verde, se contabiliza el acierto y se pasa a la siguiente letra.
* Si decide responder y falla, la letra se pone en color rojo, se muestra la respuesta correcta y se ocntabiliza el fallo.
* Si decide pasar, (pressionando un botón "pasar", la letra pasa a un color pendiente (por ejemplo, naranja), y se continúa con la letra siguiente.
* Si se llega a la letra "Z" y quedan preguntas pendientes, se vuelve a la siguiente pregunta pendiente.
* Las preguntas estarán almacenadas en un único fichero JSON que, para cada pregunta, contendrá la letra por la que comienza, el texto de la pregunta y la respuesta válida.
* Se debe mostrar en todo momento un panel en pantalla con el tiempo restante, el número de aciertos y el número de fallos, además del rosco, con un formato atractivo.
* El juego finaliza cuando se termina el tiempo o no hay más preguntas pendientes de contestar.
* Mostrará una pantalla de resumen con la puntuación final, y la opción de volver a jugar.

Lo primero que te voy a pedir es que redactes un prompt muy completo (maquetado con markdown) que pueda utilizar para poder implementar por completo el juego indicado anteriormente, en HTML5 (utilizando solo html, js, json para la base de datos y css), respetando las características indicadas y completando los requisitos para que el juego sea completo y usable, con un diseño atractivo, aplicando buenas prácticas y bien documentado.
Pregúntame cualquier duda que tengas.

## Asistente
El asistente, además de resumir cómo piensa proceder, formula las preguntas siguientes:

1. Base de preguntas
¿Deseas un número mínimo por letra (p. ej. 5 pistas) o basta con una sola?

2. Soporte multidioma
¿Planeas incluir inglés/catalán en el futuro para preparar la estructura desde ahora?

3. Diseño visual
¿Alguna paleta de colores o estilo (corporativo) preferido?

4. Sonido
¿Debemos añadir efectos sonoros (acierto/fallo) y música de fondo, o mantenerlo silencioso?

¡Cuéntame cualquier detalle extra y ajusto el prompt en consecuencia!

## Usuario
Te respondo a las preguntas: 
1. debería haber varias preguntas por cada letra, de forma que, si juegas varias veces, salgan preguntas diferentes.
2. no hace falta soporte multiidioma.
3. no, solo quiero que sea un diseño atractivo y moderno.
4. no, sin sonidos.
Genera el prompt maquetado con markdown en un fichero descargable.

## Asistente
¡Listo! Puedes descargar tu prompt en Markdown desde este enlace:
Se puede ver el fichero en --> [docs/pasapalabra_prompt_v1.md]

## Usuario
He revisado el prompt descargado y veo el apartado de requisitos algo escueto, me gustaría que seas mucho más específico para cerrar perfectamente la lógica del juego, de forma que minimicemos la posibilidad de alucinaciones o errores de funcionamiento o usabilidad. 

También quiero que no incluyas ningún apartado de extensiones futuras o ideas, quiero que todos los requisitos estén cerrados y perfectamente definidos, no quiero dejar la posibilidad a errores en la interpretación.  

Me gusta la idea de almacenar el ranking general en local storage, pero ten en cuenta que habrá que guardar puntuación y fecha y hora de cada partida, y mostrar solo las 10 mejores partidas. 

Y hay que aplicar una lógica para establecer la puntuación (por ejemplo, cada acierto suma 3 puntos y cada fallo resta 1 punto). 

Este prompt va a ser utilizado en el IDE Cursor para que construya el juego y tiene que estar todo perfectamente especificado.

Vuelve a generar el prompt maquetado con markdown en un fichero descargable.

## Asistente
¡Listo! Puedes descargar tu prompt en Markdown desde este enlace:
Se puede ver el fichero en --> [docs/pasapalabra_prompt_v2.md]

## Usuario
Te adjunto un prompt generado anteriormente para la realización de un juego HTML5 basado en el famoso pasapalabra, que me ha dado muchos problemas.

Primero: he refinado la lógica: 
* hay una primera pantalla html con la portada del nuevo, en la que se pide el nombre del jugador y un botón para comenzar a jugar.
* después aparece la pantalla con el rosco, en el que se van respondiendo las preguntas y sale el cronómetro con la cuenta atrás. Si el tiempo termina o se responde a todas las preguntas, el juego finaliza y pasa a la pantalla de resultados
* una vez el juego termina, se muestra la pantalla de resultados, con los 10 mejores resultados (se guardan en local storage).

Segundo: me dió muchos problemas la creación del fichero JSON con las preguntas, así que he preparado uno que adjuntaré en la ruta "docs/questions.json". Se debe utilizar el fichero aportado, copiando su contenido al directorio "src/data/questions.json".

Tercero: me dió muchos problemas la maquetación de las páginas, por lo que he preparado prototipos de las 3 páginas para que se respeten totalmente:
* docs\maqueta_portada.html --> portada
* docs\maqueta_rosco.html --> diseño del rosco y la pregunta
* docs\maqueta_resultados.html --> página final con los resultados

Cuarto: de cara al mantenimiento, reorganiza el código fuente para que sea sencillo ajustar la maqueta de alguna de las 3 páginas o se puedan tocar la configuración (tiempo del cronómetro, letras del alfabeto a mostrar por si quiero quitar alguna...)

Quinto: indica en el prompt que todo el código fuente del juego se tiene que crear en el subdirectorio "src", pero que las rutas a todos los recursos tienen que ser relativas al directorio del juego para que, si en producción se decide montar el juego en el directorio raiz de un dominio cualquiera, que todo funcione correctamente.

Sexto: generar información de cara al mantenimiento:
* crear un directorio "promtps" en el que se guarde copia de todos los prompts utilizados y sus respuestas, en ficheros independientes, con formato markdown, con nombres que identifiquen la fecha y hora de creación, para su posterior seguimiento.
* crear un directorio "logs" donde se incluya un fichero en el que se vayan indicando los cambios aplicados, con formato markdown, indicando fechas.

Séptimo: generar un fichero leeme con la presentación del videojuego e instrucciones de uso.

Recuerda que este prompt va a ser utilizado en Cursor para que construya el juego y tiene que estar todo perfectamente detallado para evitar alucinaciones.

Vuelve a generar el prompt maquetado con markdown en un fichero descargable, muy extenso, en el que se apliquen buenas prácticas.

## Asistente
¡Listo! Puedes descargar tu prompt en Markdown desde este enlace:
Se puede ver el fichero en --> [docs/pasapalabra_prompt_v3.md]