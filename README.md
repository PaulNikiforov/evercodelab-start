# evercodelab-start

Отборочное задание для карьерной программы. Введение в разработку на Node.js.

## Структура проекта

```
src/
├── config/
│   └── config.js          — конфигурация приложения (appName, env)
├── errors/
│   ├── AppError.js         — базовый класс ошибки (statusCode, timestamp, context)
│   ├── ValidationError.js  — ошибка валидации аргументов (400)
│   └── TaskExecutionError.js — ошибка выполнения задачи (500)
├── logger/
│   └── logger.js           — логирование с уровнями error/warn/info/debug/trace и requestId
├── scheduler/
│   └── scheduler.js        — планировщик периодических задач
└── utils/
    └── validateTaskParams.js — валидация аргументов функции scheduleTask

__tests__/
└── app.test.js             — автотесты (Jest)
```

## Задания

### Git

- Репозиторий создан на GitHub.
- Проект инициализирован коммитом.
- Каждый логический блок изменений оформлен отдельным атомарным коммитом с понятным сообщением.

### NPM

- Проект проинициализирован через `npm init`.
- Jest установлен как devDependency.

### Модули

1. **config.js** — хранит `appName` и настройки проекта (среда выполнения, флаг разработки).
2. **logger.js** — фабрика `createLogger({ requestId })`, возвращает логгер с методами `error`, `warn`, `info`, `debug`, `trace`. Формат: `[время] [УРОВЕНЬ] [appName] [requestId] сообщение`.
3. **errors/** — кастомные классы ошибок, наследующие от `Error` через базовый `AppError`.
4. **validateTaskParams.js** — вынесенная из scheduler валидация аргументов функции `scheduleTask`.

### Event Loop

1. **scheduler.js** — содержит:
   - Инициализирующий скрипт, который синхронно логирует факт запуска.
   - Функцию `scheduleTask(name, interval, task)` для управления периодическими задачами. Валидация аргументов вынесена в отдельный модуль (SoC).
2. Зарегистрирована задача `heartbeat` — каждые 10 секунд логирует слово `running`.

## Установка и запуск

```bash
npm install
node src/scheduler/scheduler.js
```

## Тесты

```bash
npm test
```

## Автор

**Paul Nikiforov**

## Лицензия

GPL-3.0-or-later
