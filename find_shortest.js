const fs = require('fs');

const window = {};
const dataCode = fs.readFileSync('data.js', 'utf8');
eval(dataCode);
const storyNodes = window.storyNodes;

// BFS from M01 to find shortest path to an ending
function findShortestPath() {
    let queue = [ { id: 'M01', steps: 1, scores: { C:0, F:0, R:0, S:0, A:0, P:0, I:0, M:0 } } ];
    let visited = new Set();
    
    while (queue.length > 0) {
        let current = queue.shift();
        
        if (current.id.startsWith('E')) {
            return current;
        }
        
        // This is a naive BFS that might not cover all main sequence variations,
        // but for shortest path, taking a non-historical branch early is probably shortest.
        
        const node = storyNodes[current.id];
        if (!node) continue;
        
        for (let opt of node.options) {
            let nextId = opt.next;
            let nextScores = { ...current.scores };
            
            if (opt.scores) {
                for (let k in opt.scores) {
                    nextScores[k] += opt.scores[k];
                }
            }
            
            // Apply new logic
            if (nextScores.C + nextScores.R >= 10) {
                nextId = nextScores.R > nextScores.C ? 'E09' : 'E03';
            } else if (nextScores.F + nextScores.S >= 10) {
                nextId = 'E08';
            }
            
            if (nextId === 'E02') {
                // It routes to some ending, but it IS an ending
                nextId = 'E02_or_fallback';
            }
            
            if (nextId === '__NEXT_MAIN__') {
                // just pick a dummy next main if we are looking for shortest branch.
                // But typically to get the shortest path we want to break out of main line.
                continue; // skip historical paths for shortest ending
            }
            
            // we don't handle HUB exit here fully, but hub exits go to HUB_xxx_1 which is not an ending immediately.
            if (nextId && nextId.startsWith('__HUB_')) {
                nextId = 'HUB_dummy'; // it will just add steps
            }
            
            queue.push({ id: nextId, steps: current.steps + 1, scores: nextScores, path: current.path ? current.path + ' -> ' + nextId : current.id + ' -> ' + nextId });
        }
    }
    return null;
}

const shortest = findShortestPath();
console.log(shortest);
