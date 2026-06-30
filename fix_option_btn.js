const fs = require('fs');

let css = fs.readFileSync('style.css', 'utf8');

const optionBtnRegex = /\.option-btn\s*\{[^}]+\}/m;
const newOptionBtn = `.option-btn {
    background: transparent !important;
    border: 1px solid var(--card-border);
    color: var(--text-primary);
    padding: 1.2rem;
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: none;
}`;

css = css.replace(optionBtnRegex, newOptionBtn);

// also remove .option-arrow completely since we removed it from HTML
css = css.replace(/\.option-arrow\s*\{[^}]+\}/m, '');
css = css.replace(/\.option-btn:hover \.option-arrow\s*\{[^}]+\}/m, '');

fs.writeFileSync('style.css', css, 'utf8');
console.log('Successfully updated option-btn CSS');
