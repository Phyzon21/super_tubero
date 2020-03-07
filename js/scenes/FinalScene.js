var timedEvent3;
class FinalScene extends Phaser.Scene {
  constructor() {
    super("finalGame");
  }
  preload() {
    // map made with Tiled in JSON format
    this.load.image('gameover', 'assets/images/gameover.png');
    this.load.image('play', 'assets/images/play.png');
    this.load.image('bg', 'assets/images/bg_grasslands.png');
    this.load.image('spider', 'assets/images/spider.png')
  }
  create() {
    this.initialTime3 = 5;
    soundSample.stop();
    timedEvent3 = this.time.addEvent({ delay: 1000, callback: onEvent3, callbackScope: this, loop: true });
    this.add.image(config.width/2, config.height/2, 'bg');
    this.add.image(config.width/2, 200, 'gameover');
    this.add.text(290, 375, 'Thanks for Playing!',{
        fontSize: '40px',
        fill: '#ffffff'
    });
  }
  update(){

}
}
function onEvent3 ()
{
    this.initialTime3 -= 1; // One second
    if (this.initialTime3 === 0){
        this.scene.start("bootGame");
    
    }
}
