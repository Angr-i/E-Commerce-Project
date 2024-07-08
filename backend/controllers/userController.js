const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket } = require('../models/models');
const { where } = require('sequelize');

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest('Incorrect data'));
    }
    const candidate = await User.findOne({ where: { email } });

    if (candidate) {
      return next(ApiError.badRequest('The user with this email already exists'));
    }
    const hasPassword = await bcrypt.hash(password, 5);
    const user = await User.create({ email, role, password: hasPassword });
    const basket = await Basket.create({ user_id: user.id });
    const token = generateJwt(user.id, user.email, user.role);
    return res.json(token);
  }
  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal('incorrect data'));
    }
    let comparePassword = bcrypt.compareSync(password, user.password);

    if (!comparePassword) {
      return next(ApiError.internal('incorrect data'));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json(token);
  }
  async check(req, res, next) {
    const token = generateJwt(req.user.id, req.user.email, req.user.role);
    return res.json({ token });
  }
}
module.exports = new UserController();
