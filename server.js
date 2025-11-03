// --- Импорт --- //
// Импортируем express - фреймворк для создания веб-сервера
const express = require('express');
// Импортируем middleware для обработки GraphQL запросов
const { graphqlHTTP } = require('express-graphql');
// Импортируем нашу GraphQL схему
const schema = require('./graphql/schema');
// Импортируем экземпляр Sequelize для работы с БД
const sequelize = require('./config/database');
// Импортируем модуль path для работы с путями к файлам
const path = require('path');

// --- Настройка приложения --- //
// Создаем экземпляр приложения express
const app = express();

// --- Middleware (промежуточное ПО) --- //
// Middleware для обработки JSON тел запросов
app.use(express.json());
// Middleware для обработки URL-encoded тел запросов
app.use(express.urlencoded({ extended: true }));
// Middleware для раздачи статических файлов из папки 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- GraphQL Endpoint --- //
// Настраиваем конечную точку /graphql
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema, // передаем нашу схему
    graphiql: true, // Включаем GraphiQL для удобного тестирования GraphQL запросов
  })
);

// --- Маршруты --- //
// Основной маршрут, который отдает главную HTML страницу
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// --- Запуск сервера --- //
// Определяем порт, на котором будет работать сервер
const PORT = process.env.PORT || 3000;

// Синхронизируем модели с БД и запускаем сервер
sequelize
  .sync()
  .then(() => {
    console.log('База данных подключена и синхронизирована');
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}. Откройте http://localhost:${PORT}`);
      console.log(`GraphQL доступен по адресу http://localhost:${PORT}/graphql`);
    });
  })
  .catch((err) => {
    console.error('Ошибка подключения к БД:', err);
  });
