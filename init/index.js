var pkginfo = require('pkginfo')(module,'version', 'author', 'description');

console.log("█████████████████████████████████████████████████████████\n");
console.log("██████   ██████  ███████  ██████  ██████   ██████ ███████ \n██   ██ ██    ██    ███  ██    ██ ██   ██ ██      ██      \n██   ██ ██    ██   ███   ██    ██ ██████  ██      █████   \n██   ██ ██    ██  ███    ██    ██ ██   ██ ██      ██      \n██████   ██████  ███████  ██████  ██   ██  ██████ ███████");
console.log(module.exports.version)
console.log("█████████████████████████████████████████████████████████\n");

console.log('\033[1;37mDeveloper by '+module.exports.author.name);
console.log('\nDescription:\033[0m '+module.exports.description+'\n\n');