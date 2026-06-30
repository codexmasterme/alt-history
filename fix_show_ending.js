const fs = require('fs');
let content = fs.readFileSync('main.js', 'utf8');

const replacement = `    showEnding(endingId) {
        const ending = window.endings[endingId];
        if (!ending) return;
        
        this.saveEnding(endingId);
        
        // 1. 基本文本更新
        const titleEl = document.getElementById('ending-title');
        const descEl = document.getElementById('ending-desc');
        const quoteEl = document.getElementById('brutal-quote');
        
        if (titleEl) titleEl.textContent = ending.title;
        if (descEl) descEl.textContent = ending.desc;
        if (quoteEl) quoteEl.textContent = ending.quote || "既然天命已定，何须多言！";
        
        // 2. 个性计算与印章
        const { bestMatch } = this.calculatePersonality();
        const stampLabelEl = document.getElementById('stamp-label');
        if (stampLabelEl) {
            stampLabelEl.textContent = bestMatch.label || bestMatch.name;
        }
        
        // 3. 计算 4 项对抗维度比例
        const s = this.scores;
        const calcRatio = (a, b) => {
            const sum = a + b;
            if (sum === 0) return 50;
            return Math.round((a / sum) * 100);
        };
        
        const cfRatio = calcRatio(s.C, s.F);
        const rsRatio = calcRatio(s.R, s.S);
        const apRatio = calcRatio(s.A, s.P);
        const imRatio = calcRatio(s.I, s.M);
        
        const barCf = document.getElementById('bar-cf');
        const barRs = document.getElementById('bar-rs');
        const barAp = document.getElementById('bar-ap');
        const barIm = document.getElementById('bar-im');
        
        // 初始化宽度为0
        if (barCf) { barCf.style.width = '0%'; barCf.textContent = ''; }
        if (barRs) { barRs.style.width = '0%'; barRs.textContent = ''; }
        if (barAp) { barAp.style.width = '0%'; barAp.textContent = ''; }
        if (barIm) { barIm.style.width = '0%'; barIm.textContent = ''; }
        
        // 4. 其他统计
        const statStepsEl = document.getElementById('stat-steps');
        const statRarityEl = document.getElementById('stat-rarity');
        if (statStepsEl) statStepsEl.textContent = this.actualSteps;
        if (statRarityEl) {
            const hash = ending.title.charCodeAt(0) * this.actualSteps;
            statRarityEl.textContent = (4.5 + (hash % 11)).toFixed(1);
        }
        
        // 每次显示结局时重新生成二维码
        this.generateQRCode();
        
        // 5. 显示容器
        document.getElementById('ending-screen').classList.remove('hidden');
        const rewindBtn = document.getElementById('rewind-btn');
        if (this.history && this.history.length > 0 && !['E01', 'E11', 'E13'].includes(endingId)) {
            rewindBtn.classList.remove('hidden');
        } else {
            rewindBtn.classList.add('hidden');
        }
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        
        setTimeout(() => {
            this.endingScreen.classList.add('visible');
            
            // 触发进度条动画
            setTimeout(() => {
                if (barCf) { barCf.style.width = cfRatio + '%'; barCf.textContent = cfRatio + '%'; }
                if (barRs) { barRs.style.width = rsRatio + '%'; barRs.textContent = rsRatio + '%'; }
                if (barAp) { barAp.style.width = apRatio + '%'; barAp.textContent = apRatio + '%'; }
                if (barIm) { barIm.style.width = imRatio + '%'; barIm.textContent = imRatio + '%'; }
            }, 300);
            
            // 触发印章特效 (1.5秒后进度条涨完)
            setTimeout(() => {
                const stamp = document.getElementById('brutal-stamp');
                if (stamp) {
                    stamp.classList.remove('hidden');
                    stamp.classList.add('stamp-drop-anim');
                }
            }, 1800);
            
        }, 50);
    }`;

// use regex to replace from 'showEnding(endingId) {' to the end of the setTimeout block
const regex = /showEnding\(endingId\) \{[\s\S]*?\}, 50\);\n    \}/;
content = content.replace(regex, replacement);

fs.writeFileSync('main.js', content, 'utf8');
console.log('Successfully replaced showEnding');
