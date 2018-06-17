import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Matter from 'matter-js';
import { AudioPlayer, Body, Sprite } from 'react-game-kit';
import injectRedux from '../../../components/lib/injectRedux';
import HealthBar from './healthBar';

// @observer
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

    this.loopID = null;
    this.side = props.side;
    this.isActive = props.isActive;
    this.fighter = props.fighter;
    this.health = props.health;

    this.lastX = 0;

    this.state = {
      characterState: 2,
      loop: false,
      spritePlaying: true,
      stageX: 0,
      characterPosition: {
        x: this.side == 'l' ? 0 : 400,
        y: 20
      },
      characterHealth: 2000,
    };

    this.handlePlayStateChanged = this.handlePlayStateChanged.bind(this);
    this.punch = this.punch.bind(this);
    this.kick = this.kick.bind(this);
    window.kick = this.kick;
    this.ultra = this.ultra.bind(this);
    this.KO = this.KO.bind(this);
    this.victory = this.victory.bind(this);
    this.block = this.block.bind(this);
    this.checkKeys = this.checkKeys.bind(this);
    this.update = this.update.bind(this);
    this.chilling = true;
    this.turnAvailable = true;
    this.fireMoves = '';
  }

  componentDidMount() {
    // this.jumpNoise = new AudioPlayer('/assets/jump.wav');
    Matter.Events.on(this.context.engine, 'afterUpdate', this.update);
    this.props.firebaseActions.listenOn(this.props.fireChannel, this.makeMove);
  }

  makeMove = (fireMoves) => {
    if(!this.turnAvailable || !fireMoves || this.state.isActive) {
      return;
    }
    this.fireMoves = fireMoves.moves || '';
    const move = fireMoves.moves.charAt(fireMoves.moves.length - 1);
    if(!move) {
      return;
    }
    const moves = {
      '0': 'punch',
      '1': 'kick',
      '3': 'ultra',
    };
    this[moves[move]](true);
  }

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

  render() {
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
            ref={b => {
              this.body = b;
            }}
          >
            <Sprite
              repeat={this.state.repeat}
              onPlayStateChanged={this.handlePlayStateChanged}
              src={"/src/images/fighter"+this.fighter+"_"+this.side+".png"}
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

  handlePlayStateChanged(state) {
    this.setState({
      spritePlaying: state ? true : false,
    });
  };

  move(body, x) {
    Matter.Body.setVelocity(body, { x, y: 0 });
  };

  punch(skipFire) {
    this.setState({
      characterState: 0,
      repeat: false,
    });
    this.turnAvailable = false;
    if(!skipFire) {
      this.props.firebaseActions.update(this.props.fireChannel, { moves: this.fireMoves + '0' });
      this.fireMoves = this.fireMoves + '0';
    }
  };

  kick(skipFire) {
    this.setState({
      characterState: 1,
      repeat: false,
    });
    this.turnAvailable = false;
    if(!skipFire) {
      this.props.firebaseActions.update(this.props.fireChannel, { moves: this.fireMoves + '1' });
      this.fireMoves = this.fireMoves + '1';
    }
  };

  ultra(skipFire) {
    this.setState({
      characterState: 3,
      repeat: false,
    });
    this.turnAvailable = false;
    if(!skipFire) {
      this.props.firebaseActions.update(this.props.fireChannel, { moves: this.fireMoves + '3' });
      this.fireMoves = this.fireMoves + '3';
    }
  };

  KO() {
    this.setState({
      characterState: 6,
      repeat: false,
    });
  };

  block() {
    this.setState({
      characterState: 4,
      repeat: false,
    });
  };

  victory() {
    this.setState({
      characterState: 5,
      repeat: true,
    });
  };

  loseHealth(point) {
    this.setState({
      characterHealth: (this.state.characterHealth - 20 * point) >= 0 ? (this.state.characterHealth - 20 * point) : 0
    });
  }

  checkKeys(shouldMoveStageLeft, shouldMoveStageRight) {
    const { keys, store } = this.props;
    const { body } = this.body;
    if (this.isActive) {
      if (keys.isDown(75)) {
        this.move(body, -5);
        this.kick();
      } else if (keys.isDown(80)) {
        this.move(body, 5);
        this.punch();
      } else if (keys.isDown(85)) {
        this.loseHealth(2);
        this.move(body, 5);
        this.ultra();
      } else if (keys.isDown(keys.LEFT)) {
        this.KO();
      } else if (keys.isDown(keys.RIGHT)) {
        this.victory();
      } else if (keys.isDown(keys.SPACE)) {
        this.block();
      }
    }
  };

  update() {
    const { body } = this.body;

    if (this.turnAvailable) {
      this.checkKeys();
    }

    if (!this.state.spritePlaying) {
      this.setState({
        characterState: 2,
        repeat: true,
      });
      this.turnAvailable = true;
    }
  };
}

export default injectRedux(Character);
