const _  = require('lodash');

class Ships {
  constructor(numShips) {
    this.battleship = {
      length : 4
    };
    this.carrier = {
      length : 4
    };
    this.submarine = {
      length : 3
    };
    this.cruiser = {
      length : 3
    };
    this.destroyer = {
      length : 2
    };
  }
}

class Board {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.board = [];
    this.resetBoard();
    this.moveHistory = [];
  }

  randomizeBoard() {

  }

  resetBoard() {
    let row = new Array();
    for (let i = 0; i < this.boardSize; i++) {
      row.push("O");
    }
    for (let i = 0; i < this.boardSize; i++) {
      this.board.push(_.cloneDeep(row));
    }
  }

  convertColToNum(col) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return  alphabet.indexOf(col.toLowerCase());
  }

  attack(enemy, target) {
    if (target.length !== 2) {
      console.log("Target error");
    }

    const col = target.slice(0,1);
    const colID = this.convertColToNum(col);
    // console.log(colID);
    // console.log(col);
    const rowID = target.slice(1,2) - 1;
    // console.log(rowID);
    console.log(enemy.board[rowID][colID]);
    const enemyShot = enemy.board[rowID][colID];

    switch (enemyShot) {
    case 'O':
      console.log("Miss!");
      enemy.board[rowID][colID] = "M";
      break;
    case 'X':
      console.log("Already Shot Here and Hit!");
      break;
    case "M":
      console.log("Already Shot Here and Missed!");
      break;
    case "S":
      console.log("Confirmed Hit!");
      enemy.board[rowID][colID] = "X";
      break;
    default:
      console.log("Out of bounds or some other error");
    }
  }
}

const player = new Board(10);
const computer = new Board(10);

player.attack(computer, "A6");
player.attack(computer, "D6");
player.attack(computer, "A1");
console.log(computer.board);