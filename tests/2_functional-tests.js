/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

let testThread;
let testThread2;
let testReply;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('post thread', function(done) {
       chai.request(server)
        .post('/api/threads/test_board')
        .send({text: 'test_thread', delete_password: 'pw'})
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.include(res.redirects[0], '/b/test_board',);
          
          done();
        });
      });
    });
    
    suite('POST', function() {
      test('post another thread', function(done) {
       chai.request(server)
        .post('/api/threads/test_board')
        .send({text: 'test_thread_2', delete_password: 'pw'})
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.include(res.redirects[0], '/b/test_board',);
          
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('get thread', function(done) {
       chai.request(server)
        .get('/api/threads/test_board')
        .query({})
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.isAtMost(res.body.length, 10);
          assert.isObject(res.body[0]);
          assert.property(res.body[0], 'text');
          assert.property(res.body[0], '_id');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'bumped_on');
          assert.property(res.body[0], 'board');
          assert.property(res.body[0], 'replies');
          assert.notProperty(res.body[0], 'reported');
          assert.notProperty(res.body[0], 'delete_password');
          assert.isArray(res.body[0].replies);
          assert.isAtMost(res.body[0].replies.length, 3);
         
          testThread=res.body[0]._id;
          testThread2=res.body[1]._id;
      
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('put report thread', function(done) {
       chai.request(server)
        .put('/api/threads/test_board')
        .send({report_id: testThread})
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.equal(res.body, 'success');
          
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('delete thread with wrong password', function(done) {
       chai.request(server)
        .delete('/api/threads/test_board')
        .send({thread_id: testThread, delete_password: 'badpw'})
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.equal(res.body, 'incorrect password');
          
          done();
        });
      });
      
      test('delete thread with correct password', function(done) {
       chai.request(server)
        .delete('/api/threads/test_board')
        .send({thread_id: testThread, delete_password: 'pw'})
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.equal(res.body, 'success');
          
          done();
        });
      });
    });
    

  });
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('post reply', function(done) {
       chai.request(server)
        .post('/api/replies/test_board')
        .send({text: 'test_reply', delete_password:'pw', thread_id: testThread2})
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.include(res.redirects[0], '/b/test_board/'+testThread2);
          
          done();
        });
      });
    });
    
    suite('GET', function() {
      test('get replies', function(done) {
       chai.request(server)
        .get('/api/replies/test_board')
        .query({thread_id: testThread2})
        .end(function(err, res){

          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'text');
          assert.property(res.body, '_id');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'bumped_on');
          assert.property(res.body, 'replies');
          assert.isArray(res.body.replies);
          assert.isAtLeast(res.body.replies.length, 1);
          assert.notProperty(res.body, 'reported');
          assert.notProperty(res.body, 'delete_password');
         
          testReply=res.body.replies[0]._id
 
          done();
        });
      });
    });
    
    suite('PUT', function() {
      test('put report reply', function(done) {
       chai.request(server)
        .put('/api/replies/test_board')
        .send({reply_id: testReply, thread_id: testThread2})
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.equal(res.body, 'success');
          
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('delete reply with wrong password', function(done) {
       chai.request(server)
        .delete('/api/replies/test_board')
        .send({thread_id: testThread2, reply_id: testReply, delete_password: 'badpw'})
        .end(function(err, res){
       
          assert.equal(res.status, 200);
          assert.equal(res.body, 'incorrect password');
          
          done();
        });
      });
    });
    
    suite('DELETE', function() {
      test('delete reply with correct password', function(done) {
       chai.request(server)
        .delete('/api/replies/test_board')
        .send({thread_id: testThread2, reply_id: testReply, delete_password: 'pw'})
        .end(function(err, res){
          
          assert.equal(res.status, 200);
          assert.equal(res.body, 'success');
          
          done();
        });
      });
    });
    
  });

});
