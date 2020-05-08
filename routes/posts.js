const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const mongoose = require('mongoose');

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
const upload = multer({storage: storage});

//All posts
router.get('/',  async(req, res) => {
    try{
        const posts = await Post.find();
        res.json(posts);
    }catch(err){
        res.json({message : err});
    }
});


//Get specific post
router.get('/:postId', async(req, res) => {
    try{
        const post = await Post.findById(req.params.postId);
        res.json(post);
    }catch(err){
        res.json({message : err});
    }
});


//add a post
router.post('/', upload.single('postImage') , (req, res)=>{
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        postImage: req.file.path
    });
    post.save().then(data => {
        res.json(data);
    }).catch(err => {
        res.json({message : err});
    });
});


//Delete specific post
router.delete('/:postId', async(req, res) => {
    try{
        const removedPost = await Post.remove({ _id : req.params.postId});
        res.json(removedPost);
    }catch(err){
        res.json({message : err});
    }
});

//Update specific post
// router.patch('/:postId', async(req, res) => {
//     try{
//         const updatedPost = await Post.updateOne({ _id : req.params.postId}, {
//             $set : {
//                 title: req.body.title
//             }
//         });
//         res.json(updatedPost);
//     }catch(err){
//         res.json({message : err});
//     }
// });


module.exports = router;