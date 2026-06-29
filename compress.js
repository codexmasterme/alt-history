const { Jimp } = require('jimp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../人物');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.png'));

async function processImages() {
    let jsContent = 'window.characterImages = {\n';
    for (const file of files) {
        const filePath = path.join(dir, file);
        console.log('Processing', file);
        try {
            const image = await Jimp.read(filePath);
            image.resize({ w: 400 }); 
            const buffer = await image.getBuffer('image/jpeg', { quality: 60 });
            const base64 = buffer.toString('base64');
            jsContent += "  '" + file + "': 'data:image/jpeg;base64," + base64 + "',\n";
            console.log('Finished', file, Math.round(base64.length/1024) + ' KB');
        } catch (e) {
            console.error('Error on', file, e.message);
        }
    }
    jsContent += '};\n';
    fs.writeFileSync(path.join(__dirname, 'image_data.js'), jsContent, 'utf8');
    console.log('image_data.js created successfully.');
}
processImages();
