// Que Pedo! — Core Components
// Buttons, forms, cards, nav, badges, progress, avatars, modals.
// Signature "chunky shadow" style for gamified feel.

// ─── Icon set (stroke-based, 24x24) ───────────────────────────
const Icon = {
  home: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2V11z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  book: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2V5z M4 19a2 2 0 0 0 2 2h12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  mic: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><rect x="9" y="3" width="6" height="12" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M5 11a7 7 0 0 0 14 0 M12 18v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  globe: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M3 12h18 M12 3c3 3 3 15 0 18 M12 3c-3 3-3 15 0 18" stroke="currentColor" strokeWidth="2"/></svg>,
  trophy: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M7 4h10v5a5 5 0 0 1-10 0V4z M7 6H4v2a3 3 0 0 0 3 3 M17 6h3v2a3 3 0 0 1-3 3 M10 14h4v4h3v2H7v-2h3v-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  fire: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-2-1-3-2-4 3 0 6 3 6 7a8 8 0 0 1-16 0c0-6 5-9 8-13z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  chart: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M3 20V10 M9 20V4 M15 20v-7 M21 20v-11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  dumbbell: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 6v12 M2 9v6 M18 6v12 M22 9v6 M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  user: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 21a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  plus: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14 M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  check: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 12l6 6L20 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  x: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 6l12 12 M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>,
  arrow: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12h14 M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  sparkle: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  search: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  lock: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2"/></svg>,
  play: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 4l14 8-14 8V4z" fill="currentColor"/></svg>,
  heart: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 20S3 13 3 8a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 5-9 12-9 12z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  bell: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><path d="M6 8a6 6 0 0 1 12 0c0 6 2 8 2 8H4s2-2 2-8z M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
  gear: (p) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M12 2v3 M12 19v3 M22 12h-3 M5 12H2 M19 5l-2 2 M7 17l-2 2 M19 19l-2-2 M7 7L5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
};

// ─── Button ───────────────────────────────────────────────────
function Button({ children, variant = 'primary', size = 'md', icon, iconRight, onClick, disabled, fullWidth, style }) {
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 13, gap: 6, height: 36 },
    md: { padding: '12px 20px', fontSize: 15, gap: 8, height: 46 },
    lg: { padding: '16px 28px', fontSize: 17, gap: 10, height: 56 },
  };
  const variants = {
    primary: { bg: QP.chili[500], hover: QP.chili[600], color: 'white', shadow: `0 4px 0 0 ${QP.chili[700]}` },
    secondary: { bg: QP.ink[800], hover: QP.ink[700], color: 'white', shadow: `0 4px 0 0 ${QP.ink[900]}` },
    success: { bg: QP.jade[500], hover: QP.jade[600], color: 'white', shadow: `0 4px 0 0 ${QP.jade[700]}` },
    ghost: { bg: 'transparent', hover: QP.ink[100], color: QP.ink[700], shadow: 'none', border: `2px solid ${QP.ink[200]}` },
    outline: { bg: 'white', hover: QP.chili[50], color: QP.chili[600], shadow: `0 4px 0 0 ${QP.chili[200]}`, border: `2px solid ${QP.chili[300]}` },
    danger: { bg: QP.rosa[500], hover: QP.rosa[600], color: 'white', shadow: `0 4px 0 0 ${QP.rosa[700]}` },
  };
  const s = sizes[size]; const v = variants[variant];
  const [h, setH] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)} onMouseLeave={() => { setH(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)}
      onClick={onClick} disabled={disabled}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        gap: s.gap, padding: s.padding, fontSize: s.fontSize, height: s.height,
        fontFamily: QP.fontBody, fontWeight: 700, letterSpacing: 0.1,
        background: disabled ? QP.ink[200] : (h ? v.hover : v.bg),
        color: disabled ? QP.ink[400] : v.color,
        border: v.border || 'none',
        borderRadius: 14,
        boxShadow: pressed ? 'none' : (disabled ? 'none' : v.shadow),
        transform: pressed ? 'translateY(4px)' : 'translateY(0)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'transform .08s, box-shadow .08s, background .12s',
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}>
      {icon}{children}{iconRight}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────
function Input({ label, placeholder, value, onChange, icon, hint, error, type = 'text', style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <label style={{ fontFamily: QP.fontBody, fontSize: 13, fontWeight: 600, color: QP.ink[700] }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'white',
        border: `2px solid ${error ? QP.rosa[400] : focus ? QP.chili[400] : QP.ink[200]}`,
        borderRadius: 12, padding: '0 14px', height: 48,
        transition: 'border-color .12s, box-shadow .12s',
        boxShadow: focus ? `0 0 0 4px ${QP.chili[100]}` : 'none',
      }}>
        {icon && <div style={{ color: QP.ink[400] }}>{React.cloneElement(icon, { width: 18, height: 18 })}</div>}
        <input
          type={type} placeholder={placeholder} value={value} onChange={onChange}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: QP.fontBody, fontSize: 15, color: QP.ink[800] }}
        />
      </div>
      {hint && !error && <div style={{ fontSize: 12, color: QP.ink[400] }}>{hint}</div>}
      {error && <div style={{ fontSize: 12, color: QP.rosa[600], fontWeight: 600 }}>{error}</div>}
    </div>
  );
}

// ─── Badge / Chip ─────────────────────────────────────────────
function Badge({ children, color = 'chili', variant = 'solid', size = 'md', icon }) {
  const c = QP[color];
  const sizes = { sm: { padding: '3px 8px', fontSize: 10 }, md: { padding: '5px 10px', fontSize: 11 }, lg: { padding: '7px 14px', fontSize: 13 } };
  const s = sizes[size];
  const styles = {
    solid: { bg: c[500], color: 'white' },
    soft: { bg: c[100], color: c[700] },
    outline: { bg: 'transparent', color: c[600], border: `1.5px solid ${c[300]}` },
  }[variant];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: s.padding, fontSize: s.fontSize,
      background: styles.bg, color: styles.color, border: styles.border,
      fontFamily: QP.fontMono, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase',
      borderRadius: 999,
    }}>
      {icon}{children}
    </span>
  );
}

// ─── Progress bar ─────────────────────────────────────────────
function ProgressBar({ value, max = 100, color = QP.chili[500], track = QP.ink[100], height = 10, label }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[500], fontWeight: 600 }}>
          <span>{label}</span><span>{value}/{max}</span>
        </div>
      )}
      <div style={{ background: track, borderRadius: 999, height, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,.06)' }}>
        <div style={{
          width: `${pct}%`, height: '100%', background: color, borderRadius: 999,
          transition: 'width .4s cubic-bezier(.2,.7,.3,1)',
          boxShadow: `inset 0 -3px 0 rgba(0,0,0,.12)`,
        }} />
      </div>
    </div>
  );
}

// ─── Progress ring ────────────────────────────────────────────
function ProgressRing({ value, max = 100, size = 64, stroke = 8, color = QP.chili[500], track = QP.ink[100], children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={c} strokeDashoffset={c - c * pct} strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: 'stroke-dashoffset .4s' }} />
      </svg>
      {children && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: QP.fontDisplay, fontWeight: 800, color: QP.ink[800] }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────
function Avatar({ name = 'H', color = QP.chili[500], size = 48, emoji }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, color: 'white',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: QP.fontDisplay, fontWeight: 800, fontSize: size * 0.42,
      boxShadow: `inset 0 -4px 0 rgba(0,0,0,.15), 0 2px 0 rgba(0,0,0,.1)`,
      flexShrink: 0,
    }}>
      {emoji || name.charAt(0).toUpperCase()}
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────
function Card({ children, style, padded = true, dark, elevated }) {
  return (
    <div style={{
      background: dark ? QP.surface.darkCard : QP.surface.card,
      borderRadius: 20,
      padding: padded ? 24 : 0,
      boxShadow: elevated ? QP.shadow.lg : QP.shadow.sm,
      border: dark ? '1px solid rgba(255,255,255,.08)' : `1px solid ${QP.ink[100]}`,
      color: dark ? '#fcf9f3' : undefined,
      ...style,
    }}>{children}</div>
  );
}

// ─── Checkbox / Radio ─────────────────────────────────────────
function Checkbox({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: QP.fontBody, fontSize: 14, color: QP.ink[700] }}>
      <div onClick={() => onChange && onChange(!checked)} style={{
        width: 22, height: 22, borderRadius: 6,
        background: checked ? QP.chili[500] : 'white',
        border: `2px solid ${checked ? QP.chili[500] : QP.ink[300]}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .12s',
        boxShadow: checked ? `0 2px 0 ${QP.chili[700]}` : 'none',
      }}>
        {checked && <Icon.check width={14} height={14} style={{ color: 'white' }} />}
      </div>
      {label}
    </label>
  );
}

function Radio({ checked, onChange, label }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: QP.fontBody, fontSize: 14, color: QP.ink[700] }}>
      <div onClick={() => onChange && onChange(true)} style={{
        width: 22, height: 22, borderRadius: '50%',
        background: 'white',
        border: `2px solid ${checked ? QP.chili[500] : QP.ink[300]}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .12s',
      }}>
        {checked && <div style={{ width: 10, height: 10, borderRadius: '50%', background: QP.chili[500] }} />}
      </div>
      {label}
    </label>
  );
}

// ─── Toggle Segment ───────────────────────────────────────────
function Segment({ options, value, onChange }) {
  return (
    <div style={{ display: 'inline-flex', background: QP.ink[100], borderRadius: 12, padding: 4, gap: 2 }}>
      {options.map(o => (
        <button key={o.value} onClick={() => onChange && onChange(o.value)}
          style={{
            padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: value === o.value ? 'white' : 'transparent',
            color: value === o.value ? QP.ink[800] : QP.ink[500],
            fontFamily: QP.fontBody, fontWeight: 600, fontSize: 13,
            boxShadow: value === o.value ? '0 1px 2px rgba(0,0,0,.08)' : 'none',
            transition: 'all .12s',
          }}>{o.label}</button>
      ))}
    </div>
  );
}

Object.assign(window, { Icon, Button, Input, Badge, ProgressBar, ProgressRing, Avatar, Card, Checkbox, Radio, Segment });
