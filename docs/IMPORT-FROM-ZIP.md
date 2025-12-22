# Импорт из calc1.zip

## Быстрый старт

Если у вас есть архив `calc1.zip`:

```bash
# Импорт всех категорий
npm run import:calc1:zip calc1.zip

# Импорт конкретной категории
npm run import:calc1:zip calc1.zip --category math

# Тестовый режим (без записи файлов)
npm run import:calc1:zip calc1.zip --category math --dry-run

# Оставить распакованные файлы для анализа
npm run import:calc1:zip calc1.zip --keep-extracted
```

## Что делает скрипт

1. ✅ Распаковывает `calc1.zip` во временную директорию
2. ✅ Находит корневую директорию проекта calc1
3. ✅ Анализирует структуру
4. ✅ Запускает импорт калькуляторов
5. ✅ Удаляет временные файлы (если не указан `--keep-extracted`)

## Где разместить архив

Поместите `calc1.zip` в:
- Корень проекта `first-calc/` (рядом с `package.json`)
- Или укажите полный путь: `npm run import:calc1:zip C:\path\to\calc1.zip`

## Примеры

```bash
# Импорт математических калькуляторов
npm run import:calc1:zip calc1.zip --category math

# Импорт финансовых калькуляторов
npm run import:calc1:zip calc1.zip --category finance

# Импорт всех категорий
npm run import:calc1:zip calc1.zip
```

## После импорта

Проверьте результат:
```bash
npm run i18n:validate
```

Должно быть: `✅ All validations passed!`





