let playedTimes = 0;
localStorage.setItem("completeCards", JSON.stringify(cards));
const activeCards = JSON.parse(localStorage.getItem("completeCards"));
const handHeirarchy = ["high-card", "pair", "two-pairs", "three-of-a-kind", "straight", "flush", "full-house", "four-of-a-kind", "straight-flush", "royal-flush"];
const cardHeirarchy = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"];
const suitArr = ["diamonds", "hearts", "clubs", "spades"];
const playersDetails = ["playerHandDetails", "playerTwoHandDetails", "playerThreeHandDetails", "playerFourHandDetails"];
const playerIds = ["playerCards", "playerTwoCards", "playerThreeCards", "playerFourCards"];
const gameStepHierarchy = ["zeroPlaceholder", "pre flop", "flop", "turn", "river"];
let usedCardsArr = [];

let player0Obj;
let player1Obj;
let player2Obj;
let player3Obj;
const playersHands = [player0Obj, player1Obj, player2Obj, player3Obj];
//let bestHandIndex = 0;
let resultList = [0, 0, 0, 0];
let compareCards = [0, 0, 0, 0];
let activePlayers = [0, 1, 2, 3];
let playerHighCards = [0, 0, 0, 0];
let topHand;
const plyr = "<i class='fas fa-user'></i> ";
const yourDetails = document.querySelector("[data-player='0']");
const messageElement = document.getElementById("message");
let communityCards = [];
let thePot = 0;
let playerMoney = 500;/*DOES NOT RESET AT DEAL*/
if (localStorage.getItem("balance") && Number(localStorage.getItem("balance"))) {
    playerMoney = Number(localStorage.getItem("balance"));
}
document.querySelector("#playerMoney").innerHTML = playerMoney;
let bet = 0;
let gameIncrement = 1;
let monetaryVal = [10, 25, 35, 45, 50];

function setPlayerMoney(passPlayerMoney) {
    playerMoney = passPlayerMoney;
    document.getElementById("playerMoney").innerHTML = passPlayerMoney;
    document.querySelector("#playerMoney").innerHTML = passPlayerMoney;/*SAFARI BUG NEEDS BOTH*/
    localStorage.setItem("balance", passPlayerMoney);
}

function generate(activeCards) {
    return Math.floor(Math.random() * activeCards.length);
}

function getOccurrence(list, value) {/*start how many times number in array*/
    var count = 0;
    list.forEach((v) => (v === value && count++));
    return count;
}

function clear(action) {
    if (action === "fold") {
        document.getElementById("playerHandDetails").classList.add("hide");
        document.getElementById("playerTwoHandDetails").classList.add("hide");
        document.getElementById("playerThreeHandDetails").classList.add("hide");
        document.getElementById("playerFourHandDetails").classList.add("hide");
    }
    document.getElementById("foldBt").classList.add("hide");
    document.querySelector("[data-round='match']").classList.add("hide");
    document.querySelector("[data-round='check']").classList.add("hide");
    document.getElementById("playerFourCards").innerHTML = "";
    document.getElementById("playerThreeCards").innerHTML = "";
    document.getElementById("playerTwoCards").innerHTML = "";
    document.getElementById("playerCards").innerHTML = "";
    document.getElementById("status").classList.add("hide");
    document.querySelector("button[title='Deal']").disabled = false;
    document.querySelector("button[title='Deal']").classList.remove("hide");
    document.getElementById("communityCards").innerHTML = "";

}

function fold() {
    document.getElementById("betTarget").innerHTML = "Folded. You lost $" + bet + ". Place your bet.";
    clear("fold");
    window.location = "#";
}

function youWin(type) {
    if (type === "split") {
        thePot = (thePot / 2);
        document.getElementById("betTarget").innerHTML = "SPLIT POT";
        messageElement.innerHTML = "Split pot. You Won $" + thePot;
    } else {
        messageElement.innerHTML = "You Won $" + thePot;
        document.getElementById("betTarget").innerHTML = "TEXAS HOLDEM";
    }
    document.getElementById("foldBt").classList.add("hide");
    document.querySelector("[data-round='match']").classList.add("hide");
    document.querySelector("[data-round='check']").classList.add("hide");
    document.querySelector("[data-player='0']").classList.remove("alert-info");
    document.querySelector("[data-player='0']").classList.remove("alert-danger");
    document.querySelector("[data-player='0']").classList.add("alert-success");
    document.querySelector("button[title='Deal']").disabled = false;
    document.querySelector("button[title='Deal']").classList.remove("hide");
    yourDetails.classList.remove("alert-info");
    yourDetails.classList.add("alert-success");
    document.querySelector("#notification").classList.remove("alert-info");
    document.querySelector("#status").classList.remove("hide");
    document.getElementById("notification").classList.add("alert-success");

    playerMoney = playerMoney + thePot;
    setPlayerMoney(playerMoney);
    document.getElementById("playerMoney").classList.remove("hide");
    document.querySelector("#playerMoney").innerHTML = playerMoney;
    return false;
}

function youLose(topHand) {
    document.querySelector("[data-player='" + topHand + "']").classList.remove("alert-info");
    document.querySelector("[data-player='" + topHand + "']").classList.add("alert-success");
    document.getElementById("status").classList.remove("hide");
    messageElement.classList.remove("hide");
    messageElement.innerHTML = "You lost $" + bet;
    document.querySelector("[data-player='0']").classList.remove("alert-success");
    document.querySelector("[data-player='0']").classList.remove("alert-info");
    document.querySelector("[data-player='0']").classList.add("alert-danger");
    document.getElementById("notification").classList.remove("alert-success"); document.getElementById("notification").classList.remove("alert-info"); document.getElementById("notification").classList.add("alert-danger");
    document.getElementById("betTarget").innerHTML = "Place your bet.";
    document.querySelector("[data-round='check']").classList.add("hide");
    document.getElementById("foldBt").classList.add("hide");
    document.querySelector("[data-round='match']").classList.add("hide");
    document.querySelector("[data-round='check']").classList.add("hide");
    document.querySelector("button[title='Deal']").disabled = false;
    document.querySelector("button[title='Deal']").classList.remove("hide");
    return false;
}

function removeActivePlyr(plyrID) {
    compareCards[plyrID] = -1;
    resultList[plyrID] = -1;
    let tempActivePlayer = [];
    for (let i = 0; i < activePlayers.length; i++) {
        if (activePlayers[i] !== plyrID) {
            tempActivePlayer.push(activePlayers[i]);
        }
    }
    activePlayers = tempActivePlayer;
    if (activePlayers == 0) {
        youWin("default");
    }

}

function evaluateHand(iteration, gameStep) {
    let stepPlayed = false;
    document.getElementById("communityCardDetails").innerHTML = "<h3>The " + gameStepHierarchy[gameStep] + " - Pot: $" + thePot + "</h3>";
    countingIterations = iteration;
    //bestHandIndex = 0;
    let cardsInvolved = "";
    let cardIndexes = [];
    let cardsArr = [playersHands[iteration][0], playersHands[iteration][1]];
    if (gameStep === 2) {
        cardsArr = [playersHands[iteration][0], playersHands[iteration][1], communityCards[0], communityCards[1], communityCards[2]];
    }
    if (gameStep === 3) {
        cardsArr = [playersHands[iteration][0], playersHands[iteration][1], communityCards[0], communityCards[1], communityCards[2], communityCards[3]];
    }
    if (gameStep === 4) {
        cardsArr = [playersHands[iteration][0], playersHands[iteration][1], communityCards[0], communityCards[1], communityCards[2], communityCards[3], communityCards[4]];
    }
    let highCard;
    let flush = false;
    let straight = false;
    let spades = 0;
    let hearts = 0;
    let diamonds = 0;
    let clubs = 0;
    let two = 0;
    let three = 0;
    let four = 0;
    let five = 0;
    let six = 0;
    let seven = 0;
    let eight = 0;
    let nine = 0;
    let ten = 0;
    let jack = 0;
    let queen = 0;
    let king = 0;
    let ace = 0;
    for (let i = 0; i < cardsArr.length; i++) {
        if (cardHeirarchy.indexOf(cardsArr[i].value) !== null) {
            cardIndexes.push(cardHeirarchy.indexOf(cardsArr[i].value));
        }


        if (cardsArr[i].value === "ace") {
            cardIndexes.push(-1);/*aces need representation for a straight ace to 4 concept. -1 will work because 2 is represented as 0. This is just used for determining a straight*/
        }
        if (cardsArr[i].value === "two") {
            two = two + 1;
        }
        if (cardsArr[i].value === "three") {
            three = three + 1;
        }
        if (cardsArr[i].value === "four") {
            four = four + 1;
        }
        if (cardsArr[i].value === "five") {
            five = five + 1;
        }
        if (cardsArr[i].value === "six") {
            six = six + 1;
        }
        if (cardsArr[i].value === "seven") {
            seven = seven + 1;
        }
        if (cardsArr[i].value === "eight") {
            eight = eight + 1;
        }
        if (cardsArr[i].value === "nine") {
            nine = nine + 1;
        }
        if (cardsArr[i].value === "ten") {
            ten = ten + 1;
        }
        if (cardsArr[i].value === "jack") {
            jack = jack + 1;
        }
        if (cardsArr[i].value === "queen") {
            queen = queen + 1;
        }
        if (cardsArr[i].value === "king") {
            king = king + 1;
        }
        if (cardsArr[i].value === "ace") {
            ace = ace + 1;
        }
        if (cardsArr[i].suit === "spades") {  /*determine same suits*/
            spades = spades + 1;
        }
        if (cardsArr[i].suit === "hearts") {
            hearts = hearts + 1;
        }
        if (cardsArr[i].suit === "diamonds") {
            diamonds = diamonds + 1;
        }
        if (cardsArr[i].suit === "clubs") {
            clubs = clubs + 1;
        }
    }

    cardIndexes = cardIndexes.sort(((a, b) => a - b));
    let connectedTwo = false;
    let connectedThree = false;
    let connectedFour = false;
    for (var i = 0; i < cardIndexes.length; i++) {    /*LOOKING FOR A STRIGHT*/
        if (cardIndexes[i + 1] === cardIndexes[i] + 1) {
            connectedTwo = true;
        }
        if (cardIndexes[i + 1] === cardIndexes[i] + 1 && cardIndexes[i + 2] === cardIndexes[i] + 2) {
            connectedThree = true;
        }
        if (cardIndexes[i + 1] === cardIndexes[i] + 1 && cardIndexes[i + 2] === cardIndexes[i] + 2 && cardIndexes[i + 3] === cardIndexes[i] + 3) {
            connectedFour = true;
        }
        if (cardIndexes[i + 1] === cardIndexes[i] + 1 && cardIndexes[i + 2] === cardIndexes[i] + 2 && cardIndexes[i + 3] === cardIndexes[i] + 3 && cardIndexes[i + 4] === cardIndexes[i] + 4) {
            straight = true;
            if (resultList[iteration] < 4) {
                resultList[iteration] = 4;
                communityCards[iteration] = cardIndexes[i + 4];
            }
        }
    }
    let valueArr = [two, three, four, five, six, seven, eight, nine, ten, jack, queen, king, ace]; /*Determine matching values*/
    let lastIteration = activePlayers[activePlayers.length - 1];
    for (let i = 0; i < valueArr.length; i++) {
        if (valueArr[i] > 0) {//determine highest card
            highCard = cardHeirarchy[i];
            if (gameStep === 1) {
                playerHighCards[iteration] = i;
            }
            if (resultList[iteration] === 0) {
                compareCards[iteration] = valueArr.lastIndexOf(1);
                highCard = " - " + cardHeirarchy[valueArr.lastIndexOf(1)];
            }
            compareCards[iteration] = i;
        }
        if (valueArr[i] === 2) {//a pair
            if (resultList[iteration] < 1) {
                resultList[iteration] = 1;
                compareCards[iteration] = valueArr.lastIndexOf(2);
            }
            cardsInvolved = cardsInvolved + " - " + cardHeirarchy[i] + "s";
        }
        if (valueArr[i] === 3) {//three of a kind
            if (resultList[iteration] < 3) {
                resultList[iteration] = 3;
                compareCards[iteration] = valueArr.lastIndexOf(3);
            }
            cardsInvolved = cardsInvolved + " - " + cardHeirarchy[valueArr.lastIndexOf(3)] + "s";
        }
        if (valueArr[i] === 4) {
            if (resultList[iteration] < 7) {
                resultList[iteration] = 7;
                compareCards[iteration] = valueArr.lastIndexOf(4);
            }
            cardsInvolved = cardsInvolved + " - " + cardHeirarchy[valueArr.lastIndexOf(4)] + "s";
        }
    }
    if (getOccurrence(valueArr, 2) > 1) {//2 pair - if the number 2 occurs more than once
        if (resultList[iteration] < 2) {
            resultList[iteration] = 2;
            compareCards[iteration] = valueArr.lastIndexOf(2);
        }
    }
    if (resultList[iteration] < 4 && straight === true) {//declared earlier as well
        resultList[iteration] = 4;
    }
    let suitedArr = [spades, hearts, diamonds, clubs];
    if (suitedArr.indexOf(5) !== -1) {    /*DETERMINE A flush*/
        flush = true;
        if (resultList[iteration] < 5) {
            resultList[iteration] = 5;
        }
    }
    if (valueArr.indexOf(3) !== -1 && valueArr.indexOf(2) !== -1) {    /*checking for full house*/
        if (resultList[iteration] < 6) {
            resultList[iteration] = 6;
            communityCards[iteration] = valueArr.lastIndexOf(3);
        }
    }
    if (flush === true && straight === true) {/*checking for straight flush*/
        if (resultList[iteration] < 8) {
            resultList[iteration] = 8;
        }
    }

    if (valueArr[8] > 0 && valueArr[9] > 0 && valueArr[10] > 0 && valueArr[11] > 0 && valueArr[12] > 0) {  /*checking for royal flush (valueArr[valueArr.length - 1] is an ace)*/
        if (resultList[iteration] < 9) {
            resultList[iteration] = 9;
        }
    }
    document.getElementById(playersDetails[iteration]).classList.remove("hide");
    let HighCardMessage = "";
    if (resultList[iteration] === 0) {
        HighCardMessage = " - " + cardHeirarchy[valueArr.lastIndexOf(1)];
    }
    if (iteration === 0) {
        document.getElementById(playersDetails[iteration]).innerHTML = "You have: " + handHeirarchy[resultList[iteration]] + "  " + cardsInvolved + HighCardMessage;
        /*browser bug fix*/
        document.querySelector("#" + playersDetails[iteration]).innerHTML = "You have: " + handHeirarchy[resultList[iteration]] + "  " + cardsInvolved + HighCardMessage;
    }
    if (iteration !== 0 && gameStep === 4) {
        document.getElementById(playersDetails[iteration]).innerHTML = plyr + "Player " + (iteration + 1) + ": " + handHeirarchy[resultList[iteration]] + "  " + cardsInvolved + HighCardMessage;
        /*browser bug fix*/
        document.querySelector("#" + playersDetails[iteration]).innerHTML = plyr + "Player " + (iteration + 1) + ": " + handHeirarchy[resultList[iteration]] + "  " + cardsInvolved + HighCardMessage;
    }
    if (gameStep === 4 && iteration === lastIteration) {
        if (getOccurrence(valueArr, 2) > 2) {/*player cannot have 3 pair. Get rid of lowest pair here*/
            for (let i = 0; i < valueArr.length; i++) {
                if (valueArr[i] === 2 && getOccurrence(valueArr, 2) > 2) {
                    valueArr[i] = -2;
                }
            }
        }
        let winningHand = Math.max(...resultList);
        let winningCard;
        if (getOccurrence(resultList, winningHand) === 1) {
            topHand = resultList.indexOf(winningHand);
        } else {

            for (let i = 0; i < resultList.length; i++) {
                if (resultList[i] !== winningHand) {
                    compareCards[i] = -1;
                }
            }
            winningCard = Math.max(...compareCards);
            topHand = compareCards.indexOf(winningCard);
            if (getOccurrence(compareCards, winningCard) > 1) {
                for (let i = 0; i < compareCards.length; i++) {
                    if (compareCards[i] === -1) {
                        playerHighCards[i] = -1;
                    }
                }
                winningCard = Math.max(...playerHighCards);
                topHand = playerHighCards.indexOf(winningCard);

                if (getOccurrence(playerHighCards, winningCard) > 1) {
                    youWin("split");

                }
            }
        }
    }
    let highCardCount = 0;  /*FIRST ROUND*/
    for (let i = 0; i < valueArr.length; i++) {
        if (i > 7 && valueArr[i] > 0) {
            highCardCount = highCardCount + 1;
        }
    }
    /*END OF HAND EVALUATION */
    let firstRoundSuited = false;
    let threeSuited = false;
    let fourSuited = false;
    for (let i = 0; i < suitedArr.length; i++) {/*determine if the first round has match suit*/
        if (suitedArr[i] > 1) {
            firstRoundSuited = true;
        }
        if (suitedArr[i] > 2) {
            threeSuited = true;
        }
        if (suitedArr[i] > 3) {
            fourSuited = true;
        }
    }
    if (stepPlayed === false && activePlayers.indexOf(iteration) !== -1) {

        if (gameStep === 1 && iteration !== 0) {

            if (resultList[iteration] >= 1 || connectedTwo === true || highCardCount > 1 || firstRoundSuited === true || valueArr[12] > 0) {
                document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": bets $" + monetaryVal[gameStep + 1];
                document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
            } else {
                document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": checks.";
                document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";
            }

            if (iteration == lastIteration) {
                if (document.querySelector("[data-status='betting']") !== null) {
                    [].forEach.call(document.querySelectorAll("[data-status='checking']"), function (e) {
                        let whichPlayer = Number(e.getAttribute("data-player"));
                        removeActivePlyr(whichPlayer);
                        e.innerHTML = plyr + " Player " + (whichPlayer + 1) + ": folded.";
                        e.dataset.status = "folded";
                    });
                    document.querySelector("[data-round='match']").classList.remove("hide");
                    document.querySelector("[data-round='check']").classList.add("hide");
                } else {
                    document.querySelector("[data-round='match']").classList.add("hide");
                    document.getElementById("foldBt").classList.add("hide");
                    document.querySelector("[data-round='check']").classList.remove("hide");
                }
                document.querySelector("[data-round='match']").disabled = false;
                document.querySelector("[data-round='check']").disabled = false;
                stepPlayed = true;
                return false;
            }

        }



        if (gameStep === 2 || gameStep === 3) {
            if (gameStep === 2 && iteration !== 0) {
                if (resultList[iteration] >= 1 && valueArr[12] > 0) {
                    if (connectedThree === true || highCardCount > 1 || firstRoundSuited === true) {
                        document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + " Player " + (iteration + 1) + ": bets $" + monetaryVal[gameStep + 1];
                        document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
                    } else {
                        document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + " Player " + (iteration + 1) + ": checks.";
                        document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";
                    }
                }
            }
            if (gameStep === 3 && iteration !== 0) {
                if (connectedThree === true || connectedFour > 1 || threeSuited === true || fourSuited === true) {
                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": bets $" + monetaryVal[gameStep + 1];
                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
                } else {
                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": checks.";
                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";
                }
            }/*broke up conditionals to help the javascript process*/
            if (iteration === lastIteration && iteration !== 0) {
                if (document.querySelector("[data-status='betting']") !== null) {
                    [].forEach.call(document.querySelectorAll("[data-status='checking']"), function (e) {
                        let whichPlayer = e.getAttribute("data-player");
                        removeActivePlyr(whichPlayer);
                        e.innerHTML = "Player " + (Number(whichPlayer) + 1) + ": folded.";
                        e.dataset.status = "folded";
                    });
                    [].forEach.call(document.querySelectorAll("[data-status='betting']"), function (e) {
                        let whichPlayer = e.getAttribute("data-player");
                        e.innerHTML = plyr + "Player " + (Number(whichPlayer) + 1) + ": bets $" + monetaryVal[gameStep + 1];
                    });
                    document.getElementById("foldBt").classList.remove("hide");
                    document.querySelector("[data-round='match']").classList.remove("hide");
                    document.querySelector("[data-round='check']").classList.add("hide");
                } else {
                    document.querySelector("[data-round='match']").classList.add("hide");
                    document.getElementById("foldBt").classList.add("hide");
                    document.querySelector("[data-round='check']").classList.remove("hide");
                }
                document.querySelector("[data-round='match']").disabled = false;
                document.querySelector("[data-round='check']").disabled = false;
                stepPlayed = true;
                return false;
            }

        }

        if (gameStep === 4 && iteration === lastIteration) {
            messageElement.classList.remove("hide");
            if (topHand === 0) {
                youWin("default");
            } else {
                youLose(topHand);
            }
            for (let i = 0; i < 4; i++) {
                let playerCardsHTML = "";
                for (let j = 0; j < playersHands[i].length; j++) {
                    playerCardsHTML = playerCardsHTML + "<div class='card " + playersHands[i][j].value + "-" + playersHands[i][j].suit + "' ></div>";
                    document.getElementById(playerIds[i]).innerHTML = playerCardsHTML;
                }
            }
            document.getElementById("foldBt").classList.add("hide");
            document.querySelector("[data-round='match']").classList.add("hide");
            document.querySelector("[data-round='check']").classList.add("hide");
            document.querySelector("button[title='Deal']").disabled = false;
            document.querySelector("button[title='Deal']").classList.remove("hide");

            document.querySelector("[data-round='match']").disabled = false;
            document.querySelector("[data-round='check']").disabled = false;
            stepPlayed = true;
            return false;
        }

    }
}

function match(checked) {
    document.querySelector("[data-round='match']").disabled = true;
    document.querySelector("[data-round='check']").disabled = true;
    window.location = "#";
    gameIncrement = gameIncrement + 1;
    let gameStep = gameIncrement;
    let maxLength = 4;
    if (gameStep === 4) {
        maxLength = 5;
    }
    document.getElementById("communityCardDetails").classList.remove("hide");
    if (checked === false) {
        if (gameStep === 2) {
            thePot = thePot + (monetaryVal[gameStep] * activePlayers.length);
            bet = bet + monetaryVal[gameStep];
            playerMoney = (playerMoney - monetaryVal[gameStep]);
            setPlayerMoney(playerMoney);
            document.querySelector("[data-round='match']").innerHTML = "Match $" + monetaryVal[gameStep + 1];
        }
        if (gameStep === 3) {
            thePot = thePot + (monetaryVal[gameStep] * activePlayers.length);
            bet = bet + monetaryVal[gameStep];
            playerMoney = (playerMoney - monetaryVal[gameStep]);
            setPlayerMoney(playerMoney);
            document.querySelector("[data-round='match']").innerHTML = "Match $" + monetaryVal[gameStep + 1];
        }
        if (gameStep === 4) {
            thePot = thePot + (monetaryVal[gameStep] * activePlayers.length);
            bet = bet + monetaryVal[gameStep];
            playerMoney = (playerMoney - monetaryVal[gameStep]);
            setPlayerMoney(playerMoney);
            document.getElementById("foldBt").classList.add("hide");
            document.querySelector("[data-round='match']").classList.add("hide");
            document.querySelector("[data-round='check']").classList.add("hide");
        }
    } else {
        document.querySelector("[data-round='match']").innerHTML = "Match $" + monetaryVal[gameStep + 1];
    }
    document.getElementById("playerMoney").innerHTML = playerMoney;
    document.getElementById("betTarget").innerHTML = "Bet $" + bet;
    if (gameStep === 2) {/*the flop*/
        communityCards = [];
        document.getElementById("communityCardDetails").classList.remove("hide");
        let communityCardsHTML = "";
        while (communityCards.length < 3) {
            let genNumber = generate(activeCards);
            if (usedCardsArr.indexOf(activeCards[genNumber].title) === -1) {
                communityCardsHTML = communityCardsHTML + `<div class='card ${activeCards[genNumber].title}' ></div>`;
                communityCards.push({
                    suit: activeCards[genNumber].title.substring(activeCards[genNumber].title.indexOf("-") + 1, activeCards[genNumber].title.length),
                    value: activeCards[genNumber].title.substring(0, activeCards[genNumber].title.indexOf("-"))
                });
                usedCardsArr.push(cards[genNumber].title);
            }
        }
        document.getElementById("communityCards").innerHTML = communityCardsHTML;
        document.getElementById("communityCardDetails").innerHTML = "Community Cards"
    } else {
        while (communityCards.length < maxLength) {
            let genNumber = generate(activeCards);
            if (usedCardsArr.indexOf(activeCards[genNumber].title) === -1) {

                let communityCardsHTML = document.getElementById("communityCards").innerHTML;
                communityCardsHTML = document.getElementById("communityCards").innerHTML + `<div class='card ${activeCards[genNumber].title}' ></div>`;
                communityCards.push({
                    suit: activeCards[genNumber].title.substring(activeCards[genNumber].title.indexOf("-") + 1, activeCards[genNumber].title.length),
                    value: activeCards[genNumber].title.substring(0, activeCards[genNumber].title.indexOf("-"))
                });
                usedCardsArr.push(cards[genNumber].title);

                document.getElementById("communityCards").innerHTML = communityCardsHTML;
            }
        }
    }
    let evaled = [];

    for (let i = 0; i < activePlayers.length; i++) {

        if (evaled.indexOf(activePlayers[i]) === -1) {
            if (activePlayers[i] !== undefined) {
                evaluateHand(activePlayers[i], gameStep);
                evaled.push(activePlayers[i]);
            }
        }
    }

}

function deal() {
    usedCardsArr = [];
    playedTimes = playedTimes + 1;
    gameIncrement = 1;
    communityCards = [];
    //bestHandIndex = 0;
    resultList = [0, 0, 0, 0];
    compareCards = [0, 0, 0, 0];
    activePlayers = [0, 1, 2, 3];
    playerHighCards = [0, 0, 0, 0];
    topHand = null;
    document.getElementById("communityCards").innerHTML = "";
    document.getElementById("communityCardDetails").classList.add("hide");
    [].forEach.call(document.querySelectorAll(".alert[data-player]"), function (e) {
        e.classList.remove("alert-danger");
        e.classList.add("alert-info");
        e.classList.remove("hide");
        e.classList.remove("alert-success");
        e.dataset.status = "ready";
    });
    document.getElementById("status").classList.add("hide");
    document.getElementById("notification").classList.remove("alert-success");
    document.getElementById("notification").classList.remove("alert-danger");
    document.getElementById("notification").classList.add("alert-info");
    document.getElementById("message").innerHTML = "";
    bet = 10;
    thePot = 40;

    playerMoney = (playerMoney - bet);
    setPlayerMoney(playerMoney);
    document.getElementById("betTarget").innerHTML = "Bet $" + bet;
    document.querySelector("#playerMoney").innerHTML = playerMoney;
    document.querySelector("[data-round='match']").innerHTML = "Match $" + monetaryVal[2]

    clear("deal");
    countingIterations = 0;
    document.getElementById("foldBt").classList.remove("hide");
    document.querySelector("[data-round='match']").classList.remove("hide");
    document.querySelector("button[title='Deal']").disabled = true;
    document.querySelector("button[title='Deal']").classList.add("hide");
    cards = JSON.parse(localStorage.getItem("completeCards"));
    function generatePlayer(iteration) {
        cardsInvolved = "";
        let playersCards = [];
        let playerCardsHTML = "";
        while (playersCards.length < 2) {
            let genNumber = generate(activeCards);
            if (usedCardsArr.indexOf(activeCards[genNumber].title) === -1) {
                if (iteration === 0) {
                    playerCardsHTML = playerCardsHTML + `<div class='card ${activeCards[genNumber].title}' ></div>`;
                } else {
                    playerCardsHTML = playerCardsHTML + `<div class='card hiddenDealerCard desktopOnly' ></div>`;
                }
                playersCards.push(cards[genNumber].title);
                usedCardsArr.push(cards[genNumber].title);
            }
        }
        let handObj = [];
        let score = 0;
        for (let i = 0; i < playersCards.length; i++) {
            handObj.push({
                suit: playersCards[i].substring(playersCards[i].indexOf("-") + 1, playersCards[i].length),
                value: playersCards[i].substring(0, playersCards[i].indexOf("-"))
            });
            score = score + cardHeirarchy.indexOf(playersCards[i].substring(0, playersCards[i].indexOf("-")));
        }
        document.getElementById(playerIds[iteration]).innerHTML = playerCardsHTML;
        playersHands[iteration] = handObj;
        evaluateHand(iteration, 1);
        return false;
    }
    for (let i = 0; i < 4; i++) {
        generatePlayer(i);
    }
    return false;
}

