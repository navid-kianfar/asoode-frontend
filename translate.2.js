const fs = require('fs');
const path = require('path');
const axios = require('axios');

const sourceLanguage = 'fa';
const targetLanguages = ['ar', 'fr', 'en'];
const apiKey = '';

const translateText = async (text, target) => {
    console.log(target, '->', text);
    const response = await axios.get('https://translation.googleapis.com/language/translate/v2', {
        params: {
            q: text,
            target: target,
            key: apiKey,
            format: 'text'
        }
    });

    return response.data.data.translations[0].translatedText;
};

const translateObject = async (sourceData, obj, target) => {
    for (let key in sourceData) {
        if (typeof sourceData[key] === 'object') {
            obj[key] = await translateObject(sourceData[key], target);
        } else if (!obj[key]) {
            obj[key] = await translateText(sourceData[key], target);
        }
    }
    return obj;
};

const translateFilesInDirectory = async (folder, source, languages) => {
    const sourceRaw = fs.readFileSync(path.join(folder, `${source}.json`));
    const sourceData = JSON.parse(sourceRaw);

    for (let lang of languages) {
        const targetRaw = fs.readFileSync(path.join(folder, `${lang}.json`));
        const targetData = JSON.parse(targetRaw);

        const translatedData = await translateObject(sourceData, targetData, lang);
        fs.writeFileSync(path.join(folder, `${lang}.json`), JSON.stringify(translatedData, null, 2));
    }
};

const main = async () => {
    const folder = './src/assets/i18n';
    await translateFilesInDirectory(folder, sourceLanguage, targetLanguages);
    console.log('finished')
};

main().catch(console.error);

