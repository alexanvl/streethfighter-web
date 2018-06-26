import React, { Component } from 'react';
import Matter from 'matter-js';
import { AudioPlayer, Loop, Stage, KeyListener, World } from 'react-game-kit';
import config from '../../config';
import Character from './components/character';

const GAME_DATA = config.GAME_DATA;

class Fight extends Component {
  constructor(props) {
    super(props);

    this.keyListener = new KeyListener();
    // this.fighters = [
    //   { name: 'Vitalik', health: 2000 },
    //   { name: 'Satoshi', health: 2000 }
    // ];
  }

  componentDidMount() {
    // this.player = new AudioPlayer('/assets/music.wav', () => {
    //   this.stopMusic = this.player.play({
    //     loop: true,
    //     offset: 1,
    //     volume: 0.35,
    //   });
    // });
    this.keyListener.subscribe([
      // this.keyListener.LEFT,
      // this.keyListener.RIGHT,
      // this.keyListener.UP,
      // this.keyListener.SPACE,
      GAME_DATA.keys.punch,
      GAME_DATA.keys.kick,
      GAME_DATA.keys.super,
    ]);
  }

  componentWillUnmount() {
    // this.stopMusic();
    this.keyListener.unsubscribe();
  }

  render() {
    const { gameReducer: { gameState, channelParty } } = this.props;
    const stageStyle = {
      background: "url('/src/assets/backgroundFight.jpg') top center fixed",
    };
    return (
      <Loop>
        <Stage style={ stageStyle }>
          <World onInit={this.physicsInit}>
            <Character
              fighter={GAME_DATA.fighters[0].name}
              isActive={channelParty === 'A'}
              side="l"
              keys={this.keyListener}
              health={gameState.healthA || GAME_DATA.initialGameState.startHealth}
            />
            <Character
              fighter={GAME_DATA.fighters[1].name}
              isActive={channelParty === 'B'}
              side="r"
              keys={this.keyListener}
              health={gameState.healthB || GAME_DATA.initialGameState.startHealth}
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
}

export default Fight;
