const bcrypt = require("bcryptjs"),
    hbs = require('nodemailer-express-handlebars'),
    MailConfig = require('../config/email'),
    {
        validationResult
    } = require('express-validator'),
    productModel = require("../models/product"),
    { statusCodeConstant, responseData } = require("../utils/functions"),
    productControllerStatus = statusCodeConstant.controllers.product.methods;

exports.getAllProduct = async (req, res) => {
    try {
        const getAllProductMethodStatus = productControllerStatus.getAllProduct
        const products = await productModel.find()

        return responseData({data: products})
    } catch (ex) {
        return res.status(400).json({
            error: decipherEx(ex),
        });
    }
}

exports.createProduct = async(req, res) => {
    try {
        const errors = validationResult(req),
        createProductMethodStatus = productControllerStatus.createProduct.statusCodes,
        if (!errors.isEmpty()) {
            const validationErrorStatus = createProductMethodStatus.statusCodes.validationError
            return responseData({
                state: validationErrorStatus.state,
                msg: validationErrorStatus.message,
                data: errors.array()
            })
        }
        
    } catch(ex) {
        return res.status(400).json({
            error: decipherEx(ex),
        });
    }
}