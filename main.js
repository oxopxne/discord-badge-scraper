const { app, BrowserWindow, ipcMain } = require("electron");
const { Client } = require("discord.js-selfbot-v13");
const path = require("path");

let mainWindow;
const client = new Client();

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 500,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    mainWindow.loadFile("index.html");
});

ipcMain.on("start-badge-check", async (event, { token, guildId }) => {
    try {
        await client.login(token);
        const guild = await client.guilds.fetch(guildId);
        const members = await guild.members.fetch();
        let badgeResults = [];

        members.forEach(member => {
            const badges = [];
            const flags = member.user.flags?.toArray() || [];

            if (flags.includes("EARLY_SUPPORTER")) badges.push("early.png");
            if (flags.includes("HYPESQUAD_EVENTS")) badges.push("hypesquad.png");
            if (flags.includes("BUG_HUNTER_LEVEL_1")) badges.push("bug_hunter_1.png");
            if (flags.includes("BUG_HUNTER_LEVEL_2")) badges.push("bug_hunter_2.png");
            if (flags.includes("VERIFIED_DEVELOPER")) badges.push("developer.png");
            if (flags.includes("ACTIVE_DEVELOPER")) badges.push("activedev.png");
            if (flags.includes("DISCORD_PARTNER")) badges.push("partner.png");
            if (flags.includes("HYPESQUAD_BRAVERY")) badges.push("hypesquad_bravery.png");
            if (flags.includes("HYPESQUAD_BRILLIANCE")) badges.push("hypesquad_brilliance.png");
            if (flags.includes("HYPESQUAD_BALANCE")) badges.push("hypesquad_balance.png");
            if (flags.includes("EARLY_VERIFIED_BOT_DEVELOPER")) badges.push("developer.png");

            if (badges.length > 0) {
                badgeResults.push({
                    id: member.user.id,
                    username: member.user.tag,
                    avatar: member.user.avatar,
                    badges: badges
                });
            }
        });

        event.reply("badge-check-result", badgeResults);

    } catch (err) {
        event.reply("badge-check-error", `Hata: ${err.message}`);
    }
});

