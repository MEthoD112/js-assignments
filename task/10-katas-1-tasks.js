'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N','E','S','W'];

    let result = [];

    function forPair(arr, f) {
        let len = arr.length;
        for(let prev = 0, next = 1 ; next < len ; prev++, next++ ) {
            f(arr[prev], arr[next], prev, next);
        }
        let high = len - 1
        f(arr[high], arr[0], high, 0);
    }

    function push(name, az) {
        result.push({ abbreviation: name, azimuth: az });
    }
    
    var direction = (function () {
        let addAngle = 360/32;
        let counter = -addAngle;
        return function () { return counter += addAngle; }
    })();

    forPair(sides, (p, n, ip) => {
        let mix = ip%2 ? `${n}${p}` : `${p}${n}` ;
        push(p, direction());
        push(`${p}b${n}`, direction());
        push(`${p}${mix}` , direction());
        push(`${mix}b${p}`, direction());
        push(`${mix}`     , direction());
        push(`${mix}b${n}`, direction());
        push(`${n}${mix}` , direction());
        push(`${n}b${p}`, direction());
    });
    return result;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    function List(arrElems, base, pushNext, all) {

        // It need replace to RegExp
        var arr = arrElems.split(',');
        for(let p = 0, n = 1, len = arr.length ; n < len ; p++, n++ ){
            if(arr[p].indexOf('{') !== -1) {
                arr[p] = arr[p] + ','+ arr[n];
                arr.splice(n, 1);
                p++;
                n++; 
            }
        }

        var curI = 0;
        var len = arr.length;
        var nextFromItem = function() {
            curI++;
            if(curI === len) {
                curI = 0;
                pushNext();
            }
        }

        var getList = function (target, nextFromItem) {
            let re = '{((.*?{.*?}.*?)*||[^{])*?}';
            let bs = target.match(re)[0];
            let arrItems = bs.slice(1,-1);
            return new List(arrItems, bs, nextFromItem, target);
        }

        var items = arr.map(
            x => x.indexOf('{') === -1
                ? new Item(x, nextFromItem ) 
                : getList(x, nextFromItem )
            );

        this.current = function() { return (s) => { 
                let newVal = items[curI].current()();
                let target = s 
                    ? s 
                    : all;
                return target.replace(base, newVal);
            };
        };
        this.next = function() {
            items[curI].next();
        }
    }

    function Item(elem, nt) {
        this.current = function() { return s => elem; };
        this.next = nt;
    }

    var notExit = true;

    var mainBrackets = [];

    var add = function(e) {
        var fun = mainBrackets.length === 0 
            ? () => notExit = false
            : mainBrackets[mainBrackets.length - 1].next;
        mainBrackets.push(new List(e.slice(1, -1), e, fun));
    }

    let re = '{((.*?{.*?}.*?)*||[^{])*?}';
    let arrElems =  str.match(new RegExp(re, 'g'));
    if(arrElems) {
        arrElems.forEach(add);

        let i = 0;
        let last = mainBrackets[mainBrackets.length - 1];
        do {
            var res = mainBrackets.reduce((p,e) => { return e.current()(p); }, str);
            last.next();
            yield res;
        } while(notExit && i++ < 20);
    }
    else
        yield str;
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let result = Array.from( { length: n } ).map(x => Array.from( { length: n } ).map(y => 0)); 
  
    for (let i = 0; i < n; i++) { 
        for (let j = 0; j < n; j++) { 
            if ((i + j) < n) { 
                result[i][j] = 0.5 * (i + j + 1) * (i + j + 2) + ((i + j) % 2 == 0 ? -i : -j) - 1; 
            } 
            else { 
                let p = n - i - 1; 
                let q = n - j - 1; 
                result[i][j] = n * n + 1 - (0.5 * (p + q + 1) * (p + q + 2) + ((p + q) % 2 == 0 ? -p : -q)) - 1; 
            } 
        } 
    } 
    return result;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    var douplets = dominoes.filter(x => x[0] === x[1]).map(x => x[0]);
    var arr = dominoes.join(); 
    var countOdd = 0; 
    var i = 0; 
    do { 
        var countNum = arr.match(new RegExp(i, 'g')); 
        countNum === null && !(countNum = []); 
        if(countNum.length === 2 && douplets.some(x => x === i))
            countOdd = 3; 
        countNum.length%2 && countOdd++; 
    } while (++i < 7 && countOdd < 3) 
    return countOdd < 3; 
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let result = [];
    let subRes = [];
    let expected = nums[0];
    
    var handler = x => {
        if(expected === x) { 
            subRes.push(x);
        } else {
            subResToResult();
            subRes = [x];
        }
        expected = ++x;
    }
    nums.forEach(handler);
    subResToResult();

    return result.join();

    function subResToResult() {
        result.push( subRes.length < 3 ? subRes.join(',') : `${subRes.shift()}-${subRes.pop()}`);
    };
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
