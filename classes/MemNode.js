/**
 * @author Michael Wilson 
 * @version 1.0.0
 * @description This memnode object remembers where it previously was on a page and where it's currnet location is.
 * This is useful for implementing an infinity scroll without continually creating new DOM nodes.
 */
export default class MemNode {
    /**
     * @constructor
     * @param {HTMLSectionElement} node 
     * @param {Number} previousLocation 
     * @param {Number} currentLocation 
     */
    constructor(node, previousLocation, currentLocation) {
        this.node = node;
        this.previousLocation = previousLocation;
        this.currentLocation = currentLocation;
    }
}