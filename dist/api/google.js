const axios = require("axios");
// const API_KEY = process.env.API_KEY || require('../keys/keys').GOOGLE_API_KEY;
const API_KEY = process.env.YELP_API_KEY || require("../keys/keys").YELP_API_KEY;
/**
 * Makes request to Google geocoding api to obtain an address given a lat/lng
 * @param lat
 * @param lng
 * @returns address: string
 */
function getAddress(lat, lng) {
    const hostname = 'https://maps.googleapis.com';
    const path = `/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`;
    return axios({
        method: 'get',
        url: hostname + path,
        headers: { 'Access-Control-Allow-Origin': '*' }
    })
        .then(response => {
        const { results } = response.data;
        //console.log(results);
        return results[1].formatted_address;
    }).catch(err => {
        console.log(err);
    });
}
function getGoogleDessertPlaces(lat, lng) {
    const radius = 1500; // Meters
    const keyword = 'dessert';
    const hostname = 'https://maps.googleapis.com';
    console.log(API_KEY);
    const path = `/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&keyword=${keyword}&key=${API_KEY}`;
    return axios({
        method: 'get',
        url: hostname + path,
        headers: { 'Access-Control-Allow-Origin': '*' }
    })
        .then(response => {
        console.log(response.data);
        const { results } = response.data;
        return results;
    }).catch(err => {
        console.error(err);
    });
}
module.exports = {
    getAddress, getGoogleDessertPlaces
};
//# sourceMappingURL=google.js.map