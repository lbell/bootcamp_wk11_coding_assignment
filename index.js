const squares = document.getElementsByClassName("square");
const alertBox = document.getElementById("alert-box");

// Add click events to all the squares
for (var i = 0; i < squares.length; i++) {
  squares[i].addEventListener(
    "click",
    function (e) {
      e = window.event || e;

      // clear the alertbox
      alertBox.innerHTML = "";

      // Make sure we've got the right click target
      if (this === e.target) {
        handleClick(e);
      } else {
        alertBox.innerHTML = '<div class="alert alert-danger" role="alert">Square already occupied!</div>';
      }
    },
    false
  );
}

function handleClick(event) {
  let who = whosTurn();

  // Make sure we're firing on an empty square
  if (event.target.innerHTML === "") {
    // Place the mark
    addSymbol(event.target, who);

    // Check if we have a winner
    let status = checkPattern(who);
    if (status === true) {
      alertBox.innerHTML = `<div class="alert alert-success" role="alert">${who.toUpperCase()} Wins!</div>`;
    } else if (status === 0) {
      alertBox.innerHTML = `<div class="alert alert-warning" role="alert">Womp Womp. Game is a DRAW.</div>`;
    }
    switchPlayer(who);
  } else {
    alertBox.innerHTML = '<div class="alert alert-danger" role="alert">Square already occupied!</div>';
  }
}

/**
 * Add the corect symbol to the target box.
 *
 * @param {element} target The target elment
 * @param {string} symbol X or O
 */
function addSymbol(target, symbol) {
  target.innerHTML = `<img src="img/${symbol}.svg" />`;
  target.setAttribute("data-who", symbol);
}

/**
 * Finds who's turn it is by reading the "who" element.
 *
 * @returns lowercase string of whoever's turn it is
 */
function whosTurn() {
  let who = document.getElementById("who").innerHTML;
  return who.toLowerCase();
}

/**
 * Switches contents of #who element based on who just went
 *
 * @param {string} who X or O
 */
function switchPlayer(who) {
  if (who === "x") {
    document.getElementById("who").innerHTML = "O";
  } else {
    document.getElementById("who").innerHTML = "X";
  }
}

/**
 * Clears all the squares
 */
function clearBoard() {
  for (let i = 0; i < squares.length; i++) {
    squares[i].innerHTML = "";
    squares[i].setAttribute("data-who", "");
  }
}

/**
 * Check whether the squares played on the board match the possible winning
 * combinations. Either returns true if there is a match, or the number of turns
 * left.
 *
 * @param {string} player Who's turn is it
 * @returns bool or number
 */
function checkPattern(player) {
  console.log(player); // DEBUG

  let score = [];
  let isWinner = false;
  let winningPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Pull all the squares, loop through them and get ther data-who attributes into
  // an array.
  const currSquares = document.getElementsByClassName("square");
  for (var i = 0; i < currSquares.length; i++) {
    score[i] = squares[i].getAttribute("data-who");
  }
  let emptySquares = score.length - score.filter(String).length;

  // For every square that is held by player, pull the index
  let matrix = getAllIndexes(score, player);

  // Loop through each of the possible winning patterns
  for (var i = 0; i < winningPatterns.length; i++) {
    let needThree = [];

    // And for each pattern, loop thorugh and see if each of the three indexes
    // in the winning pattern are in the matrix.
    for (var j = 0; j < winningPatterns[i].length; j++) {
      needThree.push(matrix.includes(winningPatterns[i][j]));
    }
    console.log(needThree); // DEBUG

    // Then check if ALL THREE of the winning pattern indexes were found in the
    // matrix.
    if (needThree.every((element) => element === true)) {
      isWinner = true;
    }
  }
  return isWinner || emptySquares;
}

/**
 * Takes an array and ruturns an array of indexes for every time the target value
 * is found.
 *
 * @param {array} arr Array of vlaues
 * @param {*} val target value
 * @returns array
 */
function getAllIndexes(arr, val) {
  let indexes = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === val) indexes.push(i);
  }
  return indexes;
}
