// first we have to work on a function in which we can switch between tabs

// first fetch tabs
const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

// intially variables need 
let currentTab = userTab;
const API_KEY = "f9ca08b610887dd554ab3e257c04ff98";
currentTab.classList.add("current-tab");
getfromSessionStorage();
//ek kaam pending hai??

function switchTab(clickedTab){
    if(clickedTab!= currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //i was first in the searchTab now i have to visible your weather
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //now im in your weather so ive to display weather,so lets check local storage first for cordinates if we saved there
            getfromSessionStorage();
        }
    }
}


userTab.addEventListener("click", ()=>{
    //passed clicked tab as input
    switchTab(userTab);
});
searchTab.addEventListener("click", ()=>{
    //passed clicked tab as input
    switchTab(searchTab);
});
// checked if coordinates are already present in session or not
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //if we cant find the local coordinates
        grantAccessContainer.classList.add("active");
    }
    else {
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);

    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    //make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loder visible
    loadingScreen.classList.add("active");
    //API call
    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove( "active" );
        userInfoContainer.classList.add("active");
        renderWeatherinfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //baki dekho or kya kaar sakte hai HW
    }
}

function renderWeatherinfo(weatherInfo){
    //firstly we have to fetch the elements
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector( "[data-countryIcon]" ); 
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector( "[data-weatherIcon]" );
    const temp = document.querySelector( "[data-temp]" );
    const windspeed = document.querySelector( "[data-windSpeed]" ) ;
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    //fetch values from the weather info object and put it UI elements

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText= weatherInfo?.weather?.[0]?.description;
    weatherIcon. src= `https://openweathermap.org/img/wn/${weatherInfo?.weather?.[0]?.icon}@2x.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}

//how to get user location
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //show an alart for no support available 
    }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,

    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);


const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=> {
    e.preventDefault();
    let cityName = searchInput.value;
    if(cityName === "") return;
    fetchSearchWeatherInfo(cityName);
});
async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        const data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherinfo(data);

    }
    catch(e){

    }
}