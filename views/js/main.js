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
let game_interval;
let ghost_interval;
let game_started = false;
let game_over = false;
const interval_length = 125;

document.onkeydown = function(ev) {
    if (pressed_arrow_key(ev.keyCode)) {
        board.pacman.update_dir(ev.keyCode);

        if (!game_started) {
            game_started = true;

            game_interval = setInterval(function() {
                board.pacman.move();
            }, interval_length)
    
            ghost_interval = setInterval(function() {
                if (!game_over) {
                    for (let i = 0; i < board.ghosts.length; ++i) {
                        board.ghosts[i].chase();
                    }
                }
            }, interval_length + 25)
        }
    }
}

document.addEventListener('click', function() {
    for (let i = 0; i < board.ghosts.length; ++i) {
        board.ghosts[i].chase();
    }
})