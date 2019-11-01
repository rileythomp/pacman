class Ghost {
    set_start_pos(color) {
        this.row = 11;

        if (color == 'orangeghost') {
            this.col = 12;
        } else if (color == 'redghost') {
            this.col = 13;
        } else if (color == 'pinkghost') {
            this.col = 14;
        } else if (color == 'blueghost') {
            this.col = 15;
        }
    }

    constructor(board, color) {
        this.color = color
        this.set_start_pos(color)
        this.dir = directions.right;
        this.cell = board.cell(this.row, this.col);
        this.cell.classList.add('ghost');
        this.cell.setAttribute('data-ghost', this.color);
        this.board = board;
        this.desired_vert = directions.down;
        this.desired_horiz = directions.right;
        this.desired_dir = this.desired_vert;
    }

    update_desired_dirs() {
        let pacman_row = this.board.pacman.row;
        let pacman_col = this.board.pacman.col;
        let col_diff = Math.abs(pacman_col - this.col);
        let row_diff = Math.abs(pacman_row - this.row);

        this.desired_vert = (pacman_row >= this.row ? directions.down : directions.up);
        this.desired_horiz = (pacman_col >= this.col ? directions.right : directions.left);
        this.desired_dir = (row_diff >= col_diff ? this.desired_vert : this.desired_horiz);
    }

    opposite_of_dir(dir) {
        return Math.abs(this.dir - dir) == 2;
    }
    
    update_pos() {
        if (this.dir == directions.up && this.board.open_cell(this.row - 1, this.col)) {
            this.row = this.row - 1;
        }
        else if (this.dir == directions.left && this.col == 0) {
            this.col = this.board.width - 1;
        }
        else if (this.dir == directions.left && this.board.open_cell(this.row, this.col - 1)) {
            this.col = this.col - 1;
        }
        else if (this.dir == directions.down && this.board.open_cell(this.row + 1, this.col)) {
            this.row = this.row + 1;
        }
        else if (this.dir == directions.right && this.col == this.board.width - 1) {
            this.col = 0;
        }
        else if (this.dir == directions.right && this.board.open_cell(this.row, this.col + 1)) {
            this.col = this.col + 1;
        } else {
            console.warn('problem');
        }
    }

    update_ghost_view() {
        this.cell.removeAttribute('data-ghost');
        this.cell.classList.remove('ghost');
        if (this.cell.classList.contains('scared-ghost')) {
            this.cell.classList.remove('scared-ghost');
        }

        this.cell = this.board.cell(this.row, this.col);
        this.cell.classList.add('ghost');
        this.cell.setAttribute('data-ghost', this.color);

        if (this.board.pacman.power_ups > 0) {
            this.cell.classList.add('scared-ghost');
        }
    }
    
    check_pacman_hit() {
        if (this.cell.id == 'pacman' && this.board.pacman.power_ups > 0) {
            board.eat_ghost(this.cell);
        }
        else if (this.cell.id == 'pacman') {
            board.end_game(this.cell);
        }
    }

    opposite_of(dir) {
        return (dir + 2 > 40 ? dir - 2 : dir + 2);
    }

    set_dir() {
        this.update_desired_dirs();

        // Try to go in the desired direction
        if (this.desired_dir == directions.up && this.board.open_cell(this.row - 1, this.col) && !this.opposite_of_dir(this.desired_dir)) {
            this.dir = this.desired_dir;
        }
        else if (this.desired_dir == directions.left && this.board.open_cell(this.row, this.col - 1) && !this.opposite_of_dir(this.desired_dir)) {
            this.dir = this.desired_dir;
        }
        else if (this.desired_dir == directions.down && this.board.open_cell(this.row + 1, this.col) && !this.opposite_of_dir(this.desired_dir)) {
            this.dir = this.desired_dir;
        }
        else if (this.desired_dir == directions.right && this.board.open_cell(this.row, this.col + 1) && !this.opposite_of_dir(this.desired_dir)) {
            this.dir = this.desired_dir;
        }

        // Couldn't move in desired direction
        // Try desired direction in other orientation
        else if (this.desired_dir == this.desired_vert && this.desired_horiz == directions.left && this.board.open_cell(this.row, this.col - 1) && !this.opposite_of_dir(this.desired_horiz)) {
            this.dir = this.desired_horiz;
        }
        else if (this.desired_dir == this.desired_vert && this.desired_horiz == directions.right && this.board.open_cell(this.row, this.col + 1) && !this.opposite_of_dir(this.desired_horiz)) {
            this.dir = this.desired_horiz;
        }
        else if (this.desired_dir == this.desired_horiz && this.desired_vert == directions.up && this.board.open_cell(this.row - 1, this.col) && !this.opposite_of_dir(this.desired_vert)) {
            this.dir = this.desired_vert;
        }
        else if (this.desired_dir == this.desired_horiz && this.desired_vert == directions.down && this.board.open_cell(this.row + 1, this.col) && !this.opposite_of_dir(this.desired_vert)) {
            this.dir = this.desired_vert;
        }

        // Couldn't go in desired vertical or horizontal directions
        // Try opposite direction in orientation that wasn't desired direction
        // E.g. desired_dir = down, desired_horiz = right, try left
        else if (this.desired_dir == this.desired_vert && this.board.open_cell(this.row, (this.opposite_of(this.desired_horiz) == directions.right ? this.col + 1 : this.col - 1)) && !this.opposite_of_dir(this.opposite_of(this.desired_horiz))) {
            this.dir = this.opposite_of(this.desired_horiz);
        }
        else if (this.desired_dir == this.desired_horiz && this.board.open_cell((this.opposite_of(this.desired_vert) == directions.down ? this.row + 1 : this.row - 1), this.col) && !this.opposite_of_dir(this.opposite_of(this.desired_vert))) {
            this.dir = this.opposite_of(this.desired_vert);
        }

        // Go in opposite direction of desired direction if can't move anywhere else
        else {
            this.dir = this.opposite_of(this.desired_dir);
        }
    }

    chase() {
        this.set_dir();
        
        this.update_pos();

        this.update_ghost_view();

        this.check_pacman_hit();
    }
};