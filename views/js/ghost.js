class Ghost {
    set_start_pos() {
        this.row = 11;

        if (this.color == 'orangeghost') {
            this.col = 12;
        } else if (this.color == 'redghost') {
            this.col = 13;
        } else if (this.color == 'pinkghost') {
            this.col = 14;
        } else if (this.color == 'blueghost') {
            this.col = 15;
        }
    }

    set_scatter_pos() {
        if (this.color == "orangeghost") {
            this.target_row = this.board.height - 1;
            this.target_col = 0;
        }
        else if (this.color == "redghost") {
            this.target_row = 0;
            this.target_col = this.board.width - 1;
        }
        else if (this.color == "pinkghost") {
            this.target_row = 0;
            this.target_col = 0;
        }
        else if (this.color == "blueghost") {
            this.target_row = this.board.height - 1;
            this.target_col = this.board.width - 1;
        }
    }

    constructor(board, color) {
        this.color = color
        this.set_start_pos()
        this.dir = directions.right;
        this.cell = board.cell(this.row, this.col);
        this.cell.classList.add('ghost');
        this.cell.setAttribute('data-ghost', this.color);
        this.board = board;
        this.desired_vert = directions.down;
        this.desired_horiz = directions.right;
        this.desired_dir = this.desired_vert;
        this.set_scatter_pos();
        this.scatters_remaining = 43;
        this.chase_remaining = 133;
    }

    kill() {
        this.cell.classList.remove('ghost');
        this.cell.removeAttribute('data-ghost');
    }

    target_ahead_of_pacman(n) {
        if (this.board.pacman.dir == directions.up) {
            this.target_row = Math.max(this.board.pacman.row - n, 0);
            this.target_col = this.board.pacman.col;
        }
        else if (this.board.pacman.dir == directions.down) {
            this.target_row = Math.min(this.board.pacman.row + n, this.board.height - 1);
            this.target_col = this.board.pacman.col;
        }
        else if (this.board.pacman.dir == directions.right) {
            this.target_row = this.board.pacman.row;
            this.target_col = Math.min(this.board.pacman.col + n, this.board.width - 1);
        }
        else if (this.board.pacman.dir == directions.left) {
            this.target_row = this.board.pacman.row;
            this.target_col = Math.max(this.board.pacman.col - n, 0);
        }
    }

    update_target() {
        if (this.scatters_remaining > 0) {
            this.scatters_remaining -= 1;
            this.set_scatter_pos(this.color);
            return;
        }

        if (this.color == 'orangeghost') {
            let pacman_row = this.board.pacman.row;
            let pacman_col = this.board.pacman.col;

            let distance = Math.abs(pacman_row - this.row) + Math.abs(pacman_col - this.col);

            if (distance > 8) {
                this.target_row = this.board.pacman.row;
                this.target_col = this.board.pacman.col;
            } else {
                this.target_row = this.board.height - 1;
                this.target_col = 1;
            }

        } 
        else if (this.color == 'redghost') {
            this.target_row = this.board.pacman.row;
            this.target_col = this.board.pacman.col;
        }
        else if (this.color == 'pinkghost') {
            this.target_ahead_of_pacman(4);
        }
        else if (this.color == 'blueghost') {
            this.target_ahead_of_pacman(2);

            let red_row = document.querySelector('[data-ghost="redghost"]').getAttribute('data-row');
            let red_col = document.querySelector('[data-ghost="redghost"]').getAttribute('data-col');    
            
            this.target_row = (2 * this.target_row) - red_row;
            this.target_col = (2 * this.target_col) - red_col;

            if (this.target_row < 0) {
                this.target_row = 0;
            } else if (this.target_row > this.board.height - 1) {
                this.target_row = this.board.height - 1;
            }

            if (this.target_col < 0) {
                this.target_col = 0;
            } else if (this.target_col > this.board.width - 1) {
                this.target_col = this.board.width - 1;
            }
        }
        this.chase_remaining -= 1;
        if (this.chase_remaining == 0) {
            this.scatters_remaining = 43;
            this.chase_remaining = 143;
        }
    }

    update_desired_dirs() {
        this.update_target(this.color);

        let col_diff = Math.abs(this.target_col - this.col);
        let row_diff = Math.abs(this.target_row - this.row);

        this.desired_vert = (this.target_row >= this.row ? directions.down : directions.up);
        this.desired_horiz = (this.target_col >= this.col ? directions.right : directions.left);
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
        else if (this.dir == directions.left && this.col > 0 && this.board.open_cell(this.row, this.col - 1)) {
            this.col = this.col - 1;
        }
        else if (this.dir == directions.down && this.board.open_cell(this.row + 1, this.col)) {
            this.row = this.row + 1;
        }
        else if (this.dir == directions.right && this.col == this.board.width - 1) {
            this.col = 0;
        }
        else if (this.dir == directions.right && this.col < board.width && this.board.open_cell(this.row, this.col + 1)) {
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
        if (this.board.pacman.power_ups > 0) {
            this.scatters_remaining = 31;
        }

        this.set_dir();
        
        this.update_pos();

        this.update_ghost_view();

        this.check_pacman_hit();
    }
};