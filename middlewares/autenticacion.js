var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

/**
 * Midleware para verificar el token
 */
exports.verificaToken = function (req, res, next) {
    var token = req.query.token;
    jwt.verify(token, SEED, (err, decoded) => {
        if (!!err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: err
            });
        }
        /* res.status(200).json({
            ok: true,
            decoded: decoded // Corresponde al objeto que se almacena en el token
        }); */
        req.usuario = decoded.usrFind;
        next();
    });
};
