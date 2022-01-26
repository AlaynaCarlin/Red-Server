// imports
const Express = require ("express");
const dbConnection = require("./db");
const controllers = require("./controllers");

//instantiation
const app = Express();

//middleware

//endpoints
app.use('/post', controllers.postController);
app.use('/user', controllers.userController);
app.use('/test', (req, res) => {
    res.send('This is a message from the server!')
});

//!
// app.listen(3000, () => {
//     console.log(`[Server]: App is listening on 3000.`);
// })

// database auth & sync
dbConnection.authenticate()
    .then(() => dbConnection.sync())
    .then(() => {
        app.listen(3000, () => {
            console.log(`[Server]: App is listening on 3000.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });