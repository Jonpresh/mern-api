//const nodeGeocoder = require('node-geocoder');
const axios = require('axios')

const ErrorResponse = require('./errorResponse')


const apiKey= '6pHOSXnuoz5nZGfXTHAhip5ZwJHhWjBg'


// const options = {
//     provider: "mapquest",
//     httpAdapter: 'https',
//     apiKey: '6pHOSXnuoz5nZGfXTHAhip5ZwJHhWjBg',
//     formatter: null
// }

async function getcoordsForAddress(address){
   const response = await axios.get(`http://www.mapquestapi.com/geocoding/v1/address?key=${apiKey}&${encodeURIComponent(address)}`)

   const data = response.data

   if (!data || data.status === 'ZERO_RESULTS') {
        const error = new ErrorResponse('COuld not find location for the specified address', 422)

        throw error;
   }

  const coordinates = data.results[0].locations.latLng
  return coordinates
}



module.exports = getcoordsForAddress


//const geocoder = nodeGeocoder(options);
//module.exports = geocoder;