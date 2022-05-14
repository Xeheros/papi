// Imports
const mailer = require('nodemailer');
const models = require('../models');

const transporter = mailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

async function randomFriendCode(pattern = process.env.FRIEND_CODE_PATTERN, characters = process.env.FRIEND_CODE_CHARACTERS) {
    let result = pattern;
    const charactersLength = characters.length;

    do {
        result = result.replace(/#/g, () => characters.charAt(Math.floor(Math.random() * charactersLength)));
    } while (result.match(/#/g));

    const user = await models.User.findOne({ where: { friendCode: result } });

    return user ? null : result;
}

async function randomRecoveryCode(pattern = process.env.RECOVERY_CODE_PATTERN, characters = process.env.RECOVERY_CODE_CHARACTERS) {
    let result = pattern;
    const charactersLength = characters.length;

    do {
        result = result.replace(/#/g, () => characters.charAt(Math.floor(Math.random() * charactersLength)));
    } while (result.match(/#/g));

    return result;
}

// Routes
module.exports = {
    register: async function(req, res) {

        let friendCode = "";
        const { deviceId, username, email } = req.body;

        // Check if email already exists
        const user = await models.User.findOne({
            attributes: ['id'],
            where: {
                [models.Sequelize.Op.or]:
                [
                    { deviceId},
                    { username },
                    { email }
                ]
            }
        });

        if(user)
            return res.status(409).json({ error: "User already exists." });

        do {
            friendCode = await randomFriendCode();
        } while (!friendCode);

        const newUser = await models.User.create({
            email: email,
            friendCode: friendCode,
            deviceId: deviceId,
            username: username
        });

        if(!newUser)
            return res.status(500).json({ error: "Can't add user."});

        return res.status(201).json({ message: "User created!", userId: newUser.id });
    },
    login: function(req, res) {

    },
    reset: async function (req, res) {
        const {email} = req.body;

        if (!email)
            return res.status(400).json({error: 'Email is required.'});

        const account = await models.User.findOne({where: {email: email}});

        if (!account)
            return res.status(404).json({error: 'No account with this email was found.'});

        const recoveryCode = await randomRecoveryCode()

        models.User.update(
            {
            recovery: recoveryCode,
            recoveryTimestamp: timestamp
            },
            {
                where:
                {
                    email: email,
                }
            }
        );

        const emailInfo = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Pearfect account recovery',
            text: 'Your recovery code is: ' + recoveryCode + '\n\n' +
                'This code will expire in ' + parseInt(process.env.RECOVERY_CODE_EXPIRATION) / 60 + ' minutes.'
        });

        if(!emailInfo)
            return res.status(500).json({error: 'Error sending recovery email.'});

        return res.status(200).json({message: 'Recovery email sent.'});
    },
    recovery: function(req, res) {

    },
}