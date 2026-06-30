const fs = require('fs');

const window = {};
const dataCode = fs.readFileSync('data.js', 'utf8');
eval(dataCode);
const storyNodes = window.storyNodes;

// BFS from M01 to find shortest path to an ending without the new logic
function findShortestPathOld() {
    let queue = [ { id: 'M01', steps: 1 } ];
    let visited = new Set();
    
    while (queue.length > 0) {
        let current = queue.shift();
        
        if (current.id.startsWith('E')) {
            return current;
        }
        
        const node = storyNodes[current.id];
        if (!node) continue;
        
        for (let opt of node.options) {
            let nextId = opt.next;
            if (nextId === '__NEXT_MAIN__') continue;
            if (nextId && nextId.startsWith('__HUB_')) {
                // assume hub routes to HUB_chu_A_1 which is 1 extra step
                let hubKey = nextId.match(/__HUB_([a-z]+)_EXIT__/)[1];
                nextId = HUB__A_1;
            }
            
            queue.push({ id: nextId, steps: current.steps + 1, path: current.path ? current.path + ' -> ' + nextId : current.id + ' -> ' + nextId });
        }
    }
    return null;
}

console.log(findShortestPathOld());
