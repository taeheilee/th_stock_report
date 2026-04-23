/* stock-live.js — Yahoo Finance 무료 API 연동
   CORS: query1.finance.yahoo.com 은 브라우저에서 직접 호출 불가 → corsproxy.io 경유.
   window.STOCK_WATCHLIST / STOCK_INDICES / STOCK_SECTORS / STOCK_CANDLES 을 mutate 후
   커스텀 이벤트 'stock-data-updated' 발행. 컴포넌트는 이 이벤트로 리렌더 트리거.
*/
(function () {
  const PROXY = 'https://corsproxy.io/?url=';
  const Y_QUOTE = 'https://query1.finance.yahoo.com/v7/finance/quote?symbols=';
  const Y_CHART = 'https://query1.finance.yahoo.com/v8/finance/chart/';

  function proxied(url) { return PROXY + encodeURIComponent(url); }

  async function jget(url) {
    const r = await fetch(proxied(url));
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }

  function fmtCap(n) {
    if (!n) return '—';
    if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9)  return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6)  return (n / 1e6).toFixed(1) + 'M';
    return n.toLocaleString();
  }

  function fire() {
    window.dispatchEvent(new CustomEvent('stock-data-updated'));
  }

  // ---------- Quotes: 지수 + 워치리스트 한 번에 ----------
  async function refreshQuotes() {
    const indexSyms = window.STOCK_INDICES.map(i => i.code);
    const wlSyms    = window.STOCK_WATCHLIST.map(s => s.ticker);
    const all = [...indexSyms, ...wlSyms];

    const data = await jget(Y_QUOTE + all.join(','));
    const quotes = data?.quoteResponse?.result || [];
    const by = Object.fromEntries(quotes.map(q => [q.symbol, q]));

    // indices
    window.STOCK_INDICES = window.STOCK_INDICES.map(i => {
      const q = by[i.code];
      if (!q) return i;
      return {
        ...i,
        value:  q.regularMarketPrice ?? i.value,
        change: q.regularMarketChange ?? 0,
        pct:    q.regularMarketChangePercent ?? 0,
        status: q.marketState === 'REGULAR' ? 'open' : 'close',
      };
    });

    // watchlist
    window.STOCK_WATCHLIST = window.STOCK_WATCHLIST.map(s => {
      const q = by[s.ticker];
      if (!q) return s;
      return {
        ...s,
        price:  q.regularMarketPrice ?? s.price,
        change: q.regularMarketChange ?? 0,
        pct:    q.regularMarketChangePercent ?? 0,
        vol:    q.regularMarketVolume ?? 0,
        cap:    fmtCap(q.marketCap),
        pe:     q.trailingPE ? +q.trailingPE.toFixed(1) : null,
      };
    });

    // sector aggregates (시총 가중 등락률)
    const bySector = {};
    window.STOCK_WATCHLIST.forEach(s => {
      bySector[s.sector] = bySector[s.sector] || { sum: 0, n: 0 };
      bySector[s.sector].sum += s.pct || 0;
      bySector[s.sector].n += 1;
    });
    window.STOCK_SECTORS = window.STOCK_SECTORS.map(sec => ({
      ...sec,
      pct: bySector[sec.sector] ? +(bySector[sec.sector].sum / bySector[sec.sector].n).toFixed(2) : 0,
    }));

    // gainers / losers — 워치리스트에서 파생
    const sorted = [...window.STOCK_WATCHLIST].sort((a, b) => b.pct - a.pct);
    const fmtVol = (v) => v >= 1e6 ? (v / 1e6).toFixed(1) + 'M' : v >= 1e3 ? (v / 1e3).toFixed(0) + 'K' : String(v);
    window.STOCK_GAINERS = sorted.slice(0, 8).map(s => ({
      ticker: s.ticker, name: s.name, price: s.price, pct: s.pct, vol: fmtVol(s.vol), reason: s.sector,
    }));
    window.STOCK_LOSERS = sorted.slice(-8).reverse().map(s => ({
      ticker: s.ticker, name: s.name, price: s.price, pct: s.pct, vol: fmtVol(s.vol), reason: s.sector,
    }));

    fire();
  }

  // ---------- Sparkline: 각 종목 최근 30 거래일 ----------
  async function refreshSpark(symbol, range = '1mo', interval = '1d') {
    try {
      const d = await jget(Y_CHART + symbol + '?range=' + range + '&interval=' + interval);
      const closes = d?.chart?.result?.[0]?.indicators?.quote?.[0]?.close || [];
      return closes.filter(v => v != null).map(v => +v.toFixed(2));
    } catch (e) {
      return [];
    }
  }

  async function refreshAllSparks() {
    // 병렬, 최대 동시 6개
    const syms = [
      ...window.STOCK_INDICES.map(i => i.code),
      ...window.STOCK_WATCHLIST.map(s => s.ticker),
    ];
    const results = {};
    const batch = 6;
    for (let i = 0; i < syms.length; i += batch) {
      const slice = syms.slice(i, i + batch);
      const got = await Promise.all(slice.map(s => refreshSpark(s).then(sp => [s, sp])));
      got.forEach(([s, sp]) => { if (sp.length) results[s] = sp; });
    }
    window.STOCK_INDICES = window.STOCK_INDICES.map(i => results[i.code] ? { ...i, spark: results[i.code] } : i);
    window.STOCK_WATCHLIST = window.STOCK_WATCHLIST.map(s => results[s.ticker] ? { ...s, spark: results[s.ticker] } : s);
    fire();
  }

  // ---------- Candles: 선택 종목 90일 일봉 ----------
  async function refreshCandles(symbol) {
    try {
      const d = await jget(Y_CHART + symbol + '?range=3mo&interval=1d');
      const r = d?.chart?.result?.[0];
      if (!r) return;
      const ts  = r.timestamp || [];
      const q   = r.indicators?.quote?.[0] || {};
      const out = [];
      for (let i = 0; i < ts.length; i++) {
        if (q.open?.[i] == null) continue;
        out.push({
          t: new Date(ts[i] * 1000).toISOString().slice(0, 10),
          open:  +q.open[i].toFixed(2),
          close: +q.close[i].toFixed(2),
          high:  +q.high[i].toFixed(2),
          low:   +q.low[i].toFixed(2),
          vol:   q.volume?.[i] || 0,
        });
      }
      window.STOCK_CANDLES = out;
      window.STOCK_CANDLES_SYMBOL = symbol;
      fire();
    } catch (e) { /* noop */ }
  }

  // ---------- public API ----------
  window.StockLive = {
    refreshQuotes,
    refreshAllSparks,
    refreshCandles,
    // 현재 상태
    status: { lastUpdate: null, error: null, loading: true },
  };

  async function bootstrap() {
    try {
      await refreshQuotes();
      window.StockLive.status.loading = false;
      window.StockLive.status.lastUpdate = new Date();
      fire();
      // sparks + candles 병렬로 뒷단에서
      refreshAllSparks();
      refreshCandles('AAPL');
      // 30초마다 quote refresh
      setInterval(async () => {
        try {
          await refreshQuotes();
          window.StockLive.status.lastUpdate = new Date();
          window.StockLive.status.error = null;
          fire();
        } catch (e) {
          window.StockLive.status.error = String(e.message || e);
          fire();
        }
      }, 30000);
    } catch (e) {
      window.StockLive.status.loading = false;
      window.StockLive.status.error = String(e.message || e);
      fire();
      console.error('[StockLive] bootstrap failed:', e);
    }
  }

  // DOM 준비 후 시작
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
