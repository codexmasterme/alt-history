class GameApp {
    constructor() {
        this.currentNodeId = 'M01';
        this.scores = { C: 0, F: 0, R: 0, S: 0, A: 0, P: 0, I: 0, M: 0 };
        this.maxSteps = 20; // total main steps roughly
        this.actualSteps = 1;
        
        // Elements
        this.stepLabelEl = document.getElementById('step-label');
        this.dotsContainer = document.getElementById('dots-container');
        this.yearEl = document.getElementById('year');
        this.titleEl = document.getElementById('title');
        this.setupTextEl = document.getElementById('setup-text');
        this.optionsContainer = document.getElementById('options-container');
        
        this.endingScreen = document.getElementById('ending-screen');
        this.endingTitleEl = document.getElementById('ending-title');
        this.endingDescEl = document.getElementById('ending-desc');
        
        this.pTitleEl = document.getElementById('personality-title');
        this.pTagsEl = document.getElementById('personality-tags');
        this.pDescEl = document.getElementById('personality-desc');
        
        this.statStepsEl = document.getElementById('stat-steps');
        this.statEndingNameEl = document.getElementById('stat-ending-name');
        this.statRarityEl = document.getElementById('stat-rarity');
        
        this.restartBtn = document.getElementById('restart-btn');
        this.saveBtn = document.getElementById('save-btn');
        this.collectionProgressEl = document.getElementById('collection-progress');
        this.fadeElements = document.querySelectorAll('.fade-element');
        
        this.restartBtn.addEventListener('click', () => this.restartGame());
        
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => this.saveScreenshot());
        }
        
        // Dynamically generate QR Code pointing to the current URL
        const qrContainer = document.querySelector('.qr-code');
        if (qrContainer && typeof QRCode !== 'undefined') {
            qrContainer.innerHTML = ''; // clear placeholder
            new QRCode(qrContainer, {
                text: window.location.href.split('?')[0].split('#')[0], // Base URL without hash/query
                width: 60,
                height: 60,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.L
            });
        }
        
        this.updateCollectionUI();
        this.init();
    }
    
    init() {
        this.renderNode(this.currentNodeId);
    }
    
    updateCollectionUI() {
        try {
            const collected = JSON.parse(localStorage.getItem('collectedEndings') || '[]');
            if (this.collectionProgressEl) {
                if (collected.length > 0) {
                    const titles = collected.map(id => window.endings[id] ? window.endings[id].title : id).join('、');
                    this.collectionProgressEl.textContent = `大结局图鉴收集进度：${collected.length} / 12 （已解锁：${titles}）`;
                } else {
                    this.collectionProgressEl.textContent = `大结局图鉴收集进度：0 / 12`;
                }
            }
        } catch(e) {
            console.error("Local storage error", e);
        }
    }
    
    saveEnding(endingId) {
        let collected = JSON.parse(localStorage.getItem('collectedEndings') || '[]');
        if (!collected.includes(endingId)) {
            collected.push(endingId);
            localStorage.setItem('collectedEndings', JSON.stringify(collected));
            this.updateCollectionUI();
        }
    }
    
    async renderNode(nodeId) {
        this.fadeElements.forEach(el => el.classList.remove('visible'));
        await new Promise(r => setTimeout(r, 400));
        
        const node = window.storyNodes[nodeId];
        if (!node) {
            console.error('Node not found:', nodeId);
            return;
        }
        
        // Render Progress Bar
        const stepNum = node.step || 1;
        this.stepLabelEl.textContent = `第 ${stepNum} 步 · ${node.title.split(' ')[0]}`;
        
        this.dotsContainer.innerHTML = '';
        for (let i = 1; i <= this.maxSteps; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            if (i < stepNum) dot.classList.add('passed');
            else if (i === stepNum) dot.classList.add('active');
            this.dotsContainer.appendChild(dot);
        }
        
        this.yearEl.textContent = node.year || "";
        this.titleEl.textContent = node.title || "";
        this.setupTextEl.innerHTML = node.setup;
        
        this.optionsContainer.innerHTML = '';
        node.options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'option-btn ' + (opt.isHistorical ? 'option-historical' : 'option-alt');
            
            const subtextHtml = opt.subtext ? `<div class="option-subtext">${opt.subtext}</div>` : '';
            
            btn.innerHTML = `
                <div class="option-main">
                    <div class="option-header">
                        <span class="option-title">${opt.text}</span>
                    </div>
                    ${subtextHtml}
                </div>
                <span class="option-arrow">-></span>
            `;
            btn.addEventListener('click', () => this.handleOptionClick(opt));
            this.optionsContainer.appendChild(btn);
        });
        
        setTimeout(() => {
            this.fadeElements.forEach(el => el.classList.add('visible'));
        }, 50);
    }
    
    handleOptionClick(option) {
        this.actualSteps++;
        
        // Accumulate scores
        if (option.scores) {
            for (let k in option.scores) {
                this.scores[k] += option.scores[k];
            }
        }
        
        const nextId = option.next;
        if (!nextId) {
            console.error("No next node!");
            return;
        }
        
        if (nextId.startsWith('E')) {
            this.showEnding(nextId);
        } else {
            this.renderNode(nextId);
        }
    }
    
    calculatePersonality() {
        const s = this.scores;
        const traits = [
            s.C >= s.F ? 'C' : 'F',
            s.R >= s.S ? 'R' : 'S',
            s.A >= s.P ? 'A' : 'P',
            s.I >= s.M ? 'I' : 'M'
        ];
        
        let bestMatch = window.personalities[0];
        let maxOverlap = -1;
        
        window.personalities.forEach(p => {
            let overlap = p.tags.filter(t => traits.includes(t)).length;
            if (overlap > maxOverlap) {
                maxOverlap = overlap;
                bestMatch = p;
            }
        });
        
        return { traits, bestMatch };
    }
    
    showEnding(endingId) {
        const ending = window.endings[endingId];
        if (!ending) return;
        
        this.saveEnding(endingId);
        
        // Show Ending Info
        this.endingTitleEl.textContent = ending.title;
        this.endingDescEl.textContent = ending.desc;
        
        // Compute and Show Personality
        const { bestMatch } = this.calculatePersonality();
        this.pTitleEl.textContent = bestMatch.name;
        this.pTagsEl.textContent = bestMatch.tags.join(' · ');
        this.pDescEl.textContent = bestMatch.desc;
        
        // Set Character Image
        const imgMap = {
            "文景之心": "汉文帝.png",
            "汉武之魂": "刘彻.png",
            "西楚霸王": "项羽.png",
            "王莽式改革家": "王莽.png",
            "刘邦之器": "刘邦.png",
            "韩信之叹": "韩信.png",
            "曹操之略": "曹操.png",
            "霍光之权": "霍光.png"
        };
        const imgName = imgMap[bestMatch.name] || "刘邦.png";
        const charBgEl = document.getElementById('character-bg');
        if (charBgEl) {
            if (window.characterImages && window.characterImages[imgName]) {
                charBgEl.style.backgroundImage = `url('${window.characterImages[imgName]}')`;
            } else {
                charBgEl.style.backgroundImage = `url('${encodeURI("../人物/" + imgName)}')`;
            }
        }
        
        // Stats
        this.statStepsEl.textContent = this.actualSteps;
        this.statEndingNameEl.textContent = ending.title;
        // Pseudo-random rarity between 4.5% and 15.5% based on ending name length or just random
        const hash = ending.title.charCodeAt(0) * this.actualSteps;
        const rarity = (4.5 + (hash % 11)).toFixed(1);
        this.statRarityEl.textContent = rarity;
        
        this.endingScreen.classList.remove('hidden');
        setTimeout(() => {
            this.endingScreen.classList.add('visible');
        }, 50);
    }
    
    saveScreenshot() {
        const shareCard = document.getElementById('share-card');
        const oldTransform = shareCard.style.transform;
        
        // Fix clipping issue inside scrollable container
        const endingScreen = document.getElementById('ending-screen');
        if (endingScreen) endingScreen.scrollTop = 0;
        
        shareCard.style.transform = 'none';
        shareCard.classList.add('no-noise');
        
        this.saveBtn.textContent = '生成中...';
        
        html2canvas(shareCard, {
            backgroundColor: '#0d0d0f',
            scale: 2,
            useCORS: true,
            allowTaint: false,
            scrollY: 0
        }).then(canvas => {
            const dataUrl = canvas.toDataURL('image/png');
            
            // Create WeChat compatible overlay
            let overlay = document.getElementById('screenshot-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'screenshot-overlay';
                document.body.appendChild(overlay);
                
                overlay.addEventListener('click', () => {
                    overlay.classList.remove('show');
                });
            }
            
            overlay.innerHTML = `
                <div class="overlay-hint">生成成功！请长按下方图片保存或发给朋友</div>
                <img src="${dataUrl}" class="generated-image" alt="历史命运签"/>
                <div class="overlay-close">点击任意处关闭</div>
            `;
            
            overlay.classList.add('show');
            
            shareCard.style.transform = oldTransform;
            shareCard.classList.remove('no-noise');
            this.saveBtn.textContent = '保存图片';
        }).catch(err => {
            console.error('Screenshot failed:', err);
            this.saveBtn.textContent = '保存失败';
            shareCard.style.transform = oldTransform;
            shareCard.classList.remove('no-noise');
            setTimeout(() => this.saveBtn.textContent = '保存图片', 2000);
        });
    }
    
    restartGame() {
        this.endingScreen.classList.remove('visible');
        setTimeout(() => {
            this.endingScreen.classList.add('hidden');
            this.currentNodeId = 'M01';
            this.actualSteps = 1;
            this.scores = { C: 0, F: 0, R: 0, S: 0, A: 0, P: 0, I: 0, M: 0 };
            this.renderNode(this.currentNodeId);
        }, 400);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new GameApp();
});
