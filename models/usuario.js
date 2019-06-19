var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values:['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var usuarioEsquema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El email es requerido'] },
    password: { type: String, required: [true, 'El password es requerido'] },
    img: { type: String, required: false },
    role: { type: String, required: [true, 'El rol es requerido'], default: 'USER_ROLE', enum: rolesValidos }
});

usuarioEsquema.plugin(uniqueValidator, {message: "{PATH} debe ser único"});

module.exports = mongoose.model('Usuario', usuarioEsquema);