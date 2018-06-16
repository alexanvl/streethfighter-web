import React, { Component } from 'react';
import Matter from 'matter-js';
import { AudioPlayer, Loop, Stage, KeyListener, World } from 'react-game-kit';
import Character from './components/character';

class Fight extends Component {
  // static propTypes = {
  //   onLeave: PropTypes.func,
  // };

  componentDidMount() {
    // this.player = new AudioPlayer('/assets/music.wav', () => {
    //   this.stopMusic = this.player.play({
    //     loop: true,
    //     offset: 1,
    //     volume: 0.35,
    //   });
    // });
    this.KeyListener.subscribe([
      this.KeyListener.LEFT,
      this.KeyListener.RIGHT,
      this.KeyListener.UP,
      this.KeyListener.SPACE,
      80,
      75,
      85
    ]);
    console.log(window.whichParty);
  }

  componentWillUnmount() {
    // this.stopMusic();
    this.keyListener.unsubscribe();
  }

  render() {
    // const bgStyles = {
    //   backgroundImage: "url('./src/assets/background.jpg') top center fixed"
    // };
    let stageStyle = {
      background: "url('/src/assets/backgroundFight.jpg') top center fixed",
    };
    return (
      <Loop>
        <Stage style={ stageStyle }>
          <World onInit={this.physicsInit}>
            <Character
              fighter={this.fighters[0].name}
              isActive={window.whichParty === 'A'}
              side="l"
              keys={this.KeyListener}
              health={this.fighters[0].health}
              fireChannel={'makeMoveA'}
            />
            <Character
              fighter={this.fighters[1].name}
              isActive={window.whichParty === 'B'}
              side="r"
              keys={this.KeyListener}
              health={this.fighters[1].health}
              fireChannel={'makeMoveB'}
            />
          </World>
        </Stage>
      </Loop>
    );
  }

  physicsInit(engine) {
    const ground = Matter.Bodies.rectangle(0, 448, 1024 * 3, 64, {
      isStatic: true,
    });

    const leftWall = Matter.Bodies.rectangle(-64, 288, 64, 576, {
      isStatic: true,
    });

    const rightWall = Matter.Bodies.rectangle(3008, 288, 64, 576, {
      isStatic: true,
    });

    Matter.World.addBody(engine.world, ground);
    Matter.World.addBody(engine.world, leftWall);
    Matter.World.addBody(engine.world, rightWall);
  };

  constructor(props) {
    super(props);
    this.KeyListener = new KeyListener();
    let V = {
      name: 'Vitalik',
      health: 2000
    }
    let S = {
      name: 'Satoshi',
      health: 2000
    }
    this.fighters = [V, S];
  }
}

export default Fight;
