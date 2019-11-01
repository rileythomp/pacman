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
        this.desired_dir = directions.right;
    }

    update_desired_dir() {
        let pacman_row = this.board.pacman.row;
        let pacman_col = this.board.pacman.col;
        let row_diff = Math.abs(pacman_row - this.row);
        let col_diff = Math.abs(pacman_col - this.col);

        if (row_diff >= col_diff && pacman_row >= this.row) {
            this.desired_dir = directions.down;
        } else if (row_diff >= col_diff && pacman_row < this.row) {
            this.desired_dir = directions.up;
        } else if (row_diff < col_diff && pacman_col >= this.col) {
            this.desired_dir = directions.right;
        } else if (row_diff < col_diff && pacman_col < this.col) {
            this.desired_dir = directions.left;
        }
    }

    opposite_dirs(dir) {
        return Math.abs(this.dir - dir) == 2;
    }
    
    get_random_dir() {
        let potential_dir = Math.floor(Math.random() * 4) + 37;
        while (this.opposite_dirs(potential_dir) || this.dir == potential_dir) {
            potential_dir = Math.floor(Math.random() * 4) + 37;
        }
        return potential_dir;
    }

    update_dir() {
        if (this.desired_dir == directions.up && !this.board.at_wall(this.row - 1, this.col) && !this.opposite_dirs(this.desired_dir)) {
            this.dir = this.desired_dir;
        }
        else if (this.desired_dir == directions.left && !this.board.at_wall(this.row, this.col - 1) && !this.opposite_dirs(this.desired_dir)) {
            this.dir = this.desired_dir;
        }
        else if (this.desired_dir == directions.down && !this.board.at_wall(this.row + 1, this.col) && !this.opposite_dirs(this.desired_dir)) {
            this.dir = this.desired_dir;
        }
        else if (this.desired_dir == directions.right && !this.board.at_wall(this.row, this.col + 1) && !this.opposite_dirs(this.desired_dir)) {
            this.dir = this.desired_dir;
        }
    }

    update_pos() {
        let has_chased = false;
        while (!has_chased) {
            if (this.dir == directions.up && !this.board.at_wall(this.row - 1, this.col)) {
                this.row = this.row - 1;
                has_chased = true;
            }
            else if (this.dir == directions.left && this.col == 0) {
                this.col = this.board.width - 1;
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
            else if (this.dir == directions.right && this.col == this.board.width - 1) {
                this.col = 0;
                has_chased = true;
            }
            else if (this.dir == directions.right && !this.board.at_wall(this.row, this.col + 1)) {
                this.col = this.col + 1;
                has_chased = true;
            } else {
                this.dir = this.get_random_dir();
            }
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

    chase() {
        this.update_desired_dir();   
        
        this.update_dir();
        
        this.update_pos();

        this.update_ghost_view();

        this.check_pacman_hit();
    }
};