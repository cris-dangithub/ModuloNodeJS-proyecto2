const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');

const updateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const { user } = req;
  // Actualizar usuario
  await user.update({ name, email: email.toLowerCase() });

  // Mandar respuesta al cliente
  const { id, status, role } = user;
  appSuccess(res, 200, `The user has been updated successfully`, {
    user: { id, name, email: email.toLowerCase(), status, role },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  // Actualizar el estado del usuario
  await user.update({ status: false });

  // Mandar respuesta al cliente
  appSuccess(res, 200, `User has been deleted successfully`);
});

module.exports = { updateUser, deleteUser };
