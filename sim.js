const fs = require('fs');

const window = {};
const dataCode = fs.readFileSync('data.js', 'utf8');
eval(dataCode);
const storyNodes = window.storyNodes;
const endings = window.endings;

const mainNodes = Object.values(storyNodes).filter(n => n.isMain);

const numTrials = 1000000;
const endingCounts = {};
let totalSteps = 0;

function pickMainSequence() {
    const others = Object.values(storyNodes).filter(n => n.isMain && n.id !== 'M01');
    const arr = others.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const k = Math.min(19, arr.length);
    const picked = arr.slice(0, k);
    picked.sort((a, b) => a.chrono - b.chrono);
    return ['M01'].concat(picked.map(n => n.id));
}

function resolveHubExit(hubKey, s) {
    const profiles = {
        chu:   { A: s.R + s.A + s.M, B: s.S + s.P + s.I, C: s.F + s.I },
        san:   { A: s.F + s.S + s.I, B: s.P + s.M,       C: s.R + s.A },
        jiang: { A: s.F + s.S,       B: s.C + s.R,       C: s.F + s.A + s.M },
        xin:   { A: s.R + s.I,       B: s.A + s.M,       C: s.F + s.M },
        yuan:  { A: s.C + s.S,       B: s.F + s.A,       C: s.R + s.M },
        men:   { A: s.F + s.I,       B: s.S + s.M,       C: s.C + s.R },
    };
    const p = profiles[hubKey];
    if (!p) { return null; }
    const entries = [['A', p.A], ['B', p.B], ['C', p.C]];
    entries.sort((x, y) => y[1] - x[1]); 
    return `HUB_${hubKey}_${entries[0][0]}_1`;
}

function resolveCollapseExit(scores) {
    const s = scores;
    const traits = [
        { key: 'C', val: s.C }, { key: 'F', val: s.F },
        { key: 'R', val: s.R }, { key: 'S', val: s.S },
        { key: 'A', val: s.A }, { key: 'P', val: s.P }
    ].sort((a, b) => b.val - a.val);

    const primary = traits[0].key;
    
    if (primary === 'F') {
        return 'E04';
    } else if (primary === 'C') {
        return 'E03';
    } else if (primary === 'A' || primary === 'P') {
        return 'E12';
    } else if (primary === 'S') {
        return 'E08';
    } else {
        return 'E02'; 
    }
}

for (let t = 0; t < numTrials; t++) {
    const mainSequence = pickMainSequence();
    let mainIndex = 0;
    let currentNodeId = mainSequence[0];
    let scores = { C: 0, F: 0, R: 0, S: 0, A: 0, P: 0, I: 0, M: 0 };
    let actualSteps = 1;
    
    // Simulate until ending
    while (true) {
        if (currentNodeId.startsWith('E')) {
            endingCounts[currentNodeId] = (endingCounts[currentNodeId] || 0) + 1;
            totalSteps += actualSteps;
            break;
        }
        
        const node = storyNodes[currentNodeId];
        if (!node) break;
        
        const optIndex = Math.floor(Math.random() * node.options.length);
        const option = node.options[optIndex];
        actualSteps++;
        
        if (option.scores) {
            for (let k in option.scores) {
                scores[k] += option.scores[k];
            }
        }
        
        let nextId = option.next;
        
        if (node.isMain && option.isHistorical) {
            mainIndex++;
            if (mainIndex >= mainSequence.length) {
                endingCounts['E01'] = (endingCounts['E01'] || 0) + 1;
                totalSteps += actualSteps;
                break;
            }
            nextId = mainSequence[mainIndex];
        }
        
        const hubExitMatch = nextId && /^__HUB_([a-z]+)_EXIT__$/.exec(nextId);
        if (hubExitMatch) {
            const hubKey = hubExitMatch[1];
            nextId = resolveHubExit(hubKey, scores);
        }

        // NEW LOGIC
        if (actualSteps >= 7) {
            if (scores.C + scores.R >= 10) {
                nextId = scores.R > scores.C ? 'E09' : 'E03';
            } else if (scores.F + scores.S >= 10) {
                nextId = 'E08';
            }
        }
        
        if (nextId === 'E02') {
            nextId = resolveCollapseExit(scores);
        }
        
        // INTERCEPT SHORT ENDINGS
        if (nextId && nextId.startsWith('E') && actualSteps < 7) {
            mainIndex++;
            if (mainIndex >= mainSequence.length) {
                nextId = 'E01';
            } else {
                nextId = mainSequence[mainIndex];
            }
        }
        
        currentNodeId = nextId;
    }
}

console.log(`\n=== Probabilities After 7-Step Rule ===`);
const sortedEndings = Object.entries(endingCounts).sort((a, b) => b[1] - a[1]);
for (let [eId, count] of sortedEndings) {
    const p = (count / numTrials * 100).toFixed(4);
    const title = endings[eId] ? endings[eId].title : eId;
    console.log(`${eId} ${title}: ${p}%`);
}
console.log(`Average survival steps: ${(totalSteps / numTrials).toFixed(2)}`);
