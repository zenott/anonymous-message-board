/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

const expect = require('chai').expect;
const mongoose = require('mongoose');
  
const replySchema = new mongoose.Schema({
  text: String,
  delete_password: String,
  created_on: {type: Date, default: Date.now},
  reported: {type: Boolean, default: false}
});
const threadSchema = new mongoose.Schema({
  board: String,
  text: String,
  created_on: {type: Date, default: Date.now},
  bumped_on: {type: Date, default: Date.now},
  reported: {type: Boolean, default: false},
  delete_password: String,
  replies: {type: [replySchema], default: []},
});
const ThreadModel = mongoose.model('Thread', threadSchema);
const ReplyModel = mongoose.model('Reply', replySchema);

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(async (req, res) => {
      const text = req.body.text;
      const delete_password = req.body.delete_password;
      const board=req.params.board;
    
      mongoose.connect(process.env.DB, { useNewUrlParser: true });
      await mongoose.connection.catch(err => console.error(err));
      const newThread = new ThreadModel({
        board: board,
        text: text, 
        delete_password: delete_password
      });
    
      await newThread.save().catch(err => console.error(err));
    
      res.redirect('/b/'+board);
    })
  
  
    .get(async (req, res) => {
      const board=req.params.board;
      
      mongoose.connect(process.env.DB, { useNewUrlParser: true });
      await mongoose.connection.catch(err => console.error(err));
      const doc=await ThreadModel.find({board: board}).select('text created_on bumped_on replies').sort({bumped_on: -1}).limit(10);
      for(let item of doc){
        item.replies=item.replies.sort((a,b) => b.created_on-a.created_on).slice(0,3);
      }
      res.json(doc);
    });
    
  
  
  app.route('/api/replies/:board')
    .post(async (req, res) => {
      const text = req.body.text;
      const delete_password = req.body.delete_password;
      const threadId=req.body.thread_id;
      const board=req.params.board;
    
      mongoose.connect(process.env.DB, { useNewUrlParser: true });
      await mongoose.connection.catch(err => console.error(err));
      const newReply = new ReplyModel({
        text: text, 
        delete_password: delete_password
      });
    
      await ThreadModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(threadId)}, {$push: {replies: newReply}, $set: {bumped_on: Date.now()}}).catch(err => console.error(err));
    
      res.redirect('/b/'+board+'/'+threadId);
    })
  
    .get(async (req, res) => {});
};
