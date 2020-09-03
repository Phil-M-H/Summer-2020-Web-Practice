const axios = require('axios').default;
const cheerio = require('cheerio');
const fs = require('fs');

const title = '7-37';
axios.get('https://wanderinginn.com/2020/07/29/7-37/')
            .then( (html) => {
                const $ = cheerio.load(html.data);
                $('.entry-content').each((i, elem) => {
                    fs.writeFile(`./chapters/${title}`, $(elem).text(), (err) => err ? console.log(`FAILED TO WRITE ${title} TO FILE`) : console.log(`Chapter ${title} written to file.`));
                });
            
            });