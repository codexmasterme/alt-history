const fs = require('fs');
let code = fs.readFileSync('main.js', 'utf8');

// 1. Add state snapshot in handleOptionClick
code = code.replace(
    '    handleOptionClick(option) {\n        this.actualSteps++;',
        handleOptionClick(option) {\n        // 记录时空快照\n        this.history.push({\n            currentNodeId: this.currentNodeId,\n            scores: { ...this.scores },\n            actualSteps: this.actualSteps,\n            mainIndex: this.mainIndex,\n            lastDominantTraits: [...this.lastDominantTraits],\n            comboCount: this.comboCount\n        });\n\n        this.actualSteps++;
);

// 2. Add Combo logic inside handleOptionClick where scores are accumulated
const score_original =         if (option.scores) {
            for (let k in option.scores) {
                this.scores[k] += option.scores[k];
            }
        };
const score_replacement =         if (option.scores) {
            let maxScore = 0;
            for (let k in option.scores) {
                this.scores[k] += option.scores[k];
                if (option.scores[k] > maxScore) maxScore = option.scores[k];
            }
            // 连击判定
            if (maxScore > 0) {
                let currentTraits = Object.keys(option.scores).filter(k => option.scores[k] === maxScore).sort();
                if (this.lastDominantTraits.length > 0 && 
                    currentTraits.length === this.lastDominantTraits.length && 
                    currentTraits.every((v, i) => v === this.lastDominantTraits[i])) {
                    this.comboCount++;
                    if (this.comboCount >= 2) {
                        this.showComboToast(currentTraits, this.comboCount);
                    }
                } else {
                    this.comboCount = 1;
                }
                this.lastDominantTraits = currentTraits;
            } else {
                this.comboCount = 0;
                this.lastDominantTraits = [];
            }
        };
code = code.replace(score_original, score_replacement);

// 3. Add Rewind button logic in bindEvents
const bind_original = document.getElementById('restart-btn').addEventListener('click', () => {;
const bind_replacement = document.getElementById('rewind-btn').addEventListener('click', () => {
            this.rewindToLastBranch();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {;
code = code.replace(bind_original, bind_replacement);

// 4. Show rewind button in showEnding for non-good endings
const ending_original =         document.getElementById('ending-screen').classList.remove('hidden');;
const ending_replacement =         document.getElementById('ending-screen').classList.remove('hidden');
        
        // 判定是否展示时光折跃按钮（非完美通关可回退）
        const rewindBtn = document.getElementById('rewind-btn');
        if (this.history && this.history.length > 0 && !['E01', 'E11', 'E13'].includes(endingId)) {
            rewindBtn.classList.remove('hidden');
        } else {
            rewindBtn.classList.add('hidden');
        };
code = code.replace(ending_original, ending_replacement);

// 5. Clear history on restart
const restart_original = 	his.scores = {;
const restart_replacement = 	his.history = [];
            this.lastDominantTraits = [];
            this.comboCount = 0;
            this.scores = {;
code = code.replace(restart_original, restart_replacement);

// 6. Add showComboToast and rewindToLastBranch before renderNode
const methods = 
    showComboToast(traits, count) {
        const comboNames = {
            'C,R': '法家酷吏',
            'F,S': '世家大族',
            'C,S': '稳健皇权',
            'F,R': '激进分封',
            'A': '铁血强汉',
            'P': '和亲退让',
            'I': '阴谋诡道',
            'M': '堂堂正正'
        };
        const key = traits.join(',');
        const name = comboNames[key] || '信念坚定';
        
        const toast = document.getElementById('combo-toast');
        if (!toast) return;
        
        document.getElementById('combo-desc').textContent = \【\】\;
        document.getElementById('combo-multiplier').textContent = \x\\;
        
        toast.classList.remove('hidden');
        toast.classList.remove('show');
        void toast.offsetWidth; // trigger reflow
        toast.classList.add('show');
        
        // Clear previous timeout if any
        if (this.comboTimeout) clearTimeout(this.comboTimeout);
        if (this.comboHideTimeout) clearTimeout(this.comboHideTimeout);
        
        this.comboTimeout = setTimeout(() => {
            toast.classList.remove('show');
            this.comboHideTimeout = setTimeout(() => toast.classList.add('hidden'), 300);
        }, 2000);
    }

    rewindToLastBranch() {
        if (!this.history || this.history.length === 0) return;
        
        let targetState = null;
        // 倒序寻找最近的一个“史实主线分支处”或“枢纽节点”
        for (let i = this.history.length - 1; i >= 0; i--) {
            const state = this.history[i];
            const node = window.storyNodes[state.currentNodeId];
            if (node && node.isMain) {
                targetState = state;
                this.history = this.history.slice(0, i);
                break;
            } else if (state.currentNodeId.startsWith('HUB_') || state.currentNodeId.startsWith('M')) {
                targetState = state;
                this.history = this.history.slice(0, i);
                break;
            }
        }
        
        // 如果实在没找到，就回到历史第一步
        if (!targetState) {
            targetState = this.history[0];
            this.history = [];
        }

        // 恢复状态
        this.scores = targetState.scores;
        this.currentNodeId = targetState.currentNodeId;
        this.actualSteps = targetState.actualSteps;
        this.mainIndex = targetState.mainIndex;
        this.lastDominantTraits = targetState.lastDominantTraits;
        this.comboCount = targetState.comboCount;
        
        // 隐藏结局界面并重新渲染当前节点
        document.getElementById('ending-screen').classList.add('hidden');
        this.renderNode(this.currentNodeId);
    }

    renderNode(nodeId) {;
code = code.replace("    renderNode(nodeId) {", methods);

fs.writeFileSync('main.js', code, 'utf8');
console.log('patched');
