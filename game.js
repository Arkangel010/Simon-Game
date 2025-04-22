let buttonColours = ["red", "green", "blue", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let level = 0;
var started = false;


$(document).keypress(async function () {
  if (!started) {
    await levelSwitch();
  }
});

function levelSwitch() {
  return new Promise((resolve) => {
    started = false;
    userClickedPattern = [];
  
        level++;
        $("#level-title").text("Level " + level);
        nextSequence();
    setTimeout(()=>{
        $("#" + gamePattern[gamePattern.length - 1])
          .fadeIn(100)
          .fadeOut(100)
          .fadeIn(100);
        playSound(gamePattern[gamePattern.length - 1]); 
        animatePress(gamePattern[gamePattern.length - 1]);
        started = true; 
        resolve("Level Increased"); 
    }, 1000)
   
  });
}

function nextSequence() {
  let randomNo = Math.floor(Math.random() * 4);
  let randomChosenColour = buttonColours[randomNo];
  gamePattern.push(randomChosenColour);
}

function validate(userClickedButton){
    return new Promise((resolve, reject) => {
        userClickedPattern.push(userClickedButton); 
        playSound(userClickedButton);
        animatePress(userClickedButton);
        
        if(gamePattern[userClickedPattern.length - 1] == userClickedPattern[userClickedPattern.length -1]){
            resolve("Correct"); 
        }
        reject("Incorrect"); 
    })
}

$(".btn").click(async function () {
  if (started) {
    var userClickedButton = $(this).attr("id");

    await validate(userClickedButton)
    .then(async()=>{
        await isLevelCompleted()
        .then(async() => {
            await levelSwitch(); 
        })
        .catch(() =>{

        })
    })
    .catch(() => {
        endGame(); 
    });

  }
});

function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

function animatePress(currentColour) {
  $("." + currentColour).addClass("pressed");
  setTimeout(function () {
    $("." + currentColour).removeClass("pressed");
  }, 100);
}

function isLevelCompleted(){
    return new Promise((resolve, reject) =>{
        if(gamePattern.length == userClickedPattern.length){
            resolve("Level Completed"); 
        }
        reject("Enter next Pattern"); 
    })
}


function endGame(){
    playSound("wrong"); 
    level = 0;
    $("#level-title").text("Game Over, any key to restart!");
    $("body").addClass("game-over");
    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 100);
    started = false; 
    gamePattern = []; 
    userClickedPattern = []; 
}



