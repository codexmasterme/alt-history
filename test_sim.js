const fs = require('fs');
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const storyNodes = window.storyNodes;
const endings = window.endings;
const numTrials = 1000;
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
    return \HUB_\_\_1\;
}

function resolveCollapseExit(scores) {
    const traits = [
        { key: 'C', val: scores.C }, { key: 'F', val: scores.F },
        { key: 'R', val: scores.R }, { key: 'S', val: scores.S },
        { key: 'A', val: scores.A }, { key: 'P', val: scores.P }
    ].sort((a, b) => b.val - a.val);

    const primary = traits[0].key;
    if (primary === 'F') return 'E04';
    if (primary === 'C') return 'E03';
    if (primary === 'A' || primary === 'P') return 'E12';
    if (primary === 'S') return 'E08';
    return 'E02';
}

for (let t = 0; t < numTrials; t++) {
    const mainSequence = pickMainSequence();
    let mainIndex = 0;
    let currentNodeId = mainSequence[0];
    let scores = { C: 0, F: 0, R: 0, S: 0, A: 0, P: 0, I: 0, M: 0 };
    let actualSteps = 1;
    
    while (true) {
        if (currentNodeId && currentNodeId.startsWith('E')) {
            endingCounts[currentNodeId] = (endingCounts[currentNodeId] || 0) + 1;
            totalSteps += actualSteps;
            break;
        }
        const node = storyNodes[currentNodeId];
        if (!node) { console.error('not found', currentNodeId); break; }
        
        const option = node.options[Math.floor(Math.random() * node.options.length)];
        actualSteps++;
        
        if (option.scores) {
            for (let k in option.scores) scores[k] += option.scores[k];
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
        if (hubExitMatch) nextId = resolveHubExit(hubExitMatch[1], scores);

        if (actualSteps >= 7) {
            if (scores.C + scores.R >= 10) nextId = scores.R > scores.C ? 'E09' : 'E03';
            else if (scores.F + scores.S >= 10) nextId = 'E08';
        }
        if (nextId === 'E02') nextId = resolveCollapseExit(scores);
        
        if (nextId && nextId.startsWith('E') && actualSteps < 7) {
            mainIndex++;
            if (mainIndex >= mainSequence.length) nextId = 'E01';
            else nextId = mainSequence[mainIndex];
        }
        if (nextId === '__NEXT_MAIN__') {
           console.error('Hit NEXT MAIN unhandled'); break;
        }
        currentNodeId = nextId;
    }
}
console.log('done');
