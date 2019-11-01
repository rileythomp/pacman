class Board {
    constructor() {
        this.view = document.getElementById('board');
        this.height = this.view.children[0].children.length;
        this.width = this.view.children[0].children[0].children.length;
        this.pacman = new Pacman(this);
        this.ghosts = [
            new Ghost(this, 'redghost'),
            new Ghost(this, 'blueghost'),
            new Ghost(this, 'orangeghost'),
            new Ghost(this, 'pinkghost')
        ];
    }

    cell(row, col) {
        return this.view.children[0].children[row].children[col];
    }

    at_barrier(barrier, row, col) {
        return this.cell(row, col).classList.contains(barrier);
    }

    open_cell(row, col) {
        return !this.at_barrier('wall', row, col) && !this.at_barrier('ghost', row, col);
    }

    kill_ghost(cell, ghost_color) {
        for (let i = 0; i < this.ghosts.length; ++i) {
            if (this.ghosts[i].color == ghost_color) {
                this.ghosts.splice(i, 1);
                break;
            }
        }

        cell.removeAttribute('data-ghost');
        cell.classList.remove('ghost');
        cell.classList.remove('scared-ghost');
    }

    eat_ghost(cell) {
        let ghost_color = cell.getAttribute('data-ghost');
        this.kill_ghost(cell, ghost_color);

        add_to_score(100 * Math.pow(2, (4 - this.ghosts.length)));

        setTimeout(function() {
            board.ghosts.push(new Ghost(board, ghost_color));

            if (board.pacman.power_ups > 0) {
                board.ghosts[board.ghosts.length - 1].cell.classList.add('scared-ghost');
            }

        }, 5000)
    }

    end_game(cell) {
        clearInterval(game_interval);
        clearInterval(ghost_interval);
        cell.id = '';
        game_over = true;
    }
};