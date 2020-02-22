class Scene1 extends Phaser.Scene {
  constructor() {
    super("bootGame");
  }
  preload() {
    // map made with Tiled in JSON format
    this.load.image('logo', 'assets/images/logo.png');
    this.load.image('play', 'assets/images/play.png');
    this.load.image('bg', 'assets/images/bg.jpg');
  }
  create() {
    this.add.image(700, 400, 'bg');
    this.add.image(700, 150, 'logo');
    const helloButton = this.add.image(700, 400, 'play');
    helloButton.setInteractive();
    helloButton.on('pointerdown', () => { 
      this.scene.start("playGame");
    });
  }
}