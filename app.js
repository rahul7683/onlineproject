import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
dotenv.config();
import { getDatafromWebHooks,getDatafromLinkWebHooks, bounceEmailWebhook } from "./Controller/PaymentController.js";
import { webhooksPostbode } from "./Controller/LetterController.js";
import categoryRouter from "./Router/CategoryRouter.js";
import companyRouter from "./Router/CompanyRouter.js";
import mailboxRouter from "./Router/MailboxRouter.js";
import letterRouter from "./Router/LetterRouter.js";
import paymentRouter from "./Router/PaymentRouter.js";
import orderRouter from "./Router/OrderRouter.js";
import contactRouter from "./Router/ContactRouter.js";
import pingenLetterRouter from "./Router/testLetterRouter.js";
import userRouter from "./Router/UserRouter.js";
import ContentPagerouter from "./Router/ContentPageRouter.js";
import Countryrouter from "./Router/CountryRouter.js";
import blogrouter from "./Router/blogRouter.js";
import actionlogrouter from "./Router/ActionLogRouter.js";
import { validateApiKey } from "./middleware/ValidateApiKey.js";
import compression from "compression";
import { scheduleChargedBackReminderJob , cronJobForOwnOrder } from './Service/cronService.js';

import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import helmet from "helmet";
import { sendErrorNotification } from './Service/commonService.js';
import { scheduleUnSubbyReminderJob } from './unsubby/Service/cronService.js';
import { cronJobOrdeStatistics } from './Service/orderCronService.js';
//import { scheduleMyUnSubbySubscriptionReminderJob } from './customer-portal/Service/cronService.js';
import { completeOrderReminder } from './unsubby/Service/completeOrderCronService.js';
import { incompleteOrderReminder } from './unsubby/Service/incompleteOrderCronService.js';
import { retryLetterCreate } from './unsubby/Service/retryLetterCronService.js';

import unSubbyRouter from './unsubby/Router/PaymentRouter.js';
import UnSubbyPayment from "./unsubby/Controller/PaymentController.js";
import UnSubbyLetter from "./unsubby/Controller/LetterController.js";
import UnSubbyPaymentMethod from "./unsubby/Controller/PaymentMethodController.js";
import StripePaymentMethod from './unsubby/Controller/StripePaymentController.js';

import customerRouter from "./customer-portal/Router/CustomerRouter.js";
import subscriptionRouter from "./customer-portal/Router/SubscriptionRouter.js";
import SubscriptionController from "./customer-portal/Controller/SubscriptionController.js";
import StripeService from "./unsubby/Service/stripeService.js";
import { SERVER_TYPE } from './config.js';

const APIKEY=uuidv4();
const app = express();

const PORT = 4000;

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.urlencoded());
const allowedOrigins = [
  "https://abbostop.nl",
  "https://www.abbostop.nl",
  "https://admin.abbostop.nl",
  "https://www.unsubby.com",
  "https://unsubby.com"
];

if (SERVER_TYPE == 'preprod') {
    allowedOrigins.push('https://pre-prod-unsubby.vercel.app');
    allowedOrigins.push('https://pp-unsubby-rajs-projects-a6aa1ff6.vercel.app');
    
}

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      // callback(null, true);
      callback(new Error("Not allowed by CORS "+origin));
    }
  },
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};


app.use(
  // not loading the noSniff() middleware
  helmet({
    noSniff: false,
  })
)

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Abbostop Express API with Swagger",
      version: "0.1.0",
      description:
        "This is a simple CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      }
      
    },
    servers: [
      {
        url: "https://devapi.abbostop.nl/api"
      },
      {
        url: "http://localhost:4000/api",
      }
    ],
    components: { 
       securitySchemes: {
            jwt_token: {
                type: 'http',
                scheme: 'bearer',
            },
            ApiKeyAuth :{
              type : 'apiKey',
              in : 'header',
              name : 'X-API-key'
            }
        }
    }
  },
  apis: ["./Router/*.js", "**/Router/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
app.use(compression());
app.use(cors(corsOptions));
// app.use(validateApiKey);
app.use(express.static("upload"));
app.use((req, res, next) => {
  let ipAddress = req.header('x-forwarded-for') || req.header('X-Real-IP') ;
  console.log( ipAddress + ' ' + req.get('origin') +' '+req.method +' : '+ req.url +'  '+ res.statusCode);
  next();
});

app.get("/api/ping", async(req, res) => {
  // let date= changeTimeZone(new Date(), 'Europe/Amsterdam'); 
  let date= new Date(); 
  let options = {timeZone: 'Europe/Amsterdam', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
let eastCoastTime = (date.toLocaleString('en-US', options));
const parsedDate = new Date(eastCoastTime);
console.log("server is running");
console.log(eastCoastTime);

  res.send("server is running ");
});

let itrBodyParser = bodyParser.raw({
      type: "*/*",
    }); 
// app.use("/api/testLetter",pingenLetterRouter)
app.post("/api/webhooks/mollie", getDatafromWebHooks);
app.post("/api/webhooks/mollie/payment-link", getDatafromLinkWebHooks);
app.post("/api/webhooks/ses", itrBodyParser, bounceEmailWebhook);
app.post("/api/webhooks/mollie/payment-method", UnSubbyPaymentMethod.paymentMethodWebhook);
app.post("/api/webhooks/mollie/payment-method-abbostop", UnSubbyPaymentMethod.paymentMethodWebhookAbbostop);
app.post("/api/webhooks/mollie/subscription-payment", SubscriptionController.mollieSubscriptionPaymentWebhook);
app.post("/api/webhooks/mollie/subscription", SubscriptionController.mollieSubscriptionWebhook);
app.post("/api/webhooks/mollie/subscription-payment-link", SubscriptionController.mollieSubscriptionPaymentLinkWebhook);


app.post("/api/upayment/stripe-webhook", StripePaymentMethod.paymentWebhook);
app.post("/api/upayment/session-webhook", StripePaymentMethod.changePaymentWebhook);
app.post("/api/upayment/subscription-webhook", StripePaymentMethod.subscriptionWebook);
app.post("/api/upayment/pingen-webhook", itrBodyParser, UnSubbyPayment.pingenWebhook);
app.post("/api/upayment/mollie-webhook", UnSubbyPayment.paymentWebhookMollie);
app.post("/api/upayment/mysendingbox-webhook", UnSubbyLetter.mySendingBoxLetterWebhook);
app.post("/api/upayment/postgrid-webhook", UnSubbyLetter.postGridLetterWebhook);

app.post("/api/webhooks/postbode", webhooksPostbode);
app.use("/api/category",validateApiKey,categoryRouter);
app.use("/api/company",validateApiKey,companyRouter);
app.use("/api/mailbox",validateApiKey,mailboxRouter);
app.use("/api/letter",validateApiKey,letterRouter);
app.use("/api/payment",validateApiKey,paymentRouter);
app.use("/api/order",validateApiKey,orderRouter);
app.use("/api/contact",validateApiKey,contactRouter);
app.use("/api/user",validateApiKey,userRouter);
app.use("/api/contentpage",validateApiKey,ContentPagerouter);
app.use("/api/country",validateApiKey,Countryrouter);

app.use("/api/upayment",validateApiKey,unSubbyRouter);
app.use("/api/customer", validateApiKey, customerRouter);
app.use("/api/subscription", validateApiKey, subscriptionRouter);

app.use("/api/blog",validateApiKey,blogrouter);
app.use("/api/action-log",validateApiKey,actionlogrouter);


process.on('uncaughtException', error => {
    console.error(`App exiting due to an uncaught exception: ${error}`);
    sendErrorNotification('Un-handled Exception Abbostop',error);
});


process.on('unhandledRejection', (reason, promise) => {
    console.error(`App exiting due to an unhandled promise: ${JSON.stringify(promise)} and reason: ${reason}`);    
    sendErrorNotification('Un-handled Error Abbostop',{message:promise,stack:reason});
});


process.on('SIGINT', () => {
    console.log(`Process ${process.pid} has been interrupted`)
    console.log("Bye bye Abbostop App!");
    process.kill(process.pid, "SIGINT");
    console.log("Bye bye Abbostop App!");
    process.exit(0)
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


if (SERVER_TYPE == 'production') {
    //Initialize cron job
    scheduleChargedBackReminderJob();
    cronJobForOwnOrder();
    scheduleUnSubbyReminderJob();
    cronJobOrdeStatistics();
    completeOrderReminder();
    incompleteOrderReminder();
    retryLetterCreate();
}

// [
//   {
//       "Condition": {
//           "HttpErrorCodeReturnedEquals": "404"
//       },
//       "Redirect": {
//           "ReplaceKeyWith": "index.html"
//       }
//   }
// ]
