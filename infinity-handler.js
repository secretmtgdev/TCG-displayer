import CardService from './services/CardService.js';

const cardService = new CardService();
var currTrigger = 1;

if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
} else {
    setup();
}

async function setup() {
    let token = sessionStorage.getItem('position');
    if(token) {
        let {x, y} = JSON.parse(token);
        console.log(x)
        console.log(y)
        window.scrollTo(x, y);
    }
    window.addEventListener('beforeunload', () => {
        let pos = {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
        sessionStorage.setItem('position', JSON.stringify(pos));
    })
    window.addEventListener('scroll',  async function() {
        if(!cardService.loading) {
            // grab data set 
            var sets = document.querySelectorAll('div[data-triggered]');
            var target = sets[sets.length-2];

            // window.scrollY is not supported by IE
            var windowHeight = document.documentElement.scrollTop+ window.innerHeight, targetPlacement = target.offsetHeight + target.offsetTop;
            if(windowHeight > targetPlacement) {
                cardService.loading = true;
                await cardService.loadJSON();
            }
        }
    });
    await cardService.loadJSON();
}