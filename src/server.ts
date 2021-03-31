import cors from "cors";
import { testGetYelpBusinesses } from './api/yelp.test';
import { getYelpBusinesses } from './api/yelp';

const server = require("express")().use(cors());

let port;

if (process.env.NODE_ENV === 'production') {
    console.log(`NODE_ENV = production`);
    port = process.env.PORT;
} else {
    console.log(`NODE_ENV = development`);
    port = 8080;
}

server.get('/', (req, res) => {
    res.send("Foodie API");
});

/**
 * Route: /foodie/:foodType
 * Params:
 *  foodType: 'meal' | 'dessert'
 * Queries:
 *  lat: Latitude
 *  lng: Longitude
 *  address: string - A valid location to search within.
 *  offset: number - Offset to return data from.
 *  open_now: 'true' | 'false' - Search for restaurants that are open or not.
 *  harder: 'true' | 'false' - Whether to look in a wider radius (5km) or not (2km).
 */
server.get('/foodie/:foodType', async (req, res) => {
    const { lat, lng, address, offset, open_now, harder } = req.query;
    const { foodType } = req.params;
    const data = await getYelpBusinesses(lat, lng, address,foodType,offset, open_now, harder);
    res.send(data);
});

server.get('/foodie/test/:foodType', async (req,res) => {
    const { lat, lng, address, offset, open_now, harder } = req.query;
    const { foodType } = req.params;
    console.log(req.query);
    const data = await testGetYelpBusinesses(lat, lng, address,foodType,offset,open_now,harder);
    console.log(`Data businesses field length: ${data.businesses.length}`)
    res.send(data);
});

server.listen(port, err => {
    if(err) {
        return console.error(err);
    }
    return console.log(`Server listening is listening on ${port}`);
})