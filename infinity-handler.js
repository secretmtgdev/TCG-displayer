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
    
        sessionStorage.setItem('position', JSON.stringify(pos));
        if(infinityScroll.childNodes.length > 0) {
            sessionStorage.setItem('cached-query', JSON.stringify({
                cards: cardService.currentCards
            }));
        }
    })
    
    window.addEventListener('scroll', function(callback) {
        if(!cardService.loading) {
            // grab data set 
            var sets = document.querySelectorAll('div[data-triggered]');
            var target = sets[sets.length-2];

            // window.scrollY is not supported by IE
            var windowHeight = document.documentElement.scrollTop+ window.innerHeight, targetPlacement = target.offsetHeight + target.offsetTop;
            if(windowHeight > targetPlacement) {
                cardService.loading = true;
                cardService.loadJSON(callback);
            }
        }
    }.bind(this, Util.scrollHandler));

    cardService.loadJSON(Util.scrollHandler); 
}