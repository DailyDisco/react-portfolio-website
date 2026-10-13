import {
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  TorusGeometry,
} from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

const DEFAULT_PALETTE = {
  paper: '#f3f2ed',
  ink: '#171a19',
  accent: '#364bff',
  signal: '#d8f36a',
  edge: '#c5c9bd',
}

// A schematic: X arrays seven cards, Y is up, and +Z is the open front.
export function createServerModel(palette = {}) {
  const colors = { ...DEFAULT_PALETTE, ...palette }
  const group = new Group()
  group.name = 'seven-gpu-server-schematic'
  group.userData.schematic = true
  group.userData.gpuCount = 7

  const geometries = new Map()
  const materials = new Set()
  const highlightedMaterials = []
  let disposed = false

  function material(color, options = {}, highlightKey = null) {
    const surface = new MeshStandardMaterial({
      color,
      roughness: 0.5,
      metalness: 0.18,
      ...options,
    })
    materials.add(surface)
    if (highlightKey) {
      highlightedMaterials.push({
        surface,
        key: highlightKey,
        color: surface.color.clone(),
        emissive: surface.emissive.clone(),
        intensity: surface.emissiveIntensity,
      })
    }
    return surface
  }

  function geometry(key, create) {
    if (!geometries.has(key)) geometries.set(key, create())
    return geometries.get(key)
  }

  function roundedBox(parent, name, size, position, surface, radius = 0.035) {
    const key = `box:${size.join(':')}:${radius}`
    const shape = geometry(
      key,
      () => new RoundedBoxGeometry(...size, 2, radius)
    )
    return mesh(parent, name, shape, surface, position)
  }

  function mesh(parent, name, shape, surface, position = [0, 0, 0]) {
    const part = new Mesh(shape, surface)
    part.name = name
    part.position.set(...position)
    part.castShadow = true
    part.receiveShadow = true
    parent.add(part)
    return part
  }

  const graphite = material(colors.ink, { roughness: 0.6, metalness: 0.24 })
  const rubber = material(new Color(colors.ink).multiplyScalar(0.54), {
    roughness: 0.88,
    metalness: 0,
  })
  const aluminum = material(
    new Color(colors.edge).lerp(new Color(colors.ink), 0.24),
    { roughness: 0.39, metalness: 0.62 }
  )
  const circuit = material(
    new Color(colors.ink).lerp(new Color(colors.accent), 0.17),
    { roughness: 0.76, metalness: 0.06 }
  )
  const cardSurface = material(
    new Color(colors.edge).lerp(new Color(colors.ink), 0.56),
    { metalness: 0.48, roughness: 0.42 },
    'gpus'
  )
  const cardAccent = material(colors.accent, { roughness: 0.4 }, 'gpus')
  const processorSurface = material(colors.paper, { metalness: 0.46 }, 'gpus')
  const memorySurface = material(
    new Color(colors.signal).lerp(new Color(colors.ink), 0.3),
    { roughness: 0.55, metalness: 0.08 },
    'memory'
  )
  const signalSurface = material(colors.signal, {
    emissive: colors.signal,
    emissiveIntensity: 0.1,
    roughness: 0.48,
    metalness: 0,
  })
  const airflowSurface = material(
    new Color(colors.edge).lerp(new Color(colors.ink), 0.4),
    { roughness: 0.48, metalness: 0.26 },
    'airflow'
  )

  const chassis = new Group()
  chassis.name = 'open-frame-chassis'
  group.add(chassis)
  roundedBox(
    chassis,
    'base-tray',
    [3.8, 0.2, 2.4],
    [0, -1.015, 0],
    graphite,
    0.075
  )
  roundedBox(
    chassis,
    'front-tray-inset',
    [3.3, 0.055, 0.025],
    [0, -1.015, 1.203],
    aluminum,
    0.01
  )

  for (const side of [-1, 1]) {
    for (const end of [-1, 1]) {
      roundedBox(
        chassis,
        'corner-upright',
        [0.16, 1.95, 0.16],
        [side * 1.755, -0.01, end * 1.055],
        graphite,
        0.04
      )
      roundedBox(
        chassis,
        'isolation-foot',
        [0.43, 0.14, 0.42],
        [side * 1.5, -1.165, end * 0.83],
        rubber,
        0.055
      )
    }
    roundedBox(
      chassis,
      'upper-side-rail',
      [0.16, 0.16, 2.27],
      [side * 1.755, 0.91, 0],
      graphite,
      0.045
    )
  }

  const hostBoard = new Group()
  hostBoard.name = 'host-board'
  hostBoard.position.y = -0.79
  group.add(hostBoard)
  roundedBox(
    hostBoard,
    'main-board',
    [3.2, 0.075, 1.93],
    [0, 0, 0],
    circuit,
    0.04
  )
  roundedBox(
    hostBoard,
    'host-processor',
    [0.56, 0.14, 0.5],
    [0, 0.09, -0.56],
    aluminum,
    0.025
  )
  for (let index = 0; index < 7; index += 1) {
    roundedBox(
      hostBoard,
      'expansion-slot',
      [0.12, 0.12, 1.45],
      [(index - 3) * 0.445, 0.075, 0.11],
      graphite,
      0.018
    )
  }
  for (let index = 0; index < 3; index += 1) {
    roundedBox(
      hostBoard,
      'front-connector',
      [0.16, 0.11, 0.12],
      [-1.16 + index * 0.27, 0.095, 0.86],
      aluminum,
      0.012
    )
  }

  // Each complete card is a distinct group; no extra plates imply extra GPUs.
  const gpuGroups = []
  for (let index = 0; index < 7; index += 1) {
    const card = new Group()
    card.name = `gpu-${index + 1}`
    card.userData.part = 'gpus'
    card.userData.index = index
    group.add(card)
    gpuGroups.push(card)

    roundedBox(
      card,
      'cooling-plate',
      [0.17, 1.36, 1.79],
      [0, 0, 0],
      cardSurface,
      0.045
    )
    roundedBox(
      card,
      'board-edge',
      [0.055, 1.24, 1.69],
      [0.096, -0.015, 0],
      circuit,
      0.022
    )
    roundedBox(
      card,
      'front-spine',
      [0.2, 1.37, 0.09],
      [0, 0, 0.866],
      cardAccent,
      0.025
    )
    roundedBox(
      card,
      'top-cap',
      [0.195, 0.075, 1.69],
      [0, 0.65, 0],
      aluminum,
      0.025
    )
    roundedBox(
      card,
      'front-status-inlay',
      [0.075, 0.19, 0.018],
      [0, 0.37, 0.92],
      signalSurface,
      0.008
    )
    roundedBox(
      card,
      'processor-package',
      [0.06, 0.46, 0.49],
      [0.139, 0.04, -0.07],
      graphite,
      0.025
    )
    roundedBox(
      card,
      'processor-lid',
      [0.025, 0.31, 0.34],
      [0.18, 0.04, -0.07],
      processorSurface,
      0.016
    )

    for (const row of [-1, 1]) {
      for (let chip = 0; chip < 3; chip += 1) {
        const memory = roundedBox(
          card,
          'memory-chip',
          [0.043, 0.14, 0.2],
          [0.144, row * 0.39, -0.43 + chip * 0.36],
          memorySurface,
          0.012
        )
        memory.userData.part = 'memory'
      }
    }
    for (let fin = 0; fin < 4; fin += 1) {
      roundedBox(
        card,
        'rear-heat-spreader',
        [0.045, 0.76, 0.036],
        [0.132, -0.045, -0.68 + fin * 0.075],
        aluminum,
        0.01
      )
    }
    roundedBox(
      card,
      'slot-contact',
      [0.06, 0.11, 1.09],
      [0.035, -0.707, 0.14],
      memorySurface,
      0.01
    )
  }

  const airflow = new Group()
  airflow.name = 'airflow-assembly'
  airflow.userData.part = 'airflow'
  group.add(airflow)
  const fanRing = geometry(
    'fan-ring',
    () => new TorusGeometry(0.325, 0.044, 8, 32)
  )
  const fanHub = geometry(
    'fan-hub',
    () => new CylinderGeometry(0.085, 0.085, 0.06, 20)
  )

  for (const side of [-1, 1]) {
    const fan = new Group()
    fan.name = 'rear-fan'
    fan.position.set(side * 0.63, 0.13, -1.025)
    airflow.add(fan)
    roundedBox(
      fan,
      'fan-housing',
      [0.84, 0.84, 0.105],
      [0, 0, -0.055],
      graphite,
      0.1
    )
    mesh(fan, 'fan-rim', fanRing, aluminum, [0, 0, 0.028])
    const hub = mesh(fan, 'fan-hub', fanHub, airflowSurface, [0, 0, 0.062])
    hub.rotation.x = Math.PI / 2
    for (let blade = 0; blade < 7; blade += 1) {
      const angle = (blade / 7) * Math.PI * 2
      const vane = roundedBox(
        fan,
        'fan-vane',
        [0.12, 0.245, 0.038],
        [Math.sin(angle) * 0.18, Math.cos(angle) * 0.18, 0.055],
        airflowSurface,
        0.035
      )
      vane.rotation.z = -angle + 0.4
    }
  }

  // The shallow rear crown leaves the front and card tops open for inspection.
  const cover = new Group()
  cover.name = 'removable-cover'
  group.add(cover)
  roundedBox(
    cover,
    'rear-crown',
    [3.64, 0.15, 0.57],
    [0, 0, -0.83],
    graphite,
    0.065
  )
  for (const side of [-1, 1]) {
    roundedBox(
      cover,
      'crown-side-return',
      [0.18, 0.15, 1.58],
      [side * 1.73, 0, 0.22],
      graphite,
      0.04
    )
  }
  for (let vent = 0; vent < 11; vent += 1) {
    roundedBox(
      cover,
      'crown-vent-inlay',
      [0.15, 0.012, 0.27],
      [(vent - 5) * 0.265, 0.078, -0.83],
      rubber,
      0.02
    )
  }

  function setExploded(amount) {
    if (disposed) return
    const progress = Number.isFinite(amount)
      ? Math.min(1, Math.max(0, amount))
      : 0
    cover.position.set(0, 0.975 + progress * 1.12, -progress * 0.14)
    gpuGroups.forEach((card, index) => {
      const distance = index - 3
      card.position.set(
        distance * (0.445 + progress * 0.19),
        0.04 + progress * (0.37 + Math.abs(distance) * 0.035),
        0.045 + progress * 0.56
      )
    })
    airflow.position.z = -progress * 0.24
    hostBoard.position.y = -0.79 + progress * 0.07
    group.updateMatrixWorld(true)
  }

  function setHighlight(key) {
    if (disposed) return
    highlightedMaterials.forEach(
      ({ surface, key: part, color, emissive, intensity }) => {
        const selected = part === key
        const highlight = new Color(
          part === 'gpus' ? colors.accent : colors.signal
        )
        surface.color.copy(color)
        surface.emissive.copy(emissive)
        surface.emissiveIntensity = intensity
        if (selected) {
          surface.color.lerp(highlight, part === 'gpus' ? 0.32 : 0.48)
          surface.emissive.copy(highlight)
          surface.emissiveIntensity = 0.2
        }
      }
    )
  }

  function dispose() {
    if (disposed) return
    disposed = true
    geometries.forEach((shape) => shape.dispose())
    materials.forEach((surface) => surface.dispose())
    geometries.clear()
    materials.clear()
    group.clear()
  }

  setExploded(0)
  return { group, setExploded, setHighlight, dispose }
}
