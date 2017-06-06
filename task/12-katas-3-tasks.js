'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    let maxX = puzzle[0].length-1; 
    let maxY = puzzle.length-1; 
     
    let getLetter = function(p) { 
        return puzzle[p.y][p.x]; 
    } 
 
    let createPoint = function(p, dx, dy) { 
        return { x: p.x + dx, y: p.y + dy }; 
    } 
  
    let to_Left = function(p) { 
        return p.x !== 0 ? createPoint(p, -1, 0) : false ; 
    } 
  
    let to_Right = function(p) { 
        return p.x !== maxX ? createPoint(p, 1, 0) : false ; 
    } 
  
    let to_Top = function(p) { 
        return p.y !== 0 ? createPoint(p, 0, -1) : false ; 
    } 
 
    let to_Bottom = function(p) { 
        return p.y !== maxY ? createPoint(p, 0, 1) : false ; 
    } 
  
    let dirs = [to_Left, to_Right, to_Top, to_Bottom]; 
  
    let letter = searchStr[0];
    let firstPositions = puzzle.reduce((p, e, y) => {  
        let x = e.indexOf(letter); 
        if(x !== -1)  
            p.push( { x: x, y: y} ); 
        return p; 
        }, []); 
 
    for(let i = 0, len = firstPositions.length; i < len; i++) { 
        let curPos = firstPositions[i]; 
        let usedPos = [curPos];
        let str = Array.from(searchStr).splice(1); 
        let result = letter; 
        while (str.length > 0) { 
            let nextLetter = str.splice(0, 1)[0]; 
            var n = dirs.reduce((p, e) => {  
                let nPos = e(curPos); 
                if(nPos && !usedPos.some(e => e.x === nPos.x && e.y === nPos.y )) { 
                    let tempLetter = getLetter(nPos); 
                    if(tempLetter === nextLetter) {
                        p.push(nPos); 
                    }
                } 
                return p; }, []); 
            if(n.length !== 0) { 
                curPos = n[0]; 
                usedPos.push(curPos);
                result += nextLetter; 
            } else { 
                break; 
            } 
        } 
        if(result === searchStr) {
            return true; 
        }
    } 
    return false; 
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    function make(arr, el) {
        var i, i_m, item;
        var len = arr.length;
        var res = [];

        for(i = len; i >= 0; i--) {
            var p = arr.slice(0, i) + el + arr.slice(i, i_m);
            res.push(p);
        }
        return res;
    }

    var prev, curr, el, i;

    curr = [chars[0]];

    if(chars.length === 1) {
        yield chars;
    } else {
        for(let i = 1, len = chars.length; i < len; i++) {
            el = chars[i];
            prev = curr;
            curr = [];

            for(let j = 0, len_j = prev.length; j < len_j; j++) {
                var a = make(prev[j], el);
                curr = curr.concat( a );
            }
        }

        for(let i = 0, len = curr.length; i < len; i++) {
            yield curr[i];
        }
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let result = 0; 
    while(quotes.length > 1) { 
        var max = Math.max.apply(null, quotes); 
        var index = quotes.indexOf(max); 
        if(index === 0) break; 
        quotes.splice(index, 1) 
        var sub = quotes.splice(0, index); 
        result += sub.reduce((p, e) => { return p += max - e }, 0); 
    } 
    return result;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */

function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";

    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+ 
                           "abcdefghijklmnopqrstuvwxyz"+ 
                           "0123456789-_.~!*'();:@&=+$,/?#[]"; 
 
 
    this.lettertToStrNum = function(letter) { 
        let numA = this.urlAllowedChars.indexOf(letter); 
        let strNum = numA < 10 ? `0${numA}` : `${numA}`; 
        return strNum; 
    } 
 
    this.strNumToLetter = function(strNum) { 
        let numA = parseInt(strNum); 
        return this.urlAllowedChars[numA]; 
    }
}

UrlShortener.prototype = {

    encode: function(url) {
        let arrURL = Array.from(url); 
        let a = arrURL.reduce((p, e) => { p += this.lettertToStrNum(e); return p }, ''); 
        if(a.length % 4)  
            a += '85'; 
        let res = ''; 
        while(a.length > 3) { 
            var r = a.slice(0, 4); 
            res += String.fromCharCode(r); 
            a = a.replace(r, ''); 
        } 
        return res; 
    },
    
    decode: function(code) {
        var arrCode = Array.from(code); 
        let nums = arrCode.reduce((p, e) => {  
            let c = e.charCodeAt(0);  
            p.push(Math.floor(c/100)); 
            p.push(c % 100) 
            return p;}, []); 
        let numsHigh = nums.length - 1; 
        if(nums[numsHigh] === 85) 
            nums.splice(numsHigh, 1); 
        var res = nums.map(e => this.strNumToLetter(e)).join(''); 
        return res;
    } 
}


module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
