const player0 = document.querySelector('.player-0');
const player1 = document.querySelector('.player-1');

const player0Name = player0.querySelector('.player__name');
const player1Name = player1.querySelector('.player__name');
const player0Score = player0.querySelector('.player__score');
const player1Score = player1.querySelector('.player__score');

const memoryCardContainer = document.querySelector('.memory-card-container');

let activePlayer = 0;
let score = [0, 0];
let turn = [];

function loadGame() {
    const pairs = parseInt(document.querySelector('.pair-input').value);
    setNames(
        Array.from(document.querySelectorAll('.name-input')).map(
            (entry) => entry.value
        )
    );
    document.querySelector('.menu').style = 'display: none;';
    memoryCardContainer.style = 'display: grid;';
    memoryCardContainer.innerHTML = shuffle(
        Array.from(document.querySelectorAll('.memory-card')).slice(
            0,
            pairs * 2
        )
    );
    for (let i = 8; i > 1; i--) {
        if (pairs % i === 0) {
            memoryCardContainer.style.gridTemplateColumns = `repeat(${i}, 1fr)`;
            break;
        }
    }
    document.querySelector('.timer').style = 'display: block;';
    game();
}

function setNames(names) {
    player0Name.innerHTML = names[0];
    player0.style = 'display: block;background-color: #090;';
    player1Name.innerHTML = names[1];
    player1.style = 'display: block;';
}

function displayWin(score) {
    const name = document.querySelector(
        `.player-${score[0] > score[1] ? 0 : 1} .player__name`
    ).innerHTML;
    document.querySelector('.win-message').innerHTML = `${name} wins!`;
}

function onMemoryCardClick(event, memoryCards) {
    !turn.length &&
        memoryCards.forEach((item) => {
            item.style.setProperty('--memoryCardBgOpacity', '1');
        });
    if (!turn.includes(event.target)) {
        event.target.style.setProperty('--memoryCardBgOpacity', '0');
        turn.push(event.target);
        if (turn.length === 2) {
            if (
                turn[0]
                    .querySelector('.memory-card__image')
                    .getAttribute('src') ===
                turn[1].querySelector('.memory-card__image').getAttribute('src')
            ) {
                score[activePlayer] = score[activePlayer] + 1;
                turn[0].style = 'opacity: 0;';
                turn[1].style = 'opacity: 0;';
                if (
                    score[0] + score[1] ===
                    document.querySelectorAll('.memory-card').length / 2
                ) {
                    displayWin(score);
                }
            } else {
                document.querySelector(`.player-${activePlayer}`).style =
                    'display: block;background-color: #fff;';
                activePlayer = activePlayer === 0 ? 1 : 0;
                document.querySelector(`.player-${activePlayer}`).style =
                    'display: block;background-color: #090;';
            }

            turn = [];
        }
        player0Score.innerHTML = score[0];
        player1Score.innerHTML = score[1];
    }
}

function game() {
    const start = Date.now();
    const timer = document.querySelector('.timer');
    const memoryCards = document.querySelectorAll('.memory-card');
    const interval = setInterval(function () {
        const time = 20000 - (Date.now() - start);
        if (time <= 1000) {
            timer.remove();
            memoryCards.forEach((card) => {
                card.style.setProperty('--memoryCardBgOpacity', '1');
                card.addEventListener('click', (event) => {
                    onMemoryCardClick(event, memoryCards);
                });
            });
            clearInterval(interval);
        } else {
            timer.innerHTML = Math.round(time / 1000);
        }
    }, 100);
}

function shuffle(cards) {
    const shuffledCards = [];
    for (let i = cards.length; i > 0; i--) {
        const index = Math.floor(Math.random() * i);
        shuffledCards.push(cards.splice(index, 1)[0].outerHTML);
    }
    return shuffledCards.join('');
}
