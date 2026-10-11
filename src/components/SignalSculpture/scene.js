import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CanvasTexture,
  Color,
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
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

function monogramShape(inset = 0) {
  const shape = new Shape()
  const left = -0.99 + inset
  const top = 1.35 - inset
  const right = 1.22 - inset
  shape.moveTo(left, -top + 0.15)
  shape.lineTo(left, top - 0.15)
  shape.quadraticCurveTo(left, top, left + 0.15, top)
  shape.lineTo(-0.02, top)
  shape.bezierCurveTo(0.85 - inset, top, right, 0.82, right, 0)
  shape.bezierCurveTo(right, -0.82, 0.85 - inset, -top, -0.02, -top)
  shape.lineTo(left + 0.15, -top)
  shape.quadraticCurveTo(left, -top, left, -top + 0.15)

  const cutout = new Path()
  const innerLeft = -0.46 - inset
  const innerTop = 0.77 + inset
  const innerRight = 0.65 + inset
  cutout.moveTo(innerLeft + 0.07, -innerTop)
  cutout.lineTo(-0.04, -innerTop)
  cutout.bezierCurveTo(0.42, -innerTop, innerRight, -0.49, innerRight, 0)
  cutout.bezierCurveTo(innerRight, 0.49, 0.42, innerTop, -0.04, innerTop)
  cutout.lineTo(innerLeft + 0.07, innerTop)
  cutout.quadraticCurveTo(innerLeft, innerTop, innerLeft, innerTop - 0.07)
  cutout.lineTo(innerLeft, -innerTop + 0.07)
  cutout.quadraticCurveTo(innerLeft, -innerTop, innerLeft + 0.07, -innerTop)
  shape.holes.push(cutout)
  return shape
}

const arrangements = [
  { separation: 0.235, x: -0.23, y: -0.58, z: -0.1, fan: 0, step: 0 },
  { separation: 0.43, x: -0.16, y: -0.72, z: -0.04, fan: 0, step: 0 },
  { separation: 0.3, x: -0.29, y: 0.38, z: 0.02, fan: 0.078, step: 0.052 },
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
  renderer.toneMappingExposure = 0.9
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap

  const palette = {
    ink: '#172b45',
    paper: '#f5f0e7',
    accent: '#f49b82',
    display: '#203753',
    edge: '#a5b4c4',
    light: '#f7f2e9',
    'display-muted': '#c9d8e8',
    ...options.palette,
  }
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
    color: new Color(palette.paper).multiplyScalar(0.72),
    roughness: 0.38,
    metalness: 0.14,
    clearcoat: 0.3,
    clearcoatRoughness: 0.3,
    envMapIntensity: 0.5,
  })
  const graphite = new MeshStandardMaterial({
    color: palette.display,
    metalness: 0.65,
    roughness: 0.29,
    envMapIntensity: 0.8,
  })
  const graphiteEdge = new MeshStandardMaterial({
    color: palette.edge,
    metalness: 0.82,
    roughness: 0.25,
    envMapIntensity: 0.65,
  })
  const accent = new MeshStandardMaterial({
    color: palette.accent,
    metalness: 0.28,
    roughness: 0.38,
    envMapIntensity: 0.65,
  })
  const recess = new MeshStandardMaterial({
    color: palette.ink,
    metalness: 0.3,
    roughness: 0.6,
  })

  const assembly = new Group()
  assembly.position.set(-0.04, 0.08, 0)
  scene.add(assembly)
  const plateGeometry = new ExtrudeGeometry(monogramShape(), {
    depth: 0.11,
    bevelEnabled: true,
    bevelThickness: 0.036,
    bevelSize: 0.036,
    bevelSegments: 5,
    curveSegments: 48,
    steps: 1,
  })
  plateGeometry.translate(0, 0, -0.055)

  const plates = Array.from({ length: 6 }, (_, index) => {
    const face = index === 2 ? accent : graphite
    const plate = new Mesh(plateGeometry, [face, graphiteEdge])
    plate.castShadow = true
    plate.receiveShadow = true
    assembly.add(plate)
    return plate
  })

  // A smaller rounded face leaves a real metal lip around both contours.
  const faceGeometry = new ExtrudeGeometry(monogramShape(0.055), {
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.013,
    bevelSize: 0.015,
    bevelSegments: 4,
    curveSegments: 48,
    steps: 1,
  })
  for (const index of [0, 5]) {
    const face = new Mesh(faceGeometry, cream)
    face.position.z = index === 5 ? 0.071 : -0.071
    face.rotation.y = index === 5 ? 0 : Math.PI
    // Mirroring the back face preserves the D outline when it turns away.
    if (index === 0) face.scale.x = -1
    face.castShadow = true
    face.receiveShadow = true
    plates[index].add(face)
  }

  const connectorGeometry = new CylinderGeometry(0.038, 0.038, 1, 20)
  connectorGeometry.rotateX(Math.PI / 2)
  const connectors = Array.from({ length: 5 }, (_, index) =>
    [-1.105, 1.105].map((vertical) => {
      const connector = new Mesh(connectorGeometry, graphiteEdge)
      connector.castShadow = true
      assembly.add(connector)
      return { mesh: connector, index, vertical }
    })
  ).flat()
  const connectorStart = new Vector3()
  const connectorEnd = new Vector3()
  const connectorDirection = new Vector3()
  const connectorAxis = new Vector3(0, 0, 1)

  const details = new Group()
  plates[5].add(details)
  const fastenerGeometry = new CylinderGeometry(0.041, 0.041, 0.014, 24)
  fastenerGeometry.rotateX(Math.PI / 2)
  const collarGeometry = new TorusGeometry(0.052, 0.007, 8, 32)
  const slotGeometry = new BoxGeometry(0.043, 0.009, 0.002)
  for (const vertical of [-1.105, 1.105]) {
    const collar = new Mesh(collarGeometry, accent)
    collar.position.set(-0.731, vertical, 0.119)
    details.add(collar)
    const fastener = new Mesh(fastenerGeometry, graphiteEdge)
    fastener.position.set(-0.731, vertical, 0.119)
    fastener.castShadow = true
    details.add(fastener)
    const slot = new Mesh(slotGeometry, recess)
    slot.position.set(-0.731, vertical, 0.128)
    slot.rotation.z = -0.5
    details.add(slot)
  }
  const grooveGeometry = new BoxGeometry(0.14, 0.012, 0.003)
  for (let index = 0; index < 3; index += 1) {
    const groove = new Mesh(grooveGeometry, graphite)
    groove.position.set(-0.73, 0.07 - index * 0.055, 0.103)
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
  shadowGradient.addColorStop(0, 'rgba(14, 29, 50, 0.23)')
  shadowGradient.addColorStop(0.35, 'rgba(14, 29, 50, 0.12)')
  shadowGradient.addColorStop(1, 'rgba(14, 29, 50, 0)')
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

  const keyLight = new DirectionalLight(palette.light, 2.1)
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
  const rimLight = new DirectionalLight(palette['display-muted'], 2.4)
  rimLight.position.set(4, 1.5, -3)
  scene.add(rimLight)
  const fillLight = new DirectionalLight(palette.paper, 0.85)
  fillLight.position.set(2, 0.2, 5)
  scene.add(fillLight)
  scene.add(new HemisphereLight(palette.light, palette.ink, 1.1))

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
  const pose = {
    ...arrangements[selection],
    pointerX: 0,
    pointerY: 0,
  }
  const velocity = Object.fromEntries(Object.keys(pose).map((key) => [key, 0]))

  function targets() {
    const arrangement = arrangements[selection]
    return {
      ...arrangement,
      x: arrangement.x + (reducedMotion ? 0 : pointer.y * 0.13),
      y: arrangement.y + (reducedMotion ? 0 : pointer.x * 0.18),
      pointerX: reducedMotion ? 0 : pointer.x,
      pointerY: reducedMotion ? 0 : pointer.y,
    }
  }

  function applyPose(target, elapsed, finish) {
    const seconds = Math.min(elapsed, 32) / 1000
    Object.keys(pose).forEach((key) => {
      if (finish) {
        pose[key] = target[key]
        velocity[key] = 0
      } else {
        velocity[key] += (target[key] - pose[key]) * 280 * seconds
        velocity[key] *= Math.exp(-22 * seconds)
        pose[key] += velocity[key] * seconds
      }
    })
    assembly.rotation.set(pose.x, pose.y, pose.z)
    plates.forEach((plate, index) => {
      const depth = index - 2.5
      plate.position.set(
        depth * (pose.step + pose.pointerX * 0.009),
        depth * (pose.step * 0.4 - pose.pointerY * 0.006),
        depth * pose.separation
      )
      plate.rotation.z = depth * pose.fan
    })
    connectors.forEach(({ mesh, index, vertical }) => {
      connectorStart
        .set(-0.731, vertical, 0)
        .applyEuler(plates[index].rotation)
        .add(plates[index].position)
      connectorEnd
        .set(-0.731, vertical, 0)
        .applyEuler(plates[index + 1].rotation)
        .add(plates[index + 1].position)
      connectorDirection.subVectors(connectorEnd, connectorStart)
      mesh.scale.z = connectorDirection.length()
      mesh.position.copy(connectorStart).add(connectorEnd).multiplyScalar(0.5)
      mesh.quaternion.setFromUnitVectors(
        connectorAxis,
        connectorDirection.normalize()
      )
    })
    keyLight.position.set(-3 + pose.pointerX * 1.4, 5 - pose.pointerY * 0.6, 6)
    contactShadow.scale.x = 1 + (pose.separation - 0.235) * 0.5
  }

  function renderFrame(time) {
    frame = null
    if (disposed || !active || contextLost) return
    const target = targets()
    const finish = reducedMotion || time >= deadline
    const elapsed = lastTime ? Math.min(time - lastTime, 40) : 16
    lastTime = time
    applyPose(target, elapsed, finish)
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
      const halfHeight = 2.03
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
      requestRender(780)
    },
    setPointer(horizontal, vertical) {
      if (reducedMotion || !active) return
      pointer = {
        x: MathUtils.clamp(horizontal, -1, 1),
        y: MathUtils.clamp(vertical, -1, 1),
      }
      requestRender(420)
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
