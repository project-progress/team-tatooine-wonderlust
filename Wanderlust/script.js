document.getElementsByTagName("button")[0].onclick = function(){
    let city = document.getElementsByTagName("input")[0].value;
    fetch("http://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=5d5c5e800344c0d09a75889442acf66f&units=metric")
    .then(response => response.json())
    .then(function(result){
        // input value we empty
        document.getElementsByTagName("input")[0].value = " "; 
        document.getElementById("info").style.display = "block";
        // Takes the name of this day
        let date = new Date();
        let weekday = date.getDay();
        let option = { weekday: 'long'};
        let newDate = new Intl.DateTimeFormat('en-US', option).format(date);
        //Creat Element and add to DOM
        let weatherInfo = document.getElementById("weather_info");
        let infoDate = document.createElement("h3");
        let infoTemp = document.createElement("h3");
        let infoCondition = document.createElement("h3");
        let infoImg = document.createElement("img");
        infoImg.setAttribute("src", "https://openweathermap.org/img/wn/"+result.weather[0].icon+"@2x.png") // weather icon in temp
        infoDate.textContent = newDate; // Day in week
        infoTemp.textContent = "Temperature: "+result.main.temp + "\u2103";// in Celsius
        infoCondition.textContent = "Condition: "+result.weather[0].description; 
        weatherInfo.appendChild(infoDate);
        weatherInfo.appendChild(infoTemp);
        weatherInfo.appendChild(infoCondition);
        weatherInfo.appendChild(infoImg);
    });
}


