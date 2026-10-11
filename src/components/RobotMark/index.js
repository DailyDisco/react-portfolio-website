export default function RobotMark({ className = '', ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M29 22 26 11"
        stroke="var(--brand-ink, #171a19)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="m25 1 2.4 4.6L32 8l-4.6 2.4L25 15l-2.4-4.6L18 8l4.6-2.4Z"
        fill="var(--brand-accent, #364bff)"
      />
      <rect
        x="6"
        y="18"
        width="52"
        height="42"
        rx="16"
        fill="color-mix(in srgb, var(--brand-signal, #d8f36a) 32%, var(--brand-paper, #f3f2ed))"
      />
      <g fill="var(--brand-ink, #171a19)">
        <ellipse cx="22" cy="36" rx="5.3" ry="7.3" />
        <ellipse cx="42" cy="36" rx="5.3" ry="7.3" />
      </g>
      <g fill="var(--brand-paper, #f3f2ed)">
        <ellipse cx="20.4" cy="33.3" rx="1.65" ry="1.9" />
        <ellipse cx="40.4" cy="33.3" rx="1.65" ry="1.9" />
      </g>
      <g fill="#e5a2a2">
        <ellipse cx="14.5" cy="44.5" rx="3.7" ry="2" />
        <ellipse cx="49.5" cy="44.5" rx="3.7" ry="2" />
      </g>
      <path
        d="M28 46c1.8 3.4 6.2 3.4 8 0"
        stroke="var(--brand-ink, #171a19)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}
