## Usuario ## 
Rol: Desarrollador web
Tarea: Crear una versión completa del juego Space Invaders en JavaScript que se ejecute directamente en el navegador.
Requisitos generales:
	•	Todo el juego debe estar contenido en un único archivo HTML.
	•	Si es necesario CSS, puede estar embebido en el <style> del mismo archivo o utilizar estilos inline.
	•	No debe depender de bibliotecas externas.

Requisitos detallados

1. Interfaz de Usuario (UI)
	•	Pantalla completa con fondo oscuro.
	•	Una barra superior fija que muestre:
		•	Puntuación actual del jugador.
		•	Puntuación más alta (Hi-Score).
		•	Número de vidas restantes.
	•	Estética visual tipo 8-bit retro/pixel art.

2. Jugabilidad
	Controles:
	•	Movimiento lateral de la nave con teclas de flecha izquierda y derecha.
	•	Disparo con la tecla espaciadora (bar space).
	Enemigos:
	•	Aparecen en formaciones de varias filas y columnas.
	•	Se mueven lateralmente y descienden progresivamente.
	•	Si un enemigo alcanza la parte inferior de la pantalla, el juego termina.
	Obstáculos:
	•	Bloques ubicados entre la nave y los enemigos.
	•	Absorben disparos de ambos lados y se destruyen gradualmente.
	Colisiones:
	•	Un disparo del jugador que impacte un enemigo debe eliminarlo y sumar puntuación.
	•	Si un disparo enemigo impacta la nave del jugador, este pierde una vida.
	•	Progresión del juego:
	•	A medida que se eliminan enemigos, aumenta la velocidad de movimiento y disparo de los restantes.

antes de empezar a crear funciones, has las preguntas que tengas para resolver dudas

## Asistente ##
realiza 8 preguntas para resolver dudas antes de empezar a crear funciones

## Usuario ##
1. Resolución y Escalado del Juego
	•	¿Debe adaptarse a pantallas móviles o solo será para escritorio? solo sera para escritorio
	•	¿Deseas una escala tipo “pixel-perfect” (sin interpolación), o escalado suave? un escalado suave

2. Estilo visual retro
	•	¿Debo generar gráficos mediante <canvas> o usar divs con estilos CSS para simular sprites tipo 8-bit? usa canvas
	•	¿Quieres colores específicos (paleta retro) o me puedo inspirar libremente en tonos neón/retro? puedes inspirarte

3. Sonido
	•	¿Debo incluir efectos de sonido para disparos, explosiones, etc.? si te parece puedes incluirlos
	•	Si es así, ¿puedo usar sonidos básicos generados vía Web Audio API o prefieres que no haya sonido para mantenerlo simple? usa web audio api 

4. Persistencia de datos
	•	¿Quieres que la puntuación más alta (Hi-Score) se guarde entre sesiones del navegador? (Usando localStorage, por ejemplo). de momento no

5. Dificultad y progresión
	•	¿Cuántos niveles debe tener o simplemente debe incrementar velocidad indefinidamente? debe incrementar indefinidamente 
	•	¿Quieres un sistema de “oleadas” (waves) donde cuando eliminas a todos los enemigos aparece una nueva formación? si manejemos oleadas

6. Número de vidas
	•	¿Cuántas vidas debe tener el jugador al iniciar? 3 
	•	¿Quieres mostrar alguna animación de pérdida de vida o solo reinicio rápido? solo reinicio

7. Interacción inicial
	•	¿Debe haber una pantalla de inicio o el juego comienza automáticamente al cargar? debe haber una pantalla de inicio

8. Código comentado
	•	¿Deseas que el código esté debidamente comentado para su lectura/didáctica, o prefieres una versión más compacta? manejemos una version compacta

## Asistente ##
genera una versión compacta y funcional del juego Space Invaders en un solo archivo HTML

## Usuario ##
vamos a implementar los siguientes cambios
1 mejorar un poco a los enemigos ya que estamos en el juego original aparecen en solo una fila y en esta version aparecen mas ajustemoslo a que sean dos filas unicamente 
2 agregemos un mensaje al perder ya que solo se queda detenido el juego

## Asistente ##
implementa los cambios solicitados en el juego Space Invaders

## Usuario ##
vamos a realizar unos cambios mas
1 no debe poder disparar al dejar presionada la tecla de espacio
2 quitemos el sonido del disparo pero agregemos uno al destruir un enemigo
3 agregemos una vida cada 500 puntos ganados
4 agregemos algun icono a los enemigos que representen alienigenas y a nosotros para evitar que se vean como cuadrados

## Asistente ##
implementa los cambios solicitados en el juego Space Invaders

## Usuario ##
vamos agregar nuevas mejoras
1 los enemigos pueden disparar aleatoreamente mas de 1 vez 
2 bug los enemigos en ocaciones se quedan ciclados y no disparan
3 tratemos de crear enemigos como los de la imagen (adjunta imagen)

## Asistente ##
implementa los cambios solicitados en el juego Space Invaders

## Usuario ##
el ultimo cambio nos dio el siguiente error en la consola
Uncaught ReferenceError: startScreen is not defined

## Asistente ##
corrige el error en el codigo

## Usuario ##
ahora hay que disminuir la cantidad de disparos de los enemigos ya que se llena la pantalla de estos desde el incio y de ser posible aumentar un poco el tamaño de estos ya que se ven muy pequeños, ademas hay que agregar un mensaje al pasar de oleada

## Asistente ##
implementa los cambios solicitados en el juego Space Invaders

## Usuario ##
los disparos no disminuyeron lo suficiente adicional a esto la siguiente oleada no debe iniciar hasta que el usuario la inicie

## Asistente ##
implementa los cambios solicitados en el juego Space Invaders

