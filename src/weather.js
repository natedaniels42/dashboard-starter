import days from './days.js';


class Weather {
    constructor(city) {
        this.city = city;
        this.apiKey = '6ba7ddab25b8409c97d164306211811';
        this.apiUrl = `http://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${this.city}&days=5&aqi=no`;
        this.forecast = document.getElementById('forecast');
        this.weatherInterval = null;
        this.weatherInfo = null;
        this.currentIndex = 0;
    }

    setCity(city) {
        clearInterval(this.weatherInterval);
        const currentUrl = `http://api.weatherapi.com/v1/forecast.json?key=${this.apiKey}&q=${city}&days=5&aqi=no`
        this.forecast.innerHTML = '';
        fetch(currentUrl)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                const cityName = document.getElementById('city');
                cityName.innerHTML = `${response.location.name}, ${response.location.region}`;
                this.weatherInfo = response;
                
                this.setWeather(this.weatherInfo, this.currentIndex);
                this.startInterval();
                
                cityName.removeAttribute('style');
                cityName.style.visibility = 'visible';
                localStorage.city = `${response.location.name}, ${response.location.region}`;
                localStorage.lat = response.location.lat;
                localStorage.lon = response.location.lon;
            })
    }

    startInterval = () => {
        this.weatherInterval = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.weatherInfo.forecast.forecastday.length;
            this.setWeather(this.weatherInfo, this.currentIndex);
        }, 5000)
    }
    

    setWeather(response, index) {
        this.forecast.innerHTML = '';
        const day = response.forecast.forecastday[index];
        const current = document.createElement('div');
        const expand = document.createElement('p');
        const currentImage = document.createElement('img');
        const currentDate = document.createElement('p');
        const currentTemp = document.createElement('p');
        const currentWind = document.createElement('p');

        const expandListener = (event) => {
            this.expandWeather();
        }

        expand.removeEventListener('click', expandListener);
        expand.setAttribute('id', 'expand');
        expand.innerHTML = 'See 5-day forecast';
        expand.addEventListener('click', expandListener);
        currentImage.setAttribute('src', day.day.condition.icon);
        currentDate.innerHTML = index === 0 ? 'Today' : `${days[new Date(day.date).getUTCDay()]} ${new Date(day.date).getUTCMonth() + 1}/${new Date(day.date).getUTCDate()}`;
        currentTemp.innerHTML = `Temp: ${Math.floor(day.day.maxtemp_f)}&deg; F`;
        currentWind.innerHTML = `Wind: ${Math.floor(day.day.maxwind_mph)} mph`;
        current.setAttribute('id', index);
        currentImage.setAttribute('id', index);
        currentDate.setAttribute('id', index);
        currentTemp.setAttribute('id', index);
        currentWind.setAttribute('id', index);
        current.appendChild(expand);
        current.appendChild(currentImage);
        current.appendChild(currentDate);
        current.appendChild(currentTemp);
        current.appendChild(currentWind);

        current.addEventListener('click', (event) => {
            clearInterval(this.weatherInterval);
            const currentDay = response.forecast.forecastday[event.target.id];
            console.log(currentDay);
            this.forecast.innerHTML = `<img src=${currentDay.day.condition.icon}>
            <p>${index === 0 ? 'Today' : `${days[new Date(currentDay.date).getUTCDay()]} ${new Date(currentDay.date).getUTCMonth() + 1}/${new Date(currentDay.date).getUTCDate()}`}</p>
            <p>High: ${currentDay.day.maxtemp_f}&deg; F</p>
            <p>Low: ${currentDay.day.mintemp_f}&deg; F</p>
            <p>Wind: ${currentDay.day.maxwind_mph} mph</p>
            <p>Chance of Rain: ${currentDay.day.daily_chance_of_rain}%</p>
            <p>Chance of Snow: ${currentDay.day.daily_chance_of_snow}%</p>
            <p id="hourly">See Hourly Forecast</p>
            <div id="hourly-box"></div>
            <p id="weather-close">Close</p>`;

            const weatherClose = document.getElementById('weather-close');
            const hourlyBox = document.getElementById('hourly-box');
            const hourly = document.getElementById('hourly');

            hourly.addEventListener('click', (event) => {
                if (hourly.innerHTML === 'See Hourly Forecast') {
                    currentDay.hour.forEach(hourData => {
                        const timeSplit = hourData.time.split(' ')[1].split(':');
                        const time = Number(timeSplit[0]) === 0 ? '12:00AM' 
                            : Number(timeSplit[0]) > 12 ? `${Number(timeSplit[0]) - 12}:00PM`
                            : timeSplit[0] === '12' ? '12:00PM'
                            : `${Number(timeSplit[0])}:00AM`;
                        
                        hourlyBox.innerHTML += `<span>${time}</p>
                        <img src=${hourData.condition.icon}>`
                        hourly.innerHTML = 'Hide Hourly Forecast';
                    })
                } else {
                    hourlyBox.innerHTML = '';
                    hourly.innerHTML = 'See Hourly Forecast';
                }
            })
            weatherClose.addEventListener('click', (event) => {
                this.setWeather(this.weatherInfo, this.currentIndex);
                this.startInterval();
            })
        })
        this.forecast.appendChild(current);
    }

    expandWeather() {
        clearInterval(this.weatherInterval);
        this.forecast.innerHTML = '';
        const back = document.createElement('p');
        const backListener = (event) => {
            this.currentIndex = 0;
            this.setWeather(this.weatherInfo, this.currentIndex);
            this.startInterval();
        }

        back.innerHTML = 'Back to 1-day';
        back.addEventListener('click', backListener)
        this.forecast.appendChild(back);
        this.weatherInfo.forecast.forecastday.forEach((day, i) => {
            const current = document.createElement('div');
            const currentImage = document.createElement('img');
            const currentDate = document.createElement('p');
            const currentTemp = document.createElement('p');
            const currentWind = document.createElement('p');

            currentImage.setAttribute('src', day.day.condition.icon);
            currentDate.innerHTML = i === 0 ? 'Today' : days[new Date(day.date).getUTCDay()];
            currentTemp.innerHTML = `${Math.floor(day.day.maxtemp_f)}&deg; F`;
            currentWind.innerHTML = `Wind: ${Math.floor(day.day.maxwind_mph)} mph`;
            current.appendChild(currentImage);
            current.appendChild(currentDate);
            current.appendChild(currentTemp);
            current.appendChild(currentWind);
            this.forecast.appendChild(current);
        })
    }
    
    render() {
        this.forecast.innerHTML = '';
        fetch(this.apiUrl)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                const cityName = document.getElementById('city');
                cityName.innerHTML = `${response.location.name}, ${response.location.region}`;
                this.weatherInfo = response;
                
                this.setWeather(this.weatherInfo, this.currentIndex);
                this.startInterval();
                return  [response.location.lat, response.location.lon];  
            })
    }
}

export default Weather;