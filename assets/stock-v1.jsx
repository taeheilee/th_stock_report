/* Layout A — 3-column data-terminal style
   좌: 워치리스트(정렬/필터), 중앙: 차트+상승/하락 랭킹, 우: 뉴스 피드
   시장 전체 스트립 상단에 배치. Bloomberg/거래소 터미널 느낌. */

function LayoutA({ density, showSidebar }) {
  const [selected, setSelected] = useStateS('005930');
  const [newsFilter, setNewsFilter] = useStateS('all');
  const [marketFilter, setMarketFilter] = useStateS('all');
  const [query, setQuery] = useStateS('');
  const now = '2026-04-23 09:42:18';

  const filteredWL = useMemoS(() => {
    let list = window.STOCK_WATCHLIST;
    if (marketFilter !== 'all') list = list.filter(s => s.market === marketFilter);
    if (query) list = list.filter(s => s.name.includes(query) || s.ticker.includes(query) || s.sector.includes(query));
    return list;
  }, [marketFilter, query]);

  const sel = window.STOCK_WATCHLIST.find(s => s.ticker === selected) || window.STOCK_WATCHLIST[0];
  const compact = density === 'compact';

  return (
    <div className="stock-shell">
      <StockNav now={now} />
      {showSidebar && (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <div className="stock-rail">
            <Icon name="grid" size={18} />
            <a className="is-active" title="시장"><Icon name="bar-chart" size={18} /></a>
            <a title="워치리스트"><Icon name="star" size={18} /></a>
            <a title="뉴스"><Icon name="newspaper" size={18} /></a>
            <a title="알림"><Icon name="bell" size={18} /></a>
            <span className="spacer" />
            <a title="설정"><Icon name="settings" size={18} /></a>
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <InnerA {...{ sel, selected, setSelected, filteredWL, compact, newsFilter, setNewsFilter, marketFilter, setMarketFilter, query, setQuery }} />
          </div>
        </div>
      )}
      {!showSidebar && <InnerA {...{ sel, selected, setSelected, filteredWL, compact, newsFilter, setNewsFilter, marketFilter, setMarketFilter, query, setQuery }} />}
    </div>
  );
}

function InnerA({ sel, selected, setSelected, filteredWL, compact, newsFilter, setNewsFilter, marketFilter, setMarketFilter, query, setQuery }) {
  return (
    <>
      <PageBar title="시장 현황" crumbs="Tideboard / 시장">
        <SearchBox value={query} onChange={setQuery} />
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>자동 새로고침 15s</span>
      </PageBar>
      <div className="dash dash-a-wrap">
        <IndicesStrip items={window.STOCK_INDICES} onSelect={() => {}} />
        <div className="dash-a" style={{ marginTop: 18 }}>
          {/* Left: Watchlist + Rankers */}
          <div className="col">
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h3 className="card-title">워치리스트</h3>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>{filteredWL.length}종목</span>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {['all', 'KOSPI', 'KOSDAQ'].map(m => (
                    <button key={m}
                      onClick={() => setMarketFilter(m)}
                      className="btn btn-sm"
                      style={{
                        padding: '3px 9px', fontSize: 11,
                        background: marketFilter === m ? 'var(--bg-active)' : 'transparent',
                        border: '1px solid ' + (marketFilter === m ? 'var(--border-strong)' : 'var(--border-1)'),
                        color: 'var(--fg-1)',
                      }}>{m === 'all' ? '전체' : m}</button>
                  ))}
                </div>
              </div>
              <div style={{ maxHeight: 440, overflowY: 'auto' }}>
                <Watchlist items={filteredWL} compact={compact} selected={selected} onSelect={setSelected}
                  columns={['ticker', 'price', 'pct', 'vol', 'spark']} />
              </div>
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="trending-up" size={14} className="up" />
                  <span className="up" style={{ fontSize: 13 }}>상승 상위</span>
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>실시간</span>
              </div>
              <Ranker items={window.STOCK_GAINERS.slice(0, 6)} direction="up" onSelect={setSelected} />
            </div>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="trending-down" size={14} className="down" />
                  <span className="down" style={{ fontSize: 13 }}>하락 상위</span>
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>실시간</span>
              </div>
              <Ranker items={window.STOCK_LOSERS.slice(0, 6)} direction="down" onSelect={setSelected} />
            </div>
          </div>

          {/* Center: Chart + Heatmap */}
          <div className="col">
            <ChartPanel stock={sel} variant="candle" />
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <h3 className="card-title">섹터 히트맵</h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>시총 가중 · 일간</span>
              </div>
              <Heatmap sectors={window.STOCK_SECTORS} />
            </div>
          </div>

          {/* Right: News */}
          <div className="col">
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header">
                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon name="newspaper" size={14} /> 뉴스 브리핑
                </h3>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>AI 요약</span>
              </div>
              <div style={{ padding: '10px 14px', display: 'flex', gap: 4, borderBottom: '1px solid var(--border-2)', flexWrap: 'wrap' }}>
                {[['all', '전체'], ['hot', 'HOT'], ['bull', '호재'], ['bear', '악재'], ['ticker', sel.name]].map(([k, l]) => (
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
              <div style={{ maxHeight: 780, overflowY: 'auto' }}>
                <NewsFeed items={window.STOCK_NEWS} filter={newsFilter} activeTicker={sel.ticker} compact={compact} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

window.LayoutA = LayoutA;
