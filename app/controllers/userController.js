const express = require('express');
const router = express.Router();
const { User } = require('../models/user');
const { authenticateUser } = require('../middlewares/authentication');

router.post('/signup', (req,res) => {
    let body = req.body;
    let user = new User(body);
    user.save().then((user) => {
         res.send(user);
    }).catch((err) => {
        res.send(err);
    });
})

router.post('/login', (req,res) => {
    let body = req.body;
    console.log(body);
    User.findOne({ $and: [{username: body.username, password: body.password}]}).then((user) => {
        return user.generateToken();
    }).then((user) => {
        res.send(user);
    }).catch((err) => {
        res.send(err);
    })
})

//auth login
router.get('/login', (req,res) => {
    res.render('login');
})

//auth with google
router.get('/google', (req,res) => {
    res.send('logging in with google.');
});

// logout
router.get('/logout', (req,res) => {
    res.send('logging out');
})

module.exports = {
    userController: router
}