const { GoogleTranslator } = require('@translate-tools/core/translators/GoogleTranslator');

const input = require('./input.js');

const translator = new GoogleTranslator({
	headers: {
		'User-Agent':
			'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
	},
});

// Translate the meaning
async function translateMeaning(meaning) {
	const result = {};
	for (const lang of ['ja', 'ko', 'th']) {
	  result[lang] = await translator.translate(meaning, 'en', lang);
	}
	// console.log(result);
	return result;
  }

// Translate the input (list of items)
async function translateInput(input) {
	// same structure with the original input, but added kr, jp and th translations
	const result = [];
  
	for (const item of input) {

		const newItem = item;
		// TODO detail may be an array (multiple meanings)
		for (let i = 0; i < newItem.detail.length; i++) {
			const meaning = newItem.detail[i].meaning.en;
  			const translatedMeanings = await translateMeaning(meaning);
			newItem.detail[i].meaning = {...newItem.detail[i].meaning, ...translatedMeanings};
		}
		result.push(newItem);
		console.log(newItem);
	}
	return result;
}

// Translate the input and write to a file
const fs = require('fs');

translateInput(input)
  .then((result) => {
    fs.writeFileSync('./output.js', `module.exports = ${JSON.stringify(result, null, 2)};`);
    console.log('Translation done.');
  })
  .catch((err) => console.error('Translation error:', err));