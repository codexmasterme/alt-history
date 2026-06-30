const fs = require('fs');
const window = {};
eval(fs.readFileSync('data.js', 'utf8'));
console.log(window.storyNodes['M05'].options);
