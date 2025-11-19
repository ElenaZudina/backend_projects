# Tour Shop

Simple MyShop application for managing tours. Built with Express, Sequelize, MySQL, supports sessions, authentication, CRUD operations, and provides a REST API.

## Зависимости

- **bcryptjs**: 2.4.3 - библиотека для хэширования паролей (используется для безопасного хранения паролей пользователей)
- **dotenv**: 16.4.5 - позволяет хранить конфиденциальные настройки и переменные окружения в файле `.env`
- **ejs**: 3.1.10 - шаблонизатор для генерации HTML на сервере с динамическими данными
- **express**: 4.21.1 - фреймворк для создания веб-сервера и API
- **express-session**: 1.18.1 - middleware для работы с сессиями пользователей (например, для авторизации)
- **mysql2**: 3.11.3 - драйвер для подключения к базе данных MySQL
- **sequelize**: 6.37.3 - ORM для удобной работы с базой данных через JavaScript
- **swagger-ui-express**: 5.0.1 - интеграция Swagger UI для автоматической генерации документации API

## Установка зависимостей

```bash
npm install
```
## Настройка окружения

Создайте файл .env в корне проекта
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=MyTour
SESSION_SECRET=change_me
PORT=3000
ADMIN_DEFAULT_PASSWORD=123
USER_DEFAULT_PASSWORD=123
```
## Запуск приложения

```bash
npm start
```
Приложение будет доступно по адресу: [http://localhost:3000](http://localhost:3000)

## Демо пользователи

- **Администратор**
  - Email: admin@myshop.local
  - Password: 123
- **Пользователь**
  - Email: user@myshop.local
  - Password: 321

## Функционал

- Админская панель
- Просмотр экскурсий
- Добавление, редактирование и удаление экскурсий (только админ)
- Начальные демо-данные создаются автоматически, если их нет в базе
- База данных создается автоматически

## Документация API

Документация доступна через Swagger UI: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
