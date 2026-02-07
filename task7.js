const cityInput = document.getElementById("cityInput");
const getWeatherBtn = document.getElementById("getWeatherBtn");
const resultDiv = document.getElementById("result");
const API_KEY = "e88a8b49ea1acf43fa3361e94b9c4979";
getWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) {
        resultDiv.innerText = "Please enter a city name.";
        return;
    }
    fetchWeather(city);
});
async function fetchWeather(city) {
    resultDiv.innerText = "Loading...";
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        if (!response.ok) {
            const err = data;
            resultDiv.innerText = "Error: " + err.message;
            return;
        }
        displayWeather(data);
    }
    catch (_a) {
        resultDiv.innerText = "Network error. Please try again later.";
    }
}
function displayWeather(data) {
    var _a, _b;
    const { temp, humidity } = data.main;
    const description = (_b = (_a = data.weather[0]) === null || _a === void 0 ? void 0 : _a.description) !== null && _b !== void 0 ? _b : "No description available";
    resultDiv.innerHTML = `
        <h3>${data.name}</h3>
        <p>Temperature: ${temp} °C</p>
        <p>Humidity: ${humidity} %</p>
        <p>Condition: ${description}</p>

    `;
}
