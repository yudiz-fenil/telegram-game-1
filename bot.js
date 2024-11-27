const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const bodyParser = require('body-parser');

const token = '8069138876:AAFB8BerXRXqaF7VLLWS_GCTVPkIm6dvnXo';
const GAME_URL = 'https://game.yudiz.com/bounce-blitz/';

const bot = new Telegraf(token);
const app = express();
const port = 3027;

app.use(bodyParser.json());

// Handle /start command with referral
bot.command('start', async (ctx) => {
  try {
    // Get the referral code from the start command if it exists
    const startPayload = ctx.message.text.split(' ')[1];

    // Construct the game URL with the referral code using the new format
    const gameUrl = startPayload
      ? `${GAME_URL}?tgWebAppStartParam=${startPayload}`
      : GAME_URL;

    await ctx.replyWithMarkdown(
      `*Bounce Blitz*\n\n` +
      `🎮 Bounce the ball to break all the bricks!\n` +
      `🧩 Drag the tray to keep the ball in play.\n` +
      `🏆 Score points and conquer tough levels!\n` +
      `🌟 Three lives to master the challenge.\n` +
      `🚀 Fun, fast-paced, and addictive action!`,
      Markup.inlineKeyboard([
        Markup.button.webApp('START', gameUrl)
      ])
    );
  } catch (error) {
    console.error('Error in start command:', error);
    ctx.reply('Sorry, something went wrong. Please try again.');
  }
});

// Webhook route for Telegram
app.post(`/bot${token}`, (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`Express server is running on port ${port}`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// Set up webhook
const url = 'https://telegrams1.game.webdevprojects.cloud/bot' + token;
bot.telegram.setWebhook(url);