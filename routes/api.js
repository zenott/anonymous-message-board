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
const boardSchema = new mongoose.Schema({
  text: String,
  created_on: {type: Date, default: Date.now},
  bumped_on: {type: Date, default: Date.now},
  reported: {type: Boolean, default: false},
  delete_password: String,
  replies: {type: [replySchema], default: []},
});
const BoardModel = mongoose.model('Board', boardSchema);
const ReplyModel = mongoose.model('Reply', replySchema);

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(async (req, res) => {
      const text = req.body.text;
      const delete_password = req.body.delete_password;
      const board=req.params.board;
    
      mongoose.connect(process.env.DB, { useNewUrlParser: true });
      await mongoose.connection.catch(err => console.error(err));
      const newBoard = new BoardModel({
        text: text, 
        delete_password: delete_password
      });
    
      await newBoard.save().catch(err => console.error(err));
    
      res.redirect('/b/'+board);
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
    
      await BoardModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(threadId)}, {$push: {replies: newReply}, $set: {bumped_on: Date.now()}}).catch(err => console.error(err));
    
      res.redirect('/b/'+board+'/'+threadId);
    });
};
