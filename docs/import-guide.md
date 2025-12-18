# Руководство по импорту калькуляторов из calc1

## Быстрый старт

### Импорт всех категорий
```bash
npm run import:calc1 <path-to-calc1>
```

### Импорт конкретной категории
```bash
npm run import:calc1 <path-to-calc1> --category math
npm run import:calc1 <path-to-calc1> --category finance
npm run import:calc1 <path-to-calc1> --category geometry
npm run import:calc1 <path-to-calc1> --category everyday
npm run import:calc1 <path-to-calc1> --category engineering
npm run import:calc1 <path-to-calc1> --category business
```

### Тестовый режим (dry-run)
```bash
npm run import:calc1 <path-to-calc1> --dry-run
npm run import:calc1 <path-to-calc1> --category math --dry-run
```

## Процесс импорта

Скрипт автоматически:

1. **Обнаруживает формат** калькуляторов в calc1 (TypeScript, JSON, Markdown)
2. **Определяет категории** из структуры директорий
3. **Импортирует по категориям** с проверкой после каждой
4. **Нормализует схемы** (имена, единицы измерения)
5. **Создает файлы**:
   - `data/calculators/<slug>.json` (структура)
   - `locales/en/calculators/items/<slug>.json` (контент)
6. **Запускает валидацию** после каждой категории

## Рекомендуемый порядок импорта

Импортируйте по одной категории и проверяйте результат:

```bash
# 1. Математика
npm run import:calc1 <path> --category math
# Проверьте результат, исправьте ошибки

# 2. Финансы
npm run import:calc1 <path> --category finance
# Проверьте результат

# 3. Геометрия
npm run import:calc1 <path> --category geometry
# И так далее...
```

## Что проверять после каждой категории

1. **Валидация прошла**: `✅ All validations passed!`
2. **Количество импортированных**: должно соответствовать ожиданиям
3. **Ошибки**: проверьте список ошибок, если есть
4. **Файлы созданы**: проверьте `data/calculators/` и `locales/en/calculators/items/`
5. **Категория правильная**: проверьте, что калькуляторы в правильной категории

## Маппинг категорий

Старые категории из calc1 автоматически маппятся на новые:

- `mathematics` → `math`
- `financial` → `finance`
- `geometric` → `geometry`
- `daily`, `utility` → `everyday`
- `engineer` → `engineering`
- `commercial` → `business`

См. `lib/navigation/categories.ts` для полного списка маппинга.

## Устранение проблем

### Ошибка "Path does not exist"
Убедитесь, что путь к calc1 правильный и доступен.

### Ошибка "Could not detect calculator format"
Проверьте структуру calc1. Скрипт ищет калькуляторы в:
- `src/calculators/`
- `calculators/`
- `data/calculators/`
- `app/calculators/`

### Ошибки валидации
Проверьте созданные файлы:
- Структура должна быть валидной JSON
- Контент должен соответствовать формату items

### Калькуляторы не импортируются
- Проверьте формат файлов (должны быть .ts, .json или .md)
- Проверьте структуру данных в файлах
- Используйте `--dry-run` для диагностики



