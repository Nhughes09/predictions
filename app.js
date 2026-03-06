// DOME COSMOLOGY - VANILLA JS FRONTEND

document.addEventListener('DOMContentLoaded', () => {
    // Inject master data into the hidden LD+JSON script tag for AI scrapers 
    const aiScriptNode = document.getElementById('dome-predictions-data');
    if (aiScriptNode) {
        const fullPayload = {
            metadata: { version: "V49.2", updated: new Date().toISOString() },
            master_predictions: PREDICTIONS,
            weekly_active_tests: WEEKLY_DATA
        };
        aiScriptNode.textContent = JSON.stringify(fullPayload, null, 2);
    }
    
    // Set the weekly label
    const weekLabel = document.getElementById('week-label');
    if(weekLabel && typeof WEEKLY_DATA !== 'undefined') {
        weekLabel.textContent = `${WEEKLY_DATA.week_start} to ${WEEKLY_DATA.week_end}`;
    }

    initScorecard();
    renderGrids();
    initNav();
});

function initScorecard() {
    const retrospective = PREDICTIONS.filter(p => p.status === 'confirmed').length;
    const falsified = PREDICTIONS.filter(p => p.status === 'falsified').length;
    const advance   = PREDICTIONS.filter(p => p.status === 'pending').length;
    const weeklyCount = typeof WEEKLY_DATA !== 'undefined' ? WEEKLY_DATA.predictions.length : 0;
    
    const html = `
        <div class="score-hud"><span>${retrospective}</span> WINS</div>
        <div class="score-hud" style="color:var(--accent-blue);"><span>${weeklyCount}</span> LIVE TESTS</div>
        <div class="score-hud"><span>${advance}</span> PENDING</div>
        <div class="score-hud" style="color:var(--status-falsified)"><span>${falsified}</span> FALSIFIED</div>
    `;
    
    document.getElementById('scorecard').innerHTML = html;
}

function createCardHTML(p, isWeekly = false) {
    let resultLine = '';
    if (p.status !== 'pending') {
        const isConfirmed = p.status === 'confirmed';
        const colorClass = isConfirmed ? 'color:#34d399;' : 'color:#ef4444;';
        resultLine = `
        <div class="data-matrix" style="border-top:none; padding-top:0; margin-top:-0.5rem;">
            <div class="data-row">
                <span class="data-label" style="${colorClass}">OBSERVED RESULT</span>
                <span class="data-value" style="${colorClass}">${p.result_value !== null ? p.result_value : ''} <span style="font-size:0.7rem; opacity:0.7">(${p.result_date ? p.result_date.split('T')[0] : ''})</span></span>
            </div>
        </div>`;
    }

    const testDateDisplay = isWeekly ? 'Live This Week' : (p.test_date ? p.test_date.split('T')[0] : 'Ongoing');

    return `
    <div class="glass-card">
        <div class="card-topbar">
            <span class="id-tag">${p.id}</span>
            <div class="status-indicator status-${p.status}">
                <div class="status-dot"></div>
                ${p.status}
            </div>
        </div>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-desc">${p.description}</p>
        
        <div class="data-matrix">
            <div class="data-row">
                <span class="data-label">TARGET WINDOW</span>
                <span class="data-value accent">${testDateDisplay}</span>
            </div>
            <div class="data-row">
                <span class="data-label">MODEL PREDICTION</span>
                <span class="data-value">${p.prediction.value !== null ? p.prediction.value : ''} <span style="font-size:0.8rem; color:var(--text-muted)">${p.prediction.unit || ''}</span></span>
            </div>
        </div>
        
        ${resultLine}
        
        <div class="card-mechanism">
            <div style="margin-bottom:0.25rem;"><strong style="color:var(--text-primary)">Mechanism:</strong> ${p.mechanism}</div>
            <div><strong style="color:var(--text-primary)">Verification Anchor:</strong> ${p.data_source || 'INTERMAGNET'}</div>
        </div>
            
        ${isWeekly ? `<button class="btn-verify btn-primary" style="margin-top:auto;" onclick="alert('Verification protocol connecting to: ${p.data_source}')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Verify Live Data
        </button>` : ''}
            
        <div class="sha-fingerprint">SHA-256: ${p.sha256}</div>
    </div>
    `;
}

function renderGrids() {
    const confirmedGrid = document.getElementById('confirmed-grid');
    const pendingGrid = document.getElementById('pending-grid');
    const weeklyGrid = document.getElementById('weekly-grid');

    // 1. Render the Long-Term arrays
    let confHTML = '', pendingHTML = '';
    PREDICTIONS.forEach(p => {
        const card = createCardHTML(p, false);
        if (p.status === 'confirmed') confHTML += card;
        if (p.status === 'pending') pendingHTML += card;
    });

    if (confirmedGrid) confirmedGrid.innerHTML = confHTML;
    if (pendingGrid) pendingGrid.innerHTML = pendingHTML;

    // 2. Render the new Weekly active tests
    let weekHTML = '';
    if (typeof WEEKLY_DATA !== 'undefined' && WEEKLY_DATA.predictions) {
        WEEKLY_DATA.predictions.forEach(p => {
            weekHTML += createCardHTML(p, true);
        });
    }
    
    if (weeklyGrid) weeklyGrid.innerHTML = weekHTML || '<p>No weekly data loaded.</p>';
}

function initNav() {
    const btns = document.querySelectorAll('.nav-pill');
    const sections = document.querySelectorAll('.view-section');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            btn.classList.add('active');
            const target = btn.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });
}
