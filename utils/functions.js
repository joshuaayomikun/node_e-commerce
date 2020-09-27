exports.decipherEx = (ex) => {
    console.log(ex)
    switch (true) {
        case typeof ex === "undefined":
            return "An error occurred";
        case typeof ex.msg !== "undefined" || typeof ex.message !== "undefined":
            if (typeof ex.msg !== "undefined")
                return ex.msg;
            else if (typeof ex.message !== "undefined")
                return ex.message;
        default:
            return ex;

    }

}
exports.sendMail = async ({
    from,
    to,
    subject,
    template,
    context,
    mailTransport
} = {}) => {
    MailConfig.ViewOption(mailTransport, hbs);
    const HelperOptions = {
        from,
        to,
        subject,
        template,
        context
    }
    const info = await mailTransport.sendMail(HelperOptions)
    return info
}

exports.responseData = ({
    status = 200,
    state = 1,
    data = {},
    msg = "Success"
} = {}) => {
    return res.status(status).json({
        state,
        data,
        msg
    });
}
exports.statusCodeConstant = {
    controllers: {
        user: {
            methods: {
                createAccount: {
                    statusCodes: {
                        success1: {
                            status: 200,
                            message: "Account created successfully! Check your mail to confirm",
                            state: 1
                        },
                        validationError: {
                            status: 200,
                            message: "Validation Error!",
                            state: -1
                        },
                        error1: {
                            status: 200,
                            message: "User Exists!",
                            state: -2
                        }
                    }

                },
                login: {
                    statusCodes: {
                        success1: {
                            status: 200,
                            message: "Account created successfully! Check your mail to confirm",
                            state: 1
                        },
                        validationError: {
                            status: 200,
                            message: "Validation Error!",
                            state: -1
                        },
                        error1: {
                            status: 200,
                            message: "account not verified",
                            state: -2
                        },
                        error2: {
                            status: 200,
                            message: "account not active",
                            state: -3
                        },
                        error3: {
                            status: 200,
                            message: "Invalid Credentials",
                            state: -4
                        }
                    }
                },
                verifyAccount: {
                    statusCodes: {
                        success1: {
                            status: 200,
                            message: "Account Verified",
                            state: 1
                        },
                        validationError: {
                            status: 200,
                            message: "Validation Error!",
                            state: -1
                        },
                        error1: {
                            status: 200,
                            message: "You can't verify again because you have been verified",
                            state: -2
                        }
                    }

                },
                resendAccountVerification: {
                    statusCode: {
                        success1: {
                            status: 200,
                            message: "Account Verified",
                            state: 1
                        },
                        validationError: {
                            status: 200,
                            message: "Validation Error!",
                            state: -1
                        },
                        error1: {
                            status: 200,
                            message: "You can't verify again because you have been verified",
                            state: -2
                        }
                    }
                }
            }
        },
        product: {
            methods: {
                getAllProduct: {
                    statusCodes: {
                        success1: {
                            status: 200,
                            message: "Products gotten",
                            state: 1
                        },
                        error1: {
                            status: 200,
                            message: "Products gotten",
                            state: -1
                        }
                    }
                },
                createProduct: {
                    statusCodes: {
                        success1: {
                            message: "product created!",
                            code: 1
                        }
                    }
                }
            }
        }
    }
}
