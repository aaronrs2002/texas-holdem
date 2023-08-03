/*done with game below is navigation*/


function choosePoker(option) {

    let balance = 500;
    let setTheme = "united";
    if (localStorage.getItem("theme")) {
        setTheme = localStorage.getItem("theme");
    }
    if (localStorage.getItem("balance")) {
        balance = localStorage.getItem("balance");
    }
    if (option === "texas-holdem") {
        window.location.href = "https://aaronrs2002.github.io/texas-holdem/?" + gaParam + "&theme=" + setTheme + "&balance=" + balance + "&";
    } else {
        window.location.href = "https://aaronrs2002.github.io/poker/?" + gaParam + "&theme=" + setTheme + "&balance=" + balance + "&";
    }




}
