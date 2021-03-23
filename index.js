require('dotenv').config({ path: 'config.env' });
const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const prefix = '-';

client.on('message', function (message) {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(' ');
  const command = args.shift().toLowerCase();
  if (command === 'ping') {
    const timeTaken = Date.now() - message.createdTimestamp;
    message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
  }
});

client.login(process.env.BOT_TOKEN);

const puppeteer = require('puppeteer-core');
var Promise = require('bluebird');
const hb = require('handlebars');

let options = {
  format: 'A4',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

let file = { url: 'https://example.com' };

(async function generatePdf(file, options, callback) {
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

      return Buffer.from(Object.values(data));
    })
    .asCallback(callback);
})(file, options, () => console.log('Done'));

// (async function generatePdf(file, options, callback) {
//   // we are using headless mode
//   let args = ['--no-sandbox', '--disable-setuid-sandbox'];
//   if (options.args) {
//     args = options.args;
//     delete options.args;
//   }

//   const browser = await puppeteer.launch({
//     args: args,
//   });
//   const page = await browser.newPage();

//   if (file.content) {
//     console.log('Compiling the template with handlebars');
//     // we have compile our code with handlebars
//     const template = hb.compile(file.content, { strict: true });
//     const result = template(file.content);
//     const html = result;

//     // We set the page content as the generated html by handlebars
//     await page.setContent(html);
//   } else {
//     await page.goto(file.url, {
//       waitUntil: 'networkidle0', // wait for page to load completely
//     });
//   }

//   return Promise.props(page.pdf(options))
//     .then(async function (data) {
//       await browser.close();

//       return Buffer.from(Object.values(data));
//     })
//     .asCallback(callback);
// })();

// async function generatePdfs(files, options, callback) {
//   // we are using headless mode
//   let args = ['--no-sandbox', '--disable-setuid-sandbox'];
//   if (options.args) {
//     args = options.args;
//     delete options.args;
//   }
//   const browser = await puppeteer.launch({
//     args: args,
//   });
//   let pdfs = [];
//   const page = await browser.newPage();
//   for (let file of files) {
//     if (file.content) {
//       console.log('Compiling the template with handlebars');
//       // we have compile our code with handlebars
//       const template = hb.compile(file.content, { strict: true });
//       const result = template(file.content);
//       const html = result;
//       // We set the page content as the generated html by handlebars
//       await page.setContent(html);
//     } else {
//       await page.goto(file.url, {
//         waitUntil: 'networkidle0', // wait for page to load completely
//       });
//     }
//     let pdfObj = JSON.parse(JSON.stringify(file));
//     delete pdfObj['content'];
//     pdfObj['buffer'] = Buffer.from(Object.values(await page.pdf(options)));
//     pdfs.push(pdfObj);
//   }

//   return Promise.resolve(pdfs)
//     .then(async function (data) {
//       await browser.close();
//       return data;
//     })
//     .asCallback(callback);
// }
