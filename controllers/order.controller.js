const Meals = require('../models/meals.model');
const Orders = require('../models/orders.model');
const Restaurants = require('../models/restaurants.model');
const { appSuccess } = require('../utils/appSuccess');
const { catchAsync } = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res, next) => {
  const { quantity, mealId } = req.body;
  const { meal, sessionUser } = req;
  const totalPrice = meal.price * quantity;

  const newOrder = await Orders.create({
    mealId,
    userId: sessionUser.id,
    totalPrice,
    quantity,
  });

  // Mandar respuesta al cliente
  appSuccess(res, 201, `Order generated successfully`, { newOrder });
});

const getUserOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const orders = await Orders.findAll({
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    where: {
      userId: sessionUser.id,
    },
    include: [
      {
        model: Meals,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: [
          {
            model: Restaurants,
            attributes: { exclude: ['createdAt', 'updatedAt'] },
          },
        ],
      },
    ],
  });

  // Mandar respuesta al cliente
  appSuccess(res, 200, `Orders obtained successfuly`, { orders });
});

const updateOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  const updatedOrder = await order.update({ status: 'completed' });
  // Mandar respuesta al cliente
  appSuccess(res, 200, `The order has been updated successfully`, {
    updatedOrder,
  });
});

const deleteOrder = catchAsync(async (req, res, next) => {
  const { order } = req;
  await order.update({ status: 'cancelled' });

  // Mandar respuesta al cliente
  appSuccess(res, 200, `The order has been deleted successfully`);
});

module.exports = {
  createOrder,
  getUserOrders,
  updateOrder,
  deleteOrder,
};
