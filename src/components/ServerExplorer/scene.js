import {
  ACESFilmicToneMapping,
  CanvasTexture,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PCFShadowMap,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { createServerModel } from './model'

export function createServerScene(canvas, options = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
    preserveDrawingBuffer: true,
  })
  try {
    return initializeScene(renderer, canvas, options)
  } catch (error) {
    renderer.dispose()
    renderer.forceContextLoss()
    throw error
  }
}

function initializeScene(renderer, canvas, options) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFShadowMap
  const scene = new Scene()
  const camera = new OrthographicCamera(-3.5, 3.5, 2.45, -2.45, 0.1, 30)
  camera.position.set(5.8, 3.9, 6.8)
  camera.lookAt(0, 0.35, 0)
  const model = createServerModel(options.palette)
  scene.add(model.group)

  const room = new RoomEnvironment()
  const generator = new PMREMGenerator(renderer)
  const environment = generator.fromScene(room, 0.08)
  scene.environment = environment.texture
  room.dispose()
  generator.dispose()
  const key = new DirectionalLight(0xfffcf3, 3)
  key.position.set(-4, 7, 5)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.left = -4
  key.shadow.camera.right = 4
  key.shadow.camera.top = 4
  key.shadow.camera.bottom = -4
  key.shadow.bias = -0.0003
  key.shadow.normalBias = 0.025
  key.shadow.radius = 3
  const rim = new DirectionalLight(0xcbd8ff, 2.4)
  rim.position.set(4, 3, -3)
  scene.add(key, rim, new HemisphereLight(0xfffcf4, 0x566274, 1.5))
  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 64
  shadowCanvas.height = 64
  const shadowContext = shadowCanvas.getContext('2d')
  const gradient = shadowContext.createRadialGradient(32, 32, 1, 32, 32, 31)
  gradient.addColorStop(0, 'rgba(0,0,0,0.3)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  shadowContext.fillStyle = gradient
  shadowContext.fillRect(0, 0, 64, 64)
  const shadowTexture = new CanvasTexture(shadowCanvas)
  const floorGeometry = new PlaneGeometry(6, 4)
  const floorMaterial = new MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  })
  const floor = new Mesh(floorGeometry, floorMaterial)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -1.24
  scene.add(floor)

  let viewportAspect = 1.5
  let active = options.active !== false
  let reducedMotion = Boolean(options.reducedMotion)
  let disposed = false
  let contextLost = false
  let firstRender = true
  let frame = null
  let transition = null
  let rotation = ((options.rotation || 0) * Math.PI) / 180
  let exploded = options.exploded ? 1 : 0
  const target = { rotation, exploded }
  model.setHighlight(options.highlight || 'gpus')

  function frameModel() {
    const halfHeight = Math.max(2.45 + exploded * 0.55, 3.2 / viewportAspect)
    camera.left = -halfHeight * viewportAspect
    camera.right = halfHeight * viewportAspect
    camera.top = halfHeight
    camera.bottom = -halfHeight
    camera.updateProjectionMatrix()
  }
  function applyPose() {
    frameModel()
    model.group.rotation.y = rotation
    model.setExploded(exploded)
  }
  function cancelFrame() {
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
  }
  function requestRender() {
    if (!active || disposed || contextLost || frame !== null) return
    frame = requestAnimationFrame(render)
  }
  function render(time) {
    frame = null
    if (!active || disposed || contextLost) return
    if (transition) {
      if (transition.start === null) transition.start = time
      const progress = Math.min(1, (time - transition.start) / 360)
      const eased = 1 - Math.pow(1 - progress, 3)
      rotation =
        transition.rotation + (target.rotation - transition.rotation) * eased
      exploded =
        transition.exploded + (target.exploded - transition.exploded) * eased
      if (progress === 1) transition = null
    }
    applyPose()
    renderer.render(scene, camera)
    if (firstRender) {
      firstRender = false
      options.onReady?.()
    }
    if (transition) requestRender()
  }
  function updatePose(immediate = false) {
    if (reducedMotion || immediate) {
      rotation = target.rotation
      exploded = target.exploded
      transition = null
    } else {
      transition = { rotation, exploded, start: null }
    }
    requestRender()
  }
  function handleContextLost(event) {
    event.preventDefault()
    contextLost = true
    cancelFrame()
    options.onUnavailable?.()
  }
  function handleContextRestored() {
    contextLost = false
    firstRender = true
    updatePose(true)
  }
  canvas.addEventListener('webglcontextlost', handleContextLost)
  canvas.addEventListener('webglcontextrestored', handleContextRestored)

  return {
    resize(width, height) {
      if (disposed || !width || !height) return
      viewportAspect = width / height
      frameModel()
      renderer.setSize(width, height, false)
      requestRender()
    },
    setRotation(degrees, immediate = false) {
      const next = (degrees * Math.PI) / 180
      const difference = Math.atan2(
        Math.sin(next - rotation),
        Math.cos(next - rotation)
      )
      if (Math.abs(difference) < 0.000001) return
      target.rotation = rotation + difference
      updatePose(immediate)
    },
    setExploded(value) {
      target.exploded = value ? 1 : 0
      updatePose()
    },
    setHighlight(value) {
      model.setHighlight(value)
      requestRender()
    },
    setReducedMotion(value) {
      reducedMotion = Boolean(value)
      updatePose(true)
    },
    setActive(value) {
      active = Boolean(value)
      if (!active) cancelFrame()
      else {
        if (transition) transition = { rotation, exploded, start: null }
        requestRender()
      }
    },
    dispose() {
      if (disposed) return
      disposed = true
      cancelFrame()
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      model.dispose()
      floorGeometry.dispose()
      floorMaterial.dispose()
      shadowTexture.dispose()
      key.shadow.map?.dispose()
      environment.dispose()
      scene.clear()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
