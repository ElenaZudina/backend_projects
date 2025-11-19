// Инициализация Sequelize, определение моделей и начальное заполнение БД

const bcrypt = require('bcryptjs');
const { createSequelize } = require('../config/database');

const defineUser = require('./User');
const defineProduct = require('./Product');

let sequelize;
let User;
let Product;

async function initDb() {
    // Создаем инстанс Sequelize и модели
    sequelize = await createSequelize();

    User = defineUser(sequelize);
    Product = defineProduct(sequelize);

    // Синхронизируем модели (создаем таблицы при отсутствии)
    await sequelize.sync();

    // Начальные данные: 2 пользователя при отсутствии
    const userCount = await User.count();
    if (userCount === 0) {
        // Шифруем пароли
        const adminPass = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD, 10);
        const userPass = await bcrypt.hash(process.env.USER_DEFAULT_PASSWORD, 10);

        await User.bulkCreate([
            { name: 'Administrator', email: 'admin@myshop.local', password: adminPass, rule: 'admin'},
            { name: 'Customer', email: 'user@myshop.local', password: userPass, rule: 'user' } 
        ]);
    }

    // Начальные товары: добавим 6б если их меньше 6
    const productsCount = await Product.count();
    if (productsCount < 6) {
        const needed = 6 - productsCount;
        const baseDesc = 'Sample tour description for demo purpose.';
        const pic = '/img/pic.jpg';
        const existing = await Product.findAll({ attributes: ['name'] });
        const existingNames = new Set(existing.map((p) => p.name));

        const items = [];
        for (let i = 1; i <= 6; i++) {
            const name = `Demo Tour ${i}`;
            if (!existingNames.has(name)) {
                items.push({ name, desc: baseDesc, time: i * 60, price: (i * 10).toFixed(2), pic });
            }
        }
        if (items.length) {
            await Product.bulkCreate(items);
        }
    }
    return sequelize;
}

function getModels() {
    if (!sequelize) throw new Error('DB not initialized yet');
    return { sequelize, User, Product };
}

module.exports =  { initDb, getModels };
