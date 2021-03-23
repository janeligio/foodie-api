const KEY = process.env.YELP_API_KEY || require("../keys/keys").YELP_API_KEY;
import axios from 'axios';

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
function randomIndex(range): number {
    return Math.floor(Math.random() * Math.floor(range));
}
function randomize(businesses) {
    let randomized = [];
    let orderedBusinesses = [...businesses];
    while(orderedBusinesses.length > 0) {
        const oblen = orderedBusinesses.length;
        const rand = randomIndex(oblen);
        if(rand === oblen-1) {
            randomized.push(orderedBusinesses.pop())
        } else {
            const temp = orderedBusinesses[rand];
            randomized.push(temp);
            orderedBusinesses[rand] = orderedBusinesses[oblen-1];
            orderedBusinesses.pop();
        }
    }
    return randomized;
}
async function getYelpDessertPlaces(lat:number, lng:number) {
    const hostname = 'https://api.yelp.com/v3/businesses/search?';
    const radius = 2000;
    const open_now = 'true';
    const queries = {
        latitude: lat,
        longitude: lng,
        radius,
        categories: 'desserts,All',
        open_now,
        limit: 50
    }

    let queryParams = '';
    for(const [key, value] of Object.entries(queries)) {
        queryParams += `${key}=${value}&`;
    }
    
    return axios({
        method:'get',
        url: hostname + queryParams,
        headers: {'Access-Control-Allow-Origin':'*',
            'Authorization': `Bearer ${KEY}`}
    })
    .then(response => {
        // console.log(response.data.businesses);
        const remainingCalls = response.headers['ratelimit-remaining'];
        console.log(`Remaining Calls: ${remainingCalls}`);
        const { businesses } = response.data;
        console.log(`Total Matches: ${response.data.total}`);
        let randomizedBusinesses = randomize(businesses);
        console.log(`Randomized Matches: ${randomizedBusinesses.length}`);
        return randomizedBusinesses;
    }).catch(err => {
        console.error(err);
    });
}

module.exports = { getYelpDessertPlaces }
exports = {}