const router = require('express').Router();
const { models } = require('../models');
const { UniqueConstraintError } = require("sequelize/lib/errors")

router.post('/signup', async (req, res) => {
    const { username, admin, password } = req.body.users;
    try {
        const User = await models.UsersModel.create({
            username: username,
            admin: admin,
            password: password
        });
        res.status(201).json({
            message: "User successfully registered",
            user: User
        });
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            res.status(409).json({
                message: 'Username already in use'
            });
        } else {
            res.status(500).json({
                error: `Failed to register user: ${err}`
            });
        };
    }

});

router.post("/login", async (req, res) => {
    const { username, password } = req.body.users;

    try {
        const loginUser = await models.UsersModel.findOne({
            where: {
                username: username,
            },
        });
        if (loginUser){
        res.status(200).json({
            user: loginUser,
            message: "User successfully logged in!"
        });
        } else {
            res.status(401).json({
                message:"Login Failed"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});

module.exports = router;