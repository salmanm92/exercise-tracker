const express = require('express');
const app = express.Router();
const User = require("./../models/User");
const Exercise = require('../models/Exercise');

app.post("/",async (req,res)=>{
    console.log(req.body);
    const { username } = req.body;
    try 
    {
    const user = new User({ username : username });
    await user.save();
    res.json({ username: user.username, _id: user._id });
    } catch (err)
    {
    res.status(500).json({ error: err.message });
    }
});

app.get("/",async (req,res)=>{
    try{
        const users = await User.find({});
        res.json(users);

    }
    catch(err){
        res.status(400).json({error:err.message});
    }
})

app.post("/:_id/exercises",async (req, res)=>{
    const data = req.body;
    
    try{
        const user = await User.findById(req.params._id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        const exercise = new Exercise({
            userId : req.params._id,
            description : data.description,
            duration : data.duration,
            date : data.date ? new Date(data.date) : new Date()
        });
        const response = await exercise.save();
        res.json({
            username: user.username,
            description: exercise.description,
            duration: exercise.duration,
            date: exercise.date.toDateString(),
            _id: user._id
          });

    }
    catch(err){
        res.status(400).json({error:err.message});
    }
});

app.get("/:_id/logs", async (req,res)=> {
    const { _id } = req.params;
    const { from, to, limit } = req.query;

    try{

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        let query = { userId: _id };
        if(to || from){
            query.date = {};
        }
        if (from) query.date.$gte = new Date(from);
        if (to) query.date.$lte = new Date(to);
        const exercises = await Exercise.find(query)
        .limit(parseInt(limit))
        .select('-_id description duration date');

        res.json({
        username: user.username,
        count: exercises.length,
        _id: user._id,
        log: exercises.map((ex) => ({
            description: ex.description,
            duration: ex.duration,
            date: ex.date.toDateString()
        }))
    });
    }
    catch(err){
        res.status(400).json({error:err.message});
    }
});

module.exports = app;