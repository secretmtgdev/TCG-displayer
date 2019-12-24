export default class Util {
    static scrollHandler() {
        let token = localStorage.getItem('position');
        if(token) {
            let {x, y} = JSON.parse(token);
            window.scrollTo(x, y);
        }
    }

    /**
     * @method loadJSON 
     * @description Loads the local config.json file
     */
    static loadJSON() {
        return new Promise(function(resolve, reject) {
            let request = new XMLHttpRequest();
            request.overrideMimeType('application/json');
            request.open('GET', './config.json');
            request.onreadystatechange = function() {
                if(request.readyState === 4 && request.status === 200) {
                    Util.json = JSON.parse(request.responseText)['api'];
                    Util.setAuth('TCGPlayer', response => {
                        Util.authToken = JSON.parse(response)['access_token'];
                        resolve(response);
                    })
                }
            };
            request.send(null);
        });
    }

    /**
     * @method setAuth
     * @description Grabs the appropriate authorization for the current application
     * @param {string} gameType
     * @param {function} cb The callback handler 
     */
    static setAuth(gameType, cb) {
        Util.type = gameType;
        if(Util.json && Util.json[gameType]) Util.scope = Util.json[gameType];
        Util.QUERY_LIMIT = 100;
        Util.START = Util.scope['set'].throne_of_eldraine.start;
        Util.CARD_LIMIT = Util.scope['set'].throne_of_eldraine.end;
        let request = new XMLHttpRequest();

        // request the key
        request.open('POST', Util.scope['endpoints']['auth'], true);
        let username = Util.scope['credentials']['client_id'], password = Util.scope['credentials']['client_secret']; 
    
        // Oauth 2 expects the header to be Util
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        request.onreadystatechange = function() {
            if(this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                cb(request.responseText);
            }
        }
        if(Util.type === 'Blizzard')request.setRequestHeader('Authorization', `Basic ${btoa(`${username}:${password}`)}`); 
        let body = `grant_type=client_credentials${Util.type === 'TCGPlayer' ? `&client_id=${username}&client_secret=${password}`: ''}`;
        request.send(body);       
    }

     /**
     * @method restCall
     * @description Little helper for generic rest calls 
     * @param {String} method REST method 
     * @param {String} endpoint The endpoint to hit
     * @param {Function} cb The callback handler
     * @param  {...any} query Any sort of parameters that may be needed for the query
     */
    static restCall(method, endpoint, cb, ...query) {
        var data = JSON.stringify(false);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === this.DONE) {
                cb(this.responseText);
            }
        });

        let queries=query.join("&");
        let url = `${Util.scope['base']}${Util.scope['endpoints'][endpoint]}${query.length>0?`?${queries}`:''}`
        xhr.open(method, url);
        xhr.setRequestHeader('Authorization', `Bearer ${Util.authToken}`);
        xhr.send(data);
    }







    
    // Portion taken from following  Jeremy Wagner's lazy loading article
    static lazyLoadHandler() {
        var lazyImages = [].slice.call(document.querySelectorAll('img.lazy'));
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