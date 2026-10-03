const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const Tesseract = require('tesseract.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Bot起動成功！ ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const image = message.attachments.find(
        attachment => attachment.contentType?.startsWith('image/')
    );

    if (!image) return;

    console.log('画像を検出しました！');
    console.log('OCR開始...');

    try {
        const result = await Tesseract.recognize(
            image.url,
            'jpn',
            {
                logger: info => {
                    if (info.status === 'recognizing text') {
                        console.log(
                            `OCR進行中: ${Math.round(info.progress * 100)}%`
                        );
                    }
                }
            }
        );

        const text = result.data.text;

        console.log('--- OCR結果 ---');
        console.log(text);
        console.log('---------------');

        // とりあえず「エンベズラー」を検出対象にする
        if (text.includes('64')) {
            await message.reply('64を検出しました！');
        }

    } catch (error) {
        console.error('OCRエラー:', error);
    }
});

client.login(process.env.DISCORD_TOKEN);