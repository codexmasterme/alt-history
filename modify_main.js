const fs = require('fs');
const filepath = 'c:\\Users\\Administrator\\Desktop\\青史另说\\0630\\althistory\\alt-history\\main.js';
let content = fs.readFileSync(filepath, 'utf8');

const injection1 =         // 1. 全局极值检测（打破时间锁）
        // 只要分数极度偏科，随时随地暴雷
        if (this.scores.C + this.scores.R >= 7) {
            nextId = this.scores.R > this.scores.C ? 'E09' : 'E03';
        } else if (this.scores.F + this.scores.S >= 7) {
            nextId = 'E08';
        }

        // 2. E02 兜底结局分流矩阵
        // 如果下一步是 E02（西楚短世），不再无脑进入，而是根据当前属性倾向分摊
        if (nextId === 'E02') {
            nextId = this.resolveCollapseExit();
        }
;

const injection2 =     /**
     * E02 兜底分流函数
     * 根据玩家属性偏好，将失败结局分配给不同的\"坏结局\"，稀释 E02 的权重
     */
    resolveCollapseExit() {
        const s = this.scores;
        // 找到最高的两项属性
        const traits = [
            { key: 'C', val: s.C }, { key: 'F', val: s.F },
            { key: 'R', val: s.R }, { key: 'S', val: s.S },
            { key: 'A', val: s.A }, { key: 'P', val: s.P }
        ].sort((a, b) => b.val - a.val);

        const primary = traits[0].key;
        
        // 分流逻辑：
        if (primary === 'F') {
            return 'E04'; // 列国并立
        } else if (primary === 'C') {
            return 'E03'; // 秦制重演
        } else if (primary === 'A' || primary === 'P') {
            return 'E12'; // 草原反噬
        } else if (primary === 'S') {
            return 'E08'; // 豪强共和
        } else {
            return 'E02'; // 基础兜底
        }
    }
    
;

// Insert injection 2 before resolveHubExit
content = content.replace('    resolveHubExit(hubKey) {', injection2 + '    resolveHubExit(hubKey) {');

// Insert injection 1 into handleOptionClick, just before 'this.currentNodeId = nextId;'
content = content.replace('        this.currentNodeId = nextId;', injection1 + '\\n        this.currentNodeId = nextId;');

fs.writeFileSync(filepath, content, 'utf8');
