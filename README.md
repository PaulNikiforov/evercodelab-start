# evercodelab-start

Отборочное задание для карьерной программы. Введение в разработку на Node.js.

## Структура проекта

```
src/
├── app.js                  — Express-приложение (маршруты, middleware)
├── server.js               — Точка входа HTTP-сервера
├── config/
│   └── config.js           — Конфигурация (appName, env)
├── errors/
│   ├── AppError.js         — Базовый класс ошибки (statusCode, timestamp)
│   ├── ValidationError.js  — Ошибка валидации (400)
│   └── TaskExecutionError.js — Ошибка выполнения задачи (500)
├── logger/
│   └── logger.js           — createLogger({ requestId }), уровни error/warn/info/debug/trace
├── middleware/
│   └── auth.js             — Bearer-токен авторизация (401/403)
├── routes/
│   ├── currencies.js       — CRUD API для валют
│   └── price.js            — Курсы из Binance API
├── services/
│   └── priceService.js     — Запросы к Binance + фильтрация
├── store/
│   └── currencyStore.js    — In-memory хранилище валют
├── scheduler/
│   └── scheduler.js        — Планировщик периодических задач
├── utils/
│   ├── validateTaskParams.js — Валидация аргументов scheduleTask
│   └── fetchWithRetry.js   — Retry с экспоненциальной задержкой
├── validators/
│   └── binanceValidator.js — Валидация ответа Binance API
docs/
└── openapi.yaml            — OpenAPI 3.0 спецификация
__tests__/                  — Все тесты (Jest + supertest)
```

## Задания

### Модуль 1 — Основы Node.js

- **config.js** — `appName`, среда выполнения, флаг разработки.
- **logger.js** — фабрика `createLogger({ requestId })`, формат: `[время] [УРОВЕНЬ] [appName] [requestId] сообщение`.
- **errors/** — иерархия: `AppError` → `ValidationError` (400), `TaskExecutionError` (500).
- **validateTaskParams.js** — валидация аргументов, вынесена из scheduler (SoC).
- **scheduler.js** — функция `scheduleTask(name, interval, task)`, задача `heartbeat` каждые 10с.

### Модуль 2, Задача 1 — HTTP-сервер на Express

- Express-сервер с роутом `GET /status` → `"ok"` (health check).
- Разделение `app.js` (маршруты) / `server.js` (запуск) для тестирования.
- Тест через supertest: `request(app).get('/status')`.

### Модуль 2, Задача 2 — Авторизация

- Middleware `auth.js` проверяет заголовок `Authorization: Bearer <token>`.
- Нет заголовка → 401 Unauthorized, неверный токен → 403 Forbidden.
- Токен хранится в `.env` (`AUTH_TOKEN`), загружается через `dotenv`.
- `/status` остаётся публичным (объявлен до middleware).

### Модуль 2, Задача 3 — CRUD API + OpenAPI

- CRUD endpoints для сущности `currency` (поля: `id`, `name`, `ticker`).
- Хранение в памяти (`currencyStore.js`), при перезапуске данные удаляются.
- Валидация: `name` и `ticker` обязательны (400), `id` проверяется на число (400).
- Express Router — маршруты вынесены в `routes/currencies.js`.
- OpenAPI 3.0 спецификация в `docs/openapi.yaml` — все endpoints, модели, security.

| Метод | Путь | Описание | Статус |
|-------|------|----------|--------|
| GET | `/currencies` | Список валют | 200 |
| GET | `/currencies/:id` | Получить по id | 200 / 400 / 404 |
| POST | `/currencies` | Создать | 201 / 400 |
| PUT | `/currencies/:id` | Обновить | 200 / 400 / 404 |
| DELETE | `/currencies/:id` | Удалить | 204 / 400 / 404 |

### Модуль 2, Задача 4 — Внешние API + валидация + retry

- Эндпоинт `GET /price?currency=BTC` — проверяет ticker в хранилище, идёт в Binance API.
- `fetchWithRetry.js` — retry с экспоненциальной задержкой (1с → 2с → ... → 64с макс), таймаут 5с через AbortController.
- `binanceValidator.js` — валидация ответа Binance (массив, `symbol`/`price` — строки).
- Ошибки Binance → 502 Bad Gateway, логируются через проектный `createLogger()`.
- Тесты с partial mock: `fetchPrices` замокан, `filterByCurrency` — реальная.

## Установка и запуск

```bash
npm install
npm start                    # HTTP-сервер на порту 3000
node src/scheduler/scheduler.js  # Планировщик задач
```

## Тесты

```bash
npm test                     # Все тесты
npx jest -t "pattern"        # Один тест по имени
```

## Переменные окружения

| Переменная | Описание | Где |
|------------|----------|-----|
| `AUTH_TOKEN` | Bearer-токен для авторизации (64-значный хэш) | `.env` |
| `PORT` | Порт HTTP-сервера (по умолчанию 3000) | env |
| `NODE_ENV` | Среда выполнения (development/production) | env |

## Автор

**Paul Nikiforov**

## Лицензия

GPL-3.0-or-later
