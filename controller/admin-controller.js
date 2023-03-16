const Amadeus = require('amadeus');
const amadeus = new Amadeus({
    clientId: 'y5gN096ABuszGybR2rzlmm8duVvxOggq',
    clientSecret: 'iA1cNoUbqAWDpzyS',
});
app.get(`/city-and-airport-search/:parameter`, (req, res) => {
    const parameter = req.params.parameter;
    // Which cities or airports start with the parameter variable
    amadeus.referenceData.locations
        .get({
            keyword: parameter,
            subType: Amadeus.location.any,
        })
        .then(function (response) {
            res.send(response.result);
        })
        .catch(function (response) {
            res.send(response);
        });
});