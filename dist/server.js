"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
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
}
else {
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
server.get('/foodie', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat, lng, offset, open_now } = req.query;
    console.log(req.query);
    const data = yield getYelpDessertPlaces(lat, lng, parseInt(offset), open_now, harder);
    res.send(data);
}));
server.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`Server listening is listening on ${port}`);
});
//# sourceMappingURL=server.js.map