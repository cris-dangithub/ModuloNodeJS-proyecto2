const Orders = require('../models/orders.model');
const AppError = require('../utils/appError');
const { catchAsync } = require('../utils/catchAsync');

exports.validIfOrderExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Orders.findOne({
    where: {
      id,
      userId: sessionUser.id,
    },
  });

  if (!order) {
    return next(new AppError(`Order not found`, 404));
  }

  if (order && order.status !== 'active') {
    return next(
      new AppError(
        `The order has already been ${order.status}. Please, try with another order`,
        400
      )
    );
  }

  req.order = order;
  next();
});
