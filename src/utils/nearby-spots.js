const axios = require("axios");

const GOOGLE_API_KEY = process.env.GOOGLE_MAP_API_KEY;

const searchGooglePlaces = async (query, lat, lng, radius = 100000) => {
  // Default radius is set to 100,000 meters
  const endpoint = "https://maps.googleapis.com/maps/api/place/textsearch/json";
  let params = {
    query: query,
    key: GOOGLE_API_KEY,
  };
  if (lat && lng) {
    params.location = `${lat},${lng}`;
    params.radius = radius;
  }
  try {
    const response = await axios.get(endpoint, { params });
    const results = response.data.results;
    console.log(results);
    // Extract latitude and longitude for each result
    return results.map((result) => ({
      /* ...result, */
      name: result.name,
      address: result.formatted_address,
      opening_hours: result.opening_hours,
      rating: result.rating,
      types: result.types,
      user_ratings_total: result.user_ratings_total,
      place_id: result.place_id,
      lat: result.geometry.location.lat,
      lng: result.geometry.location.lng,
    }));
  } catch (error) {
    console.error("Error searching Google Places:", error);
    throw error;
  }
};

module.exports = { searchGooglePlaces };
