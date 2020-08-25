const fs = require('fs');
const axios = require('axios').default;
const cheerio = require('cheerio');
let data = [];
async function scrape() {
    const html = await axios.get('https://wanderinginn.com/table-of-contents/');
    const $ = cheerio.load(html.data);
    $('p > a').each( (i, elem) => {
        const chapter = $(elem).text();
        const link = $(elem).attr('href');
        data.push({chapter, link});
    });
}
async function scrapeChapter(chapData) {
    const html = await axios.get(chapData.link);
    const $ = cheerio.load(html.data);
    chapData.time = $('.entry-date').attr('datetime');
    console.log(chapData);
}


async function scrapeWanderingInn() {
    scrape().then( () => {
        data.forEach((chapData, index) => {
            if (index > 3) throw 'Limiter reached';
            scrapeChapter(chapData);
        })
        
    })
}
// scrapeWanderingInn()
// .then( () => {
//     console.log(data);
// }).catch( () => {
//     console.log(data[0]);
// })

data = [{
    chapter: '1.00',
    link: 'https://wanderinginn.com/2016/07/27/1-00/',
    time: '2016-07-27T02:41:10+00:00'
  },{
    chapter: '1.01',
    link: 'https://wanderinginn.com/2016/07/27/1-01/',
    time: '2016-07-27T03:05:29+00:00'
  },{
    chapter: '1.03',
    link: 'https://wanderinginn.com/2016/08/07/1-03/',
    time: '2016-08-07T02:24:21+00:00'
  },{
    chapter: '1.02',
    link: 'https://wanderinginn.com/2016/07/30/1-02/',
    time: '2016-07-30T22:57:37+00:00'
  }];


// JSON.stringify(data)
let stringifiedData = [];
data.forEach( (element) => {
    stringifiedData.push(JSON.stringify(element));
});


console.log(stringifiedData);
// stringifiedData.forEach( element => {
    fs.writeFileSync('output-data.json', stringifiedData);
// });
