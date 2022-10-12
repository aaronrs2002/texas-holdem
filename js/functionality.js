

localStorage.setItem("completeCards", JSON.stringify(cards));
const handHeirarchy = ["high-card", "pair", "two-pairs", "three-of-a-kind", "straight", "flush", "full-house", "four-of-a-kind", "straight-flush", "royal-flush"];
const cardHeirarchy = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"];
const suitArr = ["diamonds", "hearts", "clubs", "spades"];


const playersDetails = ["playerHandDetails", "playerTwoHandDetails", "playerThreeHandDetails", "playerFourHandDetails"];
const playerIds = ["playerCards", "playerTwoCards", "playerThreeCards", "playerFourCards"];
let usedCardsArr = [];
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
let playerHighCard = "";
let topHand;
const plyr = "<i class='fas fa-user'></i> ";
/*holdem custom*/
let gameStep = 1;
//let aiBetRound1 = false;
let communityCards = [];

let thePot = 0;
let originalCompareCards;
/*end holdem custom variables


let countingIterations = 0;
/*DOES NOT RESET AT DEAL*/
//let betPaid = false;
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
let activePlayers = [0, 1, 2, 3];
function removeActivePlyr(plyrID) {
    let tempActivePlayer = [];
    for (let i = 0; i < activePlayers.length; i++) {
        if (activePlayers[i] !== plyrID) {
            tempActivePlayer.push(activePlayers[i]);
        }
    }
    activePlayers = tempActivePlayer;
}
const gameStepHierarchy = ["zeroPlaceholder", "deal", "the flop", "4th street", "sth street"];
function evaluateHand(iteration) {
    console.log("START: " + gameStepHierarchy[gameStep] + " activePlayers: " + activePlayers);
    countingIterations = iteration;
    bestHandIndex = 0;
    let cardsInvolved = "";
    let cardIndexes = [];
    const playersHands = [player0Obj, player1Obj, player2Obj, player3Obj];

    let cardsArr = [playersHands[iteration][0], playersHands[iteration][1]];

    console.log("activePlayers.indexOf(iteration): " + activePlayers.indexOf(iteration));
    console.log("activePlayers: " + activePlayers);
    console.log("iteration: " + iteration);
    if (activePlayers.indexOf(iteration) !== -1 || gameStep === 1) {
        console.log("iteration number: " + iteration);
        // cardsArr = [playersHands[iteration][0], playersHands[iteration][1]];
        if (gameStep === 2) {
            cardsArr = [playersHands[iteration][0], playersHands[iteration][1], communityCards[0], communityCards[1], communityCards[2]];
        }
        if (gameStep === 3) {
            cardsArr = [playersHands[iteration][0], playersHands[iteration][1], communityCards[0], communityCards[1], communityCards[2], communityCards[3]];
        }
        if (gameStep > 3) {
            cardsArr = [playersHands[iteration][0], playersHands[iteration][1], communityCards[0], communityCards[1], communityCards[2], communityCards[3], communityCards[4]];
        }

        console.log("JSON.stringify(cardsArr): " + JSON.stringify(cardsArr));
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

            cardIndexes.push(cardHeirarchy.indexOf(cardsArr[i].value))
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
        for (let i = 0; i < valueArr.length; i++) {
            if (valueArr[i] > 0) {/*determine highest card*/
                highCard = cardHeirarchy[i];
                compareCards[iteration] = i;
            }
            if (valueArr[i] === 2) {
                if (bestHandIndex < 1) {
                    bestHandIndex = 1;
                }
                pairQty = pairQty + 1;
                cardsInvolved = cardsInvolved + " - " + cardHeirarchy[i] + "s";
            }
            if (valueArr[i] == 3) {
                if (bestHandIndex < 3) {
                    bestHandIndex = 3;
                }
                tripleQty = tripleQty + 1;
                cardsInvolved = cardsInvolved + " - " + cardHeirarchy[valueArr.lastIndexOf(3)] + "s";
            }
            if (valueArr[i] == 4) {
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
            HighCardMessage = " <small><i>(" + highCard + " is player " + (iteration + 1) + "'s highest card)</i></small>";
        }

        document.getElementById(playersDetails[iteration]).classList.remove("hide");
        if (iteration === 0) {
            resultList[0] = Number(bestHandIndex);
        }

        let winningHand = Math.max(...resultList);
        topHand = resultList.indexOf(winningHand);
        /*we only want to count the winning cards of the wnning hand. However, you will need the orignal later*/
        originalCompareCards = compareCards;
        for (let i = 0; i < resultList.length; i++) {
            if (resultList[i] !== winningHand) {
                compareCards[i] = -1;
            }
        }
        let winningCard = Math.max(...compareCards);
        /*start how many times number in array*/
        function getOccurrence(resultList, value) {
            var count = 0;
            resultList.forEach((v) => (v === value && count++));
            return count;
        }
        if (getOccurrence(resultList, winningHand) > 1 && iteration === 3) {
            if (getOccurrence(compareCards, winningCard) === 1) {
                winningCard = Math.max(...compareCards);
                topHand = compareCards.indexOf(winningCard);
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




        if (gameStep === 1) {

            console.log("WE ARE RUNNING evaluateHand(" + iteration + ") - gameStep: " + gameStep);
            if (iteration === 0) {
                playerCardsInvolved = cardsInvolved;
                playerHighCard = highCard;
                document.getElementById(playersDetails[iteration]).innerHTML = "You have: " + handHeirarchy[resultList[Number(iteration)]] + "  " + cardsInvolved + HighCardMessage;

            } else {
                if (resultList[iteration] >= 1 || connectedTwo === true || highCardCount > 1 || firstRoundSuited === true || valueArr[12] > 0) {
                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + " bets $25";
                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
                    console.log("Player " + (iteration + 1) + " is betting.");
                    thePot = thePot + 25 + bet;
                    document.getElementById("thePot").innerHTML = "The Pot: $" + thePot;

                    console.log("pushed player: " + iteration);
                } else {
                    console.log("Player " + (iteration + 1) + " DOES NOT HAVE A GREAT HAND.");
                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + " checks.";
                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";

                }
            }
            if (iteration === 3) {
                console.log("WE GOT TO iteration 3");



                if (document.querySelector("[data-status='betting']") !== null) {
                    [].forEach.call(document.querySelector("[data-status='betting']"), function (e) {
                        let whichPlayer = e.getAttribute("data-player");

                    });
                    [].forEach.call(document.querySelectorAll("[data-status='checking']"), function (e) {
                        let whichPlayer = e.getAttribute("data-player");
                        console.log("step 1 iteration " + iteration + " document.querySelector([data-status='betting'])" + document.querySelector("[data-status='betting']"));
                        e.innerHTML = "Player " + (Number(whichPlayer) + 1) + " folded.";
                        removeActivePlyr(Number(whichPlayer));
                        e.dataset.status = "folded";
                    });
                    document.querySelector("[data-round='match']").innerHTML = "Match $25";
                    document.querySelector("[data-round='match']").classList.remove("hide");
                    document.querySelector("[data-round='check']").classList.add("hide");
                } else {
                    document.querySelector("[data-round='match']").classList.add("hide");
                    document.getElementById("foldBt").classList.add("hide");
                    document.querySelector("[data-round='check']").classList.remove("hide");

                }

            }

            console.log("activePlayers from gameStep 1: " + activePlayers);
        }

        if (gameStep === 2/*the flop*/ || gameStep === 3 /*the 4th street*/ || gameStep === 4 /*the 5th street*/) {

            let monetaryVal = 25;
            if (gameStep === 3) {
                monetaryVal = 75;
            }
            if (gameStep === 4) {
                monetaryVal = 150;
            }


            if (iteration === 0) {
                playerCardsInvolved = cardsInvolved;
                playerHighCard = highCard;
                document.getElementById(playersDetails[iteration]).innerHTML = "You have: " + handHeirarchy[resultList[Number(iteration)]] + "  " + cardsInvolved + HighCardMessage;

            } else {

                if (gameStep === 2) {/*the flop*/
                    if (resultList[iteration] >= 1 || connectedTwo === true || highCardCount > 1 || firstRoundSuited === true || valueArr[12] > 0) {
                        document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + " bets $" + monetaryVal;
                        document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
                        thePot = thePot + monetaryVal;
                        document.getElementById("thePot").innerHTML = "The Pot: $" + thePot;

                    } else {
                        document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + " checks.";
                        document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";

                    }
                } else {
                    if (resultList[iteration] >= 1 || connectedThree === true || connectedFour > 1 || threeSuited || fourSuited || firstRoundSuited === true || valueArr[12] > 0) {
                        document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + " bets $" + monetaryVal;
                        document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
                        thePot = thePot + monetaryVal;
                        document.getElementById("thePot").innerHTML = "The Pot: $" + thePot;

                    } else {
                        document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + " checks.";
                        document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";

                    }
                }
            }

            if (iteration === 3) {



                if (document.querySelector("[data-status='betting']") !== null) {
                    [].forEach.call(document.querySelector("[data-status='betting']"), function (e) {
                        let whichPlayer = e.getAttribute("data-player");

                    });
                    [].forEach.call(document.querySelectorAll("[data-status='checking']"), function (e) {
                        let whichPlayer = e.getAttribute("data-player");
                        console.log("step 1 iteration " + iteration + " document.querySelector([data-status='betting'])" + document.querySelector("[data-status='betting']"));
                        removeActivePlyr(Number(whichPlayer));
                        e.innerHTML = "Player " + (Number(whichPlayer) + 1) + " folded.";
                        e.dataset.status = "folded";

                    });
                    document.querySelector("[data-round='match']").innerHTML = "Match $" + monetaryVal;
                    document.querySelector("[data-round='match']").classList.remove("hide");
                    document.querySelector("[data-round='check']").classList.add("hide");
                } else {
                    document.querySelector("[data-round='match']").classList.add("hide");
                    document.getElementById("foldBt").classList.add("hide");
                    document.querySelector("[data-round='check']").classList.remove("hide");

                }



            }

            console.log("activePlayers: " + activePlayers);
        }

        if (gameStep === 4) {





            let messageElement = document.getElementById("message");
            messageElement.classList.remove("hide");
            if (compareCards.indexOf(winningCard) === 0) {
                document.querySelector("[data-player='0']").classList.remove("alert-info");
                document.querySelector("[data-player='0']").classList.add("alert-success");
                document.querySelector("#status").classList.remove("alert-info");
                document.querySelector("#status").classList.remove("hide");
                document.getElementById("status").classList.add("alert-success");
                messageElement.innerHTML = "You Won $" + thePot;
                playerMoney = playerMoney + thePot;
                document.getElementById("playerMoney").classList.remove("hide");
                document.getElementById("thePot").innerHTML = "";
                document.getElementById("betTarget").innerHTML = "TEXAS HOLDEM";
            } else {
                document.getElementById(playersDetails[compareCards.indexOf(winningCard)]).innerHTML = plyr + " Player " + compareCards.indexOf(winningCard) + " won with " + resultList[Math.max(...resultList)] + " - " + communityCards[Math.max(...communityCards)];
                document.querySelector("[data-player='" + compareCards.indexOf(winningCard) + "']").classList.remove("alert-info");
                document.querySelector("[data-player='" + compareCards.indexOf(winningCard) + "']").classList.add("alert-success");
                messageElement.innerHTML = "You lost $" + bet;
                playerMoney = playerMoney - bet;
                document.getElementById("betTarget").innerHTML = "Place your bet.";
                document.querySelector("#playerMoney").innerHTML = playerMoney;



            }
            console.log("resultList: " + resultList + " - compareCards: " + compareCards);
            document.getElementById("foldBt").classList.add("hide");
            document.querySelector("[data-round='match']").classList.add("hide");
            document.querySelector("button[title='Deal']").disabled = false;
        }
    }
    console.log("END: " + gameStepHierarchy[gameStep] + " activePlayers: " + activePlayers);
    if (gameStep === 4 && iteration === 3) {

        /*
        let player0Obj;
let player1Obj;
let player2Obj;
let player3Obj;*/
        console.log("player1Obj: " + player1Obj);
        console.log("player2Obj: " + player2Obj);
        console.log("player3Obj: " + player3Obj);
        for (let j = 0; j < playersHands.length; j++) {
            let playerCardsHTML = "";
            for (let i = 0; i < playersHands[j].length; i++) {
                playerCardsHTML = playerCardsHTML + "<div class='card " + playersHands[j][i].value + "-" + playersHands[j][i].suit + "' ></div>";

            }
            console.log("playerCardsHTML: " + playerCardsHTML);
            document.getElementById(playerIds[j]).innerHTML = playerCardsHTML;
        }

    }
    return false;
}





function match(checked) {
    document.getElementById("communityCardDetails").classList.remove("hide");
    gameStep = gameStep + 1;
    if (checked === false) {

        switch (gameStep) {
            case 2:
                thePot = thePot + 25;
                bet = bet + 25;
                playerMoney = playerMoney - bet;
                break;
            case 3: thePot = thePot + 75;
                bet = bet + 75;
                playerMoney = playerMoney - bet;
                break;
            case 4: thePot = thePot + 150;
                bet = bet + 150;
                playerMoney = playerMoney - bet;


        }
        /*  // let matchBtMessage = "Match $75";
         if (gameStep === 2) {
             thePot = thePot + 25;
             bet = bet + 25;
             playerMoney = playerMoney - bet;
         }
         if (gameStep === 3) {
             thePot = thePot + 75;
             bet = bet + 75;
             playerMoney = playerMoney - bet;
             //  matchBtMessage = "Match $150";
         }
         if (gameStep === 4) {
             thePot = thePot + 150;
             bet = bet + 150;
             playerMoney = playerMoney - bet;
             // matchBtMessage = "Let's see who wins. Match $200!";
         }

         console.log("communityCards.length: " + communityCards.length + " -  gameStep: " + gameStep);
         document.getElementById("thePot").innerHTML = "The Pot: " + thePot;
 
        switch (gameStep) {
            case 2:
                thePot = thePot + 25;
                document.getElementById("thePot").innerHTML = "The Pot: " + thePot;
                bet = bet + 25;
                playerMoney = playerMoney - bet;
                document.querySelector("button[data-round='match']").innerHTML = "Match $75";
                console.log("communityCards.length: " + communityCards.length + " -  gameStep: " + gameStep);
                break;
            case 3: thePot = thePot + 75;
                document.getElementById("thePot").innerHTML = "The Pot: " + thePot;
                bet = bet + 75;
                playerMoney = playerMoney - bet;
                document.querySelector("button[data-round='match']").innerHTML = "Match $150";
                console.log("communityCards.length: " + communityCards.length + " -  gameStep: " + gameStep);
                break;
            case 4: thePot = thePot + 150;
                document.getElementById("thePot").innerHTML = "The Pot: " + thePot;
                bet = bet + 150;
                playerMoney = playerMoney - bet;
                document.querySelector("button[data-round='match']").innerHTML = "Let's see who wins. Match $200!";
                console.log("communityCards.length: " + communityCards.length + " -  gameStep: " + gameStep);
                break;
     
        }
 
         document.getElementById("betTarget").innerHTML = "Bet $" + bet;
 
         document.querySelector("#playerMoney").innerHTML = playerMoney;*/
    }

    if (gameStep === 2) {/*the flop*/
        communityCards = [];
        document.getElementById("communityCardDetails").classList.remove("hide");
        let communityCardsHTML = "";
        while (communityCards.length < 3) {
            let activeCards = JSON.parse(localStorage.getItem("completeCards"));
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
    }

    if (gameStep === 3 || gameStep === 4) {
        let activeCards = JSON.parse(localStorage.getItem("completeCards"));
        let genNumber = generate(activeCards);
        let maxLength = 4;
        if (gameStep === 4) {
            maxLength = 5;
        }
        while (communityCards.length < maxLength) {
            if (usedCardsArr.indexOf(activeCards[genNumber].title) === -1) {

                let communityCardsHTML = document.getElementById("communityCards").innerHTML + `<div class='card ${activeCards[genNumber].title}' ></div>`;
                communityCards.push({
                    suit: activeCards[genNumber].title.substring(activeCards[genNumber].title.indexOf("-") + 1, activeCards[genNumber].title.length),
                    value: activeCards[genNumber].title.substring(0, activeCards[genNumber].title.indexOf("-"))
                });
                usedCardsArr.push(cards[genNumber].title);
                console.log("JSON.stringify(communityCards): " + JSON.stringify(communityCards));
                document.getElementById("communityCards").innerHTML = communityCardsHTML;

            }
        }

    }
    for (let i = 0; i < 4; i++) {
        setTimeout(() => {
            evaluateHand(i);
        }, (200 * (i + 1)))
    }
    return false;

}




function deal() {
    gameStep = 1;
    communityCards = [];
    document.getElementById("communityCards").innerHTML = "";
    document.getElementById("communityCardDetails").classList.add("hide");

    [].forEach.call(document.querySelectorAll(".alert[data-player]"), function (e) {
        e.classList.add("alert-info");
        e.classList.remove("hide");
        e.classList.remove("alert-success");
    });
    document.getElementById("status").classList.add("hide");
    document.getElementById("status").classList.remove("alert-success");
    document.getElementById("message").innerHTML = "";
    bet = 10;
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
    betPaid = false;
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
                if (iteration !== 0) {
                    playerCardsHTML = playerCardsHTML + `<div class='card ${activeCards[genNumber].title}' ></div>`;
                    //playerCardsHTML = playerCardsHTML + "<div class='card hiddenDealerCard' ></div>";
                } else {
                    playerCardsHTML = playerCardsHTML + `<div class='card ${activeCards[genNumber].title}' ></div>`;
                }
                playersCards.push(cards[genNumber].title);
                usedCardsArr.push(cards[genNumber].title);
            }
        }
        let handObj = [];
        for (let i = 0; i < playersCards.length; i++) {
            handObj.push({
                suit: playersCards[i].substring(playersCards[i].indexOf("-") + 1, playersCards[i].length),
                value: playersCards[i].substring(0, playersCards[i].indexOf("-"))
            });
        }


        if (iteration === 0) {
            document.getElementById("playerCards").innerHTML = playerCardsHTML;
            player0Obj = handObj;

        }
        if (iteration === 1) {
            //document.getElementById("playerTwoCards").innerHTML = playerCardsHTML;
            player1Obj = handObj;
        }
        if (iteration === 2) {
            // document.getElementById("playerThreeCards").innerHTML = playerCardsHTML;
            player2Obj = handObj;
        }
        if (iteration === 3) {
            //document.getElementById("playerFourCards").innerHTML = playerCardsHTML;
            player3Obj = handObj;
        }
        evaluateHand(iteration);
    }


    generatePlayer(0);
    generatePlayer(1);
    generatePlayer(2);
    generatePlayer(3);
}





/*unique to this app*********************************/




