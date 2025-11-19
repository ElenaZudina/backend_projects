require('dotenv').config();
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS ? '***' : '(пустой)');
console.log('DB_NAME:', process.env.DB_NAME);


const path = require('path');
const express = require('express');
const session = require('express-session');

const { initDb } = require('./models');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

// Настройка движка шаблонов и статики
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Встроенные парсеры JSON и URL-форм
app.use(express.urlencoded( { extended: true }));
app.use(express.json());

// настройка сессий
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'dev_secret',
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true }
    })
);

// Прокидываем текущего пользователя в шаблоны
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user || null;
    next();
});

// Маршруты
app.use('/', webRoutes);
app.use('/api', apiRoutes);
// Swagger UI по адресу /api-docs и сам JSON по /swagger.json
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        explorer: true,
        swaggerOptions: {
            persistAuthorization: true,
            requestInterceptor: function(req) {
                // Включаем куки сессии для вызова из Swagger UI
                req.credentials = 'include';
                return req;
            }
        },
        customSiteTitle: 'MyTOUR API Docs'
    }) 
);
app.get('/swagger.json', (req, res) => res.json(swaggerDocument));

// Инициализация БД и запуск сервера
const port = process.env.PORT || 3000;

// initDb создает БД таблицы и тестовые данные
initDb()
    .then(() => {
        // Запуск сервера - пользователь запустит его сам через npm start
        app.listen(port, () => {
            console.log(`MyTour listening on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Failed to init DB:', err);
    });