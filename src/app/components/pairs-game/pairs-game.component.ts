import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Card } from '../../interfaces/card';

@Component({
  selector: 'app-pairs-game',
  imports: [NgClass, NgFor, NgIf],
  templateUrl: './pairs-game.component.html',
  styleUrl: './pairs-game.component.scss'
})
export class PairsGameComponent implements OnInit {
  cardSortingHolding: Card[];
  clickedCards: Card[];
  clickingActive: boolean;
  selectedCards: Card[];
  winGame: boolean;
  constructor(){
    this.clickingActive = true;
    this.selectedCards = [];
    this.clickedCards = [];
    this.winGame = false;
    this.cardSortingHolding = [];
  }

  ngOnInit(): void {
    this.getCards(4);
  }

  getCards = (numberOfPairs: number) => {
    //get requested number of pairs into holding array
    this.cardSortingHolding = []
    for (var i = 0; i < numberOfPairs; i++) {
      let nextCard = { type: i, clicked: false, correct: false };
      this.cardSortingHolding.push({...nextCard}, {...nextCard});
    }

    //shuffle holding array into selected cards array
    this.selectedCards = [];
    while (this.cardSortingHolding.length != 0) {
        var cardNumber = Math.floor(Math.random() * this.cardSortingHolding.length);
        this.selectedCards.push(this.cardSortingHolding[cardNumber]);
        this.cardSortingHolding.splice(cardNumber, 1);
    }
  }

  clickCard = (card: Card) => {
    //has this card already been selected or paired up
    if (this.clickingActive && !card.clicked && !card.correct) {
        //if not, note it's been clicked, and add it to the current pair of selected cards
        this.clickingActive = false;
        card.clicked = true;
        this.clickedCards.push(card);
        setTimeout(() => {
            //when there's two cards selected, see if they match
            if (this.clickedCards.length == 2) {
                if (this.clickedCards[0].type === this.clickedCards[1].type) {
                    //if they match, mark them as correct, and see if you've matched them all
                    this.clickedCards = [];
                    this.selectedCards.forEach(card => {
                      if (card.clicked == true) {
                        card.clicked = false;
                        card.correct = true
                      }
                      var remainingCards = this.selectedCards.filter(card => card.correct == false );
                      if (remainingCards.length == 0) {
                          //U R TEH WINRAR
                          this.winGame = true;
                      }
                    });
                }
                //if they don't match, flip them over again and clear the selected cards
                else {
                    this.clickedCards = [];
                    this.selectedCards.forEach(card => {
                      card.clicked = false;
                    });
                }
            }
            this.clickingActive = true;
        }, 1000);

    }
}

  resetGame = (numberOfCards: number) => {
    //do some reset stuff
    this.selectedCards = [];
    this.winGame = false;

    setTimeout(() => {
      //then shuffle some cards
      this.getCards(numberOfCards);
    }, 1000);
  }
}
