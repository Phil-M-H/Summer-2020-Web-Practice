const fs = require('fs');
function readChapterList() {
    fs.readFile('./table-of-contents.json', (err, data) => {
        const chapters = JSON.parse(data).chapters;
        chapters.forEach( ({title, link}) => {
            
        });
    })
}
readChapterLinks();