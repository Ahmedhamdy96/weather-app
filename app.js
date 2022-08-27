const currentDegree = document.querySelector(".current-degree");
const cityName = document.querySelector(".city-name");
const currentIcon = document.querySelector(".icon");
const currentDescription = document.querySelector(".text");
const humidityElement = document.querySelector(".humidity span");
const windSpeed = document.querySelector(".wind-speed span");

const currentDayName = document.querySelector(".day-name");
const currentDate = document.querySelector(".day-date");
const currentTime = document.querySelector(".current-time");

const nextDays = document.querySelectorAll(".day");
/* ---------------------------------------------------- */

const getUserLocation = () => {
  let promise = new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      let currentLocation = navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            long: position.coords.longitude,
            lat: position.coords.latitude,
          };
          resolve(userLocation);
        }
      );
    } else {
      console.log("Can't access user location");
    }
  });

  return promise;
};

/* ---------------------------------------------------- */
const getDayName = (day) => {
  const dayes = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return dayes[day];
};
/* ------------------------------------------------------ */
const setDateAndTime = () => {
  let date = new Date();
  let day = date.getDate();
  let weekDay = date.getDay();
  let dayName = getDayName(weekDay);
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let hours = date.getHours();
  let minutes = date.getMinutes();

  currentDayName.innerHTML = `${dayName}`;
  currentDate.innerHTML = `${day} - ${month} - ${year} `;
  currentTime.innerHTML = `${hours}:${minutes}`;
};
/* ------------------------------------------------------ */

setDateAndTime();
getUserLocation().then((response) => {
  const longitude = response.long;
  const latitude = response.lat;

  const apiKey = "cf7430bd46ce4bf6a0845701221504";
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&lang=ar`
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      setCity(response);
      setTemprature(response);
      setCurrentIcon(response);
      setCurrentDescription(response);
      setHumidity(response);
      setWindSpeed(response);
    });

  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${latitude},${longitude}&days=3&lang=ar`
  )
    .then((response) => response.json())
    .then((response) => {
      dsiplayForcast(response);
    });
});
1;

const setCity = (response) => {
  // console.log(response);
  let currentCityName = response.location.name;
  cityName.innerHTML = currentCityName;
};

const setTemprature = (response) => {
  let currentTemp = response.current.temp_c;
  currentDegree.innerHTML = `${currentTemp} <span>&#8451;</span> `;
};

const setCurrentIcon = (response) => {
  let iconSource = response.current.condition.icon;
  let iconImage = currentIcon.querySelector("img");
  iconImage.src = iconSource;
};

const setCurrentDescription = (response) => {
  let descriptionText = response.current.condition.text;

  currentDescription.innerHTML = descriptionText;
};

const setHumidity = (response) => {
  let humidity = response.current.humidity;
  humidityElement.innerHTML = `${humidity} %`;
};

const setWindSpeed = (response) => {
  let currentWindSpeed = response.current.wind_kph;
  windSpeed.innerHTML = `${currentWindSpeed} Km/h`;
};

const dsiplayForcast = (response) => {
  console.log(response);
  let threeDays = response.forecast.forecastday;
  let i = 0;

  threeDays.forEach((day) => {
    let dateString = day.date;
    let [y, m, d] = dateString.split("-");
    let dNumber = new Date(`${y}/${m}/${d}`).getDay();
    let dName = getDayName(dNumber);

    nextDays[i].querySelector(".day-name").innerHTML = dName;
    nextDays[i].querySelector(".date").innerHTML = `${d}-${m}-${y}`;
    nextDays[i].querySelector(
      ".min-degree"
    ).innerHTML = `${day.day.mintemp_c}  <span>&#8451;</span> `;
    nextDays[i].querySelector(
      ".max-degree"
    ).innerHTML = `${day.day.maxtemp_c}  <span>&#8451;</span> `;
    nextDays[i].querySelector(".description").innerHTML =
      day.day.condition.text;
    nextDays[i].querySelector(".icon img").src = day.day.condition.icon;
    i++;
  });
};
