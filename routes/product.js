
const express = require('express');
const { check } = require('express-validator');
const multer = require('multer');
const router = express.Router();

router.post('/createProduct', multer.si)