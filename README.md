# skillshelf

Полиця з власними скілами для Claude Code, які ми збираємо з різних проєктів.

Репозиторій працює як маркетплейс плагінів Claude Code. Усередині один плагін `skillshelf`, а скіли лежать у `plugins/skillshelf/skills/`.

## Скіли

| Скіл | Для чого |
|---|---|
| [`ux-journey-review`](plugins/skillshelf/skills/ux-journey-review/SKILL.md) | Пройти шлях користувача в живому застосунку і знайти, де продукт ускладнює людям життя: зайві кроки, рішення без вибору, незворотні дії без підтвердження, плутані статуси й терміни. |
| [`role-user-guide`](plugins/skillshelf/skills/role-user-guide/SKILL.md) | Написати детальну інструкцію для користувачів окремо для кожної ролі: пройти кожен сценарій у робочій копії, скріншот під кожним кроком із червоною рамкою на потрібній кнопці, таблиця типових ситуацій, перевірка тверджень за кодом. |
| [`manual-tester`](plugins/skillshelf/skills/manual-tester/SKILL.md) | Пройтися по застосунку як мануальний тестувальник: план тестів за ролями, прогін у локальній копії (неправильні дані, права доступу, статуси, подвійні кліки, дві вкладки, телефон, файли, листи) і звіт про відтворювані баги. |

## Встановлення

Репозиторій приватний, тому git на комп'ютері має мати доступ до GitHub. Найпростіше так:

```bash
gh auth login
gh auth setup-git
```

Потім у Claude Code:

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

Кожен скіл перевіряє [Snyk Agent Scan](https://github.com/snyk/agent-scan): приховані інструкції для агента, шкідливий код, секрети, підозрілі завантаження тощо. Вміст скіла відправляється в Snyk на аналіз, секрети перед цим вирізаються.

**Автоматично в GitHub.** Workflow `Snyk skill scan` запускається на кожен пуш і pull request, що змінює `plugins/`. Йому потрібен секрет репозиторію `SNYK_TOKEN` (API-токен із https://app.snyk.io/account). Додати його можна так, команда сама попросить вставити токен:

```bash
gh secret set SNYK_TOKEN --repo Homka13/skillshelf
```

**Локально, зокрема для чужого скіла перед встановленням.** Потрібен `uv` (`brew install uv`) і той самий токен у змінній `SNYK_TOKEN` або в Keychain:

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
5. Проскануйте скіл: `scripts/scan-skill.sh plugins/skillshelf/skills/<назва-скіла>`
