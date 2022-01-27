const router = require('express').Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require("sequelize/lib/errors");

router.post('/signup', async (req, res) => {
    const { username, admin, password } = req.body.users;
    try {
        const User = await models.UsersModel.create({
            username: username,
            admin: admin,
            password: bcrypt.hashSync(password, 5)
        });

        let token = jwt.sign({ id: User.id }, "i_am_secret", { expiresIn: 60 * 60 * 24 });

        res.status(201).json({
            message: "User successfully registered",
            user: User,
            sessionToken: token
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
        if (loginUser) {

            let passwordComparison = await bcrypt.compare(password, loginUser.password);

            if (passwordComparison) {

                let token = jwt.sign({ id: loginUser.id }, "i_am_secret", { expiresIn: 60 * 60 * 24 });

                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token
                });
            } else {
                res.status(401).json({
                    message: "Incorrect username or password"
                })
            }
        } else {
            res.status(401).json({
                message: "username or password"
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to log user in"
        })
    }
});

module.exports = router;