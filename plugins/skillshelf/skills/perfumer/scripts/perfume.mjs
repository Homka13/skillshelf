#!/usr/bin/env node
// Інструменти скілу «парфумер». Без залежностей, Node.js 18+.
//
//   node perfume.mjs brocard "Shalimar"          факти з каталогу brocard.ua (один запит)
//   node perfume.mjs brocard "Shalimar" --all    показати всі знайдені товари, а не лише перші 5
//   node perfume.mjs notes "бергамот, ваніль бурбон, сіра амбра"   ноти → канонічні назви й характери
//   node perfume.mjs pyramid файл.txt            рівні піраміди з тексту опису (або текст через stdin)
//
// Усе виводиться як JSON. Словник нот — data/notes.json.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const DICT = JSON.parse(readFileSync(join(here, '..', 'data', 'notes.json'), 'utf8'));
const CHARACTER = Object.fromEntries(DICT.characters.map((c) => [c.id, c]));

// ---- словник нот --------------------------------------------------------------------------

export function normalizeNoteText(raw) {
  return String(raw)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[`’'ʼ"«»®™©]/g, '')
    .replace(/[-–—,.;:/()]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
const tokens = (s) => (s.length === 0 ? [] : s.split(' '));

const ALIASES = DICT.notes
  .flatMap((note) => note.aliases.map((a) => ({ note, words: tokens(a), length: a.length })))
  .sort((a, b) => b.words.length - a.words.length || Number(!!a.note.generic) - Number(!!b.note.generic) || b.length - a.length);

/** Канонічна нота або null. Варіант написання збігається, коли всі його слова є серед слів ноти. */
export function findNote(raw) {
  const words = tokens(normalizeNoteText(raw));
  if (words.length === 0) return null;
  const position = new Map();
  words.forEach((w, i) => position.has(w) || position.set(w, i));
  let best = null;
  let bestPos = Infinity;
  for (const entry of ALIASES) {
    if (best && entry.words.length < best.words.length) break;
    if (best && entry.note.generic && !best.note.generic) continue;
    if (!entry.words.every((w) => position.has(w))) continue;
    const pos = Math.min(...entry.words.map((w) => position.get(w)));
    if (!best || pos < bestPos) {
      best = entry;
      bestPos = pos;
    }
  }
  return best?.note ?? null;
}

function describeNotes(rawList) {
  const known = new Map();
  const unknown = [];
  for (const raw of rawList) {
    const note = findNote(raw);
    if (!note) {
      unknown.push(raw);
      continue;
    }
    if (!known.has(note.id)) known.set(note.id, { raw: [], note });
    known.get(note.id).raw.push(raw);
  }
  const notes = [...known.values()].map(({ raw, note }) => ({
    як_у_джерелі: raw,
    нота: note.label,
    характер: CHARACTER[note.character].label,
    ...(note.alsoCharacter ? { другий_характер: CHARACTER[note.alsoCharacter].label } : {}),
    ...(note.generic ? { збірна: true } : {}),
  }));
  const byCharacter = {};
  for (const { note } of known.values()) {
    const label = CHARACTER[note.character].label;
    byCharacter[label] = (byCharacter[label] ?? 0) + 1;
  }
  return { ноти: notes, поза_словником: unknown, характери_за_кількістю_нот: byCharacter };
}

// ---- рівні піраміди з опису -------------------------------------------------------------

const LEVEL_LABEL = { top: 'верхні', heart: 'серце', base: 'база' };
const MARKERS = {
  top: /почина\p{L}*|початк\p{L}*|верхн\p{L}* (?:нот|акорд)\p{L}*|стартов\p{L}* (?:акорд|нот)\p{L}*|відкрива\p{L}+/u,
  heart: /нот\p{L}* серця|[ув] серці|серце (?:аромату|композиції)|серце\s*[:—–]|[ув] (?:\p{L}+ )?серце(?!\p{L})|серцев\p{L}* нот\p{L}*|середн\p{L}* нот\p{L}*|[ув] \p{L}+ серці/u,
  base: /базов\p{L}* нот\p{L}*|шлейф\p{L}*|в основі|[ув] базі|база\s*:|(?<!\p{L})баз[ау](?!\p{L})|фінал\p{L}*|заверш\p{L}*/u,
};
// Те саме з прапорцем g — щоб знайти, де в реченні стоїть кожен маркер
const MARKERS_G = Object.fromEntries(Object.entries(MARKERS).map(([k, re]) => [k, new RegExp(re.source, 'gu')]));
const LABEL = /(верхн\p{L}* нот\p{L}*|початков\p{L}* нот\p{L}*|нот\p{L}* серця|середн\p{L}* нот\p{L}*|базов\p{L}* нот\p{L}*)/gu;
// Межі частин речення: «…, а тоді перетікає в базу з …» — окрема частина
const CUT = /(?=[ув] серці|[ув] \p{L}+ серці|в основі|у базі|у шлейфі|в шлейфі|а тоді|а потім|згодом)/u;
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Після основи не може йти суфікс прикметника: «пудрове серце» — не нота «пудра»,
// «трав'яна свіжість» — не «трава». Прикметникові форми, які є нотами, записані в словнику окремо.
const ADJ = '(?!(?:ов|ев|ян|ьн|ськ|зьк|цьк)\\p{L}*)';
function wordRe(word) {
  const body =
    word.length >= 5 ? `${escape(word.slice(0, -1))}${ADJ}\\p{L}{0,3}` : word.length === 4 ? `${escape(word)}${ADJ}\\p{L}{0,2}` : escape(word);
  return new RegExp(`(?<!\\p{L})${body}(?!\\p{L})`, 'u');
}
// В описі однослівний прикметник («пудровий», «трояндова», «деревні») — це опис звучання, а не
// нота. У фільтрі Brocard такі написання означають ноту, тому в словнику вони є, але тут їх не беремо.
const ADJECTIVE_ALIAS = /^\p{L}+(?:ов|ев|ян|ськ|зьк|цьк|н)(?:ий|ій|а|е|і|ого|ої)$/u;
const MATCHERS = DICT.notes.map((note) => {
  const usable = note.aliases.filter((a) => a.split(/\s+/).some((w) => w.length > 1) && !ADJECTIVE_ALIAS.test(a));
  return { note, usable, aliases: usable.map((a) => a.split(/\s+/).filter((w) => w.length > 1).map(wordRe)) };
});
function notesIn(sentence) {
  // Для кожної знайденої ноти запам'ятовуємо, яким написанням її знайдено
  const found = [];
  for (const { note, usable, aliases } of MATCHERS) {
    const i = aliases.findIndex((words) => words.every((re) => re.test(sentence)));
    if (i >= 0 && !note.generic) found.push({ note, alias: usable[i] });
  }
  // Нота, знайдена коротшим написанням усередині довшого («горіх» у «мускатний горіх»), — зайва
  const words = (a) => a.split(/\s+/);
  return found
    .filter((x) => !found.some((y) => y !== x && words(y.alias).length > words(x.alias).length && words(x.alias).every((w) => wordRe(w).test(y.alias))))
    .map((x) => x.note);
}

export function extractPyramid(text) {
  const levels = { top: [], heart: [], base: [] };
  const seen = new Set();
  const sentences = text
    .toLowerCase()
    .replace(/[`’'ʼ]/g, '')
    .replace(LABEL, '. $1')
    .split(/(?<=[.!?;])\s+/u)
    .flatMap((s) => s.split(CUT));
  const add = (level, chunk) => {
    for (const note of notesIn(chunk)) {
      if (seen.has(note.id)) continue;
      seen.add(note.id);
      levels[level].push(note.label);
    }
  };
  for (const sentence of sentences) {
    // «розкривається» означає то старт, то розвиток аромату — такі частини речень пропускаємо
    if (/розкрива\p{L}+/u.test(sentence)) continue;
    const marks = Object.entries(MARKERS_G)
      .flatMap(([level, re]) => [...sentence.matchAll(re)].map((m) => ({ level, at: m.index, verb: /^відкрива/u.test(m[0]) })))
      .sort((x, y) => x.at - y.at);
    if (marks.length === 0) continue;
    if (marks.every((m) => m.level === marks[0].level)) {
      add(marks[0].level, sentence);
      continue;
    }
    // Кілька рівнів в одному реченні («починається бергамотом…, переходить у пудрове серце іриса…,
    // і завершується базою з ванілі»): кожна частина від маркера до наступного маркера — свій рівень.
    // Частину перед першим маркером беремо лише тоді, коли маркер — дієслово після нот
    // («лимон і малина відкривають композицію, у серці…»); інакше її рівень невідомий.
    if (marks[0].verb) add(marks[0].level, sentence.slice(0, marks[0].at));
    marks.forEach((m, i) => add(m.level, sentence.slice(m.at, i + 1 < marks.length ? marks[i + 1].at : undefined)));
  }
  return {
    верхні: levels.top,
    серце: levels.heart,
    база: levels.base,
    рівнів_знайдено: Object.values(levels).filter((l) => l.length > 0).length,
  };
}

/** Позначає ноти піраміди, яких немає у фільтрі «Ноти»: вони взяті лише з тексту опису */
function pyramidAgainstFilter(p, filterRaw) {
  const filter = new Set(filterRaw.map((r) => findNote(r)?.label).filter(Boolean));
  const mark = (list) => list.map((n) => (filter.has(n) ? n : `${n} (лише в описі)`));
  const placed = new Set([...p.верхні, ...p.серце, ...p.база]);
  return {
    верхні: mark(p.верхні),
    серце: mark(p.серце),
    база: mark(p.база),
    рівнів_знайдено: p.рівнів_знайдено,
    ноти_фільтра_без_рівня: [...filter].filter((n) => !placed.has(n)),
  };
}

// ---- brocard.ua ---------------------------------------------------------------------------

const ENDPOINT = 'https://www.brocard.ua/graphql';
const QUERY = (q, size) => `{ products(search: ${JSON.stringify(q)}, pageSize: ${size}) {
  total_count
  items { sku name url_key description { html }
    custom_attributesV2(filters: {is_filterable: true}) {
      items { code ... on AttributeSelectedOptions { selected_options { label } } } } } } }`;

const textOf = (html) =>
  String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/\s+/g, ' ')
    .trim();

const FAMILY_PHRASE = /[—–-]\s*(?:це\s+)?([а-яіїєґ'’ʼ\- ]{4,80}?)\s+аромат\s+для/i;

// Позначки концентрації пошук сайту не розуміє («Sauvage EDP» → 0 товарів): прибираємо їх із
// запиту до сайту й використовуємо лише для впорядкування результатів.
const CONC_WORDS = /\b(?:edp|edt|edc|eau de parfum|eau de toilette|eau de cologne|cologne|extrait|parfum|парфумована вода|туалетна вода|одеколон|екстракт|парфуми)\b/giu;

async function brocard(query, all) {
  const siteQuery = query.replace(CONC_WORDS, ' ').replace(/\s+/g, ' ').trim() || query;
  // Один запит із невеликою сторінкою: сайт чужий, навантажувати його не можна.
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Store: 'ua', 'User-Agent': 'fragrance-research-script' },
    body: JSON.stringify({ query: QUERY(siteQuery, 20) }),
    signal: AbortSignal.timeout(150_000),
  });
  if (!res.ok) throw new Error(`brocard.ua відповів HTTP ${res.status}`);
  const json = await res.json();
  const items = json?.data?.products?.items;
  if (!items) throw new Error(`brocard.ua не повернув товарів: ${JSON.stringify(json?.errors ?? json).slice(0, 300)}`);
  const out = items.map((it) => {
    const a = {};
    for (const x of it.custom_attributesV2?.items ?? []) if (x.selected_options) a[x.code] = x.selected_options.map((o) => o.label);
    const text = textOf(it.description?.html);
    const phrase = FAMILY_PHRASE.exec(text.toLowerCase());
    return {
      назва: it.name,
      бренд: (a.brand ?? [])[0] ?? null,
      лінійка: (a.brandlines ?? [])[0] ?? null,
      тип: (a.itemtype ?? [])[0] ?? null,
      стать: a.gender ?? [],
      посилання: `https://www.brocard.ua/product/${it.url_key}`,
      групи_ароматів_brocard: a.aromagrops ?? [],
      характер_аромату_brocard: a.characteraroma ?? [],
      ноти_з_фільтра: describeNotes(a.notes ?? []),
      родина_у_фразі_опису: phrase ? phrase[1].trim() : null,
      піраміда_з_опису: pyramidAgainstFilter(extractPyramid(text), a.notes ?? []),
      опис: text,
    };
  });
  // Пошук сайту ставить точні збіги не першими: «Sauvage» повертає спершу чужі аромати зі словом
  // у назві. Тому впорядковуємо самі: назва збігається з запитом → бренд згадано в запиті →
  // усі слова запиту є в назві чи бренді.
  const words = (s) => (s ?? '').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\d]+/gu, ' ').trim();
  // Концентрацію в запиті («Sauvage EDP») розуміємо як побажання до типу товару
  const CONC = [
    [/\b(?:edp|eau de parfum|парфумована вода)\b/, /^парфумована вода/],
    [/\b(?:edt|eau de toilette|туалетна вода)\b/, /^туалетна вода/],
    [/\b(?:edc|eau de cologne|cologne|одеколон)\b/, /^одеколон/],
    [/\b(?:extrait|екстракт)\b/, /^екстракт/],
    [/\b(?:parfum|парфуми)\b/, /^парфуми/],
  ];
  let q = words(query);
  const wantedType = CONC.find(([re]) => re.test(q))?.[1];
  for (const [re] of CONC) q = q.replace(new RegExp(re.source, 'g'), ' ').replace(/\s+/g, ' ').trim();
  const FRAGRANCE = /^(?:парфумована вода|туалетна вода|парфуми|екстракт|одеколон|ароматична вода)/;
  const score = (x) => {
    const name = words(x.назва);
    const brand = words(x.бренд);
    const type = (x.тип ?? '').toLowerCase();
    const rest = brand && q.includes(brand) ? q.replace(brand, '').trim() : q;
    return (
      (name === rest ? 4 : 0) +
      (brand && q.includes(brand) ? 2 : 0) +
      (rest.split(' ').every((w) => `${name} ${brand}`.split(' ').includes(w)) ? 1 : 0) +
      (FRAGRANCE.test(type) ? 2 : 0) + // гелі, бальзами й лосьйони — не аромати
      (wantedType && wantedType.test(type) ? 3 : 0) +
      (/міні|змінн|дорожн|тестер|tester/.test(type) ? -1 : 0)
    );
  };
  const ranked = out.map((x, i) => ({ x, s: score(x), i })).sort((a, b) => b.s - a.s || a.i - b.i).map((r) => r.x);
  const shown = all ? ranked : ranked.slice(0, 5);
  return {
    запит: query,
    запит_до_сайту: siteQuery,
    знайдено_на_сайті: json.data.products.total_count,
    перші_20_знайдених: ranked.map((x) => `${x.бренд ?? '?'} | ${x.назва} | ${x.тип ?? '?'}`),
    підказка: 'Якщо потрібного аромату немає серед перших 20, повтори запит із брендом, наприклад «Dior Sauvage».',
    показано_детально: shown.length,
    товари: shown,
  };
}

// ---- CLI ----------------------------------------------------------------------------------

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
const [cmd, ...rest] = isMain ? process.argv.slice(2) : [];
const print = (x) => console.log(JSON.stringify(x, null, 2));
if (isMain) try {
  if (cmd === 'brocard' && rest[0]) {
    print(await brocard(rest[0], rest.includes('--all')));
  } else if (cmd === 'notes' && rest.length) {
    print(describeNotes(rest.join(',').split(/[,;\n]+/).map((s) => s.trim()).filter(Boolean)));
  } else if (cmd === 'pyramid') {
    const text = rest[0] ? readFileSync(rest[0], 'utf8') : readFileSync(0, 'utf8');
    print(extractPyramid(text));
  } else {
    console.error('Використання: perfume.mjs brocard "<назва>" [--all] | notes "<нота, нота>" | pyramid [файл]');
    process.exit(2);
  }
} catch (e) {
  console.error(`Помилка: ${e.message}`);
  process.exit(1);
}
