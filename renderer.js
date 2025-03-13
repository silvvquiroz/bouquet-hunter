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
let questions = [];

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
    console.log(Object.keys(flowers).length);
    //startGame();
})
.catch( error => {
    console.error('Error cargando el JSON: ', error);
});

function getRandom() {
    return Math.floor(Math.random() * (Object.keys(flowers).length-1)) + 1;
}

function getRandomInArray() {
    let randNum = getRandom();
    while(questions.includes(randNum)) {
        randNum = getRandom();
    }
    console.log(randNum);
    return randNum;
}

/********************** WINDOW FUNCTIONS ***********************/
function closeWindow() {
    ipcRenderer.send('close-window');
}

function minimizeWindow() {
    ipcRenderer.send('minimize-window');
}


/************************* STORY FUNCTIONS **************************/
function startIntro() {
    let storyContainer = document.getElementById('storyContainer');
    let questionContainer = document.getElementById('questionContainer');

    if (!questionContainer.classList.contains('hidden-item')) {
        questionContainer.classList.toggle('show');

        setTimeout(()=>{
            questionContainer.classList.toggle('hidden-item');
            storyContainer.classList.toggle('hidden-item');
            storyContainer.classList.toggle('hide');
        }, 400);
    }
}

function nextSlideStory() {
    let container = document.getElementById('storyContainer');
    let nextButton = document.getElementById('nextButton');
    
    if (storySlide < backgrounds.length) {
        storySlide++;
        container.style.backgroundImage = backgrounds[storySlide];
        if (storySlide == 5) {
            // transitions
            if (nextButton.classList.contains('hide-text')) {
                nextButton.classList.remove('hide-text');
                nextButton.classList.remove('show-icon');
            }
            nextButton.classList.add('hide-icon');
            setTimeout(() => {
                nextButton.innerHTML = '';

                let div = document.createElement('span');
                div.innerHTML = "comenzar";
                nextButton.appendChild(div);

                setTimeout(() => {
                    nextButton.classList.add('show-text');
                }, 10);

                nextButton.onclick = startGame;
            }, 400);
        }
        
    }
}

function prevSlideStory() {
    let container = document.getElementById('storyContainer');
    let nextButton = document.getElementById('nextButton');

    if (storySlide > 0) {
        storySlide--;
        container.style.backgroundImage = backgrounds[storySlide];
        if (storySlide < 5) {
            // transitions
            if (nextButton.classList.contains('hide-icon')) {
                nextButton.classList.remove('show-text');
                nextButton.classList.remove('hide-icon');
            }
            nextButton.classList.add('hide-text');
            setTimeout(() => {
                nextButton.innerHTML = '';
                let img = document.createElement('img');
                img.setAttribute('src', 'assets/images/icons/right-arrow.png');
                img.classList.add('close-icon');
                nextButton.appendChild(img);

                setTimeout(() => {
                    nextButton.classList.add('show-icon');
                }, 10);

                nextButton.onclick = nextSlideStory;
            }, 400);

        }
    }
}

function startGame() {
    let gameContainer = document.getElementById('gameContainer');
    let storyContainer = document.getElementById('storyContainer');
    let landingContainer = document.getElementById('landingContainer');
    let underButtonContainer = document.getElementById('underButtonContainer');
    let counterText = document.getElementById('counter');
    var count = 3;
    counterText.innerText = count;

    if (!storyContainer.classList.contains('hidden-item')) {
        storyContainer.classList.toggle('hide');
        underButtonContainer.classList.toggle('hide-container');

        setTimeout(()=>{
            storyContainer.classList.toggle('hidden-item');
            landingContainer.classList.toggle('hidden-item');
            landingContainer.classList.toggle('show');
            
            let interval = setInterval(() => {
                counterText.innerText = count;
                counterText.classList.add('show');
                setTimeout(()=>{
                    count--;
                    if (count < 0) {
                        clearInterval(interval);
                        startQuestions();
                    }
                    counterText.classList.remove('show');
                }, 1000);
            }, 1100);
        }, 400);

    }
    
}

/************************** LOGIC FUNCTIONS ********************/
function startQuestions() {
    let underButtonContainer = document.getElementById('underButtonContainer');
    let landingContainer = document.getElementById('landingContainer');
    let questionContainer = document.getElementById('questionContainer');

    landingContainer.classList.toggle('show');

    setTimeout(()=>{
        landingContainer.classList.toggle('hidden-item');
        questionContainer.classList.toggle('hidden-item');
        questionContainer.classList.toggle('show');

        setTimeout(()=>{
            nextQuestion();
        }, 400);
    }, 400);
}



function nextQuestion() {
    let nextImg = getRandomInArray();
    let currImg = document.getElementById('mainImage');
    currImg.setAttribute('src', flowers[nextImg]['srcImg']);
}

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
