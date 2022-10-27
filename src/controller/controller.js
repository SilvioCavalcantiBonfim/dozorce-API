const Firebase = require("firebase/compat/app");
const CryptoJS = require("crypto-js");
require('firebase/compat/database');
require('dotenv').config()

const firebaseConfig = {
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_AUTHDOMAIN,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
    appId: process.env.FIREBASE_APPID
};

Firebase.initializeApp(firebaseConfig);

const db = Firebase.database();

exports.guild = async (req, res, next) => {
    await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            'Authorization': req.headers.token_type + ' ' + CryptoJS.AES.decrypt(req.headers.access_token, process.env.AES_SECRET_KEY).toString(CryptoJS.enc.Utf8)
        }
    }).then(async r => {
        const guilds_list_aux = await r.json();

        if ('code' in guilds_list_aux) {
            res.status(200).send({ code: 1004, description: 'Invalid token in request.' });
            return
        }

        if(guilds_list_aux.filter(e => e.id === req.params.id).length === 0){
            res.status(200).send({ code: 1005, description: 'Invalid Access.' });
            return
        }


        const data = {
            id: guilds_list_aux.filter(e => e.id === req.params.id)[0].id,
            name: guilds_list_aux.filter(e => e.id === req.params.id)[0].name,
            icon: (guilds_list_aux.filter(e => e.id === req.params.id)[0].icon === null) ? 'https://cdn.discordapp.com/embed/avatars/0.png' : 'https://cdn.discordapp.com/icons/' + guilds_list_aux.filter(e => e.id === req.params.id)[0].id + '/' + guilds_list_aux.filter(e => e.id === req.params.id)[0].icon
        }
        res.status(200).send(data)
    }).catch(e => {
        res.status(200).send({ code: 1002, description: 'API does not communicate Discord Server.' })
    });
}

exports.guild_verification = async (req, res, next) => {
    await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            'Authorization': req.headers.token_type + ' ' + CryptoJS.AES.decrypt(req.headers.access_token, process.env.AES_SECRET_KEY).toString(CryptoJS.enc.Utf8)
        }
    }).then(async r => {
        const guilds_list_aux = await r.json();

        if ('code' in guilds_list_aux) {
            res.status(200).send({ code: 1004, description: 'Invalid token in request.' });
            return
        }

        if(guilds_list_aux.filter(e => e.id === req.params.id).length === 0){
            res.status(200).send({ code: 1005, description: 'Invalid Access.' });
            return
        }


        const data = {
            id: guilds_list_aux.filter(e => e.id === req.params.id)[0].id,
            name: guilds_list_aux.filter(e => e.id === req.params.id)[0].name,
            icon: (guilds_list_aux.filter(e => e.id === req.params.id)[0].icon === null) ? 'https://cdn.discordapp.com/embed/avatars/0.png' : 'https://cdn.discordapp.com/icons/' + guilds_list_aux.filter(e => e.id === req.params.id)[0].id + '/' + guilds_list_aux.filter(e => e.id === req.params.id)[0].icon
        }
        
        db.ref('/').child(req.params.id).once("value").then(snapshot => {
            res.status(200).send({...data, register: snapshot.val()});
        }).catch(e => {
            res.status(200).send({ code: 1003, description: 'API does not communicate Firebase.' })
        })
    }).catch(e => {
        res.status(200).send({ code: 1002, description: 'API does not communicate Discord Server.' })
    });
}


exports.guilds = async (req, res, next) => {
    await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            'Authorization': req.headers.token_type + ' ' + CryptoJS.AES.decrypt(req.headers.access_token, process.env.AES_SECRET_KEY).toString(CryptoJS.enc.Utf8)
        }
    }).then(async r => {
        const guilds_list_aux = await r.json();

        if ('code' in guilds_list_aux) {
            res.status(200).send({ code: 1004, description: 'Invalid token in request.' });
            return
        }
        res.status(200).send(guilds_list_aux.filter(e => e.owner).map(e => e.id));
    }).catch(e => {
        res.status(200).send({ code: 1002, description: 'API does not communicate Discord Server.' })
    });
}

exports.profile = async (req, res, next) => {

    await fetch('https://discord.com/api/users/@me', {
        headers: {
            'Authorization': req.headers.token_type + ' ' + CryptoJS.AES.decrypt(req.headers.access_token, process.env.AES_SECRET_KEY).toString(CryptoJS.enc.Utf8)
        }
    }).then(async r => {
        const data = await r.json();

        if ('code' in data) {
            res.status(200).send({ code: 1004, description: 'Invalid token in request.' });
            return
        }

        const return_data = {
            id: data.id,
            username: data.username + "#" + data.discriminator,
            avatar: 'https://cdn.discordapp.com/avatars/' + data.id + '/' + data.avatar,
            banner: (data.banner !== null) ? 'https://cdn.discordapp.com/banners/' + data.id + '/' + data.banner + '?size=512' : null
        }

        res.status(200).send(return_data);
    }).catch(e => {
        res.status(200).send({ code: 1002, description: 'API does not communicate Discord Server.' })
    })
}

exports.auth = async (req, res, next) => {
    const FORM = {
        'client_id': process.env.OAUTH2_CLIENT_ID,
        'client_secret': process.env.OAUTH2_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': req.headers.code,
        'redirect_uri': process.env.OAUTH2_REDIRECT_URI
    };

    const params = new URLSearchParams();

    for (var key in FORM)
        params.append(key, FORM[key]);

    await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        body: params,
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        }
    }).then(async (r) => {

        const data_tokens = await r.json();

        if ('error' in data_tokens)
            res.status(200).send({ code: 1001, description: 'Invalid code in request.' });
        else
            res.status(200).send({ access_token: CryptoJS.AES.encrypt(data_tokens.access_token, process.env.AES_SECRET_KEY).toString(), expires_in: data_tokens.expires_in, token_type: data_tokens.token_type });

    }).catch(e => {
        res.status(200).send({ code: 1002, description: 'API does not communicate Discord Server.' })
    });

}