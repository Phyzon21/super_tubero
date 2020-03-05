var highscore = 0;
var map;
var player;
var spikeLayer, plantsLayer, signLayer;
var explodeSound;
var coinSound;
var soundSample;
var cursors;
var groundLayer, coinLayer, enemyLayer, boxLayer;
var text;
var Scoretext, Worldtext, leveltext;
var score = 0;
var timetext, time2text, life2text, lifetext;
var timedEvent;
class Scene2 extends Phaser.Scene{
  constructor(){
    super("playGame");
    // this function will be called when the player touches a coin
  }
  preload() {
      // map made with Tiled in JSON format
      this.load.tilemapTiledJSON('map', 'assets/map/map.json');
      // tiles in spritesheet 
      this.load.spritesheet('tiles', 'assets/images/tiles.png', {frameWidth: 50, frameHeight: 50});
      // simple coin image
      this.load.image('coin', 'assets/images/coinGold.png');
      this.load.image('bomb', 'assets/images/bomb.png');
      this.load.image('spikes', 'assets/images/spikes.png');
      this.load.image('plants', 'assets/images/plants.png');
      this.load.image('signRight', 'assets/images/signRight.png');
      this.load.image('bg_grasslands', 'assets/images/bg_grasslands.png');
      this.load.image('walking_enemy', 'assets/images/fly.png');
      this.load.image('box', 'assets/images/box.png');
      this.load.image('player1', 'assets/images/player.png');
      this.load.image('small_player', 'assets/images/small_player.png');
      // player animations
      this.load.atlas('player', 'assets/sprites/player.png', 'assets/sprites/player.json');

      this.load.audio('coin', 'assets/sounds/coin.mp3');
      this.load.audio('main', 'assets/sounds/level1.mp3');
      this.load.audio('explosion', 'assets/sounds/explosion.mp3');
  }
  create() {
    // load the map 
    var bg_grass = this.add.image(config.width/2, config.height/2, 'bg_grasslands');
    
    
    explodeSound = this.sound.add('explosion');
    coinSound = this.sound.add('coin');
    soundSample = this.sound.add('main',{
      volume: 0.4,
      loop: true
    });
    soundSample.play();
    map = this.make.tilemap({key: 'map'});
    
    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    var boxTiles = map.addTilesetImage('box');
    // create the ground layer
    boxLayer = map.createDynamicLayer('Collider', boxTiles, 0, 0);
    // the player will collide with this layer
    boxLayer.setCollisionByExclusion([-1]);
    // coin image used as tileset
    var coinTiles = map.addTilesetImage('coin');
    // add coins as tiles
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);

    var signTiles = map.addTilesetImage('signRight');
    // add coins as tiles
    signLayer = map.createDynamicLayer('Finish', signTiles, 0, 0);

    var plantsTiles = map.addTilesetImage('plants');
    // add coins as tiles
    plantsLayer = map.createDynamicLayer('Plants', plantsTiles, 0, 0);

    var spikesTiles = map.addTilesetImage('spikes');
    // add coins as tiles
    spikeLayer = map.createDynamicLayer('Spikes', spikesTiles, 0, 0);

    var enemyTiles = map.addTilesetImage('bomb');
    // add coins as tiles
    enemyLayer = map.createDynamicLayer('Enemy', enemyTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite    
    player = this.physics.add.sprite(200, 100, 'player');
    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map    
    
    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height-8);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    this.physics.add.collider(boxLayer, player);
   
    // when the player overlaps with a tile with index 17, collectCoin 
    // will be called    
    spikeLayer.setTileIndexCallback(3, touchSpikes, this);
    coinLayer.setTileIndexCallback(1, collectCoin, this);
    enemyLayer.setTileIndexCallback(2, touchBomb, this);
    signLayer.setTileIndexCallback(160, touchSign, this);
    
    
    
    // when the player overlaps with a tile with index 17, collectCoin 
    // will be called    
    this.physics.add.overlap(player, enemyLayer);
    this.physics.add.overlap(player, coinLayer);
    this.physics.add.overlap(spikeLayer, player);
    this.physics.add.overlap(signLayer, player);
    // player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10,
    });


    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    

    Worldtext = this.add.text(config.width/2, 15, 'WORLD', {
      fontSize: '40px',
      fill: '#ffffff'
   });
   leveltext = this.add.text(532, 65, '1-1', {
    fontSize: '40px',
    fill: '#ffffff'
 });
    // this text will show the score
    Scoretext = this.add.text(700, 15, 'SCORE', {
      fontSize: '40px',
      fill: '#ffffff'
   });

    text = this.add.text(700, 65, '0', {
        fontSize: '40px',
        fill: '#ffffff'
    
    
    });
    this.initialTime = 120;
    timetext = this.add.text(300, 65, '' + formatTime(this.initialTime),{
      fontSize: '40px',
        fill: '#ffffff'
    });

    time2text = this.add.text(300, 15, 'TIME', {
      fontSize: '40px',
      fill: '#ffffff'
  
  
    });
    lifetext = this.add.text(125, 15, 'LIFE',{
      fontSize: '40px',
      fill: '#ffffff'
    });
    this.add.image(148, 82, 'small_player').setScrollFactor(0);
    life2text = this.add.text(165, 65, 'x' + initiallife,{
      fontSize: '40px',
      fill: '#ff0000'
    });
    
   
    
    // Each 1000 ms call onEvent
    timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });
    // fix the text to the camera
    lifetext.setScrollFactor(0);
    life2text.setScrollFactor(0);
    time2text.setScrollFactor(0);
    timetext.setScrollFactor(0);
    leveltext.setScrollFactor(0);
    Worldtext.setScrollFactor(0);
    Scoretext.setScrollFactor(0);
    text.setScrollFactor(0);
    bg_grass.setScrollFactor(0);
  
  }
  update(time, delta) {

    
    if (cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(500);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
    } else {
        player.body.setVelocityX(0);
        player.anims.play('idle', true);
    }
    // jump 
    if (cursors.up.isDown && player.body.onFloor())
    {
        player.body.setVelocityY(-475);        
    }
  }

}
function collectCoin(sprite, tile) {
  coinSound.play();
  coinLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
  score+=100; 
  // add 10 points to the score
  text.setText(score); // set the text to show the current score
  return false;
}
function touchBomb(sprite, tile) {
  initiallife -= 1;
  explodeSound.play();
  soundSample.stop();
  enemyLayer.removeTileAt(tile.x, tile.y);
  life2text.setText(initiallife);
  this.scene.start("deathGame");
 // if(initiallife === 0){
 // explodeSound.play();
  //soundSample.stop();
  //this.scene.start("deathGame");
  //return false;
 // }
}
function touchSpikes (sprite, tile)
{
  console.log('hitted');
  initiallife -= 1;
  explodeSound.play();
  player.destroy();
    soundSample.stop();
    life2text.setText(initiallife);
    this.scene.start("deathGame");
  }

function formatTime(seconds){
  // Minutes
  var minutes = Math.floor(seconds/60);
  // Seconds
  var partInSeconds = seconds%60;
  // Adds left zeros to seconds
  partInSeconds = partInSeconds.toString().padStart(2,'0');
  // Returns formated time
  return `${minutes}:${partInSeconds}`;
}


function onEvent ()
{
   // One second
   
   this.initialTime -= 1;
  timetext.setText(formatTime(this.initialTime));
  if (this.initialTime === 0){
    initiallife -= 1;
    soundSample.stop();
    this.scene.start("deathGame");
  }
}

function touchSign(sprite) {
    soundSample.stop();
    this.scene.start("deathGame");
    return false;
    }
  
