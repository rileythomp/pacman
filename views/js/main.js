const directions = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
}

function pressed_arrow_key(keyCode) {
    return keyCode >= 37 && keyCode <= 40;
}

function add_to_score(n) {
    score += n;
    document.getElementById('score').innerHTML = score;
}

let board = new Board();
let score = 0;
let pacman_interval;
let ghost_interval;
let game_started = false;
let game_over = false;
const interval_length = 125;

document.onkeydown = function(ev) {
    if (pressed_arrow_key(ev.keyCode)) {
        board.pacman.update_dir(ev.keyCode);

        if (!game_started) {
            game_started = true;

            pacman_interval = setInterval(function() {
                board.pacman.move();
                if (board.pacman.food_eaten == 30) {
                    board.ghosts.push(new Ghost(board, 'blueghost'))
                }
            }, interval_length)
    
            ghost_interval = setInterval(function() {
                if (!game_over) {
                    for (let i = 0; i < board.ghosts.length; ++i) {
                        board.ghosts[i].chase();
                    }
                }
            }, interval_length + 15)
        }
    }
}

document.addEventListener('click', function() {
    clearInterval(pacman_interval);
    for (let i = 0; i < board.ghosts.length; ++i) {
        board.ghosts[i].chase();
    }
})