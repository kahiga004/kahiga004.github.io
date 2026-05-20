// --- STATE MANAGEMENT ---
let selectedAmount = 0;
let generatedTxnId = '';

// --- HARDWARE ADDRESSES ---
const RENDER_BACKEND_URL = 'https://ea-licence-server.onrender.com';

// --- DOM ELEMENTS ---
const canvas = document.getElementById('terminalCanvas');
const ctx = canvas.getContext('2d');
const checkoutDisplay = document.getElementById('checkout-amount-display');
const mpesaUi = document.getElementById('mpesa-ui');
const cryptoUi = document.getElementById('crypto-ui');
const showMpesaBtn = document.getElementById('show-mpesa');
const showCryptoBtn = document.getElementById('show-crypto');
const triggerMpesaBtn = document.getElementById('trigger-mpesa');
const triggerCryptoBtn = document.getElementById('trigger-crypto');
const txnIdField = document.getElementById('txn-id');

// --- CANVAS TERMINAL ANIMATION (PSYCHOLOGICAL OVERLOAD TACTIC) ---
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const fakeData = [
    'GRID_EXEC: BUY 0.05 EURUSD @ 1.08412 | SL: 1.08360 | TP: 1.08512',
    'RISK_MGMT: Drawdown at 4.2%. Grid spacing widening to 15 pips.',
    'NODE_SYNC: Latency 14ms. Broker connection stable.',
    'GRID_EXEC: SELL 0.08 GBPUSD @ 1.26340 | SL: 1.26400 | TP: 1.26240',
    'ALERT: Max concurrent trades reached (4). Holding position.',
    'EQUITY_CURVE: Daily ROI +0.34%. Projected monthly: 8.2%',
    'GRID_EXEC: BUY 0.13 EURUSD @ 1.08380 | Averaging Down Tier 2',
    'DATA_PARSE: Scanning H1 support/resistance matrices...',
    'SYS_LOG: RAM usage 12MB. CPU cycles optimized.',
    'GRID_EXEC: CLOSE SELL 0.08 GBPUSD @ 1.26290 | PROFIT: +$8.40',
    'RISK_MGMT: Martingale exposure neutralized. Reset to base lot.',
    'NODE_AUTH: HWID hash verified. License valid for 89 days.'
];

let lines = [];
let fontSize = 14;
ctx.font = `${fontSize}px "Roboto Mono", "Courier New", monospace`;

function initLines() {
    const numLines = Math.floor(canvas.height / (fontSize * 1.5));
    lines = [];
    for (let i = 0; i < numLines; i++) {
        lines.push({
            text: fakeData[Math.floor(Math.random() * fakeData.length)],
            y: i * (fontSize * 1.5)
        });
    }
}
initLines();

function drawTerminal() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff0080'; 
    ctx.font = `${fontSize}px "Roboto Mono", "Courier New", monospace`;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        ctx.fillText(line.text, 20, line.y);
        line.y -= 0.5; 

        if (line.y < -fontSize) {
            line.y = canvas.height + fontSize;
            line.text = fakeData[Math.floor(Math.random() * fakeData.length)];
        }
    }
    requestAnimationFrame(drawTerminal);
}
drawTerminal();

// --- PRICING SELECTION LOGIC ---
const pricingCards = document.querySelectorAll('.pricing-card');

pricingCards.forEach(card => {
    card.addEventListener('click', () => {
        pricingCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        
        selectedAmount = parseInt(card.getAttribute('data-amount'));
        checkoutDisplay.textContent = `$${selectedAmount}.00`;
        
        generateTxnId();
        
        document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
    });
});

// --- GATEWAY TOGGLE LOGIC ---
showMpesaBtn.addEventListener('click', () => {
    mpesaUi.classList.remove('hidden');
    cryptoUi.classList.add('hidden');
    document.getElementById('card-ui').classList.add('hidden');
    showMpesaBtn.classList.add('active');
    showCryptoBtn.classList.remove('active');
    document.getElementById('show-card').classList.remove('active');
});

showCryptoBtn.addEventListener('click', () => {
    cryptoUi.classList.remove('hidden');
    mpesaUi.classList.add('hidden');
    document.getElementById('card-ui').classList.add('hidden');
    showCryptoBtn.classList.add('active');
    showMpesaBtn.classList.remove('active');
    document.getElementById('show-card').classList.remove('active');
});

// --- UTILITY: RANDOM ALPHANUMERIC GENERATOR ---
function generateTxnId() {
    const chars
