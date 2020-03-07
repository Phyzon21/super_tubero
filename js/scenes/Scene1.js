var initiallife = 3;
var highscoretext2;
var map_counter = 0;
class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }
  preload() {
    // map made with Tiled in JSON format
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('play', 'assets/images/play.png');
    this.load.image('bg', 'assets/images/bg_grasslands.png');
  }
  create() {
    score = 0;
    this.add.image(config.width/2, config.height/2, 'bg');
    this.add.image(config.width/2, 100, 'logo');
    
    const helloButton = this.add.image(config.width/2, 300, 'play').setScale(0.8);
    helloButton.setInteractive();
    helloButton.on('pointerdown', () => { 
      this.scene.start("playGame5");
    });
  }
}