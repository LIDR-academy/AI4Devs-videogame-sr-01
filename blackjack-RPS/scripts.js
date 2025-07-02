const minBet = 10;
let playerMoney = 50;
let deck = [];
let playerHands = [];
let playerBets = [];
let activeHandIndex = 0;
let dealerHand = [];
let currentBet = 0;
let gameActive = false;
let playerTurnActive = false;
let splitAvailable = false;

const moneySpan = document.getElementById('player-money');
const betForm = document.getElementById('bet-form');
const betInput = document.getElementById('bet-amount');
const hitBtn = document.getElementById('hit-btn');
const standBtn = document.getElementById('stand-btn');
const splitBtn = document.createElement('button');
splitBtn.id = "split-btn";
splitBtn.textContent = "Dividir";
splitBtn.style.marginLeft = "10px";
splitBtn.disabled = true;
const playerCardsDiv = document.getElementById('player-cards');
const dealerCardsDiv = document.getElementById('dealer-cards');
const playerScoreSpan = document.getElementById('player-score');
const dealerScoreSpan = document.getElementById('dealer-score');
const messageDiv = document.getElementById('message');
const newGameBtn = document.getElementById('new-game-btn');

if (!document.getElementById('split-btn')) {
    document.querySelector('.actions').appendChild(splitBtn);
}

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
    while (value > 21 && aces) {
        value -= 10;
        aces--;
    }
    return value;
}

function isBlackjack(hand) {
    return hand.length === 2 &&
        handValue(hand) === 21 &&
        (
            (hand[0].rank === 'ace' && hand[1].value === 10) ||
            (hand[1].rank === 'ace' && hand[0].value === 10)
        );
}

function canSplit(hand) {
    return (
        hand.length === 2 &&
        hand[0].value === hand[1].value
    );
}

function renderHands() {
    playerCardsDiv.innerHTML = '';
    playerScoreSpan.innerHTML = '';
    if (playerHands.length === 1) {
        let handDiv = document.createElement('div');
        handDiv.className = "player-hand";
        playerHands[0].forEach(card => {
            let img = document.createElement('img');
            img.className = 'card-img';
            img.src = card.img;
            img.alt = `${card.rank} of ${card.suit}`;
            handDiv.appendChild(img);
        });
        playerCardsDiv.appendChild(handDiv);
        playerScoreSpan.textContent = handValue(playerHands[0]);
    } else {
        playerHands.forEach((hand, i) => {
            let handDiv = document.createElement('div');
            handDiv.className = "player-hand";
            if (i === activeHandIndex) handDiv.style.border = "3px solid #ffd700";
            else handDiv.style.opacity = "0.7";
            hand.forEach(card => {
                let img = document.createElement('img');
                img.className = 'card-img';
                img.src = card.img;
                img.alt = `${card.rank} of ${card.suit}`;
                handDiv.appendChild(img);
            });
            let scoreSpan = document.createElement('span');
            scoreSpan.style.display = "block";
            scoreSpan.style.color = "#ffd700";
            scoreSpan.style.marginTop = "5px";
            scoreSpan.textContent = `Puntos: ${handValue(hand)}`;
            handDiv.appendChild(scoreSpan);

            let label = document.createElement('div');
            label.style.fontWeight = "bold";
            label.style.fontSize = "0.9em";
            label.style.color = "#fff";
            label.textContent = `Mano ${i+1}`;
            handDiv.prepend(label);

            playerCardsDiv.appendChild(handDiv);
        });
    }
}

function renderDealerHand(hideFirst = false) {
    dealerCardsDiv.innerHTML = '';
    dealerHand.forEach((card, idx) => {
        let img = document.createElement('img');
        img.className = 'card-img';
        img.src = (hideFirst && idx === 0) ? 'assets/back.svg' : card.img;
        img.alt = `${card.rank} of ${card.suit}`;
        dealerCardsDiv.appendChild(img);
    });
}

function updateMoney() {
    moneySpan.textContent = `Dinero: ${playerMoney} €`;
}

function resetBoard() {
    playerHands = [];
    playerBets = [];
    dealerHand = [];
    activeHandIndex = 0;
    playerScoreSpan.textContent = '';
    dealerScoreSpan.textContent = '';
    playerCardsDiv.innerHTML = '';
    dealerCardsDiv.innerHTML = '';
    messageDiv.textContent = '';
    hitBtn.disabled = true;
    standBtn.disabled = true;
    splitBtn.disabled = true;
    splitBtn.style.display = 'none';
}

function startRound(bet) {
    resetBoard();
    gameActive = true;
    playerTurnActive = true;
    currentBet = bet;
    activeHandIndex = 0;
    playerHands = [[]];
    playerBets = [bet];
    playerMoney -= bet;
    updateMoney();

    if (deck.length < 15) deck = buildDeck(), shuffle(deck);

    playerHands[0] = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];

    renderHands();
    renderDealerHand(true);
    dealerScoreSpan.textContent = '?';

    hitBtn.disabled = false;
    standBtn.disabled = false;
    betForm.style.display = 'none';

    splitAvailable = canSplit(playerHands[0]) && playerMoney >= bet;
    if (splitAvailable) {
        splitBtn.disabled = false;
        splitBtn.style.display = 'inline-block';
        messageDiv.textContent = "¡Tienes dos cartas iguales! Puedes dividir.";
    } else {
        splitBtn.disabled = true;
        splitBtn.style.display = 'none';
        const playerBJ = isBlackjack(playerHands[0]);
        const dealerBJ = isBlackjack(dealerHand);

        if (playerBJ || dealerBJ) {
            setTimeout(() => {
                renderDealerHand(false);
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
}

function endRound(result, blackjack = false, splitResults = null) {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    splitBtn.disabled = true;
    splitBtn.style.display = 'none';
    renderDealerHand(false);
    dealerScoreSpan.textContent = handValue(dealerHand);

    if (splitResults) {
        let msg = '';
        splitResults.forEach((r, i) => {
            let winnings = 0;
            if (r === 'blackjack') {
                winnings = playerBets[i] + Math.floor(playerBets[i] * 1.5);
                playerMoney += winnings;
                msg += `Mano ${i+1}: ¡Blackjack! +${winnings}€<br>`;
            } else if (r === 'win') {
                winnings = playerBets[i] * 2;
                playerMoney += winnings;
                msg += `Mano ${i+1}: ¡Ganaste! +${winnings}€<br>`;
            } else if (r === 'push') {
                winnings = playerBets[i];
                playerMoney += winnings;
                msg += `Mano ${i+1}: Empate (push). +${winnings}€<br>`;
            } else {
                msg += `Mano ${i+1}: Perdiste.<br>`;
            }
        });
        updateMoney();
        messageDiv.innerHTML = msg;
    } else {
        let winnings = 0;
        let msg = "";
        if (result === 'blackjack') {
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
    }

    if (playerMoney < minBet) {
        messageDiv.innerHTML += ' | Sin saldo: ¡Has perdido!';
        newGameBtn.style.display = 'inline-block';
        betForm.style.display = 'none';
    } else {
        newGameBtn.style.display = 'inline-block';
    }
    gameActive = false;
    playerTurnActive = false;
}

splitBtn.addEventListener('click', function() {
    if (!splitAvailable || playerHands.length > 1) return;
    if (playerMoney < currentBet) {
        messageDiv.textContent = "No tienes suficiente saldo para dividir.";
        return;
    }
    playerMoney -= currentBet;
    playerBets = [currentBet, currentBet];
    let card1 = playerHands[0][0];
    let card2 = playerHands[0][1];
    playerHands = [
        [card1, deck.pop()],
        [card2, deck.pop()]
    ];
    activeHandIndex = 0;
    updateMoney();
    splitAvailable = false;
    splitBtn.disabled = true;
    splitBtn.style.display = 'none';
    renderHands();

    if (card1.rank === 'ace') {
        setTimeout(() => playDealerAfterSplit(), 800);
        messageDiv.textContent = "¡Has dividido ases! Solo una carta por mano.";
        hitBtn.disabled = true;
        standBtn.disabled = true;
        playerTurnActive = false;
        return;
    } else {
        messageDiv.textContent = "Juega primero la Mano 1.";
        hitBtn.disabled = false;
        standBtn.disabled = false;
        playerTurnActive = true;
    }
});

function finishCurrentHandOrNext() {
    activeHandIndex++;
    if (activeHandIndex < playerHands.length) {
        messageDiv.textContent = `Juega la Mano ${activeHandIndex + 1}.`;
        renderHands();
        hitBtn.disabled = false;
        standBtn.disabled = false;
        playerTurnActive = true;
    } else {
        hitBtn.disabled = true;
        standBtn.disabled = true;
        playerTurnActive = false;
        setTimeout(() => playDealerAfterSplit(), 600);
    }
}

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

newGameBtn.addEventListener('click', function(){
    if (playerMoney < minBet) {
        playerMoney = 50;
        updateMoney();
    }
    betForm.style.display = '';
    newGameBtn.style.display = 'none';
    resetBoard();
});

function playDealerAfterSplit() {
    renderDealerHand(false);
    dealerScoreSpan.textContent = handValue(dealerHand);

    function dealerMove() {
        let dealerVal = handValue(dealerHand);
        if (dealerVal < 17) {
            dealerHand.push(deck.pop());
            renderDealerHand(false);
            dealerScoreSpan.textContent = handValue(dealerHand);
            setTimeout(dealerMove, 700);
        } else {
            let splitResults = [];
            for (let i = 0; i < playerHands.length; i++) {
                let hand = playerHands[i];
                let bet = playerBets[i];
                let dealerVal = handValue(dealerHand);
                let playerVal = handValue(hand);

                let isBJ = isBlackjack(hand);
                if (isBJ) {
                    if (hand.length === 2 && hand[0].rank === 'ace' && hand[1].value === 10 ||
                        hand[1].rank === 'ace' && hand[0].value === 10) {
                        splitResults.push('win');
                        continue;
                    }
                }
                if (playerVal > 21) splitResults.push('lose');
                else if (dealerVal > 21) splitResults.push('win');
                else if (playerVal > dealerVal) splitResults.push('win');
                else if (playerVal < dealerVal) splitResults.push('lose');
                else splitResults.push('push');
            }
            endRound(null, false, splitResults);
        }
    }
    dealerMove();
}

function playDealer() {
    renderDealerHand(false);
    dealerScoreSpan.textContent = handValue(dealerHand);
    function dealerMove() {
        let dealerVal = handValue(dealerHand);
        if (dealerVal < 17) {
            dealerHand.push(deck.pop());
            renderDealerHand(false);
            dealerScoreSpan.textContent = handValue(dealerHand);
            setTimeout(dealerMove, 700);
        } else {
            let finalDealer = handValue(dealerHand);
            let finalPlayer = handValue(playerHands[0]);
            let result;
            if (finalDealer > 21) result = 'win';
            else if (finalPlayer > finalDealer) result = 'win';
            else if (finalPlayer < finalDealer) result = 'lose';
            else result = 'push';
            endRound(result);
        }
    }
    dealerMove();
}

standBtn.addEventListener('click', function(){
    if (!gameActive || !playerTurnActive) return;
    if (playerHands.length > 1) {
        finishCurrentHandOrNext();
    } else {
        playerTurnActive = false;
        hitBtn.disabled = true;
        standBtn.disabled = true;
        playDealer();
    }
});

// --- PLANTARSE AUTOMÁTICO SI SE LLEGA A 21 ---
hitBtn.addEventListener('click', function(){
    if (!gameActive || !playerTurnActive) return;
    let hand = playerHands[activeHandIndex];
    hand.push(deck.pop());
    renderHands();
    let val = handValue(hand);

    if (val > 21) {
        if (playerHands.length > 1) {
            setTimeout(() => finishCurrentHandOrNext(), 600);
        } else {
            setTimeout(() => endRound('lose'), 600);
        }
    } else if (val === 21) {
        setTimeout(() => {
            if (playerHands.length > 1) {
                finishCurrentHandOrNext();
            } else {
                playerTurnActive = false;
                hitBtn.disabled = true;
                standBtn.disabled = true;
                playDealer();
            }
        }, 600);
    }
});

updateMoney();
resetBoard();
deck = buildDeck();
shuffle(deck);
