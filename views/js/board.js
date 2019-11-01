class Board {
    constructor() {
        this.view = document.getElementById('board');
        this.height = this.view.children[0].children.length;
        this.width = this.view.children[0].children[0].children.length;
        this.pacman = new Pacman(this);
        this.ghosts = [
            new Ghost(this, 'redghost'),
            new Ghost(this, 'pinkghost')
        ];
    }

    cell(i, j) {
        return this.view.children[0].children[i].children[j];
    }

    at_wall(row, col) {
        return this.cell(row, col).classList.contains('wall');
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
        add_to_score(200);

        let ghost_color = cell.getAttribute('data-ghost');
        this.kill_ghost(cell, ghost_color);

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