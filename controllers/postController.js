const Express = require("express");
const router = Express.Router();
const { models } = require('../models');
let validateJWT = require("../middleware/validate-jwt");

router.post('/post', validateJWT, async (req, res) => {
    const { product, brand, content } = req.body.post;

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

router.put('/update/:id', validateJWT, async (req, res) => {
    const { product, brand, content } = req.body.post;
    const postId = req.params.id;
    const { id } = req.user;

    const query = {
        where: {
            id: postId,
            userId: id
        }
    };

    const updatedPost = {
        product: product,
        brand: brand,
        content: content
    };
    console.log(updatedPost);

    try {
        const update = await models.PostsModel.update(updatedPost, query);
        res.status(200).json({
            message: `${update} Post successfully updated`,
            update: updatedPost,
            query: query
        });
    } catch (err) {
        res.status(500).json({ error: err });
        message = 'error updating post'
    }
});

router.delete('/delete/:id', validateJWT, async (req, res) => {
    const postId = req.params.id;
    const { id } = req.user;

    if (req.user.admin) {
        const query = {
            where: {
                id: postId
            }
        };

        try {
            const deletePost = await models.PostsModel.destroy(query);
            res.status(200).json({
                message: `${deletePost} post deleted`,
                query: query
            });
        } catch (err) {
            res.status(500).json({ error: err });
            message = 'error deleting'
        }
    } else {
        const query = {
            where: {
                id: postId,
                userId: id
            }
        };

        try {
            const deletePost = await models.PostsModel.destroy(query);
            res.status(200).json({
                message: `${deletePost} post deleted`,
                query: query
            });
        } catch (err) {
            res.status(500).json({ error: err });
            message = 'error deleting'
        }
    }
});


// see post and comments
router.get('/:id', validateJWT, async (req, res) => {
    const postId = req.params.id;
    console.log(`PostId --> ${postId}`)

    try {
        const post = await models.PostsModel.findOne({
            where: {
                id: postId,
            }
        })

        const comments = await models.CommentsModel.findAll({
            where: {
                postId: postId
            }
        })

        res.status(200).json({
            post: post,
            comments: comments
        })
        console.log(`post --> ${post}`)

    } catch (err) {
        res.status(500).json({
            error: `Failed to retrieve post info: ${err}`
        });
    };
});

//search for a post
router.get('/search', validateJWT, async (req, res) => {
    try {
        const posts = await models.PostsModel.findAll()
        res.status(200).json({
            posts: posts
        });


    } catch (err) {
        res.status(500).json({
            error: `failed to retrieve posts: ${err}`
        });
    };
});




module.exports = router;
