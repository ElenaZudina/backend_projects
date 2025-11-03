// Этот скрипт предназначен для первоначального заполнения базы данных тестовыми данными

// Импортируем модель Cheese и экземпляр sequelize
const Cheese = require('./models/cheese');
const sequelize = require('./config/database');

// Определяем массив с данными для сыра
const sampleCheeses = [
    {
        name: 'Brie',
        description: 'Soft and creamy French cheese with a delicate flavor. Perfect for cheese boards.',
        price: 12.99,
        image: '/img/brie.jpg',
        category: 'Soft Cheese'
    },
    {
        name: 'Cheddar',
        description: 'Classic English cheese with a rich, sharp taste. Ideal for sandwiches and cooking.',
        price: 9.50,
        image: '/img/cheddar.jpg',
        category: 'Hard Cheese'
    },
    {
        name: 'Mozzarella',
        description: 'Fresh Italian cheese, soft and mild. Perfect for pizzas and salads.',
        price: 10.99,
        image: '/img/mozzarella.jpg',
        category: 'Soft Cheese'
    },
    {
        name: 'Gouda',
        description: 'Dutch cheese with a smooth, slightly sweet flavor. Great for snacking or melting.',
        price: 11.50,
        image: '/img/gouda.jpg',
        category: 'Semi-Hard Cheese'
    },
    {
        name: 'Parmesan',
        description: 'Aged Italian cheese with a strong, nutty taste. Perfect for grating over pasta.',
        price: 15.00,
        image: '/img/parmesan.jpg',
        category: 'Hard Cheese'
    },
    {
        name: 'Roquefort',
        description: 'Blue French cheese with a strong, tangy flavor. Best enjoyed with fruits or wine.',
        price: 18.00,
        image: '/img/roquefort.jpg',
        category: 'Blue Cheese'
    }
];

// Функция для синхронизации базы данных и заполнения данными
const setupDatabase = async () => {
    try {
        // Синхронизируем все модели с БД
        // { force: true } удалит существующие таблицы и создаст их заново
        // Это полезно для сброса данных во время разработки
        await sequelize.sync({ force: true });
        console.log('База данных и таблицы успешно созданы!');

        // Массово добавляем все сыры из нашего массива в таблицу Cheese
        await Cheese.bulkCreate(sampleCheeses);
        console.log('Тестовые данные успешно загружены!');

    } catch (error) {
        console.error('Ошибка при настройке базы данных:', error);
    } finally {
        // Закрываем соединение с БД после завершения работы
        await sequelize.close();
        console.log('Соединение с базой данных закрыто');
    }
};

// Вызываем функцию для выполнения настройки
setupDatabase();
