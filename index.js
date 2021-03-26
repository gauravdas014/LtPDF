require('dotenv').config({ path: 'config.env' });
const puppeteer = require('puppeteer');
const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

const prefix = '-';

client.on('message', async function (message) {
  try {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    if (command === 'cvrt') {
      const url = message.content.split(' ')[1];
      if (url.startsWith('https://') || url.startsWith('http://')) {
        let file = { url };
        let options = {
          format: 'A4',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        };
        let args = ['--no-sandbox', '--disable-setuid-sandbox'];
        await message.reply('Converting webpage to PDF, please wait...');
        const browser = await puppeteer.launch({
          args: args,
        });
        const page = await browser.newPage();
        await page.goto(file.url, {
          waitUntil: 'networkidle0',
        });
        const data = await page.pdf(options);
        await browser.close();
        await message.reply('Generating PDF, please wait...');
        console.log(Buffer.from(Object.values(data)));
        const fileName = Date.now();
        fs.writeFileSync(
          `./pdfs/${fileName}` + '.pdf',
          Buffer.from(Object.values(data))
        );
        await message.channel.send('Here is your pdf.', {
          files: [`./pdfs/${fileName}.pdf`],
        });
        fs.unlink(`./pdfs/${fileName}.pdf`, function (err) {
          if (err) {
            throw err;
          } else {
            console.log('Successfully deleted the file.');
          }
        });
      } else {
        await message.reply('URL must start with http:// or https://');
      }
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});

client.login(process.env.BOT_TOKEN);