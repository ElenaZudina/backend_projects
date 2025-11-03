// Импортируем Sequelize
const { Sequelize } = require('sequelize');

// Создаем новый экземпляр Sequelize для подключения к базе данных
// ВАЖНО: Замените 'toy_store', 'root и '' на имя вашей базы данных
// имя пользователя и пароль для MySQL
const sequelize = new Sequelize('cheese_store', 'root', '', {
    host: 'localhost', // Хост, на котором запущен ваш сервер MySQL (обычно 'localhost)
    dialect: 'mysql' // Указываем, что мы используем MySQL
});

// Экспортируем созданный экземпляр squelize, чтобы использовать его в других частях приложения
module.exports = sequelize;