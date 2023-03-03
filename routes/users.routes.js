const { Router } = require('express');
const { check } = require('express-validator');
const {
  protect,
  protectAccountOwner,
} = require('../auth/authorization.middleware');
const { createUser, loginUser } = require('../auth/authentication.controller');
const { updateUser, deleteUser } = require('../controllers/user.controller');
const {
  validIfEmailExistsToCreate,
  validIfUserExistsByEmail,
  validIfUserExists,
} = require('../middlewares/users.middleware');
const { validFields } = require('../middlewares/validField.middleware');

const router = Router();

//? Ruta para crear un usuario (esto iría normalmente en un auth.controller)
router.post(
  '/signup',
  [
    check('name', 'The nme is mandatory').not().isEmpty(),
    check('name', 'The name must be a string').isString(),
    check('email', 'The email is mandatory').not().isEmpty(),
    check('email', 'The email must be in a right format').isEmail(),
    check('password', 'The password is mandatory').not().isEmpty(),
    check('password', 'The password must be a string').isString(),
    validFields,
    validIfEmailExistsToCreate,
  ],
  createUser
);

//? Ruta para logearse (esto iría normalmente en un auth.controller)
router.post(
  '/login',
  [
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password must be mandatory').not().isEmpty(),
    check('password', 'The password must be a string').isString(),
    validFields,
    validIfUserExistsByEmail,
  ],
  loginUser
);

// ----------- Rutas protegidas por token ----------
router.use(protect);

// Ruta para actualizar el perfil de un usuario
router.patch(
  '/:id',
  [
    check('name', 'The name is mandatory').not().isEmpty(),
    check('name', 'The name must be a string').isString(),
    check('email', 'The email is mandatory').not().isEmpty(),
    check('email', 'The email must be in a right format').isEmail(),
    validFields,
    validIfUserExists,
    protectAccountOwner,
  ],
  updateUser
);

// Ruta para deshabilitar cuenta de usuario
router.delete('/:id', [validIfUserExists, protectAccountOwner], deleteUser);

module.exports = {
  usersRouter: router,
};
