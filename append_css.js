const fs = require('fs');

const brutalCss = `
/* ========================================================= */
/* BRUTALISM TYPOGRAPHY (ENDING SCREEN OVERHAUL)             */
/* ========================================================= */

.brutal-mode {
    background-color: #000000 !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 5vh;
}

.brutal-share-card {
    width: 100%;
    max-width: 600px;
    background-color: #CCFF00; /* Neon Yellow */
    color: #000000;
    border: 8px solid #000000;
    box-sizing: border-box;
    padding: 30px;
    position: relative;
    overflow: hidden;
    font-family: Impact, "Arial Black", "PingFang SC", "Heiti SC", sans-serif;
    text-transform: uppercase;
    box-shadow: 10px 10px 0px #000000;
}

.brutal-quote {
    font-size: 2.8rem;
    line-height: 1.1;
    font-weight: 900;
    margin-bottom: 20px;
    word-break: break-word;
    letter-spacing: -0.02em;
}

.brutal-title-box {
    margin-bottom: 30px;
    border-bottom: 4px solid #000000;
    padding-bottom: 10px;
}

.brutal-title {
    font-size: 2rem;
    font-weight: 900;
    letter-spacing: 0.1em;
}

.brutal-desc {
    font-size: 1rem;
    font-weight: bold;
    opacity: 0.8;
}

.brutal-stats-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
}

.brutal-stat-row {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.stat-labels {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    font-weight: 900;
}

.stat-bar-bg {
    width: 100%;
    height: 30px;
    background-color: #000000;
    position: relative;
}

.stat-bar-fill {
    height: 100%;
    background-color: #ffffff;
    width: 0%; /* Animates to target */
    transition: width 1.5s cubic-bezier(0.2, 1, 0.3, 1);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
    font-weight: 900;
    font-size: 1.2rem;
    color: #000000;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
}

.brutal-footer {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    border-top: 4px solid #000000;
    padding-top: 15px;
}

.highlight-yellow {
    background-color: #000000;
    color: #CCFF00;
    padding: 2px 5px;
}

.brutal-stamp {
    position: absolute;
    top: 10%;
    right: 5%;
    color: #ff0000;
    border: 6px solid #ff0000;
    font-size: 2.5rem;
    font-weight: 900;
    padding: 10px 15px;
    transform: rotate(-15deg);
    opacity: 0;
    pointer-events: none;
    z-index: 10;
    text-shadow: 2px 2px 0px rgba(0,0,0,0.2);
    box-shadow: 4px 4px 0px rgba(255,0,0,0.2);
}

.stamp-drop-anim {
    animation: stamp-drop 0.4s cubic-bezier(0.2, 1, 0.3, 1.5) forwards;
}

@keyframes stamp-drop {
    0% { transform: scale(3) rotate(-30deg); opacity: 0; }
    100% { transform: scale(1) rotate(-15deg); opacity: 1; }
}

.brutal-watermark {
    margin-top: 20px;
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;
    opacity: 0.6;
}

.brutal-btn {
    font-family: Impact, "Arial Black", sans-serif;
    font-weight: 900;
    font-size: 1.2rem;
    border-radius: 0;
    border: 4px solid #CCFF00;
    background: transparent;
    color: #CCFF00;
    box-shadow: 4px 4px 0px #CCFF00;
    margin: 5px;
}

.brutal-btn:hover {
    background: #CCFF00;
    color: #000000;
}

.rewind-btn.brutal-btn {
    border-color: #ff00ff;
    color: #ff00ff;
    box-shadow: 4px 4px 0px #ff00ff;
}
.rewind-btn.brutal-btn:hover {
    background: #ff00ff;
    color: #000000;
}
`;

fs.appendFileSync('style.css', brutalCss, 'utf8');
console.log('Appended brutalism CSS to style.css');
