var enemy2, enemy3;
var boxleftLayer2, boxrightLayer2;
var starLayer;
class Scene4 extends Phaser.Scene{
  constructor(){
    super("playGame2");
    // this function will be called when the player touches a coin
  }
  preload() {
      // map made with Tiled in JSON format
      this.load.tilemapTiledJSON('map2', 'assets/map/map2.json');
      // tiles in spritesheet 
      this.load.spritesheet('tiles', 'assets/images/tiles.png', {frameWidth: 50, frameHeight: 50});
      // simple coin image
      this.load.image('coin', 'assets/images/coinGold.png');
      this.load.image('bomb', 'assets/images/bomb.png');
      this.load.image('spikes', 'assets/images/spikes.png');
      this.load.image('cactus', 'assets/images/cactus.png');
      this.load.image('signRight', 'assets/images/signRight.png');
      this.load.image('bg_desert', 'assets/images/bg_desert.png');
      this.load.image('mad', 'assets/images/mad.png');
      this.load.image('box', 'assets/images/box.png');
      this.load.image('star', 'assets/images/star.png');
      this.load.image('player1', 'assets/images/player.png');
      this.load.image('small_player', 'assets/images/small_player.png');
      // player animations
      this.load.atlas('player', 'assets/sprites/player.png', 'assets/sprites/player.json');
      this.load.audio('coin', 'assets/sounds/coin.mp3');
      this.load.audio('main', 'assets/sounds/level1.mp3');
      this.load.audio('explosion', 'assets/sounds/explosion.mp3');
      this.load.audio('jump', 'assets/sounds/jump.wav');
      this.load.audio('enemysound', 'assets/sounds/enemy.wav');
  }
  create() {
    
    map_counter= 2;
    world = 2;
    // load the map 
    
    var bg_grass = this.add.image(config.width/2, config.height/2, 'bg_desert');
    
    enemy2 = this.physics.add.image(560, 1280, 'mad');
    enemy2.body.setVelocityX(-100);

    enemy3 = this.physics.add.image(4200, 1130, 'mad');
    enemy3.body.setVelocityX(-100);

    jumpSound = this.sound.add('jump',{
      volume: 1,
    });
    enemySound = this.sound.add('enemysound',{
      volume: 1,
    });
    explodeSound = this.sound.add('explosion');
    coinSound = this.sound.add('coin');
    soundSample = this.sound.add('main',{
      volume: 0.3,
      loop: true
    });
    soundSample.play();
    map = this.make.tilemap({key: 'map2'});
    
    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('World', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    //var boxTiles = map.addTilesetImage('box');
    // create the ground layer
    boxleftLayer = map.createDynamicLayer('ColliderL', 0, 0);
    // the player will collide with this layer
    boxleftLayer.setCollisionByExclusion([-1]);

    boxrightLayer = map.createDynamicLayer('ColliderR', 0, 0);
    // the player will collide with this layer
    boxrightLayer.setCollisionByExclusion([-1]);
    // coin image used as tileset

    boxleftLayer2 = map.createDynamicLayer('ColliderL1', 0, 0);
    // the player will collide with this layer
    boxleftLayer2.setCollisionByExclusion([-1]);

    boxrightLayer2 = map.createDynamicLayer('ColliderR1', 0, 0);
    // the player will collide with this layer
    boxrightLayer2.setCollisionByExclusion([-1]);
    var coinTiles = map.addTilesetImage('coin');
    // add coins as tiles
    coinLayer = map.createDynamicLayer('Coins', coinTiles, 0, 0);


    var starTiles = map.addTilesetImage('star');
    // add coins as tiles
    starLayer = map.createDynamicLayer('Life', starTiles, 0, 0);

    var signTiles = map.addTilesetImage('signRight');
    // add coins as tiles
    signLayer = map.createDynamicLayer('Finish', signTiles, 0, 0);

    var plantsTiles = map.addTilesetImage('cactus');
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
    player = this.physics.add.sprite(140, 940, 'player');
    player.setBounce(0.2); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map    
    
    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height-8);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    this.physics.add.collider(groundLayer, enemy2);
    this.physics.add.collider(groundLayer, enemy3);
    //this.physics.add.collider(boxleftLayer, player);
    //this.physics.add.collider(boxrightLayer, player);
    this.physics.add.collider(player, enemy2, touchenemy2, null, this);
    this.physics.add.collider(player, enemy3, touchenemy2, null, this);
    // when the player overlaps with a tile with index 17, collectCoin 
    // will be called    
    spikeLayer.setTileIndexCallback(3, touchSpikes, this);
    coinLayer.setTileIndexCallback(1, collectCoin, this);
    enemyLayer.setTileIndexCallback(2, touchBomb, this);
    signLayer.setTileIndexCallback(160, touchSign, this);
    starLayer.setTileIndexCallback(167, touchStar, this);
    boxleftLayer.setTileIndexCallback(163, boxlefttouch, this);
    boxrightLayer.setTileIndexCallback(163, boxrighttouch, this);
    boxleftLayer2.setTileIndexCallback(163, boxlefttouch, this);
    boxrightLayer2.setTileIndexCallback(163, boxrighttouch, this);
    
    // when the player overlaps with a tile with index 17, collectCoin 
    // will be called    
    this.physics.add.overlap(enemy2, boxleftLayer);
    this.physics.add.overlap(enemy2, boxrightLayer);
    this.physics.add.overlap(enemy3, boxleftLayer2);
    this.physics.add.overlap(enemy3, boxrightLayer2);
    this.physics.add.overlap(player, enemyLayer);
    this.physics.add.overlap(player, coinLayer);
    this.physics.add.overlap(spikeLayer, player);
    this.physics.add.overlap(signLayer, player);
    this.physics.add.overlap(player, starLayer);
    
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
   leveltext = this.add.text(560, 65, '2', {
    fontSize: '40px',
    fill: '#ffffff'
 });
    // this text will show the score
    Scoretext = this.add.text(700, 15, 'SCORE', {
      fontSize: '40px',
      fill: '#ffffff'
   });

    text = this.add.text(700, 65, score, {
        fontSize: '40px',
        fill: '#ffffff'
    
    
    });
    this.initialTime = 120;
    this.enemyTime = 4
    this.enemyTime2 = 4
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
        player.body.setVelocityX(-350);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
        player.body.setVelocityX(350);
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
        jumpSound.play(); 
    }
  }

}
function touchStar(sprite, tile) {
    coinSound.play();
    starLayer.removeTileAt(tile.x, tile.y); // remove the tile/coin
    initiallife+=1; 
    life2text.setText('x'+initiallife);
    // add 10 points to the score
    text.setText(score); // set the text to show the current score
    return false;
  }

  function touchenemy2(player, enemy2) {
    if (enemy2.body.touching.up){
      enemySound.play();
      enemy2.destroy();
      score+=150; 
      text.setText(score);
      player.body.setVelocityY(-200);
    }else{
    initiallife -= 1;
    player.destroy();
    soundSample.stop();
    life2text.setText(initiallife);
    this.scene.start("deathGame");
    }
    }