'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;
    this.__proto__.getArea =  function() { return width*height; };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    let res = JSON.parse(json);
    res.__proto__ = proto;
    return res;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
    error1: 'Element, id and pseudo-element should not occur more then one time inside the selector',
    error2: 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    num: 0,
    res: '',

    element: function(value) {
        var numSelf = 1;
        if(this.hasOwnProperty('isElem')) {
            throw this.error1;
        };
        if(this.num > numSelf) {
            throw this.error2;
        }
        var s = { res: value, isElem: value, num: numSelf };
        s.__proto__ = this;
        return s;
    },

    id: function(value) {
        var numSelf = 2;
        if(this.hasOwnProperty('isId')) {
            throw this.error1;
        };
        if(this.num > numSelf) {
            throw this.error2;
        }
        var r = this.res + `#${value}`;
        var s = { res: r, isId: value, num: numSelf };
        s.__proto__ = this;
        return s;
    },

    class: function(value) {
        var numSelf = 3;
        if(this.num > numSelf) {
            throw this.error2;
        }
        var r = this.res + `.${value}`;
        var s = { res: r, num: numSelf };
        s.__proto__ = this;
        return s;
    },

    attr: function(value) {
        var numSelf = 4;
        if(this.num > numSelf) {
            throw this.error2;
        }
        var r = this.res + `[${value}]`;
        var s = { res: r, num: numSelf };
        s.__proto__ = this;
        return s;
    },

    pseudoClass: function(value) {
        var numSelf = 5;
        if(this.num > numSelf) {
            throw this.error2;
        }
        var r = this.res + `:${value}`;
        var s = { res: r, num: numSelf };
        s.__proto__ = this;
        return s;
    },

    pseudoElement: function(value) {
        if(this.hasOwnProperty('isPsEl')) {
            throw this.error1;
        };
        var numSelf = 6;
        if(this.num > numSelf) {
            throw this.error2;
        }
        var r = this.res + `::${value}`;
        var s = { res: r, isPsEl: value, num: numSelf };
        s.__proto__ = this;
        return s;
    },

    combine: function(selector1, combinator, selector2) {
        var s = { res: `${selector1.res} ${combinator} ${selector2.res}` };
        s.__proto__ = this;
        return s;
    },

    stringify: function() {
        return this.res;
    }
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
