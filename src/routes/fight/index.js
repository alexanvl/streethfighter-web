import React, { Component } from 'react'
import Matter from 'matter-js'
import { AudioPlayer, Loop, Stage, World, KeyListener } from 'react-game-kit'
import config from '../../config'
import Character from './components/character'

const GAME_DATA = config.GAME_DATA

class Fight extends Component {
  keyListener = new KeyListener()

  componentDidMount() {
    this.keyListener.subscribe([
      // this.keyListener.LEFT,
      // this.keyListener.RIGHT,
      // this.keyListener.UP,
      // this.keyListener.SPACE,
      GAME_DATA.keys.punch,
      GAME_DATA.keys.kick,
      GAME_DATA.keys.super,
    ])
  }

  componentWillUnmount() {
    this.keyListener.unsubscribe()
  }

  render() {
    const { gameReducer: { gameState, channelParty } } = this.props
    const stageStyle = {
      background: "url('/src/assets/backgroundFight.jpg') top center fixed",
    }
    return (
      <Loop>
        <Stage style={ stageStyle }>
          <World onInit={this.physicsInit}>
            <Character
              fighter='A'
              isActive={channelParty === 'A'}
              //playerData={gameState.A}
              keys={this.keyListener}
            />
            <Character
              fighter='B'
              isActive={channelParty === 'B'}
              //playerData={gameState.B}
              keys={this.keyListener}
            />
          </World>
        </Stage>
      </Loop>
    )
  }

  physicsInit(engine) {
    const ground = Matter.Bodies.rectangle(0, 448, 1024 * 3, 64, {
      isStatic: true,
    })

    const leftWall = Matter.Bodies.rectangle(-64, 288, 64, 576, {
      isStatic: true,
    })

    const rightWall = Matter.Bodies.rectangle(3008, 288, 64, 576, {
      isStatic: true,
    })

    Matter.World.addBody(engine.world, ground)
    Matter.World.addBody(engine.world, leftWall)
    Matter.World.addBody(engine.world, rightWall)
  }
}

export default Fight
