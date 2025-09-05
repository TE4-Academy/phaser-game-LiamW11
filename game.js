// JavaScript Phaser Basics - Har buggar som du behöver fixa!

// =============================================================================
// Spel-konfiguration (fungerar bra)
// =============================================================================
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },  // Top-down spel, ingen gravitation
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// =============================================================================
// Globala variabler
// =============================================================================
let player;          // Spelare-sprite
let coins;           // Grupp av mynt
let powerUps;        // Powerup stjärna
let cursors;         // Piltangent-kontroller
let score = 0;       // Poäng
let coinsCollected = 0;  // Antal mynt samlade
let powerUpsCollected = 0; // Antal powerups samlade
let gameState = 'playing';  // Spelstatus
let timeLeft = 30;  // 30 sekunder
let winAmount = 10;

// =============================================================================
// Preload-funktion (fungerar)
// =============================================================================
function preload() {
    // Vi använder bara färgade former, så inget att ladda
    console.log('Preload: Inga assets att ladda');
    this.load.audio('coinSound', 'coin-sound.mp3');
    this.load.audio('powerUpSound', 'powerup-sound.mp3')
}

// =============================================================================
// Create-funktion (har problem!)
// =============================================================================
function create() {
    updateHighscore();
    document.getElementById('coins-left').textContent = winAmount;
    // Skapa spelare (blå fyrkant)
    player = this.add.rectangle(100, 100, 32, 32, 0x0099ff);
    this.physics.add.existing(player);

    // PROBLEM: Spelaren kan gå utanför skärmen!
    player.body.setCollideWorldBounds(true);

    // Skapa grupp för mynt
    coins = this.physics.add.group();
    powerUps = this.physics.add.group();
    // PROBLEM: Bara 2 mynt skapas istället för 5!
    for(i = 0; i < winAmount; i++){
        createCoin(this, (Math.random() * 400 + 100), (Math.random() * 400 + 100));
    }
    createPowerUp(this, ((Math.random() * 300) + 200), ((Math.random() * 300) + 200));

    // Skapa piltangent-kontroller
    cursors = this.input.keyboard.createCursorKeys();

    // PROBLEM: Kollision är inte uppsatt!
     this.physics.add.overlap(player, coins, collectCoin, null, this);
     this.physics.add.overlap(player, powerUps, collectPowerup, null, this);

    gameTimer = this.time.addEvent({
    delay: 1000,
    callback: updateTimer,
    callbackScope: this,
    loop: true
});
    console.log('Create: Spel skapat, men har problem...');
}

function updateTimer() {
    timeLeft--;
    document.getElementById('timer').textContent = timeLeft;
    
    if (timeLeft === 0) {
        gameState = 'lost';
        alert('Tiden är slut!');
        gameTimer.remove();
    }
}

function getHighScore(){
    return Number(localStorage.getItem('highScore')) || 0;
}

function saveHighScore() {
    const currentHigh = Number(localStorage.getItem('highScore')) || 0;
    if (score > currentHigh) {
        localStorage.setItem('highScore', score.toString());
        alert('Nytt rekord!');
    }
    return currentHigh;
}

function updateHighscore() {
    const currentHighScore = getHighScore();
    const highScoreElement = document.getElementById('highScore');
    if (highScoreElement) {
        highScoreElement.textContent = currentHighScore;
    }
}

// =============================================================================
// Funktion för att skapa mynt (fungerar)
// =============================================================================
function createCoin(scene, x, y) {
    const coin = scene.add.circle(x, y, 16, 0xffff00);  // Gul cirkel
    scene.physics.add.existing(coin);
    coins.add(coin);
}

function createPowerUp(scene, x, y) {
    const powerUp = scene.add.star(x, y, 5, 10, 20, 0xff0000);  // Röd stjärna
    scene.physics.add.existing(powerUp);
    powerUps.add(powerUp);
}

// =============================================================================
// Update-funktion (har problem!)
// =============================================================================
function update() {
    // PROBLEM: Rörelse fungerar inte!
    handlePlayerMovement();

    // PROBLEM: Debug uppdateras inte!
     updateDebug();

    // PROBLEM: Win-condition saknas!
     checkWinCondition();
}

// =============================================================================
// Rörelse-hantering (saknas helt!)
// =============================================================================
// TODO: Skriv denna funktion
function handlePlayerMovement() {
    // Nollställ hastighet
    player.body.setVelocity(0);

    // Kontrollera piltangenter
    if (cursors.left.isDown) {
        player.body.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(200);
    }

    if (cursors.up.isDown) {
        player.body.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.body.setVelocityY(200);
    }
}

// =============================================================================
// Kollisions-hantering (saknas!)
// =============================================================================
// TODO: Skriv denna funktion
 function collectCoin(player, coin) {
//     // Ta bort myntet
     coin.destroy();  
//     // Öka poäng
     score += 10;
     coinsCollected++;
    this.sound.play('coinSound'); 
//     // Uppdatera UI
     updateScore();  
     console.log('Mynt samlat! Poäng:', score);
 }

  function collectPowerup(player, powerUp) {
//     // Ta bort myntet
     powerUp.destroy();  
//     // Öka poäng
     score += 50;
     powerUpsCollected++;
     this.sound.play('powerUpSound');  
//     // Uppdatera UI
     updateScore(); 
 }

// =============================================================================
// UI-uppdatering (saknas!)
// =============================================================================
// TODO: Skriv denna funktion
 function updateScore() {
     document.getElementById('score').textContent = score;
     document.getElementById('coins-left').textContent = (winAmount - coinsCollected);
 }

// =============================================================================
// Win-condition (saknas!)
// =============================================================================
// TODO: Skriv denna funktion
function checkWinCondition() {
    if (coinsCollected >= winAmount && powerUpsCollected === 1 && gameState === 'playing') {
        gameState = 'won';
         console.log('Du vann!');
         gameTimer.remove();
         saveHighScore();
         updateHighscore();
//         // Visa win-meddelande
          alert('Grattis! Du samlade alla mynt och powerups!');
     }
 }

// =============================================================================
// Debug-funktion (fungerar delvis)
// =============================================================================
function updateDebug() {
    if (player && player.body) {
        document.getElementById('debug-x').textContent = Math.round(player.x);
        document.getElementById('debug-y').textContent = Math.round(player.y);
        document.getElementById('debug-collected').textContent = coinsCollected;
        document.getElementById('debug-state').textContent = gameState;
    }
}

// =============================================================================
// Starta spelet
// =============================================================================
const game = new Phaser.Game(config);

// =============================================================================
// TESTOMRÅDE
// =============================================================================
console.log('Phaser Basics laddad!');
console.log('PROBLEM: Spelaren rör sig inte!');
console.log('PROBLEM: Bara 2 mynt finns!');
console.log('PROBLEM: Kollision fungerar inte!');
console.log('PROBLEM: Poäng uppdateras inte!');
console.log('Öppna Console och fixa problemen steg för steg!');
