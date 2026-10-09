import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  OrthographicCamera,
  Path,
  PCFSoftShadowMap,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  Shape,
  SRGBColorSpace,
  TorusGeometry,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

function monogramShape() {
  const shape = new Shape()
  shape.moveTo(-0.99, -1.29)
  shape.lineTo(-0.99, 1.29)
  shape.quadraticCurveTo(-0.99, 1.35, -0.93, 1.35)
  shape.lineTo(-0.02, 1.35)
  shape.bezierCurveTo(0.85, 1.35, 1.22, 0.82, 1.22, 0)
  shape.bezierCurveTo(1.22, -0.82, 0.85, -1.35, -0.02, -1.35)
  shape.lineTo(-0.93, -1.35)
  shape.quadraticCurveTo(-0.99, -1.35, -0.99, -1.29)

  const cutout = new Path()
  cutout.moveTo(-0.43, -0.77)
  cutout.lineTo(-0.04, -0.77)
  cutout.bezierCurveTo(0.42, -0.77, 0.65, -0.49, 0.65, 0)
  cutout.bezierCurveTo(0.65, 0.49, 0.42, 0.77, -0.04, 0.77)
  cutout.lineTo(-0.43, 0.77)
  cutout.quadraticCurveTo(-0.46, 0.77, -0.46, 0.74)
  cutout.lineTo(-0.46, -0.74)
  cutout.quadraticCurveTo(-0.46, -0.77, -0.43, -0.77)
  shape.holes.push(cutout)
  return shape
}

const arrangements = [
  { separation: 0.19, x: -0.2, y: -0.48, z: -0.12 },
  { separation: 0.38, x: -0.13, y: -0.72, z: -0.04 },
  { separation: 0.27, x: -0.28, y: 0.32, z: 0.1 },
]

export function createSignalScene(canvas, options = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
    // Retain the last frame across compositor repaints while rendering is idle.
    preserveDrawingBuffer: true,
  })
  try {
    return buildSignalScene(renderer, canvas, options)
  } catch (error) {
    renderer.dispose()
    renderer.forceContextLoss()
    throw error
  }
}

function buildSignalScene(renderer, canvas, options) {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  const scene = new Scene()
  const camera = new OrthographicCamera(-2.5, 2.5, 1.8, -1.8, 0.1, 30)
  camera.position.set(0, 0.8, 8)
  camera.lookAt(0, -0.08, 0)

  const environmentRoom = new RoomEnvironment()
  const environmentGenerator = new PMREMGenerator(renderer)
  const environment = environmentGenerator.fromScene(environmentRoom, 0.045)
  scene.environment = environment.texture
  environmentRoom.dispose()
  environmentGenerator.dispose()

  const cream = new MeshPhysicalMaterial({
    color: 0xb4ae95,
    roughness: 0.48,
    metalness: 0.1,
    clearcoat: 0.15,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.5,
  })
  const graphite = new MeshStandardMaterial({
    color: 0x1c302e,
    metalness: 0.72,
    roughness: 0.34,
    envMapIntensity: 0.8,
  })
  const graphiteEdge = new MeshStandardMaterial({
    color: 0x35453f,
    metalness: 0.8,
    roughness: 0.24,
  })
  const ochre = new MeshStandardMaterial({
    color: 0xb89843,
    metalness: 0.7,
    roughness: 0.29,
    envMapIntensity: 0.8,
  })
  const recess = new MeshStandardMaterial({
    color: 0x253732,
    metalness: 0.4,
    roughness: 0.6,
  })

  const assembly = new Group()
  assembly.position.set(-0.04, 0.08, 0)
  scene.add(assembly)
  const plateGeometry = new ExtrudeGeometry(monogramShape(), {
    depth: 0.075,
    bevelEnabled: true,
    bevelThickness: 0.024,
    bevelSize: 0.024,
    bevelSegments: 4,
    curveSegments: 40,
    steps: 1,
  })
  plateGeometry.translate(0, 0, -0.0375)

  const plates = Array.from({ length: 6 }, (_, index) => {
    const face =
      index === 0 || index === 5 ? cream : index === 2 ? ochre : graphite
    const edge = index === 5 ? ochre : graphiteEdge
    const plate = new Mesh(plateGeometry, [face, edge])
    plate.castShadow = true
    plate.receiveShadow = true
    assembly.add(plate)
    return plate
  })

  const details = new Group()
  plates[5].add(details)
  const fastenerGeometry = new CylinderGeometry(0.041, 0.041, 0.014, 24)
  fastenerGeometry.rotateX(Math.PI / 2)
  const collarGeometry = new TorusGeometry(0.052, 0.007, 8, 32)
  const slotGeometry = new BoxGeometry(0.043, 0.009, 0.002)
  for (const vertical of [-1.105, 1.105]) {
    const collar = new Mesh(collarGeometry, ochre)
    collar.position.set(-0.731, vertical, 0.07)
    details.add(collar)
    const fastener = new Mesh(fastenerGeometry, graphiteEdge)
    fastener.position.set(-0.731, vertical, 0.07)
    fastener.castShadow = true
    details.add(fastener)
    const slot = new Mesh(slotGeometry, recess)
    slot.position.set(-0.731, vertical, 0.079)
    slot.rotation.z = -0.5
    details.add(slot)
  }
  const grooveGeometry = new BoxGeometry(0.14, 0.012, 0.003)
  for (let index = 0; index < 3; index += 1) {
    const groove = new Mesh(grooveGeometry, graphite)
    groove.position.set(-0.73, 0.07 - index * 0.055, 0.063)
    details.add(groove)
  }

  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 128
  shadowCanvas.height = 128
  const shadowContext = shadowCanvas.getContext('2d')
  const shadowGradient = shadowContext.createRadialGradient(
    64,
    64,
    3,
    64,
    64,
    62
  )
  shadowGradient.addColorStop(0, 'rgba(17, 37, 30, 0.25)')
  shadowGradient.addColorStop(0.35, 'rgba(17, 37, 30, 0.14)')
  shadowGradient.addColorStop(1, 'rgba(17, 37, 30, 0)')
  shadowContext.fillStyle = shadowGradient
  shadowContext.fillRect(0, 0, 128, 128)
  const contactTexture = new CanvasTexture(shadowCanvas)
  contactTexture.colorSpace = SRGBColorSpace
  const contactShadow = new Mesh(
    new PlaneGeometry(4.4, 3.6),
    new MeshBasicMaterial({
      map: contactTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    })
  )
  contactShadow.rotation.x = -Math.PI / 2
  contactShadow.position.set(0.12, -1.52, 0)
  scene.add(contactShadow)

  const keyLight = new DirectionalLight(0xfff5d9, 2.4)
  keyLight.position.set(-3, 5, 6)
  keyLight.castShadow = true
  keyLight.shadow.mapSize.set(2048, 2048)
  keyLight.shadow.camera.left = -3
  keyLight.shadow.camera.right = 3
  keyLight.shadow.camera.top = 3
  keyLight.shadow.camera.bottom = -3
  keyLight.shadow.camera.near = 0.5
  keyLight.shadow.camera.far = 16
  keyLight.shadow.normalBias = 0.025
  keyLight.shadow.bias = -0.0003
  keyLight.shadow.radius = 3
  scene.add(keyLight)
  const rimLight = new DirectionalLight(0xf2dba2, 2.4)
  rimLight.position.set(4, 1.5, -3)
  scene.add(rimLight)
  const fillLight = new DirectionalLight(0xd2e4df, 1.1)
  fillLight.position.set(2, 0.2, 5)
  scene.add(fillLight)
  scene.add(new HemisphereLight(0xfff7e4, 0x334a43, 1.4))

  let selection = MathUtils.clamp(options.selected || 0, 0, 2)
  let reducedMotion = Boolean(options.reducedMotion)
  let active = options.active !== false
  let disposed = false
  let contextLost = false
  let frame = null
  let deadline = 0
  let lastTime = 0
  let firstRender = true
  let pointer = { x: 0, y: 0 }
  let separation = arrangements[selection].separation
  const rotation = { ...arrangements[selection] }

  function targets() {
    const arrangement = arrangements[selection]
    return {
      separation: arrangement.separation,
      x: arrangement.x + (reducedMotion ? 0 : pointer.y * 0.12),
      y: arrangement.y + (reducedMotion ? 0 : pointer.x * 0.15),
      z: arrangement.z,
    }
  }

  function applyPose(target, interpolation) {
    separation = MathUtils.lerp(separation, target.separation, interpolation)
    rotation.x = MathUtils.lerp(rotation.x, target.x, interpolation)
    rotation.y = MathUtils.lerp(rotation.y, target.y, interpolation)
    rotation.z = MathUtils.lerp(rotation.z, target.z, interpolation)
    assembly.rotation.set(rotation.x, rotation.y, rotation.z)
    plates.forEach((plate, index) => {
      plate.position.z = (index - 2.5) * separation
    })
  }

  function renderFrame(time) {
    frame = null
    if (disposed || !active || contextLost) return
    const target = targets()
    const finish = reducedMotion || time >= deadline
    const elapsed = lastTime ? Math.min(time - lastTime, 40) : 16
    lastTime = time
    applyPose(target, finish ? 1 : 1 - Math.exp(-elapsed / 80))
    renderer.render(scene, camera)
    if (firstRender) {
      firstRender = false
      options.onReady?.()
    }
    if (!finish) frame = requestAnimationFrame(renderFrame)
  }

  function requestRender(duration = 0) {
    if (disposed || !active || contextLost) return
    deadline = performance.now() + (reducedMotion ? 0 : duration)
    if (frame === null) {
      lastTime = 0
      frame = requestAnimationFrame(renderFrame)
    }
  }

  function pause() {
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
  }

  function handleContextLost(event) {
    event.preventDefault()
    contextLost = true
    pause()
    options.onUnavailable?.()
  }

  function handleContextRestored() {
    contextLost = false
    firstRender = true
    requestRender()
  }

  canvas.addEventListener('webglcontextlost', handleContextLost)
  canvas.addEventListener('webglcontextrestored', handleContextRestored)

  return {
    resize(width, height) {
      if (disposed || width <= 0 || height <= 0) return
      const halfHeight = 1.91
      const aspect = width / height
      camera.left = -halfHeight * aspect
      camera.right = halfHeight * aspect
      camera.top = halfHeight
      camera.bottom = -halfHeight
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      requestRender()
    },
    setSelected(value) {
      const nextSelection = MathUtils.clamp(
        Math.round(Number(value) || 0),
        0,
        2
      )
      if (selection === nextSelection) return
      selection = nextSelection
      requestRender(680)
    },
    setPointer(horizontal, vertical) {
      if (reducedMotion || !active) return
      pointer = {
        x: MathUtils.clamp(horizontal, -1, 1),
        y: MathUtils.clamp(vertical, -1, 1),
      }
      requestRender(300)
    },
    setActive(value) {
      active = value
      if (!active) pause()
      else requestRender()
    },
    setReducedMotion(value) {
      reducedMotion = value
      pointer = { x: 0, y: 0 }
      pause()
      requestRender()
    },
    dispose() {
      if (disposed) return
      disposed = true
      pause()
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      const geometries = new Set()
      const materials = new Set()
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry)
        if (Array.isArray(object.material)) {
          object.material.forEach((material) => materials.add(material))
        } else if (object.material) materials.add(object.material)
      })
      geometries.forEach((geometry) => geometry.dispose())
      materials.forEach((material) => material.dispose())
      contactTexture.dispose()
      keyLight.shadow.dispose()
      environment.dispose()
      scene.clear()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
