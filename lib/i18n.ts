/**
 * i18n — Lightweight translation system.
 * No external deps. Korean default, English secondary.
 */

export type Locale = "ko" | "en";

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "ko", label: "한국어", flag: "\u{1F1F0}\u{1F1F7}" },
  { code: "en", label: "English", flag: "\u{1F1FA}\u{1F1F8}" },
];

const dict = {
  // ── Splash ──
  "splash.tagline": {
    ko: "온체인 신용을 증명하다",
    en: "Prove your on-chain credibility",
  },

  // ── Landing ──
  "landing.badge": {
    ko: "멀티체인 지원",
    en: "Multi-chain Support",
  },
  "landing.subtitle": {
    ko: "당신의 지갑 활동을 분석하고\n온체인 신용 점수를 받아보세요.",
    en: "Analyze your wallet activity\nand get a comprehensive on-chain score.",
  },
  "landing.checkScore": {
    ko: "내 점수 확인하기",
    en: "Check Your Score",
  },
  "landing.checkScoreDesc": {
    ko: "지갑을 연결하거나 주소를 입력하세요",
    en: "Connect your wallet or enter any wallet address",
  },
  "landing.metricsTitle": {
    ko: "5가지 지표, 1000점 만점",
    en: "5 Metrics, 1000 Points",
  },
  "landing.metricsDesc": {
    ko: "각 카테고리당 최대 200점, 총점 1000점으로 평가합니다",
    en: "Each category contributes up to 200 points to your total score",
  },
  "landing.totalScore": {
    ko: "총점",
    en: "Total Score",
  },
  "landing.howTitle": {
    ko: "이용 방법",
    en: "How It Works",
  },

  // ── How it works steps ──
  "step.connect": { ko: "연결", en: "Connect" },
  "step.connectDesc": { ko: "지갑 연결 또는 주소 입력", en: "Link wallet or paste address" },
  "step.scan": { ko: "분석", en: "Scan" },
  "step.scanDesc": { ko: "온체인 이력 스캔", en: "We read your on-chain history" },
  "step.score": { ko: "점수", en: "Score" },
  "step.scoreDesc": { ko: "AI 기반 스코어링", en: "AI-powered scoring engine" },
  "step.share": { ko: "공유", en: "Share" },
  "step.shareDesc": { ko: "스코어 카드 다운로드", en: "Download your score card" },

  // ── Categories ──
  "cat.walletAge": { ko: "지갑 나이", en: "Wallet Age" },
  "cat.walletAge.desc": { ko: "온체인 활동 기간", en: "How long your wallet has been active" },
  "cat.txVolume": { ko: "거래 횟수", en: "Transactions" },
  "cat.txVolume.desc": { ko: "총 트랜잭션 수", en: "On-chain transaction history" },
  "cat.defiActivity": { ko: "DeFi 활동", en: "DeFi Activity" },
  "cat.defiActivity.desc": { ko: "프로토콜 사용 현황", en: "Protocol interactions & usage" },
  "cat.balance": { ko: "잔고", en: "Balance" },
  "cat.balance.desc": { ko: "현재 잔고 평가", en: "Current balance health" },
  "cat.tokenDiversity": { ko: "토큰 다양성", en: "Token Diversity" },
  "cat.tokenDiversity.desc": { ko: "토큰 포트폴리오", en: "Token portfolio range" },

  // ── Wallet input ──
  "wallet.connectTab": { ko: "지갑 연결", en: "Connect Wallet" },
  "wallet.manualTab": { ko: "주소 입력", en: "Enter Address" },
  "wallet.metamask": { ko: "MetaMask", en: "MetaMask" },
  "wallet.metamaskDesc": { ko: "지갑을 연결하여 분석하기", en: "Connect your wallet to analyze" },
  "wallet.metamaskInstall": {
    ko: "MetaMask가 감지되지 않았습니다. 여기서 설치하세요",
    en: "MetaMask not detected. Install here",
  },
  "wallet.connecting": { ko: "연결 중...", en: "Connecting..." },
  "wallet.connectingDesc": { ko: "MetaMask에서 요청을 승인하세요", en: "Approve the request in MetaMask" },
  "wallet.connected": { ko: "연결됨", en: "Connected" },
  "wallet.analyzeMyWallet": { ko: "내 지갑 분석하기", en: "Analyze My Wallet" },
  "wallet.analyzeWallet": { ko: "지갑 분석하기", en: "Analyze Wallet" },
  "wallet.placeholder": { ko: "0x... 또는 T... 주소 입력", en: "0x... or T... wallet address" },
  "wallet.paste": { ko: "붙여넣기", en: "Paste" },
  "wallet.enterAddress": { ko: "지갑 주소를 입력해주세요", en: "Please enter a wallet address" },
  "wallet.invalidAddress": { ko: "잘못된 주소 형식입니다", en: "Invalid address format" },
  "wallet.clipboardInvalid": { ko: "클립보드에 유효한 주소가 없습니다", en: "Clipboard doesn't contain a valid address" },
  "wallet.clipboardFail": { ko: "클립보드에 접근할 수 없습니다", en: "Could not access clipboard" },
  "wallet.rejected": { ko: "사용자가 연결을 거부했습니다", en: "Connection rejected by user" },
  "wallet.connectFail": { ko: "지갑 연결에 실패했습니다", en: "Failed to connect wallet" },
  "wallet.noMetamask": { ko: "MetaMask가 감지되지 않았습니다", en: "MetaMask not detected" },
  "wallet.chainSelect": { ko: "체인 선택", en: "Select Chain" },
  "wallet.chainAuto": { ko: "자동 감지", en: "Auto-detect" },

  // ── Score page ──
  "score.back": { ko: "돌아가기", en: "Back" },
  "score.analyzing": { ko: "지갑 분석 중", en: "Analyzing Wallet" },
  "score.step1": { ko: "지갑 이력을 불러오는 중...", en: "Fetching wallet history..." },
  "score.step2": { ko: "거래 패턴을 분석하는 중...", en: "Analyzing transaction patterns..." },
  "score.step3": { ko: "DeFi 활동을 스캔하는 중...", en: "Scanning DeFi interactions..." },
  "score.step4": { ko: "잔고 지표를 계산하는 중...", en: "Computing balance metrics..." },
  "score.step5": { ko: "최종 점수를 산출하는 중...", en: "Calculating final score..." },
  "score.totalScore": { ko: "종합 점수", en: "Total Score" },
  "score.topPercent": { ko: "상위", en: "Top" },
  "score.ofAllWallets": { ko: "전체 지갑 중", en: "of all wallets" },
  "score.failed": { ko: "분석 실패", en: "Analysis Failed" },
  "score.retry": { ko: "다시 시도", en: "Try Again" },
  "score.demoMode": { ko: "데모 모드 — 이 체인은 현재 샘플 데이터로 표시됩니다 (유료 API 플랜 필요)", en: "Demo Mode — This chain is displayed with sample data (paid API plan required)" },
  "score.tips": { ko: "개선 가이드", en: "Improvement Tips" },
  "score.tipsGreat": { ko: "훌륭합니다! 균형 잡힌 지갑이에요.", en: "Great job! Your wallet is well-rounded." },
  "score.share": { ko: "점수 공유하기", en: "Share Score" },
  "score.copyLink": { ko: "링크 복사", en: "Copy Link" },
  "score.copied": { ko: "복사됨!", en: "Copied!" },
  "score.download": { ko: "이미지로 저장", en: "Download as Image" },
  "score.exporting": { ko: "생성 중...", en: "Exporting..." },

  // ── Tips ──
  "tip.walletAge": { ko: "지갑을 꾸준히 사용하면 나이 점수가 올라갑니다", en: "Keep your wallet active over time to improve your age score" },
  "tip.txVolume": { ko: "온체인 활동을 늘려 거래 점수를 높여보세요", en: "Increase your on-chain activity with more transactions" },
  "tip.defiActivity": { ko: "Uniswap, Aave 같은 DeFi 프로토콜을 이용해보세요", en: "Try interacting with DeFi protocols like Uniswap or Aave" },
  "tip.balance": { ko: "적정 수준의 잔고를 유지하면 점수가 올라갑니다", en: "Maintaining a healthy balance improves your score" },
  "tip.tokenDiversity": { ko: "다양한 토큰 포트폴리오로 다양성 점수를 높여보세요", en: "Diversify your token portfolio for a better diversity score" },

  // ── Growth Coach ──
  "growth.title": { ko: "성장 리포트", en: "Growth Report" },
  "growth.firstVisit": {
    ko: "첫 분석이 기록되었습니다! 다음 방문 시 성장 변화를 확인할 수 있어요.",
    en: "First analysis recorded! Come back later to see your growth.",
  },
  "growth.totalChange": { ko: "총점 변화", en: "Score Change" },
  "growth.since": { ko: "일 전 대비", en: "days ago" },
  "growth.visits": { ko: "번째 분석", en: "analyses" },
  "growth.improved": { ko: "가장 성장한 항목", en: "Most Improved" },
  "growth.focus": { ko: "집중 개선 항목", en: "Focus Area" },
  "growth.stable": { ko: "변화 없음", en: "No Change" },
  "growth.coach.upBig": {
    ko: "대단해요! 온체인 활동이 눈에 띄게 성장했어요.",
    en: "Amazing! Your on-chain activity has grown significantly.",
  },
  "growth.coach.upSmall": {
    ko: "꾸준히 성장 중이에요. 이 페이스를 유지하세요!",
    en: "Steady growth! Keep up this pace.",
  },
  "growth.coach.stable": {
    ko: "점수가 유지되고 있어요. 새로운 프로토콜을 탐험해보세요.",
    en: "Score is steady. Try exploring new protocols.",
  },
  "growth.coach.down": {
    ko: "점수가 소폭 하락했어요. 잔고나 활동을 확인해보세요.",
    en: "Score dipped slightly. Check your balance or activity.",
  },
  "growth.coach.walletAge": {
    ko: "시간이 지나면 자연스럽게 올라가요. 꾸준히 활동하세요!",
    en: "This improves naturally over time. Stay active!",
  },
  "growth.coach.txVolume": {
    ko: "DEX 스왑이나 전송을 더 해보세요.",
    en: "Try more swaps or transfers on-chain.",
  },
  "growth.coach.defiActivity": {
    ko: "Aave 예치, Uniswap 스왑, Lido 스테이킹을 시도해보세요.",
    en: "Try Aave lending, Uniswap swaps, or Lido staking.",
  },
  "growth.coach.balance": {
    ko: "잔고를 조금만 더 유지해보세요.",
    en: "Try maintaining a slightly higher balance.",
  },
  "growth.coach.tokenDiversity": {
    ko: "다양한 토큰을 보유하거나 거래해보세요.",
    en: "Hold or trade a wider variety of tokens.",
  },

  // ── Auth ──
  "auth.subtitle": { ko: "온체인 점수를 확인하려면 로그인하세요", en: "Sign in to check your on-chain score" },
  "auth.login": { ko: "로그인", en: "Log In" },
  "auth.google": { ko: "Google로 로그인", en: "Sign in with Google" },
  "auth.logout": { ko: "로그아웃", en: "Log Out" },

  // ── Risk Analysis ──
  "risk.title": { ko: "위험 분석", en: "Risk Analysis" },
  "risk.safe": { ko: "안전한 지갑", en: "Safe Wallet" },
  "risk.low": { ko: "낮은 위험", en: "Low Risk" },
  "risk.medium": { ko: "주의 필요", en: "Caution Required" },
  "risk.high": { ko: "높은 위험", en: "High Risk" },
  "risk.critical": { ko: "매우 위험", en: "Critical Risk" },
  "risk.mixer": { ko: "믹서 프로토콜 사용 감지", en: "Mixer protocol interaction detected" },
  "risk.highFreq": { ko: "비정상적 거래 빈도", en: "Abnormal transaction frequency" },
  "risk.dust": { ko: "더스트 공격 의심", en: "Suspected dust attack" },
  "risk.circular": { ko: "순환 거래 감지", en: "Circular trading detected" },
  "risk.youngHighVol": { ko: "신생 지갑 대량 활동", en: "New wallet with high activity" },
  "risk.sanctioned": { ko: "제재 대상 주소 접촉", en: "Sanctioned address interaction" },
  "risk.score": { ko: "위험 점수", en: "Risk Score" },

  // ── Dashboard ──
  "dash.title": { ko: "온체인 분석", en: "Onchain Analysis" },
  "dash.creditScore": { ko: "신용 점수", en: "Credit Score" },
  "dash.riskScore": { ko: "위험 점수", en: "Risk Score" },
  "dash.transactions": { ko: "거래 수", en: "Transactions" },
  "dash.clusterSize": { ko: "클러스터", en: "Cluster" },
  "dash.trustLevel": { ko: "신뢰 등급", en: "Trust Level" },
  "dash.scoreBreakdown": { ko: "신용 점수 상세", en: "Credit Score Breakdown" },
  "dash.walletCluster": { ko: "지갑 클러스터", en: "Wallet Cluster" },
  "dash.recentTx": { ko: "최근 USDT 거래", en: "Recent USDT Transactions" },
  "dash.totalInflow": { ko: "총 유입", en: "Total Inflow" },
  "dash.totalOutflow": { ko: "총 유출", en: "Total Outflow" },
  "dash.received": { ko: "USDT 수신", en: "USDT received" },
  "dash.sent": { ko: "USDT 송신", en: "USDT sent" },
  "dash.daysActive": { ko: "일 활동", en: "days active" },
  "dash.confidence": { ko: "신뢰도", en: "confidence" },
  "dash.mainWallet": { ko: "메인", en: "Main" },
  "dash.noCluster": { ko: "추가 지갑이 감지되지 않았습니다.\n더 많은 데이터가 필요합니다.", en: "No additional wallets detected.\nMore data needed for clustering." },
  "dash.noTx": { ko: "거래 내역이 없습니다. 지갑 인덱싱을 먼저 시도해보세요.", en: "No transactions found. Try indexing the wallet first." },
  "dash.loading": { ko: "지갑 데이터 분석 중...", en: "Analyzing wallet data..." },
  "dash.error": { ko: "분석 실패", en: "Analysis Failed" },
  "dash.errorHint": { ko: "FastAPI 백엔드가 8000 포트에서 실행 중인지 확인하세요", en: "Make sure the FastAPI backend is running on port 8000" },
  "dash.backendConnected": { ko: "백엔드 연결됨", en: "Connected to Backend" },
  "dash.walletAge": { ko: "지갑 나이", en: "Wallet Age" },
  "dash.txCount": { ko: "거래 횟수", en: "TX Count" },
  "dash.volume": { ko: "거래량", en: "Volume" },
  "dash.counterparties": { ko: "거래 상대", en: "Counterparties" },
  "dash.from": { ko: "발신", en: "From" },
  "dash.to": { ko: "수신", en: "To" },

  // ── Dashboard Visualization Tabs ──
  "dash.network": { ko: "네트워크 그래프", en: "Network Graph" },
  "dash.flow": { ko: "자금 흐름", en: "Fund Flow" },
  "dash.activity": { ko: "거래 활동", en: "Transaction Activity" },
  "dash.clusterViz": { ko: "클러스터 시각화", en: "Cluster Visualization" },
  "dash.tab.overview": { ko: "개요", en: "Overview" },
  "dash.tab.network": { ko: "네트워크", en: "Network" },
  "dash.tab.flow": { ko: "자금 흐름", en: "Flow" },
  "dash.tab.activity": { ko: "활동", en: "Activity" },
  "dash.inflowSources": { ko: "유입 출처", en: "Inflow Sources" },
  "dash.outflowDest": { ko: "유출 대상", en: "Outflow Dest." },

  // ── Footer ──
  "footer.poweredBy": { ko: "Powered by Multi-chain APIs", en: "Powered by Multi-chain APIs" },
} as const;

export type TranslationKey = keyof typeof dict;

export function t(key: TranslationKey, locale: Locale): string {
  const entry = dict[key];
  if (!entry) return key;
  return entry[locale] ?? entry["ko"];
}
