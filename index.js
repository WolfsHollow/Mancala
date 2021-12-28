const page = document.getElementById('page');
const gameWrapper = document.getElementById('gameWrapper');
const leftPitWrapper = document.getElementById('leftSide');
const middlePitWrapper = document.getElementById('middle');
const rightPitWrapper = document.getElementById('rightSide');
const overlayScreen = document.getElementById('overlayScreen');
const overlayMessage = document.getElementById('overlayMessage');
const title = document.getElementById('title');
const PITNUM = 14;

let board = [];
let boardArray = [];
let player = 'pOne';
title.innerText = `It is Player One's Turn`;
let beadDivs = [];
let numDivs;
let beadWrapper = [];
let beadNum = [];

(function startGame(){
  createBoard();
  createBeadDivs();
  assignBeads();
})();

function createBoard(){
  for (i=0; i<PITNUM; i++){   
    beadWrapper[i] = document.createElement('div');  
    beadWrapper[i].classList.add('beadWrapper');
    beadNum[i] = document.createElement('div');
    beadNum[i].classList.add('beadText');
    if (i==0 || i == 7){      
      beadWrapper[i].classList.remove('beadWrapper');
      beadWrapper[i].classList.add('scoreBeadWrapper');
      continue;
    }
    if (i<7 && i!=0){
      board[7-i] = document.createElement('div');  
      board[7-i].classList.add('pit');
      board[7-i].addEventListener('click', movePieces);    
      board[7-i].value = 7-i;
      boardArray[7-i] = 4;
      middlePitWrapper.appendChild(board[7-i]);  
    }
    else {
      board[i] = document.createElement('div');  
      board[i].classList.add('pit');
      board[i].addEventListener('click', movePieces);    
      board[i].value = i;
      boardArray[i] = 4;
      middlePitWrapper.appendChild(board[i]);  
    }   
  }     
  let leftPit = document.createElement('div');
  leftPit.classList.add('scorePit');
  leftPit.value = 7;
  leftPit.addEventListener('click', movePieces);   
  board[7] = leftPit;
  boardArray[7] = 0;
  leftPitWrapper.appendChild(leftPit);
  
  let rightPit = document.createElement('div');  
  rightPit.classList.add('scorePit');
  rightPit.value = 0;  
  rightPit.addEventListener('click', movePieces);  
  board[0] = rightPit;
  boardArray[0] = 0;
  rightPitWrapper.appendChild(rightPit);  
  
  changePointer();
  refreshBoardNums();
}

function movePieces(){
  let startPit = this.value;
  let tokens = boardArray[startPit];
  let moveBeadArray = getBeadsDivArray(startPit, tokens);
  let endPit;     
  boardArray[startPit] = 0;
  beadNum[startPit].textContent = boardArray[startPit];

  for (i=1; i <= tokens; i++){
    let index = startPit+i;    
    if (index >= 14){
        index = index-14;      
    }
    if (index == 7 || index == 0){
      if (index == 7 && player =='pOne'){
        boardArray[index] = boardArray[index] + 1;
        beadWrapper[index].appendChild(moveBeadArray.pop());
      }
      else if (index == 0 && player == 'pTwo'){
        boardArray[index] = boardArray[index] + 1;    
        beadWrapper[index].appendChild(moveBeadArray.pop());
        ;
      }
      else {
        tokens+=1;
      }      
      beadNum[index].textContent = boardArray[index];  
      endPit = index;
    }
    else {
      boardArray[index] = boardArray[index] + 1;
      console.log(moveBeadArray);
      beadWrapper[index].appendChild(moveBeadArray.pop());   
      console.log(moveBeadArray);
      beadNum[index].textContent = boardArray[index];  
      endPit = index;
    }
  }    
  checkOtherSide(endPit)
  checkToEnd();
  changePlayer(endPit);
}

function checkOtherSide(endPit){
  let playerBool = isPlayerSide(endPit);
  let otherSideBeads = boardArray[14-endPit];
  let otherSide = 14-endPit; 
  let scorePit;
 
  if (playerBool){
    if (boardArray[endPit] == 1 && endPit != 0 && endPit != 7){
      if (player == 'pOne'){
        boardArray[7] += otherSideBeads+1; // add to score pit and remove       
        beadNum[7].textContent = boardArray[7];
        scorePit = 7;
      }
      else if (player == 'pTwo'){
        boardArray[0] += otherSideBeads+1;        
        beadNum[0].textContent = boardArray[0];
        scorePit = 0;
      }
      boardArray[endPit] = 0; // zero out both sides
      boardArray[otherSide] = 0;
      let tempBeadArray = [];
      tempBeadArray = removeAllBeads(beadWrapper[endPit], tempBeadArray);
      tempBeadArray = removeAllBeads(beadWrapper[otherSide], tempBeadArray);
      while (tempBeadArray.length != 0){
        beadWrapper[scorePit].append(tempBeadArray.pop());        
      }
      beadNum[otherSide].textContent = boardArray[otherSide];  //refresh board  
      beadNum[endPit].textContent = boardArray[endPit];
    }
  }
}

function removeAllBeads(div, tempBeadArray){ 
  while (div.firstChild){
    tempBeadArray.push(div.lastChild);
    div.removeChild(div.lastChild);
  }
  return tempBeadArray;
}

function isPlayerSide(endPit){
  if (endPit > 0 && endPit < 7){
    if (player == 'pOne'){
      return true;
    }
    return false;
  }
  else if (endPit > 7 && endPit < 14){
    if (player == 'pTwo'){
      return true;
    }
    return false;
  }
}

function changePlayer(endPit){
  if (player == 'pOne'){
    if (endPit == 7){
      console.log('get another turn');
      return;
    }
    player = 'pTwo';
    title.innerText = `It is Player Two's Turn`;
    changePointer();
  }
  else if (player == 'pTwo'){
    if (endPit == 0){
      console.log('get another turn');
      return;
    }
    player = 'pOne';
    title.innerText = `It is Player One's Turn`;
    changePointer();
  }
}

function changePointer(){
  let start, end, startProhb, endProhb;
  if (player =='pOne'){
    start = 1;
    end = 7;
    startProhb = 8;
    endProhb = 14;
  }
  else if (player == 'pTwo'){
    start = 8;
    end = 14;
    startProhb = 1;
    endProhb = 7;
  }
  for (i = start; i < end; i++){
    board[i].classList.remove('disabled');
    board[i].style.cursor = 'pointer';
  }
  for (i = startProhb; i< endProhb; i++){
    board[i].classList.add('disabled');
    board[i].style.cursor = 'not-allowed';
  }
}

function checkToEnd(){
  if (boardArray[1] == boardArray[2] &&
      boardArray[2] == boardArray[3] &&
      boardArray[3] == boardArray[4] &&
      boardArray[4] == boardArray[5] &&
      boardArray[5] == boardArray[6] &&
      boardArray[6] == 0
     ){      
    endGame('pTwo');
    overlayScreen.classList.add('show');
    overlayScreen.addEventListener('click', hideOverlay);
    announceWinner();
    return;
  }
  
  else if (boardArray[8] == boardArray[9] &&
      boardArray[9] == boardArray[10] &&
      boardArray[10] == boardArray[11] &&
      boardArray[11] == boardArray[12] &&
      boardArray[12] == boardArray[13] &&
      boardArray[13] == 0
     ){  
    endGame('pOne');
    overlayScreen.classList.add('show');
    overlayScreen.addEventListener('click', hideOverlay);
    announceWinner();
    return;
  }  
}

function hideOverlay(){
  overlayScreen.classList.remove('show');
}

function endGame(player){
  let points = 0;
  let tempBeadArray = [];
  let start, end, scoreIndex;
  if (player = 'pOne'){
    start = 1;
    end = 7;
    scoreIndex = 7;
  }
  else if (player = 'pTwo'){
    start = 8;
    end = 14;  
    scoreIndex = 0;
  }
  for (i = start; i < end; i++){
    console.log(`${boardArray[i]} ${points}`);
    points += boardArray[i];
    boardArray[i] = 0;
    tempBeadArray = removeAllBeads(beadWrapper[i], tempBeadArray);
    beadNum[i].textContent = boardArray[i];
  }
  console.log(`board array is ${boardArray[scoreIndex]} points ${points}`);
  boardArray[scoreIndex] += points;
  console.log(tempBeadArray);
  
  // while (tempBeadArray != []){
  //   beadWrapper[scoreIndex].append(tempBeadArray.pop);
  //   console.log(tempBeadArray);
  // }
  console.log(`board array is ${boardArray[scoreIndex]}`);
  beadNum[scoreIndex].textContent = boardArray[scoreIndex];
}

function announceWinner(){
  if (boardArray[0] > boardArray[7]){
    overlayMessage.textContent = 'Player Two Wins!';
  }
  else if (boardArray[7] > boardArray[0]){
    overlayMessage.textContent = 'Player One Wins!';
  }
  else {
    overlayMessage.textContent = `It's a tie?!`;
  }
}


function assignBeads(div){
  let counter = 0;
  for (i=0; i<14; i++){
    board[i].appendChild(beadNum[i]);
    board[i].appendChild(beadWrapper[i]);
    if (i== 7 || i ==0){
      continue;
    }
    for (j=0; j<4; j++){
      beadWrapper[i].appendChild(beadDivs[counter]);      
      counter++;
    }
  }
}

function createBeadDivs(){
  for (i=0; i< 48; i++){
    beadDivs[i] = document.createElement('div');
    beadDivs[i].classList.add('bead');
  }
}

function getBeadsDivArray(index, numBeads){
  let beadWrapperDiv = beadWrapper[index];
  let tempBeadArray = [];
  while (beadWrapperDiv.firstChild){
    tempBeadArray.push(beadWrapperDiv.lastChild);
    beadWrapperDiv.removeChild(beadWrapperDiv.lastChild);
  }
  return tempBeadArray; 
}

function refreshBoardNums(){
  for (i=0; i<PITNUM; i++){
    beadNum[i].innerText = boardArray[i];
  }
}