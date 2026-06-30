const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

// 1. Root variables
css = css.replace(/:root\s*\{[^}]+\}/m, `:root {
    --bg-color-deep: #F4EFE6;
    --primary-color: #D35F3C;
    --primary-color-dim: #D98873;
    --text-primary: #2A2626;
    --text-secondary: #7A7571;
    --red-accent: #D35F3C;
    --card-bg: #F4EFE6;
    --card-border: #E1D5C6;
}`);

// 2. Background gradient
css = css.replace(/\.bg-gradient\s*\{[^}]+\}/m, `.bg-gradient {
    position: fixed;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at 50% 50%, rgba(211, 95, 60, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 20% 80%, rgba(225, 213, 198, 0.5) 0%, transparent 40%);
    z-index: -2;
}`);

// 3. #setup-text adjustments
css = css.replace(/#setup-text\s*\{[^}]+\}/m, `#setup-text {
    font-size: 1.15rem;
    line-height: 1.8;
    color: var(--text-primary);
    text-align: justify;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--card-border);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}`);

// 4. .option-btn base adjustments
css = css.replace(/\.option-btn\s*\{[^}]+\}/m, `.option-btn {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    color: var(--text-primary);
    padding: 1.2rem;
    text-align: left;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}`);

// 5. .option-btn hover adjustments
css = css.replace(/\.option-btn:hover(:not\(\.disabled\))?\s*\{[^}]+\}/g, `.option-btn:hover:not(.disabled) {
    border-color: var(--primary-color);
    background: #FCFAF5;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(211, 95, 60, 0.1);
    color: var(--primary-color);
}`);

// 6. .option-btn active adjustments
css = css.replace(/\.option-btn\.active\s*\{[^}]+\}/m, `.option-btn.active {
    border-color: var(--primary-color);
    background: rgba(211, 95, 60, 0.05);
    box-shadow: inset 0 0 10px rgba(211, 95, 60, 0.1);
}`);

// 7. Brutal mode elements
css = css.replace(/background-color: #ffffff;/g, "background-color: #F4EFE6;");
css = css.replace(/border: 4px solid #2c2c2e;/g, "border: 1px solid #E1D5C6;");
css = css.replace(/box-shadow: 10px 10px 0px rgba\(0,0,0,0\.1\);/g, "box-shadow: 0px 10px 30px rgba(0,0,0,0.05);");
css = css.replace(/color: #2c2c2e;/g, "color: #2A2626;");
css = css.replace(/border-bottom: 2px solid #2c2c2e;/g, "border-bottom: 1px solid #E1D5C6;");
css = css.replace(/border-top: 2px solid #2c2c2e;/g, "border-top: 1px solid #E1D5C6;");

css = css.replace(/\.stat-bar-bg \{\n    width: 100%;\n    height: 30px;\n    background-color: #e5e5ea;/g, ".stat-bar-bg {\n    width: 100%;\n    height: 30px;\n    background-color: #E1D5C6;");
css = css.replace(/\.stat-bar-fill \{\n    height: 100%;\n    background-color: #c94a38;/g, ".stat-bar-fill {\n    height: 100%;\n    background-color: #D35F3C;");

// Update Brutal btn
const newBrutalBtn = `.brutal-btn {
    font-family: inherit;
    font-weight: bold;
    font-size: 1.2rem;
    border-radius: 4px;
    border: none;
    background: #D35F3C;
    color: #ffffff;
    box-shadow: none;
    margin: 5px;
    padding: 10px 20px;
}
.brutal-btn:hover {
    background: #bd5232;
    color: #ffffff;
}
.rewind-btn.brutal-btn {
    background: #7A7571;
}
.rewind-btn.brutal-btn:hover {
    background: #605c59;
}`;
css = css.replace(/\.brutal-btn\s*\{[\s\S]*?\.rewind-btn\.brutal-btn:hover\s*\{[^}]+\}/m, newBrutalBtn);

fs.writeFileSync('style.css', css, 'utf8');
console.log("Successfully updated style.css to Warm Paper theme.");
