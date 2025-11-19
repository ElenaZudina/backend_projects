# Tour Shop

Simple MyShop application for managing tours. Built with Express, Sequelize, MySQL, supports sessions, authentication, CRUD operations, and provides a REST API.
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

