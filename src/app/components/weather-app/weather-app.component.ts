import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { interval, takeWhile } from 'rxjs';

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
    // get the user's location, and send the long/lat to the weather checker
    this.http.get("https://api.ipstack.com/check?access_key=8f24b4a9c4cba8e5cd8140cb5e2a8cbd")
       .subscribe((data: any) => {
          console.log (data);
               this.coords = [data.latitude, data.longitude]
               this.getWeatherAtLocation(this.coords);
           }
        );
  }

  getWeatherAtLocation (coords: [number, number]): void {
    // take the lat/long for a location, and grab the weather for it
    this.http.get("https://api.openweathermap.org/data/2.5/weather?lat=" + coords[0] + "&lon=" + coords[1] + "&units=metric&APPID=ccb35c4ddc9c18fbc7a99948519855b7")
       .subscribe((data) => {
               this.weatherData = data;
               this.massageTheData();
           }
        );
}

  getWeatherAtPlace(placeID: string): void  {
    // if a specific location ID is passed, grab the weather for that place
    this.http.get("https://api.openweathermap.org/data/2.5/weather?id=" + placeID + "&units=metric&APPID=ccb35c4ddc9c18fbc7a99948519855b7")
       .subscribe((data) => {
               this.weatherData = data;
               this.massageTheData();
           }
        );
  }

  massageTheData(): void {
    // check we have the weather data, then do some shenanigans with it
    if (this.weatherData != null) {
          //get the current time, and the sunset/rise times for the location
          let now = Date.now(),
            sunTimes = [
              (this.weatherData.sys.sunrise * 1000) - 3600000, //night ends, dawn starts
              (this.weatherData.sys.sunrise * 1000) + 3600000, //dawn ends, daytime starts
              (this.weatherData.sys.sunset * 1000) - 3600000, //daytime ends, dusk starts
              (this.weatherData.sys.sunset * 1000) + 3600000 //dusk ends, night starts
            ];
          
          
          if (now < sunTimes[0] || now > sunTimes[3]) {
              //Before dawn or after dusk - it's night time
              this.weatherSpecifics.day = false;
              this.weatherSpecifics.dusk = false;
          } else if (now > sunTimes[1] && now < sunTimes[2]) {
              //After dawn but before dusk - it's day time
              this.weatherSpecifics.day = true;
              this.weatherSpecifics.dusk = false;
          } else {
            // During dusk or dawn
            this.weatherSpecifics.day = false;
            this.weatherSpecifics.dusk = true;
          }


          //weather API can return multiple types of weather for an area, but the first one is the predominant type of weather. So we'll operate on that one!
          var mainWeather = this.weatherData.weather[0];
          this.weatherSpecifics.label = mainWeather.main;

          //run the temperature through the animation process
          this.changeTemperature(this.weatherData.main.temp.toFixed(0));

          //first digit of the weather ID is (mostly) what determines the broad weather type. Get that and switch against it for the weather details
          switch (String(mainWeather.id).charAt(0)) {
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
                  if (mainWeather.id == 800){
                      //clear skies - check if it's night or day for the icon
                      this.weatherSpecifics.icon = this.weatherSpecifics.day ? "☀" : "☾" ;
                  } else {
                      //cloudy
                      this.weatherSpecifics.icon = "☁";
                  }
                  break;
              case '9':
                  if (String(mainWeather.id).charAt(1) == '0') {
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
      // while we *could* smash-cut temperature changes, why not be a smartarse and have them tick up?
        interval(25)
        .pipe(takeWhile(() => this.weatherSpecifics.temp != newTemp))
        .subscribe(() => {
            this.weatherSpecifics.temp < newTemp ? this.weatherSpecifics.temp++ : this.weatherSpecifics.temp--;
        });
  }
}

