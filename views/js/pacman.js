class Pacman {
    constructor(board) {
        this.row = 23;
        this.col = 14;
        this.dir = directions.left;
        this.cell = board.cell(this.row, this.col);
        this.cell.id = 'pacman';
        this.board = board;
        this.power_ups = 0;
        this.food_eaten = 1;
        this.lives = 3;
    }

    reset() {
        this.row = 23;
        this.col = 14;
        this.dir = directions.left;
        this.cell = board.cell(this.row, this.col);
        this.cell.id = 'pacman';
    }

    revive() {
        this.reset();
        this.lives = 3;
        this.food_eaten = 1;
        this.power_ups = 0;
        this.dir = directions.left;
    }

    update_dir(dir) {
        if (dir == directions.up && !this.board.at_barrier('wall', this.row - 1, this.col)) {
            this.dir = dir
        }
        else if (dir == directions.left && !this.board.at_barrier('wall', this.row, this.col - 1)) {
            this.dir = dir
        }
        else if (dir == directions.down && !this.board.at_barrier('wall', this.row + 1, this.col)) {
            this.dir = dir
        }
        else if (dir == directions.right && !this.board.at_barrier('wall', this.row, this.col + 1)) {
            this.dir = dir
        }
    }

    update_pos() {
        if (this.dir == directions.up && !this.board.at_barrier('wall', this.row - 1, this.col)) {
            this.row = this.row - 1;
        }
        else if (this.dir == directions.left && this.col == 0) {
            this.col = this.board.width - 1;
        }
        else if (this.dir == directions.left && !this.board.at_barrier('wall', this.row, this.col - 1)) {
            this.col = this.col - 1;
        }
        else if (this.dir == directions.down && !this.board.at_barrier('wall', this.row + 1, this.col)) {
            this.row = this.row + 1;
        }
        else if (this.dir == directions.right && this.col == this.board.width - 1) {
            this.col = 0;
        }
        else if (this.dir == directions.right && !this.board.at_barrier('wall', this.row, this.col + 1)) {
            this.col = this.col + 1;
        }
    }

    update_pacman_view() {
        this.cell.id = ''
        this.cell = this.board.cell(this.row, this.col);
        this.cell.id = 'pacman';
    }

    check_ghost_hit() {
        if (this.cell.classList.contains('ghost') && this.power_ups > 0) {
            board.eat_ghost(this.cell);
        } else if (this.cell.classList.contains('ghost')) {
            board.end_game(this.cell);
        }
    }

    eat_food() {
        if (this.cell.classList.contains('food')) {
            add_to_score(10);
            this.cell.classList.remove('food');
            this.food_eaten += 1;
            if (this.food_eaten >= 242) {
                alert(`Congrats, you won! Final score: ${score - 10}`);
                clearInterval(pacman_interval);
                clearInterval(ghost_interval);
                this.cell.id = '';
                for (let i = 0; i < board.height; ++i) {
                    for (let j = 0; j < board.width; ++j) {
                        let cell = board.cell(i, j);
                        if (cell.classList.contains("foodstart")) {
                            cell.classList.add("food");
                        }
                        if (cell.classList.contains("powerstart")) {
                            cell.classList.add("power-up");
                        }
                    }
                }
                for (let i = 0; i < board.ghosts.length; ++i) {
                    board.ghosts[i].kill();
                }
                board.ghosts = [
                    new Ghost(board, 'redghost')
                ];
                game_started = false;
                this.revive();
                score = 0;
            }
        }
        else if (this.cell.classList.contains('power-up')) {
            add_to_score(50);
            this.cell.classList.remove('power-up');
            this.power_ups += 1;
            $('.ghost').addClass('scared-ghost');

            setTimeout(function() {
                board.pacman.power_ups -= 1;
            }, 5000)
        }
    }

    move() {
        this.update_pos();

        this.update_pacman_view();

        this.check_ghost_hit();

        this.eat_food();
    }
};