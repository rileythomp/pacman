class Pacman {
    constructor(board, row, col, height, width) {
        this.dir = directions.left;
        this.cell = board.cell(row, col);
        this.cell.id = 'pacman';
        this.row = row;
        this.col = col;
        this.board = board;
        this.board_height = height;
        this.board_width = width;
        this.powered_up = 0;
    }

    update_dir(dir) {
        if (dir == directions.up && !this.board.at_wall(this.row - 1, this.col)) {
            this.dir = dir
        }
        else if (dir == directions.left && !this.board.at_wall(this.row, this.col - 1)) {
            this.dir = dir
        }
        else if (dir == directions.down && !this.board.at_wall(this.row + 1, this.col)) {
            this.dir = dir
        }
        else if (dir == directions.right && !this.board.at_wall(this.row, this.col + 1)) {
            this.dir = dir
        }
    }

    move() {
        if (this.dir == directions.up && !this.board.at_wall(this.row - 1, this.col)) {
            this.row = this.row - 1;
        }
        else if (this.dir == directions.left && this.col == 0) {
            this.col = this.board_width - 1;
        }
        else if (this.dir == directions.left && !this.board.at_wall(this.row, this.col - 1)) {
            this.col = this.col - 1;
        }
        else if (this.dir == directions.down && !this.board.at_wall(this.row + 1, this.col)) {
            this.row = this.row + 1;
        }
        else if (this.dir == directions.right && this.col == this.board_width - 1) {
            this.col = 0;
        }
        else if (this.dir == directions.right && !this.board.at_wall(this.row, this.col + 1)) {
            this.col = this.col + 1;
        }

        this.cell.id = ''
        this.cell = this.board.cell(this.row, this.col);
        this.cell.id = 'pacman';
        if (!this.cell.classList.contains('pathway')) {
            this.cell.classList.add('pathway');
        }

        if (this.cell.classList.contains('ghost') && this.powered_up == 0) {
            clearInterval(game_interval);
            this.cell.id = '';
            game_over = true;
            return;
        } else if (this.cell.classList.contains('ghost')) {
            // eat the ghost
            score += 200;
            document.getElementById('score').innerHTML = score;
            this.board.ghost.cell.classList.remove('ghost');
            this.board.ghost.cell.classList.remove('scared-ghost');
            this.board.ghost.can_chase = false;
            setTimeout(function() {
                board.ghost.col = 13;
                board.ghost.row = 11;
                board.ghost.cell = board.cell(board.ghost.row, board.ghost.col);
                if (board.pacman.powered_up > 0) {
                    board.ghost.cell.classList.add('scared-ghost');
                }
                board.ghost.cell.classList.add('ghost');
                board.ghost.can_chase = true;
            }, 10000)
        }

        if (this.cell.classList.contains('food')) {
            score += 10;
            document.getElementById('score').innerHTML = score;
            this.cell.classList.remove('food');
        }
        else if (this.cell.classList.contains('power-up')) {
            score += 50;
            document.getElementById('score').innerHTML = score;
            this.cell.classList.remove('power-up');
            this.powered_up += 1;
            $('.ghost').addClass('scared-ghost');

            setTimeout(function() {
                board.pacman.powered_up -= 1;
            }, 10000)
        }
    }
};