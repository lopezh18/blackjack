import Deck from './deck.js';

window.onload = () => {
  startGame();
}

let deck = new Deck();
deck.shuffle();
let faceDownCard;
let canHit = true;

let dealerSum = 0;
let dealerAceCount = 0

let yourSum = 0;
let yourAceCount = 0;
let yourCards = [];

let yourSum2 = 0;
let your2AceCount = 0;

let stayCount = 0;

let losingMessage = 'You lost';
let winningMessage = 'You won';
let tieMessage = 'It\'s a tie';

const checkAce = (value, playerType) => {
  if (value === 'A') {
    if (playerType === 'your') yourAceCount++;
    if (playerType === 'your2') your2AceCount++;
    if (playerType === 'dealer') dealerAceCount++;
  }
}

const startGame = () => {
  // grab the first card
  faceDownCard = deck.pop();

  dealerSum += faceDownCard.getValue();
  checkAce(faceDownCard.value, 'dealer');
  // keep grabbing cards until the dealerSum is 17
  while (dealerSum < 17) {
    let cardImg = document.createElement('img');
    let card = deck.pop();
    cardImg.src = `./cards/${card.value}-${card.suit}.png`;
    cardImg.id = `${card.value}-${card.suit}`
    checkAce(card.value, 'dealer');
    dealerSum+=card.getValue();
    document.getElementById('dealer-cards').append(cardImg);
  }

  // give the player 2 cards
  for (let i = 0; i < 2; i++) {
    let card = deck.pop();
    let cardImg = createCardImg(card);
    yourCards.push(card);
    checkAce(card.value, 'your');
    yourSum+=card.getValue();
    document.getElementById('your-cards').append(cardImg);
  }
  
  // see if you can split your cards
  let card1 = yourCards[0].getValue();
  let card2 = yourCards[1].getValue();
  // if (card1 === card2) {
  //   let splitButton = document.createElement('button');
  //   splitButton.id='split';
  //   splitButton.innerText = 'Split';
  //   splitButton.addEventListener('click', split);
  //   document.getElementById('buttons').append(splitButton);
  // }
  
  document.getElementById('split').addEventListener('click', split);
  document.getElementById('hit').addEventListener('click', hit);
  document.getElementById('stay').addEventListener('click', stay)
};

const createCardImg = (card) => {
  let cardImg = document.createElement('img');
  cardImg.src = `./cards/${card.value}-${card.suit}.png`;
  cardImg.id = `${card.value}-${card.suit}`;
  return cardImg;
};

const reduceAce = (sum, aceCount) => {
  while (sum > 21 && aceCount) {
    sum-=10;
    aceCount--;
  };

  return sum;
};

const split = () => {
  let splitDiv = document.getElementById('split-cards');
  splitDiv.style.display = 'block';
  let card = yourCards[0];
  let id = `${card.value}-${card.suit}`;
  yourSum -= card.getValue();
  yourSum2 += card.getValue();
  document.getElementById(id).remove();
  let cardImg = createCardImg(yourCards[0]);
  document.getElementById('split-cards').append(cardImg);
  document.getElementById('split').style.display = 'none';
  document.getElementById('hand-1').style.display = 'block' 
};

// TODO: add logic to add to yourSum2
// create function for hitting (player gets next card on deck)
const hit = () => {
  console.log('in hit');
  if (!canHit) return;
  console.log('can hit');
  let cardImg = document.createElement('img');
  let card = deck.pop();
  cardImg.src = `./cards/${card.value}-${card.suit}.png`
  cardImg.id = `${card.value}-${card.suit}`
  if (stayCount === 0) {
    checkAce(card.value, 'your');
    console.log(card.value);
    yourSum+=card.getValue();
    console.log(yourSum);
    document.getElementById('your-cards').append(cardImg);
    if (reduceAce(yourSum, yourAceCount) > 21) canHit = false;
  } else {
    checkAce(card.value, 'your2');
    yourSum2+=card.getValue();
    document.getElementById('split-cards').append(cardImg);
    if (reduceAce(yourSum2, your2AceCount) > 21) canHit = false;
  }
}

let resultMessage;
let result2Message;

const calculateResultMessage = (sum) => {
  let dealerDiff = 21-dealerSum;
  let handDiff = 21-sum;

  if (sum > 21) {
    return losingMessage;
  } else if(dealerSum > 21) {
    return winningMessage;
  } else if (sum === dealerSum) {
   return tieMessage;
  } else { // who ever is closer wins
    let closest = Math.min(dealerDiff, handDiff);
    return closest === dealerDiff ? losingMessage : winningMessage;
  }
};

// create function for staying (should flip the dealer's cards over and declare whether the player won or lost) & should reset the game
const stay = () => {
  if (yourSum2 && stayCount < 1) {
    console.log('increase stay count');
    stayCount++;
    canHit = true;
    return;
  }
  dealerSum = reduceAce(dealerSum, dealerAceCount);
  yourSum = reduceAce(yourSum, yourAceCount);
  yourSum2 = reduceAce(yourSum2, your2AceCount);

  canHit = false;
  // flip over dealer's flipped over card
  document.getElementById('face-down').src = `./cards/${faceDownCard.value}-${faceDownCard.suit}.png`

  // display whether the dealer or the player won
  resultMessage = calculateResultMessage(yourSum)

  document.getElementById('dealer-sum').innerText = dealerSum;
  if (!yourSum2) {
    document.getElementById('your-sum').innerText = yourSum;
  } else {
    document.getElementById('hand-1-sum').innerText = yourSum;
    document.getElementById('hand-2-sum').innerText = yourSum2;
    result2Message = calculateResultMessage(yourSum2);
    document.getElementById('results-2').innerText = result2Message;
  }
  document.getElementById('results').innerText = resultMessage;
}

