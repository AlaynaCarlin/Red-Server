// imports
const Express = require ("express");
const dbConnection = require("./db");
const controllers = require("./controllers");
const middleware = require('./middleware');
require("dotenv").config();

//instantiation
const app = Express();

//middleware
app.use(middleware.CORS);
// ! makes server able to read the json data
app.use(Express.json()); 

//endpoints
app.use('/comment', controllers.commentController);
app.use('/post', controllers.postController);
app.use('/user', controllers.userController);
app.use(require("./middleware/validate-jwt"));

//!
// app.listen(3000, () => {
//     console.log(`[Server]: App is listening on 3000.`);
// })

// database auth & sync
dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`[Server]: App is listening on 3000.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });