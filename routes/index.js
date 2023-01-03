const router = require("express").Router();
const express = require('express');
const {isLoggedIn} = require("../middleware/route-guard")

/* GET home page */
router.get("/", (req, res, next) => {
  if(req.session.currentUser){
    res.render("index", { loggedIn: true });
  }
  else {
    res.render("index", { loggedIn: false });
  }
});

router.get("/main", (req, res) => {

  res.render("auth/main")
})

router.get("/private", isLoggedIn, (req, res) => {
  if(req.session.currentUser){
    res.render("auth/private", { loggedIn: true });
  }
  else {
    res.render("index", { loggedIn: false });
  }

  
})

module.exports = router;
