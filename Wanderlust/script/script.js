// Weather section js
let isTrueCity = false;
function displayWeather(city) {
  fetch("http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=5d5c5e800344c0d09a75889442acf66f&units=metric")
    .then((response) => response.json())
    .then(function (result) {
      isTrueCity = true;
      // input value we empty
      document.getElementsByTagName("input")[0].value = "";

      // Info visiable
      document.getElementById("info").style.display = "block";

      //Favorite section hide
      document.getElementById("favoriteAttraction").style.display = "none";

      // Takes the name of this day
      let date = new Date();
      let option = { weekday: "long" };
      let newDate = new Intl.DateTimeFormat("en-US", option).format(date);
      
      // Creat Element and add to DOM
      let weatherInfo = document.getElementById("weather_info");
      let infoDate = document.createElement("h3");
      let infoTemp = document.createElement("h3");
      let infoCondition = document.createElement("h3");
      let infoImg = document.createElement("img");
      let cityName = document.getElementById("cityName");

      cityName.textContent = result.name;
      infoImg.setAttribute("src", "https://openweathermap.org/img/wn/" + result.weather[0].icon + "@2x.png");

      // Weather icon in temp
      infoDate.textContent = newDate; // Day in week
      infoTemp.textContent = "Temperature: " + result.main.temp + "\u2103"; // Temperature in Celsius
      infoCondition.textContent = "Condition: " + result.weather[0].description;

      // clean childes
      weatherInfo.innerHTML = " ";

       // append child
      weatherInfo.appendChild(infoDate);
      weatherInfo.appendChild(infoTemp);
      weatherInfo.appendChild(infoCondition);
      weatherInfo.appendChild(infoImg);
    })
    .catch(() => {
      document.getElementById("popup").style.display = "block";
      document.getElementById("backdrop").style.display = "block";
      document.getElementById("info").style.display = "none";
      document.getElementById("input-popup").disabled = true;
      isTrueCity = false;
    });
}
// Top Attractions section
function displayAttractions(city) {
  let responseLength = 0;
  fetch("https://api.foursquare.com/v2/venues/explore?near=" + city + "&client_id=CK2STORWRLE22ONGCMZ3PHAKMABVS0324RURA0KNT3M5JAAF&client_secret=WS00YPBBKPAQJLHBNO1YRYBCERTN3EB2MPFYQ5TI2C3GEJWH&v=20210924")
  .then((response) => response.json())
  .then(function (result) {
    let attractionDivs = document.getElementsByClassName("attr_info");
    let res = result.response.groups[0].items;
    responseLength = res.length;

    for (let i = 0; i < attractionDivs.length; i++) {
      let currentDiv = attractionDivs[i];
      currentDiv.innerHTML = "";

      // Creat h3 img addres elements and add info from Api and append in DOM
      let header = document.createElement("h3");
      header.innerHTML = `${ res[i].venue.name}`;
      header.setAttribute("class", "headerOfAttr");
      currentDiv.appendChild(header);

      let img = document.createElement("img");
      img.setAttribute("src", res[i].venue.categories[0].icon.prefix + "bg_64" + res[i].venue.categories[0].icon.suffix);
      img.setAttribute("class", "imgAttr");
      currentDiv.appendChild(img);

      let addr = document.createElement("address");
      addr.innerHTML = `
        <span class = 'addrText'>Address:</span> <br>
        ${res[i].venue.location.address}<br>
        ${res[i].venue.location.city}<br>
        ${res[i].venue.location.country}
      `;
        
      addr.setAttribute("class", "addrAttr");
      currentDiv.appendChild(addr);

      //Save attractions in favorite 
      let favIcon = document.createElement('div');
      favIcon.setAttribute('class', 'favIconDiv');
      favIcon.onclick = function () {
        addingToFavorites(city, i, res[i].venue.name, res[i].venue.location.address, res[i].venue.location.country, res[i].venue.categories[0].icon.prefix + "bg_64" + res[i].venue.categories[0].icon.suffix);
      }
      currentDiv.appendChild(favIcon);

      let iconImg = document.createElement('img');
      iconImg.setAttribute('class', 'favIconImage');
      
      if (localStorage.getItem('data')) { 
        let obj = JSON.parse(localStorage.getItem('data'));
        let stateFav = false;

        for (let j = 0; j < obj.favData.length; j++) {
          if (obj.favData[j].city.toLowerCase() === city.toLowerCase() && obj.favData[j].index === i) {
            stateFav = true;
          }
        }

        if (stateFav) {
          iconImg.setAttribute('src', './images/star.png');
        } else {
          iconImg.setAttribute('src', './images/favorites.png');
        }
      } else {
        iconImg.setAttribute('src', './images/favorites.png');
      }
      
      favIcon.appendChild(iconImg);

      let textFav = document.createElement('p');
      textFav.setAttribute('class', 'favIconText');
      textFav.innerText = "Add to favorites";
      favIcon.appendChild(textFav);
      favIcon.appendChild(textFav);
    }
  })
  .catch(() => {
    if (Number.isFinite(responseLength) || (isTrueCity && responseLength === 0)) {
      let attractionDivs = document.getElementsByClassName("attr_info");

      for (let i = responseLength; i < attractionDivs.length; i++) {
        attractionDivs[i].innerHTML = "<p class = 'noAttrText'>No attraction to display</p>";
      }
    } else {
      document.getElementById("popup").style.display = "block";
      document.getElementById("backdrop").style.display = "block";
      document.getElementById("input-popup").disabled = true;
    }
  });
}

// Added Favorite in local storage
function addingToFavorites (city, index, name, locAddress, locCountry, locIcon) { 
  if (localStorage.getItem('data')) {
    let obj = JSON.parse(localStorage.getItem('data'));
    let state = false;
  
    for (let i = 0; i < obj.favData.length; i++) {
      if (obj.favData[i].city.toLowerCase() === city.toLowerCase() && obj.favData[i].index === index) {
        document.getElementsByClassName('favIconImage')[index].setAttribute('src', './images/favorites.png');
        state = true;
      }
      if (state) {
        if (i === obj.favData.length - 1) {
          let a = obj.favData.pop();
        } else {
          let temp = obj.favData[i];
          obj.favData[i] = obj.favData[i + 1];
          obj.favData[i + 1] = temp;
        }
      }
    }
    if (!state) {
      obj.favData.push({
        city: city,
        index: index,
        name: name,
        locAddress: locAddress,
        locCountry: locCountry,
        locIcon: locIcon
      })
      document.getElementsByClassName('favIconImage')[index].setAttribute('src', './images/star.png');
    }
    localStorage.setItem('data', JSON.stringify(obj));
  }else {
    let obj = {
      favData: [
        {
          city: city,
          index: index,
          name: name,
          locAddress: locAddress,
          locCountry: locCountry,
          locIcon: locIcon
        }
      ]
    }
    localStorage.setItem('data', JSON.stringify(obj));
    document.getElementsByClassName('favIconImage')[index].setAttribute('src', './images/star.png');
  }

}

//Take and add in DOM favorite attractions
function takeFavoriteLocal(){

  // Info hide,  favorit section visiable 
  document.getElementById("info").style.display = "none";
  document.getElementById("favoriteAttraction").style.display = "block";

  // clear info 
  let favoriteDiv = document.getElementById("favorite");
  favoriteDiv.innerHTML= " ";
  
  //Take from local storage info
  let localobj = JSON.parse(localStorage.getItem('data')).favData;
  let favEmpty = document.getElementById("favPage");
  if (localobj == "") {
    favEmpty.textContent = "you do not have a favorite attractions";
  }else{
    favEmpty.textContent = "favorite attractions";
  }
  for (let i = 0; i < localobj.length; i++) {
    
    let favDiv = document.createElement('div');
    favDiv.setAttribute("class", "favDiv");

    //Create h2 h3 and img tags and add info from local storage
    let favCityName = document.createElement("h2");
    favCityName.textContent = localobj[i].city;
    
    let faveAttrName = document.createElement("h3");
    faveAttrName.innerHTML = localobj[i].name;
    faveAttrName.setAttribute("class", "headerOfAttr");

    let favImg = document.createElement("img");
    favImg.setAttribute("src", localobj[i].locIcon);
    favImg.setAttribute("class", "imgAttr");

    //Create Element and add info in DOM
    let locAddr = document.createElement("address");
      locAddr.innerHTML = `
        <span class = 'addrText'>Address:</span> <br>
        ${localobj[i].locAddress}<br>
        ${localobj[i].city}<br>
        ${localobj[i].locCountry}
      `;
      locAddr.setAttribute("class", "addrAttr");

    //Icon element creat
    let favIconimg = document.createElement('img');
    favIconimg.setAttribute('src', './images/star.png');
    favIconimg.setAttribute('class', 'favImgIcon');

    //Append child 
    favDiv.appendChild(favIconimg);
    favDiv.appendChild(favCityName);
    favDiv.appendChild(faveAttrName);
    favDiv.appendChild(favImg);
    favDiv.appendChild(locAddr);
    favoriteDiv.appendChild(favDiv);
  }

  //Delete favorite Attraction in Favorite page
  let favChangeIcon = document.getElementsByClassName('favImgIcon');
  for (let j = 0; j < localobj.length; j++) {
    favChangeIcon[j].onclick = function () {
      for (let z = 0; z < localobj.length; z++) {
        if (localobj[z].name === localobj[j].name) {
          localobj.splice(z, 1);
          let dataFavorites = {
            favData: localobj
          }
          localStorage.setItem('data', JSON.stringify(dataFavorites));
          takeFavoriteLocal();
        }
      }
    }
  }
}

// Keyword ENTER submit 
document.addEventListener("keydown", function (event) {
  if (document.getElementById("popup").style.display == "block") {
    if (event.key == "Enter") {
      document.getElementById("popup").style.display = "none";
      document.getElementById("backdrop").style.display = "none";
      document.getElementById("input-popup").disabled = false;
      event.preventDefault();
    }
  }else if (event.key == "Enter") {
    let city = document.getElementsByTagName("input")[0].value;
    displayWeather(city);
    displayAttractions(city);
    event.preventDefault();
  }
})

//Click submit 
document.getElementsByTagName("button")[0].onclick = function () {
  let city = document.getElementsByTagName("input")[0].value;
  displayWeather(city);
  displayAttractions(city);
};

//Click favorite
document.getElementById("favIconDiv").onclick = function () {
  takeFavoriteLocal(); 
}

//Logo click and clear page 
document.getElementById('logo').onclick = function () {
  document.getElementById('info').style.display = 'none';
  document.getElementById('favoriteAttraction').style.display = 'none';
}

//Close popup message box
document.querySelector(".popup-button").addEventListener("click", function() {
  document.getElementById("popup").style.display = "none";
  document.getElementById("backdrop").style.display = "none";
  document.getElementById("input-popup").disabled = false;

}) 