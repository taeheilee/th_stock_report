/* US Stock Dashboard — Initial seed + schema.
   실제 시세는 stock-live.js가 Yahoo Finance API로 덮어씀. 
   여기 값들은 API 응답 오기 전 placeholder + 종목 메타데이터(name/sector)만 유효. */

// ---------- 주요 지수 ----------
// Yahoo 심볼: ^GSPC=S&P500, ^IXIC=NASDAQ, ^DJI=Dow, ^RUT=Russell2000,
//            ^VIX=VIX, ^TNX=10Y Treasury, DX-Y.NYB=DXY, BTC-USD
window.STOCK_INDICES = [
  { code: '^GSPC',  name: 'S&P 500',     value: 0, change: 0, pct: 0, spark: [], market: 'US',  status: 'close' },
  { code: '^IXIC',  name: 'NASDAQ',      value: 0, change: 0, pct: 0, spark: [], market: 'US',  status: 'close' },
  { code: '^DJI',   name: 'Dow Jones',   value: 0, change: 0, pct: 0, spark: [], market: 'US',  status: 'close' },
  { code: '^RUT',   name: 'Russell 2000',value: 0, change: 0, pct: 0, spark: [], market: 'US',  status: 'close' },
  { code: '^VIX',   name: 'VIX',         value: 0, change: 0, pct: 0, spark: [], market: 'US',  status: 'close' },
  { code: '^TNX',   name: '10Y Treasury',value: 0, change: 0, pct: 0, spark: [], market: 'US',  status: 'close' },
  { code: 'DX-Y.NYB',name: 'DXY',        value: 0, change: 0, pct: 0, spark: [], market: 'FX',  status: 'close' },
  { code: 'BTC-USD',name: 'Bitcoin',     value: 0, change: 0, pct: 0, spark: [], market: 'CRYPTO', status: 'open' },
];

// ---------- 워치리스트 ----------
// price/change/pct/vol/cap/spark은 API가 덮어씀. name/sector/market은 고정.
window.STOCK_WATCHLIST = [
  { ticker: 'AAPL',  name: 'Apple',              sector: 'Tech',      price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [], hot: true  },
  { ticker: 'MSFT',  name: 'Microsoft',          sector: 'Tech',      price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [], hot: true  },
  { ticker: 'NVDA',  name: 'NVIDIA',             sector: 'Semi',      price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [], hot: true  },
  { ticker: 'GOOGL', name: 'Alphabet',           sector: 'Tech',      price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [] },
  { ticker: 'AMZN',  name: 'Amazon',             sector: 'Retail',    price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [] },
  { ticker: 'META',  name: 'Meta Platforms',     sector: 'Tech',      price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [] },
  { ticker: 'TSLA',  name: 'Tesla',              sector: 'EV',        price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [], hot: true },
  { ticker: 'AMD',   name: 'AMD',                sector: 'Semi',      price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [] },
  { ticker: 'AVGO',  name: 'Broadcom',           sector: 'Semi',      price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [] },
  { ticker: 'NFLX',  name: 'Netflix',            sector: 'Media',     price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [] },
  { ticker: 'JPM',   name: 'JPMorgan Chase',     sector: 'Finance',   price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NYSE',   spark: [] },
  { ticker: 'BRK-B', name: 'Berkshire Hathaway', sector: 'Finance',   price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NYSE',   spark: [] },
  { ticker: 'V',     name: 'Visa',               sector: 'Finance',   price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NYSE',   spark: [] },
  { ticker: 'UNH',   name: 'UnitedHealth',       sector: 'Health',    price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NYSE',   spark: [] },
  { ticker: 'XOM',   name: 'Exxon Mobil',        sector: 'Energy',    price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NYSE',   spark: [] },
  { ticker: 'COIN',  name: 'Coinbase',           sector: 'Crypto',    price: 0, change: 0, pct: 0, vol: 0, cap: '—', pe: null, market: 'NASDAQ', spark: [] },
];

// 랭킹 — 라이브에서 pct 기준으로 재계산
window.STOCK_GAINERS = [];
window.STOCK_LOSERS  = [];

// ---------- 섹터 (고정 메타; pct는 라이브에서 재계산) ----------
window.STOCK_SECTORS = [
  { sector: 'Tech',      pct: 0, weight: 28, leaders: ['AAPL', 'MSFT', 'GOOGL', 'META'] },
  { sector: 'Semi',      pct: 0, weight: 16, leaders: ['NVDA', 'AMD', 'AVGO'] },
  { sector: 'Retail',    pct: 0, weight: 9,  leaders: ['AMZN'] },
  { sector: 'EV',        pct: 0, weight: 6,  leaders: ['TSLA'] },
  { sector: 'Media',     pct: 0, weight: 4,  leaders: ['NFLX'] },
  { sector: 'Finance',   pct: 0, weight: 14, leaders: ['JPM', 'BRK-B', 'V'] },
  { sector: 'Health',    pct: 0, weight: 10, leaders: ['UNH'] },
  { sector: 'Energy',    pct: 0, weight: 8,  leaders: ['XOM'] },
  { sector: 'Crypto',    pct: 0, weight: 2,  leaders: ['COIN'] },
];

// ---------- 뉴스 (정적 샘플; 별도 뉴스 API 연동은 후속 작업) ----------
window.STOCK_NEWS = [
  {
    id: 'n1', time: '—', source: 'Reuters',
    title: 'Nvidia Blackwell chips sold out through 2026, Huang says',
    summary: 'CEO Jensen Huang told analysts that Blackwell GPU allocation is fully committed into next year, with cloud hyperscalers absorbing the majority of supply. Analysts see upside risk to Q2 DC revenue guidance.',
    tickers: ['NVDA', 'MSFT', 'META'], sentiment: 'bull', hot: true,
    url: 'https://www.reuters.com/',
  },
  {
    id: 'n2', time: '—', source: 'Bloomberg',
    title: 'Apple accelerates on-device AI push; iPhone 17 to ship with custom transformer',
    summary: 'Apple is rushing a proprietary on-device LLM into iPhone 17 launch firmware, bypassing third-party cloud dependencies for core Siri tasks. Supply-chain checks show TSMC N2 node demand revised higher.',
    tickers: ['AAPL'], sentiment: 'bull', hot: true,
    url: 'https://www.bloomberg.com/',
  },
  {
    id: 'n3', time: '—', source: 'WSJ',
    title: 'Tesla deliveries miss; China price war intensifies',
    summary: 'Q1 deliveries came in 4% below consensus as BYD and Xiaomi undercut Model 3 pricing in Tier-1 Chinese cities. Margin guidance cut to 14% from 17%.',
    tickers: ['TSLA'], sentiment: 'bear', hot: true,
    url: 'https://www.wsj.com/',
  },
  {
    id: 'n4', time: '—', source: 'CNBC',
    title: 'Fed minutes signal September cut on the table as core PCE cools',
    summary: 'FOMC minutes show a growing faction favoring a 25bp cut in September, with several members noting labor market softening. 2-year yield dropped 8bps on the release.',
    tickers: [], sentiment: 'bull',
    url: 'https://www.cnbc.com/',
  },
  {
    id: 'n5', time: '—', source: 'FT',
    title: 'Microsoft Azure AI revenue run-rate tops $13B, exceeds Google Cloud',
    summary: 'Azure AI-specific workload revenue hit a $13B annualized run-rate in the latest quarter per internal figures, surpassing Google Cloud AI. Enterprise co-pilot seat expansion is the largest contributor.',
    tickers: ['MSFT', 'GOOGL'], sentiment: 'bull',
    url: 'https://www.ft.com/',
  },
  {
    id: 'n6', time: '—', source: 'Reuters',
    title: 'AMD MI400 tape-out confirmed; shipping Q1 2027',
    summary: 'AMD confirmed MI400 accelerator tape-out with first production silicon targeting Q1 2027 release. Hyperscaler design wins from Oracle and Meta disclosed.',
    tickers: ['AMD', 'META'], sentiment: 'bull',
    url: 'https://www.reuters.com/',
  },
  {
    id: 'n7', time: '—', source: 'Bloomberg',
    title: 'Meta Reality Labs loss narrows as Orion glasses gain traction',
    summary: 'Reality Labs division losses narrowed to $3.2B from $4.5B YoY as Orion AR glasses pre-orders exceeded internal forecasts. Zuckerberg reaffirmed 2027 consumer launch.',
    tickers: ['META'], sentiment: 'bull',
    url: 'https://www.bloomberg.com/',
  },
  {
    id: 'n8', time: '—', source: 'WSJ',
    title: 'Exxon Guyana output hits 650k bpd milestone',
    summary: 'Exxon announced Guyana production reached 650,000 barrels per day, 3 quarters ahead of schedule. Stabroek block now contributes ~30% of company upstream volumes.',
    tickers: ['XOM'], sentiment: 'bull',
    url: 'https://www.wsj.com/',
  },
];

// ---------- 차트 캔들 — stock-live.js가 Yahoo Chart API로 채움 ----------
window.STOCK_CANDLES = [];
