const axios = require('axios').default;
const cheerio = require('cheerio');
let data = [];
async function scrape() {
    const html = await axios.get('https://wanderinginn.com/table-of-contents/');
    const $ = await cheerio.load(html.data);
    $('p > a').each( (index, elem) => {
        const chapter = $(elem).text();
        const link = $(elem).attr('href');
        data.push({chapter, link});
    });
}

scrape().then( () => {
    console.log(data);
})