// --- STATE MANAGEMENT ---
let selectedAmount = 0;
let generatedTxnId = '';

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
    // Semi-transparent black to create fading trail effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff0080'; // Faded green
    ctx.font = `${fontSize}px "Roboto Mono", "Courier New", monospace`;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        ctx.fillText(line.text, 20, line.y);
        line.y -= 0.5; // Slow scroll up

        // Reset line if it goes off screen
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
        // Remove selected state from all cards
        pricingCards.forEach(c => c.classList.remove('selected'));
        // Add selected state to clicked card
        card.classList.add('selected');
        
        // Extract amount and update UI
        selectedAmount = parseInt(card.getAttribute('data-amount'));
        checkoutDisplay.textContent = `$${selectedAmount}.00`;
        
        // Generate a new crypto transaction ID whenever a tier is selected
        generateTxnId();
        
        // Smooth scroll to checkout
        document.getElementById('checkout').scrollIntoView({ behavior: 'smooth' });
    });
});

// --- GATEWAY TOGGLE LOGIC ---
showMpesaBtn.addEventListener('click', () => {
    mpesaUi.classList.remove('hidden');
    cryptoUi.classList.add('hidden');
    showMpesaBtn.classList.add('active');
    showCryptoBtn.classList.remove('active');
});

showCryptoBtn.addEventListener('click', () => {
    cryptoUi.classList.remove('hidden');
    mpesaUi.classList.add('hidden');
    showCryptoBtn.classList.add('active');
    showMpesaBtn.classList.remove('active');
});

// --- UTILITY: RANDOM ALPHANUMERIC GENERATOR ---
function generateTxnId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    generatedTxnId = result;
    txnIdField.value = generatedTxnId;
}

// --- M-PESA TRIGGER (Awaiting Part 2 Integration) ---
triggerMpesaBtn.addEventListener('click', () => {
    const phone = document.getElementById('mpesa-phone').value;
    const statusBox = document.getElementById('mpesa-status');
    
    if (!phone || phone.length < 10) {
        statusBox.classList.remove('hidden');
        statusBox.innerHTML = "ERR: Invalid phone number format.";
        statusBox.style.borderColor = 'var(--danger)';
        statusBox.style.color = 'var(--danger)';
        return;
    }

    if (selectedAmount === 0) {
        statusBox.classList.remove('hidden');
        statusBox.innerHTML = "ERR: No pricing tier selected.";
        statusBox.style.borderColor = 'var(--danger)';
        statusBox.style.color = 'var(--danger)';
        return;
    }

    statusBox.classList.remove('hidden');
    statusBox.innerHTML = "PROCESSING: Sending STK Push to device...";
    statusBox.style.borderColor = 'var(--accent-cyan)';
    statusBox.style.color = 'var(--accent-cyan)';

    /* 
    ---------------------------------------------------------
    PLACEHOLDER INTERCEPT FOR PART 2
    The actual fetch() call to your Render backend will be 
    injected here in Part 2 of this build.
    ---------------------------------------------------------
    */
});

// --- CRYPTO MANUAL VERIFICATION TRIGGER (Awaiting Part 3 Integration) ---
triggerCryptoBtn.addEventListener('click', () => {
    const txid = document.getElementById('crypto-txid').value;
    
    if (!txid || txid.length < 20) {
        alert("ERR: Invalid TXID provided.");
        return;
    }

    if (selectedAmount === 0) {
        alert("ERR: No pricing tier selected.");
        return;
    }

    /* 
    ---------------------------------------------------------
    PLACEHOLDER INTERCEPT FOR PART 3
    The fetch() call to the /verify_crypto endpoint will be 
    injected here in Part 3.
    ---------------------------------------------------------
    */
    console.log(`Crypto Verification Initiated. Internal TXN ID: ${generatedTxnId} | Blockchain TXID: ${txid}`);
    alert("Verification request sent to server. Manual approval pending.");
});
