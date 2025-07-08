# Breakout Escolar Futurista - Prompts
## Proceso inicial

1. Empecé haciendo una investigación sobre juegos, opciones y pedí las características siguientes:
- Adictivo
- Fácil de entender
- Clon de alguno actual o similar
- Gráficas de fondo y movimiento (como super mario)
- Solo deberemos usar esas tecnologías, es decir, sin procesamiento del lado del servidor
- Fácil de jugar
- Comercial (que llame la atención visualmente y sea medianamente conocido)
- Si puede ser un juego didáctico, será muy buena elección, sino se puede no hay problema (esto es opcional)

2. En Chat normal empecé a definir todos los generales del juego:
- Características
- Figuras
- Paleta de colores
- Estructura de directorios

3. Con eso se crearon los archivos:
- estructuraCarpetas.md
- expertisse.md
- paletaDeColores.md
- spec.md
- spriteSheet.md

3.1 Para configurar el modelo de deepseek-coder:1.3b, tuve que:
- Instalar Ollama
- Descargar a instalar el modelo (siguiendo indicaciones del video https://training.lidr.co/posts/ai4devs-202505-seniors-%F0%9F%8E%A5-el-auge-de-los-modelos-llm-locales-%F0%9F%94%B4-14-min)
- Hacer algunas variantes, porque es un poco viejo el video, al final me pidió una URL que no fue fácil encontrar, pero fue: http://localhost:11434

4. En CodeGPT desde VS code, se lanzó el prompt:
# Contexto:
- Eres un experto con las características de *expertisse.md*, desarrollaremos un videojuego con las características descritas en *expertisse.md*
- Las características generales del videojuego están descritas en *spec.md*
- La paleta de colores que usaremos está en *paletaDeColores.md*
- Vamos a usar sprites individuales y animaciones en modo CSS sprites con la información que se indica en *spriteSheet.md*, utilizando la imagen *spriteSheet.png*

# Siguientes Pasos:
- Empecemos creando la estructura de carpetas descrita en *estructuraCarpetas.md*
- Una vez terminado, vamos con el prototipo básico: paddle + bola + collision detection con un solo ladrillo.
- Agrega la capacidad para que pueda ejecutarse desde móvil y sea responsivo

# Pausa y reinicio
- CodeGPT me dejó sin usos, me pasé a cursor, pero algo iba mal, entonces decidí reiniciar pasándole a ChatGPT el contexto inicial, traduje los prompts del ejemplo de super mario con éste prompt:
*Me voy a basar en los conesjos previos que me diste y vamos a generar prompts para usarlos en el IDE Cursor, tradúceme estos a español, adáptalos a nuestro "Breakout escolar futurista" y mejóralos como consideres, cada prompt está separado por ---.*
Ahí te van:
... aquí va copy/paste del ejemplo de super mario ...

# Nuevo reinicio
- Hice algo que no sé si debí, pasé demasiado contexto, generé muchos .md para specs iniciales e inicié con éste prompt:
 ```md
 Eres un desarrollador experto en juegos HTML5. Quiero que configures desde cero un clon de Breakout con temática escolar futurista usando **Phaser**.

Considera lo siguiente:
- Utiliza una estructura modular (por escenas).
- Crea las carpetas y archivos base: `index.html`, `main.js`, `scenes/`, `assets/images`, `assets/audio`, `specs/`.
- La paleta visual y gameplay están descritas en `specs/game-specs.md` y `specs/gameplay.md`.
- Los sprites vienen de un solo archivo: `spritesheet.png` con su correspondiente `spritesheet.json` y está descrito en `specs/sprites.md`.

Usa buenas prácticas, aplica principios **SOLID**, y asegúrate de que el juego cargue sin errores en navegadores de escritorio y móviles.
 ```

 - El resultado no fue malo, pero había preparado varios prompts y no alcancé a distinguir todo lo que hizo, por lo que iteré varias veces, al final entendí mucho, pero pude haberlo hecho por pedazos y avanzar más rápido, dejo todos los prompts finales en
- El resultado no fue malo, pero había preparado varios prompts y no alcancé a distinguir todo lo que hizo, por lo que iteré varias veces, al final entendí mucho, pero pude haberlo hecho por pedazos y avanzar más rápido, dejo todos los prompts finales en [cursorChat.md](cursorChat.md)
