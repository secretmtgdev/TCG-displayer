import Card from './classes/Card.js';
import CardService from './services/CardService.js';

const cardService = new CardService();
var currTrigger = 1;

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
} else {
    setup();
}

async function setup() {
    window.addEventListener('scroll',  async function() {
        if(!cardService.loading) {
            // grab data set 
            var sets = document.querySelectorAll('div[data-triggered]');
            var target = sets[sets.length-2];

            // window.scrollY is not supported by IE
            var windowHeight = document.documentElement.scrollTop+ window.innerHeight, targetPlacement = target.offsetHeight + target.offsetTop;
            if(windowHeight > targetPlacement) {
                console.log(cardService.offset);
                cardService.loading = true;
                await cardService.loadJSON();
            }
        }
    });
    await cardService.loadJSON();
}