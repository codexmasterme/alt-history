const fs = require('fs');
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const storyNodes = window.storyNodes;

// Get all main nodes
const mainNodes = Object.values(storyNodes).filter(n => n.isMain && n.id !== 'M01').map(n => n.id);

function findShortest() {
    let queue = [ { id: 'M01', steps: 1, scores: { C:0, F:0, R:0, S:0, A:0, P:0, I:0, M:0 }, path: 'M01' } ];
    
    // To avoid infinite loops and find absolute shortest, we just don't even need visited set if we only go down.
    // But let's use visited to be safe. We need to store state. Since scores matter for the new logic, visited state should include scores. 
    // For simplicity, we just bound steps to 20.
    
    while (queue.length > 0) {
        let current = queue.shift();
        
        if (current.id.startsWith('E')) {
            return current;
        }
        
        if (current.steps > 20) continue;
        
        const node = storyNodes[current.id];
        if (!node) continue;
        
        for (let opt of node.options) {
            let nextScores = { ...current.scores };
            if (opt.scores) {
                for (let k in opt.scores) {
                    nextScores[k] += opt.scores[k];
                }
            }
            
            let nextId = opt.next;
            
            if (nextScores.C + nextScores.R >= 10) {
                nextId = nextScores.R > nextScores.C ? 'E09' : 'E03';
            } else if (nextScores.F + nextScores.S >= 10) {
                nextId = 'E08';
            }
            
            if (nextId === 'E02') {
                nextId = 'E02_or_other';
            }
            
            if (nextId === '__NEXT_MAIN__') {
                // To find the shortest across ALL possible main sequences, 
                // we should enqueue ALL main nodes that we haven't visited in this path.
                // But honestly, the shortest branch is probably just one of the alt branches.
                for (let m of mainNodes) {
                    queue.push({ 
                        id: m, 
                        steps: current.steps + 1, 
                        scores: nextScores, 
                        path: current.path + ' -> ' + m 
                    });
                }
            } else if (nextId && nextId.startsWith('__HUB_')) {
                // Hub exits resolve to HUB_{key}_A_1, B_1, C_1. We can just pick A_1 for shortest path counting.
                let hubMatch = nextId.match(/__HUB_([a-z]+)_EXIT__/);
                if (hubMatch) {
                    nextId = `HUB_${hubMatch[1]}_A_1`;
                }
                queue.push({ id: nextId, steps: current.steps + 1, scores: nextScores, path: current.path + ' -> ' + nextId });
            } else if (nextId) {
                queue.push({ id: nextId, steps: current.steps + 1, scores: nextScores, path: current.path + ' -> ' + nextId });
            }
        }
    }
    return null;
}

console.log(findShortest());
