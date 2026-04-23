/* Layout B — 차트 히어로 + 2열 구성 (compact focus)
   상단: 지수 스트립, 중앙: 큰 차트 + 사이드 뉴스, 하단: 상승/하락 + 히트맵 */

function LayoutB({ density, showSidebar }) {
  const [selected, setSelected] = useStateS('000660');
  const [newsFilter, setNewsFilter] = useStateS('hot');
  const [tab, setTab] = useStateS('watchlist');
  const sel = window.STOCK_WATCHLIST.find(s => s.ticker === selected) || window.STOCK_WATCHLIST[1];
  const compact = density === 'compact';

  return (
    <div className="stock-shell">
      <StockNav now="2026-04-23 09:42:18" />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {showSidebar && (
          <div className="stock-rail">
            <a className="is-active"><Icon name="bar-chart" size={18} /></a>
            <a><Icon name="star" size={18} /></a>
            <a><Icon name="newspaper" size={18} /></a>
            <a><Icon name="bell" size={18} /></a>
            <span className="spacer" />
            <a><Icon name="settings" size={18} /></a>
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <PageBar title={sel.name} crumbs={`Tideboard / 시장 / ${sel.ticker}`}>
            <SearchBox />
          </PageBar>
          <div className="dash">
            <IndicesStrip items={window.STOCK_INDICES} />
            <div className="dash-b" style={{ marginTop: 18 }}>
              <div className="dash-b-chartrow">
                <ChartPanel stock={sel} variant="candle" />
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div className="card-header">
                    <div style={{ display: 'flex', gap: 2, padding: 0 }}>
                      {[['watchlist', '워치리스트'], ['gainers', '상승 상위'], ['losers', '하락 상위']].map(([k, l]) => (
                        <button key={k} onClick={() => setTab(k)}
                          style={{
                            padding: '6px 12px', fontSize: 12, fontFamily: 'var(--font-sans)', fontWeight: 500,
                            background: 'transparent',
                            color: tab === k ? 'var(--fg-1)' : 'var(--fg-2)',
                            border: 0,
                            borderBottom: '2px solid ' + (tab === k ? 'var(--brand-500)' : 'transparent'),
                            cursor: 'pointer', marginBottom: -1,
                          }}>{l}</button>
                      ))}
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>클릭하여 차트 변경</span>
                  </div>
                  <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                    {tab === 'watchlist' && (
                      <Watchlist items={window.STOCK_WATCHLIST} compact selected={selected} onSelect={setSelected}
                        columns={['ticker', 'price', 'pct', 'vol', 'cap', 'pe', 'spark']} />
                    )}
                    {tab === 'gainers' && <Ranker items={window.STOCK_GAINERS} direction="up" onSelect={setSelected} />}
                    {tab === 'losers' && <Ranker items={window.STOCK_LOSERS} direction="down" onSelect={setSelected} />}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div className="card-header">
                    <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Icon name="flame" size={14} style={{ color: 'var(--accent-500)' }} />
                      {sel.name} 관련 뉴스
                    </h3>
                  </div>
                  <div style={{ maxHeight: 280, overflowY: 'auto' }}>
                    <NewsFeed items={window.STOCK_NEWS} filter="ticker" activeTicker={sel.ticker} compact />
                  </div>
                </div>
                <div className="card" style={{ overflow: 'hidden' }}>
                  <div className="card-header">
                    <h3 className="card-title">핫 이슈 · 전체</h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--accent-500)', fontWeight: 600 }}>HOT</span>
                  </div>
                  <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                    <NewsFeed items={window.STOCK_NEWS} filter="hot" compact={compact} />
                  </div>
                </div>
              </div>
            </div>
            <div className="card" style={{ overflow: 'hidden', marginTop: 16 }}>
              <div className="card-header">
                <h3 className="card-title">섹터 히트맵</h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>시총 가중</span>
              </div>
              <Heatmap sectors={window.STOCK_SECTORS} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.LayoutB = LayoutB;
