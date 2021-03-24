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
function randomIndex(range) {
    return Math.floor(Math.random() * Math.floor(range));
}
function randomize(businesses) {
    let randomized = [];
    let orderedBusinesses = [...businesses];
    while (orderedBusinesses.length > 0) {
        const oblen = orderedBusinesses.length;
        const rand = randomIndex(oblen);
        if (rand === oblen - 1) {
            randomized.push(orderedBusinesses.pop());
        }
        else {
            const temp = orderedBusinesses[rand];
            randomized.push(temp);
            orderedBusinesses[rand] = orderedBusinesses[oblen - 1];
            orderedBusinesses.pop();
        }
    }
    return randomized;
}
function getYelpDessertPlaces(lat, lng, offset, open, harder) {
    return __awaiter(this, void 0, void 0, function* () {
        const hostname = 'https://api.yelp.com/v3/businesses/search?';
        const radius = harder ? 5000 : 2000;
        const open_now = 'true';
        const limit = 50;
        const queries = {
            latitude: lat,
            longitude: lng,
            radius,
            categories: 'desserts,All',
            open_now: open,
            limit,
            offset
        };
        console.log(queries);
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
            console.log(`Total Matches: ${response.data.total}`);
            let randomizedBusinesses = randomize(businesses);
            console.log(`Randomized Matches: ${randomizedBusinesses.length}`);
            const total = response.data.total;
            let newOffset;
            if ((offset + limit) > total) {
                newOffset = 0;
            }
            else {
                newOffset = offset + limit;
            }
            console.log(`New offset:${newOffset}`);
            const data = {
                total,
                businesses: randomizedBusinesses,
                offset: newOffset
            };
            return data;
        }).catch(err => {
            console.error(err);
            return {
                total: 0,
                businesses: [],
                error: err
            };
        });
    });
}
module.exports = { getYelpDessertPlaces };
exports = {};
//# sourceMappingURL=yelp.js.map