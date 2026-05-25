// --- STATE MANAGEMENT ---
let selectedAmount = 0;
let generatedTxnId = '';

// --- HARDWARE ADDRESSES ---
const RENDER_BACKEND_URL = 'https://ea-licence-server.onrender.com';
// --- EMAILJS DIRECT STRIKE ---
emailjs.init("eiP0k7E8cnDe9j4ss"); // REPLACE WITH YOUR PUBLIC KEY
const EJS_SERVICE = "service_7rk8nxc"; // REPLACE WITH YOUR SERVICE ID
const EJS_TEMPLATE = "template_q1z10i7"; // REPLACE WITH YOUR INITIAL PAYMENT TEMPLATE ID

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
const leadName = document.getElementById('lead-name');
const leadPhone = document.getElementById('lead-phone');
const leadEmail = document.getElementById('lead-email');

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
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 16; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    generatedTxnId = result;
    txnIdField.value = generatedTxnId;
}

// --- MANUAL M-PESA TRIGGER ---
triggerMpesaBtn.addEventListener('click', () => {
    // 1. Lead Data Extraction & Gatekeeper
    const name = leadName.value.trim();
    const email = leadEmail.value.trim();
    const phoneLead = leadPhone.value.trim();

    if (!name || name.length < 2) {
        alert("ERR: Full name is required.");
        leadName.focus();
        return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
        alert("ERR: Valid email address is required.");
        leadEmail.focus();
        return;
    }

    if (!phoneLead || phoneLead.length < 10) {
        alert("ERR: Valid phone number is required.");
        leadPhone.focus();
        return;
    }

    // 2. Payment Specific Validation
    const phone = document.getElementById('mpesa-phone').value;
    const statusBox = document.getElementById('mpesa-status');
    
    if (!phone || phone.length < 10) {
        statusBox.classList.remove('hidden');
        statusBox.innerHTML = "ERR: Invalid M-Pesa phone number format.";
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

    const mpesaCode = prompt("Enter the M-Pesa Confirmation Code sent to your phone (e.g., SHK4Y5X7GZ):");

    if (!mpesaCode || mpesaCode.length < 8) {
        statusBox.classList.remove('hidden');
        statusBox.innerHTML = "ERR: Invalid or empty M-Pesa code.";
        statusBox.style.borderColor = 'var(--danger)';
        statusBox.style.color = 'var(--danger)';
        return;
    }

    // 3. Execution
    statusBox.classList.remove('hidden');
    statusBox.innerHTML = "PROCESSING: Logging settlement data...";
    statusBox.style.borderColor = 'var(--accent-cyan)';
    statusBox.style.color = 'var(--accent-cyan)';

    fetch(`${RENDER_BACKEND_URL}/verify_mpesa`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            internal_txn_id: generatedTxnId,
            mpesa_code: mpesaCode,
            lead_name: name,
            lead_email: email,
            lead_phone: phoneLead,
            amount: selectedAmount
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'logged') {
            triggerMpesaBtn.disabled = true;
            triggerMpesaBtn.innerText = 'SUBMITTED';
            document.getElementById('mpesa-phone').disabled = true;
            leadName.disabled = true;
            leadPhone.disabled = true;
            leadEmail.disabled = true;
            statusBox.innerHTML = "SUBMITTED: Code logged. Reconciling with M-Pesa ledger. Activation pending.";
            statusBox.style.borderColor = 'var(--accent-gold)';
            statusBox.style.color = 'var(--accent-gold)';
        } else {
            statusBox.innerHTML = `ERR: ${data.message}`;
            statusBox.style.borderColor = 'var(--danger)';
            statusBox.style.color = 'var(--danger)';
        }
    })
    .catch(error => {
        console.error('M-Pesa Log Error:', error);
        statusBox.innerHTML = "NETWORK ERR: Cannot reach settlement processor.";
        statusBox.style.borderColor = 'var(--danger)';
        statusBox.style.color = 'var(--danger)';
    });
});
// --- FIRE EMAILJS ON MPESA ---
    emailjs.send(EJS_SERVICE, EJS_TEMPLATE, {
        txn_id: generatedTxnId,
        mpesa_code: mpesaCode,
        name: name,
        email: email,
        phone: phoneLead,
        amount: `$${selectedAmount}.00`
    }).then(function(response) {
        console.log("EMAILJS SUCCESS", response.status, response.text);
    }, function(error) {
        console.log("EMAILJS FAILED", error);
    });
// --- MANUAL CRYPTO VERIFICATION TRIGGER ---
triggerCryptoBtn.addEventListener('click', () => {
    // 1. Lead Data Extraction & Gatekeeper
    const name = leadName.value.trim();
    const email = leadEmail.value.trim();
    const phoneLead = leadPhone.value.trim();

    if (!name || name.length < 2) {
        alert("ERR: Full name is required.");
        leadName.focus();
        return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
        alert("ERR: Valid email address is required.");
        leadEmail.focus();
        return;
    }

    if (!phoneLead || phoneLead.length < 10) {
        alert("ERR: Valid phone number is required.");
        leadPhone.focus();
        return;
    }

    // 2. Payment Specific Validation
    const txid = document.getElementById('crypto-txid').value;
    
    if (!txid || txid.length < 20) {
        alert("ERR: Invalid TXID provided.");
        return;
    }

    if (selectedAmount === 0) {
        alert("ERR: No pricing tier selected.");
        return;
    }

    // 3. Execution
    fetch(`${RENDER_BACKEND_URL}/verify_crypto`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            internal_txn_id: generatedTxnId,
            blockchain_txid: txid,
            lead_name: name,
            lead_email: email,
            lead_phone: phoneLead,
            amount: selectedAmount
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'logged') {
            triggerCryptoBtn.disabled = true;
            triggerCryptoBtn.style.opacity = '0.5';
            triggerCryptoBtn.innerText = 'SUBMITTED';
            document.getElementById('crypto-txid').disabled = true;
            leadName.disabled = true;
            leadPhone.disabled = true;
            leadEmail.disabled = true;
            
            alert(`VERIFICATION PENDING: Transaction ID ${generatedTxnId} logged. Manual on-chain reconciliation required. Activation may take up to 1 hour.`);
        } else {
            alert(`ERR: ${data.message}`);
        }
    })
    .catch(error => {
        console.error('Crypto Log Error:', error);
        alert("NETWORK ERR: Failed to reach verification node.");
    });
});

// --- FIRE EMAILJS ON CRYPTO ---
    emailjs.send(EJS_SERVICE, EJS_TEMPLATE, {
        txn_id: generatedTxnId,
        mpesa_code: txid, // Re-using template variable for TXID
        name: name,
        email: email,
        phone: phoneLead,
        amount: `$${selectedAmount}.00`
    }).then(function(response) {
        console.log("EMAILJS SUCCESS", response.status, response.text);
    }, function(error) {
        console.log("EMAILJS FAILED", error);
    });

// --- CARD GATEWAY TOGGLE & INSTITUTIONAL BLOCK ---
const showCardBtn = document.getElementById('show-card');
const cardUi = document.getElementById('card-ui');
const triggerCardBtn = document.getElementById('trigger-card');
const cardNumberInput = document.getElementById('card-number');

showCardBtn.addEventListener('click', () => {
    cardUi.classList.remove('hidden');
    mpesaUi.classList.add('hidden');
    cryptoUi.classList.add('hidden');
    showCardBtn.classList.add('active');
    showMpesaBtn.classList.remove('active');
    showCryptoBtn.classList.remove('active');
});

// Basic UI formatting for card number spaces
cardNumberInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g);
    e.target.value = formattedValue ? formattedValue.join(' ') : '';
});

// THE BLOCKOUT EXECUTION
triggerCardBtn.addEventListener('click', () => {
    if (selectedAmount === 0) {
        alert("ERR: No pricing tier selected.");
        return;
    }

    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) existingModal.remove();

    const modalHtml = `
        <div class="modal-overlay" id="blockModal">
            <div class="modal-box">
                <h3>// ACCESS PROTOCOL VIOLATION</h3>
                <p>
                    Direct card processing is currently restricted to KYC-verified institutional nodes. 
                    To bypass this restriction and execute via Corporate Wire, or to utilize our 
                    available Crypto/M-Pesa tunnels, contact infrastructure support.
                </p>
                <button class="modal-close-btn" onclick="document.getElementById('blockModal').remove()">ACKNOWLEDGE</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
});
