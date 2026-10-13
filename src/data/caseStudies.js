export const caseStudies = [
  {
    slug: 'property-platform',
    number: '01',
    category: 'Product engineering · Technical leadership',
    title: 'Emmut property management',
    cover: {
      src: '/work/emmut-cover-desktop-mobile.webp',
      alt: 'Emmut maintenance worker management on desktop and mobile, using synthetic demo data.',
      caption: 'Actual Emmut components · synthetic demo data',
    },
    cardTitle: 'Emmut',
    cardSummary:
      'Property management for 1,000+ units. Led four developers; reduced daily admin work from 3 hours to 1 per employee.',
    visual: {
      src: '/work/emmut-maintenance-desktop.png',
      alt: 'Actual Emmut maintenance-worker management dialog rendered with synthetic demo workers.',
      caption: 'Emmut UI · synthetic demo data',
    },
    summary:
      'I led architecture and delivery with a four-developer team. The platform manages 1,000+ property units and cut daily admin work from 3 hours to 1 per employee.',
    outcome: '3 hours → 1 hour of daily admin work',
    role: 'Full Stack Engineer · DFW Software Consulting, through Lumara',
    period: 'March 2025 - Present',
    brief: {
      ownership:
        'Led architecture, schema design, and releases with a four-developer team for a platform managing 1,000+ property units.',
      decision:
        'Use durable PostgreSQL jobs, idempotent requests, and bounded retries so building-alert emails can recover from interrupted workers.',
      verification:
        'Exercised interrupted and concurrent workers against real PostgreSQL and SMTP. Measured daily administrative work fell from three hours to one per employee.',
    },
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'Docker'],
    highlights: [
      { value: '1,000+', label: 'property units managed' },
      { value: '2 hours', label: 'saved per employee each day' },
      { value: '4', label: 'developers on the team' },
    ],
    challenge:
      'Emmut Properties needed to replace legacy software while supporting the daily work of managing more than 1,000 units. Invoicing, financial calculations, and reporting consumed hours of staff time. The replacement needed to make those workflows easier and keep operational tasks dependable.',
    approach: [
      {
        title: 'Architecture and releases',
        body: 'Working with a four-developer team at DFW Software Consulting, I led architecture, schema design, and releases. We built the platform with Next.js, TypeScript, PostgreSQL, and Prisma, connecting staff workflows to a shared data model.',
      },
      {
        title: 'Invoicing and reporting automation',
        body: 'I automated invoicing, financial calculations, and reporting so staff could spend less time repeating administrative steps. The measured result was a reduction from three hours to one hour of daily administrative work per employee.',
      },
      {
        title: 'Durable email delivery',
        body: 'I rebuilt building-alert email delivery around durable PostgreSQL jobs, idempotent requests, and bounded retries. I tested interrupted and concurrent workers against real PostgreSQL and SMTP to check how delivery behaved when execution failed or overlapped.',
      },
    ],
    results: [
      'Replaced legacy software with a platform managing 1,000+ property units.',
      'Reduced measured daily administrative work by two hours per employee.',
      'Delivered background email processing with explicit retry and recovery behavior.',
    ],
    links: [],
  },
  {
    slug: 'workflow-migration',
    number: '02',
    category: 'Cloud migration · Data engineering',
    title: 'AWS to Railway workflow migration',
    cover: {
      src: '/work/migration-concept.webp',
      alt: 'Conceptual illustration of graphite and cream compute modules connected by cobalt routing lines.',
      caption: 'Workflow migration · conceptual illustration',
    },
    cardTitle: 'AWS → Railway',
    cardSummary:
      'Moved seven production lead workflows from AWS/Kestra to Railway/n8n, with durable intake and safer retries.',
    visual: {
      src: '/work/migration-map.svg',
      alt: 'Architecture overview showing seven lead workflows moving from Kestra on AWS to n8n on Railway.',
      caption: 'Architecture overview',
    },
    summary:
      'I migrated seven production lead workflows from Kestra on AWS to n8n on Railway for Craft Digital. The new intake saves submissions before processing them.',
    outcome: '7 production lead workflows migrated',
    role: 'Full Stack Engineer · Craft Digital, through Lumara',
    period: 'July 2026 - Present',
    brief: {
      ownership:
        'Migrated seven production lead workflows for Craft Digital, with responsibility for intake durability, cutover checks, and reporting pipelines.',
      decision:
        'Persist submissions before acknowledging them; publish reporting snapshots atomically so readers do not see partial or mixed generations.',
      verification:
        'Checked production routes and the workflow cutover. Built reporting recovery, reconciliation, and rollback checks; full AWS retirement remains a separate milestone.',
    },
    stack: [
      'Python',
      'n8n',
      'Railway',
      'Kestra',
      'AWS',
      'dbt',
      'PostgreSQL',
      'Next.js',
    ],
    highlights: [
      { value: '7', label: 'production lead workflows migrated' },
      {
        value: '27 + 1',
        label: 'franchise tenants plus corporate in reporting builds',
      },
      { value: 'Sep 2026', label: 'lead workflow cutover' },
    ],
    challenge:
      'Joshua Tree Experts needed to move lead intake from Kestra on AWS to n8n on Railway. The work also spanned financial reporting and tenant-facing dashboards, where partial data, inconsistent snapshots, and failed executions needed explicit handling.',
    approach: [
      {
        title: 'Durable intake and the production cutover',
        body: 'I built intake that persists a payload before acknowledging it, with crash recovery and payload reconciliation. Seven production lead workflows moved to n8n on Railway, with route checks and independent verification of the cutover.',
      },
      {
        title: 'Reporting pipelines and atomic publication',
        body: 'I engineered Python and dbt pipelines for 27 franchise tenants plus corporate. Frozen source snapshots, lossless financial-data transport, and atomic PostgreSQL publication with rollback made the publication boundary explicit.',
      },
      {
        title: 'Tenant-scoped dashboard readers',
        body: 'I built Next.js and PostgreSQL readers with tenant-scoped access, consistent snapshots, and publication checks. Those checks prevent audience exports from combining incomplete data or different reporting generations.',
      },
    ],
    results: [
      'Completed the production cutover of seven lead-intake workflows.',
      'Built reporting pipelines covering 27 franchise tenants and corporate.',
      'Implemented recovery, rollback, and publication checks across intake and reporting.',
    ],
    links: [],
    note: 'Lead-intake workflows are in production. Reporting work covers implementation and validation; full AWS retirement is a separate milestone.',
  },
  {
    slug: 'realtime-platform',
    number: '03',
    category: 'Backend engineering · Real-time systems',
    title: 'Confidential mixed reality platform',
    summary:
      'Shared state, resumable event delivery, and scoped permissions for a confidential platform and its Unity client.',
    outcome: 'Resumable events with scoped access',
    role: 'Backend engineering lead · Lumara client engagement',
    period: 'Ongoing client work',
    brief: {
      ownership:
        'Led backend work spanning shared state, real-time event delivery, scoped permissions, and compatibility with the Unity client.',
      decision:
        'Use resumable streams and bounded queues with channel authorization, so reconnects and slow consumers have explicit handling.',
      verification:
        'Exercised failure handling with integration tests and executable OpenAPI compatibility checks. Terraform work covers development infrastructure definitions.',
    },
    stack: [
      'Python',
      'FastAPI',
      'PostgreSQL',
      'Redis',
      'AWS',
      'Terraform',
      'Unity / C#',
    ],
    highlights: [
      { value: 'Redis', label: 'shared application state' },
      { value: 'SSE', label: 'resumable event delivery' },
      { value: 'OpenAPI', label: 'Unity contract checks' },
    ],
    challenge:
      'Keep a Unity client and its backend in sync through disconnects, shared-state changes, and API updates, while enforcing access boundaries.',
    approach: [
      {
        title: 'State, streams, and access',
        body: 'I implemented Redis-backed state, resumable server-sent events, bounded queues, backpressure, and channel authorization. Integration tests exercised failure handling. Scoped permissions and Cognito safeguards cover sensitive account changes and audit events.',
      },
      {
        title: 'Client contracts and development infrastructure',
        body: 'I built executable OpenAPI compatibility checks for Unity C# calls and models, plus Terraform definitions for development ElastiCache with private subnets and application-scoped security groups.',
      },
    ],
    results: [
      'Merged shared-state and resumable-stream implementations with integration coverage.',
      'Added scoped authorization and account-security safeguards.',
      'Built executable client/API contract checks and development infrastructure definitions.',
    ],
    links: [],
    note: 'Client details are confidential. The Terraform work covers infrastructure definitions for the development environment.',
  },
  {
    slug: 'local-inference',
    number: '04',
    category: 'GPU infrastructure · Open source',
    title: 'Local LLM inference and upstream fixes',
    cover: {
      src: '/work/inference-concept.webp',
      alt: 'Conceptual stacked compute boards with graphite cooling fins and a cobalt processor.',
      caption: 'Local compute · conceptual illustration',
    },
    cardTitle: 'Local AI & open source',
    cardSummary:
      'Two fixes merged upstream. Cold prompt processing improved 18% in my six-GPU benchmark.',
    visual: {
      src: '/work/inference-benchmark.svg',
      alt: 'Six GPU plates alongside measured cold prompt throughput rising from 1,238 to 1,458 tokens per second.',
      caption: 'Six-GPU benchmark · merged fixes',
    },
    summary:
      'My local AI server now runs seven GPUs. Operating it led to two merged upstream fixes, including 18% faster cold prompt processing on the earlier six-GPU setup.',
    outcome: '18% faster cold prompt processing in a six-GPU benchmark',
    role: 'Independent infrastructure owner · Open-source contributor',
    period: 'Ongoing · Upstream fixes merged October 2026',
    brief: {
      ownership:
        'Built and operate a seven-GPU inference server; traced performance and recovery problems into ExLlamaV3 and TabbyAPI.',
      decision:
        'Parallelize CPU all-reduce with AVX2, and release an old generator before allocating its replacement to avoid overlapping host caches.',
      verification:
        'Measured 1,238 → 1,458 cold-prompt tokens/second on six GPUs, with unchanged decode speed. Both fixes merged; generator release has regression coverage.',
    },
    stack: [
      'C++',
      'Python',
      'ExLlamaV3',
      'TabbyAPI',
      'Linux',
      'Proxmox',
      'Docker',
      'Tailscale',
    ],
    highlights: [
      { value: '7 GPUs', label: 'NVIDIA RTX 3090 inference server' },
      { value: '168 GiB', label: 'combined GPU memory' },
      { value: '2', label: 'fixes merged upstream' },
    ],
    challenge:
      'My inference server for coding agents now has seven NVIDIA RTX 3090 GPUs. Before the expansion, operating the stack exposed both a CPU communication bottleneck during prompt processing and a cache-lifetime problem during error recovery. I traced both into the upstream projects.',
    approach: [
      {
        title: 'ExLlamaV3 CPU all-reduce performance',
        body: 'In ExLlamaV3, I implemented multithreaded AVX2 CPU all-reduce for tensor-parallel inference. Cold prompt throughput rose from 1,238 to 1,458 tokens per second in my six-GPU benchmark, an 18% improvement. Decode speed remained unchanged.',
      },
      {
        title: 'TabbyAPI generator replacement',
        body: 'In TabbyAPI, I changed generator replacement to release the old instance before constructing its replacement. This prevents overlapping main-process host caches during that recovery path. A regression test checks object release.',
      },
      {
        title: 'Homelab provisioning and operations',
        body: 'Alongside inference, I operate Proxmox virtual machines and a dozen self-hosted services with Linux, Docker Compose, Caddy, and Cloudflare Tunnels. Provisioning includes Tailscale-only administration, metrics, and logs from first boot.',
      },
    ],
    results: [
      'Both fixes were merged into their upstream projects.',
      'Measured an 18% cold prompt throughput improvement on the six-GPU setup.',
      'Added regression coverage for the generator-release ordering fix.',
    ],
    links: [
      {
        label: 'ExLlamaV3 performance fix',
        url: 'https://github.com/turboderp-org/exllamav3/pull/447',
      },
      {
        label: 'TabbyAPI recovery fix',
        url: 'https://github.com/theroyallab/tabbyAPI/pull/493',
      },
    ],
  },
]

export const getCaseStudy = (slug) =>
  caseStudies.find((caseStudy) => caseStudy.slug === slug)

export const featuredCaseStudies = [
  'property-platform',
  'workflow-migration',
  'local-inference',
].map(getCaseStudy)
