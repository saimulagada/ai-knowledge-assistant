const fs = require("fs");
const path = require("path");

function getWelcomeTemplate(name, verificationLink) {

    const filePath = path.join(
        __dirname,
        "templates",
        "welcomeEmail.html"
    );

    let html = fs.readFileSync(filePath, "utf8");

    html = html.replace("{{name}}", name);

    html = html.replace(
        "{{verificationLink}}",
        verificationLink
    );

    return html;
}

module.exports = {
    getWelcomeTemplate
};