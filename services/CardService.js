import Card from '../classes/Card.js';

const COL_LIMIT = 4;
const QUERY_LIMIT = 100;

export default class CardService {
    constructor() {
        this.offset = 0;
        this.type = '';
        this.json = null;
        this.scope = null;
        this.authToken = '';
        this.currentCards = [];
        this.currTrigger = 1;
        this.loading = false;

        // get around CORs issue with TCGPlayer api
        this.proxyurl = "";
    }

    /**
     * @method setAuth
     * @description Grabs the appropriate authorization for the current application
     * @param {string} gameType
     * @param {function} cb The callback handler 
     */
    async setAuth(gameType, cb) {
        this.type = gameType;
        if(this.json && this.json[gameType]) this.scope = this.json[gameType];
        let request = new XMLHttpRequest();

        // request the key
        request.open('POST', this.proxyurl + this.scope['endpoints']['auth'], true);
        let username = this.scope['credentials']['client_id'], password = this.scope['credentials']['client_secret']; 
    
        // Oauth 2 expects the header to be this
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                cb(request.responseText);
            }
        }
        if(this.type === 'Blizzard')request.setRequestHeader('Authorization', `Basic ${btoa(`${username}:${password}`)}`); 
        let body = `grant_type=client_credentials${this.type === 'TCGPlayer' ? `&client_id=${username}&client_secret=${password}`: ''}`;
        request.send(body);       
    }
    

    /**
     * @method queryCards
     * @description Makes the rest call to grab the cards
     * @param {Number} cardsToGet
     * @param {String} type The type of tcg
     * @param {cb} The callback handler 
     * @return {Array<Card>} The cards that were retrieved from the GET request
     */
    getCards(cardsToGet) {
        
    }

    /**
     * @method createQuery 
     * @description Helper method to generate a query based off of set properties
     * @param {String} property 
     * @return The constructed query string
     */
    createQuery(property, queryCount) {
        let endpoint = this.scope['endpoints']['cards'];
        let obj = this.scope['query_param_defaults'];
        for(let prop in obj) {
            if(obj.hasOwnProperty(prop)) {
                endpoint += `${prop}=${obj[prop]}&`;
            }
        }
        return `${endpoint}access_token=${this.authToken}`;
    }

    /**
     * @method loadJSON 
     * @description Loads the local config.json file
     * @method {function} The callback function to handle the get request
     */
    async loadJSON() {
        let request = new XMLHttpRequest();
        request.overrideMimeType('application/json');
        request.open('GET', './config.json');
        request.onreadystatechange = function() {
            if(request.readyState === COL_LIMIT && request.status === 200) {
                this.json = JSON.parse(request.responseText)['api'];
                this.setAuth('TCGPlayer', response => {
                    this.authToken = JSON.parse(response)['access_token'];
                    this.getProducts();
                })
            }
        }.bind(this);
        request.send(null);
    }

    getGroups() {
        this.restCall("GET", "groups");
    }

    async getProducts() {
        let handler = response => {
            let results = JSON.parse(response)['results'];
            for(let key in results) {
                let card = results[key];
                this.currentCards.push(new Card(card.name, card.productId, card.groupId, card.imageUrl));
            }
            this.showCaseCards();
            this.offset += QUERY_LIMIT;
        }
        await this.restCall("GET", "products", handler, "categoryId=1", `limit=${QUERY_LIMIT}`, `offset=${this.offset+this.scope['set'].throne_of_eldraine.start}`);
    }

    /**
     * @method restCall
     * @description Little helper for generic rest calls 
     * @param {String} method REST method 
     * @param {String} endpoint The endpoint to hit
     * @param {Function} cb The callback handler
     * @param  {...any} query Any sort of parameters that may be needed for the query
     */
    async restCall(method, endpoint, cb, ...query) {
        var data = JSON.stringify(false);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                cb(this.responseText);
            }
        });

        let queries=query.join("&");

        let url = `${this.proxyurl}${this.scope['base']}${this.scope['endpoints'][endpoint]}${query.length>0?`?${queries}`:''}`
        console.log(url);
        xhr.open(method, url);
        xhr.setRequestHeader('Authorization', `Bearer ${this.authToken}`);
        xhr.send(data);
    }

    showCaseCards() {
        var adCount = 0;
        for(var i = 0; i < QUERY_LIMIT/COL_LIMIT; i++) {
            var row = document.createElement('section');
            var randAdCol = Math.floor(Math.random()*COL_LIMIT);
            row.className = 'wrapper';
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
                    cardImg.dataset.src = this.currentCards[cardIdx].imgSrc;
                    card.appendChild(cardImg);
                }
                row.appendChild(card);
            }
            infinity.appendChild(row)
        }
        this.loading = false;
        this.lazyLoadHandler();
    }

    // Portion taken from following  Jeremy Wagner's lazy loading article
    lazyLoadHandler() {
        var lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
        console.log(lazyImages);
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if(entry.isIntersecting) {
                    let lazyImage = entry.target;
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove('lazy');
                    lazyImageObserver.unobserve(lazyImage);
                }
            });
        });
        
        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        })
    }
}
