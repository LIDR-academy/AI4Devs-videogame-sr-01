# 🖼️ Sprites: Breakout Escolar Futurista

## 📁 Uso de Sprite Sheet

Todos los sprites están contenidos en una sola imagen llamada `spritesheet.png` ubicada en `assets/images/`.

Se recomienda acompañar esta imagen con un archivo de atlas JSON (`spritesheet.json`) que define la posición y dimensiones de cada sprite.

---

## 📦 Estructura del Sprite Sheet

### Archivo de imagen:

* `assets/images/spritesheet.png`

### Archivo JSON (ejemplo para Phaser 3):

```json
{
  "frames": {
    "paddle": { "frame": {"x": 0, "y": 0, "w": 64, "h": 16} },
    "ball":   { "frame": {"x": 64, "y": 0, "w": 16, "h": 16} },
    "brick":  { "frame": {"x": 80, "y": 0, "w": 32, "h": 16} },
    "powerup_enlarge": { "frame": {"x": 112, "y": 0, "w": 16, "h": 16} },
    "powerup_laser":   { "frame": {"x": 128, "y": 0, "w": 16, "h": 16} },
    "powerup_zoom":    { "frame": {"x": 144, "y": 0, "w": 16, "h": 16} },
    "powerup_multi":   { "frame": {"x": 160, "y": 0, "w": 16, "h": 16} }
  },
  "meta": {
    "image": "spritesheet.png",
    "size": { "w": 256, "h": 32 },
    "scale": "1"
  }
}
```

---

## 🕹️ Cómo cargar en Phaser 3

### Carga del atlas:

```js
this.load.atlas('gameAtlas', 'assets/images/spritesheet.png', 'assets/images/spritesheet.json');
```

### Uso de cada sprite:

```js
this.add.sprite(100, 300, 'gameAtlas', 'paddle');
this.add.sprite(120, 280, 'gameAtlas', 'ball');
```

---

## 🧠 Recomendaciones

* Mantener tamaños estándar (ej. múltiplos de 16 o 32).
* Usar nombres de frame descriptivos y consistentes.
* Puedes generar `spritesheet.png` y `spritesheet.json` fácilmente con herramientas como:

  * [TexturePacker](https://www.codeandweb.com/texturepacker)
  * [ShoeBox](https://renderhjs.net/shoebox/)
  * [Aseprite (exportar como JSON)](https://www.aseprite.org/)

---

## 🧾 Referencia de Sprites

| Frame ID          | Descripción              |
| ----------------- | ------------------------ |
| `paddle`          | Paleta del jugador       |
| `ball`            | Bola principal           |
| `brick`           | Ladrillo / libro escolar |
| `powerup_enlarge` | Agranda la paleta        |
| `powerup_laser`   | Activa disparos          |
| `powerup_zoom`    | Vista expandida          |
| `powerup_multi`   | Multiplica la bola       |

---
