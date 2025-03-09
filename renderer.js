const { ipcRenderer } = require('electron');
let storySlide = 0;
const backgrounds = [
    "url('assets/images/StorylineIntro/1.png')",
    "url('assets/images/StorylineIntro/2.png')",
    "url('assets/images/StorylineIntro/3.png')",
    "url('assets/images/StorylineIntro/4.png')",
    "url('assets/images/StorylineIntro/5.png')",
    "url('assets/images/StorylineIntro/6.png')",
];
let slide=0;
let puntaje = 0;
let flowers = {};

/*
Read the JSON file and save the data into flowers global variable
*/
fetch('assets/files/flowers.json')
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then( data => {
    flowers = data;
    console.log(flowers);
    //startGame();
})
.catch( error => {
    console.error('Error cargando el JSON: ', error);
});

/********************** WINDOW FUNCTIONS ***********************/
function closeWindow() {
    ipcRenderer.send('close-window');
}

function minimizeWindow() {
    ipcRenderer.send('minimize-window');
}


/************************* STORY FUNCTIONS **************************/
function nextSlideStory() {
    let container = document.getElementById('storyContainer');
    let startButton = document.getElementById('startButton');
    
    if (storySlide < backgrounds.length) {
        storySlide++;
        container.style.backgroundImage = backgrounds[storySlide];
        if (storySlide == 5) {
            startButton.classList.remove('hidden-item');
            
        }
    }
}

function prevSlideStory() {
    let container = document.getElementById('storyContainer');
    if (storySlide > 0) {
        storySlide--;
        container.style.backgroundImage = backgrounds[storySlide];
        
    }
}

/************************** LOGIC FUNCTIONS ********************/
function updateItems() {
    let currImg = document.getElementById('mainImage');
    let scoreText = document.getElementById('scoreText');
    currImg.setAttribute('src', imagesSlides[slide]);
    scoreText.innerText = "Puntaje: " + puntaje + " / 10";
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
