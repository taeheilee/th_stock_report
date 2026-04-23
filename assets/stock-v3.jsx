/* Layout C — 뉴스 중심 브리핑 스타일
   상단 지수 스트립, 메인: 큰 뉴스 피드, 오른쪽: 워치리스트+랭킹+미니차트 */

function LayoutC({ density, showSidebar }) {
  const [selected, setSelected] = useStateS('247540');
  const [newsFilter, setNewsFilter] = useStateS('all');
  const sel = window.STOCK_WATCHLIST.find(s => s.ticker === selected) || window.STOCK_WATCHLIST[9];
  const compact = density === 'compact';

  return (
    <div className="stock-shell">
      <StockNav now="2026-04-23 09:42:18" />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {showSidebar && (
          <div className="stock-rail">
            <a><Icon name="bar-chart" size={18} /></a>
            <a><Icon name="star" size={18} /></a>
            <a className="is-active"><Icon name="newspaper" size={18} /></a>
            <a><Icon name="bell" size={18} /></a>
            <span className="spacer" />
            <a><Icon name="settings" size={18} /></a>
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <PageBar title="오늘의 브리핑" crumbs="Tideboard / 뉴스">
            <SearchBox />
          </PageBar>
          <div className="dash">
            <IndicesStrip items={window.STOCK_INDICES} />
            <div className="dash-c" style={{ marginTop: 18 }}>
              <div className="dash-c-main">
                <div className="dash-c-top">
                  <div className="card" style={{ overflow: 'hidden' }}>
                    <div className="card-header">
                      <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Icon name="flame" size={14} style={{ color: 'var(--accent-500)' }} />
                        핫 이슈 요약
                      </h3>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>AI 크롤링 · 실시간</span>
                    </div>
                    <div>
                      {window.STOCK_NEWS.filter(n => n.hot).slice(0, 3).map(n => (
                        <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer"
                          style={{
                            display: 'block', padding: '14px 18px',
                            borderBottom: '1px solid var(--border-2)',
                            textDecoration: 'none', color: 'inherit',
                          }}>
                          <div className="news-meta" style={{ marginBottom: 6 }}>
                            <span className="time">{n.time}</span><span className="sep">·</span>
                            <span className="source">{n.source}</span>
                            <span className="news-tag hot" style={{ marginLeft: 4 }}>HOT</span>
                            {n.sentiment === 'bull' && <span className="news-tag bull">호재</span>}
                            {n.sentiment === 'bear' && <span className="news-tag bear">악재</span>}
                          </div>
                          <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, marginBottom: 6, color: 'var(--fg-1)', letterSpacing: '-0.005em' }}>
                            {n.title} <Icon name="external-link" size={12} style={{ color: 'var(--fg-3)', marginLeft: 4 }} />
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.6 }}>{n.summary}</div>
                          <div className="news-tags">
                            {n.tickers.map(t => {
                              const item = window.STOCK_WATCHLIST.find(w => w.ticker === t);
                              return <span key={t} className="news-tag" onClick={(e) => { e.preventDefault(); if (item) setSelected(t); }} style={{ cursor: 'pointer' }}>
                                {item ? `${item.name} · ${item.pct > 0 ? '+' : ''}${item.pct.toFixed(2)}%` : t}
                              </span>;
                            })}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="card" style={{ overflow: 'hidden' }}>
                    <div className="card-header">
                      <h3 className="card-title">섹터 히트맵</h3>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>일간</span>
                    </div>
                    <Heatmap sectors={window.STOCK_SECTORS.slice(0, 8)} />
                  </div>
                </div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div className="card-header">
                    <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="newspaper" size={14} /> 전체 뉴스 피드
                    </h3>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[['all', '전체'], ['bull', '호재'], ['bear', '악재']].map(([k, l]) => (
                        <button key={k} onClick={() => setNewsFilter(k)}
                          style={{
                            padding: '3px 9px', fontSize: 11, fontFamily: 'var(--font-sans)',
                            background: newsFilter === k ? 'var(--brand-600)' : 'transparent',
                            color: newsFilter === k ? '#fff' : 'var(--fg-2)',
                            border: '1px solid ' + (newsFilter === k ? 'var(--brand-600)' : 'var(--border-1)'),
                            borderRadius: 4, cursor: 'pointer',
                          }}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <NewsFeed items={window.STOCK_NEWS} filter={newsFilter} compact={compact} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                <ChartPanel stock={sel} variant="line" />
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div className="card-header">
                    <h3 className="card-title">워치리스트</h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{window.STOCK_WATCHLIST.length}종목</span>
                  </div>
                  <div style={{ maxHeight: 420, overflowY: 'auto' }}>
                    <Watchlist items={window.STOCK_WATCHLIST} compact selected={selected} onSelect={setSelected}
                      columns={['ticker', 'price', 'pct', 'spark']} />
                  </div>
                </div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div className="card-header">
                    <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="trending-up" size={13} className="up" /><span className="up">상승</span>
                      <span style={{ color: 'var(--fg-3)', fontWeight: 400 }}>/</span>
                      <Icon name="trending-down" size={13} className="down" /><span className="down">하락</span>
                    </h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid var(--border-2)' }}>
                    <div style={{ borderRight: '1px solid var(--border-2)' }}>
                      {window.STOCK_GAINERS.slice(0, 5).map((s, i) => (
                        <div key={s.ticker} className="rank-row" style={{ gridTemplateColumns: '16px 1fr auto', padding: '7px 12px' }} onClick={() => setSelected(s.ticker)}>
                          <div className="rank-idx">{i + 1}</div>
                          <div className="rank-name-col"><div className="rank-name" style={{ fontSize: 12 }}>{s.name}</div></div>
                          <span className="pct-pill up">+{s.pct.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      {window.STOCK_LOSERS.slice(0, 5).map((s, i) => (
                        <div key={s.ticker} className="rank-row" style={{ gridTemplateColumns: '16px 1fr auto', padding: '7px 12px' }} onClick={() => setSelected(s.ticker)}>
                          <div className="rank-idx">{i + 1}</div>
                          <div className="rank-name-col"><div className="rank-name" style={{ fontSize: 12 }}>{s.name}</div></div>
                          <span className="pct-pill down">{s.pct.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.LayoutC = LayoutC;
