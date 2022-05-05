const jwt = require('jsonwebtoken');
const {TokenExpiredError} = require("jsonwebtoken");

module.exports = {
    generate: function (data) {
        const token = jwt.sign({
            userId: data,
        }, process.env.JWT_SECRET, { expiresIn: '1m' });

        console.log("Token<" + data + "> = " + token);

        return token;
    },
    verify: function (token) {
        return jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
            if (err instanceof TokenExpiredError) {
                return {httpCode: 401,
                    error: 'Token expired. Please login again.'
                };
            }
            else if(err) {
                return {httpCode: 401,
                    error: 'Token invalid.'
                };
            }

            return {httpCode: 200,
                data: result
            };
        });
    }
}