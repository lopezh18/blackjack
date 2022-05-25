const SUITS = ["C", "S", "H", "D"];
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
];

const stringToNum = {
  "A": 11,
  "J": 10,
  "Q": 10,
  "K": 10
}

export default class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards;
  }

  get numberOfCards() {
    return this.cards.length;
  }

  shuffle() {
    for (let i = 0; i < this.numberOfCards; i++) {
      let newIdx = Math.floor(Math.random() * this.numberOfCards);
      // switch placements

      let currentCard = this.cards[i];
      this.cards[i] = this.cards[newIdx];
      this.cards[newIdx] = currentCard;
    }
    return this.cards;
  }

  pop() {
    return this.cards.shift();
  }

}

class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }

  getValue () {
    let num = +(this.value) || stringToNum[this.value];
    return num;
  }
}

function freshDeck() {
  return SUITS.flatMap((suit) => {
    return VALUES.map((value) => {
      return new Card(suit, value)
    });
  });
};
