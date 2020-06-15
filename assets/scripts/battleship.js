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
        length: 5,
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
    let alpha = Math.round(Math.random() * (this.boardSize - 1));
    let num = Math.ceil(Math.random() * (this.boardSize));
    randCell += alphabet[alpha] + num;

    return randCell;
  }

  checkEligible(cell, ship) {
    const colID = this.convertColToNum(cell.slice(0, 1));
    const rowID = cell.slice(1, 2) - 1;
    const shipLen = ship.length;

    if (ship.horizontal) {
      for (let i = 0; i < shipLen; i++) {
        if (this.board[rowID][colID + i] !== "O" || this.board[rowID][colID + i] === undefined) {
          return false;
        }
      }
      return true;
    } else {
      for (let i = 0; i < shipLen; i++) {
        // Checks that cell exists and is open.
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
      const shipLen = this.shipList[ship].length;
      let cell = this.getRandomCell();
      while (!this.checkEligible(cell, this.shipList[ship])) {
        cell = this.getRandomCell();
      }

      const colID = this.convertColToNum(cell.slice(0, 1));
      const rowID = cell.slice(1, 2) - 1;

      if (this.shipList[ship].horizontal) {
        for (let i = 0; i < shipLen; i++) {
          this.board[rowID][colID + i] = ship;
        }
      } else {
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
    const colID = this.convertColToNum(target.slice(0, 1));
    const rowID = target.slice(1, target.length) - 1;
    console.log(`Original target: ${target}`);
    console.log(`Shooting array val ${colID} - ${rowID}. Cell contents: ${enemy.board[rowID][colID]}`);
    const enemyShot = enemy.board[rowID][colID];

    let logMessage;

    switch (enemyShot) {
    case 'O':
      console.log("Miss!");
      enemy.board[rowID][colID] = "M";
      
      logMessage = $(`<span>${this.name.toLocaleUpperCase()} fired at ${target.toLocaleUpperCase()}. <b>Miss!</b></span>`);
      logMessage.appendTo($(`#game-log`));
      $('#game-log').scrollTop(0);

      $(`#${enemy.name}${target}`).removeClass(`computer-cell game-cell`).addClass(`cell-shot-miss hover-blue`);
      $(`#${enemy.name}${target}`).unbind('mouseenter');

      return true;
    case 'X':
      return false;
    case "M":
      return false;
    default:
      $(`#${enemy.name}${enemyShot}${enemy.shipList[enemyShot].hitCount}`).addClass('cell-ship-strike');


      enemy.shipList[enemyShot].hitCount++;
      console.log(`hit ship ${enemy.shipList[enemyShot].hitCount} times`);
      enemy.board[rowID][colID] = "X";
      console.log(`target painted red ${enemy.name}${target}`);

      logMessage = $(`<span>${this.name.toLocaleUpperCase()} fired at ${target.toLocaleUpperCase()}. <b>Hit!</b></span>`);
      logMessage.appendTo($(`#game-log`));
      $('#game-log').scrollTop(0);


      $(`#${enemy.name}${target}`).removeClass(`computer-cell game-cell`).addClass(`cell-ship-strike hover-red`);
      $(`#${enemy.name}${target}`).unbind('mouseout');
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
    const gameContainer = $(" <div id=\"game-container\" style=\"display: flex; flex-direction: column; \">");
    gameContainer.appendTo(pageBody);

    const infoBox = $(`<div id="turn-indicator" class="info-box info-banner">Player Turn!</div>`);
    infoBox.appendTo(gameContainer);

    const allInfoContainer = $(`<div id="all-info-container">`);
    allInfoContainer.appendTo(gameContainer);

    const gamelog = $(`<div id="game-log" class="info-box"></div>`);
    gamelog.appendTo(gameContainer);
    const update = $(`<span><b>Welcome to BATTLESHIP!</b></span>`);
    update.appendTo($(`#game-log`));

    return allInfoContainer;
  };

  const drawGameBoard = (renderElement, identifier) => {
    // Renders the HTML elements required for the game board.
    const gameContainer = renderElement;
    const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];


    const shipDashboard = $(`<div id="${identifier}-ship-dashboard"class="ship-dashboard"></div>`);
    shipDashboard.appendTo(gameContainer);

    for (const ship in player.shipList) {
      const shipRow = $(`<div class="ship-row"></div>`);
      shipRow.appendTo(shipDashboard);
      for (let i = 0; i < player.shipList[ship].length; i++) {
        console.log(player.shipList);
        const shipBlockIdentifier = $(`<div class="ship-blocks" id="${identifier}${ship + i}"></div>`);
        shipBlockIdentifier.appendTo(shipRow);
      }
    }

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
          // console.log(`#${identifier}${alphabet[col]}${Number(row) + 1}`);
          $(`#${identifier}${alphabet[col]}${Number(row) + 1}`).addClass("cell-ship-present");
          // $(`#${identifier}${alphabet[col]}${Number(row) + 1}`).html(`${playerObj.board[row][col]}`);
        }
      }
    }
  };

  const player = new Board('player', 10);
  const computer = new Board('computer', 10);
  computer.randomizeBoard();
  player.randomizeBoard();


  let playerTurn = (Math.floor(Math.random() * 2) === 0);

  const toggleTurn = () => {
    if (playerTurn) {
      playerTurn = false;
      $(`#turn-indicator`).html(`Computer Turn`);
      setTimeout(function() {
        computer.computerAttack(player);
        toggleTurn();
      }, 300);
    } else {
      $(`#turn-indicator`).html(`Player Turn`);
      playerTurn = true;
    }
  };

  const gameContainer = setUpGameContainer();
  drawGameBoard(gameContainer, 'player');
  drawGameBoard(gameContainer, 'computer');

  renderShips(player, 'player');

  if (playerTurn) {
    let logMessage = $(`<span>Computer goes first.</span>`);
    logMessage.appendTo($(`#game-log`));
  } else {
    let logMessage = $(`<span>Player goes first.</span>`);
    logMessage.appendTo($(`#game-log`));
  }

  toggleTurn();


  $(".computer-cell").hover(function () {
    $(this).addClass("cell-selected");
  }, function () {
    $(this).removeClass("cell-selected");
  });

  $(".computer-cell").click(function () {
    if (playerTurn) {
      if (player.attack(computer, $(this).attr("id").slice(8, 11))) {
        toggleTurn();
      }
    }
  });
};