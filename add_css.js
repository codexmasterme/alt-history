const fs = require('fs');

const cssToAdd = `
/* ========== Combo Toast ========== */
.combo-toast {
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%) translateY(-20px) scale(0.9);
    background: linear-gradient(135deg, rgba(20,20,30,0.95), rgba(40,20,20,0.95));
    border: 1px solid rgba(212, 175, 55, 0.6);
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.4), inset 0 0 10px rgba(139, 0, 0, 0.3);
    padding: 12px 24px;
    border-radius: 30px;
    display: flex;
    align-items: center;
    gap: 12px;
    z-index: 1000;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.combo-toast.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
    animation: comboShake 0.4s ease-in-out;
}

.combo-icon {
    font-size: 1.5rem;
    color: #ffd700;
    text-shadow: 0 0 10px #ffd700;
}

.combo-content {
    display: flex;
    flex-direction: column;
}

.combo-title {
    font-size: 0.8rem;
    color: var(--text-secondary);
    letter-spacing: 0.1em;
}

.combo-desc {
    font-size: 1.1rem;
    color: var(--primary-color);
    font-weight: bold;
    letter-spacing: 0.05em;
    text-shadow: 0 0 5px rgba(212, 175, 55, 0.5);
}

.combo-multiplier {
    font-size: 1.5rem;
    font-weight: 900;
    color: #ff4500;
    font-style: italic;
    text-shadow: 0 0 10px rgba(255, 69, 0, 0.6);
    margin-left: 10px;
}

@keyframes comboShake {
    0% { transform: translateX(-50%) translateY(0) scale(1) rotate(0deg); }
    25% { transform: translateX(-52%) translateY(-2px) scale(1.05) rotate(-2deg); }
    50% { transform: translateX(-48%) translateY(2px) scale(1.05) rotate(2deg); }
    75% { transform: translateX(-51%) translateY(-1px) scale(1.02) rotate(-1deg); }
    100% { transform: translateX(-50%) translateY(0) scale(1) rotate(0deg); }
}

/* ========== Rewind Button ========== */
.rewind-btn {
    background: linear-gradient(135deg, rgba(80, 20, 100, 0.8) 0%, rgba(139, 0, 200, 0.4) 100%);
    border: 1px solid rgba(200, 100, 255, 0.5);
    color: #e0b0ff;
    text-shadow: 0 0 5px rgba(200, 100, 255, 0.5);
}
.rewind-btn:hover {
    background: linear-gradient(135deg, rgba(100, 30, 130, 0.9) 0%, rgba(160, 20, 230, 0.6) 100%);
    box-shadow: 0 4px 15px rgba(139, 0, 200, 0.4), inset 0 0 10px rgba(200, 100, 255, 0.2);
}
`;

fs.appendFileSync('style.css', cssToAdd, 'utf8');
