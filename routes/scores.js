// Routes
const models = require("../models");
const jwt = require("../utils/jwt.utils")
const moment = require("moment");

module.exports = {
    add: async function(req, res) {
        const { token } = req.query;

        if (!token) {
            return res.status(401).json({
                error: "Missing token."
            });
        }

        const tokenVerified = jwt.verify(token);

        if(tokenVerified.httpCode !== 200) {
            return res.status(tokenVerified.httpCode).send(tokenVerified.error);
        }

        const { deviceId, score } = req.body;

        const user = await models.User.findOne({
            where: {
                deviceId: deviceId
            }
        });

        if(!user)
            return res.status(404).json({
                "error": "User not found"
            });

        const oldScore = await models.UserScore.findOne({
            where: {
                UserId: user.id,
                updatedAt: {
                    [models.Sequelize.Op.gte]: moment().startOf('month'),
                    [models.Sequelize.Op.lte]: moment().endOf('month')
                }
            }
        });

        let newScore;
        if(oldScore) {
            if(oldScore.score < score) {
                newScore = await oldScore.update({
                    score: score
                });

                return res.status(200).send("Score updated with new value: " + newScore.score + ".");
            }

            return res.status(202).send("Score not updated, because new score isn't higher than the old one.");
        } else {
            newScore = await models.UserScore.create({
                UserId: user.id,
                score: score
            });

            return res.status(201).send("Score entry created with value: " + newScore.score + ".");
        }
    },
    update: function(req, res) {

    },
    list: async function(req, res) {
        console.log("Listing scores...");

        const { token } = req.query;

        const tokenVerified = jwt.verify(token);

        if(tokenVerified.httpCode !== 200) {
            return res.status(tokenVerified.httpCode).send(tokenVerified.error);
        }

        const { year, month } = req.params;

        const { deviceId } = req.query;

        let timeFilter;

        if(year)
        {
            const intMonth = parseInt(month);
            if(month)
            {
                timeFilter = {
                    updatedAt: {
                        [models.Sequelize.Op.gte]: moment().year(year).month(intMonth - 1).startOf('month'),
                        [models.Sequelize.Op.lte]: moment().year(year).month(intMonth - 1).endOf('month')
                    }
                }
            }
            else
            {
                timeFilter = {
                    updatedAt: {
                        [models.Sequelize.Op.gte]: moment(year + "-01-01").startOf('year'),
                        [models.Sequelize.Op.lte]: moment(year + "-12-31").endOf('year')
                    }
                }
            }

        }

        let scores = await models.UserScore.findAll({
            attributes: [
                ['UserId', 'userId'],
                'score',
                [models.Sequelize.literal('RANK() OVER (ORDER BY score DESC)'), 'rank']
            ],
            order: [
                ['score', 'DESC']
            ],
            where: timeFilter
        });

        if(!scores)
            return res.status(500).json({
                "error": "Internal server error"
            });

        let user;
        if(deviceId)
        {
            user = await models.User.findOne({
                where: {
                    deviceId: deviceId
                }
            });

            let filteredScores;
            if(user)
            {
                const userScore = scores.find(score => score.get('userId') === user.id);

                if(userScore)
                {
                    const userRank = userScore.get('rank');

                    filteredScores = scores.filter(score => {
                        return score.get('rank') === 1 || (score.get('rank') >= userRank - 3 && score.get('rank') <= userRank + 3);
                    });
                }
            }
            else
            {
                filteredScores = scores.filter(score => {
                    return score.get('rank') >= 1 && score.get('rank') <= 8;
                });
            }

            return res.status(200).json(filteredScores);
        }

        return res.status(200).json(scores);
    }
}