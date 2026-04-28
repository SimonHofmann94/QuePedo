// Foundation — Brand, Colors, Type, Voice, Iconography

// ─── Logo ────────────────────────────────────────────────────
function Logo({ size = 48, color = '#ef5a1c', textColor = '#1a1915', showText = true, variant = 'speech' }) {
  if (variant === 'speech') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
          {/* Speech bubble w/ tail */}
          <path d="M24 4 C36 4 44 12 44 22 C44 32 36 40 24 40 L16 40 L8 46 L10 38 C6 34 4 28 4 22 C4 12 12 4 24 4 Z" fill={color} />
          {/* Exclamation marks ¡! */}
          <text x="18" y="28" fill="white" fontSize="18" fontWeight="900" fontFamily="Fraunces, Georgia, serif" style={{ letterSpacing: -1 }}>¡!</text>
        </svg>
        {showText && (
          <div style={{ fontFamily: 'Caprasimo, Fraunces, Georgia, serif', fontSize: size * 0.56, color: textColor, letterSpacing: -0.5, lineHeight: 1 }}>
            ¿Qué Pedo<span style={{ color }}>!</span>
          </div>
        )}
      </div>
    );
  }
  return null;
}

// ─── Color swatch ────────────────────────────────────────────
function Swatch({ name, hex, textColor = '#1a1915', size = 'md' }) {
  const h = size === 'lg' ? 96 : size === 'sm' ? 52 : 72;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{
        height: h, background: hex, borderRadius: 14,
        boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)',
        display: 'flex', alignItems: 'flex-end', padding: 10,
        color: textColor, fontFamily: QP.fontBody, fontSize: 11, fontWeight: 600,
      }}>
        {name}
      </div>
      <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400], textTransform: 'uppercase' }}>{hex}</div>
    </div>
  );
}

function ColorRamp({ name, ramp, emoji }) {
  const entries = Object.entries(ramp);
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 12 }}>
        <div style={{ fontFamily: QP.fontDisplay, fontWeight: 700, fontSize: 22, color: QP.ink[700], letterSpacing: -0.3 }}>
          {emoji} {name}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${entries.length}, 1fr)`, gap: 8 }}>
        {entries.map(([stop, hex]) => (
          <div key={stop}>
            <div style={{
              height: 64, background: hex, borderRadius: 10,
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.05)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', padding: 6,
              color: parseInt(stop) >= 400 ? 'white' : QP.ink[700],
              fontFamily: QP.fontMono, fontSize: 10, fontWeight: 600,
            }}>{stop}</div>
            <div style={{ fontFamily: QP.fontMono, fontSize: 9, color: QP.ink[400], textTransform: 'uppercase', marginTop: 4, textAlign: 'center' }}>{hex}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Brand Panel ─────────────────────────────────────────────
function BrandPanel() {
  return (
    <div style={{ padding: 56, background: QP.surface.bg, fontFamily: QP.fontBody }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.chili[500], textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>01 · Brand Foundation</div>
          <div style={{ fontFamily: QP.fontDisplay, fontSize: 72, fontWeight: 800, color: QP.ink[800], letterSpacing: -2, lineHeight: 0.95 }}>¿Qué Pedo<span style={{ color: QP.chili[500] }}>!</span></div>
          <div style={{ fontSize: 18, color: QP.ink[500], marginTop: 12, maxWidth: 540 }}>Learn Spanish like you're actually gonna use it. Mercado-bright, cantina-loud, and seriously gamified.</div>
        </div>
        <div style={{ textAlign: 'right', fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[400] }}>
          <div>v1.0 · Abril 2026</div>
          <div>MX · DE · EN · +</div>
        </div>
      </div>

      {/* Logo explorations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 40 }}>
        <LogoCard bg={QP.surface.card} label="Primary">
          <Logo size={56} />
        </LogoCard>
        <LogoCard bg={QP.ink[800]} label="On dark" textLight>
          <Logo size={56} color={QP.chili[400]} textColor="#fcf9f3" />
        </LogoCard>
        <LogoCard bg={QP.chili[500]} label="Reversed" textLight>
          <Logo size={56} color="#ffffff" textColor="#ffffff" />
        </LogoCard>
      </div>

      {/* Voice */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <VoiceCard tone="We say" items={[
          ['¡Órale!', 'instead of Great job!'],
          ['Ándale', 'instead of Continue'],
          ['Chingón', 'for streaks & wins'],
          ['¿Qué pedo?', 'as the daily hello'],
        ]} accent={QP.jade[500]} />
        <VoiceCard tone="We don't say" items={[
          ['Congratulations', 'too corporate'],
          ['Loading...', 'use "Cocinando..."'],
          ['Error', 'use "¡Ay, no!"'],
          ['Submit', 'use "¡Dale!"'],
        ]} accent={QP.rosa[500]} strike />
      </div>
    </div>
  );
}

function LogoCard({ children, bg, label, textLight }) {
  return (
    <div style={{
      background: bg, borderRadius: 20, padding: 32, height: 180,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.06)',
    }}>
      <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: textLight ? 'rgba(255,255,255,.5)' : QP.ink[400], textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</div>
      <div>{children}</div>
    </div>
  );
}

function VoiceCard({ tone, items, accent, strike }) {
  return (
    <div style={{ background: QP.surface.card, borderRadius: 20, padding: 28, boxShadow: QP.shadow.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: accent }} />
        <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[600], textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>{tone}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {items.map(([a, b], i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
            <div style={{
              fontFamily: QP.fontDisplay, fontSize: 22, fontWeight: 700, color: QP.ink[800],
              textDecoration: strike ? 'line-through' : 'none',
              textDecorationColor: strike ? QP.rosa[400] : undefined,
              textDecorationThickness: strike ? 2 : undefined,
              minWidth: 140,
            }}>{a}</div>
            <div style={{ fontSize: 13, color: QP.ink[400] }}>{b}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Color Panel ─────────────────────────────────────────────
function ColorPanel() {
  return (
    <div style={{ padding: 56, background: QP.surface.bg, fontFamily: QP.fontBody }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.chili[500], textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>02 · Color Palette</div>
        <div style={{ fontFamily: QP.fontDisplay, fontSize: 48, fontWeight: 800, color: QP.ink[800], letterSpacing: -1.5, lineHeight: 1 }}>Papel picado, but make it usable.</div>
        <div style={{ fontSize: 16, color: QP.ink[500], marginTop: 10, maxWidth: 640 }}>Seven hue families, each named after something unmistakably Mexican. Every ramp is tuned for legible text and confident UI, not just pretty swatches.</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <ColorRamp name="Chili" emoji="🌶" ramp={QP.chili} />
        <ColorRamp name="Rosa Mexicano" emoji="🌺" ramp={QP.rosa} />
        <ColorRamp name="Jade" emoji="🌵" ramp={QP.jade} />
        <ColorRamp name="Cielo" emoji="☀" ramp={QP.cielo} />
        <ColorRamp name="Maíz" emoji="🌽" ramp={QP.maiz} />
        <ColorRamp name="Jacaranda" emoji="💜" ramp={QP.jacaranda} />
        <ColorRamp name="Ink" emoji="🖤" ramp={QP.ink} />
      </div>

      {/* Semantic mapping */}
      <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          ['Primary', QP.chili[500], 'Actions, CTAs'],
          ['Success', QP.jade[500], 'Correct, streaks'],
          ['Info', QP.cielo[500], 'Culture, learning'],
          ['Warning', QP.maiz[400], 'Review, fire'],
          ['Danger', QP.rosa[500], 'Wrong, destructive'],
          ['Accent', QP.jacaranda[500], 'Achievements'],
          ['Surface', QP.surface.card, 'Cards', QP.ink[800]],
          ['Canvas', QP.surface.bg, 'App bg', QP.ink[800]],
        ].map(([n, c, d, tc]) => (
          <div key={n} style={{ background: c, borderRadius: 14, padding: 16, color: tc || 'white', boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.08)' }}>
            <div style={{ fontFamily: QP.fontMono, fontSize: 10, textTransform: 'uppercase', opacity: .8, letterSpacing: 1 }}>{n}</div>
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 18, fontWeight: 700, marginTop: 4 }}>{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Typography Panel ────────────────────────────────────────
function TypePanel() {
  return (
    <div style={{ padding: 56, background: QP.surface.bg, fontFamily: QP.fontBody }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.chili[500], textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>03 · Typography</div>
        <div style={{ fontFamily: QP.fontDisplay, fontSize: 48, fontWeight: 800, color: QP.ink[800], letterSpacing: -1.5, lineHeight: 1 }}>Three voices that talk back.</div>
        <div style={{ fontSize: 16, color: QP.ink[500], marginTop: 10, maxWidth: 640 }}>A chunky display serif for personality, a workhorse sans for clarity, and a hand-lettered accent for the moments that deserve a shout.</div>
      </div>

      {/* Specimens */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <TypeSpecimen
          family="Fraunces"
          role="Display · Headings"
          font={QP.fontDisplay}
          weight={800}
          sample="¡Aprende español como si fuera un domingo en CDMX!"
          pangram="El veloz murciélago hindú comía feliz cardillo y kiwi."
          usage="Hero titles, screen headers, big numbers, feature cards"
          color={QP.ink[800]}
        />
        <TypeSpecimen
          family="Caprasimo"
          role="Accent · Marker"
          font={QP.fontMarker}
          weight={400}
          sample="¡Órale, chingón!"
          pangram="Reserved for celebratory moments, achievement unlocks, and brand flourishes."
          usage="Rewards, streak milestones, branded headlines"
          color={QP.chili[500]}
          fontSize={72}
        />
        <TypeSpecimen
          family="Plus Jakarta Sans"
          role="Body · UI"
          font={QP.fontBody}
          weight={500}
          sample="Master Spanish with lessons that get you speaking from día uno."
          pangram="The quick brown fox jumps over the lazy dog. 0123456789"
          usage="Body copy, buttons, inputs, labels, everything functional"
          color={QP.ink[700]}
          fontSize={28}
        />
        <TypeSpecimen
          family="JetBrains Mono"
          role="Mono · Details"
          font={QP.fontMono}
          weight={500}
          sample="ES → DE · A1 · streak:14 · xp:1,240"
          pangram="Reserved for numbers, codes, CEFR levels, and system-y details."
          usage="Tags, meta info, progress counters, tech details"
          color={QP.ink[600]}
          fontSize={22}
        />
      </div>

      {/* Scale */}
      <div style={{ marginTop: 40, background: QP.surface.card, borderRadius: 20, padding: 32, boxShadow: QP.shadow.sm }}>
        <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400], textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 20 }}>Type scale</div>
        {[
          ['Display XL', 72, 800, QP.fontDisplay, -2],
          ['Display L', 56, 800, QP.fontDisplay, -1.5],
          ['H1', 40, 700, QP.fontDisplay, -1],
          ['H2', 32, 700, QP.fontDisplay, -0.8],
          ['H3', 24, 700, QP.fontDisplay, -0.4],
          ['Body L', 18, 500, QP.fontBody, -0.2],
          ['Body', 15, 500, QP.fontBody, 0],
          ['Body S', 13, 500, QP.fontBody, 0],
          ['Caption', 11, 600, QP.fontMono, 1.5],
        ].map(([n, s, w, f, ls]) => (
          <div key={n} style={{ display: 'flex', alignItems: 'baseline', gap: 24, padding: '10px 0', borderBottom: '1px solid ' + QP.ink[100] }}>
            <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400], width: 80, textTransform: n === 'Caption' ? 'uppercase' : 'none' }}>{n}</div>
            <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400], width: 40 }}>{s}px</div>
            <div style={{ fontFamily: f, fontSize: s, fontWeight: w, color: QP.ink[800], letterSpacing: ls, lineHeight: 1 }}>
              {n === 'Caption' ? 'CAPTION · UPPERCASE' : '¡Qué pedo!'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TypeSpecimen({ family, role, font, weight, sample, pangram, usage, color, fontSize = 44 }) {
  return (
    <div style={{ background: QP.surface.card, borderRadius: 20, padding: 32, boxShadow: QP.shadow.sm, display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32 }}>
      <div>
        <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400], textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>{role}</div>
        <div style={{ fontFamily: QP.fontDisplay, fontSize: 22, fontWeight: 700, color: QP.ink[800], lineHeight: 1.1, marginBottom: 10 }}>{family}</div>
        <div style={{ fontSize: 12, color: QP.ink[500], lineHeight: 1.4 }}>{usage}</div>
      </div>
      <div>
        <div style={{ fontFamily: font, fontSize, fontWeight: weight, color, lineHeight: 1.05, letterSpacing: -0.5 }}>
          {sample}
        </div>
        <div style={{ marginTop: 16, fontFamily: font, fontSize: 13, color: QP.ink[400], fontWeight: 400 }}>
          {pangram}
        </div>
        <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[400, 500, 600, 700, 800].map(w => (
            <div key={w} style={{ fontFamily: font, fontSize: 18, fontWeight: w, color: QP.ink[700], padding: '6px 10px', background: QP.surface.muted, borderRadius: 6 }}>Aa {w}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Logo, BrandPanel, ColorPanel, TypePanel, Swatch, ColorRamp });
