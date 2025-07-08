# Metaprompting en ChatGPT

##Laura:
Como experto en desarrollo de videojuegos y prompting, Genera el mejor prompt para realizar el desarrolla un juego sencillo, usando solo con frontend aplicando las mejores práctica y tecnologías actuales. El prompt debe generar todo el código, estructura y archivos necesarios para tener el juego completamente funcional en una sola iteración. Antes de generar el prompt hazme las preguntas que necesites.

##ChatGPT:
### 🙋‍♂️ **Preguntas previas antes de generar tu prompt definitivo**

Para entregarte el **mejor prompt posible**, completo y que funcione en una sola iteración con generación de código, estructura de carpetas y archivos listos, necesito tus respuestas sobre:

---

#### 🎮 **1. Tipo de juego sencillo deseado**

* ¿Qué tipo de juego quieres generar como ejemplo?

  * Ej: **Snake**, **Tic Tac Toe**, **Memory Cards**, **Pong**, **Juego de preguntas**, **Flappy Bird**, **Space Invaders básico**, u otro.

---

#### 💻 **2. Tecnologías preferidas**

* ¿Cuál es tu stack preferido para este proyecto?

  * **React + Vite**
  * **Next.js (app router)**
  * **Vanilla JS + HTML + CSS puro**
  * **Vue.js**
  * **Svelte**
  * Otra combinación.

---

#### 🎨 **3. Estilo visual**

* ¿Quieres un diseño:

  * Minimalista (solo funcional),
  * Estilo retro pixel,
  * Con interfaz moderna (material design / tailwind)?

---

#### 🗃️ **4. Requisitos adicionales**

* ¿El juego debe incluir:

  * Persistencia de datos en localStorage?
  * Uso de librerías de animaciones (ej: GSAP, Framer Motion)?
  * Responsive adaptado a móvil?
  * Tests unitarios integrados en el código generado?

---

#### 📂 **5. Estructura del proyecto**

* ¿Prefieres:

  * Código en un solo archivo index.html (por simplicidad didáctica),
  * Estructura realista con carpetas src, public, package.json, y scripts de build?

---

#### 🚀 **6. Público objetivo**

* ¿Es para:

  * Enseñanza de estudiantes principiantes,
  * Tu portfolio personal,
  * Demostración de uso de prompts para generación de código completo?

---

#### 📝 **7. Idioma del código y comentarios**

* ¿Español o inglés?

---

### ✅ **Siguiente paso**

Por favor respóndeme **cada punto (1 al 7)**. Con esta información generaré tu **prompt definitivo**, optimizado para un resultado completo, funcional y profesional para tus objetivos de desarrollo y prompting avanzado.

##Laura: 
1. Mecánica de juego de Flappy bird pero con un estilo minimalista
2. Vanilla JS + HTML + CSS puro
3. Limpio y esteticamente agradable. Con un diseño cuidado y simple.
4. Responsive adaptado al móvil
5. Estructura realista con carpetas src, public, package.json, y scripts de build?
6. Demostración de uso de prompts para generación de código completo
7. Ingles

##Chat GPT:
Aquí tienes tu **prompt definitivo** como experto en desarrollo de videojuegos y prompting, diseñado para generar un **Flappy Bird minimalista, responsive, en Vanilla JS + HTML + CSS puro**, con **estructura realista y profesional**, listo para usar en tus demostraciones de generación de código completo en una sola iteración.

---

## 🎯 **Prompt Final**

```
You are an expert senior frontend developer and game engineer.

🔴 TASK:
Generate the **complete code** for a **Flappy Bird style game** with the following specifications:

1. **Game type**: Flappy Bird mechanic.
2. **Style**: Minimalist, clean, and aesthetically pleasant design (use neutral colors, smooth shapes, and a professional minimalist UI).
3. **Technologies**: Vanilla JS, HTML, and CSS only. No frameworks.
4. **Responsive**: The game must adapt fully to mobile and desktop screens, with controls accessible on touch devices.
5. **Project structure**: Generate all the files and folders necessary for a realistic project including:
   - `package.json` with scripts for development (`live-server` or similar) and build if needed.
   - `public/` folder with `index.html`.
   - `src/` folder with separate JS and CSS files.
   - Clean and semantic code.
6. **Code comments**: In English, clear and professional.
7. **Controls**:
   - Tap or click to make the bird jump.
   - The bird falls with gravity.
   - Pipes move horizontally and reset when off screen.
   - Game over detection when colliding with pipes or floor.
8. **Visual design**:
   - Use CSS for styling. Avoid external images; use CSS shapes or minimal SVGs if needed.
   - Centered, pleasant UI with a visible score counter.
   - Game over screen with restart button.
9. **Single iteration output**: Provide the **full code ready to copy-paste** into a local folder, install dependencies, and run.

🔴 **OUTPUT FORMAT**:
- Begin with a **clear file tree**.
- Then provide **each file’s full content** within markdown code blocks labelled with the file path.
- Ensure that **all necessary files are included** for a fully functional game without missing references or links.

🔴 **ADDITIONAL INSTRUCTIONS**:
- Follow **best practices in Vanilla JS**, separating concerns between JS logic and CSS styling.
- Use semantic HTML5.
- Ensure code readability with proper indentation and descriptive variable/function names.
- Use **requestAnimationFrame** for smooth animations.
- Ensure **no console errors or warnings** on run.
- Add a README.md file with concise installation and usage instructions.

Your output should result in a **production-ready minimal Flappy Bird game** with a professional codebase for demonstration purposes.

Return only the code and file explanations as requested, nothing else.
```

---

### ✅ **Cómo usar este prompt**

1. Copia este prompt y pégalo en tu herramienta de generación (GPT-4o, Claude 3 Opus, etc.).
2. Verifica que la generación incluya **todos los archivos** antes de cerrar la sesión.
3. Prueba el código localmente para validación rápida antes de tu demostración.

---

Si deseas, puedo generar el resultado de este prompt directamente ahora mismo en esta conversación para que lo valides y lo uses hoy en tus tests y demos. Avísame.

# DESARROLLO EN CURSOR (Modo Agente)

##Laura: 
Copio el Metaprompt generandoen chat GPT

##Agente:
Me devuelve los archivos

##Laura:
Le pido que me los genere

##Agente:
Genera los archivos

##Laura
Al ejecutarlo no se visualiza bien, le pego el error de consola

##Agente
¡Perfecto! El error es claro y muy común cuando se usa `live-server` o servidores similares:

**¿Qué significa este error?**
- El navegador intenta cargar `/src/style.css` y `/src/script.js` desde la URL `http://127.0.0.1:8080/src/style.css`, pero el servidor responde con un archivo HTML (no encuentra el archivo CSS o JS), por eso el MIME type es incorrecto.
- Esto ocurre porque los archivos están fuera de la carpeta `public/`, que es la raíz que sirve `live-server` por defecto.

---

## **Solución**

### 1. **Mueve los archivos `style.css` y `script.js` a la carpeta `public/`**

Tu estructura debe quedar así:

```
/flappy-bird-clone/
├── package.json
├── README.md
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
```

### 2. **Corrige las rutas en `index.html`**

En `public/index.html`, cambia las rutas a:

```html
<link rel="stylesheet" href="style.css" />
<script src="script.js"></script>
```

---

## **Resumen de pasos**

1. Mueve `style.css` y `script.js` de `/src/` a `/public/`.
2. Cambia las rutas en `index.html` para que sean relativas a la carpeta `public/` (sin `../src/`).
3. Guarda los cambios y recarga la página.

---

### **¿Por qué ocurre esto?**
`live-server` (y la mayoría de servidores estáticos) solo sirven archivos dentro de la carpeta que le indicas (en este caso, `public/`). Si intentas acceder a archivos fuera de esa carpeta, responde con un HTML de error (por eso el MIME type es incorrecto).

---

¿Puedes probar esto y decirme si ya funciona el juego?

```plaintext
/flappy-bird-clone/
├── package.json
├── README.md
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
```

```html
<link rel="stylesheet" href="style.css" />
<script src="script.js"></script>
```

##Laura
Solicito los siguientes cambios:
- Añadir un título y que el fondo fuera del canva de juego sea oscuro
- A nivel de jugabilidad quiero que aparte de con el click se pueda usar con el espacio

##Curor
Me indica los cambios a realizar y los realizo

##Laura
Quiero que guarde la máxima puntuación 

##Cursor
¡Perfecto!  
Para guardar la máxima puntuación (high score) aunque recargues la página, se suele usar `localStorage`.  
¿Quieres que la máxima puntuación se guarde solo durante la sesión (mientras no cierres la pestaña) o que permanezca aunque cierres y vuelvas a abrir el navegador?

- **Si quieres que se guarde siempre:** uso de `localStorage` (persistente).
- **Si solo quieres que dure la sesión:** uso de una variable global (se borra al recargar).

Por defecto, en juegos casuales se usa `localStorage`.  
¿Te gustaría que lo implemente así?  
¿Dónde prefieres que se muestre la máxima puntuación? (por ejemplo, junto al marcador actual, arriba, etc.)

¡Confírmame esto y lo implemento!

##Laura
Usa localstorage y muestralo arriba del canva junto al marcador actual

##Cursor
Me indica los cambios y los aplico.

