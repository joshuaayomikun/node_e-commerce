require('dotenv').config();
const environment = process.env;

exports.CLIENT_LOCALHOST = environment.CLIENT_LOCALHOST
exports.CLIENT_WEBHOST = environment.CLIENT_WEBHOST
exports.APP_LOCALHOST = environment.APP_LOCALHOST
exports.APP_WEBHOST = environment.APP_WEBHOST
exports.EMAIL_SECRET = environment.EMAIL_SECRET
exports.LOGIN_SECRET = environment.LOGIN_SECRET


