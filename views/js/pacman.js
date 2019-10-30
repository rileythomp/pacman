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
        this.powered_up = false;
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
        // if (this.cell.classList.contains('ghost') && !this.powered_up) {
        //     clearInterval(game_interval);
        //     this.cell.id = '';
        //     return;
        // }

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

        if (this.cell.classList.contains('ghost') && !this.powered_up) {
            clearInterval(game_interval);
            this.cell.id = '';
            game_over = true;
            return;
        }

        if (this.cell.classList.contains('food')) {
            score += 10;
            document.getElementById('score').innerHTML = score;
            this.cell.classList.remove(this.cell.classList[0]);
        }
        else if (this.cell.classList.contains('power-up')) {
            score += 50;
            document.getElementById('score').innerHTML = score;
            this.cell.classList.remove(this.cell.classList[0]);
            this.powered_up = true;
            $('.ghost').addClass('scared-ghost');

            setTimeout(function() {
                board.pacman.powered_up = false;
            }, 10000)
        }
    }
};