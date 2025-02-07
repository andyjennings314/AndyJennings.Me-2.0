import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-weather-app',
  imports: [NgClass, NgFor, NgIf, NgStyle],
  templateUrl: './weather-app.component.html',
  styleUrl: './weather-app.component.scss'
})
export class WeatherAppComponent implements OnInit {  
  coords: [number, number];
  weatherData: any;
  weatherSpecifics: any;
  hour: number;

  constructor(
    private http: HttpClient
  ){
    this.coords = [0, 0];
    this.weatherData = null;
    this.weatherSpecifics = {temp: 0}
    this.hour = new Date().getHours()
  }

  ngOnInit(): void {
    //this.getUserLocation();
    this.http.get("https://api.ipstack.com/check?access_key=8f24b4a9c4cba8e5cd8140cb5e2a8cbd")
       .subscribe((data: any) => {
          console.log (data);
               this.coords = [data.latitude, data.longitude]
               this.getWeatherAtLocation(this.coords);
           }
        );
  
    //https://freegeoip.net/json/?callback=
    //var lati = data.latitude.roundTo(0)
    //var long = data.longitude.roundTo(0)
    //api.openweathermap.org/data/2.5/weather?lat=" + lati + "&lon=" + long + "
  }

  getWeatherAtLocation (coords: [number, number]): void {
    this.http.get("http://api.openweathermap.org/data/2.5/weather?lat=" + coords[0] + "&lon=" + coords[1] + "&units=metric&APPID=ccb35c4ddc9c18fbc7a99948519855b7")
       .subscribe((data) => {
               this.weatherData = data;
               this.massageTheData();
           }
        );
}

  getWeatherAtPlace(placeID: string): void  {
    this.http.get("http://api.openweathermap.org/data/2.5/weather?id=" + placeID + "&units=metric&APPID=ccb35c4ddc9c18fbc7a99948519855b7")
       .subscribe((data) => {
               this.weatherData = data;
               this.massageTheData();
           }
        );
  }

  massageTheData(): void {
      if (this.weatherData != null) {

          //get the local time, and the sunset/rise times
          let now = Date.now(),
            sunTimes = [
              (this.weatherData.sys.sunrise * 1000) - 3600000,
              (this.weatherData.sys.sunrise * 1000) + 3600000,
              (this.weatherData.sys.sunset * 1000) - 3600000,
              (this.weatherData.sys.sunset * 1000) + 3600000
            ];
          
          
          if (now < sunTimes[0] || now > sunTimes[3]) {
              //It's night time
              this.weatherSpecifics.day = false;
              this.weatherSpecifics.dusk = false;
          } else if (now > sunTimes[1] && now < sunTimes[2]) {
              //It's day time
              this.weatherSpecifics.day = true;
              this.weatherSpecifics.dusk = false;
          } else {
            //From dusk or dawn
            this.weatherSpecifics.day = false;
            this.weatherSpecifics.dusk = true;
          }


          //weather API can return multiple types of weather for an area, but the first one is the predominant type of weather. So we'll operate on that one!
          var mainWeather = this.weatherData.weather[0];
          this.weatherSpecifics.label = mainWeather.main;

          //run the temperature through the animation process
          this.changeTemperature(this.weatherData.main.temp.toFixed(0));

          //first digit of the weather ID is (mostly) what determines the broad weather type. Get that and switch against it for the weather details
          var weatherCode = mainWeather.id;
          switch (String(weatherCode).charAt(0)) {
              case '2':
                  //thunder
                  this.weatherSpecifics.icon = "🌩";
                  break;
              case '3':
                  //drizzle
              case '5':
                  //rain
                  this.weatherSpecifics.icon = "🌧";
                  break;
              case '6':
                  //snow
                  this.weatherSpecifics.icon = "❄";
                  break;
              case '7':
                  //"atmosphere"
                  this.weatherSpecifics.icon = "🌫";
                  break;
              case '8':
                  if (weatherCode == 800){
                      //clear skies - check if it's night or day for the icon
                      if (this.weatherSpecifics.day = true) {
                          this.weatherSpecifics.icon = "☀";
                      } else {
                          this.weatherSpecifics.icon = "☾";
                      }
                  }
                  else {
                      //cloudy
                      this.weatherSpecifics.icon = "☁";
                  }
                  break;
              case '9':
                  if (String(weatherCode).charAt(1) == '0') {
                      //EXTREME WEATHER!!
                      this.weatherSpecifics.icon = "!!!";
                  }
                  else {
                      //everything else - mostly wind
                      this.weatherSpecifics.icon = "🌬";
                  }
                  break;
          }
      }
  }

  changeTemperature(newTemp: number): void {
      //this.weatherSpecifics.temp
      //newTemp
      if (this.weatherSpecifics.temp != newTemp) {
          var goingUp = (this.weatherSpecifics.temp < newTemp) ? true : false;
          if (goingUp) { this.weatherSpecifics.temp++ } else { this.weatherSpecifics.temp-- }

          setTimeout(() => {
              if (this.weatherSpecifics.temp != newTemp) {
                  this.changeTemperature(newTemp);
              }
          }, 25)
      }
  }
}

