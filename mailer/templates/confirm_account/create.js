const fs = require('fs')
const path = require('path')
const html = fs.readFileSync(path.join(__dirname, './index.html'), 'utf8')

module.exports = ({ username, confirm_token }) => {
    return html
        .replace('{{{CONFIRM_TOKEN}}}', confirm_token)
        .replace('{{{CONFIRM_TOKEN}}}', confirm_token)
        .replace('{{{CONFIRM_TOKEN}}}', confirm_token)
        .replace('{{{USERNAME}}}', username)
}