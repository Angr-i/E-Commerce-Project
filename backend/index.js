require('dotenv').config();

const cors = require('cors');
const express = require('express');
const sequelize = require('./db');
const PORT = process.env.PORT || 5000;
const models = require('./models/models');
const app = express();
const router = require('./routers/index');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Work' });
});
app.use('/api', router);
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server start on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};
start();
