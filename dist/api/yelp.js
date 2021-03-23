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
const KEY = process.env.YELP_API_KEY || require("../keys/keys").YELP_API_KEY;
const axios_1 = require("axios");
const x = {
    "id": "7bJ83Jb_DTAF0eOw8j9fow",
    "alias": "leonards-bakery-honolulu",
    "name": "Leonard's Bakery",
    "image_url": "https://s3-media4.fl.yelpcdn.com/bphoto/GuPJhMjerDiz2fZLJNN-rA/o.jpg",
    "is_closed": false,
    "url": "https://www.yelp.com/biz/leonards-bakery-honolulu?adjust_creative=c952kon9Ky0mDZVqm79gbQ&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=c952kon9Ky0mDZVqm79gbQ",
    "review_count": 6992,
    "categories": [
        {
            "alias": "bakeries",
            "title": "Bakeries"
        },
        {
            "alias": "desserts",
            "title": "Desserts"
        },
        {
            "alias": "donuts",
            "title": "Donuts"
        }
    ],
    "rating": 4.5,
    "coordinates": {
        "latitude": 21.2849205022593,
        "longitude": -157.813274525131
    },
    "transactions": [
        "delivery"
    ],
    "price": "$",
    "location": {
        "address1": "933 Kapahulu Ave",
        "address2": "",
        "address3": "",
        "city": "Honolulu",
        "zip_code": "96816",
        "country": "US",
        "state": "HI",
        "display_address": [
            "933 Kapahulu Ave",
            "Honolulu, HI 96816"
        ]
    },
    "phone": "+18087375591",
    "display_phone": "(808) 737-5591",
    "distance": 905.7707653128928
};
function getYelpDessertPlaces(lat, lng) {
    return __awaiter(this, void 0, void 0, function* () {
        const hostname = 'https://api.yelp.com/v3/businesses/search?';
        const radius = 1500;
        const open_now = 'false';
        const queries = {
            latitude: lat,
            longitude: lng,
            radius,
            categories: 'desserts,All',
            open_now
        };
        let queryParams = '';
        for (const [key, value] of Object.entries(queries)) {
            queryParams += `${key}=${value}&`;
        }
        return axios_1.default({
            method: 'get',
            url: hostname + queryParams,
            headers: { 'Access-Control-Allow-Origin': '*',
                'Authorization': `Bearer ${KEY}` }
        })
            .then(response => {
            // console.log(response.data.businesses);
            const remainingCalls = response.headers['ratelimit-remaining'];
            console.log(`Remaining Calls: ${remainingCalls}`);
            const { businesses } = response.data;
            return businesses;
        }).catch(err => {
            console.error(err);
        });
    });
}
module.exports = { getYelpDessertPlaces };
exports = {};
//# sourceMappingURL=yelp.js.map