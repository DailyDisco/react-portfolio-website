import { Code2, Cpu, Database, Network, Server, Workflow } from 'lucide-react'
import './style.css'

const icons = {
  react: 'react',
  typescript: 'typescript',
  'next.js': 'nextjs',
  nextjs: 'nextjs',
  'node.js': 'nodejs',
  nodejs: 'nodejs',
  go: 'go',
  python: 'python',
  fastapi: 'fastapi',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  prisma: 'prisma',
  redis: 'redis',
  n8n: 'n8n',
  aws: 'amazonwebservices',
  railway: 'railway',
  terraform: 'terraform',
  docker: 'docker',
  'docker compose': 'docker',
  'github actions': 'githubactions',
  github: 'github',
  linux: 'linux',
  playwright: 'playwright',
  pytest: 'pytest',
  vitest: 'vitest',
  prometheus: 'prometheus',
  grafana: 'grafana',
  proxmox: 'proxmox',
  tailscale: 'tailscale',
  caddy: 'caddy',
  cloudflare: 'cloudflare',
  'cloudflare tunnels': 'cloudflare',
  'c++': 'cplusplus',
  'c#': 'csharp',
  unity: 'unity',
  'unity / c#': 'unity',
  nvidia: 'nvidia',
  'nvidia rtx 3090': 'nvidia',
}

const fallbackIcons = {
  dbt: Workflow,
  kestra: Workflow,
  exllamav3: Cpu,
  tabbyapi: Server,
  'gpu workloads': Cpu,
  'openai-compatible gateway': Network,
  'automated provisioning': Workflow,
  'backup and restore validation': Database,
}

export function TechIcon({ name, size = 20 }) {
  const key = name.trim().toLowerCase()
  const asset = icons[key]
  const Fallback = fallbackIcons[key] || Code2

  return (
    <span
      className={`tech-icon${asset === 'railway' ? ' tech-icon-ink' : ''}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {asset ? (
        <img
          src={`${process.env.PUBLIC_URL || ''}/brand/tech/${asset}.svg`}
          alt=""
          width={size}
          height={size}
          decoding="async"
        />
      ) : (
        <Fallback size={size} strokeWidth={1.7} aria-hidden="true" />
      )}
    </span>
  )
}

export default function TechStack({
  items,
  label = 'Technologies',
  className = '',
  compact = false,
}) {
  return (
    <ul
      className={`tech-stack${compact ? ' tech-stack-compact' : ''}${className ? ` ${className}` : ''}`}
      aria-label={label}
    >
      {items.map((name) => (
        <li key={name}>
          <TechIcon name={name} size={compact ? 18 : 20} />
          <span>{name}</span>
        </li>
      ))}
    </ul>
  )
}
