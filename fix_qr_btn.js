const fs = require('fs');

// 1. Update style.css
let css = fs.readFileSync('style.css', 'utf8');

// Remove special grey styling for rewind button
css = css.replace(/\.rewind-btn\.brutal-btn\s*\{[^}]+\}\s*/g, '');
css = css.replace(/\.rewind-btn\.brutal-btn:hover\s*\{[^}]+\}\s*/g, '');

// Update QR section CSS
const qrCss = `
.brutal-qrcode-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px dashed var(--card-border);
}

.brutal-qrcode-section .brutal-watermark {
    margin-top: 0;
    text-align: left;
}

.qr-code {
    width: 60px;
    height: 60px;
    background: #fff;
    padding: 4px;
    border: 1px solid var(--card-border);
    display: flex;
    justify-content: center;
    align-items: center;
}
.qr-code img {
    width: 100%;
    height: 100%;
}
`;

css += qrCss;
fs.writeFileSync('style.css', css, 'utf8');

// 2. Update index.html
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace(
    /<div class="brutal-watermark">[\s\S]*?<\/div>\s*<!-- 独立二维码占位 -->\s*<div class="qr-placeholder" id="qrCodeContainer">\s*<div class="qr-box" id="qrcode"><\/div>\s*<\/div>/m,
    `<div class="brutal-qrcode-section">
                    <div class="brutal-watermark">扫码入局 测测你的历史人格</div>
                    <div class="qr-code" id="qrCodeContainer"></div>
                </div>`
);
fs.writeFileSync('index.html', html, 'utf8');

console.log('Successfully updated QR code and button styles.');
