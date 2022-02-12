const router = require('express').Router();
const { models } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UniqueConstraintError } = require("sequelize/lib/errors");
const validateJWT = require('../middleware/validate-jwt');

router.post('/signup', async (req, res) => {
    const { username, admin, password } = req.body.users;
    try {
        const User = await models.UsersModel.create({
            username: username,
            admin: admin,
            password: bcrypt.hashSync(password, 5)
        });

        let token = jwt.sign({ id: User.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

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

                let token = jwt.sign({ id: loginUser.id }, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 });

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

router.delete('/delete/:id', validateJWT, async (req, res) => {
    const userId = req.params.id;

    if (req.user.admin) {
        const query = {
            where: {
                id: userId
            }
        };

        try {
            const deleteUser = await models.UsersModel.destroy(query);
            res.status(200).json({
                message: `${deleteUser} user deleted`,
                query: query
            });
        } catch (err) {
            res.status(500).json({error: err});
            message = 'error deleting'
        }
    } else {
        res.status(200).json({message:'Action not Authorized'});
    }
});

router.get('/', validateJWT, async (req, res) => {

    if (req.user.admin) {
        try{
            const users = await models.UsersModel.findAll()
            res.status(200).json({
                users: users
            });
        } catch (err) {
            res.status(500).json({
                error: `Failed to retrieve users: ${err}`
            })
        }
    }
})

module.exports = router;