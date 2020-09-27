const bcrypt = require("bcryptjs"),
    hbs = require('nodemailer-express-handlebars'),
    MailConfig = require('../config/email'),
    {
        validationResult
    } = require('express-validator'),
    userModel = require('../models/user'),
    {
        sign,
        verify
    } = require('jsonwebtoken'),
    {
        APP_LOCALHOST,
        CLIENT_LOCALHOST,
        CLIENT_WEBHOST,
        EMAIL_SECRET,
        LOGIN_SECRET
    } = require('../config/appconfig'),
    {
        decipherEx,
        responseData,
        sendMail,
        statusCodeConstant
    } = require('../utils/functions'),
    userControllerStatus = statusCodeConstant.controllers.user.methods

gmailTransport = MailConfig.GmailTransport

exports.createAccount = async (req, res) => {
    const createAccountMethodStatus = userControllerStatus.createAccount
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const validationErrorStatus = createAccountMethodStatus.statusCodes.validationError
            return responseData({
                state: validationErrorStatus.state,
                msg: validationErrorStatus.message,
                data: errors.array()
            })
        }
        const {
            email,
            password,
            name,
            gender,
            phoneNo
        } = req.body,
            payload = {
                email,
                name,
                gender,
                phoneNo
            },
            existingUser = await userModel.findOne({
                email
            }),
            salt = await bcrypt.genSalt(10);

        if (!existingUser) {
            const emailToken = sign(payload, EMAIL_SECRET, {
                    expiresIn: 90000
                }),
                newUser = new userModel({
                    email,
                    name,
                    gender,
                    phoneNo,
                    confirmEmailToken: emailToken
                })
            newUser.password = await bcrypt.hash(password, salt);
            await newUser.save();
            if (newUser._id) {

                const info = await sendMail({
                    mailTransport: gmailTransport,
                    from: '"Joshua Akande" <joshuaayomikun@gmail.com>',
                    to: email,
                    subject: 'Account Creation!',
                    template: 'accountverification',
                    context: {
                        link: `http://${req.hostname.toLowerCase() === APP_LOCALHOST.toLocaleLowerCase()? CLIENT_LOCALHOST: CLIENT_WEBHOST}/account/emailverification/${emailToken}`,
                        email: email,
                        name: name
                    }
                })
                return responseData({msg: createAccountMethodStatus.statusCodes.success1.message})
            }

        }
        return responseData({
            msg: createAccountMethodStatus.statusCodes.error1.message,
            state: createAccountMethodStatus.statusCodes.error1.state
        })
    } catch (ex) {
        return res.status(400).json({
            error: decipherEx(ex),
        });
    }
}

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        const loginMethodStatus = userControllerStatus.login
        if (!errors.isEmpty()) {
            const validationErrorStatus = loginMethodStatus.statusCodes.validationError
            return responseData({
                state: validationErrorStatus.state,
                data: errors.array(),
                msg: validationErrorStatus.message
            })
        }
        const {
            email,
            password
        } = req.body
        const user = await userModel.findOne({
            email
        })

        const payload = {
            user: {
                id: user._id
            }
        }
        const confPass = await bcrypt.compare(password, user.password)
        if (confPass) {
            switch (user.status) {
                case 'active':
                    const token = sign(payload, LOGIN_SECRET, {
                        expiresIn: 20000
                    })
                    if (token !== "") {
                        const data = {
                            userId: user._id,
                            token,
                            name: user.name,
                            email: user.email
                        }
                        return responseData({
                            state: loginMethodStatus.statusCodes.success1.state,
                            data
                        })
                    }
                    break;
                case 'notverified':
                    return responseData({
                        state: loginMethodStatus.statusCodes.error1.state,
                        msg: loginMethodStatus.statusCodes.error1.message
                    })
                case 'notactive':
                    return responseData({
                        state: loginMethodStatus.statusCodes.error2.state,
                        msg: loginMethodStatus.statusCodes.error2.message
                    })
                default:
                    throw "An error occurred"
            }
        } else {
            return responseData({
                state: loginMethodStatus.statusCodes.error3.state,
                msg: loginMethodStatus.statusCodes.error3.message
            })
        }

        throw 'An error occured!'
    } catch (ex) {
        return res
            .status(400)
            .json({
                error: decipherEx(ex)
            });
    }
}

exports.verifyAccount = async (req, res) => {
    const {
        token
    } = req.params
    try {

        const verifyAccountMethodStatus = userControllerStatus.verifyAccount
        const checkUser = await userModel.findOne({
            confirmEmailToken: token
        })
        // console.log({checkUser})
        switch (checkUser.status) {
            case "notverified":
                const decoded = verify(token, EMAIL_SECRET);
                // console.log(req, decoded);

                if (decoded) {
                    const {
                        email,
                        name
                    } = decoded,
                    filter = {
                            email
                        },
                        update = {
                            status: 'active'
                        },
                        user = await userModel.findOneAndUpdate(filter, update, {
                            new: true
                        });
                    switch (user.status) {
                        case 'active':
                            const info = await sendMail({
                                mailTransport: gmailTransport,
                                context: {
                                    name
                                },
                                from: '"Joshua Akande" <joshuaayomikun@gmail.com>',
                                template: 'successverificationnotification',
                                subject: 'Account Verified!',
                                to: email,
                            })
                            return responseData({
                                msg: verifyAccountMethodStatus.statusCodes.success1.message
                            })
                        default:
                            return responseData({
                                msg: verifyAccountMethodStatus.statusCodes.error1.message,
                                state: verifyAccountMethodStatus.statusCodes.error1.state
                            })
                    }
                }
                case 'active':
                    return responseData({
                        msg: verifyAccountMethodStatus.statusCodes.error1.message,
                        state: verifyAccountMethodStatus.statusCodes.error1.state
                    })
                default:
                    throw "An error occurred"
        }
    } catch (ex) {
        return res
            .status(400)
            .json({
                error: decipherEx(ex)
            });
    }
}

exports.resendAccountVerification = async (req, res) => {
    const {
        token
    } = req.params
    try {
        const checkUser = await userModel.findOne({
            confirmEmailToken: token
        }),
        resendAccountVerificationMethodStatus = userControllerStatus.resendAccountVerification.statusCode
        console.log({
            checkUser
        })
        if (checkUser) {
            switch (checkUser.status) {
                case "notverified":
                    const {
                        email,
                        name,
                        gender,
                        phoneNo
                    } = checkUser,
                    payload = {
                            email,
                            name,
                            gender,
                            phoneNo
                        },
                        emailToken = sign(payload, EMAIL_SECRET, {
                            expiresIn: 90000
                        }),
                        updatedUser = await userModel.findOneAndUpdate({
                            confirmEmailToken: token
                        }, {
                            confirmEmailToken: emailToken
                        }, {
                            new: true
                        }),
                        info = await sendMail({
                            mailTransport: gmailTransport,
                            from: '"Joshua Akande" <joshuaayomikun@gmail.com>',
                            to: email,
                            subject: 'Account Creation!',
                            template: 'accountverification',
                            context: {
                                link: `http://${req.hostname.toLowerCase() === APP_LOCALHOST.toLocaleLowerCase()? CLIENT_LOCALHOST: CLIENT_WEBHOST}/account/emailverification/${emailToken}`,
                                email: email,
                                name: name
                            }
                        })
                        return responseData({msg: resendAccountVerificationMethodStatus.success1.message });

                case "active":
                    return responseData({msg: resendAccountVerificationMethodStatus.error1.message,
                    state: resendAccountVerificationMethodStatus.error1.state });
                default:
                    throw "An error occurred"
            }
        } else
            throw "An error occurred"
    } catch (ex) {
        return res
            .status(400)
            .json({
                error: decipherEx(ex)
            });
    }
}
