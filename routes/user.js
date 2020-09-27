const express = require('express');
const { check } = require('express-validator');
const {createAccount, verifyAccount, resendAccountVerification, login } = require('../controllers/user')
const router = express.Router();

router.post(
    "/signup",
    [
      check("name", "Please Enter a Valid name").not().isEmpty(),
      check("phoneNo", "Please Enter a Valid phonenumber").not().isEmpty(),
      check("gender", "Please pick a Valid gender").not().isEmpty(),
      check("email", "Please enter a valid email").isEmail(),
      check("password", "Please enter a valid password").isLength({
        min: 6,
      }),
    ],
    createAccount
  );

  router.post("/login", [
    check("email", "Email cannot be empty").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Password cannot be empty").not().isEmpty()
  ], login)

  router.get("/verifyAccount/:token", verifyAccount);

  router.get("/resendAccountVerification/:token", resendAccountVerification);
  module.exports = router;