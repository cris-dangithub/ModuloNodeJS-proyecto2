const jwt = require('jsonwebtoken');

const generateJWT = id => {
  return new Promise((resolve, reject) => {
    const payload = { id };

    // Firmar el token
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

module.exports = generateJWT;
