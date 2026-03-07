// DOME COSMOLOGY - VANILLA JS FRONTEND

document.addEventListener('DOMContentLoaded', async () => {
    // Inject master data into the hidden LD+JSON script tag for AI scrapers 
    const aiScriptNode = document.getElementById('dome-predictions-data');
    if (aiScriptNode) {
        const fullPayload = {
            metadata: { version: "V49.2", updated: new Date().toISOString() },
            master_predictions: typeof PREDICTIONS !== 'undefined' ? PREDICTIONS : [],
            weekly_active_tests: typeof WEEKLY_DATA !== 'undefined' ? WEEKLY_DATA : {}
        };
        aiScriptNode.textContent = JSON.stringify(fullPayload, null, 2);
    }
    
    // Set the weekly label
    const weekLabel = document.getElementById('week-label');
    if(weekLabel && typeof WEEKLY_DATA !== 'undefined') {
        weekLabel.textContent = `${WEEKLY_DATA.week_start} to ${WEEKLY_DATA.week_end}`;
    }

    try {
        const resArgs = await fetch('api/current/results.json');
        if (resArgs.ok) {
            window.RAW_RESULTS = await resArgs.json();
        } else {
            console.warn("Could not load api/current/results.json, falling back to empty.");
            window.RAW_RESULTS = [];
        }
    } catch (e) {
        console.error("Fetch failed", e);
        window.RAW_RESULTS = [];
    }

    initScorecard(window.RAW_RESULTS);
    renderGrids(window.RAW_RESULTS);
    initNav();
});

function computeScorecard(results) {
  return {
    wins: results.filter(r => 
      ['confirmed', 
       'confirmed_marginal',
       'confirmed_strong',
       'overshoot_investigate']
      .includes(r.auto_verdict)).length,
      
    below_threshold: results.filter(r => 
      r.auto_verdict === 'below_detection_threshold'
      ).length,
      
    investigating: results.filter(r =>
      r.auto_verdict === 'overshoot_investigate'
      ).length,
      
    falsified: results.filter(r =>
      r.auto_verdict === 'falsified' &&
      r.counts_against_model === true
      ).length,
      
    pending: results.filter(r =>
      r.auto_verdict === 'pending'
      ).length
  }
}

function initScorecard(results) {
    if (!results || results.length === 0) {
        document.getElementById('scorecard').innerHTML = '<div class="score-hud">Loading...</div>';
        return;
    }

    const scores = computeScorecard(results);
    const pendingTotal = typeof PREDICTIONS !== 'undefined' ? PREDICTIONS.filter(p => p.status === 'pending').length : 0;
    const activeTestCount = typeof WEEKLY_DATA !== 'undefined' && WEEKLY_DATA.predictions ? WEEKLY_DATA.predictions.length : 0;
    
    // The user rules strictly states the wins, investigating, falsified must come exactly from the results array computations.
    const html = `
        <div class="score-hud"><span>${scores.wins}</span> WINS</div>
        <div class="score-hud" style="color:var(--accent-blue);"><span>${activeTestCount}</span> LIVE TESTS</div>
        <div class="score-hud"><span>${pendingTotal}</span> PENDING</div>
        <div class="score-hud" style="color:var(--status-falsified)"><span>${scores.falsified}</span> FALSIFIED</div>
    `;
    
    document.getElementById('scorecard').innerHTML = html;
}

function createCardHTML(p, resultMap, isWeekly = false) {
    let resultLine = '';
    const resNode = resultMap[p.id];
    
    let displayLabel = "PENDING";
    let statusClass = "pending";
    let colorStyle = "color:var(--text-muted);";
    
    if (resNode && resNode.auto_verdict) {
        displayLabel = resNode.display_label || resNode.auto_verdict.replace(/_/g, ' ').toUpperCase();
        statusClass = resNode.auto_verdict.replace(/_/g, '-');
        
        if(resNode.display_color === 'green' || resNode.display_color === 'bright green' || resNode.display_color === 'light green') {
            colorStyle = 'color:#34d399;';
        } else if (resNode.display_color === 'yellow') {
            colorStyle = 'color:#eab308;';
        } else if (resNode.display_color === 'red') {
            colorStyle = 'color:#ef4444;';
        } else if (resNode.display_color === 'teal') {
            colorStyle = 'color:#0ea5e9;';
        } else if (resNode.display_color === 'grey') {
            colorStyle = 'color:#9ca3af;';
        }

        const missingNote = resNode.auto_verdict === 'below_detection_threshold' ? 
            `<div style="font-size:0.85rem; color:#eab308; margin-top:0.25rem;">Signal below detection limit - prediction untestable at this sensitivity. Not a model failure.</div>` : '';
            
        const overshootNote = (resNode.overshoot_ratio && resNode.overshoot_ratio > 1.0 && resNode.direction_correct) ?
            `<div style="font-size:0.85rem; color:#34d399; margin-top:0.25rem;">Signal ${resNode.overshoot_ratio}x stronger than predicted - mechanism confirmed, magnitude being refined.</div>` : '';
            
        const sigmaText = resNode.sigma_distance !== undefined && resNode.sigma_distance > 0 ? 
            `<span style="margin-right: 0.75rem;">${resNode.sigma_distance}σ from prediction</span>` : '';
            
        const snrText = resNode.observed && resNode.observed.snr ? 
            `<span style="margin-right: 0.75rem;">SNR: ${resNode.observed.snr} (${resNode.snr_sufficient ? 'detectable' : 'sub-threshold'})</span>` : '';
            
        const dirText = resNode.direction_correct !== undefined ? 
            `<span>Direction: ${resNode.direction_correct ? '✓ Correct' : '✗ Wrong'}</span>` : '';

        resultLine = `
        <div class="data-matrix" style="border-top:none; padding-top:0; margin-top:-0.5rem;">
            <div class="data-row">
                <span class="data-label" style="${colorStyle}">OBSERVED RESULT</span>
                <span class="data-value" style="${colorStyle}">${resNode.observed && resNode.observed.value !== undefined ? resNode.observed.value : (p.result_value || resNode.observed?.peak_nT || '')}</span>
            </div>
            ${(sigmaText || snrText || dirText) ? `<div style="font-size: 0.8rem; color: var(--text-secondary); margin-top:0.25rem;">${sigmaText}${snrText}${dirText}</div>` : ''}
            ${missingNote}
            ${overshootNote}
        </div>`;
    } else if (p.status !== 'pending') {
        // Fallback for missing JSON results
        const isSuccessful = p.status === 'confirmed';
        colorStyle = isSuccessful ? 'color:#34d399;' : 'color:#ef4444;';
        displayLabel = p.status.toUpperCase();
        statusClass = p.status;
        resultLine = `
        <div class="data-matrix" style="border-top:none; padding-top:0; margin-top:-0.5rem;">
            <div class="data-row">
                <span class="data-label" style="${colorStyle}">OBSERVED RESULT</span>
                <span class="data-value" style="${colorStyle}">${p.result_value !== null ? p.result_value : ''}</span>
            </div>
        </div>`;
    }

    const testDateDisplay = isWeekly ? 'Live This Week' : (p.test_date ? p.test_date.split('T')[0] : 'Ongoing');

    return `
    <div class="glass-card">
        <div class="card-topbar">
            <span class="id-tag">${p.id}</span>
            <div class="status-indicator status-${statusClass}" style="${colorStyle}">
                <div class="status-dot" style="background:${colorStyle.split(':')[1].replace(';','')}"></div>
                ${displayLabel}
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
                <span class="data-value">${p.prediction && p.prediction.value !== null && p.prediction.value !== undefined ? p.prediction.value : ''} <span style="font-size:0.8rem; color:var(--text-muted)">${p.prediction ? (p.prediction.unit || '') : ''}</span></span>
            </div>
        </div>
        
        ${resultLine}
        
        <div class="card-mechanism" style="margin-bottom: 0.5rem;">
            <div style="margin-bottom:0.25rem;"><strong style="color:var(--text-primary)">Mechanism:</strong> ${p.mechanism || 'Empirical Validation'}</div>
            <div><strong style="color:var(--text-primary)">Verification Anchor:</strong> ${p.data_source || 'INTERMAGNET'}</div>
        </div>

        ${resNode && resNode.mainstream_comparison ? `
        <div class="glass-card" style="background: rgba(0,0,0,0.3); padding: 1rem; border: 1px dashed var(--border-subtle); margin-bottom: 1rem;">
            <div style="font-size: 0.75rem; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">MAINSTREAM COMPARISON</div>
            <div style="font-size: 0.9rem; margin-bottom: 0.25rem;"><strong style="color:var(--text-primary)">Expected:</strong> ${resNode.mainstream_comparison.mainstream_expected || 'N/A'}</div>
            <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; border-left: 2px solid var(--accent-sky); padding-left: 0.75rem;">${resNode.mainstream_comparison.context}</div>
        </div>
        ` : ''}
            
        ${isWeekly ? `<a href="proofs/weekly_predictions_${typeof WEEKLY_DATA !== 'undefined' ? WEEKLY_DATA.week_start : ''}.json.ots" download class="btn-verify btn-primary" style="margin-top:auto;" data-proof-type="opentimestamps" data-sha256="${p.sha256}" title="Download Bitcoin blockchain anchor proof">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            GET CRYPTOGRAPHIC PROOF (.OTS)
        </a>` : ''}
            
        <div class="sha-fingerprint">SHA-256: ${p.sha256}</div>
    </div>
    `;
}

function renderGrids(results) {
    const confirmedGrid = document.getElementById('confirmed-grid');
    const pendingGrid = document.getElementById('pending-grid');
    const weeklyGrid = document.getElementById('weekly-grid');

    const resultMap = {};
    if(results) {
        results.forEach(r => resultMap[r.id] = r);
    }

    // 1. Render the Long-Term arrays
    let confHTML = '', pendingHTML = '';
    if (typeof PREDICTIONS !== 'undefined') {
        PREDICTIONS.forEach(p => {
            const resNode = resultMap[p.id];
            const isConfirmed = resNode ? ['confirmed', 'confirmed_marginal', 'confirmed_strong', 'overshoot_investigate'].includes(resNode.auto_verdict) : p.status === 'confirmed';
            
            const card = createCardHTML(p, resultMap, false);
            if (isConfirmed) confHTML += card;
            else if (p.status === 'pending' && !resNode) pendingHTML += card;
        });
    }

    if (confirmedGrid) confirmedGrid.innerHTML = confHTML;
    if (pendingGrid) pendingGrid.innerHTML = pendingHTML;

    // 2. Render the new Weekly active tests
    let weekHTML = '';
    if (typeof WEEKLY_DATA !== 'undefined' && WEEKLY_DATA.predictions) {
        WEEKLY_DATA.predictions.forEach(p => {
            weekHTML += createCardHTML(p, resultMap, true);
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
            if (document.getElementById(target)) {
                document.getElementById(target).classList.add('active');
            }
        });
    });
}
