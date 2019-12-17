import Card from './Card';

export default class MagicCard extends Card {
    constructor(name, productId, groupId, imgSrc, price) {
        super(name, productId, groupId, imgSrc);
        this.price = price;
    }

    ///////////////
    /// GETTERS ///
    ///////////////
    get price() { return this.price; }

    ///////////////
    /// SETTERS ///
    ///////////////
    set price(newPrice) { this.price = newPrice; }
}