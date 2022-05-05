module.exports = {
    check: function(req, res) {
        console.log('Checking status...');
        res.status(200).send('API is running!');
    },
}