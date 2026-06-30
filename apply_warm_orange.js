const fs = require('fs');

// 1. Update style.css
let css = fs.readFileSync('style.css', 'utf8');

// Colors and fonts
css = css.replace(/:root\s*\{[^}]+\}/m, `:root {
    --bg-color-deep: #FBEEDD;
    --primary-color: #C0392B;
    --primary-color-dim: #A8311F;
    --text-primary: #2A1C12;
    --text-secondary: #6B4F38;
    --text-weak: #A98A6B;
    --card-border: #E6CBA3;
    --orange-accent: #B96A22;
    --card-bg: #FFF7EC;
}`);

// Header changes
css = css.replace(/header\s*\{[^}]+\}/m, `header {
    text-align: center;
    padding-bottom: 1.5rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}`);

css = css.replace(/header::after\s*\{[^}]+\}/m, `header::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--orange-accent), transparent);
}`);

css = css.replace(/#year\s*\{[^}]+\}/m, `#year {
    font-size: 0.9rem;
    color: var(--primary-color);
    letter-spacing: 0.5em;
    margin-bottom: 1rem;
    border: 1px solid var(--primary-color);
    padding: 0.2rem 0.5rem 0.2rem 1rem;
    display: inline-block;
    border-radius: 2px;
}`);

css = css.replace(/#title\s*\{[^}]+\}/m, `#title {
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--primary-color);
    letter-spacing: 0.1em;
}`);

// Setup text (Narrative)
css = css.replace(/#setup-text\s*\{[^}]+\}/m, `#setup-text {
    font-size: 1.15rem;
    line-height: 2.0;
    color: var(--text-primary);
    text-align: justify;
    text-indent: 2em;
    padding: 0;
    background: transparent;
    border: none;
    box-shadow: none;
}`);

// Title decorators (arrows)
const titleDecorators = `
.title-decorator {
    color: var(--text-weak);
    font-size: 2rem;
    font-weight: 300;
    opacity: 0.5;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}
.title-decorator.left { left: 0; }
.title-decorator.left::before { content: "‹"; }
.title-decorator.right { right: 0; }
.title-decorator.right::before { content: "›"; }
.highlight-name { color: var(--primary-color); font-weight: 900; }
`;
if (!css.includes('.highlight-name')) {
    css += titleDecorators;
}

// Option buttons
css = css.replace(/\.option-btn\s*\{[^}]+\}/m, `.option-btn {
    background: var(--card-bg) !important;
    border: 1px solid var(--card-border);
    color: var(--text-primary);
    padding: 1.2rem;
    text-align: left;
    border-radius: 12px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    box-shadow: none;
}`);

css = css.replace(/\.option-btn:hover:not\(\.disabled\)\s*\{[^}]+\}/m, `.option-btn:hover:not(.disabled) {
    border-color: var(--primary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(185, 106, 34, 0.15);
    color: var(--primary-color);
}`);

// Option arrow
const optionArrowCSS = `
.option-arrow {
    color: var(--text-weak);
    font-family: monospace;
    font-size: 1.2rem;
    transition: all 0.3s ease;
}
.option-btn:hover .option-arrow {
    color: var(--primary-color);
    transform: translateX(5px);
}
`;
if (!css.includes('.option-arrow {')) {
    css += optionArrowCSS;
} else {
    css = css.replace(/\.option-arrow\s*\{[^}]+\}/m, `.option-arrow {
    color: var(--text-weak);
    font-family: monospace;
    font-size: 1.2rem;
    transition: all 0.3s ease;
}`);
    css = css.replace(/\.option-btn:hover \.option-arrow\s*\{[^}]+\}/m, `.option-btn:hover .option-arrow {
    color: var(--primary-color);
    transform: translateX(5px);
}`);
}

fs.writeFileSync('style.css', css, 'utf8');

// 2. Update main.js
let js = fs.readFileSync('main.js', 'utf8');

const setupTextRegex = /this\.setupTextEl\.innerHTML = node\.setup;/;
const setupTextReplacement = `
        let setupHtml = node.setup;
        const keyNames = ['项羽', '刘邦', '范增', '韩信', '张良', '萧何', '陈平', '吕雉', '英布', '彭越', '章邯', '司马欣', '董翳', '义帝', '楚怀王'];
        keyNames.forEach(name => {
            const regex = new RegExp(name, 'g');
            setupHtml = setupHtml.replace(regex, \`<strong class="highlight-name">\${name}</strong>\`);
        });
        this.setupTextEl.innerHTML = setupHtml;
`;
js = js.replace(setupTextRegex, setupTextReplacement);

const optionBtnHtmlRegex = /btn\.innerHTML = \`[\s\S]*?\`;/;
const optionBtnHtmlReplacement = `btn.innerHTML = \`
                <div class="option-main" style="width: calc(100% - 20px); text-align: left;">
                    <div class="option-header" style="justify-content: flex-start;">
                        <span class="option-title">\${opt.text}</span>
                    </div>
                    \${subtextHtml}
                </div>
                <span class="option-arrow">→</span>
            \`;`;
js = js.replace(optionBtnHtmlRegex, optionBtnHtmlReplacement);

fs.writeFileSync('main.js', js, 'utf8');

console.log('Successfully applied Warm Orange theme');
