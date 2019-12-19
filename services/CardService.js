import Card from '../classes/Card.js';
import Util from './Util.js';

const COL_LIMIT = 4;
var ROW_CACHE = [];
var rowRef = 1;

export default class CardService {
    constructor() {
        this.offset = 0;
        this.currentCards = [];
        this.currTrigger = 1;
        this.loading = false;

        // get around CORs issue with TCGPlayer api
        this.proxyurl = "";
    }

    /**
     * @method loadJSON 
     * @description Loads the local config.json file
     * @param {Function} The callback function to handle the get request
     */
    loadJSON(cb) {
        Util.loadJSON().then(function(response) {
            let cached = sessionStorage.getItem('cached-query');
            if(cached) {
                this.currentCards = JSON.parse(cached)['cards'];
                this.showCaseCards(Util.scrollHandler);                        
            } else {
                this.getProducts(cb);
            }
        }.bind(this))
    }

    /**
     * @method getProducts
     * @description Makes a call to the product endpoint API of the respective source
     * @param {Function} callback
     */
    getProducts(callback) {
        let handler = response => {
            let results = JSON.parse(response)['results'];
            for(let key in results) {
                let card = results[key];
                console.log(card);
                this.currentCards.push(new Card(card.name, card.productId, card.groupId, card.imageUrl));
            }
            this.showCaseCards(callback);
        }
        let start = this.offset+Util.scope['set'].throne_of_eldraine.start;
        if(start < Util.CARD_LIMIT - Util.QUERY_LIMIT) {
            Util.restCall("GET", "products", handler, "categoryId=1", `limit=${Util.QUERY_LIMIT}`, `offset=${start}`);
        }
    }

    /**
     * @method showCaseCards
     * @description Displays the cards on the page 
     * @param {Function} callback
     */
    showCaseCards(callback) {
        var adCount = 0;
        for(var i = 0; i < Util.QUERY_LIMIT/COL_LIMIT; i++) {
            var row = document.createElement('section');
            var randAdCol = Math.floor(Math.random()*COL_LIMIT);
            row.className = 'wrapper';
            row.dataset.rowRef = rowRef;
            for(var j = 0; j < COL_LIMIT; j++) {
                var card = document.createElement('div');
                card.className = 'card';

                // set trigger
                if(i%2===1 && j === randAdCol) {
                    card.dataset.triggered=false;
                    card.dataset.id= this.currTrigger++;
                    adCount++;
                    card.innerText = 'AD';
                    card.style.fontSize = '5em';
                    card.style.alignItems = 'center';
                    card.style.justifyContent = 'center';
                } else {
                    let cardIdx = (this.offset + (i * COL_LIMIT + j) - adCount) % this.currentCards.length;
                    let cardImg = document.createElement('img');
                    cardImg.src = './assets/placeholder.jpg';
                    cardImg.className = 'lazy';
                    cardImg.dataset.src = this.currentCards[cardIdx]._imgSrc;
                    card.appendChild(cardImg);
                }
                row.appendChild(card);
                ROW_CACHE.push(row.cloneNode(true));
            }
            infinityScroll.appendChild(row)
        }
        this.loading = false;
        this.offset += Util.QUERY_LIMIT;
        Util.lazyLoadHandler();
        callback();
    }
}
