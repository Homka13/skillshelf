# skillshelf

Полиця з власними скілами для Claude Code, які ми збираємо з різних проєктів.

Репозиторій працює як маркетплейс плагінів Claude Code. Усередині один плагін `skillshelf`, а скіли лежать у `plugins/skillshelf/skills/`.

## Скіли

| Скіл | Для чого |
|---|---|
| [`ux-journey-review`](plugins/skillshelf/skills/ux-journey-review/SKILL.md) | Пройти шлях користувача в живому застосунку і знайти, де продукт ускладнює людям життя: зайві кроки, рішення без вибору, незворотні дії без підтвердження, плутані статуси й терміни. |

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

## Як додати новий скіл

1. Створіть папку `plugins/skillshelf/skills/<назва-скіла>/` з файлом `SKILL.md`. У шапці файлу потрібні `name` і `description`. Опис має казати, що скіл робить і коли його вмикати.
2. Довгі довідкові матеріали кладіть у `references/` поруч із `SKILL.md` і посилайтеся на них із тексту, щоб основний файл лишався коротким.
3. Додайте рядок у таблицю вище.
4. Перевірте структуру, якщо під рукою є CLI: `claude plugin validate .`
