const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const saltRounds = 10;

const User = require('../models/User.model');

// Signup
router.get('/signup', (req, res) => {
    res.render('auth/signup')
})

router.post('/signup', (req, res) =>{
    console.log(req.body)

const { username, password } = req.body;

bcrypt.hash(password, saltRounds)  
    .then(hash => {
        return User.create({ username, password: hash}) 
    })
    .then(newUser => res.redirect(`/auth/profile/${newUser.username}`))
    .catch(err => console.log(err))
})


// Login
router.get('/login', (req, res)=>{
    res.render('auth/login')
})

router.post('/login', (req, res) => {
    console.log(req.body)

    const { username, password } = req.body;
    
    User.findOne({ username })
        .then(foundUser => {
            return bcrypt.compare(password, foundUser.password)
                .then(result => {
                    if(result){
                        res.redirect(`/auth/profile/${foundUser.username}`)
                    }
                    else {
                        res.render('auth/login', { errorMessage: 'Incorrect password, try again' })
                    }
            })
    })
    .catch(err => console.log(err))

})

// Profile route
router.get('/profile/:username', (req, res) => {
    const { username } = req.params;
       
    User.findOne({ username })
        .then(foundUser => res.render('auth/profile', foundUser))
        .catch(err => console.log(err))
})


module.exports = router;