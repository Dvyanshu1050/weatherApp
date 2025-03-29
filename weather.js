
        async function getWeather() {
            const city = document.getElementById('city').value.trim();
            const country = document.getElementById('country').value.trim();

            if (!city || !country) {
                alert("Please enter both city and country!");
                return;
            }
            
            const apiKey = '952dbeec8f3d40538e4115239252803';
            const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city},${country}&aqi=yes`;
            
            try {
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.error) {
                    document.getElementById('weather').innerHTML = `<p style="color: red;">${data.error.message}</p>`;
                    return;
                }
                
                document.getElementById('weather').innerHTML = `
                    <h2>${data.location.name}, ${data.location.country} 🌍</h2>
                    <p>🌡️ Temperature: <strong>${data.current.temp_c}°C</strong></p>
                    <p>🌤️ Condition: <strong>${data.current.condition.text}</strong></p>
                    <img src="${data.current.condition.icon}" alt="Weather Icon">
                    <p>💧 Humidity: <strong>${data.current.humidity}%</strong></p>
                    <p>🌬️ Wind Speed: <strong>${data.current.wind_kph} kph</strong></p>
                    <p>🫁 Air Quality Index: <strong>${data.current.air_quality.pm2_5.toFixed(2)}</strong></p>
                `;
            } catch (error) {
                document.getElementById('weather').innerHTML = `<p style="color: red;">Error fetching weather data!</p>`;
            }
        }

        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            document.querySelector('.container').classList.toggle('dark-mode');
            let btn = document.querySelector('.toggle-theme');
            btn.textContent = document.body.classList.contains('dark-mode') ? "☀️" : "🌙";
        }
    