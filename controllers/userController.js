const router = require('express').Router();
const { models } = require('../models');

router.post('/signup', async (req, res) => {
    // const { username, admin, password } = req.body.users;
  
    //    await models.UsersModel.create({
    //         username: username,
    //         admin: admin,
    //         password: password
    //     });

    //     res.send('this is our user/register endpoint');

    // models.UsersModel.create({
    //     username: "1user",
    //     admin: "false",
    //     password: "1pass"
    // })
      
});

module.exports = router;