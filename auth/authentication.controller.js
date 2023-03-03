const { genSalt, hash, compare } = require('bcryptjs');
const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');
const generateJWT = require('../utils/jwt');

const createUser = catchAsync(async (req, res, next) => {
  // Recibir los datos del body
  const { name, email, password, role = 'normal' } = req.body;

  // Encriptar contraseña
  const salt = await genSalt(10);
  const encryptedPassword = await hash(password, salt);

  // Crear el usuario
  const newUser = await Users.create({
    name,
    email: email.toLowerCase(),
    password: encryptedPassword,
    role,
  });

  // Generar token
  const token = await generateJWT(newUser.id);

  // Mandar respuesta al cliente
  const objExtra = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
  };
  appSuccess(res, 200, `User has been created successfully`, {
    objExtra,
    token,
  });
});

const loginUser = catchAsync(async (req, res, next) => {
  const { password } = req.body;
  const { user } = req;

  // Verificar la contraseña del usuario
  const isCorrectPassword = await compare(password, user.password);

  if (!isCorrectPassword) {
    return next(new AppError(`Incorrect email or password`, 401));
  }

  // Generar el token
  const token = await generateJWT(user.id);

  // Enviar respuesta al cleinte
  appSuccess(res, 200, `Successfully logged`, {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});



module.exports = {
  createUser,
  loginUser,
};
