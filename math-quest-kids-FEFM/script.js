// File: math-quest-kids-FEFM/script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const endScreen = document.getElementById('end-screen');

    const operationButtons = document.querySelectorAll('.operation-btn');
    const scoreDisplay = document.getElementById('score');
    const levelDisplay = document.getElementById('level');
    const questionDisplay = document.getElementById('question');
    const characterAvatar = document.getElementById('character-avatar');
    const answerOptionsContainer = document.getElementById('answer-options');
    const feedbackMessage = document.getElementById('feedback-message');
    const finalScoreDisplay = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-btn');

    // --- Audio Elements ---
    const correctSound = document.getElementById('correct-sound');
    const incorrectSound = document.getElementById('incorrect-sound');
    const levelUpSound = document.getElementById('level-up-sound');

    // --- Game State Variables ---
    let currentOperation = '';
    let score = 0;
    let level = 1;
    let currentQuestion = {};
    let questionsAnswered = 0; // To track progress within a level
    const QUESTIONS_PER_LEVEL = 5; // How many questions before difficulty increases

    // --- Avatar Image Paths ---
    const avatarPaths = {
        neutral: 'assets/astronaut_neutral.png',
        happy: 'assets/astronaut_happy.png',
        sad: 'assets/astronaut_sad.png'
    };

    // --- Game Functions ---

    /**
     * Switches the active screen in the game.
     * @param {HTMLElement} screenToShow - The screen element to make active.
     */
    function showScreen(screenToShow) {
        [startScreen, gameScreen, endScreen].forEach(screen => {
            screen.classList.remove('active');
        });
        screenToShow.classList.add('active');
    }

    /**
     * Initializes and starts a new game.
     * @param {string} operation - The selected math operation ('addition', 'subtraction', 'multiplication').
     */
    function startGame(operation) {
        currentOperation = operation;
        score = 0;
        level = 1;
        questionsAnswered = 0;
        updateGameInfo();
        showScreen(gameScreen);
        generateQuestion();
    }

    /**
     * Updates the score and level displays.
     */
    function updateGameInfo() {
        scoreDisplay.textContent = `Score: ${score}`;
        levelDisplay.textContent = `Level: ${level}`;
    }

    /**
     * Generates a random number within a specified range.
     * @param {number} min - The minimum value (inclusive).
     * @param {number} max - The maximum value (inclusive).
     * @returns {number} A random integer.
     */
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Generates a math question based on the current operation and level.
     */
    function generateQuestion() {
        let num1, num2, correctAnswer;
        let maxNum = 5 + (level - 1) * 3; // Increase max number with level
        maxNum = Math.min(maxNum, 20); // Cap max number for basic operations

        if (currentOperation === 'multiplication') {
            maxNum = 3 + (level - 1); // Smaller range for multiplication
            maxNum = Math.min(maxNum, 12); // Cap multiplication to 12x12
        }

        num1 = getRandomNumber(1, maxNum);
        num2 = getRandomNumber(1, maxNum);

        switch (currentOperation) {
            case 'addition':
                correctAnswer = num1 + num2;
                questionDisplay.textContent = `What is ${num1} + ${num2}?`;
                break;
            case 'subtraction':
                // Ensure result is not negative
                if (num1 < num2) {
                    [num1, num2] = [num2, num1]; // Swap to ensure num1 >= num2
                }
                correctAnswer = num1 - num2;
                questionDisplay.textContent = `What is ${num1} - ${num2}?`;
                break;
            case 'multiplication':
                correctAnswer = num1 * num2;
                questionDisplay.textContent = `What is ${num1} × ${num2}?`;
                break;
            default:
                console.error('Invalid operation');
                return;
        }

        currentQuestion = { num1, num2, correctAnswer };
        generateAnswerOptions(correctAnswer);
        resetFeedback();
        characterAvatar.src = avatarPaths.neutral; // Reset avatar
        characterAvatar.classList.remove('happy', 'sad');
    }

    /**
     * Generates and displays answer options for the current question.
     * @param {number} correctAnswer - The correct answer to the question.
     */
    function generateAnswerOptions(correctAnswer) {
        const options = new Set();
        options.add(correctAnswer);

        while (options.size < 3) {
            let wrongAnswer;
            // Generate plausible wrong answers (e.g., +/- 1, or slightly off)
            const variation = getRandomNumber(-3, 3); // Small variation
            wrongAnswer = correctAnswer + variation;

            // Ensure wrong answer is not negative and not the correct answer
            if (wrongAnswer < 0) wrongAnswer = correctAnswer + getRandomNumber(1, 3);
            if (wrongAnswer === correctAnswer) wrongAnswer = correctAnswer + (Math.random() > 0.5 ? 1 : -1) * getRandomNumber(1, 2);
            if (wrongAnswer < 0) wrongAnswer = correctAnswer + getRandomNumber(1, 3); // Re-check after adjustment

            options.add(wrongAnswer);
        }

        const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

        answerOptionsContainer.innerHTML = '';
        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('answer-btn');
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option, button));
            answerOptionsContainer.appendChild(button);
        });
    }

    /**
     * Checks if the selected answer is correct.
     * @param {number} selectedAnswer - The answer chosen by the player.
     * @param {HTMLElement} clickedButton - The button element that was clicked.
     */
    function checkAnswer(selectedAnswer, clickedButton) {
        // Disable all answer buttons temporarily
        answerOptionsContainer.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = true;
        });

        if (selectedAnswer === currentQuestion.correctAnswer) {
            handleCorrectAnswer(clickedButton);
        } else {
            handleIncorrectAnswer(clickedButton);
        }
    }

    /**
     * Handles a correct answer.
     * @param {HTMLElement} clickedButton - The button that was clicked.
     */
    function handleCorrectAnswer(clickedButton) {
        score += 10;
        questionsAnswered++;
        updateGameInfo();
        playAudio(correctSound);
        showFeedback('Correct! Stellar work!', 'correct');
        characterAvatar.src = avatarPaths.happy;
        characterAvatar.classList.add('happy');
        clickedButton.classList.add('correct');

        setTimeout(() => {
            if (questionsAnswered >= QUESTIONS_PER_LEVEL) {
                levelUp();
            } else {
                generateQuestion();
            }
            // Re-enable buttons after a short delay for next question
            answerOptionsContainer.querySelectorAll('.answer-btn').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('correct', 'incorrect');
            });
        }, 1500); // Short delay to show feedback
    }

    /**
     * Handles an incorrect answer.
     * @param {HTMLElement} clickedButton - The button that was clicked.
     */
    function handleIncorrectAnswer(clickedButton) {
        playAudio(incorrectSound);
        showFeedback('Oops! Try again, Space Cadet.', 'incorrect');
        characterAvatar.src = avatarPaths.sad;
        characterAvatar.classList.add('sad');
        clickedButton.classList.add('incorrect');

        // Re-enable only the incorrect button for retry, or all for a new question
        setTimeout(() => {
            clickedButton.classList.remove('incorrect');
            feedbackMessage.classList.remove('show');
            characterAvatar.src = avatarPaths.neutral;
            characterAvatar.classList.remove('happy', 'sad');

            // Re-enable all buttons to allow another attempt
            answerOptionsContainer.querySelectorAll('.answer-btn').forEach(btn => {
                btn.disabled = false;
            });
        }, 1500); // Short delay before allowing retry
    }

    /**
     * Displays a feedback message to the user.
     * @param {string} message - The message to display.
     * @param {string} type - 'correct' or 'incorrect' for styling.
     */
    function showFeedback(message, type) {
        feedbackMessage.textContent = message;
        feedbackMessage.className = 'feedback-message show ' + type; // Reset classes and add new ones
    }

    /**
     * Resets the feedback message.
     */
    function resetFeedback() {
        feedbackMessage.textContent = '';
        feedbackMessage.className = 'feedback-message';
    }

    /**
     * Increases the game level and generates a new question.
     */
    function levelUp() {
        level++;
        questionsAnswered = 0;
        playAudio(levelUpSound);
        showFeedback('Level Up! You\'re a Math Master!', 'correct'); // Use correct styling for level up
        updateGameInfo();
        setTimeout(() => {
            generateQuestion();
            // Re-enable buttons after level up
            answerOptionsContainer.querySelectorAll('.answer-btn').forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('correct', 'incorrect');
            });
        }, 2000); // Longer delay for level up message
    }

    /**
     * Ends the game and displays the final score.
     */
    function endGame() {
        finalScoreDisplay.textContent = score;
        showScreen(endScreen);
    }

    /**
     * Restarts the game from the beginning.
     */
    function restartGame() {
        showScreen(startScreen);
        // Reset any lingering styles or states
        answerOptionsContainer.querySelectorAll('.answer-btn').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
        });
        resetFeedback();
        characterAvatar.src = avatarPaths.neutral;
        characterAvatar.classList.remove('happy', 'sad');
    }

    /**
     * Plays an audio element.
     * @param {HTMLAudioElement} audio - The audio element to play.
     */
    function playAudio(audio) {
        audio.currentTime = 0; // Rewind to start
        audio.play().catch(e => console.error("Audio play failed:", e));
    }

    // --- Event Listeners ---

    // Operation selection buttons
    operationButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            startGame(event.target.dataset.operation);
        });
    });

    // Restart button
    restartButton.addEventListener('click', restartGame);

    // Optional: Add a way to end the game (e.g., after a certain number of levels or questions)
    // For now, the game continues indefinitely. You might add a "Quit" button or a level cap.
    // Example: If level reaches 10, call endGame() instead of levelUp().
    // if (level >= 10) { endGame(); } else { levelUp(); }
});
