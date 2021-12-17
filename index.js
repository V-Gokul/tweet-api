const express = require("express");
const morgan = require("morgan");
const session = require("express-session");

const userRouter = require("./controller/users_controller");

const app = express();

app.use(morgan("combined"));

app.use( 
  session({
    secret: "keybord cat",
    resave: false,
    saveUninitialized: true,
    cokkie: { secure: false, maxAge: 60000 },
  })
);

app.use(async function (req, res, next) {
  try {
    await next();
  } catch (err) {
    console.err("something went wrong", err);
    res.status(500).send({ message: "exnternal server error" });
  }
});

app.use(express.json());

app.use("/api/v1/auth", userRouter); 
app.use("/api/v1", userRouter);

app.listen(3000);
