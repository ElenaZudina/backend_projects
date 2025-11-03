// Импортируем необходимые данные из Sequelize
const { DataTypes } = require('sequelize');
// Импортируем экземпляр Sequelize из файла конфигурации
const sequelize = require('../config/database');

// Определяем модель 'Cheese'
const Cheese = sequelize.define('Cheese', {
    // Поле id будет создано автоматически как первичный ключ

    // Название сыра
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    // Категория сыра
    category: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    // Описание сыра
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    // Цена сыра
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    // Путь к изображению
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Экспортируем модель Cheese
module.exports = Cheese;
