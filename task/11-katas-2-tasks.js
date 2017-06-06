'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    var numbers = {
        " _ | ||_|":'0',
        "     |  |":'1', 
        " _  _||_ ":'2',
        " _  _| _|":'3',
        "   |_|  |":'4',
        " _ |_  _|":'5',
        " _ |_ |_|":'6',
        " _   |  |":'7',
        " _ |_||_|":'8',
        " _ |_| _|":'9'
    };
    var lenAll = bankAccount.length;
    var lenLine = lenAll/3;
    var countNum = (lenLine - 1)/3;
    var Nums = '';
    var getSubNum = x => bankAccount.substring(beg, beg + 3);
    var i = -1;
    while(++i < countNum) {
        var v = '';
        var beg = i*3
        v += getSubNum(beg);
        beg += lenLine;
        v += getSubNum(beg);
        beg += lenLine;
        v += getSubNum(beg);
        Nums += numbers[v];
    }
    return parseInt(Nums)
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let pattern = `(?!\\s).{1,${columns}}(?=(\\s|$))`; 
    let result = text.match(new RegExp(pattern, 'g')); 
    for(let i = 0, len = result.length; i < len; i++) { 
        yield result[i]; 
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    const rating = ['', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

    function GroupsBox() {

        function Group(_name) {
            this.name = _name;
            this.count = 1;
            this.add = function() { this.count++; }
        }

        var _box = [];

        this.box = function() {
            return _box;
        }();

        this.add = function(value, f) {
            var g = _box.find(y => f(y.name, value));
            if(g) {
                g.add();
            } else {
                _box.push(new Group(value));
            }
        }
    }
  
    function ChainBox() { 

        function Chain(firstVal) { 
            this.items = [firstVal]; 
            var next = firstVal.rank + 1; 
     
            this.first = function() { return firstVal; }(); 
     
            this.add = function (val) {
                if(next === val.rank) { 
                    this.items.push(val); 
                    next = val.rank + 1;
                    return true; 
                } else { 
                    return false; 
                } 
            } 
          
            this.addChain = function (ch) { 
                if(ch.first.rank === next) { 
                    this.items = this.items.concat(ch.items); 
                    next = this.items[this.items.length - 1].rank + 1;
                    return true; 
                } else { 
                    return false; 
                }
            } 
        }       

        var items = []; 

        this.box = function() {
            return items;
        }();
     
        this.chains = function() { return items; } 
     
        this.add = function(val) { 
            var r = items.some(x => x.add(val)); 
     
            if(!r) { 
                items.push(new Chain(val)); 
                if(val.rank === 13) {
                    var A = new Card(val.card);
                    A.rank = 0;
                    items.push(new Chain(A)); 
                }
                items.sort((x1, x2) =>  x1.first.rank - x2.first.rank ); 
            } 
            var p = 0, n = 1; 
            while(n < items.length) { 
                var c = items[p].addChain(items[n]); 
                if(c) { 
                    items.splice(n, 1); 
                } else { 
                    p++; 
                    n++; 
                } 
            } 
        } 
    } 

    function Card(c) {
        this.card = c;
        this.color = c.slice(-1);
        this.rank = rating.indexOf(c.slice(0, -1));
    }
    hand = hand.map(x => new Card(x));

    var chainRank = new ChainBox();
    hand.forEach(chainRank.add);

    var groupsColor = new GroupsBox();
    var addColor = x => groupsColor.add(x, (y1, y2) => y1.color === y2.color);
    hand.forEach(addColor);
    
    if(groupsColor.box.length === 1) {

        if(chainRank.box.some(x => x.items.length === 5))
            return PokerRank.StraightFlush;
        return PokerRank.Flush;
    }
    if(chainRank.box.some(x => x.items.length === 5))
            return PokerRank.Straight;

    var groupsRank = new GroupsBox();
    var addRank = x => groupsRank.add(x, (y1, y2) => y1.rank === y2.rank);
    hand.forEach(addRank);

    if(groupsRank.box.some(x => x.count === 4))
        return PokerRank.FourOfKind;

    if(groupsRank.box.some(x => x.count === 3)){
        if(groupsRank.box.length === 2)
            return PokerRank.FullHouse;
        else
            return PokerRank.ThreeOfKind;
    }

    var countPairs = groupsRank.box.filter(x => x.count === 2).length;
    if(countPairs === 2)
        return PokerRank.TwoPairs;
    if(countPairs === 1)
        return PokerRank.OnePair;

    return PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
   function rect(b, h) { 
        var result = ''; 
        var m = b - 2; 
        var line = s => s.repeat(m) 
        result += `+${line('-')}+\n`; 
        result += `|${line(' ')}|\n`.repeat(h-2); 
        result += `+${line('-')}+\n`; 
        return result; 
    } 
 
    var lines = figure.split('\n'); 
 
    while(lines.length > 2) { 
        var v = lines.shift(); 
        var high = v.lastIndexOf('+'); 
        var n2 = 0; 
        while (n2 < high) { 
            var n1 = -1; 
            do { 
                n1 = v.indexOf('+', n2); 
                var subN1 = lines[0][n1]; 
                var notStop = (subN1 !== '+') && (subN1 !== '|'); 
                n2 = n1 + 1; 
            } while(notStop); 
            if(n1 === -1) break; 
 
 
            var n = n1; 
 
 
            do { 
                n2 = v.indexOf('+',n + 1); 
                var subN2 = lines[0][n2]; 
                var notStop = (subN2 !== '+') && (subN2 !== '|'); 
                n = n2; 
            } while(notStop && (n2 !== -1)); 
             if(n2 === -1) break; 
            var b = n2 - n1 + 1; 
            var h = lines.findIndex(x => x[n1] === '+' && x[n2] === '+') + 2;         
           
 
 
            yield rect(b, h); 
        } 
    } 
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
