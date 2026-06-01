'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..');
const HTML = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const CSS = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
const featured = require(path.join(ROOT, 'featured.js'));

// Strip HTML tags and decode the few entities the page actually uses,
// so we can search the rendered text directly.
function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&ndash;/g, '–')
    .replace(/&copy;/g, '©')
    .replace(/\s+/g, ' ')
    .trim();
}

const TEXT = stripHtml(HTML);

// ---------- Ticket 1: Menu ----------
test('Ticket 1 — menu has Hot Drinks, Cold Drinks, Food & Pastries sections', () => {
  assert.match(HTML, /Hot Drinks/);
  assert.match(HTML, /Cold Drinks/);
  assert.match(HTML, /Food (?:&|&amp;) Pastries/);
});

const menuItems = [
  ['Espresso', '$3.00'],
  ['Cappuccino', '$4.50'],
  ['Latte', '$5.00'],
  ['Flat White', '$4.75'],
  ['Filter Coffee', '$2.50'],
  ['Iced Latte', '$5.50'],
  ['Cold Brew', '$5.00'],
  ['Iced Matcha Latte', '$5.50'],
  ['Sparkling Lemonade', '$4.00'],
  ['Butter Croissant', '$3.50'],
  ['Banana Bread', '$4.00'],
  ['Avocado Toast', '$8.50'],
  ['Seasonal Muffin', '$3.75'],
];

for (const [name, price] of menuItems) {
  test(`Ticket 1 — menu lists ${name} at ${price}`, () => {
    assert.ok(TEXT.includes(name), `expected page to mention ${name}`);
    assert.ok(TEXT.includes(price), `expected page to mention ${price}`);
  });
}

test('Ticket 1 — Latte lists milk alternatives (oat, almond, whole milk)', () => {
  assert.match(TEXT, /oat/i);
  assert.match(TEXT, /almond/i);
  assert.match(TEXT, /whole milk/i);
});

test('Ticket 1 — responsive viewport meta tag is present', () => {
  assert.match(
    HTML,
    /<meta\s+name=["']viewport["']\s+content=["']width=device-width/,
  );
});

test('Ticket 1 — CSS includes mobile-first media queries', () => {
  assert.match(CSS, /@media\s*\(min-width:\s*768px\)/);
  assert.match(CSS, /@media\s*\(min-width:\s*1024px\)/);
});

// ---------- Ticket 2: Featured Monthly Special ----------
test('Ticket 2 — featured config exposes the four required fields', () => {
  assert.equal(featured.label, 'Featured This Month');
  assert.equal(featured.name, 'Lavender Honey Latte');
  assert.equal(featured.price, '$6.00');
  assert.match(featured.description, /lavender syrup/i);
  assert.match(featured.description, /wildflower honey/i);
  assert.match(featured.description, /oat milk/i);
  assert.match(featured.description, /double shot/i);
  assert.match(featured.description, /iced or hot/i);
});

test('Ticket 2 — featured section is present and visually highlighted', () => {
  assert.match(HTML, /id=["']featured["']/);
  assert.match(HTML, /class=["']badge["']/);
  // The featured-card has its own background / shadow rules.
  assert.match(CSS, /\.featured-card\s*\{/);
});

test('Ticket 2 — featured content is rendered via data attributes', () => {
  for (const field of ['label', 'name', 'price', 'description']) {
    assert.match(
      HTML,
      new RegExp(`data-featured=["']${field}["']`),
      `expected data-featured="${field}" in HTML`,
    );
  }
});

// ---------- Ticket 3: Loyalty & Ordering ----------
test('Ticket 3 — loyalty section labelled "Loyalty & Ordering"', () => {
  assert.match(TEXT, /Loyalty & Ordering/);
});

test('Ticket 3 — loyalty card programme (9 + 10th free) explained', () => {
  assert.match(TEXT, /9 coffees/i);
  assert.match(TEXT, /10th free/i);
  assert.match(TEXT, /counter/i);
});

test('Ticket 3 — pre-order app described for iOS and Android', () => {
  assert.match(TEXT, /iOS/);
  assert.match(TEXT, /Android/);
  assert.match(HTML, /apps\.apple\.com/);
  assert.match(HTML, /play\.google\.com/);
});

test('Ticket 3 — group/catering info with email and 10+ party size', () => {
  assert.match(TEXT, /10\+/);
  assert.match(HTML, /hello@brewandbliss\.com/);
});

// ---------- Ticket 4: Find Us ----------
test('Ticket 4 — address is displayed', () => {
  assert.match(TEXT, /42 Maple Street, Downtown District/);
});

test('Ticket 4 — opening hours displayed for weekdays and weekends', () => {
  assert.match(TEXT, /Mon–Fri/);
  assert.match(TEXT, /7 am–6 pm/);
  assert.match(TEXT, /Sat–Sun/);
  assert.match(TEXT, /8 am–5 pm/);
});

test('Ticket 4 — phone number listed', () => {
  assert.match(TEXT, /\(555\) 012-3456/);
});

test('Ticket 4 — website and Instagram linked', () => {
  assert.match(HTML, /href=["']http:\/\/www\.brewandbliss\.com["']/);
  assert.match(HTML, /href=["']https:\/\/www\.instagram\.com\/brewandbliss["']/);
  assert.match(TEXT, /@brewandbliss/);
});

test('Ticket 4 — address links to an external map', () => {
  assert.match(HTML, /href=["']https:\/\/www\.google\.com\/maps[^"']+["']/);
});

test('Ticket 4 — footer note covers seasonal availability, allergens, packaging', () => {
  assert.match(TEXT, /seasonal availability/i);
  assert.match(TEXT, /allergen info/i);
  assert.match(TEXT, /compostable packaging/i);
});

// ---------- Cross-cutting ----------
test('Hero copy is present', () => {
  assert.match(
    TEXT,
    /Handcrafted drinks\. Fresh pastries\. Your perfect cup, every time\./,
  );
});
