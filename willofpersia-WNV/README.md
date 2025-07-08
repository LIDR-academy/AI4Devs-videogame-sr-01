# 🎮 Will of Persia - 2D Platformer Game

An engaging browser-based 2D platformer game inspired by classic titles like Prince of Persia. Built with vanilla JavaScript, HTML5 Canvas, and CSS - no build tools required!

![Will of Persia](https://img.shields.io/badge/Game-Will%20of%20Persia-gold?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🎯 Game Overview

Navigate through treacherous levels as a brave adventurer in an ancient Persian palace. Collect keys, solve puzzles with switches and doors, avoid deadly traps, and reach the mystical portal to advance to the next level.

### 🌟 Features

- **Smooth Physics**: Realistic gravity, friction, and collision detection
- **Interactive Elements**: Switches, doors, moving platforms, and collectible keys
- **Visual Polish**: Squash-and-stretch animations, particle effects, and smooth camera movement
- **Progressive Difficulty**: Three challenging levels with increasing complexity
- **Responsive Design**: Plays well on different screen sizes
- **Clean Architecture**: Modular JavaScript following SOLID principles

## 🕹️ How to Play

### Controls

- **Arrow Keys** or **WASD**: Move left/right
- **Spacebar** or **Up Arrow** or **W**: Jump
- **E** or **Enter**: Interact with switches
- **ESC** or **P**: Pause game
- **R**: Restart level (during gameplay)

### Gameplay

1. **Objective**: Collect all keys (golden items) in each level and reach the glowing portal
2. **Keys**: You must collect ALL keys before the portal becomes active
3. **Switches**: Step on switches and press **E** to activate doors and platforms
4. **Platforms**: Use moving platforms to reach higher areas
5. **Dangers**: Avoid spikes and falling off the level
6. **Health**: You have 3 hearts - lose them all and restart the level

### Tips

- Use **coyote time**: You can still jump briefly after leaving a platform
- Hold jump for higher jumps, tap for shorter hops
- Time your movements with moving platforms
- Look for visual cues - glowing objects are interactive

## 🚀 Quick Start

### Just Double-Click and Play! 🎮

**No server needed!** This game works directly from files:

1. **Download or clone** this repository
2. **Double-click `index.html`** or drag it to your browser
3. **Start playing immediately!** 🎯

### Alternative: Local Web Server (Optional)
If you prefer using a web server (for development or hosting):

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then visit http://localhost:8000
```

**Why no server needed?** 
- ✅ Pure vanilla JavaScript (no modules)
- ✅ No AJAX/fetch requests  
- ✅ No CORS restrictions
- ✅ All assets are inline or relative paths

## 🌐 GitHub Pages Deployment

This game is designed to work perfectly with GitHub Pages out of the box!

### Deploy to GitHub Pages

1. **Fork or Upload** this repository to your GitHub account

2. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose `main` branch and `/ (root)` folder
   - Click "Save"

3. **Access Your Game**:
   - Your game will be available at: `https://yourusername.github.io/repository-name/willofpersia-WNV/`
   - GitHub will provide the exact URL in the Pages settings

### Custom Domain (Optional)

You can use a custom domain by:
1. Adding a `CNAME` file to the repository root
2. Configuring your domain's DNS settings
3. Updating the custom domain in repository settings

## 📁 Project Structure

```
willofpersia-WNV/
├── index.html          # Main HTML file
├── style.css           # Game styling
├── README.md          # This file
└── js/
    ├── utils.js       # Utility functions and constants
    ├── input.js       # Input handling system
    ├── physics.js     # Physics engine and collision detection
    ├── gameObjects.js # Interactive game objects (keys, switches, etc.)
    ├── player.js      # Player character logic
    ├── level.js       # Level system and camera
    └── game.js        # Main game engine
```

## 🏗️ Architecture

The game follows clean architecture principles:

### Design Patterns Used
- **Single Responsibility Principle**: Each class has one clear purpose
- **Factory Pattern**: Level creation and object instantiation
- **Observer Pattern**: Game event handling
- **State Pattern**: Game state management

### Core Systems
- **Input System**: Clean keyboard input abstraction
- **Physics Engine**: Modular collision detection and movement
- **Rendering System**: Efficient canvas-based graphics
- **Game Loop**: Stable 60 FPS game loop with delta time
- **Camera System**: Smooth following camera with bounds

## 🎨 Game Levels

### Level 1: "The Beginning"
- **Difficulty**: Easy
- **Focus**: Basic movement and key collection
- **Keys**: 3
- **Features**: Simple platforms and jumps

### Level 2: "Switches and Doors"
- **Difficulty**: Medium
- **Focus**: Switch mechanics and puzzle solving
- **Keys**: 3
- **Features**: Interactive switches and doors

### Level 3: "Moving Platforms"
- **Difficulty**: Hard
- **Focus**: Timing and precision platforming
- **Keys**: 3
- **Features**: Moving platforms, spikes, and complex navigation

## 🛠️ Development

### Adding New Levels

1. **Edit `js/level.js`**
2. **Add to `LevelData` object**:

```javascript
level4: {
    id: 4,
    name: "Your Level Name",
    width: 2000,
    height: 600,
    spawnPoint: { x: 50, y: 400 },
    platforms: [
        { x: 0, y: 500, width: 200, height: 100 },
        // Add more platforms...
    ],
    objects: [
        { type: 'key', x: 100, y: 450 },
        { type: 'portal', x: 1800, y: 436 }
        // Add more objects...
    ]
}
```

### Debug Mode

Enable debug mode in the browser console:

```javascript
enableDebug()    // Shows FPS, player position, etc.
disableDebug()   // Hides debug info
godMode()        // Unlimited health and keys
skipLevel()      // Complete current level instantly
```

### Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support  
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile**: ⚠️ Limited (touch controls not implemented)

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- **Touch Controls**: Mobile support
- **Sound Effects**: Audio feedback
- **More Levels**: Additional challenges
- **Power-ups**: Special abilities
- **Animations**: Enhanced visual effects
- **Save System**: Progress persistence

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by classic Prince of Persia gameplay
- Built as part of the AI4Devs video game development challenge
- Uses Google Fonts (Cinzel) for Persian-themed typography
- No external game frameworks - pure vanilla JavaScript

## 🎯 Future Enhancements

- **Audio System**: Background music and sound effects
- **Particle System**: Enhanced visual effects
- **Level Editor**: In-browser level creation
- **Leaderboards**: Time-based scoring
- **Mobile Support**: Touch-friendly controls
- **Save System**: Progress and settings persistence

---

**Enjoy your adventure in the Will of Persia! 🏺✨**

For questions or issues, please open a GitHub issue or contact the development team. 