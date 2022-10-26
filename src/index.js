const express = require("express");
const cors = require("cors");

const App = express();
require('./routes/index')(App);
App.use(cors());
App.use(express.json());
App.listen(3001);
