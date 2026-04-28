// Que Pedo! — Redesigned screens
// All 7 screens from current app, reimagined in the new system.

// ─── Sidebar (shared between app screens) ──────────────────────
function Sidebar({ active = 'dashboard' }) {
  const items = [
    { id: 'dashboard', icon: Icon.home, label: 'Inicio' },
    { id: 'vocab', icon: Icon.book, label: 'Vocabulario' },
    { id: 'grammar', icon: Icon.chart, label: 'Gramática' },
    { id: 'exercises', icon: Icon.dumbbell, label: 'Ejercicios' },
    { id: 'culture', icon: Icon.globe, label: 'Cultura' },
    { id: 'profile', icon: Icon.user, label: 'Perfil' },
  ];
  return (
    <aside style={{
      width: 240, height: '100%', background: QP.surface.card, padding: 20,
      borderRight: `1px solid ${QP.ink[100]}`, display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ padding: '8px 12px 20px' }}>
        <Logo size={36} showText={true} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(it => {
          const isActive = active === it.id;
          return (
            <div key={it.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderRadius: 12,
              background: isActive ? QP.chili[500] : 'transparent',
              color: isActive ? 'white' : QP.ink[600],
              fontFamily: QP.fontBody, fontWeight: 600, fontSize: 14, cursor: 'pointer',
              boxShadow: isActive ? `0 3px 0 ${QP.chili[700]}` : 'none',
            }}>
              <it.icon width={20} height={20} />
              {it.label}
            </div>
          );
        })}
      </div>
      {/* streak footer */}
      <div style={{ background: QP.maiz[100], borderRadius: 14, padding: 14, border: `2px solid ${QP.maiz[300]}`, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 24 }}>🔥</div>
          <div>
            <div style={{ fontFamily: QP.fontDisplay, fontWeight: 800, fontSize: 22, color: QP.ink[800], lineHeight: 1 }}>14</div>
            <div style={{ fontFamily: QP.fontMono, fontSize: 9, color: QP.ink[500], textTransform: 'uppercase', letterSpacing: 1 }}>day streak</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10 }}>
        <Avatar name="H" color={QP.jacaranda[500]} size={36} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: QP.ink[800] }}>Habs Borsch</div>
          <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400] }}>A2 · 1,240 XP</div>
        </div>
      </div>
    </aside>
  );
}

// ─── LANDING ───────────────────────────────────────────────────
function LandingScreen() {
  return (
    <div style={{ width: 1280, height: 900, background: QP.surface.bg, fontFamily: QP.fontBody, overflow: 'hidden', position: 'relative' }}>
      {/* Papel picado banner */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 60, zIndex: 1 }}>
        <PapelPicado height={60} />
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '80px 56px 0', position: 'relative', zIndex: 2 }}>
        <Logo size={44} />
        <div style={{ display: 'flex', gap: 32, alignItems: 'center', fontSize: 14, fontWeight: 600, color: QP.ink[600] }}>
          <div>Cómo Funciona</div>
          <div>Precios</div>
          <div>Cultura</div>
          <Button variant="ghost" size="sm">Log In</Button>
          <Button variant="primary" size="sm">¡Empieza Gratis!</Button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: '40px 56px', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'center', marginTop: 20 }}>
        <div>
          <Badge color="maiz" variant="soft" size="lg" icon={<span>🌶</span>}>&nbsp;Spanish that actually slaps</Badge>
          <h1 style={{ fontFamily: QP.fontDisplay, fontSize: 88, fontWeight: 800, color: QP.ink[900], letterSpacing: -3.5, lineHeight: 0.92, margin: '20px 0 0' }}>
            Habla como <span style={{ fontFamily: QP.fontMarker, color: QP.chili[500], fontWeight: 400 }}>chingón</span>, no como libro de texto.
          </h1>
          <p style={{ fontSize: 19, color: QP.ink[500], marginTop: 24, lineHeight: 1.5, maxWidth: 520 }}>
            Real slang, real culture, real conversations. Learn the Spanish people actually speak in the mercado, the cantina, and at abuela's mesa.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <Button variant="primary" size="lg" iconRight={<Icon.arrow width={18} height={18}/>}>¡Empezar gratis!</Button>
            <Button variant="outline" size="lg" icon={<Icon.play width={16} height={16}/>}>Ver demo</Button>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 32, alignItems: 'center' }}>
            <div style={{ display: 'flex' }}>
              {[QP.chili[500], QP.jade[500], QP.cielo[500], QP.jacaranda[500], QP.rosa[500]].map((c, i) => (
                <div key={i} style={{ width: 36, height: 36, borderRadius: '50%', background: c, marginLeft: i === 0 ? 0 : -10, border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 13, fontFamily: QP.fontDisplay }}>{['A','M','L','D','S'][i]}</div>
              ))}
            </div>
            <div>
              <div style={{ fontFamily: QP.fontDisplay, fontWeight: 800, fontSize: 18, color: QP.ink[800] }}>47,000+ colegas</div>
              <div style={{ fontSize: 12, color: QP.ink[500] }}>learning with us right now</div>
            </div>
          </div>
        </div>

        {/* Hero visual — mercado scene */}
        <div style={{ position: 'relative', height: 520 }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 50%, ${QP.maiz[100]}, ${QP.chili[50]} 60%, transparent)`, borderRadius: 300 }} />
          <div style={{ position: 'absolute', top: 40, left: 40, right: 40, bottom: 40 }}>
            <MercadoScene />
          </div>
          {/* floating cards */}
          <div style={{ position: 'absolute', top: 80, right: -20, transform: 'rotate(6deg)' }}>
            <FloatingWordCard term="¡Órale!" de="Wow / Los geht's" tag="interjection" />
          </div>
          <div style={{ position: 'absolute', bottom: 60, left: -30, transform: 'rotate(-4deg)' }}>
            <FloatingWordCard term="la chamba" de="die Arbeit" tag="slang · MX" color={QP.jade[50]} border={QP.jade[300]} />
          </div>
          <div style={{ position: 'absolute', top: 200, left: 20, transform: 'rotate(-8deg)', background: 'white', borderRadius: 16, padding: 14, boxShadow: QP.shadow.lg, display: 'flex', alignItems: 'center', gap: 10, border: `2px solid ${QP.maiz[300]}` }}>
            <div style={{ fontSize: 24 }}>🔥</div>
            <div>
              <div style={{ fontFamily: QP.fontDisplay, fontWeight: 800, fontSize: 18, color: QP.ink[800], lineHeight: 1 }}>Streak +1</div>
              <div style={{ fontSize: 11, color: QP.ink[500] }}>14 days · ¡chingón!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FloatingWordCard({ term, de, tag, color = QP.chili[50], border = QP.chili[300] }) {
  return (
    <div style={{ background: color, borderRadius: 16, padding: 16, boxShadow: QP.shadow.lg, border: `2px solid ${border}`, minWidth: 180 }}>
      <Badge color="jacaranda" variant="soft" size="sm">{tag}</Badge>
      <div style={{ fontFamily: QP.fontDisplay, fontSize: 26, fontWeight: 700, color: QP.ink[800], marginTop: 6, letterSpacing: -0.5, lineHeight: 1 }}>{term}</div>
      <div style={{ fontSize: 12, color: QP.ink[500], marginTop: 4 }}>{de}</div>
    </div>
  );
}

function MercadoScene() {
  return (
    <svg viewBox="0 0 400 400" width="100%" height="100%">
      {/* sun */}
      <circle cx="200" cy="180" r="90" fill={QP.maiz[300]}/>
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
        <path key={a} d="M200 70 L205 40 L195 40 Z" fill={QP.maiz[400]} transform={`rotate(${a} 200 180)`}/>
      ))}
      {/* buildings */}
      <rect x="60" y="170" width="90" height="160" fill={QP.chili[400]} rx="4"/>
      <rect x="250" y="150" width="100" height="180" fill={QP.rosa[400]} rx="4"/>
      <rect x="155" y="190" width="90" height="140" fill={QP.cielo[400]} rx="4"/>
      {/* doors / windows */}
      <rect x="90" y="250" width="30" height="80" fill={QP.ink[800]} rx="2"/>
      <rect x="275" y="220" width="50" height="110" fill={QP.ink[800]} rx="2"/>
      <rect x="180" y="230" width="40" height="30" fill={QP.maiz[200]} rx="2"/>
      <rect x="80" y="200" width="20" height="20" fill={QP.maiz[200]} rx="2"/>
      <rect x="115" y="200" width="20" height="20" fill={QP.maiz[200]} rx="2"/>
      {/* palms */}
      <rect x="30" y="200" width="6" height="130" fill={QP.masa[500]}/>
      <path d="M33 195 Q15 185 5 200 Q20 198 33 205Z" fill={QP.jade[500]}/>
      <path d="M33 195 Q50 185 60 200 Q45 198 33 205Z" fill={QP.jade[500]}/>
      <path d="M33 200 Q15 210 5 225 Q20 215 33 212Z" fill={QP.jade[500]}/>
      <path d="M33 200 Q55 210 65 225 Q45 215 33 212Z" fill={QP.jade[500]}/>

      <rect x="365" y="220" width="6" height="110" fill={QP.masa[500]}/>
      <path d="M368 215 Q350 205 340 220 Q355 218 368 225Z" fill={QP.jade[500]}/>
      <path d="M368 215 Q385 205 395 220 Q380 218 368 225Z" fill={QP.jade[500]}/>
      {/* ground */}
      <rect x="0" y="330" width="400" height="70" fill={QP.masa[300]}/>
      {/* people silhouettes */}
      <g transform="translate(100 270)">
        <circle cx="0" cy="0" r="14" fill={QP.ink[700]}/>
        <rect x="-12" y="10" width="24" height="50" rx="6" fill={QP.chili[600]}/>
      </g>
      <g transform="translate(200 280)">
        <circle cx="0" cy="0" r="14" fill={QP.ink[700]}/>
        <rect x="-14" y="10" width="28" height="45" rx="6" fill={QP.maiz[400]}/>
      </g>
      <g transform="translate(300 275)">
        <circle cx="0" cy="0" r="14" fill={QP.ink[700]}/>
        <rect x="-12" y="10" width="24" height="50" rx="6" fill={QP.jade[500]}/>
      </g>
      {/* papel picado overhead */}
      <line x1="20" y1="120" x2="380" y2="120" stroke={QP.ink[700]} strokeWidth="1"/>
      {[60, 120, 180, 240, 300].map((x, i) => {
        const c = [QP.chili[500], QP.cielo[500], QP.rosa[500], QP.jade[500], QP.jacaranda[500]][i];
        return <path key={x} d={`M${x-15} 120 L${x+15} 120 L${x+15} 150 L${x} 165 L${x-15} 150Z`} fill={c}/>;
      })}
    </svg>
  );
}

// ─── DASHBOARD ─────────────────────────────────────────────────
function DashboardScreen() {
  const days = ['Vie','Sab','Dom','Lun','Mar','Mié','Jue'];
  const streak = [true, true, true, false, true, true, true];
  return (
    <div style={{ width: 1280, height: 900, background: QP.surface.bg, fontFamily: QP.fontBody, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="dashboard" />
      <main style={{ flex: 1, padding: 40, overflow: 'auto' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: QP.fontMarker, fontSize: 56, color: QP.chili[500], lineHeight: 1 }}>¡Qué pedo, Habs!</div>
            <div style={{ fontSize: 16, color: QP.ink[500], marginTop: 6 }}>Martes, 23 de abril · 7 days until your A2 goal</div>
          </div>
          <Button variant="primary" size="md" icon={<Icon.play width={16} height={16}/>}>Continuar lección</Button>
        </div>

        {/* stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard label="Vocabulario" value="247" sub="+12 esta semana" color={QP.chili[500]} icon={<Icon.book/>} />
          <StatCard label="Racha" value="14" sub="¡no la rompas!" color={QP.maiz[400]} icon={<Icon.fire/>} />
          <StatCard label="Promedio" value="85%" sub="últimos 30 quizzes" color={QP.jade[500]} icon={<Icon.trophy/>} />
          <StatCard label="Tiempo" value="120m" sub="esta semana" color={QP.cielo[500]} icon={<Icon.chart/>} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24 }}>
          {/* Quick actions */}
          <div>
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 22, fontWeight: 700, color: QP.ink[800], marginBottom: 12 }}>Acciones rápidas</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <QuickAction color={QP.chili[500]} emoji="📚" title="Continuar" sub="Lección 12 · Modo subjuntivo" />
              <QuickAction color={QP.jade[500]} emoji="🎯" title="Quiz diario" sub="10 palabras · 2 min" />
              <QuickAction color={QP.cielo[500]} emoji="➕" title="Añadir palabra" sub="Expande tu cuaderno" />
              <QuickAction color={QP.jacaranda[500]} emoji="📊" title="Ver progreso" sub="Tu ruta a C2" />
            </div>

            {/* Weekly streak */}
            <div style={{ marginTop: 24, background: 'white', borderRadius: 20, padding: 24, border: `1px solid ${QP.ink[100]}`, boxShadow: QP.shadow.sm }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                <div>
                  <div style={{ fontFamily: QP.fontDisplay, fontSize: 20, fontWeight: 700, color: QP.ink[800] }}>Tu semana</div>
                  <div style={{ fontSize: 12, color: QP.ink[500] }}>6 of 7 days · ¡mantén la racha!</div>
                </div>
                <Badge color="maiz" variant="solid">🔥 14 days</Badge>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
                {days.map((d, i) => (
                  <div key={d} style={{ textAlign: 'center' }}>
                    <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400], textTransform: 'uppercase', marginBottom: 8 }}>{d}</div>
                    <div style={{
                      width: '100%', aspectRatio: '1', borderRadius: 12,
                      background: streak[i] ? QP.chili[500] : QP.ink[100],
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: streak[i] ? 'white' : QP.ink[400],
                      fontSize: 20,
                      boxShadow: streak[i] ? `0 3px 0 ${QP.chili[700]}` : 'none',
                    }}>
                      {streak[i] ? '🔥' : '·'}
                    </div>
                    <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[500], marginTop: 6, fontWeight: 600 }}>{17 + i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side — daily challenge + activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Daily challenge */}
            <div style={{ background: `linear-gradient(135deg, ${QP.chili[500]}, ${QP.rosa[500]})`, borderRadius: 20, padding: 24, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.2 }}>
                <Sunburst size={160} color="white" />
              </div>
              <Badge color="maiz" variant="solid" size="sm">⚡ Reto del día</Badge>
              <div style={{ fontFamily: QP.fontDisplay, fontSize: 28, fontWeight: 800, marginTop: 12, lineHeight: 1.1, letterSpacing: -0.5 }}>Ordena una torta en la esquina</div>
              <div style={{ fontSize: 13, opacity: .9, marginTop: 8, maxWidth: 240 }}>5 minute roleplay · B1 · speaking practice</div>
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: QP.fontMono, fontSize: 11, opacity: .9 }}>+50 XP · +1 🔥</div>
                <div style={{ background: 'white', color: QP.chili[600], padding: '8px 14px', borderRadius: 10, fontWeight: 700, fontSize: 13, boxShadow: '0 3px 0 rgba(0,0,0,.15)' }}>¡Dale! →</div>
              </div>
            </div>

            {/* Recent */}
            <div style={{ background: 'white', borderRadius: 20, padding: 20, border: `1px solid ${QP.ink[100]}`, boxShadow: QP.shadow.sm }}>
              <div style={{ fontFamily: QP.fontDisplay, fontSize: 18, fontWeight: 700, color: QP.ink[800], marginBottom: 14 }}>Actividad reciente</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['🎯', 'Quiz A2 · Verbs', '10/10 · hace 2h', QP.jade[500]],
                  ['📚', '+8 palabras nuevas', 'Mercado vocab · ayer', QP.chili[500]],
                  ['🏆', 'Logro: 100 palabras', 'hace 3 días', QP.maiz[400]],
                ].map(([e, t, s, c], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{e}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: QP.ink[800] }}>{t}</div>
                      <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400] }}>{s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickAction({ color, emoji, title, sub }) {
  return (
    <div style={{
      background: 'white', borderRadius: 16, padding: 20, cursor: 'pointer',
      border: `1px solid ${QP.ink[100]}`, boxShadow: QP.shadow.sm,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, boxShadow: `0 3px 0 rgba(0,0,0,.15)` }}>{emoji}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: QP.fontDisplay, fontWeight: 700, fontSize: 16, color: QP.ink[800] }}>{title}</div>
        <div style={{ fontSize: 12, color: QP.ink[500], marginTop: 2 }}>{sub}</div>
      </div>
      <Icon.arrow width={18} height={18} style={{ color: QP.ink[400] }} />
    </div>
  );
}

// ─── VOCABULARY ────────────────────────────────────────────────
function VocabScreen() {
  const words = [
    { es: 'la chamba', de: 'die Arbeit', en: 'job (slang)', tag: 'slang', level: 'A2', known: 0.8 },
    { es: '¡órale!', de: 'Los geht\'s!', en: 'wow / let\'s go', tag: 'idiom', level: 'A1', known: 1 },
    { es: 'el mercado', de: 'der Markt', en: 'market', tag: 'noun', level: 'A1', known: 1 },
    { es: 'chingón', de: 'krass / super', en: 'badass', tag: 'slang', level: 'A2', known: 0.6 },
  ];
  const tagColor = { slang: 'jacaranda', idiom: 'rosa', noun: 'chili', verb: 'jade', adj: 'cielo' };
  const levelColor = { A1: 'chili', A2: 'jade', B1: 'cielo', B2: 'maiz', C1: 'jacaranda', C2: 'rosa' };

  return (
    <div style={{ width: 1280, height: 900, background: QP.surface.bg, fontFamily: QP.fontBody, display: 'flex', overflow: 'hidden', position: 'relative' }}>
      <Sidebar active="vocab" />
      <main style={{ flex: 1, padding: 40, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.chili[500], textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>Tu cuaderno</div>
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 48, fontWeight: 800, color: QP.ink[800], letterSpacing: -1.5, lineHeight: 1, marginTop: 4 }}>247 palabras</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Button variant="outline" icon={<Icon.sparkle width={16} height={16}/>}>AI generar</Button>
            <Button variant="primary" icon={<Icon.plus width={16} height={16}/>}>Añadir palabra</Button>
          </div>
        </div>

        {/* filters */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
          <Input placeholder="Buscar en vocabulario..." icon={<Icon.search/>} style={{ flex: 1, minWidth: 300 }} />
          <Segment options={[{value:'all',label:'Todas'},{value:'new',label:'Nuevas'},{value:'review',label:'Repaso'},{value:'mastered',label:'Dominadas'}]} value="all" />
        </div>

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(l => (
            <Badge key={l} color={levelColor[l]} variant={l === 'A2' ? 'solid' : 'outline'}>{l}</Badge>
          ))}
          <div style={{ flex: 1 }}/>
          <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[500] }}>Mostrando 8 de 247</div>
        </div>

        {/* word grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, maxWidth: 560 }}>
          {words.map((w, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 16, padding: 18,
              border: `1px solid ${QP.ink[100]}`, boxShadow: QP.shadow.sm,
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: QP[levelColor[w.level]][500] }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <Badge color={tagColor[w.tag]} variant="soft" size="sm">{w.tag}</Badge>
                <div style={{ fontFamily: QP.fontMono, fontSize: 9, color: QP.ink[400], fontWeight: 700 }}>{w.level}</div>
              </div>
              <div style={{ fontFamily: QP.fontDisplay, fontSize: 26, fontWeight: 700, color: QP.ink[800], letterSpacing: -0.5, lineHeight: 1.1 }}>{w.es}</div>
              <div style={{ fontSize: 13, color: QP.ink[500], marginTop: 4 }}>{w.de}</div>
              <div style={{ fontSize: 11, color: QP.ink[400], fontStyle: 'italic', marginTop: 2 }}>{w.en}</div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <ProgressBar value={w.known * 100} color={QP.jade[500]} height={4} />
                </div>
                <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400], fontWeight: 700 }}>{Math.round(w.known * 100)}%</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add word modal — shown as overlay with dim backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,25,21,.45)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 240 }}>
      <div style={{ width: 420, background: 'white', borderRadius: 20, padding: 28, boxShadow: QP.shadow.xl, border: `1px solid ${QP.ink[100]}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 22, fontWeight: 700, color: QP.ink[800] }}>Nueva palabra</div>
            <div style={{ fontSize: 12, color: QP.ink[500] }}>Añade a tu cuaderno</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: QP.ink[100], display: 'flex', alignItems: 'center', justifyContent: 'center', color: QP.ink[500] }}><Icon.x width={16} height={16}/></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input label="Término en español" placeholder="la casa" />
          <Input label="Traducción alemana" placeholder="das Haus" />
          <Input label="Sinónimos" placeholder="hogar, vivienda" hint="Separados por coma" />
          <Input label="Frase de contexto" placeholder="Vivo en una casa grande." />
          <Button variant="primary" fullWidth icon={<Icon.plus width={16} height={16}/>}>¡Añadir!</Button>
        </div>
      </div>
      </div>
    </div>
  );
}

// ─── GRAMMAR ───────────────────────────────────────────────────
function GrammarScreen() {
  const levels = [
    { code: 'A1', label: 'Principiante', desc: 'Saludos, verbos regulares, pronombres', progress: 100, state: 'done', color: QP.chili[500] },
    { code: 'A2', label: 'Elemental', desc: 'Pretérito, futuro, objetos directos', progress: 62, state: 'current', color: QP.jade[500] },
    { code: 'B1', label: 'Intermedio', desc: 'Subjuntivo, condicional, por/para', progress: 0, state: 'locked', color: QP.cielo[500] },
    { code: 'B2', label: 'Alto', desc: 'Subjuntivo imperfecto, voz pasiva', progress: 0, state: 'locked', color: QP.maiz[400] },
    { code: 'C1', label: 'Avanzado', desc: 'Matices, registros, expresiones idiomáticas', progress: 0, state: 'locked', color: QP.jacaranda[500] },
    { code: 'C2', label: 'Maestría', desc: 'Fluidez nativa, literatura, dialectos', progress: 0, state: 'locked', color: QP.rosa[500] },
  ];

  return (
    <div style={{ width: 1280, height: 900, background: QP.surface.bg, fontFamily: QP.fontBody, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="grammar" />
      <main style={{ flex: 1, padding: 40, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.chili[500], textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>Tu ruta</div>
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 48, fontWeight: 800, color: QP.ink[800], letterSpacing: -1.5, lineHeight: 1, marginTop: 4 }}>Gramática</div>
            <div style={{ fontSize: 15, color: QP.ink[500], marginTop: 8 }}>Del "hola" al "me cai re gordo" · 6 niveles · CEFR oficial</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[400], textTransform: 'uppercase', letterSpacing: 1.5 }}>Nivel actual</div>
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 48, fontWeight: 800, color: QP.jade[500], lineHeight: 1, letterSpacing: -1 }}>A2</div>
          </div>
        </div>

        {/* Path visualization */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {levels.map((l, i) => {
            const locked = l.state === 'locked';
            const current = l.state === 'current';
            const done = l.state === 'done';
            return (
              <div key={l.code} style={{
                background: locked ? QP.ink[50] : 'white',
                borderRadius: 20,
                padding: 28,
                border: current ? `3px solid ${l.color}` : `1px solid ${QP.ink[100]}`,
                boxShadow: current ? `0 6px 0 ${l.color}` : (locked ? 'none' : QP.shadow.sm),
                position: 'relative', overflow: 'hidden',
                opacity: locked ? 0.6 : 1,
                minHeight: 240,
              }}>
                {/* corner motif */}
                {!locked && <div style={{ position: 'absolute', top: -30, right: -30, opacity: 0.08 }}><TalaveraTile size={120}/></div>}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: locked ? QP.ink[200] : l.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontFamily: QP.fontDisplay, fontWeight: 800, fontSize: 24,
                    boxShadow: locked ? 'none' : `0 4px 0 rgba(0,0,0,.15)`,
                  }}>
                    {locked ? <Icon.lock width={22} height={22}/> : l.code}
                  </div>
                  {done && <Badge color="jade" variant="solid" size="sm">✓ Completo</Badge>}
                  {current && <Badge color="maiz" variant="solid" size="sm">⚡ Ahora</Badge>}
                </div>

                <div style={{ fontFamily: QP.fontDisplay, fontSize: 24, fontWeight: 700, color: QP.ink[800], letterSpacing: -0.5 }}>Nivel {l.code}</div>
                <div style={{ fontSize: 14, color: QP.ink[600], fontWeight: 600, marginTop: 4 }}>{l.label}</div>
                <div style={{ fontSize: 12, color: QP.ink[500], marginTop: 8, lineHeight: 1.4 }}>{l.desc}</div>

                {!locked && (
                  <div style={{ marginTop: 16 }}>
                    <ProgressBar value={l.progress} color={l.color} height={8} />
                    <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[500], marginTop: 6, fontWeight: 600 }}>{l.progress}% · {l.progress === 100 ? '¡ya lo dominas!' : done ? '' : 'keep going'}</div>
                  </div>
                )}

                {locked && (
                  <div style={{ marginTop: 16, fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[500], fontWeight: 600 }}>
                    Completa {levels[i-1]?.code} primero
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

// ─── EXERCISES / QUIZ ──────────────────────────────────────────
function ExercisesScreen() {
  return (
    <div style={{ width: 1280, height: 900, background: QP.surface.bg, fontFamily: QP.fontBody, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="exercises" />
      <main style={{ flex: 1, padding: 40, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 640 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: QP.chili[500], display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 0 ${QP.chili[700]}`, fontSize: 32 }}>🎯</div>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 44, fontWeight: 800, color: QP.ink[800], letterSpacing: -1.5, lineHeight: 1 }}>Configura tu quiz</div>
            <div style={{ fontSize: 15, color: QP.ink[500], marginTop: 8 }}>Ajústalo a tu mood · dale cuando estés listo</div>
          </div>

          <div style={{ background: 'white', borderRadius: 24, padding: 32, boxShadow: QP.shadow.md, border: `1px solid ${QP.ink[100]}` }}>
            {/* Number of words */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[600], textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>Número de palabras</div>
                <div style={{ fontFamily: QP.fontDisplay, fontSize: 28, fontWeight: 800, color: QP.chili[500], lineHeight: 1 }}>10</div>
              </div>
              <div style={{ position: 'relative', height: 14, background: QP.ink[100], borderRadius: 999 }}>
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '20%', background: QP.chili[500], borderRadius: 999, boxShadow: `inset 0 -3px 0 ${QP.chili[700]}` }} />
                <div style={{ position: 'absolute', left: '20%', top: -4, width: 22, height: 22, borderRadius: '50%', background: 'white', border: `3px solid ${QP.chili[500]}`, transform: 'translateX(-50%)', boxShadow: QP.shadow.sm }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400] }}>
                <span>5</span><span>25</span><span>50</span>
              </div>
            </div>

            {/* Difficulty */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[600], textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 10 }}>Dificultad</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1,2,3,4,5].map(n => (
                  <div key={n} style={{
                    flex: 1, height: 48, borderRadius: 12,
                    background: n <= 2 ? QP.chili[500] : 'white',
                    border: `2px solid ${n <= 2 ? QP.chili[500] : QP.ink[200]}`,
                    color: n <= 2 ? 'white' : QP.ink[500],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: QP.fontDisplay, fontWeight: 800, fontSize: 18,
                    boxShadow: n <= 2 ? `0 3px 0 ${QP.chili[700]}` : 'none',
                  }}>
                    {Array.from({length: n}).map((_, i) => <span key={i} style={{ opacity: n <= 2 ? 1 : .4 }}>🌶</span>)}
                  </div>
                ))}
              </div>
            </div>

            {/* CEFR */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[600], textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 10 }}>Nivel CEFR</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  ['A1', QP.chili[500], true], ['A2', QP.jade[500], true],
                  ['B1', QP.cielo[500], true], ['B2', QP.maiz[400], false],
                  ['C1', QP.jacaranda[500], false], ['C2', QP.rosa[500], false]
                ].map(([l, c, active]) => (
                  <div key={l} style={{
                    flex: 1, height: 48, borderRadius: 12,
                    background: active ? c : 'white',
                    border: `2px solid ${active ? c : QP.ink[200]}`,
                    color: active ? 'white' : QP.ink[400],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: QP.fontDisplay, fontWeight: 800, fontSize: 16,
                    boxShadow: active ? `0 3px 0 rgba(0,0,0,.2)` : 'none',
                  }}>{l}</div>
                ))}
              </div>
            </div>

            {/* Direction */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[600], textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 10 }}>Dirección del quiz</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div style={{ padding: 16, borderRadius: 14, border: `2px solid ${QP.chili[500]}`, background: QP.chili[50], boxShadow: `0 3px 0 ${QP.chili[300]}` }}>
                  <div style={{ fontFamily: QP.fontDisplay, fontWeight: 700, fontSize: 18, color: QP.chili[700] }}>ES → DE</div>
                  <div style={{ fontSize: 12, color: QP.ink[500], marginTop: 2 }}>Ves español, escribes alemán</div>
                </div>
                <div style={{ padding: 16, borderRadius: 14, border: `2px solid ${QP.ink[200]}`, background: 'white' }}>
                  <div style={{ fontFamily: QP.fontDisplay, fontWeight: 700, fontSize: 18, color: QP.ink[700] }}>DE → ES</div>
                  <div style={{ fontSize: 12, color: QP.ink[500], marginTop: 2 }}>Ves alemán, escribes español</div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.ink[600], textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>Opciones</div>
              <Checkbox checked={true} label="Mostrar frases de contexto como pistas" />
              <Checkbox checked={false} label="Mostrar etiquetas de palabras" />
              <Checkbox checked={true} label="Sonidos de celebración" />
            </div>

            <Button variant="primary" size="lg" fullWidth icon={<Icon.play width={18} height={18}/>}>¡Dale! Empezar quiz</Button>
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── CULTURE ───────────────────────────────────────────────────
function CultureScreen() {
  const regions = [
    { name: 'México', cities: 12, color: QP.chili[500], x: '20%', y: '38%' },
    { name: 'España', cities: 8, color: QP.maiz[400], x: '48%', y: '28%' },
    { name: 'Argentina', cities: 6, color: QP.cielo[500], x: '32%', y: '74%' },
    { name: 'Colombia', cities: 5, color: QP.jade[500], x: '26%', y: '48%' },
    { name: 'Perú', cities: 4, color: QP.jacaranda[500], x: '25%', y: '60%' },
    { name: 'Chile', cities: 3, color: QP.rosa[500], x: '28%', y: '78%' },
  ];
  return (
    <div style={{ width: 1280, height: 900, background: QP.surface.bg, fontFamily: QP.fontBody, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="culture" />
      <main style={{ flex: 1, padding: 40, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: QP.fontMono, fontSize: 11, color: QP.chili[500], textTransform: 'uppercase', letterSpacing: 2, fontWeight: 700 }}>21 países · 500M hablantes</div>
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 48, fontWeight: 800, color: QP.ink[800], letterSpacing: -1.5, lineHeight: 1, marginTop: 4 }}>Mapa cultural</div>
            <div style={{ fontSize: 15, color: QP.ink[500], marginTop: 6 }}>Un idioma, mil formas de decirlo. Explora slang, comida y costumbres por región.</div>
          </div>
          <Segment options={[{value:'slang',label:'Slang'},{value:'food',label:'Comida'},{value:'music',label:'Música'}]} value="slang" />
        </div>

        {/* Map */}
        <div style={{ background: QP.cielo[50], borderRadius: 24, height: 520, position: 'relative', overflow: 'hidden', border: `1px solid ${QP.cielo[200]}` }}>
          {/* Stylized continents */}
          <svg viewBox="0 0 1000 520" width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            {/* Americas */}
            <path d="M 120 110 Q 200 80 260 130 L 290 210 Q 280 260 240 280 L 250 360 Q 260 440 200 460 L 170 440 Q 140 360 160 300 Q 120 260 110 210 Z" fill={QP.masa[200]} stroke={QP.masa[400]} strokeWidth="1.5"/>
            {/* Europe/Africa outline */}
            <path d="M 440 100 Q 520 90 560 140 L 580 210 Q 570 280 540 340 Q 560 400 540 460 L 490 450 Q 460 400 450 340 L 440 250 Q 420 180 440 100 Z" fill={QP.masa[200]} stroke={QP.masa[400]} strokeWidth="1.5"/>
            {/* decorative latitudes */}
            <line x1="0" y1="260" x2="1000" y2="260" stroke={QP.cielo[200]} strokeWidth="1" strokeDasharray="4 8"/>
            <line x1="0" y1="180" x2="1000" y2="180" stroke={QP.cielo[200]} strokeWidth="1" strokeDasharray="4 8"/>
            <line x1="0" y1="340" x2="1000" y2="340" stroke={QP.cielo[200]} strokeWidth="1" strokeDasharray="4 8"/>
          </svg>

          {/* Region pins */}
          {regions.map((r, i) => (
            <div key={r.name} style={{ position: 'absolute', left: r.x, top: r.y, transform: 'translate(-50%, -100%)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  background: 'white', padding: '6px 12px', borderRadius: 12,
                  boxShadow: QP.shadow.md, border: `2px solid ${r.color}`,
                  fontFamily: QP.fontDisplay, fontWeight: 700, fontSize: 13, color: QP.ink[800],
                  whiteSpace: 'nowrap',
                }}>
                  {r.name}
                  <span style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400], marginLeft: 6 }}>{r.cities}</span>
                </div>
                <div style={{ width: 2, height: 10, background: r.color }}/>
                <div style={{ width: 14, height: 14, borderRadius: '50%', background: r.color, border: '3px solid white', boxShadow: QP.shadow.sm }}/>
              </div>
            </div>
          ))}

          {/* Featured overlay — bottom */}
          <div style={{ position: 'absolute', left: 24, bottom: 24, background: 'white', borderRadius: 16, padding: 18, boxShadow: QP.shadow.lg, width: 280, border: `1px solid ${QP.ink[100]}` }}>
            <Badge color="chili" variant="solid" size="sm">🇲🇽 México · esta semana</Badge>
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 20, fontWeight: 700, color: QP.ink[800], marginTop: 8, lineHeight: 1.1 }}>Slang de CDMX</div>
            <div style={{ fontSize: 12, color: QP.ink[500], marginTop: 4 }}>"No manches", "qué padre", "va que va"</div>
            <Button variant="outline" size="sm" style={{ marginTop: 12 }}>Explorar →</Button>
          </div>
        </div>

        {/* Country cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 20 }}>
          {[
            { flag: '🇲🇽', name: 'México', phrase: '"¡No manches!"', mean: 'No way!' },
            { flag: '🇦🇷', name: 'Argentina', phrase: '"Che, boludo"', mean: 'Hey dude' },
            { flag: '🇪🇸', name: 'España', phrase: '"Vale, tío"', mean: 'OK, dude' },
            { flag: '🇨🇴', name: 'Colombia', phrase: '"¡Qué chimba!"', mean: 'Awesome!' },
          ].map(c => (
            <div key={c.name} style={{ background: 'white', borderRadius: 16, padding: 18, border: `1px solid ${QP.ink[100]}`, boxShadow: QP.shadow.sm }}>
              <div style={{ fontSize: 32 }}>{c.flag}</div>
              <div style={{ fontFamily: QP.fontDisplay, fontWeight: 700, fontSize: 14, color: QP.ink[700], marginTop: 6 }}>{c.name}</div>
              <div style={{ fontFamily: QP.fontDisplay, fontWeight: 700, fontSize: 18, color: QP.ink[800], marginTop: 8, letterSpacing: -0.3 }}>{c.phrase}</div>
              <div style={{ fontSize: 12, color: QP.ink[500], marginTop: 2 }}>{c.mean}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// ─── PROFILE ───────────────────────────────────────────────────
function ProfileScreen() {
  return (
    <div style={{ width: 1280, height: 900, background: QP.surface.bg, fontFamily: QP.fontBody, display: 'flex', overflow: 'hidden' }}>
      <Sidebar active="profile" />
      <main style={{ flex: 1, padding: 40, overflow: 'auto' }}>
        {/* Header card */}
        <div style={{ background: `linear-gradient(135deg, ${QP.chili[500]}, ${QP.jacaranda[500]})`, borderRadius: 24, padding: 32, color: 'white', position: 'relative', overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ position: 'absolute', top: -40, right: -40, opacity: 0.15 }}><TalaveraTile size={240}/></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <Avatar name="H" color={QP.maiz[400]} size={96} />
              <div style={{ position: 'absolute', bottom: -4, right: -4, width: 32, height: 32, borderRadius: '50%', background: QP.jade[500], display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', fontSize: 14, fontWeight: 800, color: 'white', fontFamily: QP.fontDisplay }}>A2</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ fontFamily: QP.fontDisplay, fontSize: 36, fontWeight: 800, letterSpacing: -1, lineHeight: 1 }}>Habs Borsch</div>
                <Badge color="maiz" variant="solid">🔥 14 días</Badge>
              </div>
              <div style={{ fontFamily: QP.fontMarker, fontSize: 22, color: QP.maiz[200], marginTop: 8 }}>colega since 23/02/2026</div>
              <div style={{ display: 'flex', gap: 20, marginTop: 14, fontFamily: QP.fontMono, fontSize: 12, opacity: .9 }}>
                <div>📍 Ya en España</div>
                <div>🎮 Estilo: gamer</div>
                <div>⏱ Meta diaria: 15 min</div>
              </div>
            </div>
            <Button variant="secondary" icon={<Icon.gear width={16} height={16}/>}>Editar</Button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }}>
          <div>
            {/* Stats grid */}
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 22, fontWeight: 700, color: QP.ink[800], marginBottom: 12 }}>Tu journey</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <StatCard label="Total XP" value="1,240" sub="nivel 12" color={QP.chili[500]} icon={<Icon.sparkle/>} />
              <StatCard label="Días activos" value="59" sub="de 60 · ¡wow!" color={QP.jade[500]} icon={<Icon.fire/>} />
              <StatCard label="Palabras" value="247" sub="+12 esta semana" color={QP.cielo[500]} icon={<Icon.book/>} />
            </div>

            {/* Achievements */}
            <div style={{ fontFamily: QP.fontDisplay, fontSize: 22, fontWeight: 700, color: QP.ink[800], marginTop: 28, marginBottom: 12 }}>Logros desbloqueados</div>
            <div style={{ background: 'white', borderRadius: 20, padding: 24, border: `1px solid ${QP.ink[100]}`, boxShadow: QP.shadow.sm }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                {[
                  { emoji: '🌶', label: 'Primera lección', color: QP.chili[500], done: true },
                  { emoji: '🔥', label: '7 días', color: QP.maiz[400], done: true },
                  { emoji: '🔥', label: '14 días', color: QP.chili[500], done: true },
                  { emoji: '📚', label: '100 palabras', color: QP.cielo[500], done: true },
                  { emoji: '🎯', label: '10/10 quiz', color: QP.jade[500], done: true },
                  { emoji: '🏆', label: 'A1 completo', color: QP.jacaranda[500], done: true },
                  { emoji: '🌵', label: '30 días', color: QP.ink[300], done: false },
                  { emoji: '📖', label: '500 palabras', color: QP.ink[300], done: false },
                  { emoji: '🗣', label: 'Primer habla', color: QP.ink[300], done: false },
                  { emoji: '🎉', label: 'A2 completo', color: QP.ink[300], done: false },
                ].map((a, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '100%', aspectRatio: '1', borderRadius: 16,
                      background: a.done ? 'white' : QP.ink[50],
                      border: a.done ? `3px solid ${a.color}` : `3px dashed ${QP.ink[200]}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 32, opacity: a.done ? 1 : 0.4,
                      boxShadow: a.done ? `0 4px 0 ${a.color}` : 'none',
                    }}>{a.emoji}</div>
                    <div style={{ fontFamily: QP.fontMono, fontSize: 9, color: a.done ? QP.ink[700] : QP.ink[400], marginTop: 8, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{a.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Current focus card */}
            <div style={{ background: QP.cielo[500], borderRadius: 20, padding: 24, color: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.2 }}><Sunburst size={160} color={QP.maiz[200]} /></div>
              <div style={{ fontFamily: QP.fontMono, fontSize: 10, opacity: .85, textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700 }}>Current focus</div>
              <div style={{ fontFamily: QP.fontDisplay, fontSize: 36, fontWeight: 800, marginTop: 4, letterSpacing: -1, lineHeight: 1 }}>Social Spanish</div>
              <div style={{ fontSize: 13, opacity: .9, marginTop: 8, maxWidth: 260 }}>Learning the Spanish you'd use at a party, not a job interview.</div>
              <div style={{ marginTop: 16 }}>
                <ProgressBar value={62} color="white" track="rgba(255,255,255,.2)" height={6} />
                <div style={{ fontFamily: QP.fontMono, fontSize: 10, marginTop: 6, opacity: .85 }}>62% · 18 / 30 units</div>
              </div>
            </div>

            {/* Mission */}
            <div style={{ background: 'white', borderRadius: 20, padding: 24, border: `2px dashed ${QP.maiz[300]}` }}>
              <Badge color="maiz" variant="soft" size="sm">Tu misión</Badge>
              <div style={{ fontFamily: QP.fontMarker, fontSize: 26, color: QP.ink[800], marginTop: 10, lineHeight: 1.15 }}>Habs está en una misión para dominar el español social.</div>
              <div style={{ fontSize: 13, color: QP.ink[500], marginTop: 10 }}>Meta: chatear sin miedo en CDMX para julio 2026 🌮</div>
            </div>

            {/* Languages */}
            <div style={{ background: 'white', borderRadius: 20, padding: 20, border: `1px solid ${QP.ink[100]}`, boxShadow: QP.shadow.sm }}>
              <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400], textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 700, marginBottom: 12 }}>Languages</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 24 }}>🇩🇪</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: QP.ink[800] }}>Alemán</div>
                    <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400] }}>Nativo</div>
                  </div>
                </div>
                <Badge color="jade" variant="soft">Native</Badge>
              </div>
              <div style={{ height: 1, background: QP.ink[100], margin: '4px 0' }}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 24 }}>🇲🇽</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: QP.ink[800] }}>Español</div>
                    <div style={{ fontFamily: QP.fontMono, fontSize: 10, color: QP.ink[400] }}>Aprendiendo</div>
                  </div>
                </div>
                <Badge color="chili" variant="solid">A2</Badge>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

Object.assign(window, { LandingScreen, DashboardScreen, VocabScreen, GrammarScreen, ExercisesScreen, CultureScreen, ProfileScreen });
