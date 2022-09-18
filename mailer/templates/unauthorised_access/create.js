const fs = require('fs')
const path = require('path')
const html = fs.readFileSync(path.join(__dirname, './index.html'), 'utf8')

module.exports = ({ username, addon }) => {
    return html
        .replace('{{{username}}}', username)
        .replace('{{{info}}}', `Addon License for ${addon} - Soft UI`)
        .replace('{{{date}}}', new Date().toLocaleDateString());
}