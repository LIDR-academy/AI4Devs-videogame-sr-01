// --- Configuración inicial ---
const minBet = 10;
let playerMoney = 50;
let deck = [];
let playerHand = [];
let dealerHand = [];
let currentBet = 0;
let gameActive = false;
let playerTurnActive = false;

// --- Elementos DOM ---
const moneySpan = document.getElementById('player-money');
const betForm = document.getElementById('bet-form');
const betInput = document.getElementById('bet-amount');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerScoreSpan = document.getElementById('player-score');
const dealerScoreSpan = document.getElementById('dealer-score');
const messageDiv = document.getElementById('message');
const newGameBtn = document.getElementById('new-game-btn');

// --- Utilidades ---
function buildDeck() {
    const suits = ['spades', 'hearts', 'diamonds', 'clubs'];
    const ranks = [
        {name: 'ace', value: 11, label: 'A'},
        {name: '2', value: 2, label: '2'},
        {name: '3', value: 3, label: '3'},
        {name: '4', value: 4, label: '4'},
        {name: '5', value: 5, label: '5'},
        {name: '6', value: 6, label: '6'},
        {name: '7', value: 7, label: '7'},
        {name: '8', value: 8, label: '8'},
        {name: '9', value: 9, label: '9'},
        {name: '10', value: 10, label: '10'},
        {name: 'jack', value: 10, label: 'J'},
        {name: 'queen', value: 10, label: 'Q'},
        {name: 'king', value: 10, label: 'K'},
    ];
    let newDeck = [];
    suits.forEach(suit => {
        ranks.forEach(rank => {
            newDeck.push({
                suit,
                rank: rank.name,
                value: rank.value,
                img: `assets/${rank.name}_of_${suit}.svg`
            });
        });
    });
    return newDeck;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function handValue(hand) {
    let value = 0;
    let aces = 0;
    for (let card of hand) {
        value += card.value;
        if (card.rank === 'ace') aces++;
    }
    // Ajusta el valor de los ases si se pasa de 21
    while (value > 21 && aces) {
        value -= 10;
        aces--;
    }
    return value;
}

function renderHand(div, hand, hideFirst=false) {
    div.innerHTML = '';
    hand.forEach((card, idx) => {
        let img = document.createElement('img');
        img.className = 'card-img';
        img.src = (hideFirst && idx === 0)
            ? 'assets/back.svg'
            : card.img;
        img.alt = `${card.rank} of ${card.suit}`;
        div.appendChild(img);
    });
}

function isBlackjack(hand) {
    return hand.length === 2 &&
        handValue(hand) === 21 &&
        (
            (hand[0].rank === 'ace' && hand[1].value === 10) ||
            (hand[1].rank === 'ace' && hand[0].value === 10)
        );
}

// --- Control de la partida ---
function updateMoney() {
    moneySpan.textContent = `Dinero: ${playerMoney} €`;
}

function resetBoard() {
    playerHand = [];
    dealerHand = [];
    playerScoreSpan.textContent = '';
    dealerScoreSpan.textContent = '';
    renderHand(playerCardsDiv, []);
    renderHand(dealerCardsDiv, []);
    messageDiv.textContent = '';
    hitBtn.disabled = true;
    standBtn.disabled = true;
}

function startRound(bet) {
    resetBoard();
    gameActive = true;
    playerTurnActive = true;
    currentBet = bet;
    playerMoney -= bet;
    updateMoney();

    if (deck.length < 15) deck = buildDeck(), shuffle(deck);

    // Reparte cartas
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    renderHand(playerCardsDiv, playerHand);
    renderHand(dealerCardsDiv, dealerHand, true);
    playerScoreSpan.textContent = handValue(playerHand);
    dealerScoreSpan.textContent = '?';

    hitBtn.disabled = false;
    standBtn.disabled = false;
    betForm.style.display = 'none';

    // ---- Reglas blackjack natural ----
    const playerBJ = isBlackjack(playerHand);
    const dealerBJ = isBlackjack(dealerHand);

    if (playerBJ || dealerBJ) {
        setTimeout(() => {
            renderHand(dealerCardsDiv, dealerHand, false);
            dealerScoreSpan.textContent = handValue(dealerHand);

            if (playerBJ && dealerBJ) {
                endRound('push', true);
            } else if (playerBJ) {
                endRound('blackjack');
            } else if (dealerBJ) {
                endRound('lose');
            }
        }, 700);
        hitBtn.disabled = true;
        standBtn.disabled = true;
        playerTurnActive = false;
        gameActive = false;
        return;
    }

    messageDiv.textContent = "¡Tu turno! Elige: Pedir o Plantarse.";
}

function endRound(result, blackjack=false) {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    renderHand(dealerCardsDiv, dealerHand, false);
    dealerScoreSpan.textContent = handValue(dealerHand);

    let winnings = 0;
    let msg = "";

    if (result === 'blackjack') {
        // Blackjack natural, paga 3:2
        winnings = currentBet + Math.floor(currentBet * 1.5);
        playerMoney += winnings;
        updateMoney();
        msg = `¡Blackjack! Pagas 3:2. Has ganado ${winnings} €`;
    }
    else if (result === 'win') {
        winnings = currentBet * 2;
        playerMoney += winnings;
        updateMoney();
        msg = '¡Has ganado!';
    }
    else if (result === 'lose') {
        msg = 'Has perdido la mano.';
    }
    else if (result === 'push') {
        winnings = currentBet;
        playerMoney += winnings;
        updateMoney();
        msg = 'Empate: recuperas tu apuesta.';
    }

    messageDiv.textContent = msg;

    if (playerMoney < minBet) {
        messageDiv.textContent += ' | Sin saldo: ¡Has perdido!';
        newGameBtn.style.display = 'inline-block';
        betForm.style.display = 'none';
    } else {
        newGameBtn.style.display = 'inline-block';
    }
    gameActive = false;
    playerTurnActive = false;
}

// --- Eventos ---
betForm.addEventListener('submit', function(e){
    e.preventDefault();
    let bet = parseInt(betInput.value);
    if (isNaN(bet) || bet < minBet) {
        messageDiv.textContent = `Apuesta mínima: ${minBet} €`;
        return;
    }
    if (bet > playerMoney) {
        messageDiv.textContent = "No tienes suficiente dinero.";
        return;
    }
    startRound(bet);
});

hitBtn.addEventListener('click', function(){
    if (!gameActive || !playerTurnActive) return;
    playerHand.push(deck.pop());
    renderHand(playerCardsDiv, playerHand);
    let val = handValue(playerHand);
    playerScoreSpan.textContent = val;
    if (val > 21) {
        playerTurnActive = false;
        setTimeout(() => endRound('lose'), 600);
    }
});

standBtn.addEventListener('click', function(){
    if (!gameActive || !playerTurnActive) return;
    playerTurnActive = false;
    // Turno de la banca
    renderHand(dealerCardsDiv, dealerHand, false);
    let playerVal = handValue(playerHand);
    let dealerVal = handValue(dealerHand);
    dealerScoreSpan.textContent = dealerVal;

    // Banca pide hasta 17 o más
    setTimeout(function dealerMove() {
        dealerVal = handValue(dealerHand);
        if (dealerVal < 17) {
            dealerHand.push(deck.pop());
            renderHand(dealerCardsDiv, dealerHand, false);
            dealerScoreSpan.textContent = handValue(dealerHand);
            setTimeout(dealerMove, 700);
        } else {
            // Compara resultados
            let finalDealer = handValue(dealerHand);
            let finalPlayer = handValue(playerHand);
            let result;
            if (finalDealer > 21) result = 'win';
            else if (finalPlayer > finalDealer) result = 'win';
            else if (finalPlayer < finalDealer) result = 'lose';
            else result = 'push';
            endRound(result);
        }
    }, 700);
});

newGameBtn.addEventListener('click', function(){
    if (playerMoney < minBet) {
        // Sin dinero: reset total
        playerMoney = 50;
        updateMoney();
    }
    betForm.style.display = '';
    newGameBtn.style.display = 'none';
    resetBoard();
});

// Al cargar
updateMoney();
resetBoard();
deck = buildDeck();
shuffle(deck);
