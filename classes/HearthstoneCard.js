import Card from './Card';
export default class HearthstoneCard extends Card {
    /**
     * 
     * @param {*} name 
     * @param {*} productId 
     * @param {*} groupId --> Set id for card 
     */
    constructor(name, productId, groupId, imgSrc, ability) {
        super(name, productId, groupId, imgSrc);
        this.ability = ability;
    }

    ///////////////
    /// GETTERS ///
    ///////////////
    get ability() { return this.ability; }

    ///////////////
    /// SETTERS ///
    ///////////////
    set ability(newAbility) { this.ability = newAbility; }
}