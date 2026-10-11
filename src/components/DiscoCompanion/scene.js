import {
  ACESFilmicToneMapping,
  BoxGeometry,
  CanvasTexture,
  CapsuleGeometry,
  CatmullRomCurve3,
  CircleGeometry,
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
  PCFSoftShadowMap,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  Shape,
  SphereGeometry,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

const palettes = {
  paper: '#f3f2ed',
  ink: '#171a19',
  accent: '#364bff',
  signal: '#d8f36a',
  surface: '#e6e7df',
  edge: '#c5c9bd',
}
const selectionIndex = (value) =>
  MathUtils.clamp(Math.round(Number(value) || 0), 0, 2)

function roundedRectangle(width, height, radius) {
  const shape = new Shape()
  const left = -width / 2,
    right = width / 2,
    top = height / 2,
    bottom = -height / 2
  shape.moveTo(left + radius, bottom)
  shape.lineTo(right - radius, bottom)
  shape.quadraticCurveTo(right, bottom, right, bottom + radius)
  shape.lineTo(right, top - radius)
  shape.quadraticCurveTo(right, top, right - radius, top)
  shape.lineTo(left + radius, top)
  shape.quadraticCurveTo(left, top, left, top - radius)
  shape.lineTo(left, bottom + radius)
  shape.quadraticCurveTo(left, bottom, left + radius, bottom)
  return shape
}

function roundedPanel(width, height, radius = 0.07, depth = 0.035) {
  const geometry = new ExtrudeGeometry(
    roundedRectangle(width, height, radius),
    {
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.018,
      bevelThickness: 0.018,
      curveSegments: 12,
      steps: 1,
    }
  )
  geometry.translate(0, 0, -depth / 2)
  return geometry
}

function starGeometry() {
  const shape = new Shape()
  shape.moveTo(0, 0.16)
  for (const point of [
    [0.05, 0.05],
    [0.16, 0],
    [0.05, -0.05],
    [0, -0.16],
    [-0.05, -0.05],
    [-0.16, 0],
    [-0.05, 0.05],
  ]) {
    shape.lineTo(...point)
  }
  shape.closePath()
  return new ExtrudeGeometry(shape, {
    depth: 0.04,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.012,
    bevelSegments: 3,
    steps: 1,
  })
}

export function createCompanionScene(canvas, options = {}) {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'low-power',
    preserveDrawingBuffer: true,
  })
  try {
    return buildScene(renderer, canvas, options)
  } catch (error) {
    renderer.dispose()
    renderer.forceContextLoss()
    throw error
  }
}

function buildScene(renderer, canvas, options) {
  const palette = { ...palettes, ...options.palette }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
  renderer.setClearColor(0x000000, 0)
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.82
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  const scene = new Scene()
  const camera = new OrthographicCamera(-2.5, 2.5, 2.15, -2.15, 0.1, 30)
  camera.position.set(0, 0.55, 8)
  camera.lookAt(0, 0.15, 0)

  const room = new RoomEnvironment()
  const generator = new PMREMGenerator(renderer)
  const environment = generator.fromScene(room, 0.06)
  scene.environment = environment.texture
  room.dispose()
  generator.dispose()
  const materials = {
    citron: new MeshPhysicalMaterial({
      color: new Color(palette.signal).multiplyScalar(0.78),
      roughness: 0.62,
      metalness: 0.02,
      clearcoat: 0.14,
      clearcoatRoughness: 0.55,
      envMapIntensity: 0.45,
    }),
    cobalt: new MeshPhysicalMaterial({
      color: new Color(palette.accent).multiplyScalar(0.58),
      roughness: 0.55,
      metalness: 0.04,
      clearcoat: 0.12,
      clearcoatRoughness: 0.5,
      envMapIntensity: 0.3,
    }),
    charcoal: new MeshStandardMaterial({
      color: palette.ink,
      roughness: 0.58,
      metalness: 0.08,
      envMapIntensity: 0.5,
    }),
    visor: new MeshPhysicalMaterial({
      color: new Color(palette.ink).multiplyScalar(0.45),
      roughness: 0.26,
      metalness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      envMapIntensity: 0.23,
    }),
    chalk: new MeshStandardMaterial({
      color: palette.paper,
      roughness: 0.58,
      metalness: 0,
      envMapIntensity: 0.45,
    }),
    slate: new MeshStandardMaterial({
      color: palette.edge,
      roughness: 0.4,
      metalness: 0.28,
      envMapIntensity: 0.5,
    }),
    eyes: new MeshBasicMaterial({ color: palette.paper }),
  }
  const sphere = new SphereGeometry(1, 48, 32)
  const smallSphere = new SphereGeometry(1, 24, 16)
  const disc = new CircleGeometry(1, 48)
  const mesh = (
    geometry,
    material,
    parent,
    position = [0, 0, 0],
    scale = [1, 1, 1]
  ) => {
    const object = new Mesh(geometry, material)
    object.position.set(...position)
    object.scale.set(...scale)
    object.castShadow = true
    object.receiveShadow = true
    parent.add(object)
    return object
  }
  const character = new Group()
  scene.add(character)
  const body = mesh(
    sphere,
    materials.cobalt,
    character,
    [0, -0.44, 0],
    [0.68, 0.74, 0.5]
  )
  const head = new Group()
  head.position.set(0, 0.66, 0.035)
  character.add(head)
  mesh(sphere, materials.citron, head, [0, 0, 0], [1.02, 0.72, 0.64])
  mesh(sphere, materials.visor, head, [0, -0.035, 0.535], [0.84, 0.325, 0.245])

  for (const side of [-1, 1]) {
    mesh(
      sphere,
      materials.charcoal,
      head,
      [side * 0.96, -0.035, -0.01],
      [0.18, 0.39, 0.33]
    )
    mesh(
      sphere,
      materials.cobalt,
      head,
      [side * 1.07, -0.035, -0.015],
      [0.15, 0.34, 0.3]
    )
    mesh(
      sphere,
      materials.citron,
      head,
      [side * 1.16, -0.035, 0.015],
      [0.025, 0.14, 0.14]
    )
  }
  const headband = [
    [-1.02, 0.05, -0.11],
    [-0.78, 0.65, -0.18],
    [0, 0.81, -0.21],
    [0.78, 0.65, -0.18],
    [1.02, 0.05, -0.11],
  ].map((point) => new Vector3(...point))
  mesh(
    new TubeGeometry(new CatmullRomCurve3(headband), 32, 0.057, 8, false),
    materials.charcoal,
    head
  )
  const antenna = new Group()
  antenna.position.set(-0.32, 0.61, -0.04)
  head.add(antenna)
  const antennaPoints = [
    [0, 0, 0],
    [-0.09, 0.18, -0.015],
    [-0.06, 0.42, 0],
  ].map((point) => new Vector3(...point))
  mesh(
    new TubeGeometry(new CatmullRomCurve3(antennaPoints), 20, 0.03, 8, false),
    materials.charcoal,
    antenna
  )
  const star = mesh(starGeometry(), materials.cobalt, antenna, [-0.06, 0.5, 0])
  const eyeGeometry = new CapsuleGeometry(0.046, 0.17, 5, 16)
  const eyes = [-1, 1].map((side) =>
    mesh(
      eyeGeometry,
      materials.eyes,
      head,
      [side * 0.265, -0.035, 0.789],
      [1, 1, 0.5]
    )
  )
  const feet = [-1, 1].map((side) =>
    mesh(
      sphere,
      materials.charcoal,
      character,
      [side * 0.37, -1.17, 0.17],
      [0.29, 0.18, 0.42]
    )
  )
  const armGeometry = new CapsuleGeometry(0.115, 0.27, 5, 16)
  const arms = [-1, 1].map((side) => {
    const arm = new Group()
    arm.position.set(side * 0.61, -0.19, 0.04)
    character.add(arm)
    mesh(armGeometry, materials.charcoal, arm, [0, -0.2, 0])
    mesh(
      smallSphere,
      materials.citron,
      arm,
      [0, -0.43, 0.02],
      [0.15, 0.15, 0.14]
    )
    return arm
  })

  const record = new Group()
  record.position.set(0, -0.47, 0.475)
  character.add(record)
  mesh(sphere, materials.charcoal, record, [0, 0, 0], [0.295, 0.295, 0.055])
  for (const radius of [0.17, 0.205, 0.24]) {
    const groove = mesh(
      new TorusGeometry(radius, 0.004, 6, 48),
      materials.slate,
      record,
      [0, 0, 0.052]
    )
    groove.castShadow = false
  }
  mesh(disc, materials.citron, record, [0, 0, 0.059], [0.077, 0.077, 1])
  mesh(disc, materials.charcoal, record, [0, 0, 0.061], [0.017, 0.017, 1])

  mesh(
    roundedPanel(0.45, 0.63, 0.12, 0.22),
    materials.charcoal,
    character,
    [0, -0.42, -0.5]
  )
  const cable = new Group()
  cable.position.set(0.43, -0.42, -0.35)
  character.add(cable)
  const cablePoints = [
    [0, 0, 0],
    [0.48, -0.04, 0.03],
    [0.67, -0.3, 0.09],
    [0.53, -0.57, 0.18],
    [0.34, -0.43, 0.29],
  ].map((point) => new Vector3(...point))
  mesh(
    new TubeGeometry(new CatmullRomCurve3(cablePoints), 32, 0.048, 8, false),
    materials.cobalt,
    cable
  )
  const plug = mesh(
    roundedPanel(0.14, 0.2, 0.045, 0.11),
    materials.citron,
    cable,
    cablePoints[4].toArray()
  )
  plug.rotation.z = -0.45

  const projectGroups = [new Group(), new Group(), new Group()]
  projectGroups.forEach((group) => scene.add(group))
  const floatingObjects = []
  function floatObject(object, phase, amplitude = 0.035) {
    floatingObjects.push({
      object,
      baseline: object.position.y,
      phase,
      amplitude,
    })
  }
  function appPanel(parent, position, rotation, colored = false) {
    const panel = new Group()
    panel.position.set(...position)
    panel.rotation.set(...rotation)
    parent.add(panel)
    mesh(
      roundedPanel(0.65, 0.48),
      colored ? materials.cobalt : materials.chalk,
      panel
    )
    for (let index = 0; index < 3; index += 1) {
      mesh(
        smallSphere,
        colored ? materials.chalk : materials.charcoal,
        panel,
        [-0.22 + index * 0.07, 0.145, 0.048],
        [0.018, 0.018, 0.012]
      )
    }
    mesh(
      roundedPanel(0.19, 0.16, 0.035, 0.009),
      colored ? materials.citron : materials.cobalt,
      panel,
      [-0.16, -0.045, 0.05]
    )
    for (let index = 0; index < 2; index += 1) {
      mesh(
        new BoxGeometry(index ? 0.15 : 0.21, 0.022, 0.01),
        colored ? materials.chalk : materials.charcoal,
        panel,
        [0.12, -index * 0.095, 0.05]
      )
    }
    return panel
  }
  floatObject(
    appPanel(projectGroups[0], [-1.48, 0.44, 0.18], [0.03, 0.3, -0.18]),
    0
  )
  floatObject(
    appPanel(projectGroups[0], [1.46, 0.94, 0.02], [-0.04, -0.34, 0.14], true),
    2
  )
  const smallPanel = appPanel(
    projectGroups[0],
    [1.57, -0.52, 0.34],
    [0.04, -0.25, -0.13]
  )
  smallPanel.scale.setScalar(0.7)
  floatObject(smallPanel, 4, 0.025)

  const cloud = new Group()
  cloud.position.set(-1.48, 0.6, 0.02)
  projectGroups[1].add(cloud)
  mesh(sphere, materials.chalk, cloud, [-0.22, 0, 0], [0.24, 0.23, 0.2])
  mesh(sphere, materials.chalk, cloud, [0.015, 0.095, 0], [0.29, 0.3, 0.23])
  mesh(sphere, materials.chalk, cloud, [0.25, -0.005, 0], [0.2, 0.19, 0.19])
  mesh(
    new CapsuleGeometry(0.15, 0.36, 5, 20),
    materials.chalk,
    cloud,
    [0, -0.1, 0]
  ).rotation.z = Math.PI / 2
  floatObject(cloud, 1, 0.025)
  const nodePositions = [
    [-1.58, -0.5, 0.05],
    [1.56, 0.85, 0.1],
    [1.62, -0.58, 0.16],
  ]
  nodePositions.forEach((position, index) => {
    const node = mesh(
      smallSphere,
      index === 1 ? materials.cobalt : materials.citron,
      projectGroups[1],
      position,
      [0.145, 0.145, 0.145]
    )
    floatObject(node, index * 2, 0.025)
  })
  for (const points of [
    [
      [-1.49, 0.35, -0.1],
      [-1.78, 0.04, -0.1],
      [-1.58, -0.5, 0.05],
    ],
    [
      [-1.18, 0.66, -0.9],
      [-0.6, 1.5, -0.9],
      [0.9, 1.5, -0.9],
      [1.56, 0.85, 0.1],
    ],
    [
      [1.56, 0.85, 0.1],
      [1.86, 0.12, 0],
      [1.62, -0.58, 0.16],
    ],
  ]) {
    mesh(
      new TubeGeometry(
        new CatmullRomCurve3(points.map((point) => new Vector3(...point))),
        32,
        0.018,
        6,
        false
      ),
      materials.cobalt,
      projectGroups[1]
    )
  }

  const chip = new Group()
  chip.position.set(-1.47, 0.2, 0.2)
  chip.rotation.set(0.2, 0.25, -0.2)
  projectGroups[2].add(chip)
  const boardGeometry = roundedPanel(0.7, 0.63, 0.095, 0.06)
  for (let index = 0; index < 3; index += 1) {
    mesh(
      boardGeometry,
      [materials.charcoal, materials.cobalt, materials.chalk][index],
      chip,
      [0, index * 0.025, index * 0.11]
    )
  }
  mesh(
    roundedPanel(0.35, 0.34, 0.05, 0.035),
    materials.citron,
    chip,
    [0, 0.05, 0.29]
  )
  for (let index = 0; index < 4; index += 1) {
    for (const side of [-1, 1]) {
      mesh(new BoxGeometry(0.037, 0.13, 0.045), materials.slate, chip, [
        -0.225 + index * 0.15,
        side * 0.355 + 0.05,
        0.22,
      ])
      mesh(new BoxGeometry(0.13, 0.037, 0.045), materials.slate, chip, [
        side * 0.39,
        -0.175 + index * 0.15,
        0.22,
      ])
    }
  }
  floatObject(chip, 1, 0.025)
  const circuitRing = new Group()
  circuitRing.position.set(1.47, 0.48, 0.04)
  circuitRing.rotation.set(0.25, -0.4, -0.2)
  projectGroups[2].add(circuitRing)
  mesh(new TorusGeometry(0.36, 0.045, 10, 48), materials.cobalt, circuitRing)
  mesh(new TorusGeometry(0.26, 0.012, 8, 40), materials.slate, circuitRing)
  for (let index = 0; index < 6; index += 1) {
    const angle = (index * Math.PI) / 3
    mesh(
      smallSphere,
      materials.citron,
      circuitRing,
      [Math.cos(angle) * 0.36, Math.sin(angle) * 0.36, 0],
      [0.057, 0.057, 0.057]
    )
  }
  mesh(
    new CylinderGeometry(0.105, 0.105, 0.07, 24),
    materials.charcoal,
    circuitRing
  ).rotation.x = Math.PI / 2
  floatObject(circuitRing, 3, 0.025)

  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 128
  shadowCanvas.height = 128
  const context = shadowCanvas.getContext('2d')
  const gradient = context.createRadialGradient(64, 64, 1, 64, 64, 62)
  gradient.addColorStop(0, 'rgba(20,24,20,0.25)')
  gradient.addColorStop(0.4, 'rgba(20,24,20,0.12)')
  gradient.addColorStop(1, 'rgba(20,24,20,0)')
  context.fillStyle = gradient
  context.fillRect(0, 0, 128, 128)
  const shadowTexture = new CanvasTexture(shadowCanvas)
  const shadow = new Mesh(
    new PlaneGeometry(3.7, 2.5),
    new MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    })
  )
  shadow.rotation.x = -Math.PI / 2
  shadow.position.set(0.12, -1.4, 0)
  scene.add(shadow)
  const key = new DirectionalLight(0xfffaf2, 1.8)
  key.position.set(-3, 5, 6)
  key.castShadow = true
  key.shadow.mapSize.set(1024, 1024)
  key.shadow.camera.left = -3
  key.shadow.camera.right = 3
  key.shadow.camera.top = 3
  key.shadow.camera.bottom = -3
  key.shadow.camera.near = 0.5
  key.shadow.camera.far = 15
  key.shadow.bias = -0.0002
  key.shadow.normalBias = 0.025
  key.shadow.radius = 3
  scene.add(key)
  const rim = new DirectionalLight(0xdce5ff, 1.25)
  rim.position.set(4, 2, -3)
  scene.add(rim)
  scene.add(new HemisphereLight(0xfffcf4, 0x5b657a, 0.95))

  let selection = selectionIndex(options.selected)
  let greetingSeed = options.greeting || 0
  let reducedMotion = Boolean(options.reducedMotion)
  let motionEnabled = options.motionEnabled !== false
  let active = options.active !== false
  let disposed = false
  let contextLost = false
  let frame = null
  let firstRender = true
  let lastTime = 0
  let lastDraw = 0
  let elapsed = 0
  let waveUntil = 0
  let selectionPulse = 0
  const pointer = { x: 0, y: 0 }
  const gaze = { x: 0, y: 0 }
  const groupScales = projectGroups.map((_, index) =>
    index === selection ? 1 : 0
  )
  let characterTurn = [-0.17, 0.08, -0.24][selection]
  const animated = () => motionEnabled && !reducedMotion

  function applyPose(seconds) {
    const moving = animated()
    const blend = moving ? 1 - Math.exp(-seconds * 9) : 1
    const phase = moving ? elapsed : 0
    gaze.x = MathUtils.lerp(gaze.x, moving ? pointer.x : 0, blend)
    gaze.y = MathUtils.lerp(gaze.y, moving ? pointer.y : 0, blend)
    characterTurn = MathUtils.lerp(
      characterTurn,
      [-0.17, 0.08, -0.24][selection],
      blend
    )
    selectionPulse = moving ? Math.max(0, selectionPulse - seconds * 3) : 0
    character.rotation.set(
      0,
      characterTurn,
      moving ? Math.sin(phase * 0.7) * 0.012 : 0
    )
    character.position.y = moving ? Math.sin(phase * 1.75) * 0.025 : 0
    body.scale.y = 0.74 * (1 + (moving ? Math.sin(phase * 1.75) * 0.009 : 0))
    head.rotation.set(
      gaze.y * 0.1 + selectionPulse * 0.065,
      gaze.x * 0.19,
      (selection === 1 ? 0.045 : -0.025) +
        (moving ? Math.sin(phase * 0.85) * 0.025 : 0)
    )
    const blinkPhase = phase % 4.8
    const blink =
      moving && blinkPhase > 4.46
        ? 1 - Math.sin(((blinkPhase - 4.46) / 0.34) * Math.PI) * 0.92
        : 1
    eyes.forEach((eye) => {
      eye.scale.y = Math.max(0.08, blink - selectionPulse * 0.5)
    })
    antenna.rotation.z = moving ? Math.sin(phase * 1.05) * 0.025 : 0
    arms[0].rotation.z = -0.2 + (moving ? Math.sin(phase * 1.1) * 0.035 : 0)
    const waving = moving && elapsed < waveUntil
    const rightArmTarget = waving
      ? 2.3 + Math.sin((waveUntil - elapsed) * 15) * 0.25
      : [0.45, 0.16, 0.72][selection]
    arms[1].rotation.z = MathUtils.lerp(
      arms[1].rotation.z,
      rightArmTarget,
      moving ? 1 - Math.exp(-seconds * 16) : 1
    )
    star.rotation.z = waving
      ? Math.sin((waveUntil - elapsed) * 9) * 0.16
      : -0.08
    cable.rotation.z = moving ? Math.sin(phase * 1.15) * 0.035 : 0
    feet.forEach((foot, index) => {
      foot.rotation.z = (index ? -1 : 1) * (selection === 2 ? 0.055 : 0.025)
    })
    projectGroups.forEach((group, index) => {
      groupScales[index] = MathUtils.lerp(
        groupScales[index],
        index === selection ? 1 : 0,
        blend
      )
      group.visible = groupScales[index] > 0.01
      group.scale.setScalar(Math.max(0.001, groupScales[index]))
      group.rotation.y =
        (1 - groupScales[index]) * (index === selection ? -0.12 : 0.12)
    })
    floatingObjects.forEach(
      ({ object, baseline, phase: offset, amplitude }) => {
        object.position.y =
          baseline + (moving ? Math.sin(phase * 1.2 + offset) * amplitude : 0)
      }
    )
    shadow.scale.setScalar(1 - (character.position.y + 0.025) * 0.2)
  }

  function renderFrame(time) {
    frame = null
    if (disposed || !active || contextLost) return
    const seconds = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60
    lastTime = time
    if (animated()) elapsed += seconds
    applyPose(seconds)
    if (!animated() || firstRender || time - lastDraw >= 1000 / 30) {
      renderer.render(scene, camera)
      lastDraw = time
      if (firstRender) {
        firstRender = false
        options.onReady?.()
      }
    }
    if (animated()) frame = requestAnimationFrame(renderFrame)
  }
  function pause() {
    if (frame !== null) cancelAnimationFrame(frame)
    frame = null
    lastTime = 0
  }
  function requestRender() {
    if (disposed || !active || contextLost || frame !== null) return
    frame = requestAnimationFrame(renderFrame)
  }
  function resetMotion() {
    pointer.x = 0
    pointer.y = 0
    waveUntil = 0
    pause()
    requestRender()
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
      const halfHeight = Math.max(2.05, 2.1 / (width / height))
      camera.left = (-halfHeight * width) / height
      camera.right = (halfHeight * width) / height
      camera.top = halfHeight
      camera.bottom = -halfHeight
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      lastDraw = 0
      requestRender()
    },
    setSelected(value) {
      const next = selectionIndex(value)
      if (next === selection) return
      selection = next
      selectionPulse = 1
      lastDraw = 0
      requestRender()
    },
    greet(seed) {
      if (seed === greetingSeed) return
      greetingSeed = seed
      if (!animated()) return
      waveUntil = elapsed + 1.35
      selectionPulse = 0.8
      requestRender()
    },
    setPointer(horizontal, vertical) {
      if (!animated() || !active) return
      pointer.x = MathUtils.clamp(horizontal, -1, 1)
      pointer.y = MathUtils.clamp(vertical, -1, 1)
      requestRender()
    },
    setActive(value) {
      active = value
      if (active) requestRender()
      else pause()
    },
    setReducedMotion(value) {
      reducedMotion = value
      resetMotion()
    },
    setMotionEnabled(value) {
      motionEnabled = value
      resetMotion()
    },
    dispose() {
      if (disposed) return
      disposed = true
      pause()
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
      const geometries = new Set()
      const usedMaterials = new Set()
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry)
        if (object.material) usedMaterials.add(object.material)
      })
      geometries.forEach((geometry) => geometry.dispose())
      usedMaterials.forEach((material) => material.dispose())
      shadowTexture.dispose()
      key.shadow.dispose()
      environment.dispose()
      scene.clear()
      renderer.dispose()
      renderer.forceContextLoss()
    },
  }
}
