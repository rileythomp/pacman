const directions = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
}

Number.prototype.is_between = function(a, b) {
    return this >= a && this <= b;
}

let board = new Board();
let score = 0;
let game_interval;
let game_over = false;
const interval_length = 125;

document.onkeydown = function(ev) {
    if (ev.keyCode.is_between(directions.left, directions.down)) {
        board.pacman.update_dir(ev.keyCode);
    }

    if (ev.keyCode.is_between(directions.left, directions.down) && game_interval == undefined) {
        game_interval = setInterval(function() {
            board.pacman.move();
            if (!game_over) {
                board.ghost.chase();
            }
        }, interval_length)
    }
}