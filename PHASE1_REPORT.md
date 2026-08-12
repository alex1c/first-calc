# Phase 1 — Production / SEO blockers

## Changes made

- Централизованы production origin и locale URL policy в `lib/site-url.ts`: English без `/en`, остальные языки с префиксом.
- Docker Compose по умолчанию использует `https://first-calc.com` и `NEXT_PUBLIC_ENV=production`; staging/test остаются настраиваемыми через environment variables.
- Удалён конфликтующий статический `public/robots.txt`; единственным источником стал `app/robots.ts`.
- Production robots разрешает публичный crawl и закрывает `/admin` и `/api/`. Test/staging по `NEXT_PUBLIC_ENV=test|staging` блокирует весь crawl.
- Sitemap заменён на data-driven генерацию из активного calculator registry, articles, standards и curated public/legacy routes. Disabled/fallback calculators, API/admin, search, numeric permutations и технические URL исключены. Фиктивные `lastModified` не добавляются.
- Добавлены `metadataBase`, self-canonical для основных семейств страниц, content-aware hreflang и `x-default` на английский canonical.
- Calculator fallback pages сохраняют продуктовый English fallback, но получают English canonical, `noindex,follow` и не объявляют отсутствующий перевод в hreflang.
- Аналогичная безопасная SEO-политика применена к локализованным articles/standards и national standards с ограниченным набором реальных языков.
- `<html lang>` получает locale из middleware request header без клиентской DOM-подмены.
- Language switcher сохраняет логический путь и никогда не создаёт конечный `/en/...`; добавлен accessible label.
- Header/Footer internal links сохраняют locale. Текст Footer намеренно не переводился в Phase 1.
- Inter self-hosted локально (Latin и Cyrillic variable WOFF2); production build больше не обращается к Google Fonts. Для Hindi используется системный Devanagari-capable fallback.
- Исправлены существующие TypeScript test fixtures/imports и подключены Vitest globals без ослабления strict mode.
- Добавлен `npm run typecheck`; CI больше не игнорирует lint и выполняет typecheck до tests/build.
- Бесконечные dynamic legacy страницы factors/number-format получили `noindex,follow`; numeric/range URL не попадают в sitemap.

## Files changed

Ниже полный перечень файлов Phase 1 (в рабочем дереве до начала уже были пользовательские изменения; они не откатывались):

- `.github/workflows/ci.yml` — blocking lint и typecheck.
- `docker-compose.yml` — production defaults с env overrides.
- `package.json` — script `typecheck`.
- `tsconfig.json` — типы Node/Vitest для всех проверяемых тестов.
- `middleware.ts` — безопасная передача locale корневому layout.
- `app/layout.tsx` — production metadataBase, env-controlled robots metadata, динамический HTML lang, удаление Google font fetch.
- `app/globals.css` — локальные `@font-face` и font stack.
- `app/robots.ts` — единый environment-aware robots generator.
- `public/robots.txt` — удалён как конфликтующий второй источник.
- `app/sitemap.ts` — production data-driven sitemap.
- `lib/site-url.ts` — единый origin/locale/canonical/hreflang helper.
- `lib/hreflang.ts` — устранён obsolete domain и исправлена English URL policy.
- `lib/i18n/content-availability.ts` — проверка наличия calculator item content без fallback.
- `public/fonts/inter-latin.woff2`, `public/fonts/inter-cyrillic.woff2` — self-hosted Inter.
- `components/header.tsx` — locale-preserving links/switcher и accessible label.
- `components/footer.tsx` — locale-preserving global links.
- `app/[locale]/page.tsx` — centralized canonical/hreflang.
- `app/[locale]/(main)/calculators/page.tsx` — hub canonical/hreflang.
- `app/[locale]/(main)/calculators/[category]/page.tsx` — category canonical/hreflang.
- `app/[locale]/(main)/calculators/[category]/[slug]/page.tsx` — content-aware canonical/hreflang/noindex fallback.
- `app/[locale]/(main)/learn/page.tsx` — hub canonical/hreflang.
- `app/[locale]/(main)/learn/[slug]/page.tsx` — alternates только для реально существующих articles.
- `app/[locale]/(main)/tools/page.tsx` — hub canonical/hreflang.
- `app/[locale]/(main)/standards/page.tsx` — centralized canonical/hreflang.
- `app/[locale]/(main)/standards/[country]/[standardSlug]/page.tsx` — alternates только для реальных standards.
- `app/[locale]/(main)/standards/national/layout.tsx` — noindex для заведомо fallback-only locale branches.
- `app/[locale]/(main)/standards/national/page.tsx` — English-only content policy.
- `app/[locale]/(main)/standards/national/[country]/page.tsx` — content-aware country hub policy.
- `app/[locale]/(main)/standards/national/ru/page.tsx` — EN/RU metadata cluster.
- National detail pages: `aci-concrete`, `asce-loads`, `asce7-hazard-categories`, `ibc-load-path-essentials`, `soil-foundations`, `din-construction`, `ec1-load-concepts`, `ec2-concrete-principles`, `ec7-soil-foundations`, `sp20-load-concepts`, `sp24-soil-foundations`, `sp63-concrete-principles`, `sp-snip-foundations` — безопасные localized metadata clusters.
- Legacy landing pages: `numbers-to-words`, `chislo-propisyu`, `roman-numerals-converter`, `percentage-of-a-number`, `add-subtract-percentage`, `root-calculator` — canonical без `/en` и EN/RU alternates.
- `app/[locale]/(legacy)/factors/[number]/page.tsx`, `app/[locale]/(legacy)/number-format/in/[number]/page.tsx` — noindex для бесконечного URL space и правильный canonical.
- `tests/api/calculator-calculate.test.ts`, `tests/components/calculator-page.test.tsx`, `tests/unit/validate-schema.test.ts` — актуальные typed fixtures/import.
- `PHASE1_REPORT.md` — этот отчёт.

## Robots

Production (`NEXT_PUBLIC_ENV=production` или переменная не задана):

```text
User-Agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://first-calc.com/sitemap.xml
```

Test/staging (`NEXT_PUBLIC_ENV=test` либо `staging`) возвращает `Disallow: /` и root metadata `noindex,nofollow`. Это условная runtime-защита, не production default. Для staging также рекомендуется HTTP authentication и/или reverse-proxy `X-Robots-Tag` как второй уровень защиты.

## Sitemap

Production build сгенерировал **229 уникальных URL** без `/en/` и без `lastModified`.

| Group | URL |
|---|---:|
| pages | 22 |
| categories | 10 |
| calculators | 92 |
| articles | 56 |
| standards | 37 |
| other (curated legacy landings) | 12 |
| **Total** | **229** |

| Locale | URL |
|---|---:|
| en | 192 |
| ru | 28 |
| es | 3 |
| tr | 3 |
| hi | 3 |

Малые числа для es/tr/hi намеренны: sitemap не рекламирует fallback-only calculator/content pages как переведённые. Проверено наличие calculator URL, например `/calculators/compatibility/love-compatibility`.

## Canonical/hreflang

- `metadataBase`: `https://first-calc.com`.
- EN canonical: `https://first-calc.com/<path>`; `/en/<path>` не используется.
- RU/ES/TR/HI canonical: `https://first-calc.com/<locale>/<path>` только для индексируемой локализованной версии.
- Общие локализованные hubs используют взаимный набор supported locales и `x-default` на EN.
- Calculator/article/standard detail pages формируют alternates по фактическому наличию соответствующего content/data entry.
- `x-default` всегда указывает на окончательный English canonical без redirect.

## Localization fallback

UI продолжает открывать requested locale page и может показывать существующий English fallback — продуктовая логика не сломана. Для calculator fallback без locale item JSON metadata теперь:

- не объявляет этот locale в hreflang;
- задаёт `noindex,follow`;
- canonical указывает на English оригинал;
- URL исключён из sitemap.

Таким образом пользователь получает рабочую страницу, но поисковик не получает ложный сигнал о переводе или отдельный индексируемый English duplicate.

## Verification

- `npm run lint` — **PASS**, 13 прежних `react/no-unescaped-entities` warnings; ошибок нет.
- `npm run typecheck` — **PASS**.
- `npm test -- --run` — **PASS**, 9 файлов / 43 теста. Остались прежние React `act(...)` и Vite CJS deprecation warnings.
- `npm run build` — **PASS**, Next.js 14.2.33 production build без сетевого font fetch.
- Built `.next/server/app/sitemap.xml.body` — 229 `<url>`, calculator URLs присутствуют, `first-calc.com/en/` отсутствует.
- Built `.next/server/app/robots.txt.body` — production allow + `/admin`/`/api` disallow + production sitemap URL.
- `git diff --check` не обнаружил новых конфликтных markers/ошибок патча, но возвращает уже существовавшие до Phase 1 предупреждения `new blank line at EOF` во множестве пользовательских файлов; они не исправлялись, чтобы не переписывать чужие изменения.

## Production-safety search results

- `test.first-calc.com` остаётся только в старых staging/SSL/Apache deployment guides и staging Apache config. Это допустимые не-runtime ссылки; Docker/metadata/sitemap/robots их больше не используют.
- `calculator-portal.com` остаётся только в устаревшем примере `docs/hreflang-implementation.md`; runtime fallback удалён. Документ следует обновить отдельно, но он не влияет на production output.
- `localhost` остаётся в Playwright/tests, Docker healthcheck, reverse-proxy examples и validation helper allowance; это корректные dev/internal references.
- `Disallow: /` существует только как условный test/staging return в `app/robots.ts`.
- `noindex` остаётся для test/staging, fallback-only content и бесконечных numeric legacy URL — это намеренно.
- `/en/` остался только в alternates некоторых `noindex` dynamic legacy permutations; они не входят в sitemap и не являются индексируемыми landing pages. Их унификация — низкоприоритетная cleanup-задача.
- Hardcoded `https://first-calc.com` остаётся в старых JSON-LD blocks и production Docker default; значения корректны. Canonical/hreflang/sitemap используют centralized helper.

## Remaining issues

- Массовая локализация и полноценные es/tr/hi content pages оставлены Phase 2.
- Некоторые informational/legal routes имеют старую статическую metadata-схему и не добавлены в non-English sitemap до реальной локализации.
- Dynamic legacy permutations уже noindex, но несколько их неиндексируемых hreflang blocks всё ещё используют `/en/`; это не Critical blocker.
- Существующие 13 lint warnings, React test `act` warnings и outdated Browserslist data не менялись в рамках SEO blockers.
- Production redirect behavior HTTP→HTTPS, www→non-www и old test host→production задаётся внешним Apache/reverse proxy и требует проверки на сервере.
- Security headers, admin authentication, analytics, большой refactor и content work сознательно не входят в Phase 1.

## Deployment notes

Deployment не выполнялся. Перед будущим deployment:

1. Установить `NEXT_PUBLIC_BASE_URL=https://first-calc.com` и `NEXT_PUBLIC_ENV=production` явно в production environment, даже несмотря на безопасные defaults.
2. Пересобрать Docker image, чтобы включить `public/fonts/*.woff2`, новый robots и sitemap.
3. Проверить снаружи `/robots.txt`, `/sitemap.xml`, canonical/hreflang, HTML lang и отсутствие `X-Robots-Tag: noindex`.
4. Проверить single-hop redirects: HTTP→HTTPS, www→non-www, `/en/*`→canonical без `/en`, `test.first-calc.com`→production либо закрытый staging — согласно выбранной инфраструктурной политике.
5. Не копировать старый test Apache config как production virtual host без отдельной адаптации домена/certificates.
