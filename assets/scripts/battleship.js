/* eslint-disable no-undef */
class Board {
  constructor(name, boardSize) {
    this.name = name;
    this.boardSize = boardSize;
    this.board = [];
    this.resetBoard();
    this.moveHistory = [];
    this.shipList = {
      1: {
        length: 4,
        horizontal: true,
        hitCount: 0
      },
      2: {
        length: 4,
        horizontal: true,
        hitCount: 0
      },
      3: {
        length: 3,
        horizontal: true,
        hitCount: 0
      },
      4: {
        length: 3,
        horizontal: true,
        hitCount: 0
      },
      5: {
        length: 2,
        horizontal: true,
        hitCount: 0
      }
    };
  }

  getRandomCell() {
    let randCell = "";
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let alpha = Math.round(Math.random() * this.boardSize);
    let num = Math.ceil(Math.random() * this.boardSize);
    randCell += alphabet[alpha] + num;

    return randCell;
  }

  checkEligible(cell, ship) {
    const colID = this.convertColToNum(cell.slice(0, 1));
    const rowID = cell.slice(1, 2) - 1;
    const shipLen = ship.length;
    console.log("check eligible ship:", ship);

    if (ship.horizontal) {
      for (let i = 0; i < shipLen; i++) {
        console.log(`attempting to find row ${rowID} and col ${colID + i}`);
        if (this.board[rowID][colID + i] !== "O" || this.board[rowID][colID + i] === undefined) {
          return false;
        }
      }
      return true;
    } else {
      for (let i = 0; i < shipLen; i++) {
        // Checks that cell exists and is open.
        console.log(`attempting to find row ${rowID + i} and col ${colID}`);
        if (!this.board[rowID + i]) {
          return false;
        }
        if (this.board[rowID + i][colID] !== "O") {
          return false;
        }
      }
      return true;
    }
  }

  randomizeBoard() {
    for (const ship in this.shipList) {
      const randHz = (Math.floor(Math.random() * 2) === 0);
      this.shipList[ship].horizontal = randHz;

      // console.log(randHz);
      const shipLen = this.shipList[ship].length;
      // console.log(this.shipList[ship]);
      // console.log(this.shipList[ship].horizontal);
      let cell = this.getRandomCell();
      while (!this.checkEligible(cell, this.shipList[ship])) {
        cell = this.getRandomCell();
      }

      const colID = this.convertColToNum(cell.slice(0, 1));
      const rowID = cell.slice(1, 2) - 1;

      if (this.shipList[ship].horizontal) {
        for (let i = 0; i < shipLen; i++) {
          this.board[rowID][colID + i] = ship;
          console.log("assigned");
        }
      } else {
        console.log("vert assigned");
        for (let i = 0; i < shipLen; i++) {
          this.board[rowID + i][colID] = ship;
        }
      }
    }

  }
  resetBoard() {
    // Generates the board with specified rows and columns
    let row = new Array();
    for (let i = 0; i < this.boardSize; i++) {
      row.push("O");
    }
    for (let i = 0; i < this.boardSize; i++) {
      const rowD = [...row];
      this.board.push(rowD);
    }
  }

  convertColToNum(col) {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return alphabet.indexOf(col.toLowerCase());
  }

  computerAttack(target) {
    while (!this.attack(target, this.getRandomCell())) {
      this.attack(target, this.getRandomCell());
    }
  }

  attack(enemy, target) {
    if (target.length !== 2) {
      console.log("Target error");
    }

    console.log(enemy.name);

    const colID = this.convertColToNum(target.slice(0, 1));
    const rowID = target.slice(1, target.length) - 1;
    console.log(`Original target: ${target}`);
    console.log(`shoorting ${colID} - ${rowID}. Cell contents: ${enemy.board[rowID][colID]}`);
    const enemyShot = enemy.board[rowID][colID];

    switch (enemyShot) {
    case 'O':
      console.log("Miss!");
      enemy.board[rowID][colID] = "M";
      $(`#${enemy.name}${target}`).removeClass(`computer-cell game-cell`).addClass(`cell-shot-miss`);
      $(`#${enemy.name}${target}`).unbind('mouseenter');
      return true;
      break;
    case 'X':
      console.log("Already Shot Here and Hit!");
      return false;
      break;
    case "M":
      console.log("Already Shot Here and Missed!");
      return false;
      break;
    default:
      enemy.shipList[enemyShot].hitCount++;
      console.log(`hit ship ${enemy.shipList[enemyShot].hitCount} times`);
      enemy.board[rowID][colID] = "X";
      console.log(`target painted red ${enemy.name}${target}`);
      $(`#${enemy.name}${target}`).removeClass(`computer-cell game-cell`).addClass(`cell-ship-strike`);
      $(`#${enemy.name}${target}`).unbind('mouseenter');
      return true;
    }
  }
}

// const player = new Board(10);
// // const computer = new Board(10);
// // // console.log(player);
// player.randomizeBoard();
// console.log(player.board);
// console.log(player.getRandomCell());



let setUpGame = function(jQuery, data, options, element) {

  const setUpGameContainer = () => {
    const pageBody = $("#page-body");
    const gameContainer = $(" <div id=\"game-container\" style=\"display: flex; flex-direction: column; width: 900px; height: 1500px\">");
    gameContainer.appendTo(pageBody);
    return gameContainer;
  };

  const drawGameBoard = (renderElement, identifier) => {
    // Renders the HTML elements required for the game board.
    const gameContainer = renderElement;
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


    const playerBoard = $(`<div id="${identifier}-board"></div>`);
    playerBoard.appendTo(gameContainer);

    const topRowLabel = $(`<div class="top-row-label" id="${identifier}-board-row-label">`);
    topRowLabel.appendTo(playerBoard);

    for (let i = 0; i < player.boardSize; i++) {
      const cellRowLabel = $(`<div class="cell-row-label">${alphabet[i].toLocaleUpperCase()}</div>`);
      cellRowLabel.appendTo(topRowLabel);
    }

    const middleContent = $(`<div class="middle-content">`);
    middleContent.appendTo(playerBoard);
    const leftColumnLabels = $(`<div class="left-column-label">`);
    leftColumnLabels.appendTo(middleContent);

    for (let i = 0; i < player.boardSize; i++) {
      const cellColumnLabel = $(`<div class="cell-row-label">${i + 1}</div>`);
      cellColumnLabel.appendTo(leftColumnLabels);
    }
    const playerGameBoard = $(`<div class="game-board">`);
    playerGameBoard.appendTo(middleContent);

    for (let i = 0; i < player.boardSize; i++) {
      const gameBoardRows = $(`<div class="board-row-label">`);
      gameBoardRows.appendTo(playerGameBoard);
      for (let j = 0; j < player.boardSize; j++) {
        const gameBoardCell = $(`<div class="game-cell ${identifier}-cell" id="${identifier + alphabet[j] + (i + 1)}"></div>`);
        gameBoardCell.appendTo(gameBoardRows);
      }
    }
    console.log("drawing game board");
  };

  const renderShips = (playerObj, identifier) => {
    // Render the players ships in dark green.
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    for (const row in playerObj.board) {
      for (const col in playerObj.board[row]) {
        if (playerObj.board[row][col] !== "O") {
          console.log(`#${identifier}${alphabet[col]}${Number(row) + 1}`);
          $(`#${identifier}${alphabet[col]}${Number(row) + 1}`).addClass("cell-ship-present");
          $(`#${identifier}${alphabet[col]}${Number(row) + 1}`).html(`${playerObj.board[row][col]}`);
        }
      }
    }
  };


  console.log("ready to play BATTLESHIP!!");
  const player = new Board('player', 10);
  const computer = new Board('computer', 10);
  computer.randomizeBoard();
  player.randomizeBoard();

  const gameContainer = setUpGameContainer();
  drawGameBoard(gameContainer, 'player');
  $(`<br>`).appendTo(gameContainer);
  drawGameBoard(gameContainer, 'computer');

  renderShips(player, 'player');

  $(".computer-cell").hover(function () {
    $(this).addClass("cell-selected");
  }, function () {
    $(this).removeClass("cell-selected");
  });

  $(".computer-cell").click(function () {
    console.log("click", $(this).attr("id"));
    // console.log($(this).attr("id").slice(8,10));
    if (player.attack(computer, $(this).attr("id").slice(8, 11))) {
      console.log("Running computer attack");
      computer.computerAttack(player);
    };
  });




};

// // Set height and widths for optimal graph display. Also add "px" to some
// // strings.
// let totalArray = [];
// let barMax = 0;
// let chartWidth = options.width + "px";
// let chartHeight = options.height + "px";
// let areaWidth = "90%";
// let yAxisWidth = 5;
// let titleAxisHeight = "6%";
// let xaxisHeight = "6%";
// let areaHeight = "78%";
// let barVal = [];