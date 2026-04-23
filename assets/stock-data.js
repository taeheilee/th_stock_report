/* Shared mock data for the stock dashboard.
   All data is fictional. Prices in KRW (코스피/코스닥) or USD (미국).
   서양식 컬러 관례: 상승=초록, 하락=빨강. */

// ---------- 주요 지수 ----------
window.STOCK_INDICES = [
  { code: 'KOSPI',   name: '코스피',      value: 2731.84, change: +24.12, pct: +0.89, spark: [2698, 2702, 2695, 2708, 2714, 2721, 2718, 2725, 2731], market: 'KR', status: 'open' },
  { code: 'KOSDAQ',  name: '코스닥',      value: 868.42,  change: -3.71,  pct: -0.43, spark: [872, 874, 871, 876, 873, 870, 868, 869, 868], market: 'KR', status: 'open' },
  { code: 'KOSPI200',name: '코스피200',   value: 363.19,  change: +3.47,  pct: +0.96, spark: [358, 359, 358, 361, 362, 363, 362, 363, 363], market: 'KR', status: 'open' },
  { code: 'S&P500',  name: 'S&P 500',     value: 5428.77, change: +18.42, pct: +0.34, spark: [5402, 5410, 5405, 5418, 5422, 5420, 5425, 5427, 5428], market: 'US', status: 'close' },
  { code: 'NASDAQ',  name: 'NASDAQ',      value: 17689.36,change: +112.4, pct: +0.64, spark: [17520, 17560, 17540, 17600, 17640, 17620, 17670, 17680, 17689], market: 'US', status: 'close' },
  { code: 'DOW',     name: '다우존스',    value: 39112.16,change: -76.2,  pct: -0.19, spark: [39200, 39180, 39210, 39160, 39140, 39130, 39120, 39108, 39112], market: 'US', status: 'close' },
  { code: 'USDKRW',  name: '원/달러',     value: 1378.40, change: +4.20,  pct: +0.31, spark: [1372, 1374, 1373, 1375, 1377, 1376, 1378, 1378, 1378], market: 'FX', status: 'open' },
  { code: 'VKOSPI',  name: 'VKOSPI',      value: 16.42,   change: -0.68,  pct: -3.98, spark: [17.2, 17.1, 17.3, 17.0, 16.8, 16.6, 16.5, 16.4, 16.4], market: 'KR', status: 'open' },
];

// ---------- 워치리스트 / 인기 종목 ----------
// 차트 데이터: 30일치, 일봉
function genSpark(base, volatility, trend) {
  const arr = []; let v = base;
  for (let i = 0; i < 30; i++) {
    v = v + (Math.random() - 0.5 + trend) * volatility;
    arr.push(+v.toFixed(2));
  }
  return arr;
}

window.STOCK_WATCHLIST = [
  { ticker: '005930', name: '삼성전자',       sector: '반도체',     price: 81400,   change: +1200, pct: +1.50, vol: 12482091, cap: '485.9조', pe: 18.4, market: 'KOSPI',  spark: genSpark(78000, 800, 0.05), hot: true },
  { ticker: '000660', name: 'SK하이닉스',      sector: '반도체',     price: 214500,  change: +6500, pct: +3.12, vol: 4891234,  cap: '156.2조', pe: 24.1, market: 'KOSPI',  spark: genSpark(200000, 2500, 0.08), hot: true },
  { ticker: '035420', name: 'NAVER',           sector: 'IT서비스',   price: 178500,  change: -2500, pct: -1.38, vol: 892103,   cap: '29.1조',  pe: 22.7, market: 'KOSPI',  spark: genSpark(182000, 1500, -0.04) },
  { ticker: '035720', name: '카카오',          sector: 'IT서비스',   price: 42150,   change: -850,  pct: -1.98, vol: 3420918,  cap: '18.7조',  pe: 31.2, market: 'KOSPI',  spark: genSpark(44000, 600, -0.05) },
  { ticker: '373220', name: 'LG에너지솔루션',  sector: '2차전지',    price: 362000,  change: +8500, pct: +2.40, vol: 412938,   cap: '84.7조',  pe: 42.1, market: 'KOSPI',  spark: genSpark(350000, 3500, 0.06), hot: true },
  { ticker: '207940', name: '삼성바이오로직스',sector: '바이오',     price: 958000,  change: +12000,pct: +1.27, vol: 89412,    cap: '68.2조',  pe: 68.4, market: 'KOSPI',  spark: genSpark(940000, 7000, 0.04) },
  { ticker: '005380', name: '현대차',          sector: '자동차',     price: 248500,  change: -1500, pct: -0.60, vol: 742018,   cap: '52.3조',  pe: 5.2,  market: 'KOSPI',  spark: genSpark(250000, 1800, -0.02) },
  { ticker: '051910', name: 'LG화학',          sector: '화학',       price: 352500,  change: -4500, pct: -1.26, vol: 312948,   cap: '24.9조',  pe: 15.8, market: 'KOSPI',  spark: genSpark(360000, 2800, -0.03) },
  { ticker: '068270', name: '셀트리온',        sector: '바이오',     price: 184500,  change: +3500, pct: +1.93, vol: 523091,   cap: '39.2조',  pe: 54.3, market: 'KOSPI',  spark: genSpark(180000, 1400, 0.04) },
  { ticker: '247540', name: '에코프로비엠',    sector: '2차전지',    price: 167800,  change: +8200, pct: +5.14, vol: 1842039,  cap: '16.4조',  pe: 85.2, market: 'KOSDAQ', spark: genSpark(155000, 2200, 0.12), hot: true },
  { ticker: '086520', name: '에코프로',        sector: '2차전지',    price: 485500,  change: +24500,pct: +5.31, vol: 892140,   cap: '12.9조',  pe: 72.8, market: 'KOSDAQ', spark: genSpark(455000, 5500, 0.12), hot: true },
  { ticker: '196170', name: '알테오젠',        sector: '바이오',     price: 312000,  change: -8500, pct: -2.65, vol: 412039,   cap: '16.2조',  pe: null, market: 'KOSDAQ', spark: genSpark(322000, 3500, -0.05) },
];

// ---------- 상승/하락 랭킹 ----------
window.STOCK_GAINERS = [
  { ticker: '086520', name: '에코프로',         price: 485500,  pct: +12.42, vol: '892K',  reason: '2차전지 호재' },
  { ticker: '247540', name: '에코프로비엠',     price: 167800,  pct: +9.87,  vol: '1.8M',  reason: '테슬라 공급 확대' },
  { ticker: '196170', name: '알테오젠',         price: 312000,  pct: +8.34,  vol: '412K',  reason: 'FDA 승인' },
  { ticker: '000660', name: 'SK하이닉스',       price: 214500,  pct: +6.12,  vol: '4.9M',  reason: 'HBM 수요 급증' },
  { ticker: '373220', name: 'LG에너지솔루션',   price: 362000,  pct: +5.80,  vol: '412K',  reason: '수주 확대' },
  { ticker: '068270', name: '셀트리온',         price: 184500,  pct: +4.93,  vol: '523K',  reason: '실적 개선' },
  { ticker: '005930', name: '삼성전자',         price: 81400,   pct: +3.50,  vol: '12.4M', reason: 'HBM 양산' },
  { ticker: '207940', name: '삼성바이오로직스', price: 958000,  pct: +2.71,  vol: '89K',   reason: '위탁 수주' },
];

window.STOCK_LOSERS = [
  { ticker: '035720', name: '카카오',          price: 42150,   pct: -6.98, vol: '3.4M',  reason: '규제 이슈' },
  { ticker: '035420', name: 'NAVER',           price: 178500,  pct: -4.38, vol: '892K',  reason: 'AI 경쟁 우려' },
  { ticker: '051910', name: 'LG화학',          price: 352500,  pct: -3.26, vol: '312K',  reason: '전방 수요 둔화' },
  { ticker: '105560', name: 'KB금융',          price: 71200,   pct: -2.84, vol: '1.2M',  reason: '금리 전망' },
  { ticker: '055550', name: '신한지주',        price: 42850,   pct: -2.71, vol: '1.8M',  reason: '금리 전망' },
  { ticker: '005380', name: '현대차',          price: 248500,  pct: -1.60, vol: '742K',  reason: '관세 우려' },
  { ticker: '066570', name: 'LG전자',          price: 92400,   pct: -1.48, vol: '524K',  reason: '가전 부진' },
  { ticker: '028260', name: '삼성물산',        price: 152500,  pct: -1.24, vol: '285K',  reason: '건설 둔화' },
];

// ---------- 섹터 히트맵 ----------
// pct = 일간 등락률, weight = 시총 비중
window.STOCK_SECTORS = [
  { sector: '반도체',       pct: +2.84, weight: 32, leaders: ['삼성전자', 'SK하이닉스'] },
  { sector: '2차전지',      pct: +4.12, weight: 14, leaders: ['LG에너지솔루션', '에코프로'] },
  { sector: '바이오',       pct: +1.48, weight: 11, leaders: ['삼성바이오', '셀트리온'] },
  { sector: '자동차',       pct: -0.72, weight: 10, leaders: ['현대차', '기아'] },
  { sector: 'IT서비스',     pct: -1.65, weight: 8,  leaders: ['NAVER', '카카오'] },
  { sector: '화학',         pct: -1.24, weight: 7,  leaders: ['LG화학', '롯데케미칼'] },
  { sector: '금융',         pct: -2.12, weight: 6,  leaders: ['KB금융', '신한지주'] },
  { sector: '철강',         pct: +0.48, weight: 4,  leaders: ['POSCO홀딩스'] },
  { sector: '조선',         pct: +3.24, weight: 3,  leaders: ['HD현대중공업'] },
  { sector: '건설',         pct: -0.94, weight: 2,  leaders: ['삼성물산'] },
  { sector: '통신',         pct: +0.12, weight: 2,  leaders: ['SK텔레콤'] },
  { sector: '유통',         pct: -0.34, weight: 1,  leaders: ['이마트'] },
];

// ---------- 뉴스 피드 (크롤링된 기사 요약) ----------
// 실제 링크와 요약, sentiment 태그
window.STOCK_NEWS = [
  {
    id: 'n1',
    time: '09:42',
    source: '한국경제',
    title: 'SK하이닉스, HBM3E 엔비디아 공급 확정… 2분기 영업익 역대 최대',
    summary: 'SK하이닉스가 엔비디아 차세대 AI 가속기용 HBM3E 12단 제품 공급 계약을 최종 체결했다. 2분기 영업이익은 시장 컨센서스를 24% 상회한 5.9조원으로 집계될 전망이며, 업계는 AI 메모리 수요가 2026년 하반기까지 공급 부족 상태를 지속할 것으로 본다.',
    tickers: ['000660', '005930'],
    sentiment: 'bull',
    hot: true,
    url: 'https://www.hankyung.com/article/example-hynix-hbm3e',
  },
  {
    id: 'n2',
    time: '09:28',
    source: '매일경제',
    title: '에코프로비엠, 테슬라 4680 배터리 양극재 장기 공급 계약',
    summary: '에코프로비엠이 테슬라의 4680 원통형 배터리 양극재 5년 공급 계약을 체결했다. 연간 12만톤 규모로 추정되며, 발표 직후 시간외 거래에서 에코프로비엠은 9.87%, 에코프로는 12.42% 급등했다.',
    tickers: ['247540', '086520'],
    sentiment: 'bull',
    hot: true,
    url: 'https://www.mk.co.kr/news/example-ecopro-tesla',
  },
  {
    id: 'n3',
    time: '09:14',
    source: '조선비즈',
    title: '카카오, 공정위 플랫폼 규제안 직격탄… 시총 1조 증발',
    summary: '공정거래위원회가 발표한 플랫폼 공정경쟁 촉진법 초안이 카카오를 정조준했다는 해석이 나오면서 주가가 하락 중이다. 카카오톡 선물하기·이모티콘 등 주요 BM이 규제 범위에 포함될 가능성이 제기되며 증권가는 목표주가를 일제히 하향했다.',
    tickers: ['035720'],
    sentiment: 'bear',
    hot: true,
    url: 'https://biz.chosun.com/example-kakao-regulation',
  },
  {
    id: 'n4',
    time: '08:52',
    source: '이데일리',
    title: '알테오젠, SC제형 히알루로니다제 FDA 허가… 머크와 추가 계약 논의',
    summary: '알테오젠의 피하주사(SC) 제형 변환 플랫폼 ALT-B4가 FDA 시판 허가를 받았다. 머크와의 라이선스 아웃 수수료가 단계별로 추가 발생하며, 시장은 연간 2,000억원 이상의 로열티 유입을 예상한다.',
    tickers: ['196170'],
    sentiment: 'bull',
    url: 'https://www.edaily.co.kr/example-alteogen-fda',
  },
  {
    id: 'n5',
    time: '08:31',
    source: '연합인포맥스',
    title: '외국인 6거래일 연속 순매수… 반도체·바이오 집중',
    summary: '외국인이 6거래일 연속 코스피에서 순매수세를 이어갔다. 누적 순매수 규모는 2.4조원으로, 섹터별로는 반도체 1.1조, 바이오 4,200억, 2차전지 3,800억 순이었다. 원/달러 환율도 1,378원에서 안정세.',
    tickers: ['000660', '005930', '207940'],
    sentiment: 'bull',
    url: 'https://news.einfomax.co.kr/example-foreign-buy',
  },
  {
    id: 'n6',
    time: '08:15',
    source: '블룸버그',
    title: 'Fed, 6월 FOMC서 금리 인하 시사… 달러 약세 전환',
    summary: '연준이 6월 FOMC 의사록을 통해 인플레이션 둔화를 공식 확인했다. 시장은 9월 25bp 인하를 90% 반영 중이며, DXY는 104.2까지 하락했다. 신흥국 주식시장에 유동성 유입 기대.',
    tickers: [],
    sentiment: 'bull',
    url: 'https://www.bloomberg.com/example-fomc-minutes',
  },
  {
    id: 'n7',
    time: '07:58',
    source: '서울경제',
    title: 'LG화학, 전기차 캐즘 장기화… 2분기 영업이익 40% 감소 전망',
    summary: 'LG화학이 전기차 수요 둔화로 2분기 영업이익이 전년 대비 40% 감소할 것으로 추정된다. 석유화학 업황도 바닥권이라 하반기 회복 가시성은 낮다는 증권가 분석.',
    tickers: ['051910'],
    sentiment: 'bear',
    url: 'https://www.sedaily.com/example-lgchem-weak',
  },
  {
    id: 'n8',
    time: '07:42',
    source: '더벨',
    title: '현대차·기아, 미국 관세 25% 시나리오 대비… 현지 생산 확대',
    summary: '트럼프 행정부의 대미 수입차 25% 관세 카드가 거론되며 현대차·기아가 조지아 공장 증설을 검토 중이다. 단기 주가 부담은 있으나 중장기 현지화 가속으로 리스크 완화될 전망.',
    tickers: ['005380'],
    sentiment: 'neutral',
    url: 'https://www.thebell.co.kr/example-hmg-tariff',
  },
];

// ---------- 차트 캔들 데이터 (삼성전자 샘플) ----------
window.STOCK_CANDLES = (function () {
  const out = [];
  let prev = 77500;
  const now = new Date('2026-04-23T09:42:00');
  for (let i = 89; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const open = prev;
    const drift = (Math.random() - 0.47) * 1200;
    const close = Math.max(60000, open + drift);
    const high = Math.max(open, close) + Math.random() * 600;
    const low  = Math.min(open, close) - Math.random() * 600;
    const vol  = Math.floor(6000000 + Math.random() * 18000000);
    out.push({ t: t.toISOString().slice(0, 10), open: +open.toFixed(0), close: +close.toFixed(0), high: +high.toFixed(0), low: +low.toFixed(0), vol });
    prev = close;
  }
  // 마지막 캔들은 현재가와 일치시킴
  out[out.length - 1].close = 81400;
  out[out.length - 1].high = Math.max(out[out.length - 1].high, 81400);
  return out;
})();
