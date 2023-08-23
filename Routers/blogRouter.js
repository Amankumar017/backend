const authenticateUser = require('../middleware/authenticateUser');
const express = require('express');
const blogPost = require('../models/blogmodel');
const Router = express.Router();
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

Router.use(express.urlencoded({extended:false}));

// Set up multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Specify the directory where the uploaded files will be stored
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const extname = path.extname(file.originalname);
      const newFileName =file.fieldname + '-' + uniqueSuffix + extname;
      cb(null, newFileName); // Use a unique filename for each uploaded file
    },
});


// Create multer instance
const upload = multer({ storage:storage });


Router.post('/create-post',authenticateUser, upload.single('myImage') ,async (req , res) => {
    try{
        if(!req.file){
            return res.status(400).json({ message: 'No image file provided' });
        }
        const {category,title,content}=req.body;
        console.log({category});
        console.log({title});
        console.log({content});
        // Handle the uploaded file here
        // You can access the file using req.file
        // Example: save the file path to a database
        // const image = req.file.path;
        // console.log({image});
        const authorId = req.userId;
        console.log({authorId});

        const createBlog = await blogPost.create({
            category:category,
            title:title,
            content:content,
            image:req.file.path,
            author:authorId
        });
        
        res.status(201).json(createBlog);
    }
    catch(error){
        console.log('yes');
        res.status(400).json({error:error.message});
    }
});

Router.get('/all-post',async (req,res) =>{
    try{
        const allPost = await blogPost.aggregate([
            {
              $match: { author: { $exists: true } }
            },
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'authorDetails',
              }
            },
            {
              $unwind: '$authorDetails'
            }
        ]);
        res.status(201).json(allPost);
    }catch(error){
        res.status(400).json({message:error.message});
    }
});

Router.get('/my-post',authenticateUser,async(req,res)=>{
    try{
        const authorId=req.userId;
        const mypost = await blogPost.find({author:authorId});
        res.status(201).json(mypost);
    }catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/college-post',async(req,res)=>{
    try{
        const aggregationStages = [
            { $match: { category: 'College', author: { $exists: true } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails',
                }
            },
            { $unwind: '$authorDetails' }
        ];
        const collegepost = await blogPost.aggregate(aggregationStages);
        res.status(201).json(collegepost);
    }catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/hillfair-post',async(req,res)=>{
    try{
        const aggregationStages = [
            { $match: { category: 'Hillfair', author: { $exists: true } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails',
                }
            },
            { $unwind: '$authorDetails' }
        ];
        const hillfairpost = await blogPost.aggregate(aggregationStages);
        res.status(201).json(hillfairpost);
    }catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/nimbus-post',async(req,res)=>{
    try{
        const aggregationStages = [
            { $match: { category: 'Nimbus', author: { $exists: true } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails',
                }
            },
            { $unwind: '$authorDetails' }
        ];
        const nimbuspost = await blogPost.aggregate(aggregationStages);
        res.status(201).json(nimbuspost);
    }catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/sports-post', async(req,res)=>{
    try{
        const aggregationStages = [
            { $match: { category: 'Sports', author: { $exists: true } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails',
                }
            },
            { $unwind: '$authorDetails' }
        ];
        const sportspost = await blogPost.aggregate(aggregationStages);
        res.status(201).json(sportspost);
    }catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/events-post', async(req,res)=>{
    try{
        const aggregationStages = [
            { $match: { category: 'Events', author: { $exists: true } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails',
                }
            },
            { $unwind: '$authorDetails' }
        ];
        const eventspost = await blogPost.aggregate(aggregationStages);
        res.status(201).json(eventspost);
    }catch(error){
        res.status(400).json({error:error.message});
    }
});

Router.get('/others-post', async(req,res)=>{
    try{
        const aggregationStages = [
            { $match: { category: 'others', author: { $exists: true } } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'authorDetails',
                }
            },
            { $unwind: '$authorDetails' }
        ];
        const othersPost = await blogPost.aggregate(aggregationStages);
        res.status(201).json(othersPost);
    }catch(error){
        res.status(400).json({error:error.message});
    }
})

module.exports = Router;