import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Matter from 'matter-js'
import { AudioPlayer, Body, Sprite } from 'react-game-kit'
import injectRedux from '../../../components/lib/injectRedux'
import config from '../../../config'
import HealthBar from './healthBar'

const GAME_DATA = config.GAME_DATA

export default injectRedux(
  class Character extends Component {
    static propTypes = {
      isActive: PropTypes.bool,
      fighter: PropTypes.string,
    }

    static contextTypes = {
      engine: PropTypes.object,
      scale: PropTypes.number,
    }

    constructor(props) {
      super(props)
      this.allowKeys = true
      this.state = {
        ...GAME_DATA.playerStates.idle,
        playerState: 'idle',
        spritePlaying: true,
        stageX: 0,
        characterPosition: {
          x: props.fighter === 'A' ? 0 : 400,
          y: 20
        },
        //characterHealth: props.health,
      }
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      const { fighter, gameReducer: { gameState }, isActive } = nextProps

      if (gameState[fighter] && !isActive) {
        const playerState = gameState[fighter].playerState

        if (prevState.playerState !== playerState) {
          const nextState = {
            ...GAME_DATA.playerStates[playerState],
            playerState,
          }
          return nextState
        }
      }

      return null
    }

    componentDidMount() {
      // this.jumpNoise = new AudioPlayer('/assets/jump.wav')
      // Start update loop
      Matter.Events.on(this.context.engine, 'afterUpdate', this.update)
      //this.props.firebaseActions.listenOn(this.props.fireChannel, this.makeMove)
      this.props.gameActions.listenGameOn()
      window.onbeforeunload = () => {
        this.props.gameActions.listenGameOff()
      }
    }

    componentWillUnmount() {
      this.props.listenGameOff()
    }

    componentDidUpdate() {
      //TODO support other movement
      // if (this.state.move.x) {
      //   this.move(this.state.move.x)
      // }
    }

    update = () => {
      const {
        gameReducer: {
          gameState
        },
        isActive,
      } = this.props
      const {
        playerState,
        spritePlaying
      } = this.state

      if (isActive && gameState.isMyTurn && this.allowKeys) {
        this.checkKeys()
      }

      if (!spritePlaying) {
        this.allowKeys = isActive
        this.setState(GAME_DATA.playerStates.idle)
        this.props.gameActions.setPlayerState('idle')
      }
    }

    checkKeys = () => {
      const keys = this.props.keys

      if (keys.isDown(GAME_DATA.keys.kick)) {
        this.action('kick')
      } else if (keys.isDown(GAME_DATA.keys.punch)) {
        this.action('punch')
      } else if (keys.isDown(GAME_DATA.keys.super)) {
       // this.loseHealth(2)
        this.action('super')
      } /*else if (keys.isDown(keys.LEFT)) {
        this.KO()
      } else if (keys.isDown(keys.RIGHT)) {
        this.victory()
      } else if (keys.isDown(keys.SPACE)) {
        this.block()
      }*/
    }

    move = x => {
      if (this.body)
        Matter.Body.setVelocity(this.body, { x, y: 0 })
    }

    action = (type) => {
      if (this.state.playerState !== type) {
        this.allowKeys = false
        this.props.keys.up({
          keyCode: GAME_DATA.keys[type] ,
          preventDefault: () => {}
        })
        this.setState(GAME_DATA.playerStates[type])
        this.props.gameActions.turn(type)
      }
    }

    // loseHealth = (point) => {
    //   this.setState({
    //     characterHealth: (this.state.characterHealth - 20 * point) >= 0 ? (this.state.characterHealth - 20 * point) : 0
    //   })
    // }

    KO = () => {
      this.setState({
        characterState: 6,
        repeat: false,
      })
    }

    // block = () => {
    //   this.setState({
    //     characterState: 4,
    //     repeat: false,
    //   })
    // }

    victory = () => {
      this.setState({
        characterState: 5,
        repeat: true,
      })
    }


    getWrapperStyles() {
      const { characterPosition, stageX } = this.state
      const { scale } = this.context
      const { x, y } = this.state.characterPosition
      const targetX = x + stageX

      return {
        position: 'absolute',
        transform: `translate(${targetX * scale}px, ${y * scale}px)`,
        transformOrigin: 'left top',
      }
    }

    handlePlayStateChanged = (state) => {
      this.setState({
        spritePlaying: state ? true : false,
      })
    }

    render() {
      const { fighter } = this.props
      const image = GAME_DATA.fighters[fighter].name
      const side = fighter === 'A' ? 'l' : 'r'
      const x = this.state.characterPosition.x

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
                if (r) this.body = r.body
              }}
            >
              <Sprite
                repeat={this.state.repeat}
                onPlayStateChanged={this.handlePlayStateChanged}
                src={"/src/images/fighter" + image+"_"+side+".png"}
                scale={this.context.scale}
                state={this.state.characterState}
                steps={[2, 2, 2, 2, 1, 2, 1]}
                tileHeight={600}
                tileWidth={600}
              />
            </Body>
          </div>
        </div>
      )
    }
  }
)

