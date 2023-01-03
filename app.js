// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require('dotenv/config');

// ℹ️ Connects to the database
require('./db');

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express');

const session = require("express-session")

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require('hbs');

const MongoStore = require("connect-mongo")

const app = express();




// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 1000 * 60 * 60
        },
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        })
    })
)

// default value for title local
const projectName = 'lab-express-basic-auth';
const capitalized = string => string[0].toUpperCase() + string.slice(1).toLowerCase();

app.locals.title = `${capitalized(projectName)}- Generated with Ironlauncher`;

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

const authRoutes = require('./routes/auth.routes');
// const MongoStore = require('connect-mongo');

 
app.use('/auth', authRoutes);



/* require("./config/session.config")(app); */

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;

