var config = {
  type: Phaser.AUTO,
    width: 1024,
    height: 512,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
  scene: [Scene1, Scene2, Scene3]
}


var game = new Phaser.Game(config);
