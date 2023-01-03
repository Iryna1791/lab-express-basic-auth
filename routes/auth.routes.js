const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const saltRounds = 10;

const User = require('../models/User.model');

const { isLoggedIn, isLoggedOut} = require('../middleware/route-guard');

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

router.post('/login', async (req, res) => {
    console.log('SESSION =====> ', req.session);
    const { username, password } = req.body;
    try{

        if (username === "" || password === "") {
            res.render("auth/login", {
                errorMessage: "Please enter both username and password to login."
            })
            return
        }
    
        const foundUser = await User.findOne({username})
    
        if (!foundUser) {
            res.render('auth/login', { errorMessage: 'Incorrect password, try again' })
        }
    
        const passwordCheck = await bcrypt.compare(password,foundUser.password )
    
        if(passwordCheck){
           console.log(req.session)
           //req.session.currentUser = foundUser
           res.redirect(`/auth/profile/${foundUser.username}`)
        }

    }
    /* User.findOne({ username })
        .then(foundUser => {
            return bcrypt.compare(password, foundUser.password)
                .then(result => {
                    if(result){
                        req.session.currentUser = result
                        res.redirect(`/auth/profile/${foundUser.username}`)
                    }
                    else {
                        res.render('auth/login', { errorMessage: 'Incorrect password, try again' })
                    }
            })
    }) */
  catch (error){
    console.log(error)
  }

})

// Profile route
router.get('/profile/:username', (req, res) => {
    const { username } = req.params;
       
    User.findOne({ username })
        .then(foundUser => res.render('auth/profile', foundUser))
        .catch(err => console.log(err))
})


router.post('/logout', isLoggedIn, (req, res) => {
    console.log("before destroy" , req.session.currentUser)
    req.session.destroy(err => {
      if (err) console.log(err);
      console.log("after destroy" , req.session)
      res.redirect('/main');
    });
  });

module.exports = router;