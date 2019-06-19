var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();

var Usuario = require('../models/usuario');

app.post('/', (req, res) => {
    var body = req.body;
    Usuario.findOne({email: body.email}, (err, usrFind) => {
        if (!!err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando el usuario',
                errors: err
            });
        }
        if (!!usrFind) {
            // Generacion JWT
            if (bcrypt.compareSync(body.password, usrFind.password)) {
                usrFind.password = '*********';
                var token = jwt.sign({usrFind}, SEED, {expiresIn: 14400});
                res.status(200).json({
                    ok: true,
                    mensaje: "login post correcto",
                    usuario: usrFind,
                    token: token
                });
            } else {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'Credenciales inválidas',
                    errors: { message: 'Credenciales inválidas'}
                });
            }
        } else {
            return res.status(404).json({
                ok: false,
                mensaje: 'No se ha encontrado el usuario',
                errors: { message: 'No existe un usuario con el email'}
            });
        }
    });
});

module.exports = app;