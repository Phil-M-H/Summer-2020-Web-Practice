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
    const html = await axios.get(data.chapters[index].link);
    const $ = cheerio.load(html.data);
    data.chapters[index].time = $('.entry-date').attr('datetime');

    console.log(data.chapters[index]);
}


// async function scrapeWanderingInn() {
//     await scrape()
//     .then(() => {
//         // data.chapters.some( (chapData, index) => { // TODO try array.some
//         //     if (index > 3) return true;
//         //     scrapeChapter(chapData);
//         // });
//         for (i = 0; i < 3; i++) {
//             scrapeChapter(i);
//         }

//     });
// };

scrape().then(async () => {
    await Promise.all(data.chapters.map((chapter, index) => {
        scrapeChapter(index);
        return chapter;
    }));

    for await (const chapter of data.chapters) {

    }

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