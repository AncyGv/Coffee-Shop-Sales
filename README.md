# Brew & Bliss Coffee Shop

A small, static landing page for **Brew & Bliss** — a neighbourhood coffee
shop. The page is responsive (mobile + desktop) and built with plain
HTML/CSS/JS — no framework, no build step.

## Sections

1. **Hero / intro** — welcome copy.
2. **Featured Monthly Special** — visually highlighted callout box. The
   content (label, name, price, description) is driven from a single config
   object in [`featured.js`](./featured.js) so it can be updated each month
   without touching the HTML.
3. **Menu** — three sections (Hot Drinks, Cold Drinks, Food & Pastries) with
   names, prices, descriptions, and milk-alternative options where they
   apply.
4. **Loyalty & Ordering** — loyalty card programme, pre-order app links
   (iOS / Android), and group/catering contact.
5. **Find Us** — address (with Google Maps link), opening hours, phone,
   website, Instagram, and a footer note about seasonal availability,
   allergens, and compostable packaging.

## Running locally

The page is fully static. To preview it, just open `index.html` in a
browser, or serve the folder:

```bash
npx serve .
# or
python3 -m http.server
```

## Updating the featured monthly special

Edit [`featured.js`](./featured.js) and change the four fields on the
`featured` object:

```js
var featured = {
  label: 'Featured This Month',
  name: 'Lavender Honey Latte',
  price: '$6.00',
  description:
    'House-made lavender syrup, local wildflower honey, and oat milk over a double shot. Available iced or hot.',
};
```

The page picks the new values up on the next reload — no HTML changes
required. The "Featured This Month" section in `index.html` reads the
fields from `data-featured="…"` attributes, so the markup stays
declarative.

## Tests

Run the content-validation suite (uses Node's built-in test runner — no
dependencies to install):

```bash
npm test
```

The suite checks that:

- every menu item from the spec is present at the correct price,
- milk alternatives are listed where required,
- the Featured config exposes the four updatable fields,
- the Featured section is rendered through the `data-featured` hooks,
- the loyalty card, pre-order app, and group/catering details are present,
- the address, hours, phone, website, Instagram, and footer note are all
  present and that the address links to Google Maps.
