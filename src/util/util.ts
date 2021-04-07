export function randomIndex(range): number {
    return Math.floor(Math.random() * Math.floor(range));
}

export function randomizeBusinesses(businesses) {
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

export function isUndefined(value: any): boolean {
    return typeof value === 'undefined';
}

import { DessertCategory, Term } from '../types/types';

export function extrapolateQuery(query) {
    const { foodType, address } = query;
    const lat = query.lat || undefined;
    const lng = query.lng || undefined;


    let latitude:number;
    let longitude:number;
    let addr:string;
    let term:Term;
    let categories:DessertCategory;
    let radius:number = 2000;   // Search within 2km
    let open_now = query.open;
    let limit:number = 50; // Max limit
    let offset:number = parseInt(query.offset) || 0;
    let sort_by:string = 'rating';

    // Determine 'term' and 'categories' queries
    if(foodType === 'dessert'){
        term = 'desserts';
        categories = 'desserts,All';
    } else if(foodType === 'meal') {
        term = 'restaurants';
    }

    // Determine radius query
    if(query.harder === 'true') {
        radius = 5000;
    }

    // Determine latitude/longitude or address query
    if(!isUndefined(lat) && !isUndefined(lng)) {
        latitude = lat;
        longitude = lng;
        addr = undefined;
    } else if(!isUndefined(address)) {
        addr = address;
    } else {
        throw 'Must specify lat/lng coordinate or address.'
    }

    const queries = {
        latitude, 
        longitude,
        location: addr,
        radius,
        term,
        categories,
        open_now,
        limit,
        offset,
        sort_by
    }
    return queries;
}

export function calculateNextOffset(offset, total):number {
    const limit = 50;
    if((parseInt(offset)+limit) > parseInt(total)) {
        return 0;
    } else {
       return parseInt(offset) + limit;
    }
}

export function nextRequestOffsets(offset, total): number[] {
    const MAX_BUSINESSES = 200;
    const MAX_BUSINESSES_RETURNED = 50;

    const newOffset = offset + MAX_BUSINESSES_RETURNED;
    const range = total - newOffset;
    let numRequests = 0;
    if(range <= MAX_BUSINESSES) {
        numRequests = range / MAX_BUSINESSES_RETURNED;
    } else {
        numRequests = MAX_BUSINESSES / MAX_BUSINESSES_RETURNED;
    }
    let offsets:number[] = [];
    for(let i = 0; i < numRequests; i++) {
        offsets.push(newOffset+(i * MAX_BUSINESSES_RETURNED));
    }
    return offsets;
}

export function buildQueryParams(queries) {
    let queryParams = '';

    for (const [key, value] of Object.entries(queries)) {
        if (value && typeof value !== 'undefined') {
            queryParams += `${key}=${value}&`;
        }
    }
    console.log(queryParams);
    return queryParams.slice(0, queryParams.length-1);
}