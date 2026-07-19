/* Hero product-interface mockup for TriviaKnight. Static visual built in
 * HTML/CSS/React, styled in the TriviaKnight brand. Grounded in the real app
 * information architecture: rounds, questions within rounds, a host control
 * panel, a leaderboard, and a "Ready to Present" state. Not a screenshot. */
(function () {
  const S = {
    shell: { fontFamily: "var(--font-body)", background: "var(--navy-800)", border: "1px solid var(--surface-line-dark)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", overflow: "hidden", color: "var(--text-on-dark)", width: "100%" },
    top: { display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", background: "var(--navy-950)", borderBottom: "1px solid var(--surface-line-dark)" },
    dot: (c) => ({ width: 10, height: 10, borderRadius: "50%", background: c }),
    topTitle: { marginLeft: 8, fontSize: 12.5, fontWeight: 600, color: "var(--text-on-dark-muted)", fontFamily: "var(--font-mono)" },
    ready: { marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "#7fe0ad", background: "rgba(47,158,107,.16)", border: "1px solid rgba(47,158,107,.4)", padding: "4px 9px", borderRadius: "var(--radius-pill)" },
    body: { display: "grid", gridTemplateColumns: "180px 1fr 190px", minHeight: 330 },
    col: { padding: "14px", display: "flex", flexDirection: "column", gap: 10 },
    left: { borderRight: "1px solid var(--surface-line-dark)", background: "var(--navy-900)" },
    right: { borderLeft: "1px solid var(--surface-line-dark)", background: "var(--navy-900)" },
    kicker: { fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".1em", color: "var(--text-on-dark-faint)", margin: 0 },
    gameName: { fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, letterSpacing: "-.01em", lineHeight: 1.1, margin: "2px 0 6px" },
    round: (active) => ({ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: "var(--radius-sm)", fontSize: 12.5, fontWeight: active ? 600 : 500, color: active ? "var(--navy-950)" : "var(--text-on-dark-muted)", background: active ? "var(--gold-400)" : "transparent", cursor: "default" }),
    roundNum: (active) => ({ fontFamily: "var(--font-mono)", fontSize: 10, width: 16, textAlign: "center", color: active ? "var(--navy-900)" : "var(--text-on-dark-faint)" }),
    qCard: { background: "var(--navy-800)", border: "1px solid var(--surface-line-dark)", borderRadius: "var(--radius-md)", padding: "12px 13px", display: "flex", flexDirection: "column", gap: 9 },
    qMeta: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    qTag: { fontFamily: "var(--font-mono)", fontSize: 9.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--gold-300)" },
    qPts: { fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--text-on-dark-faint)" },
    qText: { fontSize: 14, fontWeight: 600, lineHeight: 1.3, margin: 0 },
    choices: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 },
    choice: (correct) => ({ display: "flex", alignItems: "center", gap: 7, fontSize: 12, padding: "7px 9px", borderRadius: "var(--radius-sm)", border: correct ? "1.5px solid var(--gold-500)" : "1px solid var(--surface-line-dark)", background: correct ? "rgba(227,168,56,.12)" : "var(--navy-900)", color: correct ? "var(--gold-200)" : "var(--text-on-dark-muted)" }),
    choiceKey: (correct) => ({ fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600, width: 15, height: 15, display: "inline-flex", alignItems: "center", justifyContent: "center", borderRadius: 3, background: correct ? "var(--gold-500)" : "var(--navy-700)", color: correct ? "var(--navy-950)" : "var(--text-on-dark-muted)" }),
    controls: { display: "flex", gap: 8, marginTop: 2 },
    btn: (primary) => ({ flex: primary ? 1.4 : 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 600, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: primary ? "none" : "1px solid var(--surface-line-dark)", background: primary ? "var(--gold-500)" : "transparent", color: primary ? "var(--navy-950)" : "var(--text-on-dark-muted)" }),
    timer: { display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: "var(--text-on-dark-muted)" },
    bar: { flex: 1, height: 6, borderRadius: 3, background: "var(--navy-700)", overflow: "hidden" },
    barFill: { width: "62%", height: "100%", background: "var(--gold-500)" },
    lbRow: (rank) => ({ display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: "var(--radius-sm)", background: rank === 1 ? "rgba(227,168,56,.12)" : "var(--navy-800)", border: rank === 1 ? "1px solid rgba(227,168,56,.35)" : "1px solid var(--surface-line-dark)" }),
    lbRank: (rank) => ({ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, width: 16, color: rank === 1 ? "var(--gold-300)" : "var(--text-on-dark-faint)" }),
    lbName: { fontSize: 12, fontWeight: 500, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    lbScore: { fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "var(--gold-300)" },
  };

  const Icon = ({ d, size = 14 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none" }}>{d}</svg>
  );
  const play = <><polygon points="6 3 20 12 6 21 6 3" /></>;
  const eye = <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>;
  const clock = <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>;

  const rounds = [
    { n: 1, name: "General Knowledge", active: true },
    { n: 2, name: "Music", active: false },
    { n: 3, name: "Picture Round", active: false },
    { n: 4, name: "History", active: false },
    { n: 5, name: "Sports", active: false },
    { n: 6, name: "The Final Cut", active: false },
  ];
  const leaders = [
    { rank: 1, name: "Sudden Death Row", score: 42 },
    { rank: 2, name: "Ctrl+Alt+Trivia", score: 39 },
    { rank: 3, name: "Buzzer Beaters", score: 37 },
    { rank: 4, name: "The Answer Is Yes", score: 33 },
  ];

  function ProductMockup() {
    return (
      <div style={S.shell} role="img" aria-label="TriviaKnight host interface showing a game called Friday Night General Knowledge with rounds, questions, live host controls, and a leaderboard in a Ready to Present state.">
        <div style={S.top}>
          <span style={S.dot("#e5695e")} /><span style={S.dot("#e3b341")} /><span style={S.dot("#4aa564")} />
          <span style={S.topTitle}>TriviaKnight · Host Desk</span>
          <span style={S.ready}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4aa564" }} />Ready to Present</span>
        </div>
        <div style={S.body} className="tk-mock-body">
          <div style={{ ...S.col, ...S.left }} className="tk-mock-left">
            <p style={S.kicker}>Game</p>
            <h3 style={S.gameName}>Friday Night General Knowledge</h3>
            <p style={S.kicker}>Rounds</p>
            {rounds.map((r) => (
              <div key={r.n} style={S.round(r.active)}>
                <span style={S.roundNum(r.active)}>{r.n}</span>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
              </div>
            ))}
          </div>
          <div style={S.col}>
            <p style={S.kicker}>Round 1 · Question 3 of 5</p>
            <div style={S.qCard}>
              <div style={S.qMeta}><span style={S.qTag}>Multiple choice</span><span style={S.qPts}>3 pts</span></div>
              <p style={S.qText}>Which planet in our solar system rotates on its side?</p>
              <div style={S.choices}>
                <span style={S.choice(false)}><span style={S.choiceKey(false)}>A</span>Jupiter</span>
                <span style={S.choice(true)}><span style={S.choiceKey(true)}>B</span>Uranus</span>
                <span style={S.choice(false)}><span style={S.choiceKey(false)}>C</span>Neptune</span>
                <span style={S.choice(false)}><span style={S.choiceKey(false)}>D</span>Saturn</span>
              </div>
            </div>
            <div style={S.timer}><Icon d={clock} size={13} /><span style={S.bar}><span style={S.barFill} /></span><span style={{ fontFamily: "var(--font-mono)" }}>0:09</span></div>
            <div style={{ fontSize: 11.5, color: "var(--text-on-dark-muted)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--gold-300)" }}>9 / 12</span> teams locked in
            </div>
            <div style={S.controls}>
              <span style={S.btn(true)}><Icon d={play} size={13} />Reveal answer</span>
              <span style={S.btn(false)}><Icon d={eye} size={13} />Presenter</span>
            </div>
          </div>
          <div style={{ ...S.col, ...S.right }} className="tk-mock-right">
            <p style={S.kicker}>Leaderboard</p>
            {leaders.map((t) => (
              <div key={t.rank} style={S.lbRow(t.rank)}>
                <span style={S.lbRank(t.rank)}>{t.rank}</span>
                <span style={S.lbName}>{t.name}</span>
                <span style={S.lbScore}>{t.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  window.ProductMockup = ProductMockup;
})();
