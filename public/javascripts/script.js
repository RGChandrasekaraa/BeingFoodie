function navToRecipeMaker() {
  let recipe = document.getElementById("search").value;
  if (!recipe) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter a recipe name to search",
    });
  } else {
    window.location.href = "/?recipe=" + recipe + "&action=prepare";
  }
}

function navToRecipeExplorer() {
  let recipe = document.getElementById("search").value;
  if (!recipe) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please enter a recipe name to search",
    });
  } else {
    if (!latitude || !longitude) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please allow location access to explore",
      });
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          successCallback,
          errorCallback
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
      return false;
    }
    window.location.href =
      "/?recipe=" +
      recipe +
      "&action=explore&lat=" +
      latitude +
      "&lng=" +
      longitude;
  }
}

var latitude, longitude;

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
} else {
  console.log("Geolocation is not supported by this browser.");
}

function successCallback(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
  initMap();
}

function errorCallback(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      console.log("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      console.log("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      console.log("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      console.log("An unknown error occurred.");
      break;
  }
}

function initMap() {
  let placesData = document.getElementById("places").value;
  if (placesData) {
    placesData = JSON.parse(placesData);
  }
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: {
      lat: latitude ? parseFloat(latitude) : placesData[0].lat,
      lng: longitude ? parseFloat(longitude) : placesData[0].lng,
    },
  });

  const places = placesData;

  places.forEach((place) => {
    const marker = new google.maps.Marker({
      position: place,
      map: map,
      title: place.name,
    });

    marker.addListener("click", function () {
      document.getElementById("location-details").style.display = "block";
      document.getElementById("location-name").textContent = marker.title;
      document.getElementById("location-weather").textContent = place.weather;
      document.getElementById("location-temp").textContent = place.temp;
      document.getElementById("location-address").textContent = place.address;
      document.getElementById("location-directions").href =
        "https://www.google.com/maps/?q=place_id:" + place.place_id;
      document.getElementById("location-rating").textContent =
        "Ratings: " +
        place.rating +
        " (" +
        place.user_ratings_total +
        " Reviews)";
      if (
        place.opening_hours &&
        typeof place.opening_hours.open_now !== "undefined"
      ) {
        document.getElementById("location-status").textContent = place
          .opening_hours.open_now
          ? "Open Now"
          : "Closed";
      } else {
        document.getElementById("location-status").textContent =
          "Opening hours not available";
      }
    });
  });
}
