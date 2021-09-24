document.getElementsByTagName("button")[0].onclick = function () {
    let city = document.getElementsByTagName("input")[0].value;
    fetch("http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=5d5c5e800344c0d09a75889442acf66f&units=metric")
    .then(response => response.json())
    .then(function(result){
        // input value we empty
        document.getElementsByTagName("input")[0].value = " "; 
        
        // Info visiable
        document.getElementById("info").style.display = "block";
        
        // Takes the name of this day
        let date = new Date();
        let option = { weekday: 'long'};
        let newDate = new Intl.DateTimeFormat('en-US', option).format(date);
        
        //Creat Element and add to DOM
        let weatherInfo = document.getElementById("weather_info");
        let infoDate = document.createElement("h3");
        let infoTemp = document.createElement("h3");
        let infoCondition = document.createElement("h3");
        let infoImg = document.createElement("img");
        let cityName = document.getElementById("cityName");
        cityName.textContent = result.name;
        infoImg.setAttribute("src", "https://openweathermap.org/img/wn/"+result.weather[0].icon+"@2x.png") // weather icon in temp
        infoDate.textContent = newDate; // Day in week
        infoTemp.textContent = "Temperature: "+result.main.temp + "\u2103";// in Celsius
        infoCondition.textContent = "Condition: "+result.weather[0].description; 
        
        //clean childes
        weatherInfo.innerHTML = " ";
        
        // append child
        weatherInfo.appendChild(infoDate);
        weatherInfo.appendChild(infoTemp);
        weatherInfo.appendChild(infoCondition);
        weatherInfo.appendChild(infoImg);
    });
    fetch("https://api.foursquare.com/v2/venues/search?near= "+ city + " &client_id=CK2STORWRLE22ONGCMZ3PHAKMABVS0324RURA0KNT3M5JAAF&client_secret=WS00YPBBKPAQJLHBNO1YRYBCERTN3EB2MPFYQ5TI2C3GEJWH&v=20210924")
    .then(response => response.json())
    .then(function(result){
            console.log(result)
        }
        
    );

}
 
    



