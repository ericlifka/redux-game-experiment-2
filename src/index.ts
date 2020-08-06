import './index.scss'
import { createStore, applyMiddleware } from "redux"
import thunkMiddleware from 'redux-thunk'
import { createLogger as createLoggerMiddleware } from 'redux-logger'
import * as THREE from 'three'

const initialState = () => ({
  rotation: { x: 0, y: 0 }
})
const ROTATE_ACTION = "rotate_action"
function rotate() {
  return {
    type: ROTATE_ACTION
  }
}

function update(state = initialState(), action) {
  switch (action.type) {
    case ROTATE_ACTION:
      return {
        ...state,
        rotation: {
          x: state.rotation.x + 0.01,
          y: state.rotation.y + 0.01
        }
      }

    default:
      return state
  }
}

const middleware = applyMiddleware(thunkMiddleware, createLoggerMiddleware())
const { dispatch, getState, subscribe } = createStore(update, middleware)
const { innerWidth, innerHeight } = window

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, innerWidth / innerHeight, 0.1, 1000 )

const renderer = new THREE.WebGLRenderer()
renderer.setSize( innerWidth, innerHeight )
document.body.appendChild( renderer.domElement )

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
const cube = new THREE.Mesh( geometry, material )
scene.add( cube )

camera.position.z = 5

const animate = function () {
  requestAnimationFrame( animate )
  dispatch(rotate())

  const state = getState()

  cube.rotation.x = state.rotation.x
  cube.rotation.y = state.rotation.y

  renderer.render( scene, camera )
}

animate()
