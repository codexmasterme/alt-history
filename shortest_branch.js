const fs = require('fs');
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
const storyNodes = window.storyNodes;
const mainNodes = Object.values(storyNodes).filter(n => n.isMain && n.id !== 'M01').map(n => n.id);

function findShortestBranchExplicit() {
    let queue = [];
    // Enqueue all branch entry points
    for (let node of Object.values(storyNodes)) {
        if (node.isMain) {
            for (let opt of node.options) {
                if (!opt.isHistorical && opt.next !== '__NEXT_MAIN__') {
                    queue.push({ id: opt.next, steps: 2, path: node.id + ' -> ' + opt.next });
                }
            }
        }
    }
    
    while (queue.length > 0) {
        let current = queue.shift();
        
        if (current.id.startsWith('E')) {
            return current;
        }
        
        if (current.steps > 20) continue;
        
        const node = storyNodes[current.id];
        if (!node) continue;
        
        for (let opt of node.options) {
            let nextId = opt.next;
            if (nextId === '__NEXT_MAIN__') continue;
            
            if (nextId && nextId.startsWith('__HUB_')) {
                let hubMatch = nextId.match(/__HUB_([a-z]+)_EXIT__/);
                if (hubMatch) {
                    nextId = `HUB_${hubMatch[1]}_A_1`;
                }
            }
            
            queue.push({ id: nextId, steps: current.steps + 1, path: current.path + ' -> ' + nextId });
        }
    }
    return null;
}

console.log(findShortestBranchExplicit());
