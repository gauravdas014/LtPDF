exports.generatePdf = async (url) => {
  try {
    const puppeteer = require('puppeteer');
    const Promise = require('bluebird');
    const hb = require('handlebars');
    const fs = require('fs');

    let options = {
      format: 'A4',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };

    let file = { url };

    (async function generatePdf(file, options, callback) {
      console.log(file);
      // we are using headless mode
      let args = ['--no-sandbox', '--disable-setuid-sandbox'];
      if (options.args) {
        args = options.args;
        delete options.args;
      }

      const browser = await puppeteer.launch({
        args: args,
      });
      const page = await browser.newPage();

      if (file.content) {
        console.log('Compiling the template with handlebars');
        // we have compile our code with handlebars
        const template = hb.compile(file.content, { strict: true });
        const result = template(file.content);
        const html = result;

        // We set the page content as the generated html by handlebars
        await page.setContent(html);
      } else {
        await page.goto(file.url, {
          waitUntil: 'networkidle0', // wait for page to load completely
        });
      }

      return Promise.props(page.pdf(options))
        .then(async function (data) {
          await browser.close();
          console.log(Buffer.from(Object.values(data)));
          fs.writeFileSync('example.pdf', Buffer.from(Object.values(data)));
          return Buffer.from(Object.values(data));
        })
        .asCallback(callback);
    })(file, options, () => {
      console.log('Done');
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
