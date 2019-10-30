class Ghost {
    constructor(board, row, col, height, width) {
        this.dir = directions.right;
        this.cell = board.cell(row, col);
        this.cell.classList.add('ghost');
        this.row = row;
        this.col = col;
        this.board = board;
        this.board_height = height;
        this.board_width = width;
    }

    chase() {
        if (this.cell.id == 'player' && !this.board.pacman.powered_up) {
            clearInterval(game_interval);
            this.cell.id = '';
            game_over = true;
            return;
        }

        let has_chased = false;
        while (!has_chased) {
            if (this.dir == directions.up && !this.board.at_wall(this.row - 1, this.col)) {
                this.row = this.row - 1;
                has_chased = true;
            }
            else if (this.dir == directions.left && !this.board.at_wall(this.row, this.col - 1)) {
                this.col = this.col - 1;
                has_chased = true;
            }
            else if (this.dir == directions.down && !this.board.at_wall(this.row + 1, this.col)) {
                this.row = this.row + 1;
                has_chased = true;
            }
            else if (this.dir == directions.right && !this.board.at_wall(this.row, this.col + 1)) {
                this.col = this.col + 1;
                has_chased = true;
            }
            else {
                // this.dir = Math.floor(Math.random() * 4) + 37;
                this.dir = directions.right == this.dir ? directions.left : directions.right;
            }
        }

        this.cell.classList.remove('ghost');
        if (this.cell.classList.contains('scared-ghost')) {
            this.cell.classList.remove('scared-ghost');
        }

        this.cell = this.board.cell(this.row, this.col);
        this.cell.classList.add('ghost');

        if (this.board.pacman.powered_up) {
            this.cell.classList.add('scared-ghost');
        }
        else if (this.cell.id == 'pacman') {
            clearInterval(game_interval);
            this.cell.id = '';
            game_over = true;
        }
    }
};