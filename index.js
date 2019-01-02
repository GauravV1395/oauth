const express = require('express');
const app = express ();
const { mongoose } = require('./config/db');
const { routes } = require('./config/routes');
const port = 3001;
const cors = require('cors');

app.use(cors());

app.use(express.json());

app.set('view engine', 'ejs');

// create home route
app.get('/', (req, res) => {
    res.render('home');
});

app.use('/', routes);

app.listen(port, () => {
    console.log('listening to port', port);
});

