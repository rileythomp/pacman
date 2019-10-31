class Board {
    constructor() {
        this.view = document.getElementById('board');
        this.height = this.view.children[0].children.length;
        this.width = this.view.children[0].children[0].children.length;
        this.pacman = new Pacman(this, 23, 14, this.height, this.width);
        this.ghost = new Ghost(this, 11, 13, this.height, this.width);
    }

    cell(i, j) {
        return this.view.children[0].children[i].children[j];
    }

    at_wall(row, col) {
        return this.cell(row, col).classList.contains('wall');
    }
};