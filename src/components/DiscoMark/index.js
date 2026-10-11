export default function DiscoMark({ className = '', ...props }) {
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
        d="M28 22 25 10"
        stroke="var(--brand-ink, #171a19)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="m24 1 2.4 4.6L31 8l-4.6 2.4L24 15l-2.4-4.6L17 8l4.6-2.4Z"
        fill="var(--brand-accent, #364bff)"
      />
      <rect
        x="3"
        y="28"
        width="12"
        height="24"
        rx="6"
        fill="var(--brand-accent, #364bff)"
      />
      <rect
        x="49"
        y="28"
        width="12"
        height="24"
        rx="6"
        fill="var(--brand-accent, #364bff)"
      />
      <rect
        x="9"
        y="18"
        width="46"
        height="41"
        rx="16"
        fill="var(--brand-signal, #d8f36a)"
      />
      <path
        d="M15 34C15 28 22 27 32 27S49 28 49 34V41C49 49 42 51 32 51S15 49 15 41Z"
        fill="var(--brand-ink, #171a19)"
      />
      <rect
        x="24"
        y="33"
        width="4.5"
        height="11"
        rx="2.25"
        fill="var(--brand-paper, #f3f2ed)"
      />
      <rect
        x="35.5"
        y="33"
        width="4.5"
        height="11"
        rx="2.25"
        fill="var(--brand-paper, #f3f2ed)"
      />
    </svg>
  )
}
