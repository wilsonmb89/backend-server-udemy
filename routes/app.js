var express = require('express');
var app = express();

// JSON Template de respuestas
var todo_ok = {'ok':true, 'mensaje': 'Peticion realizada correctamente'};

// Rutas
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });
});

app.get('/hola', (req, res, next) => {
    res.status(404).json(todo_ok);
});

module.exports = app;