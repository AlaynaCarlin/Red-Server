const Express = require("express");
const router = Express.Router();
const {models} = require('../models');
let validateJWT = require("../middleware/validate-jwt");

router.post('/post', validateJWT, async (req, res) => {
    const{product, brand, content} = req.body.post;

    try {
        await models.PostsModel.create({
            product: product,
            brand: brand,
            content: content,
            userId: req.user.id
        })
        .then(
            post => {
                res.status(201).json({
                    post: post,
                    message: 'successfully posted'
                });
            }
        )
    } catch (err) {
        res.status(500).json({
            error: `failed to create post: ${err}`
        });
    };
});




module.exports = router;


//     const{product, brand, content} = req.body.post;
//     // const {id} = req.user;
//     const postEntry = {
//         product,
//         brand,
//         content
//     }

//     try {
//         const newPost = await models.PostsModel.create(postEntry)
//        res.status(200).json(newPost)
//     } catch (err) {
//         res.status(500).json({
//             error: `Failed to create post: ${err}`
//         });
//     };