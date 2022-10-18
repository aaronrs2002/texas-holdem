

localStorage.setItem("completeCards", JSON.stringify(cards));
const handHeirarchy = ["high-card", "pair", "two-pairs", "three-of-a-kind", "straight", "flush", "full-house", "four-of-a-kind", "straight-flush", "royal-flush"];
const cardHeirarchy = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"];
const suitArr = ["diamonds", "hearts", "clubs", "spades"];
const playersDetails = ["playerHandDetails", "playerTwoHandDetails", "playerThreeHandDetails", "playerFourHandDetails"];
const playerIds = ["playerCards", "playerTwoCards", "playerThreeCards", "playerFourCards"];
const gameStepHierarchy = ["zeroPlaceholder", "pre flop", "flop", "turn", "river"];
let usedCardsArr = [];
let cardScores = [0, 0, 0, 0];
let player0Obj;
let player1Obj;
let player2Obj;
let player3Obj;
let activeRound = 1;
let bestHandIndex = 0;
let resultList = [0, 0, 0, 0];
let compareCards = [0, 0, 0, 0];
//maybe do not need
let replaceAttempts = 0;
let playerCardsInvolved = "";
let playerHighCards = [0, 0, 0, 0];
let topHand;
const plyr = "<i class='fas fa-user'></i> ";
const yourDetails = document.querySelector("[data-player='0']");
const messageElement = document.getElementById("message");


//let aiBetRound1 = false;
let communityCards = [];
let thePot = 0;
//let originalCompareCards;
/*end holdem custom variables


let countingIterations = 0;
/*DOES NOT RESET AT DEAL*/

let playerMoney = 500;
if (localStorage.getItem("balance") && Number(localStorage.getItem("balance"))) {
    playerMoney = Number(localStorage.getItem("balance"));
}
document.querySelector("#playerMoney").innerHTML = playerMoney;
let bet = 0;
function setPlayerMoney(passPlayerMoney) {
    playerMoney = passPlayerMoney;
    playerMoney = Math.round(playerMoney);

    document.getElementById("playerMoney").innerHTML = passPlayerMoney;
    document.querySelector("#playerMoney").innerHTML = passPlayerMoney;/*SAFARI BUG NEEDS BOTH*/
    localStorage.setItem("balance", passPlayerMoney);
}
function enablePlayBts() {
    [].forEach.call(document.querySelectorAll('.dealAmt'), function (e) {
        e.disabled = false;
    });
}
function generate(activeCards) {
    return Math.floor(Math.random() * activeCards.length);
}

function ckForBet(rules) {
    if (document.querySelector(".alert-info[data-status='betting']") !== null) {
        [].forEach.call(document.querySelectorAll(".alert-info[data-status='checking']"), function (e) {
            e.innerHTML = plyr + "Player  folded.";
            e.dataset.status = "fold";
        });
    } else {
        if (rules === true) {


            document.querySelector("button[data-round='check']").classList.remove("hide");
            document.querySelector("button[data-round='match']").classList.add("hide");
        }

    }
}



function clear(action) {
    if (action === "fold") {
        document.getElementById("playerHandDetails").classList.add("hide");
        document.getElementById("playerTwoHandDetails").classList.add("hide");
        document.getElementById("playerThreeHandDetails").classList.add("hide");
        document.getElementById("playerFourHandDetails").classList.add("hide");
    }

    document.getElementById("playerFourCards").innerHTML = "";
    document.getElementById("playerThreeCards").innerHTML = "";
    document.getElementById("playerTwoCards").innerHTML = "";
    document.getElementById("playerCards").innerHTML = "";
    document.getElementById("status").classList.add("hide");

}

function fold() {

    enablePlayBts();
    playerMoney = playerMoney - bet;
    setPlayerMoney(playerMoney);
    bet = Math.round(bet);
    document.querySelector('.dealAmt').disabled = false;
    //showAlert("alert-danger", "Folded.", 0);
    document.getElementById("betTarget").innerHTML = "Folded. You lost $" + bet + ". Place your bet.";
    clear("fold");
    window.location = "#";
}


function youWin() {
    document.querySelector("button[title='Deal']").disabled = false;
    yourDetails.classList.remove("alert-info");
    yourDetails.classList.add("alert-success");
    document.querySelector("#status").classList.remove("alert-info");
    document.querySelector("#status").classList.remove("hide");
    document.getElementById("status").classList.add("alert-success");
    messageElement.innerHTML = "You Won $" + thePot;
    playerMoney = playerMoney + thePot;
    document.getElementById("playerMoney").classList.remove("hide");
    document.querySelector("#playerMoney").innerHTML = playerMoney;
    document.getElementById("thePot").innerHTML = "";
    document.getElementById("betTarget").innerHTML = "TEXAS HOLDEM";
    document.querySelector("[data-round='match']").classList.add("hide");
    document.querySelector("[data-round='check']").classList.add("hide");

    document.querySelector("[data-player='0']").classList.remove("alert-info");
    document.querySelector("[data-player='0']").classList.remove("alert-danger");
    document.querySelector("[data-player='0']").classList.add("alert-success");
    return false;
}

function youLose(topHand) {
    document.getElementById(playersDetails[topHand]).innerHTML = plyr + " Player " + (topHand + 1) + " won with " + handHeirarchy[Math.max(...resultList)] + " - " + cardHeirarchy[Math.max(...compareCards)] + "s";
    document.querySelector("[data-player='" + topHand + "']").classList.remove("alert-info");
    document.querySelector("[data-player='" + topHand + "']").classList.add("alert-success");
    document.getElementById("status").classList.remove("hide");
    messageElement.classList.remove("hide");
    messageElement.innerHTML = "You lost $" + bet;
    document.querySelector("[data-player='0']").classList.remove("alert-success");
    document.querySelector("[data-player='0']").classList.remove("alert-info");
    document.querySelector("[data-player='0']").classList.add("alert-danger");
    document.getElementById("status").classList.remove("alert-success"); document.getElementById("status").classList.remove("alert-info"); document.getElementById("status").classList.add("alert-danger");
    messageElement.classList.remove("alert-success"); messageElement.classList.remove("alert-info"); messageElement.classList.add("alert-danger");

    playerMoney = playerMoney - bet;
    document.getElementById("betTarget").innerHTML = "Place your bet.";
    document.querySelector("#playerMoney").innerHTML = playerMoney;
    document.querySelector("[data-round='check']").classList.add("hide");
    return false;
}



let activePlayers = [0, 1, 2, 3];

function removeActivePlyr(plyrID) {
    let tempActivePlayer = [];
    for (let i = 0; i < activePlayers.length; i++) {
        if (activePlayers[i] !== plyrID) {
            tempActivePlayer.push(activePlayers[i]);
        }
    }
    activePlayers = tempActivePlayer;

    if (activePlayers.length === 1 && activePlayers[0] === 0) {
        youWin();
    }

    return false;
}

function evaluateHand(iteration, gameStep) {

    let stepPlayed = false;

    let monetaryVal = 35;
    if (gameStep === 3) {
        monetaryVal = 75;
    }
    if (gameStep === 4) {
        monetaryVal = 150;
    }
    console.log("START: " + gameStepHierarchy[gameStep] + " activePlayers: " + activePlayers + " - compareCards: " + compareCards);
    document.getElementById("communityCardDetails").innerHTML = "<h3>The " + gameStepHierarchy[gameStep] + "</h3>";
    countingIterations = iteration;
    bestHandIndex = 0;
    let cardsInvolved = "";
    let cardIndexes = [];
    const playersHands = [player0Obj, player1Obj, player2Obj, player3Obj];
    let cardsArr = [playersHands[iteration][0], playersHands[iteration][1]];

    // cardsArr = [playersHands[iteration][0], playersHands[iteration][1]];
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
        cardIndexes.push(cardHeirarchy.indexOf(cardsArr[i].value));
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



    let suitedArr = [spades, hearts, diamonds, clubs];

    if (suitedArr.indexOf(5) !== -1) {    /*DETERMINE A flush*/
        flush = true;
        if (bestHandIndex < 5) {
            bestHandIndex = 5;
        }
    }
    cardIndexes = cardIndexes.sort(((a, b) => a - b));
    var results = [];
    let connectedTwo = false;
    let connectedThree = false;
    let connectedFour = false;
    for (var i = 0; i < cardIndexes.length; i++) {    /*DETERMINE A STRIGHT*/
        if (cardIndexes[i + 1] == cardIndexes[i] + 1 && cardIndexes[i + 2] == cardIndexes[i] + 2 && cardIndexes[i + 3] == cardIndexes[i] + 3 && cardIndexes[i + 4] == cardIndexes[i] + 4) {
            results.push(i);
            compareCards[iteration] = i;
            while (cardIndexes[i] + 1 == cardIndexes[i + 1]) {
                if (i = 2) {/*for first round deal*/
                    connectedTwo = true;
                }
                if (i = 3) {
                    connectedThree = true;
                }
                if (i = 3) {
                    connectedFour = true;
                }
                i++;
            }

        }
    }
    if (results.length > 0) {
        if (bestHandIndex < 4) {
            bestHandIndex = 4;
            straight = true;
        }

    }
    let valueArr = [two, three, four, five, six, seven, eight, nine, ten, jack, queen, king, ace]; /*Determine matching values*/
    let pairQty = 0;
    let tripleQty = 0;
    let lastIteration = activePlayers[activePlayers.length - 1];
    for (let i = 0; i < valueArr.length; i++) {
        if (valueArr[i] > 0) {/*determine highest card*/
            highCard = cardHeirarchy[i];
            if (gameStep === 1) {
                playerHighCards[iteration] = i;
            }
            compareCards[iteration] = i;
        }
        if (valueArr[i] === 2) {
            if (bestHandIndex < 1) {
                bestHandIndex = 1;
            }
            pairQty = pairQty + 1;
            cardsInvolved = cardsInvolved + " - " + cardHeirarchy[i] + "s";
        }
        if (valueArr[i] === 3) {
            if (bestHandIndex < 3) {
                bestHandIndex = 3;
            }
            tripleQty = tripleQty + 1;
            cardsInvolved = cardsInvolved + " - " + cardHeirarchy[valueArr.lastIndexOf(3)] + "s";
        }
        if (valueArr[i] === 4) {
            if (bestHandIndex < 7) {
                bestHandIndex = 7;
            }
            cardsInvolved = cardsInvolved + " - " + cardHeirarchy[valueArr.lastIndexOf(4)] + "s";
        }
    }

    if (valueArr.indexOf(2) !== -1) {
        compareCards[iteration] = valueArr.lastIndexOf(2);
    }
    if (valueArr.indexOf(3) !== -1) {
        compareCards[iteration] = valueArr.lastIndexOf(3);
    }
    if (valueArr.indexOf(4) !== -1) {
        compareCards[iteration] = valueArr.lastIndexOf(4);
    }
    if (pairQty == 2) { /*checking for 2 pair*/
        if (bestHandIndex < 2) {
            bestHandIndex = 2;
        }
    }
    if (pairQty == 1 && tripleQty == 1) {    /*checking for full house*/
        if (bestHandIndex < 6) {
            bestHandIndex = 6;
        }
    }
    if (flush === true && straight === true) {/*checking for straight flush*/
        if (bestHandIndex < 8) {
            bestHandIndex = 8;
        }
    }
    if (flush === true && straight === true && valueArr[Number(valueArr.length) - 1] > 0) {  /*checking for royal flush (valueArr[Number(valueArr.length) - 1] is an ace)*/
        if (bestHandIndex < 9) {
            bestHandIndex = 9;
        }
    }
    resultList[Number(iteration)] = bestHandIndex;

    document.getElementById(playersDetails[iteration]).classList.remove("hide");
    let HighCardMessage = "";
    if (handHeirarchy[resultList[Number(iteration)]] === "high-card") {
        HighCardMessage = highCard;
    }

    if (iteration === 0) {
        playerCardsInvolved = cardsInvolved;

        resultList[0] = Number(bestHandIndex);
        document.getElementById(playersDetails[iteration]).innerHTML = "You have: " + handHeirarchy[resultList[Number(iteration)]] + "  " + cardsInvolved + HighCardMessage;
    }

    if (iteration !== 0 && gameStep === 4) {
        document.getElementById(playersDetails[iteration]).innerHTML = plyr + "Player " + (iteration + 1) + ": " + handHeirarchy[resultList[Number(iteration)]] + "  " + cardsInvolved + HighCardMessage;
    }



    //topHand = resultList.indexOf(winningCard);
    if (gameStep === 4 && iteration === lastIteration) {
        let winningHand = Math.max(...resultList);
        // = resultList.indexOf(winningHand);
        /*we only want to count the winning cards of the wnning hand. However, you will need the orignal later*/
        //originalCompareCards = compareCards;
        for (let i = 0; i < resultList.length; i++) {
            if (resultList[i] !== winningHand) {
                compareCards[i] = -1;
            }
        }

        let winningCard = Math.max(...compareCards);
        topHand = compareCards.indexOf(winningCard);
        console.log("compareCards: " + compareCards + " player: " + topHand + " won with winnind card: " + winningCard);

        /*start how many times number in array*/
        function getOccurrence(list, value) {
            var count = 0;
            list.forEach((v) => (v === value && count++));
            return count;
        }

        console.log("WINNING CARD SHOWED UP: " + getOccurrence(compareCards, winningCard) + " TIMES! IF GREATER THAN 1 WE WILL GET THE HIGHEST NUMBER FROM cardScores: " + cardScores);


        if (getOccurrence(compareCards, winningCard) > 1) {


            for (let i = 0; cardScores.length; i++) {
                if (compareCards.indexOf(i) === -1) {
                    cardScores[i] = -1;
                }
            }

            console.log("cardScores: " + cardScores + " WINNING CARD WAS SHOWN " + getOccurrence(compareCards, winningCard) + " TIMES!");
            let highestScore = Math.max(...cardScores);
            topHand = cardScores.indexOf(highestScore);



            globalAlert("alert-warning", "It's a draw. Player " + (topHand + 1) + " wins with highest cards.");
        }
    }





    /*FIRST ROUND*/
    let highCardCount = 0;
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

        if (Number(suitedArr[i]) > 1) {
            firstRoundSuited = true;
        }
        if (Number(suitedArr[i]) > 2) {
            threeSuited = true;
        }
        if (Number(suitedArr[i]) > 3) {
            fourSuited = true;
        }
    }


    console.log("START: " + gameStepHierarchy[gameStep] + " activePlayers: " + activePlayers + " lastIteration: " + lastIteration);



    if (stepPlayed === false && activePlayers.indexOf(iteration) !== -1) {




        if (gameStep === 1) {


            if (iteration !== 0) {
                if (resultList[iteration] >= 1 || connectedTwo === true || highCardCount > 1 || firstRoundSuited === true || valueArr[12] > 0) {
                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": bets $35";
                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
                    thePot = thePot + 35 + bet;
                    document.getElementById("thePot").innerHTML = "The Pot: $" + thePot;
                } else {
                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": checks.";
                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";

                }
            }
            if (iteration == lastIteration) {

                if (document.querySelector("[data-status='betting']") !== null) {
                    [].forEach.call(document.querySelector("[data-status='betting']"), function (e) {
                        let whichPlayer = e.getAttribute("data-player");

                    });
                    [].forEach.call(document.querySelectorAll("[data-status='checking']"), function (e) {
                        let whichPlayer = e.getAttribute("data-player");

                        e.innerHTML = "Player " + (Number(whichPlayer) + 1) + ": folded.";
                        removeActivePlyr(Number(whichPlayer));
                        compareCards[whichPlayer] = -1;
                        resultList[whichPlayer] = -1;
                        e.dataset.status = "folded";
                    });
                    document.querySelector("[data-round='match']").innerHTML = "Match $35";
                    document.querySelector("[data-round='match']").classList.remove("hide");
                    document.querySelector("[data-round='check']").classList.add("hide");
                } else {
                    document.querySelector("[data-round='match']").classList.add("hide");
                    document.getElementById("foldBt").classList.add("hide");
                    document.querySelector("[data-round='check']").classList.remove("hide");

                }
                stepPlayed = true;
                return false;
            }

        }

        if (gameStep === 2 || gameStep === 3 && iteration !== 0) {

            if (gameStep === 2) {

                if (resultList[iteration] >= 1 && valueArr[12] > 0) {
                    if (connectedTwo === true || highCardCount > 1 || firstRoundSuited === true) {
                        document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": bets $" + monetaryVal;
                        document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
                        thePot = thePot + monetaryVal;
                        document.getElementById("thePot").innerHTML = "The Pot: $" + thePot;

                    } else {
                        document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": checks.";
                        document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";

                    }
                }

            }



            if (gameStep !== 2) {
                if (connectedThree === true || connectedFour > 1 || threeSuited === true || fourSuited === true) {
                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": bets $" + monetaryVal;
                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
                    thePot = thePot + monetaryVal;
                    document.getElementById("thePot").innerHTML = "The Pot: $" + thePot;
                } else {
                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": checks.";
                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";
                }
            }/*broke up conditionals to help the javascript process*/

            if (iteration === lastIteration) {
                if (document.querySelector("[data-status='betting']") !== null) {


                    [].forEach.call(document.querySelectorAll("[data-status='checking']"), function (e) {
                        let whichPlayer = e.getAttribute("data-player");
                        removeActivePlyr(Number(whichPlayer));
                        e.innerHTML = "Player " + (Number(whichPlayer) + 1) + ": folded.";
                        e.dataset.status = "folded";
                    });
                    document.querySelector("[data-round='match']").innerHTML = "Match $" + monetaryVal;
                    document.getElementById("foldBt").classList.remove("hide");
                    document.querySelector("[data-round='match']").classList.remove("hide");
                    document.querySelector("[data-round='check']").classList.add("hide");
                } else {
                    document.querySelector("[data-round='match']").classList.add("hide");
                    document.getElementById("foldBt").classList.add("hide");
                    document.querySelector("[data-round='check']").classList.remove("hide");
                }
                console.log("END: " + gameStepHierarchy[gameStep] + " activePlayers: " + activePlayers);
                stepPlayed = true;
                return false;
            }

        }

        if (gameStep === 4) {
            console.log("START: " + gameStepHierarchy[gameStep] + " activePlayers: " + activePlayers + " - compareCards: " + compareCards);
            // const winner = compareCards.indexOf(Math.max(...compareCards));

            //Math.max(...compareCards)
            messageElement.classList.remove("hide");
            if (topHand === 0) {

                youWin();

            } else if (iteration === topHand) {
                youLose(topHand);



            }


            console.log("document.getElementById(playerIds[i]): " + document.getElementById(playerIds[i]) + " - iteration: " + iteration + " END: " + gameStepHierarchy[gameStep] + " activePlayers: " + activePlayers + " - JSON.stringify(cardsArr): " + JSON.stringify(cardsArr));
            if (iteration === lastIteration) {
                for (let i = 0; i < playersHands.length; i++) {
                    let playerCardsHTML = "";
                    for (let j = 0; j < playersHands[i].length; j++) {

                        playerCardsHTML = playerCardsHTML + "<div class='card " + playersHands[i][j].value + "-" + playersHands[i][j].suit + "' ></div>";
                        document.getElementById(playerIds[i]).innerHTML = playerCardsHTML;
                    }
                }

                console.log("END: " + gameStepHierarchy[gameStep] + " activePlayers: " + activePlayers);

                document.getElementById("foldBt").classList.add("hide");
                document.querySelector("[data-round='match']").classList.add("hide");
                document.querySelector("[data-round='check']").classList.add("hide");
                document.querySelector("button[title='Deal']").disabled = false;

            }
            stepPlayed = true;
            return false;

        }
        return false;
    }
    return false;

}

let gameIncrement = 1;

function match(checked) {
    let activeCards = JSON.parse(localStorage.getItem("completeCards"));
    gameIncrement = gameIncrement + 1;
    let gameStep = gameIncrement;
    let maxLength = 4;
    if (gameStep === 4) {
        maxLength = 5;
    }
    console.log("MATCH WAS HIT - activePlayers: " + activePlayers);


    document.getElementById("communityCardDetails").classList.remove("hide");
    if (gameStep === 4) {
        document.getElementById("foldBt").classList.add("hide");
        document.querySelector("[data-round='match']").classList.add("hide");
        document.querySelector("[data-round='check']").classList.add("hide");
    }


    if (checked === false) {

        switch (gameStep) {
            case 2:
                thePot = thePot + 35;
                bet = bet + 35;
                playerMoney = playerMoney - bet;
                break;
            case 3: thePot = thePot + 75;
                bet = bet + 75;
                playerMoney = playerMoney - bet;
                break;
            case 4: thePot = thePot + 150;
                bet = bet + 150;
                playerMoney = playerMoney - bet;
                break;
            default:
                thePot = thePot + 35;
                bet = bet + 35;
                playerMoney = playerMoney - bet;
        }
        document.getElementById("playerMoney").innerHTML = playerMoney;
        document.getElementById("betTarget").innerHTML = "Bet $" + bet;
        document.getElementById("thePot").innerHTML = "The Pot: " + thePot;
    }

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

                let communityCardsHTML = document.getElementById("communityCards").innerHTML + `<div class='card ${activeCards[genNumber].title}' ></div>`;
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

    console.log("BEFORE EVALUATE HAND FIRED  - evaled:" + evaled);

    for (let i = 0; i < activePlayers.length; i++) {


        if (evaled.indexOf(activePlayers[i]) === -1) {



            if (activePlayers[i] !== undefined) {
                console.log("WITHIN MATCH gameStep: " + gameStep + " - activePlayers: " + activePlayers);
                evaluateHand(activePlayers[i], gameStep);
                console.log(activePlayers[i] + " is playing!");
                evaled.push(activePlayers[i]);
            } else {
                console.log("Tried to play " + activePlayers[i] + " - From activePlayers: " + activePlayers);
            }


        }

    }


    console.log("AFTER EVALUATE HAND FIRED  - evaled:" + evaled);

    return false;
}




function deal() {
    gameIncrement = 1;
    playerHighCards = [];
    communityCards = [];
    cardScores = [0, 0, 0, 0];
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
    document.getElementById("status").classList.remove("alert-success");
    document.getElementById("status").classList.remove("alert-danger");
    document.getElementById("message").innerHTML = "";
    bet = 10;
    thePot = 40;
    activePlayers = [0, 1, 2, 3];
    playerMoney = playerMoney - bet;
    document.getElementById("betTarget").innerHTML = "Bet $" + bet;
    document.querySelector("#playerMoney").innerHTML = playerMoney;
    topHand;
    clear("deal");
    window.location = "#playerCards";
    activeRound = 1;
    countingIterations = 0;
    replaceAttempts = 0;
    document.getElementById("foldBt").classList.remove("hide");
    document.querySelector("[data-round='match']").classList.remove("hide");
    document.querySelector("button[title='Deal']").disabled = true;
    bestHandIndex = 0;
    cards = JSON.parse(localStorage.getItem("completeCards"));
    let activeCards = cards;
    usedCardsArr = [];

    function generatePlayer(iteration) {
        cardsInvolved = "";
        let playersCards = [];
        let playerCardsHTML = "";
        while (playersCards.length < 2) {
            let genNumber = generate(activeCards);
            if (usedCardsArr.indexOf(activeCards[genNumber].title) === -1) {
                if (iteration === 0) {
                    playerCardsHTML = playerCardsHTML + `<div class='card ${activeCards[genNumber].title}' ></div>`;
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
            console.log("ADDING " + playersCards[i].substring(0, playersCards[i].indexOf("-")) + " - NUMBER: " + Number(cardHeirarchy.indexOf(playersCards[i].substring(0, playersCards[i].indexOf("-")))));
            score = score + Number(cardHeirarchy.indexOf(playersCards[i].substring(0, playersCards[i].indexOf("-"))));
        }

        if (iteration === 0) {
            document.getElementById("playerCards").innerHTML = playerCardsHTML;
            player0Obj = handObj;
            cardScores[0] = score;
        }
        if (iteration === 1) {
            player1Obj = handObj;
            cardScores[1] = score;
        }
        if (iteration === 2) {
            player2Obj = handObj;
            cardScores[2] = score;
        }
        if (iteration === 3) {
            player3Obj = handObj;
            cardScores[3] = score;
        }
        evaluateHand(iteration, 1);
        return false;
    }


    for (let i = 0; i < 4; i++) {
        generatePlayer(i);
    }


    return false;
}





/*unique to this app*********************************/




