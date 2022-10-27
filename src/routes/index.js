const controller = require('../controller/controller');

module.exports = (app) => {
    app.get('/GUILDS/:id',controller.guild);
    app.get('/GUILDS/:id/REGISTER',controller.guild_verification);
    app.get('/GUILDS',controller.guilds);
    app.get('/PROFILE',controller.profile);
    app.post('/AUTH',controller.auth);
}