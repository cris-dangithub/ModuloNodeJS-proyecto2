const express = require('express');
const { globalErrorHandler } = require('../controllers/error.controller');
const AppError = require('../utils/appError');
const cors = require('cors');
const { db } = require('../database/db');
const initModel = require('./initModel');
const morgan = require('morgan');
const { rateLimit } = require('express-rate-limit');
const { default: helmet } = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const { usersRouter } = require('../routes/users.routes');
const { restaurantsRouter } = require('../routes/restaurants.routes');
const { ordersRouter } = require('../routes/orders.routes');
const { mealsRouter } = require('../routes/meals.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.limiter = rateLimit({
      // Numero de peticiones máximas a permitir a una misma IP
      max: 100,
      // Ventana de tiempo que haré las anteriores peticiones (milisegundos)
      windowMs: 60 * 60 * 1000, // Esto es 1hora
      // Mensaje cuando esto ocurra
      message: 'Too many request from this IP',
    });
    this.paths = {
      users: '/api/v1/users',
      restaurants: '/api/v1/restaurants',
      meals: '/api/v1/meals',
      orders: '/api/v1/orders',
    };

    this.database();
    this.middlewares();
    this.routes();
  }
  // CONEXIÓN CON LA BASE DE DATOS
  database() {
    // ---- Autenticación de la base de datos ---- //
    db.authenticate()
      .then(res => console.log(`Database authenticated`))
      .catch(err => console.log(err));
    // ---- Establecer modelos ---- //
    initModel();

    // ---- Sincronizar la base de datos ---- //
    db.sync()
      .then(res => console.log(`Database synced`))
      .catch(err => console.log(err));
  }

  // ALGUNOS MIDDLEWARES COMO CONFIGURACIÓN DE CORS, SEGURIDAD, JSON, ETC
  middlewares() {
    this.app.use(helmet());
    this.app.use(xss());
    this.app.use(hpp());
    if (process.env.NODE_ENV === 'development') {
      console.log('Ejecutando en DESARROLLO 💻');
      this.app.use(morgan('dev'));
    }
    if (process.env.NODE_ENV === 'production') {
      console.log('Ejecutando en PRODUCCIÓN 🏬');
    }
    this.app.use('/api/v1', this.limiter);
    this.app.use(cors());
    this.app.use(express.json());
  }

  // RUTAS
  routes() {
    // Endpoints
    this.app.use(this.paths.users, usersRouter);
    this.app.use(this.paths.restaurants, restaurantsRouter);
    this.app.use(this.paths.meals, mealsRouter);
    this.app.use(this.paths.orders, ordersRouter);

    // Validación rutas inexistentes
    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this server`, 404)
      );
    });

    // Manejo de errores
    this.app.use(globalErrorHandler);
  }

  // ESTABLECER EL PUERTO
  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

module.exports = Server;
