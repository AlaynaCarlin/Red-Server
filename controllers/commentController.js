const Express = require("express");
const router = Express.Router();
const { models } = require('../models');
let validateJWT = require("../middleware/validate-jwt");

router.post('/post', validateJWT, async (req, res) => {
    const {content, postId} = req.body.comment;

    try {
        await models.CommentsModel.create({
            content: content,
            postId: postId,
            userId: req.user.id
        })
        .then(
            comment => {
                res.status(201).json({
                    comment: comment,
                    message: 'comment created'
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
    const {content} = req.body.comment;
    const commentId = req.params.id;
    const {id} = req.user;

    const query = {
        where: {
            id: commentId,
            userId: id
        }
    };

    const updatedComment = {
        content: content
    };

    try {
        const update = await models.CommentsModel.update(updatedComment, query);
        res.status(200).json({
            message: `${update} Comment updated`,
            update: updatedComment,
            query: query
        });
    } catch (err) {
        res.status(500).json({error: err});
        message = 'error updating post'
    }
});

router.delete('/delete/:id', validateJWT, async (req, res) => {
    const commentId = req.params.id;
    const {id} = req.user;

    const query = {
        where: {
            id: commentId,
            userId: id
        }
    };

    try {
        const deleteComment = await models.CommentsModel.destroy(query);
        res.status(200).json({
            message: `${deleteComment} Comment deleted`,
            query: query
        });
    } catch (err) {
        res.status(500).json({error: err});
        message = 'error deleting'
    }
});

module.exports = router;