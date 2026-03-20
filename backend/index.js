const express = require('express');
const cors = require('cors');
const app = express();
const port = 3344;
const bodyParser = require('body-parser');
const router = require('./routes/index');
const sequelize = require('./config/database');
const models = require('./models/index');
const cookieParser = require('cookie-parser');

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = ['http://localhost:5173'];
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); 
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(cookieParser());

app.use('/api', router);

app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON:', err.message);
        console.error('Request body:', req.body);
        return res.status(400).json({
            error: 'Invalid JSON',
            message: err.message,
            details: 'Please check your request body for syntax errors (trailing commas, unquoted keys, etc.)'
        });
    }
    next(err);
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        await sequelize.sync({ force: false });
        console.log('Database synchronized successfully.');

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();