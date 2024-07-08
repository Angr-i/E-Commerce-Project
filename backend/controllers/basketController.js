const { Basket, DeviceInfo } = require('../models/models');
const { BasketDevice } = require('../models/models');
const jwt = require('jsonwebtoken');
const ApiError = require('../error/ApiError');
class BasketController {
  async create(req, res) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Not authorized' });
      }

      const user_id = jwt.decode(token).id;
      const basket_id = await Basket.findOne({ where: { user_id: user_id } });
      const { device_id } = req.body;
      const basket_check = await BasketDevice.findOne({ where: { device_id: device_id } });

      if (basket_check) {
        return res.status(400).json({ message: 'product has already been added' });
      }

      const basket_device = await BasketDevice.create({
        basket_id: basket_id.id,
        device_id: device_id,
      });

      return res.status(201).json({ message: 'work' });
    } catch (e) {
      res.json({ message: e });
    }
  }
  async getAll(req, res) {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const user_id = jwt.decode(token).id;
    const basket_id = await Basket.findOne({ where: { user_id: user_id } });
    const basket_device = await BasketDevice.findAll({ where: { basket_id: basket_id.id } });
    return res.json(basket_device);
  }
  async deleteOne(req, res) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const user_id = jwt.decode(token).id;

    const { basket_id } = req.body;

    const check_basket = await BasketDevice.findOne({ where: { id: basket_id } });
    const basket_id_check = await Basket.findOne({ where: { id: check_basket.basket_id } });

    if (basket_id_check.user_id !== user_id) {
      return res.status(403).json({ message: 'No Access' });
    }
    const delete_basket = await BasketDevice.destroy({ where: { id: basket_id } });
    return res.status(200).json({ message: 'The product has been removed' });
  }
}
module.exports = new BasketController();
