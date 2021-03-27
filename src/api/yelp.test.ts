import axios from 'axios';
import { isUndefined, randomizeBusinesses } from '../util/util';
const KEY = process.env.YELP_API_KEY || require("../keys/keys").YELP_API_KEY;


export async function testGetYelpDessertPlaces(lat:number|undefined, lng:number|undefined, address:string|undefined, offset: number | undefined, open: boolean | undefined, harder: boolean | undefined) {
    const hostname = 'https://api.yelp.com/v3/businesses/search?';
    const radius = harder ? 5000 : 2000;
    const open_now = 'true';
    const limit = 50;

    let latitude;
    let longitude;
    let addr;
    if(!isUndefined(lat) && !isUndefined(lng)) {
        latitude = lat;
        longitude = lng;
        addr = undefined;
    } else if(!isUndefined(address)) {
        addr = address;
    } else {
        return {
            total: 0,
            businesses: [],
            error: 'Error: Must specify lat/lng coordinate or address.'
        }
    }

    const queries = {
        latitude, longitude,
        location: addr,
        radius,
        categories: 'desserts,All',
        open_now: open,
        limit,
        offset
    }

    // console.log(queries);

    let queryParams = '';
    for(const [key, value] of Object.entries(queries)) {
        if(typeof value !== 'undefined') {
            queryParams += `${key}=${value}&`;
        }
    }
    return axios({
        method:'get',
        url: hostname + queryParams,
        headers: {'Access-Control-Allow-Origin':'*',
            'Authorization': `Bearer ${KEY}`}
    }).then(response => {
        // console.log(response.data.businesses);
        const remainingCalls = response.headers['ratelimit-remaining'];
        console.log(`Remaining Calls: ${remainingCalls}`);
        const { businesses, total } = response.data;
        console.log(`Total Matches: ${total}`);
        let randomizedBusinesses = randomizeBusinesses(businesses);
        console.log(`Randomized Matches: ${randomizedBusinesses.length}`);
        let newOffset;
        if((offset+limit) > total) {
            newOffset = 0;
        } else {
            newOffset = offset + limit;
        }
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