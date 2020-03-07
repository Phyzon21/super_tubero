var timedEvent2;
class Scene3 extends Phaser.Scene {
    constructor() {
      super("deathGame");
    }
    preload() {
      // map made with Tiled in JSON format
      this.load.image('death', 'assets/images/gameover.png');
      this.load.image('restart', 'assets/images/restart.png');
      this.load.image('quit', 'assets/images/quit.png');
      this.load.image('bg_grasslands', 'assets/images/bg_grasslands.png');
      
    }
    create() {
    
      this.add.image(config.width/2, config.height/2, 'bg_grasslands');
      
      if (initiallife > 0 ){
        
        this.initialTime2 = 3;
        soundSample.stop();
        timedEvent2 = this.time.addEvent({ delay: 1000, callback: onEvent2, callbackScope: this, loop: true });
        Worldtext = this.add.text(400, 90, 'WORLD - '+world, {
          fontSize: '40px',
          fill: '#ffffff'
       });
        this.add.image(450, 250, 'player1');
        this.add.text(config.width/2, config.height/2, 'x '+initiallife,{
          fontSize: '40px',
          fill: '#ffffff'
      });
        
      }
      else if (initiallife === 0){
      
        soundSample.stop();
        this.add.image(config.width/2, 200, 'death');
        const restartButton = this.add.image(config.width/2, 400, 'restart');
        initiallife += 3;
        score = 0;
        restartButton.setInteractive();
        restartButton.on('pointerdown', () => { 
          this.scene.start("playGame");
        
        });
        const quitButton = this.add.image(config.width/2, 460 , 'quit');
        quitButton.setInteractive();
        quitButton.on('pointerdown', () => { 
          this.scene.start("bootGame");
        });
      }
      
    }
    update(){

    }
  }
function onEvent2 ()
{
        this.initialTime2 -= 1; // One second
        if (this.initialTime2 === 0){
          if(map_counter === 1){
            this.scene.start("playGame");
        }
          if(map_counter === 2) {
            this.scene.start("playGame2");
          }
          if(map_counter === 3) {
            this.scene.start("playGame3");
          }
          if(map_counter === 4) {
            this.scene.start("playGame4");
          }
          if(map_counter === 5) {
            this.scene.start("playGame5");
          }
        }
      }
    
  