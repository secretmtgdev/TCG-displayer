export default class Card {
    // Would love to use '#' for privacy but only chrome and opera support this 
    // on the desktop platform
    constructor(name, productId, groupId, imgSrc) {
        this.name = name;
        this.productId = productId;
        this.groupId = groupId;
        this.imgSrc = imgSrc;
    }

    ///////////////
    /// GETTERS ///
    ///////////////
    get name() { return this._name; }
    get productId() { return this._productId; }
    get groupId() { return this._groupId; }
    get imgSrc() { return this._imgSrc; }
    
    ///////////////
    /// SETTERS ///
    ///////////////
    set name(newName) { this._name = newName; }
    set productId(newId) { this._productId = newId; }
    set groupId(newId) { this._groupId = newId; }
    set imgSrc(newSrc) { this._imgSrc = newSrc; }
}