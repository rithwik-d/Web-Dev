function calculateLove() {
    var name1 = document.getElementById("name1").value;
    var name2 = document.getElementById("name2").value;

    if (name1 === "" || name2 === "") {
        alert("Please enter both names.");
        return;
    }

    var loveScore = Math.floor(Math.random() * 101);

    var resultText = "Your love score is: " + loveScore + "%";

    if (loveScore > 80) {
        resultText += " - You are a perfect match!";
    } else if (loveScore > 50) {
        resultText += " - You have a good chance!";
    } else {
        resultText += " - It might be a tough one.";
    }

    document.getElementById("result").innerText = resultText;
}