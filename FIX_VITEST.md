# Исправление ошибки Vitest

## Проблема
Ошибка `ERR_REQUIRE_ESM` при запуске тестов из-за конфликта `@vitejs/plugin-react` с ESM модулями.

## Решение

1. **Удалите пакет из node_modules** (если он там остался):
   ```powershell
   Remove-Item -Recurse -Force node_modules\@vitejs\plugin-react -ErrorAction SilentlyContinue
   ```

2. **Переустановите зависимости**:
   ```powershell
   npm install
   ```

3. **Проверьте, что пакет удален из package.json**:
   - `@vitejs/plugin-react` не должен быть в `devDependencies`

4. **Запустите тесты**:
   ```powershell
   npm test
   ```

## Что было исправлено

- ✅ Удален `@vitejs/plugin-react` из `vitest.config.ts`
- ✅ Удален `@vitejs/plugin-react` из `package.json`
- ✅ Настроен `esbuild` для автоматической обработки JSX
- ✅ Добавлена поддержка JSX через встроенные возможности Vitest

## Альтернативное решение

Если проблема сохраняется, можно использовать `jsdom` вместо `happy-dom`:

```typescript
// vitest.config.ts
test: {
  environment: 'jsdom', // вместо 'happy-dom'
}
```

И установить:
```powershell
npm install -D jsdom
```



