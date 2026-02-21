
let state = {
    playLevel: "easy",
    maxBetHit: false,
    dblBets: false,
    usedCardsArr: [],
    communityCardsHTML: "",
    plyr1Pair: [],
    plyr2Pair: [],
    plyr3Pair: [],
    plyr4Pair: [],
    player0Obj: [],
    player1Obj: [],
    player2Obj: [],
    player3Obj: [],
    bestHoleCards: [],
    resultList: [0, 0, 0, 0],
    compareCards: [0, 0, 0, 0],
    activePlayers: [0, 1, 2, 3],
    playerHighCards: [0, 0, 0, 0],
    playerStraightHighCard: [0, 0, 0, 0],
    topHand: null,
    communityCards: [],
    thePot: 0,
    playerMoney: 500,
    bet: 0,
    gameIncrement: 1,
    updatedBets: false,
    startBet: 10,
    maxBet: [100, 200, 300]

}


//let playLevel = "easy";
if (localStorage.getItem("holdemPlayLevel")) {
    state.playLevel = localStorage.getItem("holdemPlayLevel");
    document.querySelector("input[name='playLevel'][value='" + state.playLevel + "']").checked = true;

} else {
    document.querySelector("input[name='playLevel'][value='easy']").checked = true;
    localStorage.setItem("holdemPlayLevel", "easy");
    document.querySelector("button[title='Deal']").innerHTML = "Deal $10";
}
//let playedTimes = 0;
//let maxBetHit = false;
//let dblBets = false;
localStorage.setItem("completeCards", JSON.stringify(cards));
const activeCards = JSON.parse(localStorage.getItem("completeCards"));
const handHeirarchy = ["high-card", "pair", "two-pairs", "three-of-a-kind", "straight", "flush", "full-house", "four-of-a-kind", "straight-flush", "royal-flush"];
const cardHeirarchy = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"];
const suitArr = ["diamonds", "hearts", "clubs", "spades"];
const playersDetails = ["playerHandDetails", "playerTwoHandDetails", "playerThreeHandDetails", "playerFourHandDetails"];
const playerIds = ["playerCards", "playerTwoCards", "playerThreeCards", "playerFourCards"];
const gameStepHierarchy = ["zeroPlaceholder", "pre flop", "flop", "turn", "river"];
//let usedCardsArr = [];
//let communityCardsHTML = "";

/*looking for pairs*/
//plyr1Pair = [];
//plyr2Pair = [];
//plyr3Pair = [];
//plyr4Pair = [];
//let player0Obj;
//let player1Obj;
//let player2Obj;
//let player3Obj;
const playersHands = [state.player0Obj, state.player1Obj, state.player2Obj, state.player3Obj];
//let bestHoleCards = [];
//let resultList = [0, 0, 0, 0];
//let compareCards = [0, 0, 0, 0];
//let activePlayers = [0, 1, 2, 3];
//let playerHighCards = [0, 0, 0, 0];
//let playerStraightHighCard = [0, 0, 0, 0];
//let topHand;
const plyr = "<i class='fas fa-user'></i> ";
const yourDetails = document.querySelector("[data-player='0']");
const messageElement = document.getElementById("message");
//let communityCards = [];
//let thePot = 0;
/*let playerMoney = 500;DOES NOT RESET AT DEAL*/
if (localStorage.getItem("balance") && Number(localStorage.getItem("balance"))) {
    state.playerMoney = Number(localStorage.getItem("balance"));
}
document.querySelector("#playerMoney").innerHTML = state.playerMoney;
//let bet = 0;
//let gameIncrement = 1;
//let updatedBets = false;
//let startBet = 10;
/*let maxBet = [100, 200, 300];start random bet*/
if (document.querySelector("[name='playLevel'][value='hard']:checked")) {
    state.maxBet = [200, 300, 400];/*start random bet */
    state.startBet = 50;
    document.querySelector("button[title='Deal']").innerHTML = "Deal $50";
    state.thePot = 200;
}


function changePlayLevel(level) {
    localStorage.setItem("holdemPlayLevel", level);

    [].forEach.call(document.querySelectorAll("input[name='playLevel']"), (e) => {
        if (e.value === level) {
            e.checked = true;
        } else {
            e.checked = false;
        }
    });

    if (level === "hard") {
        state.maxBet = [200, 300, 400];
        state.startBet = 50;
        document.querySelector("button[title='Deal']").innerHTML = "Deal $50";

    } else {
        state.maxBet = [100, 200, 300];
        state.startBet = 10;
        document.querySelector("button[title='Deal']").innerHTML = "Deal $10";
    }


}



let bet1 = Math.floor(Math.random() * (state.maxBet[0] - 1 + 1) + 10);
let bet2 = Math.floor(Math.random() * (state.maxBet[1] - state.maxBet[0] + 1) + state.maxBet[0]);
let bet3 = Math.floor(Math.random() * (state.maxBet[2] - state.maxBet[1] + 1) + state.maxBet[1]);
let monetaryVal = [null, state.startBet, bet1, bet2, bet3];

function updateDOM_MobileBugFix(start) {
    [].forEach.call(document.querySelectorAll("[data-player][data-status]"), (e, i) => {

        e.style.display = 'none'; // force reflow (mobile fix)
        void e.offsetHeight;
        e.style.display = '';
        if (start) {
            e.textContent = "reset"; // replaces cleanly

            if (i === 0) {
                e.innerHTML = "You";
            } else {
                e.innerHTML = plyr + "Player " + (i + 1);
            }
        }
    });
}

function setPlayerMoney(winLoseBet) {
    document.getElementById("betTarget").innerHTML = "Bet $" + state.bet;
    document.getElementById("playerMoney").innerHTML = state.playerMoney;
    document.querySelector("#playerMoney").innerHTML = state.playerMoney;/*SAFARI BUG NEEDS BOTH*/
    localStorage.setItem("balance", state.playerMoney);
    //return false;
}

function showPlayersCards() {
    for (let i = 0; i < 4; i++) {
        let playerCardsHTML = "";
        for (let j = 0; j < playersHands[i].length; j++) {
            playerCardsHTML = playerCardsHTML + "<div class='card " + playersHands[i][j].value + "-" + playersHands[i][j].suit + "' ></div>";
            document.getElementById(playerIds[i]).innerHTML = playerCardsHTML;
            // console.log("handHeirarchy[resultList[i]]; " + handHeirarchy[resultList[i]]);
            if (handHeirarchy[state.resultList[i]] !== undefined) {
                document.querySelector("[data-player='" + i + "']").innerHTML = plyr + "Player " + (i + 1) + " " + handHeirarchy[state.resultList[i]];/*attempt bug fix for ticket #2*/
            }

        }
    }


}

function generate(activeCards) {
    return Math.floor(Math.random() * activeCards.length);
}

function buildCommunityCards(howMany, step) {
    while (state.communityCards.length < howMany) {
        let genNumber = generate(activeCards);
        if (state.usedCardsArr.indexOf(activeCards[genNumber].title) === -1) {
            state.communityCardsHTML = state.communityCardsHTML + `<div class='card ${activeCards[genNumber].title}' ></div>`;
            state.communityCards.push({
                suit: activeCards[genNumber].title.substring(activeCards[genNumber].title.indexOf("-") + 1, activeCards[genNumber].title.length),
                value: activeCards[genNumber].title.substring(0, activeCards[genNumber].title.indexOf("-"))
            });
            state.usedCardsArr.push(cards[genNumber].title);
        }
    }
    document.getElementById("communityCards").innerHTML = state.communityCardsHTML;
    //if (step === 2) document.getElementById("communityCardDetails").innerHTML = "Community Cards";
}

function getOccurrence(list, value) {/*start how many times number in array*/
    var count = 0;
    list.forEach((v) => (v === value && count++));
    return count;
}

function clear(action) {
    if (action === "fold") {
        document.getElementById("notification").classList.remove("alert-success");
        document.getElementById("notification").classList.add("alert-danger");
        document.getElementById("playerHandDetails").classList.remove("alert-success");
        document.getElementById("playerHandDetails").classList.add("alert-danger");
        document.getElementById("playerHandDetails").innerHTML = "You folded.";
        showPlayersCards();
    }
    document.getElementById("foldBt").classList.add("hide");
    document.querySelector("[data-round='max']").classList.add("hide");
    document.querySelector("[data-round='match']").classList.add("hide");
    document.querySelector("[data-round='raise']").classList.add("hide");
    document.querySelector("[data-round='check']").classList.add("hide");
    document.getElementById("status").classList.add("hide");
    document.querySelector("button[title='Deal']").disabled = false;
    document.querySelector("button[title='Deal']").classList.remove("hide");
}

function fold() {
    document.getElementById("betTarget").innerHTML = "Folded. You lost $" + state.bet + ". Place your bet.";
    buildCommunityCards(5, "default");
    clear("fold");
    window.location = "#";
}

function youWin(type) {
    if (type === "split") {
        state.thePot = (state.thePot / 2);
        document.getElementById("betTarget").innerHTML = "SPLIT POT";
        messageElement.innerHTML = "Split pot. You Won $" + state.thePot;
    } else {
        messageElement.innerHTML = "You Won $" + state.thePot;
        document.getElementById("betTarget").innerHTML = "TEXAS HOLDEM";
    }
    document.getElementById("foldBt").classList.add("hide");
    document.querySelector("[data-round='max']").classList.add("hide");
    document.querySelector("[data-round='match']").classList.add("hide");
    document.querySelector("[data-round='check']").classList.add("hide");
    document.querySelector("[data-round='raise']").classList.add("hide");
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
    state.playerMoney = state.playerMoney + state.thePot;
    setPlayerMoney("win");
    document.getElementById("playerMoney").classList.remove("hide");
    document.querySelector("#playerMoney").innerHTML = state.playerMoney;
    ckHighScore();
    showPlayersCards();
    // return false;
}

function youLose(num) {
    document.querySelector("[data-player='" + num + "']").classList.remove("alert-info");
    document.querySelector("[data-player='" + num + "']").classList.add("alert-success");
    document.getElementById("status").classList.remove("hide");
    messageElement.classList.remove("hide");
    messageElement.innerHTML = "You lost $" + state.bet;
    document.querySelector("[data-player='0']").classList.remove("alert-success");
    document.querySelector("[data-player='0']").classList.remove("alert-info");
    document.querySelector("[data-player='0']").classList.add("alert-danger");
    document.getElementById("notification").classList.remove("alert-success");
    document.getElementById("notification").classList.remove("alert-info");
    document.getElementById("notification").classList.add("alert-danger");
    document.getElementById("betTarget").innerHTML = "Place your bet.";
    document.querySelector("[data-round='check']").classList.add("hide");
    document.getElementById("foldBt").classList.add("hide");
    document.querySelector("[data-round='max']").classList.add("hide");
    document.querySelector("[data-round='match']").classList.add("hide");
    document.querySelector("[data-round='check']").classList.add("hide");
    document.querySelector("[data-round='raise']").classList.add("hide");
    document.querySelector("button[title='Deal']").disabled = false;
    document.querySelector("button[title='Deal']").classList.remove("hide");
    // return false;
}

function removeActivePlyr(plyrID) {
    plyrID = Number(plyrID)
    state.compareCards[plyrID] = -1;
    state.resultList[plyrID] = -1;
    let tempActivePlayer = [];
    for (let i = 0; i < state.activePlayers.length; i++) {
        if (state.activePlayers[i] !== plyrID) {
            tempActivePlayer.push(state.activePlayers[i]);
        }
    }
    state.activePlayers = tempActivePlayer;
    if (state.activePlayers == 0) {
        youWin("default");
    }
}

function evaluateHand(iteration, gameStep) {


    let handState = {
        stepPlayed: false,
        //countingIterations: iteration,
        cardsInvolved: "",
        cardsArr: [playersHands[iteration][0], playersHands[iteration][1]],
        cardIndexes: [],
        highCard: Number(),
        flush: false,
        straight: false,
        spades: 0,
        hearts: 0,
        diamonds: 0,
        clubs: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
        six: 0,
        seven: 0,
        eight: 0,
        nine: 0,
        ten: 0,
        jack: 0,
        queen: 0,
        king: 0,
        ace: 0,
        connectedTwo: false,
        connectedThree: false,
        connectedFour: false,
        highCardCount: 0,
        firstRoundSuited: false,
        threeSuited: false,

    }


    let communityCardHand = [];

    // let stepPlayed = false;
    document.getElementById("communityCardDetails").innerHTML = "<h3>The " + gameStepHierarchy[gameStep] + " - Pot: $" + state.thePot + "</h3>";
    document.getElementById("raiseAmt").innerHTML = "$" + (monetaryVal[state.gameIncrement + 1] * 2);
    document.querySelector("[data-round='max']").innerHTML = "Max $" + (monetaryVal[state.gameIncrement + 1] * 3);
    // countingIterations = iteration;
    //let cardsInvolved = "";
    //let cardIndexes = [];
    //let cardsArr = [playersHands[iteration][0], playersHands[iteration][1]];
    /*if (gameStep === 2) {
        handState.cardsArr = [playersHands[iteration][0], playersHands[iteration][1], state.communityCards[0], state.communityCards[1], state.communityCards[2]];
    }
    if (gameStep === 3) {
        handState.cardsArr = [playersHands[iteration][0], playersHands[iteration][1], state.communityCards[0], state.communityCards[1], state.communityCards[2], state.communityCards[3]];
    }
    if (gameStep === 4) {
        handState.cardsArr = [playersHands[iteration][0], playersHands[iteration][1], state.communityCards[0], state.communityCards[1], state.communityCards[2], state.communityCards[3], state.communityCards[4]];
    }
*/

    if (gameStep === 2) {
        handState.cardsArr = [state.communityCards[1], state.communityCards[2], playersHands[iteration][0], playersHands[iteration][1]];
    }
    if (gameStep === 3) {
        handState.cardsArr = [state.communityCards[0], state.communityCards[1], state.communityCards[2], state.communityCards[3], playersHands[iteration][0], playersHands[iteration][1]];
    }
    if (gameStep === 4) {
        handState.cardsArr = [state.communityCards[0], state.communityCards[1], state.communityCards[2], state.communityCards[3], state.communityCards[4], playersHands[iteration][0], playersHands[iteration][1]];
    }


    /*let highCard;
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
    let ace = 0;*/
    for (let i = 0; i < handState.cardsArr.length; i++) {
        if (cardHeirarchy.indexOf(handState.cardsArr[i].value) !== null) {
            handState.cardIndexes.push(cardHeirarchy.indexOf(handState.cardsArr[i].value));
        }
        if (handState.cardsArr[i].value === "ace") {
            handState.cardIndexes.push(-1);/*aces need representation for a straight ace to 4 concept. -1 will work because 2 is represented as 0. This is just used for determining a straight*/
        }
        if (handState.cardsArr[i].value === "two") {
            handState.two = handState.two + 1;
        }
        if (handState.cardsArr[i].value === "three") {
            handState.three = handState.three + 1;
        }
        if (handState.cardsArr[i].value === "four") {
            handState.four = handState.four + 1;
        }
        if (handState.cardsArr[i].value === "five") {
            handState.five = handState.five + 1;
        }
        if (handState.cardsArr[i].value === "six") {
            handState.six = handState.six + 1;
        }
        if (handState.cardsArr[i].value === "seven") {
            handState.seven = handState.seven + 1;
        }
        if (handState.cardsArr[i].value === "eight") {
            handState.eight = handState.eight + 1;
        }
        if (handState.cardsArr[i].value === "nine") {
            handState.nine = handState.nine + 1;
        }
        if (handState.cardsArr[i].value === "ten") {
            handState.ten = handState.ten + 1;
        }
        if (handState.cardsArr[i].value === "jack") {
            handState.jack = handState.jack + 1;
        }
        if (handState.cardsArr[i].value === "queen") {
            handState.queen = handState.queen + 1;
        }
        if (handState.cardsArr[i].value === "king") {
            handState.king = handState.king + 1;
        }
        if (handState.cardsArr[i].value === "ace") {
            handState.ace = handState.ace + 1;
        }
        if (handState.cardsArr[i].suit === "spades") {  /*determine same suits*/
            handState.spades = handState.spades + 1;
        }
        if (handState.cardsArr[i].suit === "hearts") {
            handState.hearts = handState.hearts + 1;
        }
        if (handState.cardsArr[i].suit === "diamonds") {
            handState.diamonds = handState.diamonds + 1;
        }
        if (handState.cardsArr[i].suit === "clubs") {
            handState.clubs = handState.clubs + 1;
        }


        /*CHECK FOR COMMUNITY CARD HAND*/
        if (i === 3 && gameStep === 3) {

            for (let i = 0; i < handState.cardIndexes.length; i++) {
                if (i > 7 && handState.cardIndexes[i] > 0) {
                    handState.highCardCount = handState.highCardCount + 1;
                }
            }

            let tempCards = []
            for (let b = 0; b < 4; b++) {
                tempCards.push(handState.cardIndexes[b])
            }
            communityCardHand = tempCards;

        }
        /*END CHECK FOR COMMUNITY CARD HAND*/






    }
    let valueArr = [handState.two, handState.three, handState.four, handState.five, handState.six, handState.seven, handState.eight, handState.nine, handState.ten, handState.jack, handState.queen, handState.king, handState.ace]; /*Determine matching values*/
    let lastIteration = state.activePlayers[state.activePlayers.length - 1];
    for (let i = 0; i < valueArr.length; i++) {
        if (valueArr[i] > 0) {//determine highest card
            handState.highCard = cardHeirarchy[i];
            if (gameStep === 1) {
                state.playerHighCards[iteration] = i;
            }
            if (state.resultList[iteration] === 0) {
                handState.highCard = " - " + cardHeirarchy[valueArr.lastIndexOf(1)];
                state.compareCards[iteration] = i;
            }
        }
        if (valueArr[i] === 2) {//a pair           /*collect pair for later eval*/           
            if (iteration === 0) { state.plyr1Pair.push(i) }
            if (iteration === 1) { state.plyr2Pair.push(i) }
            if (iteration === 2) { state.plyr3Pair.push(i) }
            if (iteration === 3) { state.plyr4Pair.push(i) }/*end pair collection*/
            if (state.resultList[iteration] < 1) {
                state.resultList[iteration] = 1;
                state.compareCards[iteration] = valueArr.lastIndexOf(2);
            }
            handState.cardsInvolved = handState.cardsInvolved + " - " + cardHeirarchy[i] + "s";
        }
        if (valueArr[i] === 3) {//three of a kind
            if (state.resultList[iteration] < 3) {
                state.resultList[iteration] = 3;
                state.compareCards[iteration] = valueArr.lastIndexOf(3);
                handState.cardsInvolved = handState.cardsInvolved + " - " + cardHeirarchy[valueArr.lastIndexOf(3)] + "s";
            }
        }
        if (valueArr[i] === 4) {
            if (state.resultList[iteration] < 7) {
                state.resultList[iteration] = 7;
                state.compareCards[iteration] = valueArr.lastIndexOf(4);
                handState.cardsInvolved = handState.cardsInvolved + " - " + cardHeirarchy[valueArr.lastIndexOf(4)] + "s";
            }
        }
    }
    if (getOccurrence(valueArr, 2) > 1) {//2 pair - if the number 2 occurs more than once
        if (state.resultList[iteration] < 2) {
            state.resultList[iteration] = 2;
            state.compareCards[iteration] = valueArr.lastIndexOf(2);
        }
    }/*LOOKING FOR A STRAIGHT*/
    handState.cardIndexes = handState.cardIndexes.sort(((a, b) => a - b));
    /* let connectedTwo = false;
     let connectedThree = false;
     let connectedFour = false;*/
    for (var i = 0; i < handState.cardIndexes.length; i++) {
        if (handState.cardIndexes[i + 1] === handState.cardIndexes[i] + 1) {
            handState.connectedTwo = true;
        }
        if (handState.cardIndexes[i + 1] === handState.cardIndexes[i] + 1 && handState.cardIndexes[i + 2] === handState.cardIndexes[i] + 2) {
            handState.connectedThree = true;
        }
        if (handState.cardIndexes[i + 1] === handState.cardIndexes[i] + 1 && handState.cardIndexes[i + 2] === handState.cardIndexes[i] + 2 && handState.cardIndexes[i + 3] === handState.cardIndexes[i] + 3) {
            handState.connectedFour = true;
        }
        if (handState.cardIndexes[i + 1] === handState.cardIndexes[i] + 1 && handState.cardIndexes[i + 2] === handState.cardIndexes[i] + 2 && handState.cardIndexes[i + 3] === handState.cardIndexes[i] + 3 && handState.cardIndexes[i + 4] === handState.cardIndexes[i] + 4) {
            handState.straight = true;
            if (handState.cardIndexes[i + 4] > state.playerStraightHighCard[iteration]) {
                state.playerStraightHighCard[iteration] = handState.cardIndexes[i + 4];
            }

            if (state.resultList[iteration] < 4) {
                state.resultList[iteration] = 4;
                state.communityCards[iteration] = handState.cardIndexes[i + 4];
            }
        }
    }
    for (let i = -1; i < 13; i++) {/*ATTEMPT TO FIX PAIRS OVERRIDING STRAIGHT*/
        if (valueArr[i] > 0 && valueArr[i + 1] > 0 && valueArr[i + 2] > 0 && valueArr[i + 3] > 0 && valueArr[i + 4] > 0) {
            state.resultList[iteration] = 4;
            state.communityCards[iteration] = valueArr[i + 4];
            handState.straight = true;
        }
    }/*END ATTEMPT*/
    if (state.resultList[iteration] < 4 && handState.straight === true) {//declared earlier as well
        state.resultList[iteration] = 4;
    }
    let suitedArr = [handState.spades, handState.hearts, handState.diamonds, handState.clubs];
    if (suitedArr.indexOf(5) !== -1) {    /*DETERMINE A flush*/
        handState.flush = true;
        if (state.resultList[iteration] < 5) {
            state.resultList[iteration] = 5;
        }
    }
    if (valueArr.indexOf(3) !== -1 && valueArr.indexOf(2) !== -1) {    /*checking for full house*/
        if (state.resultList[iteration] < 6) {
            state.resultList[iteration] = 6;
            state.communityCards[iteration] = valueArr.lastIndexOf(3);
            handState.cardsInvolved = cardHeirarchy[valueArr.lastIndexOf(2)] + "s - " + cardHeirarchy[valueArr.lastIndexOf(3)] + "s";
        }
    }
    if (handState.flush === true && handState.straight === true) {/*checking for straight flush*/
        if (state.resultList[iteration] < 8) {
            state.resultList[iteration] = 8;
        }
    }
    if (valueArr[8] > 0 && valueArr[9] > 0 && valueArr[10] > 0 && valueArr[11] > 0 && valueArr[12] > 0 && handState.flush === true) {  /*checking for royal flush (valueArr[valueArr.length - 1] is an ace)*/
        if (state.resultList[iteration] < 9) {
            state.resultList[iteration] = 9;
        }
    }
    for (let i = 0; i < 4; i++) {
        if (state.activePlayers.indexOf(i) === -1) {
            state.resultList[i] = -1;
            state.compareCards[i] = -1;
        }
    }


    /*Community cards eval */



    if (gameStep === 3 && iteration !== 0) {



        for (let a = 0; a < 4; a++) {

            if (getOccurrence(communityCardHand, communityCardHand[a]) === 2 || getOccurrence(communityCardHand, communityCardHand[a]) === 3) {
                if (a > 0) {
                    if (1 === state.resultList[iteration] || 3 === state.resultList[iteration]) {

                        console.log("Folded player " + (iteration + 1) + " they had: " + handHeirarchy[state.resultList[iteration]]);

                        removeActivePlyr(iteration);
                        document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (Number(iteration) + 1) + ": folded.";
                        document.querySelector("[data-player='" + iteration + "']").dataset.status = "folded";

                    }

                }

            }


        }

    }



    /*end community cards eval*/




    document.getElementById(playersDetails[iteration]).classList.remove("hide");
    let HighCardMessage = "";
    if (state.resultList[iteration] === 0) {
        state.compareCards[iteration] = valueArr.lastIndexOf(1);
        HighCardMessage = " - " + cardHeirarchy[valueArr.lastIndexOf(1)];
    }
    if (iteration === 0) {
        document.getElementById(playersDetails[iteration]).innerHTML = "You have: " + handHeirarchy[state.resultList[iteration]] + "  " + handState.cardsInvolved + HighCardMessage;
        document.querySelector("#" + playersDetails[iteration]).innerHTML = "You have: " + handHeirarchy[state.resultList[iteration]] + "  " + handState.cardsInvolved + HighCardMessage;/*browser bug fix*/
    }
    if (iteration !== 0 && gameStep === 4 && state.activePlayers.indexOf[iteration] !== -1) {
        document.getElementById(playersDetails[iteration]).innerHTML = plyr + "Player " + (iteration + 1) + ": " + handHeirarchy[state.resultList[iteration]] + "  " + handState.cardsInvolved + HighCardMessage;
        document.querySelector("#" + playersDetails[iteration]).innerHTML = plyr + "Player " + (iteration + 1) + ": " + handHeirarchy[state.resultList[iteration]] + "  " + handState.cardsInvolved + HighCardMessage;        /*browser bug fix*/
    }


    //START BEST WHOLE CARDS
    if (gameStep === 1) {
        //bestHoleCards.push()
        let tempObj = []
        for (let i = 0; i < valueArr.length; i++) {
            if (valueArr[i] !== 0) {
                tempObj.push(i);
                if (valueArr[i] > 1) {
                    tempObj.push(i);
                }
            }
        }
        let placeHdlr0 = tempObj[0];
        let placeHdlr1 = tempObj[1];
        if (tempObj[1] < tempObj[0]) {
            tempObj[0] = placeHdlr1;
            tempObj[1] = placeHdlr0;
        }
        // tempObj = tempObj.reverse();
        //  tempObj = tempObj.sort();
        state.bestHoleCards.push(tempObj);



    }

    //END BEST WHOLE CARDS

    if (gameStep === 4 && iteration === lastIteration) {








        if (getOccurrence(valueArr, 2) > 2) {/*player cannot have 3 pair. Get rid of lowest pair here*/
            for (let i = 0; i < valueArr.length; i++) {
                if (valueArr[i] === 2 && getOccurrence(valueArr, 2) > 2) {
                    valueArr[i] = -2;
                }
            }
        }
        let winningHand = Math.max(...state.resultList);
        let winningCard;
        if (getOccurrence(state.resultList, winningHand) === 1) {
            state.topHand = state.resultList.indexOf(winningHand);
        } else {
            for (let i = 0; i < state.resultList.length; i++) {
                if (state.resultList[i] !== winningHand) {
                    state.compareCards[i] = -1;
                    state.bestHoleCards[i][0] = -1;
                    state.bestHoleCards[i][1] = -1;

                }

            }

            winningCard = Math.max(...state.compareCards);
            state.topHand = state.compareCards.indexOf(winningCard);
            if (getOccurrence(state.compareCards, winningCard) > 1) {
                if (winningHand === 4) {/*determine who has the highest straight */
                    state.topHand = Math.max(...state.playerStraightHighCard);
                    if (getOccurrence(state.playerStraightHighCard, state.topHand) > 1 && state.playerStraightHighCard[0] === state.topHand) {
                        youWin("split");
                        showPlayersCards();
                        //  return false;
                    }

                }
                if (winningHand === 2) {              /* If the 2 winning players have two pair, who has the best 2 pair?*/
                    let allPairs = [...state.plyr1Pair, ...state.plyr2Pair, ...state.plyr3Pair, ...state.plyr4Pair];
                    let highestPair = Math.max(...allPairs);
                    const playersWithPair = [state.plyr1Pair, state.plyr2Pair, state.plyr3Pair, state.plyr4Pair];//take out player without high pair
                    for (let i = 0; i < 4; i++) {
                        if (playersWithPair[i].indexOf(highestPair) === -1) {
                            state.compareCards[i] = -1;
                            state.resultList[i] = -1;
                            playersWithPair[i] = [];
                        }
                    }
                    for (let i = 0; i < allPairs.length; i++) {
                        if (allPairs[i] === highestPair) {
                            allPairs[i] = -1;
                        }
                    }
                    let secondHighestPair = Math.max(...allPairs);
                    for (let i = 0; i < 4; i++) {
                        if (playersWithPair[i].indexOf(secondHighestPair) === -1) {
                            state.compareCards[i] = -1;
                            state.resultList[i] = -1;
                            playersWithPair[i] = [-1];
                        }
                    }

                }   /*end*/

                let winnersList = [];
                for (let i = 0; i < 4; i++) {
                    if (state.compareCards[i] !== -1) {
                        let tempPlayerCards = [cardHeirarchy.indexOf(playersHands[i][0].value), cardHeirarchy.indexOf(playersHands[i][1].value)];
                        let tempWinner = Math.max(...tempPlayerCards);
                        winnersList.push(tempWinner);
                    } else {
                        winnersList.push(-1);
                    }
                }
                multiWinMax = Math.max(...winnersList);
                state.topHand = winnersList.indexOf(multiWinMax);


                if (getOccurrence(winnersList, multiWinMax) > 1) {


                    let hiHole = 0;
                    let lowHole = 0;
                    for (let i = 0; i < state.bestHoleCards.length; i++) {

                        if (state.bestHoleCards[i].indexOf(multiWinMax) === -1) {
                            state.bestHoleCards[i][0] = -1;
                            state.bestHoleCards[i][1] = -1;

                        }

                        if (state.bestHoleCards[i][1] > hiHole) {
                            hiHole = state.bestHoleCards[i][1];
                            state.topHand = i;

                        }
                        if (state.bestHoleCards[i][1] === hiHole) {

                            if (state.bestHoleCards[i][0] > lowHole) {
                                lowHole = state.bestHoleCards[i][0];
                                state.topHand = i;

                            }
                            if (state.bestHoleCards[i][1] === hiHole && state.bestHoleCards[i][0] === lowHole && state.bestHoleCards[0][0] !== -1) {
                                youWin("split");
                                showPlayersCards();
                                //  return false;

                            }
                        }


                    }



                }
                /*    if (getOccurrence(winnersList, multiWinMax) > 1 && compareCards[0] === multiWinMax) {
                        youWin("split");
                        showPlayersCards();
                        return false;
                    }*/
            }
        }
    }
    /* let highCardCount = 0; FIRST ROUND*/
    for (let i = 0; i < valueArr.length; i++) {
        if (i > 7 && valueArr[i] > 0) {
            handState.highCardCount = handState.highCardCount + 1;
        }
    }
    //let firstRoundSuited = false;
    //let threeSuited = false;
    //let fourSuited = false;
    for (let i = 0; i < suitedArr.length; i++) {/*determine if the first round has match suit*/
        if (suitedArr[i] > 1) {
            handState.firstRoundSuited = true;
        }
        if (suitedArr[i] > 2) {
            handState.threeSuited = true;
        }
        if (suitedArr[i] > 3) {
            handState.fourSuited = true;
        }
    }


    ///let cardsArr = [playersHands[iteration][0], playersHands[iteration][1]];

    /*END OF HAND EVALUATION

    console.log("JSON.stringify(handState): " + JSON.stringify(handState));

    console.log("JSON.stringify(state): " + JSON.stringify(state)); */

    if (handState.stepPlayed === false && state.activePlayers.indexOf(iteration) !== -1) {
        if (gameStep === 1 && iteration !== 0) {
            if (state.resultList[iteration] >= 1 || handState.connectedTwo === true || handState.highCardCount > 0 || handState.firstRoundSuited === true || valueArr[12] > 0) {
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
                    document.querySelector("[data-round='max']").classList.remove("hide");
                    document.querySelector("[data-round='match']").classList.remove("hide");
                    document.querySelector("[data-round='raise']").classList.remove("hide");
                    document.querySelector("[data-round='check']").classList.add("hide");
                } else {
                    document.querySelector("[data-round='max']").classList.add("hide");
                    document.querySelector("[data-round='match']").classList.add("hide");
                    document.getElementById("foldBt").classList.add("hide");
                    document.querySelector("[data-round='raise']").classList.add("hide");
                    document.querySelector("[data-round='check']").classList.remove("hide");
                }
                document.querySelector("[data-round='max']").disabled = false;
                document.querySelector("[data-round='match']").disabled = false;
                document.querySelector("[data-round='check']").disabled = false;
                handState.stepPlayed = true;
                // return false;
            }
        }
        if (state.resultList[iteration] >= 3 && iteration !== 0) {
            state.dblBets = true;
        }
        if (gameStep === 2 || gameStep === 3) {
            updateDOM_MobileBugFix(false);
            if (gameStep === 2 && iteration !== 0) {


                if (handState.connectedThree === true || handState.highCardCount > 1 || handState.firstRoundSuited === true || state.resultList[iteration] >= 1) {

                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + " Player " + (iteration + 1) + ": bets $" + monetaryVal[gameStep + 1];

                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
                } else {
                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + " Player " + (iteration + 1) + ": checks.";
                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";
                }
            }
            if (gameStep === 3 && iteration !== 0) {

                if (handState.connectedThree === true || handState.connectedFour > 1 || handState.threeSuited === true || handState.fourSuited === true || state.resultList[iteration] >= 1) {

                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": bets $" + monetaryVal[gameStep + 1];

                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "betting";
                } else {
                    document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + "Player " + (iteration + 1) + ": checks.";
                    document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";
                }
                /*START FOLD BASED ON MAX BET*/
                if (state.maxBetHit === true && iteration !== 0) {
                    if (handState.connectedThree === false && state.resultList[iteration] <= 2 && handState.fourSuited === false) {
                        document.querySelector("[data-player='" + iteration + "']").innerHTML = plyr + " Player " + (iteration + 1) + ": checks.";
                        document.querySelector("[data-player='" + iteration + "']").dataset.status = "checking";
                    }
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





                        e.innerHTML = plyr + "Player " + (Number(whichPlayer) + 1) + ": bets $" + monetaryVal[gameStep + 1];/*- cycle: 4  */




                    });
                    document.getElementById("foldBt").classList.remove("hide");
                    document.querySelector("[data-round='max']").classList.remove("hide");
                    document.querySelector("[data-round='match']").classList.remove("hide");
                    document.querySelector("[data-round='raise']").classList.remove("hide");
                    document.querySelector("[data-round='check']").classList.add("hide");
                } else {
                    document.querySelector("[data-round='max']").classList.add("hide");
                    document.querySelector("[data-round='match']").classList.add("hide");
                    document.querySelector("[data-round='raise']").classList.add("hide");
                    document.getElementById("foldBt").classList.add("hide");
                    document.querySelector("[data-round='check']").classList.remove("hide");
                }
                document.querySelector("[data-round='max']").disabled = false;
                document.querySelector("[data-round='match']").disabled = false;
                document.querySelector("[data-round='check']").disabled = false;
                handState.stepPlayed = true;
                // return false;
            }
        }
        if (gameStep === 4 && iteration === lastIteration) {
            updateDOM_MobileBugFix(false);
            messageElement.classList.remove("hide");
            if (state.topHand === 0) {
                youWin("default");
            } else {
                youLose(state.topHand);
            }
            showPlayersCards();
            document.getElementById("foldBt").classList.add("hide");
            document.querySelector("[data-round='max']").classList.add("hide");
            document.querySelector("[data-round='match']").classList.add("hide");
            document.querySelector("[data-round='raise']").classList.add("hide");
            document.querySelector("[data-round='check']").classList.add("hide");
            document.querySelector("button[title='Deal']").disabled = false;
            document.querySelector("button[title='Deal']").classList.remove("hide");
            document.querySelector("[data-round='max']").disabled = false;
            document.querySelector("[data-round='match']").disabled = false;
            document.querySelector("[data-round='check']").disabled = false;
            handState.stepPlayed = true;
            //return false;
        }
    }
}

function match(checked, betMultiplier) {



    if (betMultiplier === 3 || betMultiplier === 2) {
        state.maxBetHit = true;
    }
    document.querySelector("[data-round='match']").disabled = true;
    document.querySelector("[data-round='check']").disabled = true;
    document.querySelector("[data-round='match']").disabled = false;
    document.querySelector("[data-round='max']").disabled = false;
    window.location = "#";
    state.gameIncrement = state.gameIncrement + 1;
    let gameStep = state.gameIncrement;
    let maxLength = 4;
    if (gameStep === 4) {
        maxLength = 5;
    }
    document.getElementById("communityCardDetails").classList.remove("hide");
    if (checked === false) {
        /*START BLUFFING ARRAY*/



        const bluffList = [
            Math.floor(Math.random() * (100 - 10) + 10),
            Math.floor(Math.random() * (100 - 50) + 50),
            Math.floor(Math.random() * (200 - 101) + 101),
            Math.floor(Math.random() * (200 - 150) + 150),
            Math.floor(Math.random() * (300 - 201) + 201),
            Math.floor(Math.random() * ((document.querySelector("[name='playLevel'][value='hard']:checked") ? 400 : 300) - 250) + 250),
        ];

        if (state.dblBets === true || bluffList.indexOf(bet1) !== -1 || bluffList.indexOf(bet2) !== -1 || bluffList.indexOf(bet3) !== -1 && state.updatedBets === false) {
            state.maxBet = [500, 600, 900];
            bet1 = Math.floor(Math.random() * (state.maxBet[0] - 1 + 1) + 10);
            bet2 = Math.floor(Math.random() * (state.maxBet[1] - state.maxBet[0] + 1) + state.maxBet[0]);
            bet3 = Math.floor(Math.random() * (state.maxBet[2] - state.maxBet[1] + 1) + state.maxBet[1]);
            monetaryVal = [null, state.startBet, bet1, bet2, bet3];
            state.updatedBets = true;
        }
        if (gameStep === 2) {

            state.bet = state.bet + (monetaryVal[gameStep] * betMultiplier);
            state.playerMoney = state.playerMoney - state.bet;
            state.thePot = state.thePot + (state.bet * state.activePlayers.length);
            setPlayerMoney("betting");
            document.querySelector("[data-round='match']").innerHTML = "Match $" + monetaryVal[gameStep + 1];
            document.querySelector("[data-round='max']").innerHTML = "Max $" + (monetaryVal[gameStep + 1] * 3);
        }
        if (gameStep === 3) {

            state.bet = state.bet + (monetaryVal[gameStep] * betMultiplier);
            state.playerMoney = state.playerMoney - state.bet;
            state.thePot = state.thePot + (state.bet * state.activePlayers.length);
            setPlayerMoney("betting");
            document.querySelector("[data-round='match']").innerHTML = "Match $" + monetaryVal[gameStep + 1];
            document.querySelector("[data-round='max']").innerHTML = "Max $" + (monetaryVal[gameStep + 1] * 3);
        }
        if (gameStep === 4) {

            state.bet = state.bet + (monetaryVal[gameStep] * betMultiplier);
            state.playerMoney = state.playerMoney - state.bet;
            state.thePot = state.thePot + (state.bet * state.activePlayers.length);
            setPlayerMoney("betting");
            document.getElementById("foldBt").classList.add("hide");
            document.querySelector("[data-round='max']").classList.add("hide");
            document.querySelector("[data-round='match']").classList.add("hide");
            document.querySelector("[data-round='check']").classList.add("hide");
            document.querySelector("[data-round='raise']").classList.add("hide");
        }

    } else {


        document.querySelector("[data-round='match']").innerHTML = "Match $" + monetaryVal[gameStep + 1];

        document.querySelector("[data-round='max']").innerHTML = "Max $" + (monetaryVal[gameStep] * betMultiplier);
    }
    document.getElementById("playerMoney").innerHTML = state.playerMoney;
    document.getElementById("betTarget").innerHTML = "Bet $" + state.bet;
    if (gameStep === 2) {/*the flop*/
        state.communityCards = [];
        document.getElementById("communityCardDetails").classList.remove("hide");
        buildCommunityCards(3, gameStep);
    } else {
        buildCommunityCards(maxLength, gameStep);
    }
    let evaled = [];
    for (let i = 0; i < state.activePlayers.length; i++) {
        if (evaled.indexOf(state.activePlayers[i]) === -1) {
            if (state.activePlayers[i] !== undefined) {
                evaluateHand(state.activePlayers[i], gameStep);
                evaled.push(state.activePlayers[i]);
            }
        }
    }
}


function deal() {

    /*for testing*/
    let playCount = 1;
    if (localStorage.getItem("playCount")) {
        playCount = Number(localStorage.getItem("playCount"));
        playCount = playCount + 1;
        localStorage.setItem("playCount", playCount);

    } else {
        localStorage.setItem("playCount", playCount);
    }

    updateDOM_MobileBugFix(true);

    for (let i = 0; i < playerIds.length; i++) {
        document.getElementById(playerIds[i]).innerHTML = ""
    }
    state.communityCardsHTML = "";


    if (document.querySelector("[name='playLevel'][value='hard']:checked")) {
        state.maxBet = [200, 300, 400];/*start random bet */
        state.startBet = 50;
        state.thePot = 200;
    } else {
        state.maxBet = [100, 200, 300];/*start random bet*/
        state.thePot = 40;
    }
    bet1 = Math.floor(Math.random() * (state.maxBet[0] - 1 + 1) + 10);
    bet2 = Math.floor(Math.random() * (state.maxBet[1] - state.maxBet[0] + 1) + state.maxBet[0]);
    bet3 = Math.floor(Math.random() * (state.maxBet[2] - state.maxBet[1] + 1) + state.maxBet[1]);
    monetaryVal = [null, state.startBet, bet1, bet2, bet3];
    state.updatedBets = false;
    state.maxBetHit = false;
    state.dblBets = false;
    state.plyr1Pair = [];
    state.plyr2Pair = [];
    state.plyr3Pair = [];
    state.plyr4Pair = [];
    state.usedCardsArr = [];
    //playedTimes = playedTimes + 1;
    state.gameIncrement = 1;
    state.communityCards = [];
    state.resultList = [0, 0, 0, 0];
    state.compareCards = [0, 0, 0, 0];
    state.activePlayers = [0, 1, 2, 3];
    state.playerHighCards = [0, 0, 0, 0];
    state.playerStraightHighCard = [0, 0, 0, 0];
    state.bestHoleCards = [];
    state.topHand = null;
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

    state.bet = monetaryVal[1];
    state.playerMoney = state.playerMoney - state.bet;
    setPlayerMoney("betting");
    document.getElementById("betTarget").innerHTML = "Bet $" + monetaryVal[1];
    document.querySelector("#playerMoney").innerHTML = state.playerMoney;
    document.querySelector("[data-round='match']").innerHTML = "Match $" + monetaryVal[2];
    document.querySelector("[data-round='max']").innerHTML = "Max $" + monetaryVal[2] * 3;
    clear("deal");
    // countingIterations = 0;
    document.getElementById("foldBt").classList.remove("hide");
    document.querySelector("[data-round='max']").classList.remove("hide");
    document.querySelector("[data-round='match']").classList.remove("hide");
    document.querySelector("[data-round='raise']").classList.remove("hide");
    document.querySelector("button[title='Deal']").disabled = true;
    document.querySelector("button[title='Deal']").classList.add("hide");
    cards = JSON.parse(localStorage.getItem("completeCards"));
    function generatePlayer(iteration) {
        //cardsInvolved = "";
        let playersCards = [];
        let playerCardsHTML = "";
        while (playersCards.length < 2) {
            let genNumber = generate(activeCards);
            if (state.usedCardsArr.indexOf(activeCards[genNumber].title) === -1) {
                if (iteration === 0) {
                    playerCardsHTML = playerCardsHTML + `<div class='card ${activeCards[genNumber].title}' ></div>`;
                } else {
                    playerCardsHTML = playerCardsHTML + `<div class='card hiddenDealerCard desktopOnly' ></div>`;
                }
                playersCards.push(cards[genNumber].title);
                state.usedCardsArr.push(cards[genNumber].title);
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
        //return false;
    }
    for (let i = 0; i < 4; i++) {
        generatePlayer(i);
    }
    //return false;
}