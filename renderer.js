const { ipcRenderer } = require('electron');
let slide=0;
let puntaje = 0;
let imagesSlides = {
    0: "assets/images/logo.png",
    1: "assets/images/flor1.jpg",
    2: "assets/images/flor2.jpg",
    3: "assets/images/flor3.jpg",
    4: "assets/images/flor4.jpg",
    5: "assets/images/flor5.jpg",
    6: "assets/images/flor6.jpg",
    7: "assets/images/flor7.jpg",
    8: "assets/images/flor8.jpg",
    9: "assets/images/flor9.jpg",
    10: "assets/images/flor10.jpg"
};
let answers = {
    "assets/images/flor1.jpg": true,
    "assets/images/flor2.jpg": true,
};

function refreshGame() {
    slide = 0;
    puntaje = 0;

    var resultContainer = document.getElementById('resultContainer');
    var questionContainer = document.getElementById('questionContainer');
    let currImg = document.getElementById('mainImage');
    let scoreText = document.getElementById('scoreText');
    var yesButton = document.getElementById('yesButton');
    var noButton = document.getElementById('noButton');
    var startButton = document.getElementById('startButton');

    if(questionContainer.classList.contains('hidden-item')) {
        questionContainer.classList.remove('hidden-item');
        resultContainer.classList.add('hidden-item');
    }
    if (startButton.classList.contains('hidden-item')) {
        startButton.classList.remove('hidden-item');
        yesButton.classList.add('hidden-item');
        noButton.classList.add('hidden-item');
    }
    currImg.setAttribute('src', imagesSlides[slide]);
    scoreText.innerText = "Holaa :)";
}


function closeWindow() {
    ipcRenderer.send('close-window');
}

function updateItems() {
    let currImg = document.getElementById('mainImage');
    let scoreText = document.getElementById('scoreText');
    currImg.setAttribute('src', imagesSlides[slide]);
    scoreText.innerText = "Puntaje: " + puntaje + " / 10";
}

function startGame() {
    var yesButton = document.getElementById('yesButton');
    var noButton = document.getElementById('noButton');
    var startButton = document.getElementById('startButton');
    var questionContainer = document.getElementById('questionContainer');
    
    questionContainer.classList.add('hidden');
    setTimeout(()=>{
        questionContainer.classList.remove('hidden');
        questionContainer.classList.add('show');
        if (yesButton.classList.contains('hidden-item')) {
            startButton.classList.add('hidden-item');
            yesButton.classList.remove('hidden-item');
            noButton.classList.remove('hidden-item');
        }
        slide++;
        updateItems();
    }, 500);
    setTimeout(() => {
        questionContainer.classList.remove('show');
    }, 1000);
}

function nextSlide() {
    slide++;
    var resultContainer = document.getElementById('resultContainer');
    var questionContainer = document.getElementById('questionContainer');

    if(questionContainer.classList.contains('hidden-item')) {
        questionContainer.classList.remove('hidden-item');
        resultContainer.classList.add('hidden-item');
    }

    questionContainer.classList.add('show');
    updateItems();
}

function evaluateAnswer(answerUser) {
    var scoreText = document.getElementById('scoreText');
    let currImg = document.getElementById('mainImage').getAttribute('src');
    let correct = answers[currImg];

    console.log("Respuesta del usuario: " + answerUser);
    if (answerUser === correct) {
        // correct!!
        showResult(true);
        puntaje++;
    }
    else {
        // incorrect!
        showResult(false);
    }
}

function showResult(result) {
    var resultContainer = document.getElementById('resultContainer');
    var questionContainer = document.getElementById('questionContainer');
    var resultText = document.getElementById('resultText');
    var resultImage = document.getElementById('resultImage');
    var newInnerText;
    var newSrc;

    if (result) {
        newInnerText = "Siiiiiii";
        newSrc = "assets/images/correct.png";
    }
    else {
        newInnerText = "Nooooo QUÉ TE PASA";
        newSrc = "assets/images/fail.png";
    }
    resultText.innerText = newInnerText;
    resultImage.setAttribute('src', newSrc);

    if (resultContainer.classList.contains('hidden-item')) {
        questionContainer.classList.add('hidden');
        setTimeout(() => {
            questionContainer.classList.remove('hidden');
            questionContainer.classList.add('hidden-item');
            resultContainer.classList.remove('hidden-item');
            resultContainer.classList.add('show');
            resultImage.classList.add('show');
            resultText.classList.add('show');
        }, 500);
        setTimeout(() => {
            resultContainer.classList.remove('show');
            resultContainer.classList.add('hidden');
        }, 2500);
        setTimeout(() => {
            resultContainer.classList.remove('hidden');
            questionContainer.classList.add('show');
        }, 3000);
        setTimeout(() => {
            nextSlide();
        }, 3500);
    }

}
