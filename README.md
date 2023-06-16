# vocaboost-translate
Translates default word lists into specified languages.

### Setup

Install [translate-tools/core](https://github.com/translate-tools/core).

### Steps

1. Create an `.js` file in root directory, follow the format of existing wordlist files, e.g. `gre.js` and `toefl.js`
1. Set up filenames in index `index.js`, for example
    ```js
    // TODO: setup filenames
    const input_filename = './toefl.js'
    const output_filename =  './toefl_output.js'
    ```
1. Set up languages to be translated to in `index.js`, for example
    ```js
    async function translateMeaning(text) {
      const result = {};
      // TODO: setup languages
      for (const lang of ['es', 'zh_TW', 'zh_CN', 'ja', 'ko', 'th']) {
        result[lang] = await translator.translate(text, 'en', lang);
      }
      return result;
    }
    ```
3. Run `node index.js`
4. The output `.js` file will be created with meaning translations of the specified languages
