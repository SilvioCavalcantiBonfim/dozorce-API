const controller = require('../controller/controller');

module.exports = (app) => {
    app.get('/PRESENCE/:id/:user_id',controller.presence);
    app.get('/PRESENCE/:id',controller.presence_global);
    app.get('/GUILDS',controller.guilds);
    app.get('/PROFILE',controller.profile);
    app.post('/AUTH',controller.auth);
}