var xScore = 0;
var oScore = 0;
var currPlayer = 'X';
var gameActive = true;
var moves = new Array("", "", "", "", "", "", "", "", "");
var aiActive = false;

var newgame, reset, squares, display_player, display_score, display_oscore, results;
var ai_player = true;

document.addEventListener("DOMContentLoaded", function() {
    squares = document.querySelectorAll('.game_board .row > div');
    newgame = document.getElementsByClassName("new_game")[0];
    reset = document.getElementsByClassName("reset")[0];
    display_player = document.querySelector('.display_player');
    display_player.textContent = currPlayer;
    
    display_xscore = document.querySelector('.display_xscore');
    display_xscore.textContent = xScore;
    
    display_oscore = document.querySelector('.display_oscore');
    display_oscore.textContent = oScore;
    
    results = document.querySelector('.results');
    results.style.display = 'none';

    one_player = document.getElementById('oneplayer');
    one_player.style.border = '4px solid black';
    two_players = document.getElementById('twoplayers');

    one_player.addEventListener("click", function() {
      ai_player = true;
      one_player.style.border = '4px solid black';
      two_players.style.border = 'none';

      // console.log("one player");
      // console.log(ai_player);
    });

    two_players.addEventListener("click", function() {
      ai_player = false;
      one_player.style.border = 'none';
      two_players.style.border = '4px solid black';

      // console.log("two players");
      // console.log(ai_player);
    });

    console.log(currPlayer);

    squares.forEach(function(square) {
      square.addEventListener('click', squareClicked);
    });

    newgame.addEventListener("click", function(){
      aiActive = false;

      squares.forEach(function(square){
        square.innerHTML = '<span class="xo"></span>';
        square.style.backgroundColor = 'pink';
      });
    
      moves.forEach(function(_, index) {
        moves[index] = ""; 
      });

      // console.log("new game button clicked");
      // console.log(moves);

      currPlayer = 'X';
      display_player.textContent = currPlayer;
      results.style.display = 'none';
      gameActive = true;
    });

    reset.addEventListener("click", function(){
      aiActive = false;

      squares.forEach(function(square){
        square.innerHTML = '<span class="xo"></span>';
        square.style.backgroundColor = 'pink';
      });
    
      moves.forEach(function(_, index) {
        moves[index] = ""; 
      });

      // console.log("reset button clicked");
      // console.log(moves);

      currPlayer = 'X';
      xScore = 0;
      oScore = 0;
      display_player.textContent = currPlayer;
      display_xscore.textContent = xScore;
      display_oscore.textContent = oScore;
      results.style.display = 'none';
      
      gameActive = true;
    });

});


function squareClicked(event) {
  if(!gameActive){
    console.log("cannot click rn");
    return;
  }
  console.log("click");

  if (!event.target.textContent.trim()) { //empty square
    var index = getIndex(event.target.classList[0]);
    // console.log(event.target.classList[0]);
    // console.log(index);

    moves[index] = currPlayer;

    event.target.style.backgroundColor = '#fa8072'; //change color
    event.target.innerHTML = '<span class="xo">' + currPlayer + '</span>';

    if(!checkWinner()){
      // console.log("switch player");
      currPlayer = currPlayer === 'X' ? 'O' : 'X';
      // console.log(currPlayer);

      display_player.textContent = currPlayer;
      // console.log(moves);

      if(ai_player && !aiActive){
        aiActive = true;
        gameActive = false;
        console.log(gameActive);
        setTimeout(function(){ 
          ai(); 
          gameActive = true;
          aiActive = false;
        }, 1000);
      }
    } 
  }
}


function ai(){
  var bestscore = -Infinity;
  var nextmove;

  for(var i = 0; i < 9; i++){
    if(!aiActive){
      console.log("aiActive is " + aiActive);
      return;
    }
    if(moves[i] == ''){
      moves[i] = 'O';
      var score = minimax(0, false);
      moves[i] = '';
      if(score > bestscore){
        bestscore = score;
        nextmove = i;
      }
    }
  }

  if(!aiActive){
    console.log("aiActive is " + aiActive);
    return;
  }
  
  var squareClass = getSquare(nextmove);
  var ai_move = document.getElementsByClassName(squareClass)[0];
  moves[nextmove] = 'O'
  ai_move.style.backgroundColor = '#fa8072';
  ai_move.innerHTML= '<span class="xo">' + currPlayer + '</span>';
  currPlayer = currPlayer === 'X' ? 'O' : 'X';
  display_player.textContent = currPlayer;
  
  checkWinner();
}

function minimax(depth, maximizingPlayer){
  var win = checkWin();
  var score;
  if(win == 'X'){
    score = -10;
  } else if (win == 'O'){
    score = 10;
  } else {
    score = null;
  }

  //base cases
  if(score != null){
    return score;
  }

  //board full
  if (moves.every(function (element) {
    return element !== ""; 
  })) {
    return 0; 
  }

  var bestscore;

  //recursive
  if(maximizingPlayer){
    bestscore = -Infinity;
    for(var i = 0; i < 9; i++){
      if(moves[i] == ''){
        moves[i] = 'O';
        var score = minimax(depth+1, false);
        moves[i] = '';
        bestscore = Math.max(bestscore, score);
      }
    }
  } else {
    bestscore = Infinity;
    for(var i = 0; i < 9; i++){
      if(moves[i] == ''){
        moves[i] = 'X';
        var score = minimax(depth+1, true);
        moves[i] = '';
        bestscore = Math.min(bestscore, score);
      }
    }
  }
  return bestscore;
}

function checkWinner(){
  var winner = checkWin();
  if(winner != null){
    results.style.display = 'block';
    gameActive = false;

    if(winner == 'X'){
      xScore++;
    } else if(winner == 'O'){
      oScore++;
    } else if (winner == ''){
      results.textContent = 'Tie!';
      return true;
    }
    display_xscore.textContent = xScore;
    display_oscore.textContent = oScore;

    // console.log("winner!");
    // console.log(winner);

    results.textContent = 'The winner is ' + winner + '!';
    
    return true;
  }
  gameActive = true;
  return false;
}

function checkWin(){
  //rows
  for (var i = 0; i < 3; i++) {
    var rowindex = i * 3;
    if (moves[rowindex] !== "" && moves[rowindex] === moves[rowindex + 1] && moves[rowindex] === moves[rowindex + 2]) {
      return moves[rowindex]; 
    }
  }

  //cols
  for (var j = 0; j < 3; j++) {
    if (moves[j] !== "" && moves[j] === moves[j + 3] && moves[j] === moves[j + 6]) {
      return moves[j]; 
    }
  }

  //diagonals
  if (moves[0] !== "" && moves[0] === moves[4] && moves[0] === moves[8]) {
    return moves[0]; 
  }
  if (moves[2] !== "" && moves[2] === moves[4] && moves[2] === moves[6]) {
    return moves[2];
  }

  //no winner
  if (moves.every(function (element) {
    return element !== ""; 
  })) {
    return ""; 
  }

  return null;
}

function getIndex(squareClass){
  switch(squareClass){
    case "one":
      return 0;
    case "two":
      return 3;
    case "three":
      return 6;
    case "four":
      return 1;
    case "five":
      return 4;
    case "six":
      return 7;
    case "seven":
      return 2;
    case "eight":
      return 5;
    case "nine":
      return 8;
    default:
      return 0;
  }
}

function getSquare(index){
  switch(index){
    case 0:
      return "one";
    case 1:
      return "four";
    case 2:
      return "seven";
    case 3:
      return "two";
    case 4:
      return "five";
    case 5:
      return "eight";
    case 6:
      return "three";
    case 7:
      return "six";
    case 8:
      return "nine";
    default:
      return "one";
  }
}