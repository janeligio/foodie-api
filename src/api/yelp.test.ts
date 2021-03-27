import axios from 'axios';
import { randomizeBusinesses, extrapolateQuery, calculateNextOffset } from '../util/util';
const KEY = process.env.YELP_API_KEY || require("../keys/keys").YELP_API_KEY;


export async function testGetYelpDessertPlaces(
    lat: string | undefined,
    lng: string | undefined,
    address: string | undefined,
    foodType: string | undefined,
    offset: string | undefined,
    open: string | undefined,
    harder: string | undefined) {

    const hostname = 'https://api.yelp.com/v3/businesses/search?';
    let queries;
    try {
        queries = extrapolateQuery({ lat, lng, address, foodType, offset, open, harder });
    } catch (e) {
        return {
            total: 0,
            businesses: [],
            error: e
        }
    }

    let queryParams = '';
    for (const [key, value] of Object.entries(queries)) {
        console.log(`${key}: ${value}`);
        if (value && typeof value !== 'undefined') {
            queryParams += `${key}=${value}&`;
        }
    }

    console.log(queryParams);
    return axios({
        method: 'get',
        url: hostname + queryParams,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${KEY}`
        }
    }).then(response => {
        // console.log(response.data.businesses);
        const remainingCalls = response.headers['ratelimit-remaining'];
        console.log(`Remaining Calls: ${remainingCalls}`);
        const { businesses, total } = response.data;
        console.log(`Total Matches: ${total}`);
        let randomizedBusinesses = randomizeBusinesses(businesses);
        console.log(`Randomized Matches: ${randomizedBusinesses.length}`);
        let newOffset = calculateNextOffset(offset, total);

        console.log(`New offset:${newOffset}`)
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
        }
    });
}