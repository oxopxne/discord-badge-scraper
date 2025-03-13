const { badges, badgeCategories } = require('./newbie/config');
document.getElementById("start").addEventListener("click", () => {
    const token = document.getElementById("token").value;
    const guildId = document.getElementById("guildId").value;
    const statusElement = document.getElementById("status");
    const resultsContainer = document.getElementById("results");

    if (!token || !guildId) {
        statusElement.textContent = "Lütfen tüm alanları doldurun!";
        return;
    }

    statusElement.textContent = "İşlem başlatılıyor...";
    resultsContainer.innerHTML = ""; 

    window.electron.startBadgeCheck(token, guildId);
});

window.electron.onBadgeCheckResult((results) => {
    const statusElement = document.getElementById("status");
    const resultsContainer = document.getElementById("results");

    statusElement.textContent = "İşlem tamamlandı!";

    if (results.length === 0) {
        resultsContainer.innerHTML = "<li>Bu sunucuda özel rozetlere sahip kullanıcı bulunamadı.</li>";
    } else {
        results.forEach(user => {
            const li = document.createElement("li");
            const avatarUrl = user.avatar 
                ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
            const badgesWithImages = user.badges.map(badge => {
                switch (badge) {
                    case "activedev.png": return '<img src="badges/activedev.png" alt="Active Developer" style="width: 20px; height: 20px;">';
                    case "early.png": return '<img src="badges/early.png" alt="Early Supporter" style="width: 20px; height: 20px;">';
                    case "boost.png": return '<img src="badges/boost.png" alt="Boost Badge" style="width: 20px; height: 20px;">';
                    case "hypesquad.png": return '<img src="badges/hypesquad.png" alt="Hypesquad Events" style="width: 20px; height: 20px;">';
                    case "bughunter.png": return '<img src="badges/bughunter.png" alt="Bug Hunter" style="width: 20px; height: 20px;">';
                    case "nitro.png": return '<img src="badges/nitro.png" alt="Nitro" style="width: 20px; height: 20px;">';
                    default: return badge;
                }
            });

            li.innerHTML = `
                <img src="${avatarUrl}" alt="Avatar" style="width: 40px; height: 40px; border-radius: 50%; vertical-align: middle; margin-right: 10px;">
                <strong>${user.username}</strong>: ${badgesWithImages.join(" ")}
            `;
            resultsContainer.appendChild(li);
        });
    }
});

document.getElementById("copyAll").addEventListener("click", () => {
    const resultsContainer = document.getElementById("results");
    const listItems = resultsContainer.querySelectorAll("li");
    const textToCopy = Array.from(listItems).map(li => {
        const userIdMatch = li.innerHTML.match(/avatars\/(\d+)\//);
        const userId = userIdMatch ? userIdMatch[1] : null;
        return userId ? `<@${userId}>` : '';
    }).filter(Boolean).join("\n");

    if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert("Tüm kullanıcı ID'leri kopyalandı!");
        }).catch(err => {
            console.error("Kopyalama hatası:", err);
        });
    } else {
        alert("Kopyalanacak kullanıcı ID'si bulunamadı.");
    }
});

function renderBadges() {
    const badgesContainer = document.getElementById("badges-container");
    badgesContainer.innerHTML = ""; // Clear existing badges

    for (const [category, badgeKeys] of Object.entries(badgeCategories)) {
        const categoryDiv = document.createElement("div");
        categoryDiv.innerHTML = `<h3>${category}</h3>`;

        badgeKeys.forEach(key => {
            const badge = badges[key];
            if (badge) {
                const badgeElement = document.createElement("span");
                badgeElement.innerHTML = badge;
                categoryDiv.appendChild(badgeElement);
            }
        });

        badgesContainer.appendChild(categoryDiv);
    }
}
window.electron.onBadgeCheckError((error) => {

    document.getElementById("status").textContent = error;
});

