const express = require("express");
const cors = require("cors");
const { getGoogleDessertPlaces } = require("./api/google");
const { getYelpDessertPlaces } = require("./api/yelp");

const server = express();
server.use(cors());

let port;
let API_KEY;

if (process.env.NODE_ENV === 'production') {
    console.log(`NODE_ENV = production`);
    API_KEY = process.env.API_KEY;
    port = process.env.PORT;
} else {
    console.log(`NODE_ENV = development`);
    port = 8080;
    API_KEY = require('./keys/keys').GOOGLE_API_KEY;
}

server.get('/', (req, res) => {
    res.send("Hello TypeScript world!");
});

/**
 * Route: /foodie
 * Params:
 *  lat: Latitude
 *  lng: Longitude
 *  address: Address
 *  offset: Offset
 *  categories: comma-delimeted string of categories
 */
server.get('/foodie', async (req, res) => {
    const { lat, lng, offset, open_now } = req.query;
    const harder = (req.query.harder === 'true');
    console.log(req.query);
    const data = await getYelpDessertPlaces(lat, lng, parseInt(offset), open_now, harder);
    res.send(data);
})

server.listen(port, err => {
    if(err) {
        return console.error(err);
    }
    return console.log(`Server listening is listening on ${port}`);
})

export {};