document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.querySelector("#search-button")
    const api = "794c4d3ff89210cbb46e105c1d0e3efd"
    const searchBar = document.querySelector("#search-bar")
    const today = new Date()
    currHour = today.getHours() 
    //Default value for weather forcast is at Halifax
    displayInfo("Halifax", api)

    searchButton.addEventListener("click", () => {
        city = searchBar.value
        displayInfo(city, api)
    })
})  

function firstUpperCase(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function displayWeatherIcon(code) {
    switch(code) {
        case "Thunderstorm":
            return '<i class="fa-solid fa-bolt"></i>'
        case "Drizzle":
            return `<i class="fa-solid fa-cloud-drizzle"></i>`
        case "Rain":
            return `<i class="fa-solid fa-cloud-showers-heavy"></i>`
        case "Snow":
            return `<i class="fa-regular fa-snowflake"></i>`
        case "Clear":
            return `<i class="fa-solid fa-sun-plant-wilt"></i>`
        case "Clouds":
            return `<i class="fa-solid fa-cloud"></i>`
        default:
            return `<i class="fa-solid fa-wind"></i>`
    }
}

function displayInfo(city, api) {
    const futureWrapper = document.querySelector("#future")
    const mapWrapper = document.querySelector('#map')

    //Display background as a random img
    body = document.querySelector("body")
    body.style.backgroundImage = 'url("https://picsum.photos/2500/1500?grayscale")'

    //Felching data for geocoding
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${api}`)
    .then(response => response.json())
    .then(data => {
        country = data[0].country
        lat = data[0].lat
        lon = data[0].lon

        //Display city and country name
        document.querySelector('#location-display').innerHTML = `${city}, ${country}`

        //Fetching current weather data
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`)
        .then(response => response.json())
        .then(data => {
            // Field variables 
            temp = (data.main.temp - 273.15).toPrecision(2)
            weatherDesc = firstUpperCase(data.weather[0].description)
            weatherMain = data.weather[0].main
            wind = (data.wind.speed * 3.6).toPrecision(2)
            humid = data.main.humidity

            //Display current weather 
            document.querySelector("#current-temp").innerHTML = `${temp}° C`
            document.querySelector("#current-weather").innerHTML = `${displayWeatherIcon(weatherMain)} ${weatherDesc}`
            document.querySelector("#current-wind").innerHTML = `Wind: ${wind} km/h`
            document.querySelector("#current-humid").innerHTML = `Humidity: ${humid} %`
        })

        //Fetching future weather data
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api}`)
        .then(response => response.json())
        .then(data => {
            futureWrapper.innerHTML = ''

            //Section of data the current hour belong
            section = Math.round(currHour/3)
            for(let i = section; i < section + 4; i++) {
                //Create new element
                furInfo = document.createElement('div')
                furInfo.className = 'future-info'
                furHeading = document.createElement('div')
                furIcon = document.createElement('div')
                furWeather = document.createElement('div')

                //Asign variable to json value
                weatherMain = data.list[i].weather[0].main
                timeDate = (data.list[i].dt_txt).split(' ')
                time = timeDate[1].substring(0,5)

                //Display future weather
                furHeading.innerHTML = `${time}`
                furHeading.className = 'future-time'
                furIcon.innerHTML = `${displayWeatherIcon(weatherMain)}`
                furIcon.className = 'future-icon'
                furWeather.innerHTML = `${weatherMain}`
                furWeather.className = 'future-weather'

                //Add created elements to future weather wrapper
                furInfo.appendChild(furHeading)
                furInfo.appendChild(furIcon)
                furInfo.appendChild(furWeather)
                futureWrapper.appendChild(furInfo)
            }
            
        })
    })
}