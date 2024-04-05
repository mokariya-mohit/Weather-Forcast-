let express = require('express');
let path = require('path');
let port = 3000;
let app = express();

app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    res.render('home');
});

app.get('/weather/:city', async (req, res) => {
    try {
        const city = req.params.city;

        const apiKey = 'c15e7b8cd33d29ea6bf85c0718444a84';
        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === '404') {
            res.status(404).json({ message: 'City not found' });
        } else {
            res.json({
                city: data.name,
                temperature: data.main.temp,
                humidity: data.main.humidity,
                wind_speed: data.wind.speed,
                description: data.weather[0].description
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



app.listen(port, (err) => {
    err ? console.log("listen error") : console.log(`Server listening on ${port}`);
});