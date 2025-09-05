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
let cursors;         // Piltangent-kontroller
let score = 0;       // Poäng
let coinsCollected = 0;  // Antal mynt samlade
let gameState = 'playing';  // Spelstatus

// =============================================================================
// Preload-funktion (fungerar)
// =============================================================================
function preload() {
    // Vi använder bara färgade former, så inget att ladda
    console.log('Preload: Inga assets att ladda');
}

// =============================================================================
// Create-funktion (har problem!)
// =============================================================================
function create() {
    // Skapa spelare (blå fyrkant)
    player = this.add.rectangle(100, 100, 32, 32, 0x0099ff);
    this.physics.add.existing(player);

    // PROBLEM: Spelaren kan gå utanför skärmen!
    player.body.setCollideWorldBounds(true);

    // Skapa grupp för mynt
    coins = this.physics.add.group();

    // PROBLEM: Bara 2 mynt skapas istället för 5!
    createCoin(this, 200, 150);
    createCoin(this, 400, 300);
    createCoin(this, 600, 200);
    createCoin(this, 300, 450);
    createCoin(this, 700, 400);

    // Skapa piltangent-kontroller
    cursors = this.input.keyboard.createCursorKeys();

    // PROBLEM: Kollision är inte uppsatt!
     this.physics.add.overlap(player, coins, collectCoin, null, this);

    console.log('Create: Spel skapat, men har problem...');
}

// =============================================================================
// Funktion för att skapa mynt (fungerar)
// =============================================================================
function createCoin(scene, x, y) {
    const coin = scene.add.circle(x, y, 16, 0xffff00);  // Gul cirkel
    scene.physics.add.existing(coin);
    coins.add(coin);
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
//     
//     // Öka poäng
     score += 10;
     coinsCollected++;
//     
//     // Uppdatera UI
     updateScore();
//     
     console.log('Mynt samlat! Poäng:', score);
 }

// =============================================================================
// UI-uppdatering (saknas!)
// =============================================================================
// TODO: Skriv denna funktion
 function updateScore() {
     document.getElementById('score').textContent = score;
     document.getElementById('coins-left').textContent = (5 - coinsCollected);
 }

// =============================================================================
// Win-condition (saknas!)
// =============================================================================
// TODO: Skriv denna funktion
function checkWinCondition() {
    if (coinsCollected >= 5 && gameState === 'playing') {
        gameState = 'won';
         console.log('Du vann!');
//         // Visa win-meddelande
          alert('Grattis! Du samlade alla mynt!');
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
