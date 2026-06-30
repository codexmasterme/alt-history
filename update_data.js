const fs = require('fs');

let content = fs.readFileSync('data.js', 'utf-8');

// The quotes to add to endings
const quotes = {
    "E01": "王业不偏安，汉贼不两立！",
    "E02": "即使满盘皆输，老子也要站着死！",
    "E03": "朕即国家，逆我者亡！",
    "E04": "宁做鸡头，不做凤尾！",
    "E05": "天下三分，孤必得其一！",
    "E06": "划江而治，谁敢饮马长江！",
    "E07": "既然天命已移，这龙椅我也坐得！",
    "E08": "流水的皇帝，铁打的世家！",
    "E09": "理想再美，也敌不过现实的刀锋！",
    "E10": "汉室未亡，朕将浴火重生！",
    "E11": "四海宾服，万邦来朝！",
    "E12": "百年屈辱，只能以鲜血洗清！",
    "E13": "楚虽三户，亡秦必楚，天下归楚！",
    "E14": "天下非一人之天下，唯均势可保百年！",
    "E15": "偏安一隅又如何？这是孤的江南！",
    "E16": "改革不是请客吃饭，创造新世界！"
};

const shortLabels = {
    "文景之心": "蛰伏者",
    "汉武之魂": "开拓者",
    "西楚霸王": "孤勇者",
    "王莽式改革家": "理想家",
    "刘邦之器": "厚黑学",
    "韩信之叹": "悲剧英雄",
    "曹操之略": "乱世枭雄",
    "霍光之权": "幕后黑手"
};

// Simple regex replacements for endings
for (const [id, quote] of Object.entries(quotes)) {
    const regex = new RegExp(`("${id}":\\s*{[^}]*"desc":\\s*"[^"]*")`, "g");
    content = content.replace(regex, `$1,\n    "quote": "${quote}"`);
}

// Simple regex replacements for personalities
for (const [name, label] of Object.entries(shortLabels)) {
    const regex = new RegExp(`("name":\\s*"${name}",)`);
    content = content.replace(regex, `$1\n    "label": "${label}",`);
}

fs.writeFileSync('data.js', content, 'utf-8');
console.log('Successfully updated data.js with quotes and labels.');
