const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Replace :root
const rootRegex = /:root\s*\{[^}]+\}/m;
const newRoot = `:root {
    --bg-color-deep: #f5f5f7;
    --primary-color: #2b4c7e;
    --primary-color-dim: #708aa8;
    --text-primary: #2c2c2e;
    --text-secondary: #8e8e93;
    --red-accent: #c94a38;
    --card-bg: rgba(255, 255, 255, 0.95);
    --card-border: rgba(0, 0, 0, 0.1);
}`;
css = css.replace(rootRegex, newRoot);

// 2. Adjust .bg-gradient
const bgGradientRegex = /\.bg-gradient\s*\{[^}]+\}/m;
const newBgGradient = `.bg-gradient {
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 50% 50%, rgba(43, 76, 126, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(201, 74, 56, 0.03) 0%, transparent 40%);
    z-index: -2;
}`;
css = css.replace(bgGradientRegex, newBgGradient);

// 3. Option btn hover background
const optBtnHoverRegex = /\.option-btn:hover:not\(\.disabled\)\s*\{[^}]+\}/m;
const newOptBtnHover = `.option-btn:hover:not(.disabled) {
    border-color: var(--primary-color);
    background: rgba(43, 76, 126, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05), inset 0 0 10px rgba(43, 76, 126, 0.1);
}`;
css = css.replace(optBtnHoverRegex, newOptBtnHover);

const optBtnActiveRegex = /\.option-btn\.active\s*\{[^}]+\}/m;
const newOptBtnActive = `.option-btn.active {
    border-color: var(--primary-color);
    background: rgba(43, 76, 126, 0.1);
    box-shadow: inset 0 0 15px rgba(43, 76, 126, 0.2);
}`;
css = css.replace(optBtnActiveRegex, newOptBtnActive);

// 4. Update Brutalism styles
css = css.replace(/background-color: #000000 !important;/g, "background-color: var(--bg-color-deep) !important;");
css = css.replace(/background-color: #CCFF00;/g, "background-color: #ffffff;");
css = css.replace(/border: 8px solid #000000;/g, "border: 4px solid #2c2c2e;");
css = css.replace(/box-shadow: 10px 10px 0px #000000;/g, "box-shadow: 10px 10px 0px rgba(0,0,0,0.1);");
css = css.replace(/color: #000000;/g, "color: #2c2c2e;");
css = css.replace(/border-bottom: 4px solid #000000;/g, "border-bottom: 2px solid #2c2c2e;");
css = css.replace(/\.stat-bar-bg \{\s*width: 100%;\s*height: 30px;\s*background-color: #000000;/g, ".stat-bar-bg {\n    width: 100%;\n    height: 30px;\n    background-color: #e5e5ea;");
css = css.replace(/\.stat-bar-fill \{\s*height: 100%;\s*background-color: #ffffff;/g, ".stat-bar-fill {\n    height: 100%;\n    background-color: #c94a38;");
css = css.replace(/border-top: 4px solid #000000;/g, "border-top: 2px solid #2c2c2e;");

// Update highlight yellow to highlight red
const hlYellowRegex = /\.highlight-yellow\s*\{[^}]+\}/m;
const newHlYellow = `.highlight-yellow {
    background-color: #c94a38;
    color: #ffffff;
    padding: 2px 5px;
}`;
css = css.replace(hlYellowRegex, newHlYellow);

// Update brutal-stamp colors (previously red #ff0000, now #c94a38)
css = css.replace(/color: #ff0000;/g, "color: #c94a38;");
css = css.replace(/border: 6px solid #ff0000;/g, "border: 4px solid #c94a38;");
css = css.replace(/box-shadow: 4px 4px 0px rgba\(255,0,0,0\.2\);/g, "box-shadow: 2px 2px 0px rgba(201,74,56,0.2);");

// Update brutal-btn
const brutalBtnRegex = /\.brutal-btn\s*\{[^}]+\}/m;
const newBrutalBtn = `.brutal-btn {
    font-family: Impact, "Arial Black", sans-serif;
    font-weight: 900;
    font-size: 1.2rem;
    border-radius: 4px;
    border: 2px solid #2c2c2e;
    background: #ffffff;
    color: #2c2c2e;
    box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
    margin: 5px;
}`;
css = css.replace(brutalBtnRegex, newBrutalBtn);

const brutalBtnHoverRegex = /\.brutal-btn:hover\s*\{[^}]+\}/m;
const newBrutalBtnHover = `.brutal-btn:hover {
    background: #2c2c2e;
    color: #ffffff;
}`;
css = css.replace(brutalBtnHoverRegex, newBrutalBtnHover);

const rewindBtnRegex = /\.rewind-btn\.brutal-btn\s*\{[^}]+\}/m;
const newRewindBtn = `.rewind-btn.brutal-btn {
    border-color: #2b4c7e;
    color: #2b4c7e;
    box-shadow: 4px 4px 0px rgba(43,76,126,0.2);
}`;
css = css.replace(rewindBtnRegex, newRewindBtn);

const rewindBtnHoverRegex = /\.rewind-btn\.brutal-btn:hover\s*\{[^}]+\}/m;
const newRewindBtnHover = `.rewind-btn.brutal-btn:hover {
    background: #2b4c7e;
    color: #ffffff;
}`;
css = css.replace(rewindBtnHoverRegex, newRewindBtnHover);

fs.writeFileSync('style.css', css, 'utf8');
console.log("Successfully updated style.css for Light Theme.");
