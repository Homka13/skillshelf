# skillshelf

Скіли для Claude Code, які з'являються в нас по ходу роботи над продуктами.

Ми розробляємо, тестуємо й запускаємо свої сервіси разом з агентом. Коли якийсь підхід спрацював і знадобився вдруге, ми оформлюємо його як скіл: інструкцію, за якою агент зробить ту саму роботу так само ретельно в будь-якому наступному проєкті.

Репозиторій працює як маркетплейс плагінів Claude Code. Усередині один плагін `skillshelf`, а скіли лежать у `plugins/skillshelf/skills/`.

## Скіли

| Скіл | Для чого | Перевірки безпеки |
|---|---|---|
| [`ux-journey-review`](plugins/skillshelf/skills/ux-journey-review/SKILL.md) | Пройти шлях користувача в живому застосунку і знайти, де продукт ускладнює людям життя: зайві кроки, рішення без вибору, незворотні дії без підтвердження, плутані статуси й терміни. | [skills.sh](https://skills.sh/homka13/skillshelf/ux-journey-review) |
| [`role-user-guide`](plugins/skillshelf/skills/role-user-guide/SKILL.md) | Написати детальну інструкцію для користувачів окремо для кожної ролі: пройти кожен сценарій у робочій копії, скріншот під кожним кроком із червоною рамкою на потрібній кнопці, таблиця типових ситуацій, перевірка тверджень за кодом. | [skills.sh](https://skills.sh/homka13/skillshelf/role-user-guide) |
| [`manual-tester`](plugins/skillshelf/skills/manual-tester/SKILL.md) | Пройтися по застосунку як мануальний тестувальник: план тестів за ролями, прогін у локальній копії (неправильні дані, права доступу, статуси, подвійні кліки, дві вкладки, телефон, файли, листи) і звіт про відтворювані баги. | [skills.sh](https://skills.sh/homka13/skillshelf/manual-tester) |

Кожен скіл автоматично перевіряють Gen Agent Trust Hub, Socket і Snyk у каталозі [skills.sh](https://skills.sh/homka13/skillshelf). Актуальний результат завжди на сторінці скіла за посиланням у таблиці.

## Встановлення

**Будь-який агент** (Claude Code, Codex, Cursor, Gemini CLI та інші):

```bash
npx skills add homka13/skillshelf
```

**Claude Code як плагін**, з оновленнями через маркетплейс:

```
/plugin marketplace add Homka13/skillshelf
/plugin install skillshelf@skillshelf
```

Скіли підхоплюються самі, коли запит підходить під їхній опис. Явно викликати можна з префіксом плагіна, наприклад `/skillshelf:ux-journey-review`.

## Оновлення

Після змін у репозиторії:

```
/plugin marketplace update skillshelf
```

Або увімкніть автооновлення: `/plugin` → Marketplaces → skillshelf → Enable auto-update.

## Перевірка безпеки

**Основна перевірка — на skills.sh.** Після кожного оновлення каталог сам проганяє скіли через Gen Agent Trust Hub, Socket і Snyk. Результати є на сторінці кожного скіла за посиланнями в таблиці вище.

**Власний запуск [Snyk Agent Scan](https://github.com/snyk/agent-scan)** шукає приховані інструкції для агента, шкідливий код, секрети, підозрілі завантаження тощо. Вміст скіла відправляється в Snyk на аналіз, секрети перед цим вирізаються. Безкоштовна публічна версія має жорсткий денний ліміт: з нашим токеном вона щоразу відповідає «Daily usage limit reached» (X007). Тому власний запуск лише ручний.

- **У GitHub:** Actions → `Snyk skill scan` → Run workflow. Потрібен секрет репозиторію `SNYK_TOKEN` (токен із https://app.snyk.io/account). Команда сама попросить вставити токен:

```bash
gh secret set SNYK_TOKEN --repo Homka13/skillshelf
```

- **Локально, зокрема для чужого скіла перед встановленням.** Потрібен `uv` (`brew install uv`) і той самий токен у змінній `SNYK_TOKEN` або в Keychain:

```bash
security add-generic-password -a "$USER" -s snyk-token -w
```

```bash
scripts/scan-skill.sh ./plugins/skillshelf/skills
```

```bash
scripts/scan-skill.sh ~/Downloads/some-skill
```

Скрипт завжди вимагає шлях. Без шляху сканер перевіряв би всі налаштування агентів на комп'ютері.

## Як додати новий скіл

1. Створіть папку `plugins/skillshelf/skills/<назва-скіла>/` з файлом `SKILL.md`. У шапці файлу потрібні `name` і `description`. Опис має казати, що скіл робить і коли його вмикати.
2. Довгі довідкові матеріали кладіть у `references/` поруч із `SKILL.md` і посилайтеся на них із тексту, щоб основний файл лишався коротким.
3. Додайте рядок у таблицю вище.
4. Перевірте структуру: `claude plugin validate .`
5. Після пушу перевірте сторінку скіла на skills.sh: результати перевірок з'являються за кілька хвилин.
