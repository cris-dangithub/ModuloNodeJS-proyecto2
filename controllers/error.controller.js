const AppError = require('../utils/appError');

const handle500FalseErrors = (err, statusCode) => {
  return new AppError(err.message, statusCode);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Validar si el error es opracional o no (es decir, de programación)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'fail',
      message: 'Internal Server Error',
    });
  }
};

exports.globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    // Validaremos acá los errores con algun otro comportamiento
    if (err.parent?.code === '22P02') {
      const objMessage = {
        message: 'Some type of data send does not match was expected',
      };
      err = handle500FalseErrors(objMessage, 400);
    }
    // Lo mas probbable es que el token fue malobrado
    if (err.name === 'JsonWebTokenError') {
      // Se puede mandar tambien el error. Si el error no es tan especifico, mandar un objeto con la propiedad message
      err = handle500FalseErrors(err, 401);
    }
    // El token expira y lanza error 500
    if (err.name === 'TokenExpiredError') {
      const objMessage = { message: 'Token expired, please login again' };
      err = handle500FalseErrors(objMessage, 401);
    }
    if (err.parent?.code === '23503') {
      const objMessage = { message: err.parent.detail };
      err = handle500FalseErrors(objMessage, 400);
    }
    // Cuando la validación del rating de la base de datos falla
    console.log('first');
    console.log(err.message);
    if (
      err.message === 'Validation error: Validation max on rating failed' ||
      err.message === 'Validation error: Validation max on rating failed'
    ) {
      err = handle500FalseErrors(err, 400);
    }

    // Ejecutaremos el error dado
    sendErrorProd(err, res);
  }
};
