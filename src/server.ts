const express = require("express");
const cors = require("cors");
const { getGoogleDessertPlaces } = require("./api/google");
import { testGetYelpBusinsses } from './api/yelp.test';
import { getYelpDessertPlaces } from './api/yelp';

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
    res.send("Foodie API");
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
server.get('/foodie/:foodType', async (req, res) => {
    const { lat, lng, address, offset, open_now, harder } = req.query;
    const { foodType } = req.params;
    console.log(req.query);
    const data = await getYelpDessertPlaces(
        lat, 
        lng, 
        address,
        foodType,
        offset, 
        open_now, 
        harder);

    res.send(data);
});

server.get('/foodie/test/:foodType', async (req,res) => {
    const { lat, lng, address, offset, open_now, harder } = req.query;
    const { foodType } = req.params;
    console.log(req.query);
    const data = await testGetYelpBusinsses(
        lat, 
        lng, 
        address,
        foodType,
        offset,
        open_now,
        harder);

    console.log(`Data businesses field length: ${data.businesses.length}`)
    res.send(data);
});

server.listen(port, err => {
    if(err) {
        return console.error(err);
    }
    return console.log(`Server listening is listening on ${port}`);
})

export {};