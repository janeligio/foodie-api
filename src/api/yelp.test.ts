import axios from 'axios';
import { randomizeBusinesses, extrapolateQuery, calculateNextOffset, nextRequestOffsets, buildQueryParams } from '../util/util';
const KEY = process.env.YELP_API_KEY || require("../keys/keys").YELP_API_KEY;


export async function testGetYelpBusinesses(
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

    let queryParams = buildQueryParams(queries);

    console.log(queryParams);

    
    let initialRequest;

    try {
        initialRequest = await axios({method: 'get', url: hostname + queryParams, headers: {
            'Access-Control-Allow-Origin': '*',
            'Authorization': `Bearer ${KEY}`
        }});
    } catch(error) {
        console.error(error);
        return {
            total: 0,
            businesses: [],
            error
        }
    }

    let businesses = [...initialRequest.data.businesses];
    let total = initialRequest.data.total;
    let newOffset = 0;
    const offsets = nextRequestOffsets(parseInt(offset), total);

    if(offsets.length > 0) {
        let requests = [];
        offsets.forEach(offset => {
            const newQueries = {...queries};
            newQueries.offset = offset;
            const queryString = buildQueryParams(newQueries);
            requests.push(axios({method: 'get', url: hostname + queryString, headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': `Bearer ${KEY}`
                }})
            );
        })

        let restBusinesses;
        try {
            restBusinesses = await Promise.all(requests);
        } catch(error) {
            console.error(error);
            return {
                total: 0,
                businesses: [],
                error
            }
        }

        restBusinesses.forEach(response => {
            businesses = [...businesses, ...response.data.businesses];
        });

        newOffset = calculateNextOffset(offsets[offsets.length-1], total);
        const remainingCalls = restBusinesses[restBusinesses.length-1].headers['ratelimit-remaining'];
        console.log(`Total businesses: ${total}`);
        console.log(`Total businesses returned: ${businesses.length}`);
        console.log(`Returned businesses in range: ${offset}-${newOffset || total}`);
        console.log(`New offset: ${newOffset}`);
        console.log(`Remaining calls: ${remainingCalls}`);
        return {
            total,
            businesses: randomizeBusinesses(businesses),
            offset: newOffset
        };
    } else {
        newOffset = calculateNextOffset(offset, total);
        const remainingCalls = initialRequest.headers['ratelimit-remaining'];
        console.log(`Total businesses: ${total}`);
        console.log(`Total businesses returned: ${businesses.length}`);
        console.log(`New offset: ${newOffset}`);
        console.log(`Returned businesses in range: ${offset}-${newOffset || total}`);
        console.log(`Remaining calls: ${remainingCalls}`);

        return {
            total,
            businesses: randomizeBusinesses(businesses),
            offset: newOffset
        };
    }
}