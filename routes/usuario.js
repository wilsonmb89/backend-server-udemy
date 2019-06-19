var express = require('express');
var bcrypt = require('bcryptjs');

var app = express();

var Usuario = require('../models/usuario');
var mdAutenticacion = require('../middlewares/autenticacion');

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Get de Usuarios'
    });
});

/**
 * Operacion GET para obtener todos los usuarios
 */

app.get('/getAllBasic', (req, res, next) => {
    Usuario.find({}, (err, usuarios) => {
        if (!!err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'get  de Usuarios',
            usuarios: usuarios
        });
    });
});

app.get('/getAll', mdAutenticacion.verificaToken, (req, res, next) => {
    Usuario.find({}, 'nombre email img role').exec(
        (err, usuarios) => {
            if (!!err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuarios',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuariotoken: req.usuario,
                mensaje: 'get de Usuarios',
                usuarios: usuarios
            });
        }
    );
});

/**
 * Operación POST para añadir un usuario
 */

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    usuario.save((err, usrOk) => {
        if (!!err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usrOk,
            usuariotoken: req.usuario
        });
    });
});

/**
 * Operación PUT para actualizar un usuario
 */

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    Usuario.findById(id, (err, usrResult) => {
        if (!!err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error buscando el usuario',
                errors: err
            });
        }
        if (!!usrResult) {
            usrResult.nombre = !!body.nombre ? body.nombre : usrResult.nombre;
            usrResult.email = !!body.email ? body.email : usrResult.nomemailbre;
            usrResult.role = !!body.role ? body.role : usrResult.role;
            usrResult.save((err, usrSave) => {
                if (!!err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error actualizando el usuario',
                        errors: err
                    });
                }
                usrSave.password = "*******";
                res.status(200).json({
                    ok: true,
                    usuario: usrSave,
                    usuariotoken: req.usuario
                });
            });
        } else {
            return res.status(404).json({
                ok: false,
                mensaje: 'Usuario ' + id + ' , no encontrado',
                errors: { message: 'No existe un usuario con el ID'}
            });
        }

    });
});

/**
 * Operacion DELETE para eliminar un usuario
 */
app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    Usuario.deleteOne({_id: id}, (err, result) => { // antes se usaba findAndRemove per esta deprecado
        if (!!err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error eliminando el usuario',
                errors: err
            });
        }
        if (result.deletedCount === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No hay usuario que eliminar',
                errors: { message: 'No existe un usuario con el ID'}
            });
        }
        res.status(200).json({
            ok: true,
            result: result,
            usuariotoken: req.usuario
        });
    });
});

module.exports = app;