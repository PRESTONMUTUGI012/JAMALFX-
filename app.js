const PARTNER_APP_ID = "34UGhpx0qrXHqpfKHAkGH";
const AFFILIATE_TOKEN = "3A2CFHPG722B";

const marketSymbols = {
    volatility_1s: [
        { symbol: '1HZ10V', name: 'Volatility 10 (1s) Index' },
        { symbol: '1HZ25V', name: 'Volatility 25 (1s) Index' },
        { symbol: '1HZ50V', name: 'Volatility 50 (1s) Index' },
        { symbol: '1HZ75V', name: 'Volatility 75 (1s) Index' },
        { symbol: '1HZ100V', name: 'Volatility 100 (1s) Index' }
    ],
    accumulators: [
        { symbol: 'ACCU10', name: 'Accumulator 10 Index' },
        { symbol: 'ACCU25', name: 'Accumulator 25 Index' },
        { symbol: 'ACCU50', name: 'Accumulator 50 Index' },
        { symbol: 'ACCU75', name: 'Accumulator 75 Index' },
        { symbol: 'ACCU100', name: 'Accumulator 100 Index' }
    ],
    synthetic: [
        { symbol: 'R_100', name: 'Volatility 100 Index' }, { symbol: 'R_75', name: 'Volatility 75 Index' },
        { symbol: 'R_50', name: 'Volatility 50 Index' }, { symbol: 'R_25', name: 'Volatility 25 Index' },
        { symbol: 'R_10', name: 'Volatility 10 Index' }
    ],
    boom_crash: [
        { symbol: 'BOOM1000', name: 'Boom 1000 Index' }, { symbol: 'BOOM500', name: 'Boom 500 Index' },
        { symbol: 'CRASH1000', name: 'Crash 1000 Index' }, { symbol: 'CRASH500', name: 'Crash 500 Index' },
        { symbol: 'STEP', name: 'Step Index' }
    ],
    forex: [
        { symbol: 'frxEURUSD', name: 'EUR/USD (Euro/Dollar)' }, { symbol: 'frxGBPUSD', name: 'GBP/USD (Pound/Dollar)' },
        { symbol: 'frxUSDJPY', name: 'USD/JPY (Dollar/Yen)' }, { symbol: 'frxAUDUSD', name: 'AUD/USD (Aussie/Dollar)' },
        { symbol: 'frxUSDCAD', name: 'USD/CAD (Dollar/CAD)' }, { symbol: 'frxNZDUSD', name: 'NZD/USD (Kiwi/Dollar)' },
        { symbol: 'frxEURGBP', name: 'EUR/GBP (Euro/Pound)' }, { symbol: 'frxGBPJPY', name: 'GBP/JPY (Pound/Yen)' }
    ],
    stocks: [
        { symbol: 'TSLA', name: 'Tesla Inc (TSLA)' }, { symbol: 'NVDA', name: 'NVIDIA Corp (NVDA)' },
        { symbol: 'AAPL', name: 'Apple Inc (AAPL)' }, { symbol: 'DJI', name: 'Wall Street 30 Index' },
        { symbol: 'SPC', name: 'S&P 500 Index' }, { symbol: 'NDX', name: 'US Tech 100' }
    ],
    crypto: [
        { symbol: 'cryBTCUSD', name: 'BTC/USD (Bitcoin)' }, { symbol: 'cryETHUSD', name: 'ETH/USD (Ethereum)' },
        { symbol: 'cryXRPUSD', name: 'XRP/USD (Ripple)' }, { symbol: 'crySOLUSD', name: 'SOL/USD (Solana)' }
    ],
    commodities: [
        { symbol: 'frxXAUUSD', name: 'Spot Gold (XAU/USD)' }, { symbol: 'frxXAGUSD', name: 'Spot Silver (XAG/USD)' },
        { symbol: 'frxXBRUSD', name: 'Brent Crude Oil' }
    ]
};

const exchangeRates = { KES: 129.0, UGX: 3750.0, TZS: 2600.0, ETB: 120.5, EUR: 0.92, GBP: 0.79, JPY: 155.0 };

let remainingSeconds = 180;
function runCoreLoadingSequence() {
    const timerDisplay = document.getElementById('loading-timer-display');
    const progressBar = document.getElementById('core-progress-bar');
    const splashScreen = document.getElementById('splash-screen');

    const interval = setInterval(() => {
        remainingSeconds--;
        const mins = Math.floor(remainingSeconds / 60).toString().padStart(2, '0');
        const secs = (remainingSeconds % 60).toString().padStart(2, '0');
        if (timerDisplay) timerDisplay.innerText = `${mins}:${secs}`;
        if (progressBar) progressBar.style.width = `${((180 - remainingSeconds) / 180) * 100}%`;

        if (remainingSeconds <= 0) {
            clearInterval(interval);
            if (splashScreen) { splashScreen.style.opacity = '0'; setTimeout(() => splashScreen.remove(), 600); }
            initializeLiveTerminal();
        }
    }, 1000);
}

function updateAssetDropdown(category) {
    const assetSelector = document.getElementById('asset-selector');
    if (!assetSelector) return;
    assetSelector.innerHTML = '';
    (marketSymbols[category] || marketSymbols.volatility_1s).forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.symbol;
        opt.innerText = item.name;
        assetSelector.appendChild(opt);
    });
}

function setupCurrencyConverter() {
    const amtInput = document.getElementById('convert-amount');
    const curSelect = document.getElementById('target-currency');
    const outEl = document.getElementById('converted-output');
    function calc() {
        const val = (parseFloat(amtInput.value) || 0) * (exchangeRates[curSelect.value] || 1);
        outEl.innerText = `${val.toLocaleString(undefined, {minimumFractionDigits: 2})} ${curSelect.value}`;
    }
    if (amtInput && curSelect) { amtInput.addEventListener('input', calc); curSelect.addEventListener('change', calc); calc(); }
}

function switchAccountMode(mode) {
    const b1 = document.getElementById('btn-mode-demo'), b2 = document.getElementById('btn-mode-real');
    if (mode === 'demo') {
        b1.className = 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition';
        b2.className = 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    } else {
        b2.className = 'px-3 py-1 rounded-lg font-bold bg-emerald-600 text-white transition';
        b1.className = 'px-3 py-1 rounded-lg font-semibold text-slate-400 hover:text-white transition';
    }
}

function executeActionSignal(type) {
    triggerElhadartProfitAlert(`[${type} EXECUTION]`, 18.50);
}

function loginWithDeriv() {
    window.location.href = `https://oauth.deriv.com/oauth2/authorize?app_id=${PARTNER_APP_ID}&affiliate_token=${AFFILIATE_TOKEN}`;
}
function signupWithDeriv() {
    window.open(`https://hub.deriv.com/tradershub/signup?t=${AFFILIATE_TOKEN}`, '_blank');
}

// LIVE ANALYTICS WITH EXACT ASSET, CONTRACT, ENTRY & RUN PRESCRIPTIONS
let tickBuffer = [];
let digitCounts = [0,0,0,0,0,0,0,0,0,0];
let totalDigits = 0;

function computeTerminalAnalytics(tick) {
    tickBuffer.push(tick.quote);
    if (tickBuffer.length > 5000) tickBuffer.shift();

    document.getElementById('tick-buffer-count').innerText = `${tickBuffer.length} / 5000`;
    document.getElementById('live-quote-display').innerText = tick.quote.toFixed(4);

    // 1. Digit & Even/Odd Scanner
    const priceStr = tick.quote.toFixed(4);
    const lastDigit = parseInt(priceStr.slice(-1));
    digitCounts[lastDigit]++;
    totalDigits++;
    document.getElementById('last-digit-display').innerText = `Last Digit: ${lastDigit}`;

    for (let i = 0; i < 10; i++) {
        const pct = totalDigits > 0 ? ((digitCounts[i] / totalDigits) * 100).toFixed(1) : 0;
        document.getElementById(`freq-${i}`).innerText = `${pct}%`;
    }

    const evenCount = digitCounts[0] + digitCounts[2] + digitCounts[4] + digitCounts[6] + digitCounts[8];
    const evenPct = totalDigits > 0 ? ((evenCount / totalDigits) * 100).toFixed(1) : 50;

    let evenOddAdvice = evenPct > 54 ? `EVEN Dominant -> Execute SELL/ODD (5 Runs)` : evenPct < 46 ? `ODD Dominant -> Execute SELL/EVEN (5 Runs)` : `Balanced Spread -> Wait`;
    document.getElementById('even-odd-recommendation').innerText = `${evenPct}% Even vs ${100 - evenPct}% Odd`;
    document.getElementById('digit-action-advice').innerText = evenOddAdvice;

    if (tickBuffer.length < 30) return;

    // 2. 4 Core Indicators
    let gains = 0, losses = 0;
    for (let i = tickBuffer.length - 14; i < tickBuffer.length; i++) {
        const diff = tickBuffer[i] - tickBuffer[i - 1];
        if (diff >= 0) gains += diff; else losses -= diff;
    }
    const rs = (gains / 14) / ((losses / 14) || 1);
    const rsi = 100 - (100 / (1 + rs));
    document.getElementById('ind-rsi').innerText = `${rsi.toFixed(1)} (${rsi > 55 ? 'Bullish' : rsi < 45 ? 'Bearish' : 'Neutral'})`;

    const ema12 = tickBuffer.slice(-12).reduce((a, b) => a + b, 0) / 12;
    const ema26 = tickBuffer.slice(-26).reduce((a, b) => a + b, 0) / 26;
    const macdHist = ema12 - ema26;
    document.getElementById('ind-macd').innerText = `${macdHist > 0 ? '+' : ''}${macdHist.toFixed(4)}`;

    const recent = tickBuffer.slice(-14);
    const high = Math.max(...recent);
    const low = Math.min(...recent);
    const stochK = high === low ? 50 : ((tick.quote - low) / (high - low)) * 100;
    document.getElementById('ind-stoch').innerText = `${stochK.toFixed(1)}%`;

    const sma20 = tickBuffer.slice(-20).reduce((a, b) => a + b, 0) / 20;
    const variance = tickBuffer.slice(-20).reduce((sum, val) => sum + Math.pow(val - sma20, 2), 0) / 20;
    const stdev = Math.sqrt(variance);
    const upperBand = sma20 + (2 * stdev);
    const lowerBand = sma20 - (2 * stdev);
    
    let structureState = "Consolidation Range";
    if (tick.quote > upperBand) structureState = "BOS Bullish Breakout 🚀";
    else if (tick.quote < lowerBand) structureState = "BOS Bearish Breakdown 📉";
    document.getElementById('ind-bb').innerText = structureState;

    // 3. Prescriptions (Asset, Contract, Entry & Runs)
    const assetSelect = document.getElementById('asset-selector');
    const assetName = assetSelect && assetSelect.selectedOptions.length > 0 ? assetSelect.selectedOptions[0].innerText : 'Volatility 10 (1s)';

    const contractEl = document.getElementById('prescribed-contract');
    const entryEl = document.getElementById('prescribed-entry');
    const runsEl = document.getElementById('prescribed-runs');
    const assetPrescribed = document.getElementById('prescribed-asset');
    const scannerFeed = document.getElementById('pro-scanner-feed');

    assetPrescribed.innerText = assetName;
    entryEl.innerText = tick.quote.toFixed(4);

    if (rsi > 55 && macdHist > 0 && stochK > 50) {
        contractEl.innerText = "CALL (Rise)";
        runsEl.innerText = "Exit after 12 Candles / Runs";
    } else if (rsi < 45 && macdHist < 0 && stochK < 50) {
        contractEl.innerText = "PUT (Fall)";
        runsEl.innerText = "Exit after 12 Candles / Runs";
    } else {
        contractEl.innerText = "Standby (Awaiting Confluence)";
        runsEl.innerText = "0 Runs";
    }

    if (scannerFeed && Math.random() < 0.2) {
        const timestamp = new Date().toLocaleTimeString();
        const feedItem = document.createElement('div');
        feedItem.innerHTML = `<span class="text-slate-500">[${timestamp}]</span> <span class="text-fxgreen font-bold">SIGNAL: Trade ${assetName} | ${contractEl.innerText} @ ${tick.quote.toFixed(4)} | ${runsEl.innerText}</span>`;
        scannerFeed.prepend(feedItem);
        if (scannerFeed.children.length > 6) scannerFeed.removeChild(scannerFeed.lastChild);
    }
}

function updateKillzones() {
    const now = new Date();
    const eatTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    const hrs = eatTime.getUTCHours();
    const mins = eatTime.getUTCMinutes();
    const secs = eatTime.getUTCSeconds();

    const timerEl = document.getElementById('killzone-timer');
    if (timerEl) timerEl.innerText = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} EAT`;

    let sessionName = "24/7 Multimarket Session";
    let currencyBias = "Active Volatility Feed";

    if (hrs >= 10 && hrs < 15) { sessionName = "🔥 London Open Killzone"; currencyBias = "EUR/USD & Volatility High Expansion"; }
    else if (hrs >= 15 && hrs < 19) { sessionName = "⚡ London / New York Overlap"; currencyBias = "XAU/USD & Volatility 75 (1s) Spike Window"; }

    document.getElementById('active-session-name').innerText = sessionName;
    document.getElementById('active-currency-bias').innerText = currencyBias;
}

function initializeLiveTerminal() {
    updateAssetDropdown('volatility_1s');
    setupCurrencyConverter();

    const categorySelect = document.getElementById('market-category');
    if (categorySelect) {
        categorySelect.addEventListener('change', (e) => {
            updateAssetDropdown(e.target.value);
            const newAsset = document.getElementById('asset-selector').value;
            if (window.derivApiInstance) window.derivApiInstance.subscribeTicks(newAsset, handleTick);
        });
    }

    const derivApi = new DerivAPIConnector(PARTNER_APP_ID);
    window.derivApiInstance = derivApi;

    const assetSelector = document.getElementById('asset-selector');
    if (assetSelector) assetSelector.addEventListener('change', (e) => derivApi.subscribeTicks(e.target.value, handleTick));

    derivApi.connect().then(() => {
        const initialAsset = assetSelector ? assetSelector.value : '1HZ10V';
        derivApi.subscribeTicks(initialAsset, handleTick);
    }).catch(() => {
        setInterval(() => { handleTick({ quote: 6450.25 + (Math.random() * 2 - 1), symbol: '1HZ10V' }); }, 1000);
    });

    function handleTick(tick) {
        computeTerminalAnalytics(tick);
    }

    setInterval(updateKillzones, 1000);
}

window.addEventListener('DOMContentLoaded', () => { runCoreLoadingSequence(); });
