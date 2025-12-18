# Статус импорта калькуляторов из calc1

## Категории calc1.ru

| Категория calc1 | Маппинг | Количество | Статус |
|----------------|---------|------------|--------|
| finance | finance | 8 | ⏳ Ожидает |
| math | math | 9 | ⏳ Ожидает |
| life | everyday | 8 | ⏳ Ожидает |
| construction | engineering | 8 | ⏳ Ожидает |
| auto | everyday | 8 | ⏳ Ожидает |
| time | everyday | 8 | ⏳ Ожидает |
| health | everyday | 8 | ⏳ Ожидает |
| science | math | 8 | ⏳ Ожидает |
| converter | everyday | 8 | ⏳ Ожидает |
| fun | everyday | 8 | ⏳ Ожидает |
| it | engineering | 6 | ⏳ Ожидает |

**Всего: ~87 калькуляторов**

## Порядок импорта

Рекомендуемый порядок (по приоритету):

1. ✅ **math** - Математические калькуляторы (9 шт)
2. ⏳ **finance** - Финансовые калькуляторы (8 шт)
3. ⏳ **geometry** - Геометрические (если есть отдельно)
4. ⏳ **everyday** - Повседневные (life, auto, time, health, converter, fun)
5. ⏳ **engineering** - Инженерия (construction, it)

## Команды для импорта

```bash
# 1. Математика
npm run import:calc1 <path-to-calc1> --category math

# 2. Финансы
npm run import:calc1 <path-to-calc1> --category finance

# 3. Повседневные (life)
npm run import:calc1 <path-to-calc1> --category everyday

# 4. Инженерия (construction)
npm run import:calc1 <path-to-calc1> --category engineering
```

## Проверка после импорта

После каждой категории проверяйте:

1. ✅ Валидация прошла: `npm run i18n:validate`
2. ✅ Файлы созданы в `data/calculators/`
3. ✅ Контент создан в `locales/en/calculators/items/`
4. ✅ Количество соответствует ожиданиям
5. ✅ Нет критических ошибок



