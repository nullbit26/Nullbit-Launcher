# NULLBIT Launcher Changelog

## v3.0.3 - Cyberpunk Edition (2024-05-22)

### Major Features
- **Cyberpunk 2077 Style UI** - Полностью переделан интерфейс в стиле киберпанк
  - Красная тематика с золотыми акцентами
  - Glitch-эффекты и анимации
  - Scanlines и vignette

- **Auto Bot Download** - Автоматическая загрузка AIBot.exe
  - Скачивание с GitHub releases
  - Fallback на Dropbox если файл большой
  - Прогресс-бар со скоростью загрузки (MB/s)
  - Версия бота отображается после установки

- **First Time Setup Modal** - Модальное окно при первом запуске
  - "Hacking" scramble эффект для WELCOME текста
  - Красный логотип NULLBIT
  - Кнопки: Auto Install / Manual Install
  - Плавное закрытие без screen shake

- **Manual Install Helper** - Открытие папки лаунчера при ручной установке

### Improvements
- Исправлена проверка версии лаунчера (semver сравнение)
- Убраны лишние переходные анимации
- Улучшен UI: убраны голубые RGB эффекты, чистый красный стиль
- Добавлено логирование для диагностики

### Technical
- IPC handlers для `bot-exists`, `download-bot`, `open-launcher-dir`
- Auto-updater через `electron-updater`
- NSIS installer с автообновлением

## v3.0.0 - Initial Release
- Базовый лаунчер с конфигурацией
- Запуск/остановка бота
- Обновления через GitHub
