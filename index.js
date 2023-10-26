const TelegramApi = require("node-telegram-bot-api");
const { gameOption, againOption } = require("./options");
const token = "6708291526:AAHd4XetD-hyE_t_dwybEd1b3iBfRhKbuMQ";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "Я загадал цифру от 0 до 9, а ты угадай!");
    const rarndomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = rarndomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOption);
};

const start = async () => {
    await bot.setMyCommands([
        {
            command: "/start",
            description: "Начальное приветствие",
        },
        {
            command: "/info",
            description: "Информация о пользователе",
        },
        {
            command: "/game",
            description: "Игра угадай цифру!",
        },
    ]);

    bot.on("message", async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === "/start") {
            await bot.sendSticker(chatId, "CAACAgIAAxkBAAMeZTFi2LMRRCjsivNBF7IfnOFw9CYAAjEAA38nrA7Id41pOx6VeTAE");
            return bot.sendMessage(chatId, `Добро пожаловать!`);
        } else if (text === "/info") {
            return bot.sendMessage(chatId, `Привет, ${msg.from.first_name}`);
        } else if (text === "/game") {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "Я тебя на понял");
    });

    bot.on("callback_query", async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === "/again") {
            return startGame(chatId);
        }
        if (Number(data) === chats[chatId]) {
            return await bot.sendMessage(chatId, `Угадал! Моя цифра ${chats[chatId]}`, againOption);
        } else {
            return await bot.sendMessage(chatId, `Не угадал, я загадывал цифру ${chats[chatId]}`, againOption);
        }
    });
};

start();
