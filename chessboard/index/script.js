$(document).ready(() => {
    const password = "abc123";
    var playerSide;

    loader('active');
    function loader(type) {
        if (type == 'active') {
            $('.loader').css({ 'display': 'block' });
        } else if (type == 'inactive') {
            $('.loader').css({ 'display': 'none' });
        }
    }
    var preAlert = 0;
    function myAlert(val, time, inbetweenTime = 2000) {
        if (preAlert <= (Date.now() - inbetweenTime)) {
            $('.alert').css({ 'visibility': 'visible', 'transform': 'translateY(-10vh)' }).html(val);
            setTimeout(() => {
                $('.alert').css({ 'visibility': 'hidden', 'transform': 'translateY(+10vh)' }).html(val);
            }, time)
        }
        preAlert = Date.now();
    }
    // variables
    // theme
    var theme = {
        change: true,
        lightcolor: "#e5c798",
        darkcolor: "#c59142",
        activeCoin: "violet",
        availableMoves: "orange",
        attackMoves: "red",
        bgImage: "url(../images/bgBoard.jpg)",
        active: 'white',
        alertBox: '#d7cdd7'
    }
    assignCSSval()


    function assignCSSval() {
        document.documentElement.style.setProperty('--darkcolor', `${theme.darkcolor}`);
        document.documentElement.style.setProperty('--lightcolor', `${theme.lightcolor}`);
        document.documentElement.style.setProperty('--activeCoin', `${theme.activeCoin}`);
        document.documentElement.style.setProperty('--availableMoves', `${theme.availableMoves}`);
        document.documentElement.style.setProperty('--attackMoves', `${theme.attackMoves}`);
        document.documentElement.style.setProperty('--bgImage', `${theme.bgImage}`);
        document.documentElement.style.setProperty('--alertBox', `${theme.alertBox}`);
    }
    // coins
    const blackCoins = {
        king: { code: "&#9818", coin: "bk" },
        queen: { code: "&#9819", coin: "bq" },
        rook: { code: "&#9820", coin: "br" },
        bishop: { code: "&#9821", coin: "bb" },
        knight: { code: "&#9822", coin: "bh" },
        pawn: { code: "&#9823", coin: "bp" },
    }
    const whiteCoins = {
        king: { code: "&#9812", coin: "wk" },
        queen: { code: "&#9813", coin: "wq" },
        rook: { code: "&#9814", coin: "wr" },
        bishop: { code: "&#9815", coin: "wb" },
        knight: { code: "&#9816", coin: "wh" },
        pawn: { code: "&#9817", coin: "wp" },

    }
    var wc = [];
    Object.entries(whiteCoins).forEach((val) => {
        wc.push(val[1].coin);
    })
    var bc = [];
    Object.entries(blackCoins).forEach((val) => {
        bc.push(val[1].coin);
    })
    var coinToCode = {}
    Object.entries(blackCoins).forEach((val) => {
        coinToCode[val[1].coin] = val[1].code
    })
    Object.entries(whiteCoins).forEach((val) => {
        coinToCode[val[1].coin] = val[1].code
    })
    var allCoins = [...wc, ...bc];
    var previousMove = { posi: "", coin: "", move: [], attack: [], valid: false };
    var allPosition = [];
    var allPositionId = [];

    // initial board with coin setting
    startGame();
    // function to set every coin in the initial position
    function startGame() {
        for (var x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                allPositionId.push(parseInt(x + "" + y));
                id = "box-" + (x + "" + y)
                if (x == 2) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${blackCoins.pawn.coin} class="gridItems"> ${blackCoins.pawn.code} </div>`);
                } else if (x == 7) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${whiteCoins.pawn.coin} class="gridItems"> ${whiteCoins.pawn.code} </div>`);
                }
                else if (x == 1 && (y == 1 || y == 8)) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${blackCoins.rook.coin} class="gridItems"> ${blackCoins.rook.code} </div>`);
                }
                else if (x == 8 && (y == 1 || y == 8)) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${whiteCoins.rook.coin} class="gridItems"> ${whiteCoins.rook.code} </div>`);
                }
                else if (x == 1 && (y == 2 || y == 7)) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${blackCoins.knight.coin} class="gridItems"> ${blackCoins.knight.code} </div>`);
                }
                else if (x == 8 && (y == 2 || y == 7)) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${whiteCoins.knight.coin} class="gridItems"> ${whiteCoins.knight.code} </div>`);
                }
                else if (x == 1 && (y == 3 || y == 6)) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${blackCoins.bishop.coin} class="gridItems"> ${blackCoins.bishop.code} </div>`);
                }
                else if (x == 8 && (y == 3 || y == 6)) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${whiteCoins.bishop.coin} class="gridItems"> ${whiteCoins.bishop.code} </div>`);
                }
                else if (x == 1 && (y == 4)) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${blackCoins.king.coin} class="gridItems"> ${blackCoins.king.code} </div>`);
                }
                else if (x == 8 && (y == 4)) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${whiteCoins.king.coin} class="gridItems"> ${whiteCoins.king.code} </div>`);
                }
                else if (x == 1 && (y == 5)) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${blackCoins.queen.coin} class="gridItems"> ${blackCoins.queen.code} </div>`);
                }
                else if (x == 8 && (y == 5)) {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = ${whiteCoins.queen.coin} class="gridItems"> ${whiteCoins.queen.code} </div>`);
                }
                else {
                    $('.chessBoardContainer').append(`<div id="${id}" data-coin = "" class="gridItems"></div>`);
                }
            }
        }
        boardCustomize(theme);
        startPosition = getAllPosition();
        prevBoard = startPosition;
        loader('inactive');
    }

    function emptyBoard() {
        $('.chessBoardContainer').html('');
        for (var x = 1; x <= 8; x++) {
            for (let y = 1; y <= 8; y++) {
                id = "box-" + (x + "" + y)
                $('.chessBoardContainer').append(`<div id="${id}" data-coin = "" class="gridItems"></div>`);
            }
        }
        boardCustomize(theme);
    }
    var prevBoard;
    function setBoard(boardSet) {
        var good = 0;
        $(prevBoard).each((key, val) => {
            $(boardSet).each((reskey, resval) => {
                if (resval.id == val.id && resval.coin == val.coin) {
                    good += 1;
                }
            })
        })
        loader('inactive');
        if (!(good == boardSet.length && good == prevBoard.length && prevBoard.length == boardSet.length)) {
            emptyBoard()
            $(boardSet).each((key, val) => {
                $(`#box-${val.id}`).attr('data-coin', `${val.coin}`).html(coinToCode[val.coin]);
            })
            prevBoard = boardSet;
        }
    }


    // screen matching to the window size
    $(window).on('resize', (e) => {
        boardCustomize();
    })

    // function to custemize the board and theme

    function boardCustomize(theme = { "change": false }, count = 12) {
        var width = $(window).width();
        var height = $(window).height();
        if (width > height) {
            size = height / count;
            biggerValue = width;
        } else {
            size = width / count;
            biggerValue = height;
        }
        // main board placement
        background = ((count - 1) * size) + "px" + " " + ((count - 1) * size) + "px";
        container = (((count * 0.8333) * size) + "" + "px");
        font = (size * 0.8) + "" + "px";
        bottom = ((height / 2) - (10 * size / 2)) + 'px';
        left = ((width / 2) - (10 * size / 2)) + 'px';
        $('.gridItems').css({ "width": size, "height": size, "font-size": font });
        $('.container').css({ "width": container, "height": container, "padding": size, "background-size": background, "bottom": bottom, "left": left });

        userTabSize = (biggerValue - (size * count)) / 2.5;
        if (userTabSize > (7 * size)) {
            userTabSize = 7 * size;
        }
        //user tab and history placement
        $('.user,.history').css({ "width": userTabSize, "height": userTabSize })

        if (biggerValue == width && userTabSize >= 200) {
            $('.users').css({ "flex-direction": "column" });
            if ((10 * size) > userTabSize) {
                newHeight = (((10 * size) / userTabSize) * 0.7) * userTabSize;
                $('.user,.history').css({ "width": userTabSize, "height": newHeight })
            }
            ypos = `calc(50vh - ${newHeight / 2}px)`;
            otherSide = `calc(100vw - ${userTabSize + size}px)`
            $('.user').css({ "left": size, "top": ypos, "right": otherSide, "bottom": ypos, "display": "block" });
            $('.history').css({ "right": size, "top": ypos, "left": otherSide, "bottom": ypos, "display": "block" });
        } else if (biggerValue == height && userTabSize >= 100) {
            $('.users').css({ "flex-direction": "row" });
            if ((10 * size) > userTabSize) {
                newWidth = (((10 * size) / userTabSize) * 0.7) * userTabSize;
                $('.user,.history').css({ "width": newWidth, "height": userTabSize })
            }
            xpos = `calc(50vw - ${newWidth / 2}px)`;
            extraGap = 1.8 * size
            otherSide = `calc(100vh - ${userTabSize + extraGap}px)`
            $('.user').css({ "left": xpos, "bottom": extraGap, "right": xpos, "top": otherSide, "display": "block" });
            $('.history').css({ "left": xpos, "top": extraGap, "right": xpos, "bottom": otherSide, "display": "block" });
        }
        else {
            $('.user,.history').css({ "display": "none" })
        }

        // theme change
        if (theme.change) {
            for (var x = 1; x <= 8; x++) {
                for (let y = 1; y <= 8; y++) {
                    id = "#box-" + (x + "" + y)
                    if ((x + y) % 2 == 0) {
                        $(id).css({ "background-color": theme.darkcolor });
                    } else {
                        $(id).css({ "background-color": theme.lightcolor });
                    }
                }
            }
            if (theme.bgImage) {
                $('.user,.history').css({ "background-image": theme.bgImage })
            }
            themeChange(theme);
            rotateBoard(playerSide)
        }
    }

    function themeChange(data) {
        assignCSSval()
    }

    // function to rotate the board
    function rotateBoard(side) {
        if (side == 'white') {
            $('.container').css({ 'transform': `rotate(0deg)` });
            $('.gridItems').css({ 'transform': `rotate(0deg)` });
        } else {
            $('.container').css({ 'transform': `rotate(180deg)` });
            $('.gridItems').css({ 'transform': `rotate(180deg)` });

        }
        setTimeout(() => {
            $('.gridItems').css({ "transition": "0.5s all" });
            $('.container').css({ "transition": "0.5s all" });
        }, 3000)
    }
    function pawnChanger(side, posi) {
        if (side == 'white') {
            var pawnChanger = ['wq', 'wr', 'wb', 'wh']
        } else {
            var pawnChanger = ['bq', 'br', 'bb', 'bh']
        }
        $(pawnChanger).each((key, val) => {
            console.log(coinToCode, 'pawn')
            $('.pawnChange').css({ 'visibility': 'visible', "font-size": font }).append(`<div class='coinsChange' data-pos="${posi}" data-coin="${val}">${coinToCode[val]}</div>`);
        })
    }
    // coinsChange
    $('.pawnChange').on('click', '.coinsChange', (e) => {
        let pos = $(e.target)[0].dataset.pos;
        let coin = $(e.target)[0].dataset.coin;
        console.log(pos, coin, "sdfd")
        $(`#box-${pos}`).attr('data-coin', `${coin}`).html(coinToCode[coin]);
        $('.pawnChange').css({ 'visibility': 'hidden' }).html("")
    });







    // Input of user
    $('.startGame ').on('click', () => {
        $('.white,.black').css({ 'display': 'block' });
        $('.sideTitle').text('Select side')
        $('.startGame,.joinGame,codeForJoin,.start').css({ 'display': 'none' });
    })
    $('.white,.black').on('click', (e) => {
        $('.sideTitle').text('Enter Code')
        // $('.codeForJoin,.setCode').css({ 'display': 'block' });
        $('.startGame,.joinGame,.start,.white,.black').css({ 'display': 'none' });
        $('.message').text('Share code to the other player to join!')
        userSide = $(e.target)[0].dataset.type;
        setTheme(startPosition, userSide)
        loader('active');
    })

    var gameId;
    var gameStartBy;
    function setTheme(startPosition, userSide, theme) {
        let blackTheme, whiteTheme
        if (userSide == 'black') {
            myMove = false;
            whiteTheme = theme;
            playerSide = 'black';
        } else {
            myMove = true;
            playerSide = 'white';
            whiteTheme = theme;
        }
        rotateBoard(playerSide);
        req = { board: startPosition, currentUser: 'white', blackTheme: blackTheme, whiteTheme: whiteTheme, gameStartBy: userSide };
        apiRequest('setTheme', req).then((data) => {
            theme = data;
            console.log(theme)
            gameId = data.gameId;
            $('.codeForJoin,.setCode').css({ 'display': 'block' });
            loader('inactive');
            // boardCustomize(data);
        });
    }

    $('.setCode').on('click', () => {
        var userCode = $('.codeForJoin').val();
        $('.codeForJoin').val('');
        if (userCode == "") {
            myAlert("Please enter the code", 1000);
            return;
        } else {
            $('.sideTitle').text('Share Code')
            $('.codeForJoin,.sideContainer,.setCode').css({ 'display': 'none' });

            setcode(gameId, gameId + '#' + userCode);
        }
    })
    var gameCode;
    function setcode(gameId, code) {
        req = { gameId: gameId, activate: code, openToUse: 'Y' };
        apiRequest('setcode', req).then((data) => {
            $('.message').text(`Your game code is "${code}"`)
            $('.sideContainer,.okbtn').css({ 'display': 'block' });
        });
        gameCode = code;

    }
    $('.okbtn').on('click', () => {
        $('.sideContainer').css({ 'display': 'none' });
        $('.finalCode').text(`Your game code is '${gameCode}'`)
        checkForChanges()

    })
    $('.joinGame ').on('click', () => {
        $('.white,.black,.startGame,.joinGame').css({ 'display': 'none' });
        $('.sideTitle').text('Enter Code')
        $('.message').text('Code is created by game starting user!')
        $('.codeForJoin,.start').css({ 'display': 'block' });
    })
    $('.start').on('click', () => {
        var userCode = $('.codeForJoin').val();
        $('.codeForJoin').val('');
        if (userCode == "") {
            myAlert("Please enter the code", 1000, 10);
            return;
        }
        fetchTheme(userCode)
    })
    function fetchTheme(code) {
console.log(theme,'settheme');

        gameId = code.split('#')[0];
        gameCode = code;
        req = { gameId: gameId, activate: code };
        apiRequest('fetchTheme', req).then((data) => {
            // console.log(data);
            if (data.valid) {
                $('.sideContainer').css({ 'display': 'none' });
                theme.active = data.currentUser;
                playerSide = data.currentUser;

                if (theme.active == 'black') {
                    myMove = false;
                    gameStartBy = 'white';
                } else {
                    myMove = true;
                    gameStartBy = 'black';
                }
                rotateBoard(theme.active);
                checkForChanges()
            } else {
                myAlert("Invalid code", 1000, 10);
            }
        });
    }
    window.onbeforeunload = function () {
        return "Dude, are you sure you want to leave? Think of the kittens!";
    }
    // MAJOR CODE STARTS FROM HERE
    // coin moving function
    var boardData;

    function checkForChanges() {

        setInterval(() => {
            console.log(theme.active,'active');
            console.log(playerSide,'playerSide');

            req = { gameId: gameId };
            apiRequest('getApprove', req).then((data) => {
                if (data.currentUser == playerSide) {
                    myMove = true;
                    boardData = data.board;
                    $('.runningMessage').text('Your Move!')
                    myAlert(`Your Move!`, 1000, 15000);
                } else {
                    // loader('active');
                    $('.runningMessage').text('Opponent is playing!')
                    myAlert(`Opponent move!`, 1000, 15000);
                    myMove = false;
                }
                setBoard(JSON.parse(boardData));
                
                newAllPos = getAllPosition();
                checkCalculation(newAllPos);
            })
        }, 5000)
    }

    function pawnExchangeCheck(previousMove, coinPos) {
        if (previousMove.coin == 'wp') {
            if (coinPos < 19 && coinPos > 10) {
                pawnChanger('white', coinPos)
            }
        }
        if (previousMove.coin == 'bp') {
            if (coinPos < 89 && coinPos > 80) {
                pawnChanger('black', coinPos)
            }
        }
    }
    function winnerCalculation(clicked) {
        console.log(clicked, 'winnnn');
        if (clicked.coin == 'wk') {
            if (theme.active == 'black') {
                finish('You won the match!')
                return false;

            } else {
                finish('Opponent won the match!')
                return false;
            }
        }
        if (clicked.coin == 'bk') {
            if (theme.active == 'white') {
                finish('You won the match!')
                return false;
            } else {
                finish('Opponent won the match!')
                return false;
            }
        }
        return true;
    }
    function finish(val) {
        $('.Centeralert').css({ 'visibility': 'visible', 'transform': 'translateY(-40vh)' }).html(val);
        $('.CenteralertCon').css({'display':'block'})
    }
    $('.chessBoardContainer').on('click', '.gridItems', (e) => {
        $('.gridItems').removeClass('availableMoves attackMoves activeCoin');
        var clicked = clickedCoin(e);
        var coinPos = clicked.position;
        var allPosition = getAllPosition();
        var coinWithId = coinsWithId();
        if (myMove) {
            if (previousMove.move.includes(coinPos) && previousMove.valid) {
                $(`#box-${previousMove.posi}`).attr('data-coin', "").html("");
                $(`#box-${coinPos}`).attr('data-coin', `${previousMove.coin}`).html(coinToCode[previousMove.coin]);
                // pawnChanger('white', 77);
                previousMove.valid = false;
                pawnExchangeCheck(previousMove, coinPos)
                // API HIT TO SAVE CHANGES
                allPosition = getAllPosition();
                req = { board: allPosition, currentUser: theme.active, gameId: gameId, activate: gameCode };
                apiRequest('move', req).then((data) => {
                    myMove = false;
                    boardData = data.board;
                }).then(() => {
                    setBoard(JSON.parse(boardData));
                });
                
                newAllPos = getAllPosition();
                checkCalculation(newAllPos);
                preAlert = 0;
            } else if (previousMove.attack.includes(coinPos) && previousMove.valid) {
                $(`#box-${previousMove.posi}`).attr('data-coin', "").html("");
                $(`#box-${coinPos}`).attr('data-coin', `${previousMove.coin}`).html(coinToCode[previousMove.coin]);
                previousMove.valid = false;
                if (winnerCalculation(clicked)) {
                    pawnExchangeCheck(previousMove, coinPos)
                }
                // API HIT TO SAVE CHANGES
                allPosition = getAllPosition();
                req = { board: allPosition, currentUser: theme.active, gameId: gameId, activate: gameCode };
                apiRequest('move', req).then((data) => {
                    myMove = false;
                    boardData = data.board;
                }).then(() => {
                    setBoard(JSON.parse(boardData));
                });
                
                newAllPos = getAllPosition();
                checkCalculation(newAllPos);
                preAlert = 0;
            } else {
                let clickedCoinMoves = calculateAttAndMove(clicked, allPosition, coinWithId, false)
                if (clickAlert(clicked)) {
                    $(`#box-${coinPos}`).addClass('activeCoin');
                    Object.entries(clickedCoinMoves).forEach((arr) => {
                        addClassName = (arr[0] == 'moves') ? "availableMoves" : "attackMoves";
                        $(arr[1]).each((key, val) => {
                            $(`#box-${val}`).addClass(addClassName);
                        })
                    })
                    previousMove.valid = true;
                    previousMove.posi = clicked.position;
                    previousMove.coin = clicked.coin;
                    previousMove.move = clickedCoinMoves.moves;
                    previousMove.attack = clickedCoinMoves.attack;
                }
                newAllPos = getAllPosition();
                checkCalculation(newAllPos);
            }
        } else {
            myAlert(`Opponent move!`, 2000);
        }
    });

    // to get details about clicked coin
    function clickedCoin(e) {
        let clicked = {};
        $('.gridItems').removeClass('activeCoin');
        clicked['coin'] = $(e.target)[0].dataset.coin;
        clicked['position'] = parseInt(($(e.target)[0].id).slice(4, $(e.target)[0].id.length));
        if ((clicked.coin).length > 0) {
            if (previousMove.lastclick == "" || clicked.position != previousMove.lastclick) {
                $(e.target).addClass('activeCoin');
            }

        } else {
            if (previousMove.lastclick == "" || clicked.position != previousMove.lastclick) {
                $(e.target).addClass('activeCoin');
            }
        }
        return clicked;
    }

    // to get all the current position of coins
    function getAllPosition() {
        allPosition = [];
        a = $('.gridItems').each((key, val) => {
            if ($(val)[0].dataset.coin != "") {
                tempVal = { 'id': parseInt((val.id).slice(4, val.id.length)), 'coin': `${$(val)[0].dataset.coin}` };
                allPosition.push(tempVal);
            }
        })
        return allPosition;
    }
    // to get all the current position of coins
    function coinsWithId() {
        allPosition = {};
        a = $('.gridItems').each((key, val) => {
            if ($(val)[0].dataset.coin != "") {
                allPosition[parseInt((val.id).slice(4, val.id.length))] = `${$(val)[0].dataset.coin}`;
            }
        })
        return allPosition;
    }

    function lastVal(num, operator, coinPos, index) {
        let calc = eval(coinPos + ` ${operator} ` + (num * index));
        // console.log(coinPos + ` ${operator} ` + (num*index));
        if (calc % 10 == 0) {
            lastnum = 0;
        } else {
            lastnum = parseInt((calc / 10).toString().split('.')[1]);
        }
        return lastnum;
    }

    // user alert
    function clickAlert(clicked) {
        if (playerSide == "white") {
            if (bc.includes(clicked.coin)) {
                myAlert(`Your Coin is ${theme.active}!`, 2000);
                return false;
            }
        }
        if (playerSide == "black") {
            if (wc.includes(clicked.coin)) {
                myAlert(`Your Coin is ${theme.active}!`, 2000);
                return false;
            }
        }
        return true;
    }


    // coinColorBasedPosition
    function coinColorBasedPosition(allPosition, color) {
        var whiteCoinPositions = [], blackCoinPositions = [];

        $(allPosition).each((key, val) => {
            if (val.coin.slice(0, 1) == "w") {
                whiteCoinPositions.push(val.id);
            } else if (val.coin.slice(0, 1) == "b") {
                blackCoinPositions.push(val.id);
            }
        })

        if (color == 'white') {
            return whiteCoinPositions;
        }

        if (color == 'black') {
            return blackCoinPositions;
        }
    }



    function calculateAttAndMove(clicked, allPosition, coinWithId, allState = false, attackOnly = false) {
        let posMove = [];
        let posAttack = [];
        var coinPos = clicked.position;
        var output = {};

        whiteCoinPositions = coinColorBasedPosition(allPosition, 'white')
        blackCoinPositions = coinColorBasedPosition(allPosition, 'black')
        // moves for queen rook bishop
        var queen = [];
        var w_q_Att = [];
        var b_q_Att = [];
        var rook = [];
        var w_r_Att = [];
        var b_r_Att = [];
        var bishop = [];
        var w_b_Att = [];
        var b_b_Att = [];
        var topLeft = topFlag = topRight = right = botRight = bottom = botLeft = left = true;
        var topLeftBlaAtt = topLeftWhiAtt = topBlaAtt = topWhiAtt = topRightWhiAtt = topRightBlaAtt = rightBlaAtt = rightWhiAtt = botRightBlaAtt = botRightWhiAtt = bottomBlaAtt = bottomWhiAtt = botLeftWhiAtt = botLeftBlaAtt = leftBlaAtt = leftWhiAtt = true;
        for (let x = 1; x <= 8; x++) {
            var topLeftVal = topVal = topRightVal = rightVal = botRightVal = bottomVal = botLeftVal = leftVal = undefined;

            if (topLeft) {
                let targetPos = (coinPos - 9 * x);
                var lastnum = lastVal(9, "-", coinPos, x);
                var existCoin = coinWithId[targetPos];
                var blockCoin = allCoins.includes(existCoin);
                if (wc.includes(existCoin) && topLeftWhiAtt) {
                    b_q_Att.push(targetPos)
                    b_b_Att.push(targetPos)
                    topLeftWhiAtt = false;
                }
                if (bc.includes(existCoin) && topLeftBlaAtt) {
                    w_q_Att.push(targetPos)
                    w_b_Att.push(targetPos)
                    topLeftBlaAtt = false;
                }
                if (lastnum <= 8 && lastnum > 0 && targetPos >= 11 && targetPos <= 88 && !blockCoin) {
                    var topLeftVal = targetPos;
                } else {
                    topLeft = false;
                }
            }
            if (topFlag) {
                let targetPos = (coinPos - 10 * x);
                var lastnum = lastVal(10, "-", coinPos, x);
                var existCoin = coinWithId[targetPos];
                var blockCoin = allCoins.includes(existCoin);
                if (wc.includes(existCoin) && topWhiAtt) {
                    b_q_Att.push(targetPos)
                    b_r_Att.push(targetPos)
                    topWhiAtt = false;
                }
                if (bc.includes(existCoin) && topBlaAtt) {
                    w_q_Att.push(targetPos)
                    w_r_Att.push(targetPos)
                    topBlaAtt = false;
                }
                if (lastnum <= 8 && lastnum > 0 && targetPos >= 11 && targetPos <= 88 && !blockCoin) {
                    var topVal = targetPos;
                } else {
                    topFlag = false;
                }
            }
            if (topRight) {
                let targetPos = (coinPos - 11 * x);
                var lastnum = lastVal(11, "-", coinPos, x);
                var existCoin = coinWithId[targetPos];
                var blockCoin = allCoins.includes(existCoin);

                if (wc.includes(existCoin) && topRightWhiAtt) {
                    b_q_Att.push(targetPos)
                    b_b_Att.push(targetPos)
                    topRightWhiAtt = false
                }
                if (bc.includes(existCoin) && topRightBlaAtt) {
                    w_q_Att.push(targetPos)
                    w_b_Att.push(targetPos)
                    topRightBlaAtt = false;
                }
                if (lastnum <= 8 && lastnum > 0 && targetPos >= 11 && targetPos <= 88 && !blockCoin) {
                    var topRightVal = targetPos;
                } else {
                    topRight = false
                }
            }

            if (right) {
                let targetPos = (coinPos + 1 * x);
                var lastnum = lastVal(1, "+", coinPos, x);
                var existCoin = coinWithId[targetPos];
                var blockCoin = allCoins.includes(existCoin);

                if (wc.includes(existCoin) && rightWhiAtt) {
                    b_q_Att.push(targetPos)
                    b_r_Att.push(targetPos)
                    rightWhiAtt = false;
                }
                if (bc.includes(existCoin) && rightBlaAtt) {
                    w_q_Att.push(targetPos)
                    w_r_Att.push(targetPos)
                    rightBlaAtt = false
                }
                if (lastnum <= 8 && lastnum > 0 && targetPos >= 11 && targetPos <= 88 && !blockCoin) {
                    var rightVal = targetPos;
                } else {
                    right = false
                }
            }

            if (botRight) {
                let targetPos = (coinPos + 11 * x);
                var lastnum = lastVal(11, "+", coinPos, x);
                var existCoin = coinWithId[targetPos];
                var blockCoin = allCoins.includes(existCoin);

                if (wc.includes(existCoin) && botRightWhiAtt) {
                    b_q_Att.push(targetPos)
                    b_b_Att.push(targetPos)
                    botRightWhiAtt = false
                }
                if (bc.includes(existCoin) && botRightBlaAtt) {
                    w_q_Att.push(targetPos)
                    w_b_Att.push(targetPos)
                    botRightBlaAtt = false
                }
                if (lastnum <= 8 && lastnum > 0 && targetPos >= 11 && targetPos <= 88 && !blockCoin) {
                    var botRightVal = targetPos;
                } else {
                    botRight = false
                }
            }
            if (bottom) {
                let targetPos = (coinPos + 10 * x);
                var lastnum = lastVal(10, "+", coinPos, x);
                var existCoin = coinWithId[targetPos];
                var blockCoin = allCoins.includes(existCoin);

                if (wc.includes(existCoin) && bottomWhiAtt) {
                    b_q_Att.push(targetPos)
                    b_r_Att.push(targetPos)
                    bottomWhiAtt = false
                }
                if (bc.includes(existCoin) && bottomBlaAtt) {
                    w_q_Att.push(targetPos)
                    w_r_Att.push(targetPos)
                    bottomBlaAtt = false
                }
                if (lastnum <= 8 && lastnum > 0 && targetPos >= 11 && targetPos <= 88 && !blockCoin) {
                    var bottomVal = targetPos;
                } else {
                    bottom = false
                }
            }

            if (botLeft) {
                let targetPos = (coinPos + 9 * x);
                var lastnum = lastVal(9, "+", coinPos, x);
                var existCoin = coinWithId[targetPos];
                var blockCoin = allCoins.includes(existCoin);

                if (wc.includes(existCoin) && botLeftWhiAtt) {
                    b_q_Att.push(targetPos)
                    b_b_Att.push(targetPos)
                    botLeftWhiAtt = false
                }
                if (bc.includes(existCoin) && botLeftBlaAtt) {
                    w_q_Att.push(targetPos)
                    w_b_Att.push(targetPos)
                    botLeftBlaAtt = false
                }
                if (lastnum <= 8 && lastnum > 0 && targetPos >= 11 && targetPos <= 88 && !blockCoin) {
                    var botLeftVal = targetPos;
                } else {
                    botLeft = false
                }
            }
            if (left) {
                let targetPos = (coinPos - 1 * x);
                var lastnum = lastVal(1, "-", coinPos, x);
                var existCoin = coinWithId[targetPos];
                var blockCoin = allCoins.includes(existCoin);

                if (wc.includes(existCoin) && leftWhiAtt) {
                    b_q_Att.push(targetPos)
                    b_r_Att.push(targetPos)
                    leftWhiAtt = false
                }
                if (bc.includes(existCoin) && leftBlaAtt) {
                    w_q_Att.push(targetPos)
                    w_r_Att.push(targetPos)
                    leftBlaAtt = false
                }
                if (lastnum <= 8 && lastnum > 0 && targetPos >= 11 && targetPos <= 88 && !blockCoin) {
                    var leftVal = targetPos;
                } else {
                    left = false
                }
            }
            queen.push(topLeftVal, topVal, topRightVal, rightVal, botRightVal, bottomVal, botLeftVal, leftVal);
            rook.push(topVal, rightVal, bottomVal, leftVal);
            bishop.push(topLeftVal, topRightVal, botRightVal, botLeftVal)
        }

        // moves for white pawn
        let w_p_Att = [];
        let w_p_Mov = [];
        var targetPos1 = (coinPos - 9);
        var targetPos2 = (coinPos - 11);
        var existCoin1 = coinWithId[targetPos1];
        var existCoin2 = coinWithId[targetPos2];

        (bc.includes(existCoin1)) ? w_p_Att.push(targetPos1) : "";
        (bc.includes(existCoin2)) ? w_p_Att.push(targetPos2) : "";
        if (coinPos < 79 && coinPos > 70) {
            let targetPos1 = (coinPos - 10);
            let targetPos2 = (coinPos - 20);
            var existCoin1 = coinWithId[targetPos1];
            var existCoin2 = coinWithId[targetPos2];
            var blockCoin = allCoins.includes(existCoin1);

            !(allCoins.includes(existCoin1)) ? w_p_Mov.push(targetPos1) : "";
            (!allCoins.includes(existCoin2) && !blockCoin) ? w_p_Mov.push(targetPos2) : "";
        } else {
            var targetPos = (coinPos - 10);
            var existCoin = coinWithId[targetPos];
            !(allCoins.includes(existCoin)) ? w_p_Mov.push(targetPos) : "";
        }
        // unsetting all used variables
        targetPos1 = targetPos2 = targetPos = existCoin1 = existCoin2 = existCoin = blockCoin = undefined;


        // moves for black pawn
        let b_p_Att = [];
        let b_p_Mov = [];
        var targetPos1 = (coinPos + 9);
        var targetPos2 = (coinPos + 11);
        var existCoin1 = coinWithId[targetPos1];
        var existCoin2 = coinWithId[targetPos2];

        (wc.includes(existCoin1)) ? b_p_Att.push(targetPos1) : "";
        (wc.includes(existCoin2)) ? b_p_Att.push(targetPos2) : "";
        if (coinPos < 29 && coinPos > 20) {
            let targetPos1 = (coinPos + 10);
            let targetPos2 = (coinPos + 20);
            var existCoin1 = coinWithId[targetPos1];
            var existCoin2 = coinWithId[targetPos2];
            var blockCoin = allCoins.includes(existCoin1);

            !(allCoins.includes(existCoin1)) ? b_p_Mov.push(targetPos1) : "";
            (!allCoins.includes(existCoin2) && !blockCoin) ? b_p_Mov.push(targetPos2) : "";
        } else {
            var targetPos = (coinPos + 10);
            var existCoin = coinWithId[targetPos];
            !(allCoins.includes(existCoin)) ? b_p_Mov.push(targetPos) : "";
        }
        // unsetting all used variables
        targetPos1 = targetPos2 = targetPos = existCoin1 = existCoin2 = existCoin = blockCoin = undefined;


        // moves for king

        var targetPostions = [(coinPos + 1), (coinPos - 1), (coinPos + 10), (coinPos - 10), (coinPos + 9), (coinPos - 9), (coinPos + 11), (coinPos - 11)];
        let w_k_Att = [];
        let king = [];
        let b_k_Att = [];
        $(targetPostions).each((key, targetPos) => {
            if (allPositionId.includes(targetPos)) {
                var existCoin = coinWithId[targetPos];
                if (bc.includes(existCoin)) {
                    w_k_Att.push(targetPos);
                }
                if (wc.includes(existCoin)) {
                    b_k_Att.push(targetPos);
                }
                if (!allCoins.includes(existCoin)) {
                    king.push(targetPos);
                }
            }
        })
        // unsetting all used variables
        targetPostions = targetPos = existCoin = undefined;


        // moves for knight

        var targetPostions = [(coinPos + 21), (coinPos - 21), (coinPos + 19), (coinPos - 19), (coinPos + 8), (coinPos - 8), (coinPos + 12), (coinPos - 12)];
        let w_h_Att = [];
        let knight = [];
        let b_h_Att = [];
        $(targetPostions).each((key, targetPos) => {
            if (allPositionId.includes(targetPos)) {
                var existCoin = coinWithId[targetPos];
                if (bc.includes(existCoin)) {
                    w_h_Att.push(targetPos);
                }
                if (wc.includes(existCoin)) {
                    b_h_Att.push(targetPos);
                }
                if (!allCoins.includes(existCoin)) {
                    knight.push(targetPos);
                }
            }
        })
        // unsetting all used variables
        targetPostions = targetPos = existCoin = undefined;



        queen = removeUndefined(queen);
        rook = removeUndefined(rook);
        bishop = removeUndefined(bishop);
        king = removeUndefined(king);
        knight = removeUndefined(knight);

        if (!allState) {
            switch (clicked.coin) {
                case "wq":
                    posAttack = w_q_Att;
                    posMove = queen;
                    break;
                case "wr":
                    posAttack = w_r_Att;
                    posMove = rook;
                    break;
                case "wb":
                    posAttack = w_b_Att;
                    posMove = bishop;
                    break;
                case "bq":
                    posAttack = b_q_Att;
                    posMove = queen;
                    break;
                case "br":
                    posAttack = b_r_Att;
                    posMove = rook;
                    break;
                case "bb":
                    posAttack = b_b_Att;
                    posMove = bishop;
                    break;
                case "wk":
                    posAttack = w_k_Att;
                    posMove = king;
                    break;
                case "wh":
                    posAttack = w_h_Att;
                    posMove = knight;
                    break;
                case "wp":
                    posAttack = w_p_Att;
                    posMove = w_p_Mov;
                    break;
                case "bk":
                    posAttack = b_k_Att;
                    posMove = king;
                    break;
                case "bh":
                    posAttack = b_h_Att;
                    posMove = knight;
                    break;
                case "bp":
                    posAttack = b_p_Att;
                    posMove = b_p_Mov;
                    break;
            }
            output['attack'] = posAttack;
            output['moves'] = posMove;
            // console.log(output, "move");
            return output;
        } else {

            let allStateObj = {};
            let attackOnly = {};
            attackOnly = {
                "wqa": w_q_Att,
                "bqa": b_q_Att,
                "wka": w_k_Att,
                "bka": b_k_Att,
                "wra": w_r_Att,
                "bra": b_r_Att,
                "wba": w_b_Att,
                "bba": b_b_Att,
                "wha": w_h_Att,
                "bha": b_h_Att,
                "wpa": w_p_Att,
                "bpa": b_p_Att,
            }
            output['attackOnly'] = attackOnly;
            allStateObj = {
                "wqa": w_q_Att,
                "bqa": b_q_Att,
                "wka": w_k_Att,
                "bka": b_k_Att,
                "wra": w_r_Att,
                "bra": b_r_Att,
                "wba": w_b_Att,
                "bba": b_b_Att,
                "wha": w_h_Att,
                "bha": b_h_Att,
                "wpa": w_p_Att,
                "bpa": b_p_Att,
                "queen": queen,
                "king": king,
                "rook": rook,
                "bishop": bishop,
                "knight": knight,
                "wpm": w_p_Mov,
                "bpm": b_p_Mov,
            }

            output['allState'] = allStateObj;
            // console.log(output, "move");
            return output;
        }
    }
    function removeUndefined(val) {
        newVal = val.filter(function (element) {
            return element !== undefined;
        });
        return newVal
    }


    function checkCalculation(allCoinPosition) {
        var wkp, bkp;
        $(allCoinPosition).each((key, val) => {
            if (val.coin == 'wk') {
                wkp = val.id;
            }
            if (val.coin == 'bk') {
                bkp = val.id;
            }
        })
        if (wkp == undefined || bkp == undefined) {
            console.log('game over')
            finish('Game Over')
        }
        console.log(wkp,bkp,'kings')
        $(allCoinPosition).each((key, val) => {
            var currentCoin = { coin: val.coin, position: val.id };
            var coinWithId = coinsWithId();
            var checkMoves = calculateAttAndMove(currentCoin, allCoinPosition, coinWithId, true);
            Object.entries(checkMoves.attackOnly).forEach((data) => {
                if (data[0] == currentCoin.coin + 'a') {
                    if (data[1].includes(wkp) && data[0].slice(0, 1) == 'b') {
                        check('white')
                        checkMateCalculation(allCoinPosition, coinWithId);
                        return false;
                    }
                    if (data[1].includes(bkp) && data[0].slice(0, 1) == 'w') {
                        check('black')
                        return false;
                    }
                }

            })
        })
        return false;
    }
    function check(val) {
        console.log(`Check for ${val} king!`);
        myAlert(`Check!!! ${val} king is in danger!`, 2000, 10);
    }
});
