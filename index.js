const { GoogleTranslator } = require('@translate-tools/core/translators/GoogleTranslator');

// TODO: setup filenames
const input_filename = './toefl.js'
const output_filename =  './toefl_output_google_0615.js'

const input = require(input_filename);

const googleTranslator = new GoogleTranslator({
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
	},
});

// Translate the meaning
async function translateMeaning(text, translator) {
	const result = {};
    // TODO: setup languages
	for (const lang of ['es', 'zh_TW', 'zh_CN', 'ja', 'ko', 'th']) {
	  result[lang] = await translator.translate(text, 'en', lang);
	}
	// console.log(result);
	return result;
}

const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);

async function translateAndWrite(input) {
    const writeStream = fs.createWriteStream(output_filename, { flags: 'w' });
    writeStream.write('module.exports = [\n');

    for (let i = 0; i < input.length; i++) {
        const item = input[i];
        const newItem = {...item};

        const translatedMeaning = await translateMeaning(newItem.word, googleTranslator);
        // const translatedMeaning = await translateMeaning(newItem.word, bingTranslator);
        newItem.detail[0].meaning = {...newItem.detail[0].meaning, ...translatedMeaning};

        // COMMENTED: for multiple meanings
        // for (let j = 0; j < newItem.detail.length; j++) {
        //     const meaning = newItem.detail[j].meaning.en;
        //     const translatedMeanings = await translateMeaning(meaning);
        //     newItem.detail[j].meaning = {...newItem.detail[j].meaning, ...translatedMeanings};
        // }

        const output = JSON.stringify(newItem, null, 2) + (i < input.length - 1 ? ',' : '') + '\n';
        console.log(output);
        writeStream.write(output);
    }

    writeStream.write('];\n');
    writeStream.end();

    await pipelineAsync(writeStream);
    console.log('Translation done.');
}

translateAndWrite(input).catch((err) => console.error('Translation error:', err));