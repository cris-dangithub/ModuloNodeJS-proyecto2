const { verify } = require('jsonwebtoken');
const Users = require('../models/users.model');
const { catchAsync } = require('../utils/catchAsync');
const { promisify } = require('util');
const AppError = require('../utils/appError');

const protect = catchAsync(async (req, res, next) => {
  // 1. Verificar que el token venga
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2. Verificar y decodificar el token (Si no ha expirado)
  const decoded = await promisify(verify)(token, process.env.SECRET_JWT_SEED);
  // 3. Checkear que el usuario exista
  const user = await Users.findOne({
    where: {
      id: decoded.id,
      status: true,
    },
  });
  if (!user) {
    return next(
      new AppError('The owner of this token is not longer available', 401)
    );
  }
  //// 4. Verificar la fecha de actualización de contraseña del usuario (no aplica a este ejercicio)
  // 5. Mandar el usuario en sesión
  req.sessionUser = user;
  next();
});

const protectAccountOwner = catchAsync(async (req, res, next) => {
  // Obtener el usuario que viene de la request
  const { user, sessionUser } = req;

  if (user.id !== sessionUser.id && sessionUser.role !== 'superadmin') {
    return next(new AppError('You are not the owner of this account', 401));
  }
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // 1. Comprar los roles con el rol del usuario en sesión (el que viene del token)
    if (!roles.includes(req.sessionUser.role)) {
      return next(
        /*
          Codigo de estado 403: Forbiden (una petición rechazada). Es mas especifico
          para este tipo de casos como los roles
        */
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
module.exports = { protect, protectAccountOwner, restrictTo };
