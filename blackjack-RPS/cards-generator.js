const fs = require('fs');
const path = require('path');

const suits = [
    { name: "spades", symbol: "♠", color: "#222" },
    { name: "hearts", symbol: "♥", color: "#c00" },
    { name: "diamonds", symbol: "♦", color: "#c00" },
    { name: "clubs", symbol: "♣", color: "#222" }
];
const ranks = [
    { name: "ace", label: "A" },
    { name: "2", label: "2" },
    { name: "3", label: "3" },
    { name: "4", label: "4" },
    { name: "5", label: "5" },
    { name: "6", label: "6" },
    { name: "7", label: "7" },
    { name: "8", label: "8" },
    { name: "9", label: "9" },
    { name: "10", label: "10" },
    { name: "jack", label: "J" },
    { name: "queen", label: "Q" },
    { name: "king", label: "K" }
];

const width = 180, height = 270, radius = 18;

function makeCardSVG(rank, suit) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="${radius}" fill="#fff" stroke="#222" stroke-width="4"/>
    <text x="18" y="40" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${suit.color}">${rank.label}</text>
    <text x="${width-28}" y="${height-40}" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${suit.color}" text-anchor="end" transform="rotate(180,${width-28},${height-40})">${rank.label}</text>
    <text x="34" y="70" font-size="32" font-family="Arial, sans-serif" fill="${suit.color}">${suit.symbol}</text>
    <text x="${width-40}" y="${height-74}" font-size="32" font-family="Arial, sans-serif" fill="${suit.color}" text-anchor="end" transform="rotate(180,${width-40},${height-74})">${suit.symbol}</text>
</svg>`;
}

function makeBackSVG() {
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="${width}" height="${height}" rx="${radius}" fill="#156d2c" stroke="#222" stroke-width="4"/>
    <rect x="20" y="20" width="${width-40}" height="${height-40}" rx="12" fill="none" stroke="#ffd700" stroke-width="6"/>
    <text x="${width/2}" y="${height/2+18}" font-size="62" font-family="Arial, sans-serif" font-weight="bold" fill="#ffd700" text-anchor="middle">♠♥♦♣</text>
</svg>`;
}

const outputDir = path.join(__dirname, 'assets');
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir);
}

for (const suit of suits) {
    for (const rank of ranks) {
        const filename = `${rank.name}_of_${suit.name}.svg`;
        const svg = makeCardSVG(rank, suit);
        fs.writeFileSync(path.join(outputDir, filename), svg, 'utf8');
        console.log(`Creada: ${filename}`);
    }
}

// Reverso
fs.writeFileSync(path.join(outputDir, "back.svg"), makeBackSVG(), 'utf8');
console.log("Creada: back.svg");
