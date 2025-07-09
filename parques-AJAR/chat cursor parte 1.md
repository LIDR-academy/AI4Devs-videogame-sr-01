# Descripción del juego parqués
_Exported on 7/3/2025 at 22:27:58 GMT-5 from Cursor (1.2.0)_

---

**User**

# Rol
Eres un experto en juegos de mesa.

# Meta
¿Conoces el juego parqués?, si es así dame una breve descripción de este.

---

**Cursor**

Sí. Parqués es la adaptación colombiana del clásico Parchís (o Parcheesi), muy popular en Latinoamérica. Se juega en un tablero con forma de cruz, cada jugador controla cuatro fichas de un mismo color y avanza según la tirada de dos dados. El objetivo es llevar todas tus fichas desde la “casa” de salida hasta la meta antes que tus rivales, bloqueando y comiendo sus piezas en el camino para retrasarlos. Es un juego de estrategia y suerte, ideal para 2 a 4 participantes.

---

**User**

Dame las funcionalidades principales que deberia implementar si quisiera desarrollar un video juego básico que emule este juego.

---

**Cursor**

Aquí tienes un listado de las funcionalidades esenciales para un videojuego básico de Parqués:

1. Representación del tablero y fichas  
   • Modelo de datos que refleje casillas, “casa” de cada color, zona segura y meta.  
   • Renderizado gráfico (sprites, colores).

2. Gestión de jugadores  
   • Configuración de 2–4 jugadores (local, CPU u online).  
   • Asignación de color y fichas.

3. Tirada de dados  
   • Lógica de generación aleatoria de dos dados.  
   • Animación/efecto visual de la tirada.

4. Lógica de movimiento  
   • Cálculo de posibles casillas según el valor de los dados.  
   • Validación de reglas: sólo mover ficha si sale un 5 para salir de la casa, no sobrepasar meta, etc.

5. Captura y bloqueos  
   • Comer ficha enemiga al caer sobre ella (la envía de vuelta a casa).  
   • Formación de muro/bloqueo cuando dos fichas propias coinciden (impiden paso).

6. Zonas seguras  
   • Identificación de casillas donde no se puede comer ni bloquear.  
   • Respeto de estas reglas al mover.

7. Gestión de turnos  
   • Ciclo de turnos configurable (pasar, volver a tirar si comes o sacas doble, etc.).  
   • Indicador visual de turno activo.

8. Condición de victoria  
   • Detección automática cuando un jugador lleva sus 4 fichas a la meta.  
   • Pantalla de fin de partida y opción de reiniciar.

9. Interfaz de usuario y controles  
   • Selección de ficha con clic/tap o teclado.  
   • Botón para tirar dados.  
   • Mensajes de ayuda/instrucciones básicas.

10. Feedback audiovisual  
    • Animaciones de movimiento y captura.  
    • Efectos de sonido para dados, movimiento, victoria.

11. IA básica (opcional para un solo jugador)  
    • Algoritmo sencillo de prioridad: salir de casa, capturar fichas enemigas, avanzar ficha más cercana a meta.

12. Menú y opciones  
    • Selección de número de jugadores y tipo (humano/CPU).  
    • Ajustes de volumen, colores de fichas, reiniciar partida.

13. Guardado y carga de partida (opcional)  
    • Persistir estado actual para reanudar más tarde.  

Con estas piezas tendrás la base para un Parqués funcional y ampliable.

---

**User**

Me puedes ayudar especificando las reglas en cuanto a la logica de turnos, es decir, la cantidad de tiros que tiene un jugador cuando tienes todas las fichas en la casa, que sucede cuando entre las trre oportunidades saca una ficha, etc.

---

**Cursor**

Aquí tienes la especificación detallada de la lógica de turnos para Parqués:

1. Lanzamientos iniciales (todas las fichas en la casa)  
   - Un jugador que aún no ha introducido ninguna ficha en el tablero dispone de hasta **3 intentos** para sacar una ficha.  
   - En cada intento tira **dos dados**:  
     • Si **ninguno** de los dos da 5, consume un intento y vuelve a tirar (si le quedan).  
     • En el momento en que **al menos un dado** muestre 5, debe:
       1. Colocar **una ficha** en su casilla de salida.  
       2. Usar el **valor del otro dado** para mover esa misma ficha (o, si lo prefiere, otra ficha que ya estuviera en juego, en variantes más avanzadas).  
       3. **Interrumpir** los intentos restantes y pasar a la fase normal de movimientos de ese turno (ver punto 2).  
   - Si tras los **3 intentos** no saca ningún 5, **pierde el turno** sin mover ficha alguna.

2. Fase normal de movimiento  
   - Cada turno “normal” consta de:  
     a) **Una tirada** de 2 dados (o más, si obtiene doblés).  
     b) **Dos movimientos** independientes: puede repartir los valores entre una o dos fichas, en el orden que prefiera.  
   - **Doblés (ambos dados iguales):**  
     • Tras mover las dos “fichas” (o dos veces la misma) por ese valor, obtiene **una tirada extra** inmediatamente.  
     • Si logra **3 doblés consecutivos**, **pierde el turno** y la ficha movida en el tercer doblé vuelve a casa.  
   - El turno termina cuando:  
     1. Agota todas las tiradas (la inicial más las extras por doblés).  
     2. No le quedan movimientos válidos.

3. Casos especiales tras sacar ficha  
   - Si al sacar ficha obtuvo un **doble 5**:  
     • Introduce **dos fichas** a la vez (o una ficha y mueve otra 5 casillas si sólo le queda una en casa).  
     • Gana una tirada extra por ser doblé, que ya forma parte de la fase normal.  
   - Si saca un 5 pero el **otro dado** también es 5 (doblé 5), aplica las mismas reglas de doblés (ver 2).

4. Resumen del flujo de un turno completo  
   1. ¿Todas las fichas en casa? → hasta 3 lanzamientos buscando un 5.  
   2. En cuanto aparezca un 5 → colocar ficha(s), usar segundo dado → pasar a fase normal.  
   3. Tirada normal → mover usando ambos dados → si doblé, repetir tirada (cuidado con el tercer doblé).  
   4. Termina turno al gastar todas las tiradas o al penalizarse por triple doblé.

Con esta lógica cubres:  
- Los **3 intentos** para arrancar.  
- Qué hacer al **sacar ficha** en esos intentos.  
- El ciclo de movimientos normales, con **doblés** y su penalización.

---

**User**

modifica para que la salida de una ficha de la casa solo sea con dobles y  en el laf ase de movimiento normal si saca 3 dobles consecutivos la ultima ficha movida llegué a la meta. y en los casos especiales modifica para que aplique para dobles si importar el número.

---

**Cursor**

Aquí tienes la lógica de turnos ajustada según tus indicaciones:

1. Tiradas iniciales (todas las fichas en casa)  
   - El jugador dispone de **hasta 3 intentos** para sacar un par (dobles).  
   - En cada intento tira **dos dados**:  
     • Si **no** son dobles, consume un intento y, si le quedan, vuelve a tirar.  
     • Si **son dobles** (ambos dados muestran el mismo número), debe:  
       1. Colocar **una ficha** en su casilla de salida.  
       2. Mover esa misma ficha tantas casillas como el valor de cualquiera de los dos dados.  
       3. **Interrumpir** los intentos restantes y pasar a la fase normal de movimiento.  
   - Si al terminar los **3 intentos** no logra dobles, **pierde el turno** sin sacar ficha alguna.

2. Fase normal de movimiento  
   - Cada turno consta de:  
     a) **Una tirada** de 2 dados.  
     b) **Dos movimientos** independientes, pudiendo repartir los valores entre una o dos fichas (en el orden que prefiera).  
   - **Dobles (ambos dados iguales):**  
     • Tras aplicar ambos movimientos (o mover dos veces la misma ficha), obtiene **una tirada extra** inmediatamente.  
     • Si logra **3 dobles consecutivos**, en lugar de penalización, la **última ficha movida** se lleva directamente hasta la **meta**, y el turno termina.  
   - El turno finaliza cuando:  
     1. Agota todas las tiradas (la inicial más las extras).  
     2. No le quedan movimientos válidos.

3. Casos especiales tras sacar ficha  
   - Si al sacar ficha en la fase inicial obtuvo **cualquier dobles**:  
     • Puede **introducir dos fichas** si aún tiene ambas en casa.  
     • Si sólo le queda una en casa, introduce esa y mueve otra ficha ya en tablero tantas casillas como el

     • Puede **introducir dos fichas** si aún tiene ambas en casa.

     • Si sólo le queda una en casa, introduce esa y mueve otra ficha ya en tablero tantas casillas como el valor de cualquiera de los dados.

     • Gana una tirada extra por ser dobles, que ya forma parte de la fase normal de movimiento.

4. Resumen del flujo de un turno completo  
   1. Todas las fichas en casa → hasta 3 intentos buscando dobles.  
   2. Al lograr dobles: colocar ficha(s), mover según el valor de los dados y ganar una tirada extra; pasar a fase normal.  
   3. Fase normal → tirada de dos dados + dos movimientos repartidos; si dobles → tirada extra; si 3 dobles consecutivos → la última ficha movida llega directamente a la meta y el turno termina.  
   4. El turno finaliza al agotar todas las tiradas o al no tener movimientos válidos.

