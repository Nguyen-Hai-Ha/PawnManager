const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const router = require('./routes/index');
const sqlite3 = require('./config/database');
const models = require('./models/index');
const cookieParser = require('cookie-parser');
const { startScheduler } = require('./services/mail/SchedulerService');

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const allowedOrigins = ['*'];
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

const path = require('path');

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(cookieParser());

// Serve static images
app.use('/uploads', express.static(path.join(__dirname, 'images')));

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

function startServer() {
    try {
        console.log('--- Database connection established successfully (better-sqlite3) ---');

        app.listen(port, '0.0.0.0', () => {
            console.log(`--- Server is running on http://localhost:${port} (accessible from all interfaces) ---`);
        });
    } catch (error) {
        console.error('Unable to start the server:', error);
    }
}

startServer();
// chạy đúng 1 lần khi mở app
startScheduler();