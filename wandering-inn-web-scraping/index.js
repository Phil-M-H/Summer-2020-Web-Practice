const fs = require('fs');
const axios = require('axios').default;
const cheerio = require('cheerio');
let data = { chapters: [] };
async function scrape() {
    const html = await axios.get('https://wanderinginn.com/table-of-contents/');
    const $ = cheerio.load(html.data);
    $('p > a').each((i, elem) => {
        const chapter = $(elem).text();
        const link = $(elem).attr('href');
        data.chapters.push({ chapter, link });
    });
}
async function scrapeChapter(index) {
    const html = await axios.get(data.chapters[i].link);
    const $ = cheerio.load(html.data);
    data.chapters[i].time = $('.entry-date').attr('datetime');

    console.log(data.chapters[i]);
}


async function scrapeWanderingInn() {
    await scrape()
    .then(() => {
        // data.chapters.some( (chapData, index) => { // TODO try array.some
        //     if (index > 3) return true;
        //     scrapeChapter(chapData);
        // });
        for (i = 0; i < 3; i++) {
            scrapeChapter(i);
        }

    });
};

scrapeWanderingInn().then(() => {
    const stringifiedData = JSON.stringify(data, null, 4);
    console.log(stringifiedData);
    fs.writeFileSync('output-data.json', stringifiedData);
});


/* Data for dataset
[{word1, count}, {word2, count}, .....]
total words per chapter | total words
chapter date
total comments
number of non-avatar images
*/