/* Shared stock dashboard components.
   Relies on global React, Icon (from assets/icons.jsx), and window.STOCK_* data.
   All components are attached to window at the bottom for cross-file use. */

const { useState: useStateS, useMemo: useMemoS, useEffect: useEffectS, useRef: useRefS } = React;

// ---------- format helpers ----------
function fmtNum(n, d = 0) {
  if (n == null) return '-';
  return Number(n).toLocaleString('ko-KR', { minimumFractionDigits: d, maximumFractionDigits: d });
}
function fmtPrice(n, market) {
  const isUS = market === 'US' || market === 'FX';
  if (market === 'VKOSPI' || (typeof n === 'number' && n < 100)) return n.toFixed(2);
  return isUS ? fmtNum(n, 2) : fmtNum(n, 0);
}
function fmtPct(p) {
  const sign = p > 0 ? '+' : '';
  return sign + p.toFixed(2) + '%';
}
function fmtChange(c, market) {
  const sign = c > 0 ? '+' : c < 0 ? '' : '';
  return sign + fmtPrice(c, market);
}
function upDown(n) { return n > 0 ? 'up' : n < 0 ? 'down' : 'flat'; }

window.SFmt = { fmtNum, fmtPrice, fmtPct, fmtChange, upDown };

// ---------- Sparkline ----------
function Sparkline({ data, width = 80, height = 24, color, fill = false }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const stepX = width / (data.length - 1);
  const pts = data.map((v, i) => [i * stepX, height - ((v - min) / range) * (height - 2) - 1]);
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const last = data[data.length - 1];
  const first = data[0];
  const dir = last > first ? 'up' : last < first ? 'down' : 'flat';
  const stroke = color || (dir === 'up' ? 'var(--up-fg)' : dir === 'down' ? 'var(--down-fg)' : 'var(--fg-3)');
  return (
    <svg width={width} height={height} className="spark" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      {fill && (
        <path d={d + ` L${width} ${height} L0 ${height} Z`} fill={stroke} fillOpacity="0.10" />
      )}
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- Price line chart w/ grid ----------
function PriceLineChart({ candles, width = 880, height = 260 }) {
  if (!candles || candles.length === 0) return null;
  const prices = candles.map(c => c.close);
  const highs  = candles.map(c => c.high);
  const lows   = candles.map(c => c.low);
  const min = Math.min(...lows), max = Math.max(...highs);
  const range = max - min || 1;
  const padY = 16, padX = 42, padR = 12;
  const innerW = width - padX - padR;
  const innerH = height - padY * 2;
  const stepX = innerW / (candles.length - 1);
  const y = (v) => padY + innerH - ((v - min) / range) * innerH;
  const pts = prices.map((v, i) => [padX + i * stepX, y(v)]);
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const last = prices[prices.length - 1];
  const first = prices[0];
  const dir = last > first ? 'up' : last < first ? 'down' : 'flat';
  const stroke = dir === 'up' ? 'var(--up-fg)' : dir === 'down' ? 'var(--down-fg)' : 'var(--fg-3)';
  // horizontal grid lines
  const gridLines = [];
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const v = min + (range * i) / steps;
    const yy = y(v);
    gridLines.push({ v, y: yy });
  }
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={padX} x2={width - padR} y1={g.y} y2={g.y} stroke="var(--chart-grid)" strokeDasharray="2 3" />
          <text x={padX - 6} y={g.y + 3} fill="var(--fg-3)" fontFamily="var(--font-mono)" fontSize="10" textAnchor="end">{fmtNum(g.v, 0)}</text>
        </g>
      ))}
      <path d={d + ` L${padX + innerW} ${height - padY} L${padX} ${height - padY} Z`} fill={stroke} fillOpacity="0.08" />
      <path d={d} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* current price marker */}
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill={stroke} />
      <line x1={padX} x2={width - padR} y1={pts[pts.length - 1][1]} y2={pts[pts.length - 1][1]} stroke={stroke} strokeDasharray="2 4" strokeOpacity="0.45" />
      <rect x={width - padR - 56} y={pts[pts.length - 1][1] - 8} width="54" height="16" rx="3" fill={stroke} />
      <text x={width - padR - 29} y={pts[pts.length - 1][1] + 4} fill="#fff" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600" textAnchor="middle">{fmtNum(last, 0)}</text>
    </svg>
  );
}

// ---------- Candle chart ----------
function CandleChart({ candles, width = 880, height = 280 }) {
  if (!candles || candles.length === 0) return null;
  const highs = candles.map(c => c.high);
  const lows  = candles.map(c => c.low);
  const min = Math.min(...lows), max = Math.max(...highs);
  const range = max - min || 1;
  const padY = 16, padX = 42, padR = 12;
  const innerW = width - padX - padR;
  const innerH = height - padY * 2 - 40; // leave 40 for volume
  const volMax = Math.max(...candles.map(c => c.vol));
  const stepX = innerW / candles.length;
  const bodyW = Math.max(2, stepX * 0.65);
  const y = (v) => padY + innerH - ((v - min) / range) * innerH;
  const volY = (v) => height - padY - (v / volMax) * 30;

  const gridLines = [];
  for (let i = 0; i <= 4; i++) {
    const v = min + (range * i) / 4;
    gridLines.push({ v, y: y(v) });
  }

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {gridLines.map((g, i) => (
        <g key={i}>
          <line x1={padX} x2={width - padR} y1={g.y} y2={g.y} stroke="var(--chart-grid)" strokeDasharray="2 3" />
          <text x={padX - 6} y={g.y + 3} fill="var(--fg-3)" fontFamily="var(--font-mono)" fontSize="10" textAnchor="end">{fmtNum(g.v, 0)}</text>
        </g>
      ))}
      {candles.map((c, i) => {
        const up = c.close >= c.open;
        const col = up ? 'var(--up-fg)' : 'var(--down-fg)';
        const xMid = padX + i * stepX + stepX / 2;
        const bodyTop = y(Math.max(c.open, c.close));
        const bodyBot = y(Math.min(c.open, c.close));
        return (
          <g key={i}>
            <line x1={xMid} x2={xMid} y1={y(c.high)} y2={y(c.low)} stroke={col} strokeWidth="1" />
            <rect x={xMid - bodyW / 2} y={bodyTop} width={bodyW} height={Math.max(1, bodyBot - bodyTop)} fill={col} />
            {/* volume */}
            <rect x={xMid - bodyW / 2} y={volY(c.vol)} width={bodyW} height={height - padY - volY(c.vol)} fill={col} fillOpacity="0.25" />
          </g>
        );
      })}
    </svg>
  );
}

// ---------- Indices strip ----------
function IndicesStrip({ items, vertical = false, onSelect }) {
  return (
    <div className={'idx-strip' + (vertical ? ' vertical' : '')}>
      {items.map(i => (
        <div key={i.code} className="idx-cell" onClick={() => onSelect && onSelect(i)} style={{ cursor: onSelect ? 'pointer' : 'default' }}>
          <div className="idx-head">
            <span className="idx-name">{i.name}</span>
            <span className={'idx-status ' + (i.status === 'close' ? 'close' : '')} title={i.status === 'close' ? '장마감' : '거래중'} />
          </div>
          <div className="idx-value">{fmtPrice(i.value, i.market)}</div>
          <div className="idx-foot">
            <span className={upDown(i.change)}>{fmtChange(i.change, i.market)} <span style={{ opacity: 0.8 }}>({fmtPct(i.pct)})</span></span>
            <Sparkline data={i.spark} width={54} height={16} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Watchlist table ----------
function Watchlist({ items, compact, selected, onSelect, columns }) {
  const [sortCol, setSortCol] = useStateS(null);
  const [sortDir, setSortDir] = useStateS('desc');
  const cols = columns || ['ticker', 'name', 'price', 'pct', 'vol', 'spark'];
  const sorted = useMemoS(() => {
    if (!sortCol) return items;
    const s = [...items].sort((a, b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === 'string') { return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av); }
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return s;
  }, [items, sortCol, sortDir]);
  const setSort = (c) => {
    if (sortCol === c) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(c); setSortDir('desc'); }
  };
  const sortInd = (c) => sortCol === c ? (sortDir === 'asc' ? '▲' : '▼') : '↕';

  return (
    <table className={'wl' + (compact ? ' compact' : '')}>
      <thead>
        <tr>
          {cols.includes('ticker') && <th onClick={() => setSort('name')} className={sortCol === 'name' ? 'sorted' : ''}>종목 <span className="sort-ind">{sortInd('name')}</span></th>}
          {cols.includes('price') && <th className={'num ' + (sortCol === 'price' ? 'sorted' : '')} onClick={() => setSort('price')}>현재가 <span className="sort-ind">{sortInd('price')}</span></th>}
          {cols.includes('pct') && <th className={'num ' + (sortCol === 'pct' ? 'sorted' : '')} onClick={() => setSort('pct')}>등락 <span className="sort-ind">{sortInd('pct')}</span></th>}
          {cols.includes('vol') && <th className={'num ' + (sortCol === 'vol' ? 'sorted' : '')} onClick={() => setSort('vol')}>거래량 <span className="sort-ind">{sortInd('vol')}</span></th>}
          {cols.includes('cap') && <th className="num">시총</th>}
          {cols.includes('pe')  && <th className="num">PER</th>}
          {cols.includes('spark') && <th className="num" style={{ cursor: 'default' }}>30D</th>}
        </tr>
      </thead>
      <tbody>
        {sorted.map(s => (
          <tr key={s.ticker}
              className={selected === s.ticker ? 'is-selected' : ''}
              onClick={() => onSelect && onSelect(s.ticker)}>
            {cols.includes('ticker') && (
              <td className="name">
                <div className="ticker-cell">
                  <span className="ticker-code">{s.ticker}</span>
                  <span className="ticker-name">{s.name}</span>
                  {s.hot && <span className="ticker-hot">HOT</span>}
                  {!compact && <span className="mkt-tag">{s.market}</span>}
                </div>
              </td>
            )}
            {cols.includes('price') && <td className="num">{fmtPrice(s.price, s.market)}</td>}
            {cols.includes('pct') && (
              <td className="num">
                <span className={'pct-pill ' + upDown(s.pct)}>{fmtPct(s.pct)}</span>
              </td>
            )}
            {cols.includes('vol') && <td className="num" style={{ color: 'var(--fg-2)' }}>{fmtNum(s.vol)}</td>}
            {cols.includes('cap') && <td className="num" style={{ color: 'var(--fg-2)' }}>{s.cap}</td>}
            {cols.includes('pe')  && <td className="num" style={{ color: 'var(--fg-2)' }}>{s.pe ? s.pe.toFixed(1) : '-'}</td>}
            {cols.includes('spark') && <td className="num"><Sparkline data={s.spark} width={70} height={22} /></td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---------- Ranker list ----------
function Ranker({ items, direction = 'up', onSelect }) {
  return (
    <div className="rank-list">
      {items.map((s, i) => (
        <div key={s.ticker} className="rank-row" onClick={() => onSelect && onSelect(s.ticker)}>
          <div className="rank-idx">{i + 1}</div>
          <div className="rank-name-col">
            <div className="rank-name">{s.name} <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', fontWeight: 400, marginLeft: 4 }}>{s.ticker}</span></div>
            <div className="rank-reason">{s.reason} · 거래량 {s.vol}</div>
          </div>
          <div className="rank-price num-mono">{fmtNum(s.price)}</div>
          <span className={'pct-pill ' + (direction === 'up' ? 'up' : 'down')}>
            {direction === 'up' ? '▲' : '▼'} {Math.abs(s.pct).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

// ---------- Heatmap ----------
function Heatmap({ sectors }) {
  // assign grid spans based on weight — larger sectors get more cells
  const totalWeight = sectors.reduce((a, b) => a + b.weight, 0);
  const totalCells = 12 * 6; // 12 cols × 6 rows
  const cellsFor = (w) => Math.max(3, Math.round((w / totalWeight) * totalCells));
  const maxAbs = Math.max(...sectors.map(s => Math.abs(s.pct)));

  const colorFor = (pct) => {
    const intensity = Math.min(1, Math.abs(pct) / maxAbs);
    if (pct > 0) {
      // green scale
      const a = 0.22 + intensity * 0.65;
      return `rgba(15, 157, 88, ${a.toFixed(2)})`;
    } else if (pct < 0) {
      const a = 0.22 + intensity * 0.65;
      return `rgba(214, 76, 61, ${a.toFixed(2)})`;
    }
    return 'rgba(128,128,128,0.3)';
  };

  return (
    <div className="heat">
      {sectors.map(s => {
        const cells = cellsFor(s.weight);
        // shape: prefer square-ish. span = ceil(sqrt(cells)), rows = ceil(cells/span)
        const span = Math.min(6, Math.max(2, Math.round(Math.sqrt(cells * 1.5))));
        const rows = Math.max(1, Math.min(3, Math.round(cells / span)));
        return (
          <div key={s.sector} className="heat-cell" style={{ '--span': span, '--rows': rows, background: colorFor(s.pct) }}>
            <div className="h-top">
              <span className="h-name">{s.sector}</span>
              <span className="h-pct">{fmtPct(s.pct)}</span>
            </div>
            <div className="h-lead">{s.leaders.join(' · ')}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- News feed ----------
function NewsFeed({ items, filter, compact, onFilterChange, activeTicker, showTitle = true }) {
  const filtered = useMemoS(() => {
    if (!filter || filter === 'all') return items;
    if (filter === 'hot') return items.filter(i => i.hot);
    if (filter === 'bull') return items.filter(i => i.sentiment === 'bull');
    if (filter === 'bear') return items.filter(i => i.sentiment === 'bear');
    if (filter === 'ticker' && activeTicker) return items.filter(i => i.tickers.includes(activeTicker));
    return items;
  }, [items, filter, activeTicker]);

  return (
    <div className={'news' + (compact ? ' compact' : '')}>
      {filtered.map(n => (
        <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer" className="news-item">
          <div className="news-meta">
            <span className="time">{n.time}</span>
            <span className="sep">·</span>
            <span className="source">{n.source}</span>
            {n.hot && <><span className="sep">·</span><span className="news-tag hot">HOT</span></>}
          </div>
          <div className="news-title">
            <span style={{ flex: 1 }}>{n.title}</span>
            <Icon name="external-link" size={13} className="ext" />
          </div>
          {!compact && <div className="news-sum">{n.summary}</div>}
          {(n.tickers.length > 0 || n.sentiment !== 'neutral') && (
            <div className="news-tags">
              {n.sentiment === 'bull' && <span className="news-tag bull">호재</span>}
              {n.sentiment === 'bear' && <span className="news-tag bear">악재</span>}
              {n.tickers.map(t => {
                const item = (window.STOCK_WATCHLIST || []).find(w => w.ticker === t);
                return <span key={t} className="news-tag">{item ? item.name : t}</span>;
              })}
            </div>
          )}
        </a>
      ))}
      {filtered.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-3)', fontSize: 12 }}>조건에 맞는 뉴스 없음</div>
      )}
    </div>
  );
}

// ---------- Chart panel (full) ----------
function ChartPanel({ stock, variant = 'line' }) {
  const [range, setRange] = useStateS('3M');
  const [chartType, setChartType] = useStateS(variant);
  if (!stock) return null;
  const candles = window.STOCK_CANDLES || [];
  const ranges = ['1D', '1W', '1M', '3M', '1Y', '5Y'];
  const hasCandles = candles.length >= 2;
  const today = hasCandles ? candles[candles.length - 1] : { high: stock.price, low: stock.price, close: stock.price, open: stock.price, vol: stock.vol };
  const prev  = hasCandles ? candles[candles.length - 2] : today;
  const change = stock.change ?? (today.close - prev.close);
  const pct = stock.pct ?? (prev.close ? (change / prev.close) * 100 : 0);

  return (
    <div className="chart-panel">
      <div className="chart-head">
        <div>
          <div className="chart-title-main">
            <span className="name">{stock.name}</span>
            <span className="code">{stock.ticker} · {stock.market}</span>
            {stock.hot && <span className="ticker-hot">HOT</span>}
          </div>
          <div className="chart-price">
            <span className="val">{fmtPrice(stock.price, stock.market)}</span>
            <span className={'chg ' + upDown(change)}>
              {fmtChange(change, stock.market)} ({fmtPct(pct)})
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          <div className="chart-range-tabs">
            {ranges.map(r => (
              <button key={r} className={range === r ? 'is-active' : ''} onClick={() => setRange(r)}>{r}</button>
            ))}
          </div>
          <div className="chart-range-tabs">
            <button className={chartType === 'line' ? 'is-active' : ''} onClick={() => setChartType('line')}>Line</button>
            <button className={chartType === 'candle' ? 'is-active' : ''} onClick={() => setChartType('candle')}>Candle</button>
          </div>
        </div>
      </div>
      <div className="chart-body">
        {!hasCandles ? (
          <div style={{ height: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--fg-3)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
            차트 데이터 로딩 중…
          </div>
        ) : chartType === 'candle'
          ? <CandleChart candles={candles} height={280} />
          : <PriceLineChart candles={candles} height={260} />}
      </div>
      <div className="chart-stats">
        <div className="chart-stat"><span className="lbl">고가</span><span className="val">{fmtNum(today.high)}</span></div>
        <div className="chart-stat"><span className="lbl">저가</span><span className="val">{fmtNum(today.low)}</span></div>
        <div className="chart-stat"><span className="lbl">거래량</span><span className="val">{fmtNum(stock.vol)}</span></div>
        <div className="chart-stat"><span className="lbl">시총 · PER</span><span className="val">{stock.cap} · {stock.pe?.toFixed(1) || '-'}</span></div>
      </div>
    </div>
  );
}

// ---------- Top nav ----------
function StockNav({ active = 'market', now, theme }) {
  return (
    <div className="stock-nav">
      <div className="brand">
        <img src="assets/logo-mark.svg" width="22" height="22" style={{ color: '#5FDCD3' }} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <span className="name">Tideboard</span>
          <span className="sub">ops · 시장현황</span>
        </div>
      </div>
      {['Markets', 'Watchlist', 'Portfolio', 'News', 'Screener'].map((l, i) => (
        <span key={i} className={'navlink ' + (i === 0 ? 'is-active' : '')}>{l}</span>
      ))}
      <span className="spacer" />
      <div className="util">
        <span className="mkt-status"><span className="dot" />LIVE · Yahoo Finance</span>
        <span className="clock">{now}</span>
      </div>
    </div>
  );
}

function PageBar({ title, crumbs, children }) {
  return (
    <div className="page-bar">
      {crumbs && <span className="crumbs">{crumbs}</span>}
      <h1>{title}</h1>
      <span className="spacer" />
      {children}
    </div>
  );
}

function SearchBox({ onSearch, value, onChange }) {
  return (
    <div className="search">
      <Icon name="search" size={13} />
      <input placeholder="종목 · 코드 · 섹터 검색" value={value || ''} onChange={e => onChange && onChange(e.target.value)} />
      <kbd>⌘K</kbd>
    </div>
  );
}

Object.assign(window, {
  Sparkline, PriceLineChart, CandleChart,
  IndicesStrip, Watchlist, Ranker, Heatmap, NewsFeed, ChartPanel,
  StockNav, PageBar, SearchBox,
});
