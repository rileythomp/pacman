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
        this.can_chase = true;
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

    opposite_dirs(x) {
        return Math.abs(this.dir - x) == 2;
    }
    
    get_random_dir() {
        let potential_dir = Math.floor(Math.random() * 4) + 37;
        while (this.opposite_dirs(potential_dir) || this.dir == potential_dir) {
            potential_dir = Math.floor(Math.random() * 4) + 37;
        }
        return potential_dir;
    }

    chase() {
        if (!this.can_chase) {
            return;
        }

        this.update_desired_dir();   
        
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

        
        let has_chased = false;
        while (!has_chased) {
            if (this.dir == directions.up && !this.board.at_wall(this.row - 1, this.col)) {
                this.row = this.row - 1;
                has_chased = true;
            }
            else if (this.dir == directions.left && this.col == 0) {
                this.col = this.board_width - 1;
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
            else if (this.dir == directions.right && this.col == this.board_width - 1) {
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

        // let has_chased = false;
        // while (!has_chased) {
        //     // if (this.desired_dir == directions.up && !this.board.at_wall(this.row - 1, this.col)) {
        //     //     this.dir = this.desired_dir;
        //     // }
        //     // else if (this.desired_dir == directions.left && !this.board.at_wall(this.row, this.col - 1)) {
        //     //     this.dir = this.desired_dir;
        //     // }
        //     // else if (this.desired_dir == directions.down && !this.board.at_wall(this.row + 1, this.col)) {
        //     //     this.dir = this.desired_dir;
        //     // }
        //     // else if (this.desired_dir == directions.right && !this.board.at_wall(this.row, this.col + 1)) {
        //     //     this.dir = this.desired_dir;
        //     // }

        //     if (this.dir == directions.up && !this.board.at_wall(this.row - 1, this.col)) {
        //         this.row = this.row - 1;
        //         has_chased = true;
        //     }
        //     else if (this.dir == directions.left && !this.board.at_wall(this.row, this.col - 1)) {
        //         this.col = this.col - 1;
        //         has_chased = true;
        //     }
        //     else if (this.dir == directions.down && !this.board.at_wall(this.row + 1, this.col)) {
        //         this.row = this.row + 1;
        //         has_chased = true;
        //     }
        //     else if (this.dir == directions.right && !this.board.at_wall(this.row, this.col + 1)) {
        //         this.col = this.col + 1;
        //         has_chased = true;
        //     }
        //     else {
        //         this.dir = Math.floor(Math.random() * 4) + 37;
        //     }
        // }

        this.cell.classList.remove('ghost');
        if (this.cell.classList.contains('scared-ghost')) {
            this.cell.classList.remove('scared-ghost');
        }

        this.cell = this.board.cell(this.row, this.col);
        this.cell.classList.add('ghost');

        if (this.board.pacman.powered_up > 0) {
            this.cell.classList.add('scared-ghost');
        }

        if (this.board.pacman.powered_up > 0 && this.cell.id == 'pacman') {
            score += 200;
            document.getElementById('score').innerHTML = score;
            this.cell.classList.remove('ghost');
            this.cell.classList.remove('scared-ghost');
            this.can_chase = false;
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
        else if (this.cell.id == 'pacman') {
            clearInterval(game_interval);
            this.cell.id = '';
            game_over = true;
        }
    }
};