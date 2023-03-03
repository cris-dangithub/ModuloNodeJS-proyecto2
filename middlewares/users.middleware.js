const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.validIfEmailExistsToCreate = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await Users.findOne({
    where: {
      email,
      status: true,
    },
  });

  if (user) {
    return next(
      new AppError(
        `This email is already in use. Please, try with another one or log in`,
        400
      )
    );
  }
  next();
});

exports.validIfUserExistsByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  // Verificar existencia del usuario (usar algun middleware)
  const user = await Users.findOne({
    where: {
      email: email.toLowerCase(),
      status: true,
    },
  });

  if (!user) {
    return next(new AppError(`User not found`, 404));
  }
  req.user = user;
  next();
});

exports.validIfUserExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Obtener usuario
  const user = await Users.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!user) {
    return next(new AppError(`User not found`, 404));
  }

  req.user = user;
  next();
});
