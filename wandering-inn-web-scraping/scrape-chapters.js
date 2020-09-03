const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');

function updateChapterData() {
    fs.readFile('./table-of-contents.json', (err, data) => {
        const chapters = JSON.parse(data).chapters;
        chapters.forEach(({title, link}, index) => {
            setTimeout(() => {}, 5);
            let path = `./chapters/${index}-${title}`;
            if (!fs.existsSync(path) || fs.statSync(path).size < 20) {
                axios.get(link)
                .then( (html) => {
                    const $ = cheerio.load(html.data);
                    $('.entry-content').each((i, elem) => {
                        fs.writeFileSync(path, $(elem).text(), (err) => err ? console.log(`FAILED TO WRITE ${title} TO FILE`) : console.log(`Chapter ${title} written to file.`));
                    });
                }).catch(err => {
                    console.log(`Error: ${err}`)
                });    
            }
        });
    })
}

updateChapterData();