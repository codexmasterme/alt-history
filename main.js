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
        
        const endingScreen = document.getElementById('ending-screen');
        if (endingScreen) endingScreen.scrollTop = 0;
        
        shareCard.style.transform = 'none';
        shareCard.classList.add('no-noise');
        
        this.saveBtn.textContent = '生成中...';
        
        try {
            html2canvas(shareCard, {
                backgroundColor: '#0d0d0f',
                scale: window.devicePixelRatio || 2, // Restored high res scale
                useCORS: false,
                allowTaint: true,
                scrollY: 0
            }).then(canvas => {
                const finishRender = (imgUrl, blob) => {
                    let overlay = document.getElementById('screenshot-overlay');
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.id = 'screenshot-overlay';
                        document.body.appendChild(overlay);

                        overlay.addEventListener('click', (e) => {
                            // 点击图片或下载链接不关闭，其他空白处关闭
                            if (e.target.tagName === 'IMG' || e.target.tagName === 'A') return;
                            overlay.classList.remove('show');
                        });
                    }

                    const fileName = '青史另说_历史命运签.png';

                    overlay.innerHTML = `
                        <div class="overlay-hint" style="color:white; font-size:1.05rem; margin-bottom:16px; text-shadow:0 2px 4px rgba(0,0,0,0.8); font-weight:bold; text-align:center;">生成成功！点击下方按钮下载，或长按图片保存</div>
                        <img src="${imgUrl}" class="generated-image" alt="历史命运签" style="max-width:90%; max-height:70vh; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.8); pointer-events:auto;"/>
                        <a href="${imgUrl}" download="${fileName}" class="download-link" id="download-link">⬇ 点击下载图片</a>
                        <div class="overlay-close" style="color:rgba(255,255,255,0.6); font-size:0.85rem; margin-top:18px;">点击空白处关闭</div>
                    `;

                    // iOS Safari 不支持 <a download>，回退到新窗口打开让用户长按保存
                    const dlLink = overlay.querySelector('#download-link');
                    if (dlLink && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
                        dlLink.addEventListener('click', (ev) => {
                            ev.preventDefault();
                            window.open(imgUrl, '_blank');
                        });
                    }

                    overlay.style.position = 'fixed';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100vw';
                    overlay.style.height = '100vh';
                    overlay.style.background = 'rgba(0, 0, 0, 0.95)';
                    overlay.style.zIndex = '999999';
                    overlay.style.display = 'flex';
                    overlay.style.flexDirection = 'column';
                    overlay.style.alignItems = 'center';
                    overlay.style.justifyContent = 'center';
                    overlay.style.padding = '20px';
                    overlay.style.boxSizing = 'border-box';

                    overlay.classList.add('show');

                    shareCard.style.transform = oldTransform;
                    shareCard.classList.remove('no-noise');
                    this.saveBtn.textContent = '保存图片';
                };

                // 优先使用 Blob URL —— 移动端浏览器对 Blob URL 图片更容易给出
                // 「保存图片」「下载」等长按菜单项；data URL 则常被限制。
                if (canvas.toBlob) {
                    canvas.toBlob(blob => {
                        if (!blob) {
                            try {
                                finishRender(canvas.toDataURL('image/png'), null);
                            } catch (e) {
                                alert('图片导出失败: ' + e.message);
                            }
                            return;
                        }
                        const blobUrl = URL.createObjectURL(blob);
                        finishRender(blobUrl, blob);
                    }, 'image/png');
                } else {
                    let dataUrl;
                    try {
                        dataUrl = canvas.toDataURL('image/png');
                    } catch (e) {
                        alert('图片导出失败: ' + e.message);
                        throw e;
                    }
                    finishRender(dataUrl, null);
                }
            }).catch(err => {
                alert('长图生成失败: ' + (err.message || err));
                this.saveBtn.textContent = '保存失败';
                shareCard.style.transform = oldTransform;
                shareCard.classList.remove('no-noise');
                setTimeout(() => this.saveBtn.textContent = '保存图片', 2000);
            });
        } catch (syncErr) {
            alert('截图引擎崩溃: ' + (syncErr.message || syncErr));
            this.saveBtn.textContent = '保存失败';
            shareCard.style.transform = oldTransform;
            shareCard.classList.remove('no-noise');
            setTimeout(() => this.saveBtn.textContent = '保存图片', 2000);
        }
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

// WeChat detection logic
function checkWeChat() {
    const isWechat = /MicroMessenger/i.test(navigator.userAgent);
    if (isWechat) {
        let wechatOverlay = document.createElement('div');
        wechatOverlay.style.position = 'fixed';
        wechatOverlay.style.top = '0';
        wechatOverlay.style.left = '0';
        wechatOverlay.style.width = '100vw';
        wechatOverlay.style.height = '100vh';
        wechatOverlay.style.background = 'rgba(0,0,0,0.95)';
        wechatOverlay.style.zIndex = '9999999';
        wechatOverlay.style.display = 'flex';
        wechatOverlay.style.flexDirection = 'column';
        wechatOverlay.style.alignItems = 'center';
        wechatOverlay.style.paddingTop = '80px';
        wechatOverlay.style.color = '#fff';
        wechatOverlay.style.fontSize = '20px';
        wechatOverlay.style.lineHeight = '1.8';
        wechatOverlay.style.textAlign = 'center';
        wechatOverlay.style.backdropFilter = 'blur(10px)';
        
        wechatOverlay.innerHTML = `
            <div style="position:absolute; top:20px; right:20px; font-size:40px; color:#d4af37;">↗</div>
            <div style="margin-top: 20px; font-weight: bold; color: #d4af37; font-size: 24px;">检测到微信环境</div>
            <div style="font-size: 16px; margin-top: 20px; color: #ccc;">由于微信严格限制了高清长图的生成<br>为了获得完美的截图和保存体验<br><br>请点击右上角 <span style="display:inline-block; letter-spacing:2px; font-weight:bold; color:#fff;">•••</span><br>选择 <span style="color:#d4af37; font-weight:bold;">【在默认浏览器中打开】</span></div>
            <div style="margin-top: 40px; font-size: 14px; color: #666;">（如 Safari 或 Chrome）</div>
        `;
        document.body.appendChild(wechatOverlay);
    }
}

function showIntroModal() {
    return new Promise(resolve => {
        const modal = document.getElementById('intro-modal');
        const btn = document.getElementById('intro-confirm-btn');
        if (!modal || !btn) { resolve(); return; }
        btn.addEventListener('click', () => {
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.classList.add('hidden');
                resolve();
            }, 500);
        }, { once: true });
    });
}

window.addEventListener('DOMContentLoaded', async () => {
    checkWeChat();
    await showIntroModal();
    new GameApp();
});
