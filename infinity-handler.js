import CardService from './services/CardService.js';
import Util from './services/Util.js';

const cardService = new CardService();

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
} else {
    setup();
}

function setup() {
    window.addEventListener('beforeunload', () => {
        let pos = {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    
        localStorage.setItem('position', JSON.stringify(pos));
        if(infinityScroll.childNodes.length > 0) {
            let invalidOffset = cardService.offset > Util.CARD_LIMIT - Util.START;
            localStorage.setItem('cached-query', JSON.stringify({
                cards: invalidOffset ? [] : cardService.currentCards, 
                offset: invalidOffset ? 0 : cardService.offset
            }));
        }
    })
    
    window.addEventListener('scroll', async function() {
        if(!cardService.loading) {
            // grab data set 
            var sets = document.querySelectorAll('div[data-triggered]');
            var target = sets[sets.length-2];

            // window.scrollY is not supported by IE
            var windowHeight = document.documentElement.scrollTop+ window.innerHeight, targetPlacement = target.offsetHeight + target.offsetTop;
            if(windowHeight > targetPlacement) {
                cardService.loading = true;
                await cardService.getProducts();
            }
        }
    }.bind(this));
    cardService.loadJSON(); 
}