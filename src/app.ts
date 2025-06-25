import cors from "cors";
import express from "express";
import path from "path";
import router from "./router";
import routerAdmin from "./router-admin";
import morgan from "morgan"; //Kirib kelyotgan requestlarni log qiladi
import cookieParser from "cookie-parser";
import { MORGAN_FORMAT } from "./libs/config";
import { Server as SocketIOServer } from "socket.io";
import http from "http";

import session from "express-session";
import ConnectMongoDB from "connect-mongodb-session"; //Sessionlarni databasega saqlar uchun kere bo'ladi
import { T } from "./libs/types/common";

const MongoDBStore = ConnectMongoDB(session);

const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions", //mongodb session collection hosil bolmoqda
});

// 1-ENTERENCE
const app = express();
console.log("__dirname: ", __dirname);
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT)); //logan mexanism hosil qiladi

// 2-SESSIONS
// 1. Tamg'a 2. cookie.SID
app.use(
  //Session Middleware  //bu yerga cookie yopishib oladi
  session({
    secret: String(process.env.SESSION_SECRET), //Buni .env ichiga kiritamiz //SESSION larni ishlatadigan kod hisoblanadi
    cookie: {
      maxAge: 1000 * 3600 * 6, // Qancha vaqt amal qilishini anglatadi
    },
    store: store, //Biz yuqoridan hosil qilgan store qiymatini beryabmiz => shunda tepadagi session collectionga murojaat etadi
    resave: true, //true da har kirganda session yangilanadi //false bo'lsa (3) soat session davom etadi
    saveUninitialized: true, // sessionimiz bo'lmasa hama yangi session yaratib beradi
  })
);

app.use(function (req, res, next) {
  //ejs file larimizda
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member; //global tarzda local variablelarimizni hosil qivomiza //global va direct usuli bor
  next();
});

// 3-VIEWS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 4-ROUTERS
app.use("/admin", routerAdmin); // SSR: EJS
app.use("/", router); //SPA(SINGLE PAGE APP): REACT //Middleware Design Pattern

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

let summaryClient = 0;
io.on("connection", (socket) => {
  summaryClient++;
  console.log(`Connection & total [${summaryClient}]`);
  // socket.emit("summaryClient", summaryClient);
  socket.on("disconnect", () => {
    summaryClient--;
    console.log(`Disconnection & total [${summaryClient}]`);
    // socket.emit("summaryClient", summaryClient);
  });
});

export default server;
