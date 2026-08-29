import type { SVGProps } from 'react'

/* foxai logo — Trace variant -----------------------------------------------
   The mark is two paths forming a lowercase 'f' that branches off to a
   detached endpoint: a request leaves the trunk, travels the spine, and
   terminates at the small filled circle. The negative space between the
   branch and the body is the path the response takes back.

   Three variants:
     <Mark />    bare stroke mark for the navbar / favicon at large sizes.
     <Lockup />  mark + "foxai" wordmark; the "ai" picks up the brand colour
                 so the brand accent lands in the wordmark even before the
                 nav underline does.
     <Tile />    brand-coloured rounded square with a reversed mark. Used
                 where strokes would disappear (16/20px favicon, OS-tray
                 silhouettes). Mirrors the trick the original favicon.svg
                 used: an opaque tile beats a thin outline at any sub-24px
                 size on a busy desktop. */

const MARK_PATHS = (
  <g
    fill="none"
    stroke="currentColor"
    strokeWidth="7.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* The f's spine + top arc: starts mid-left of the bottom, climbs to the
        top, hooks right. The little hook is what makes this read as 'f' and
        not as 't' at small sizes. */}
    <path d="M23 55V22c0-7.2 5.8-13 13-13h2" />
    {/* The f's crossbar. Stops short of the spine on the left so the bar
        feels tied to the curve, not floated. */}
    <path d="M12.5 31h21" />
    {/* The endpoint — solid, smaller, deliberately separated from the bar.
        This is the only filled element; everything else stays as line so
        the mark scales down as outline, not as blob. */}
    <circle cx="49" cy="9" r="5.5" fill="currentColor" stroke="none" />
  </g>
)

type LogoProps = SVGProps<SVGSVGElement> & {
  /** Pixel side length. The viewBox is fixed at 64, so the rendered SVG
   *  always hits subpixel-rounding boundaries at common sizes (16/24/32). */
  size?: number
  /** Decorative only — call sites pass aria-label="foxai" on the link. */
  title?: string
}

export function Mark({ size = 24, title, ...rest }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {MARK_PATHS}
    </svg>
  )
}

/** Square tile that uses an opaque background and a reversed mark. Required
 *  at sizes where the bare mark's 7.5-unit strokes vanish against light
 *  page chrome (favicons, the auth-card strip, anything ≤ 24px). */
export function Tile({ size = 24, title, className, ...rest }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      className={className}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <rect width="64" height="64" rx="14" fill="currentColor" />
      <g
        fill="none"
        stroke="var(--brand-foreground)"
        strokeWidth="7.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M23 55V22c0-7.2 5.8-13 13-13h2" />
        <path d="M12.5 31h21" />
        <circle cx="49" cy="9" r="5.5" fill="var(--brand-foreground)" stroke="none" />
      </g>
    </svg>
  )
}

type LockupProps = Omit<LogoProps, 'size'> & {
  /** Tile height in px; the mark + wordmark scale together. */
  size?: number
}

/** Mark + wordmark. The mark takes the foreground colour so it inherits
 *  surrounding text, while "ai" lifts to the brand accent. This is the
 *  navbar/auth-card entry point: enough brand surface to recognise, not
 *  enough to shout. */
export function Lockup({ size = 24, title, className, ...rest }: LockupProps) {
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
    >
      <Mark size={size} title={title} {...rest} />
      <span
        style={{
          fontWeight: 600,
          letterSpacing: '-0.01em',
          fontSize: Math.round(size * 0.6),
          lineHeight: 1,
        }}
      >
        fox<span style={{ color: 'var(--brand)' }}>ai</span>
      </span>
    </span>
  )
}