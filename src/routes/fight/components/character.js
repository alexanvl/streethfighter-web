import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Matter from 'matter-js';
import { AudioPlayer, Body, Sprite } from 'react-game-kit';
import injectRedux from '../../../components/lib/injectRedux';
import config from '../../../config';
import HealthBar from './healthBar';

const GAME_DATA = config.GAME_DATA;

export default injectRedux(
  class Character extends Component {
    static propTypes = {
      keys: PropTypes.object,
      side: PropTypes.string,
      isActive: PropTypes.bool,
      fighter: PropTypes.string,
      health: PropTypes.number
    };

    static contextTypes = {
      engine: PropTypes.object,
      scale: PropTypes.number,
    };

    constructor(props) {
      super(props);

      this.state = {
        characterState: GAME_DATA.characterStates.idle,
        loop: true,
        spritePlaying: true,
        stageX: 0,
        characterPosition: {
          x: props.side == 'l' ? 0 : 400,
          y: 20
        },
        characterHealth: props.health,
      };
    }

    componentDidMount() {
      // this.jumpNoise = new AudioPlayer('/assets/jump.wav');
      // Start update loop
      Matter.Events.on(this.context.engine, 'afterUpdate', this.update);
      //this.props.firebaseActions.listenOn(this.props.fireChannel, this.makeMove);
      this.props.gameActions.listenGameOn();
      window.onbeforeunload = () => {
        this.props.gameActions.listenGameOff();
      };
    }

    componentWillUnmount() {
      this.props.listenGameOff();
    }

    // makeMove = (fireMoves) => {
    //   if(!this.turnAvailable || !fireMove) {
    //     return;
    //   }
    //   this.fireMoves = fireMoves.moves || '';
    //   const move = fireMoves.moves.charAt(fireMoves.moves.length - 1);
    //   if(!move) {
    //     return;
    //   }
    //   const moves = {
    //     '0': 'punch',
    //     '1': 'kick',
    //     '3': 'ultra',
    //   };
    //   this[moves[move]](true);
    // }

    update = () => {
      const { gameReducer: { gameState }, isActive } = this.props;

      if (isActive && gameState.isMyTurn) {
        this.checkKeys();
      }

      if (!this.state.spritePlaying) {
        this.setState({
          characterState: GAME_DATA.characterStates.idle,
          repeat: true,
        });
      }
    }

    checkKeys = () => {
      const { keys } = this.props;

      if (keys.isDown(GAME_DATA.keys.kick)) {
        this.kick();
      } else if (keys.isDown(GAME_DATA.keys.punch)) {
        this.move(5);
        this.punch();
      } else if (keys.isDown(GAME_DATA.keys.super)) {
        this.loseHealth(2);
        this.move(5);
        this.ultra();
      } /*else if (keys.isDown(keys.LEFT)) {
        this.KO();
      } else if (keys.isDown(keys.RIGHT)) {
        this.victory();
      } else if (keys.isDown(keys.SPACE)) {
        this.block();
      }*/
    }

    move = x => {
      if (this.body)
        Matter.Body.setVelocity(this.body, { x, y: 0 });
    }

    kick = () => {
      this.move(-5);
      this.setState({
        characterState: GAME_DATA.characterStates.kick,
        repeat: false,
      });

      // if (!skipFire) {
      //   this.props.firebaseActions.update(this.props.fireChannel, { moves: this.fireMoves + '1' });
      //   this.fireMoves = this.fireMoves + '1';
      // }
    }

    punch = (skipFire) => {
      this.setState({
        characterState: 0,
        repeat: false,
      });
      this.turnAvailable = false;
      if (!skipFire) {
        this.props.firebaseActions.update(this.props.fireChannel, { moves: this.fireMoves + '0' });
        this.fireMoves = this.fireMoves + '0';
      }
    }

    ultra = (skipFire) => {
      this.setState({
        characterState: 3,
        repeat: false,
      });
      this.turnAvailable = false;
      if (!skipFire) {
        this.props.firebaseActions.update(this.props.fireChannel, { moves: this.fireMoves + '3' });
        this.fireMoves = this.fireMoves + '3';
      }
    }

    loseHealth = (point) => {
      this.setState({
        characterHealth: (this.state.characterHealth - 20 * point) >= 0 ? (this.state.characterHealth - 20 * point) : 0
      });
    }

    KO = () => {
      this.setState({
        characterState: 6,
        repeat: false,
      });
    };

    // block = () => {
    //   this.setState({
    //     characterState: 4,
    //     repeat: false,
    //   });
    // };

    victory = () => {
      this.setState({
        characterState: 5,
        repeat: true,
      });
    };


    getWrapperStyles() {
      const { characterPosition, stageX } = this.state;
      const { scale } = this.context;
      const { x, y } = this.state.characterPosition;
      const targetX = x + stageX;

      return {
        position: 'absolute',
        transform: `translate(${targetX * scale}px, ${y * scale}px)`,
        transformOrigin: 'left top',
      };
    }

    handlePlayStateChanged = (state) => {
      this.setState({
        spritePlaying: state ? true : false,
      });
    }

    render() {
      const { side, fighter } = this.props;
      const x = this.state.characterPosition.x;

      return (
        <div>
          <div style={this.getWrapperStyles()}>
            <HealthBar
              health={this.state.characterHealth}
            />
            <Body
              args={[x, 84, 600, 600]}
              inertia={Infinity}
              ref={r => {
                if (r) this.body = r.body;
              }}
            >
              <Sprite
                repeat={this.state.repeat}
                onPlayStateChanged={this.handlePlayStateChanged}
                src={"/src/images/fighter"+fighter+"_"+side+".png"}
                scale={this.context.scale}
                state={this.state.characterState}
                steps={[2, 2, 2, 2, 1, 2, 1]}
                tileHeight={600}
                tileWidth={600}
              />
            </Body>
          </div>
        </div>
      );
    }
  }
);

