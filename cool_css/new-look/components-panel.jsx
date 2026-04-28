// Components showcase + Illustration panels

function ComponentsPanel() {
  const [checked, setChecked] = React.useState(true);
  const [radio, setRadio] = React.useState('a');
  const [seg, setSeg] = React.useState('es');

  return (
    <div style={{ padding: 56, background: QP.surface.bg, fontFamily: QP.fontBody }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.chili[500], textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>04 · Components</div>
        <div style={{ fontFamily: QP.fontDisplay, fontSize: 48, fontWeight: 800, color: QP.ink[800], letterSpacing: -1.5, lineHeight: 1 }}>Chunky, tactile, springy.</div>
        <div style={{ fontSize: 16, color: QP.ink[500], marginTop: 10, maxWidth: 640 }}>Every button has a "press me" shadow. Every card earns its shape. Built to feel like a physical game, not a sterile form.</div>
      </div>

      {/* Buttons */}
      <Section title="Buttons" subtitle="Primary uses our signature chunky shadow. Press to feel the squish.">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
          <Button variant="primary" icon={<Icon.play width={16} height={16}/>}>Start Learning</Button>
          <Button variant="secondary">Log In</Button>
          <Button variant="success" icon={<Icon.check width={16} height={16}/>}>¡Dale!</Button>
          <Button variant="outline">Show Hints</Button>
          <Button variant="ghost">Skip</Button>
          <Button variant="danger" icon={<Icon.x width={16} height={16}/>}>Remove</Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 16 }}>
          <Button variant="primary" size="sm">Small</Button>
          <Button variant="primary" size="md">Medium</Button>
          <Button variant="primary" size="lg" iconRight={<Icon.arrow width={18} height={18}/>}>Large CTA</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </Section>

      {/* Inputs */}
      <Section title="Form controls">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <Input label="Spanish term" placeholder="la casa" />
          <Input label="Search vocabulary" placeholder="Search..." icon={<Icon.search/>} />
          <Input label="German translation" placeholder="Das Haus" hint="Required" />
          <Input label="Email" placeholder="tu@email.mx" error="¡Ay! That email is already registered" />
        </div>
        <div style={{ display: 'flex', gap: 32, marginTop: 20, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Checkbox checked={checked} onChange={setChecked} label="Show context sentences as hints" />
            <Checkbox checked={false} label="Show word tags" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Radio checked={radio === 'a'} onChange={() => setRadio('a')} label="ES → DE (see Spanish)" />
            <Radio checked={radio === 'b'} onChange={() => setRadio('b')} label="DE → ES (see German)" />
          </div>
          <Segment options={[{value:'es',label:'ES → DE'},{value:'de',label:'DE → ES'}]} value={seg} onChange={setSeg} />
        </div>
      </Section>

      {/* Badges */}
      <Section title="Badges & tags" subtitle="CEFR levels, word categories, streak indicators.">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <Badge color="chili">A1 · Beginner</Badge>
          <Badge color="jade">A2 · Elementary</Badge>
          <Badge color="cielo">B1 · Intermediate</Badge>
          <Badge color="maiz">B2 · Upper</Badge>
          <Badge color="jacaranda">C1 · Advanced</Badge>
          <Badge color="rosa">C2 · Mastery</Badge>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 12, alignItems: 'center' }}>
          <Badge color="chili" variant="soft">noun</Badge>
          <Badge color="jade" variant="soft">verb</Badge>
          <Badge color="cielo" variant="soft">adjective</Badge>
          <Badge color="jacaranda" variant="soft">slang</Badge>
          <Badge color="maiz" variant="soft">idiom</Badge>
          <Badge color="rosa" variant="outline">⚠ review</Badge>
          <Badge color="chili" variant="solid">🔥 14 day streak</Badge>
        </div>
      </Section>

      {/* Progress */}
      <Section title="Progress">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <ProgressBar value={72} label="Daily Goal" color={QP.chili[500]} />
            <ProgressBar value={45} label="A2 Grammar" color={QP.jade[500]} />
            <ProgressBar value={88} label="Vocab Mastery" color={QP.cielo[500]} />
            <ProgressBar value={22} label="C1 Culture" color={QP.jacaranda[500]} />
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'center' }}>
            <ProgressRing value={7} max={10} size={88} color={QP.chili[500]}>
              <div style={{ fontSize: 24 }}>7/10</div>
            </ProgressRing>
            <ProgressRing value={85} size={88} color={QP.jade[500]}>
              <div style={{ fontSize: 22 }}>85%</div>
            </ProgressRing>
            <ProgressRing value={14} max={30} size={88} color={QP.maiz[400]}>
              <div style={{ fontSize: 28 }}>🔥</div>
            </ProgressRing>
          </div>
        </div>
      </Section>

      {/* Avatars */}
      <Section title="Avatars & achievements">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar name="H" color={QP.chili[500]} size={64} />
          <Avatar name="M" color={QP.jade[500]} size={64} />
          <Avatar name="L" color={QP.cielo[500]} size={64} />
          <Avatar emoji="🌵" color={QP.jacaranda[500]} size={64} />
          <Avatar emoji="🌶" color={QP.rosa[500]} size={64} />
          <div style={{ marginLeft: 20, display: 'flex', gap: 10 }}>
            <AchievementBadge emoji="🔥" label="14-day Streak" color={QP.chili[500]} />
            <AchievementBadge emoji="⭐" label="First 100 words" color={QP.maiz[400]} />
            <AchievementBadge emoji="🏆" label="A1 Complete" color={QP.jade[500]} />
          </div>
        </div>
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
          <StatCard label="Vocabulary" value="247" sub="+12 this week" color={QP.chili[500]} icon={<Icon.book/>} />
          <StatCard label="Current Streak" value="14" sub="days · keep going" color={QP.maiz[400]} icon={<Icon.fire/>} />
          <StatCard label="Average Score" value="85%" sub="last 30 quizzes" color={QP.jade[500]} icon={<Icon.trophy/>} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}>
          <VocabCard term="la chamba" de="die Arbeit" tag="slang · MX" />
          <LessonCard title="Ordering at the taquería" sub="B1 · Cultural" progress={60} />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: QP.fontDisplay, fontSize: 24, fontWeight: 700, color: QP.ink[800], letterSpacing: -0.5 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: QP.ink[500], marginTop: 4 }}>{subtitle}</div>}
      </div>
      <div style={{ background: QP.surface.card, borderRadius: 20, padding: 28, boxShadow: QP.shadow.sm, border: `1px solid ${QP.ink[100]}` }}>
        {children}
      </div>
    </div>
  );
}

function AchievementBadge({ emoji, label, color }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px 8px 8px',
      background: 'white', borderRadius: 999, border: `2px solid ${color}`,
      boxShadow: `0 3px 0 ${color}`, fontFamily: QP.fontBody, fontWeight: 600, fontSize: 13, color: QP.ink[700],
    }}>
      <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{emoji}</div>
      {label}
    </div>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 20, border: `1px solid ${QP.ink[100]}`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 10, background: color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {React.cloneElement(icon, { width: 22, height: 22 })}
      </div>
      <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400], textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>{label}</div>
      <div style={{ fontFamily: QP.fontDisplay, fontSize: 44, fontWeight: 800, color: QP.ink[800], letterSpacing: -1, lineHeight: 1, marginTop: 8 }}>{value}</div>
      <div style={{ fontSize: 12, color: QP.ink[500], marginTop: 6 }}>{sub}</div>
    </div>
  );
}

function VocabCard({ term, de, tag }) {
  return (
    <div style={{ background: QP.chili[50], borderRadius: 16, padding: 20, border: `2px dashed ${QP.chili[200]}` }}>
      <Badge color="jacaranda" variant="soft" size="sm">{tag}</Badge>
      <div style={{ fontFamily: QP.fontDisplay, fontSize: 32, fontWeight: 700, color: QP.ink[800], marginTop: 8, letterSpacing: -0.5 }}>{term}</div>
      <div style={{ fontSize: 14, color: QP.ink[500], marginTop: 2 }}>{de}</div>
    </div>
  );
}

function LessonCard({ title, sub, progress }) {
  return (
    <div style={{ background: 'linear-gradient(135deg, ' + QP.cielo[500] + ', ' + QP.jacaranda[500] + ')', borderRadius: 16, padding: 20, color: 'white', position: 'relative', overflow: 'hidden' }}>
      <div style={{ fontFamily: QP.fontMono, fontSize: 10, opacity: .8, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>Lesson · {progress}%</div>
      <div style={{ fontFamily: QP.fontDisplay, fontSize: 22, fontWeight: 700, marginTop: 8, lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontSize: 12, opacity: .8, marginTop: 4 }}>{sub}</div>
      <div style={{ marginTop: 16 }}>
        <ProgressBar value={progress} color="white" track="rgba(255,255,255,.2)" height={6} />
      </div>
    </div>
  );
}

// ─── Illustration / motifs ────────────────────────────────────
function MotifsPanel() {
  return (
    <div style={{ padding: 56, background: QP.surface.bg, fontFamily: QP.fontBody }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.chili[500], textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>05 · Motifs & Illustration</div>
        <div style={{ fontFamily: QP.fontDisplay, fontSize: 48, fontWeight: 800, color: QP.ink[800], letterSpacing: -1.5, lineHeight: 1 }}>Papel picado, talavera, and chunky mascots.</div>
        <div style={{ fontSize: 16, color: QP.ink[500], marginTop: 10, maxWidth: 640 }}>Four motif families that carry cultural identity without tipping into cliché. Use sparingly as backgrounds, frames, and celebratory moments.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <MotifCard title="Papel picado" desc="Banner pattern — cut-paper flags. Use as section dividers, celebration headers.">
          <PapelPicado />
        </MotifCard>
        <MotifCard title="Talavera tile" desc="Geometric tile pattern. Use as card backgrounds, watermarks, texture fills.">
          <TalaveraTile />
        </MotifCard>
        <MotifCard title="Sunburst" desc="Radiating sun rays. Use for hero backgrounds, achievement unlocks.">
          <Sunburst />
        </MotifCard>
        <MotifCard title="Mascot · El Chili" desc="Optional friendly chili pepper mascot for onboarding, empty states, rewards.">
          <ChiliMascot />
        </MotifCard>
      </div>

      <div style={{ marginTop: 32 }}>
        <div style={{ fontFamily: QP.fontDisplay, fontSize: 24, fontWeight: 700, color: QP.ink[800], marginBottom: 12 }}>Icon system</div>
        <div style={{ background: 'white', borderRadius: 20, padding: 28, display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 16, boxShadow: QP.shadow.sm }}>
          {Object.entries(Icon).map(([name, I]) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: QP.surface.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', color: QP.ink[700] }}><I/></div>
              <div style={{ fontFamily: QP.fontMono, fontSize: 9, color: QP.ink[400], textTransform: 'uppercase' }}>{name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MotifCard({ title, desc, children }) {
  return (
    <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: QP.shadow.sm, border: `1px solid ${QP.ink[100]}` }}>
      <div style={{ height: 200, background: QP.surface.muted, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
        {children}
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ fontFamily: QP.fontDisplay, fontSize: 20, fontWeight: 700, color: QP.ink[800] }}>{title}</div>
        <div style={{ fontSize: 13, color: QP.ink[500], marginTop: 4 }}>{desc}</div>
      </div>
    </div>
  );
}

function PapelPicado({ colors, height = 60 }) {
  const pal = colors || [QP.chili[500], QP.rosa[500], QP.jade[500], QP.cielo[500], QP.maiz[400], QP.jacaranda[500]];
  return (
    <svg viewBox="0 0 600 120" width="100%" height={height} preserveAspectRatio="xMidYMid slice">
      <line x1="0" y1="8" x2="600" y2="8" stroke={QP.ink[400]} strokeWidth="1"/>
      {Array.from({length: 8}).map((_, i) => {
        const x = i * 75 + 10;
        const c = pal[i % pal.length];
        return (
          <g key={i} transform={`translate(${x}, 8)`}>
            <path d="M0 0 L60 0 L60 60 L30 90 L0 60 Z" fill={c} />
            {/* cut outs */}
            <circle cx="15" cy="20" r="4" fill="white"/>
            <circle cx="45" cy="20" r="4" fill="white"/>
            <path d="M20 35 L40 35 L30 50 Z" fill="white"/>
            <circle cx="30" cy="65" r="3" fill="white"/>
            {/* fringe */}
            <path d="M5 60 L5 70 M15 60 L15 72 M25 60 L25 74 M35 60 L35 74 M45 60 L45 72 M55 60 L55 70" stroke={c} strokeWidth="2"/>
          </g>
        );
      })}
    </svg>
  );
}

function TalaveraTile({ size = 180 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <rect width="100" height="100" fill={QP.cielo[50]}/>
      {/* flower center */}
      <circle cx="50" cy="50" r="8" fill={QP.chili[500]}/>
      <circle cx="50" cy="50" r="4" fill={QP.maiz[300]}/>
      {/* petals */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
        <g key={a} transform={`rotate(${a} 50 50)`}>
          <ellipse cx="50" cy="30" rx="5" ry="12" fill={QP.cielo[500]}/>
        </g>
      ))}
      {/* corner accents */}
      {[[10,10],[90,10],[10,90],[90,90]].map(([x,y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="5" fill={QP.jacaranda[400]}/>
          <circle cx={x} cy={y} r="2" fill="white"/>
        </g>
      ))}
      {/* border */}
      <rect x="2" y="2" width="96" height="96" fill="none" stroke={QP.cielo[600]} strokeWidth="1.5"/>
      <rect x="6" y="6" width="88" height="88" fill="none" stroke={QP.cielo[300]} strokeWidth="0.5"/>
    </svg>
  );
}

function Sunburst({ size = 200, color = QP.maiz[400] }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100">
      {Array.from({length: 16}).map((_, i) => (
        <path key={i} d="M0 -20 L3 -45 L-3 -45 Z" fill={color} transform={`rotate(${i * 22.5})`}/>
      ))}
      <circle r="18" fill={QP.chili[500]}/>
      <circle r="14" fill={QP.chili[400]}/>
      {/* face */}
      <circle cx="-5" cy="-3" r="1.5" fill={QP.ink[800]}/>
      <circle cx="5" cy="-3" r="1.5" fill={QP.ink[800]}/>
      <path d="M-5 4 Q0 8 5 4" stroke={QP.ink[800]} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    </svg>
  );
}

function ChiliMascot({ size = 180 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 120">
      {/* stem */}
      <path d="M50 15 Q48 5 55 8 Q58 3 62 10 Q65 6 62 15 Q55 18 50 15Z" fill={QP.jade[600]}/>
      {/* body */}
      <path d="M45 20 Q30 30 35 70 Q40 105 55 95 Q75 85 70 45 Q68 22 55 20 Q50 18 45 20Z" fill={QP.chili[500]}/>
      {/* highlight */}
      <path d="M40 35 Q38 50 42 65" stroke={QP.chili[300]} strokeWidth="3" fill="none" strokeLinecap="round"/>
      {/* face */}
      <circle cx="48" cy="55" r="3" fill={QP.ink[900]}/>
      <circle cx="62" cy="55" r="3" fill={QP.ink[900]}/>
      <circle cx="48" cy="54" r="1" fill="white"/>
      <circle cx="62" cy="54" r="1" fill="white"/>
      {/* smile */}
      <path d="M48 65 Q55 72 62 65" stroke={QP.ink[900]} strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* cheek blush */}
      <circle cx="42" cy="63" r="3" fill={QP.rosa[300]} opacity="0.6"/>
      <circle cx="68" cy="63" r="3" fill={QP.rosa[300]} opacity="0.6"/>
    </svg>
  );
}

Object.assign(window, { ComponentsPanel, MotifsPanel, PapelPicado, TalaveraTile, Sunburst, ChiliMascot, StatCard, VocabCard, LessonCard, AchievementBadge });
