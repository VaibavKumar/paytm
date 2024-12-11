// const express = require("express");
// const cors = require('cors');
// const app = express();
// app.use(express.json());
// app.use(cors());
// const rootRouter = require("./routes/index1");

// app.use("/api/v1",rootRouter);

// app.listen(3000);

const express = require('express');
const cors = require("cors");
// const rootRouter = require("./routes/index1");
const rootRouter = require('./routes/index1')
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1",rootRouter);


app.listen(3000);