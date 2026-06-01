/**
 * Featured Monthly Special — Brew & Bliss
 * ---------------------------------------
 * To change the monthly special, edit the four fields in the
 * `featured` object below. The page will pick them up on next load.
 * No HTML changes are required.
 *
 * Fields:
 *   label       — small badge text (e.g. "Featured This Month")
 *   name        — drink/item name
 *   price       — price string, including currency symbol
 *   description — short description paragraph
 */
(function () {
  'use strict';

  var featured = {
    label: 'Featured This Month',
    name: 'Lavender Honey Latte',
    price: '$6.00',
    description:
      'House-made lavender syrup, local wildflower honey, and oat milk over a double shot. Available iced or hot.',
  };

  // Expose for tests / external scripts that want to read the config.
  if (typeof window !== 'undefined') {
    window.BREW_AND_BLISS_FEATURED = featured;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = featured;
  }

  function render() {
    if (typeof document === 'undefined') return;
    var fields = ['label', 'name', 'price', 'description'];
    fields.forEach(function (field) {
      var nodes = document.querySelectorAll('[data-featured="' + field + '"]');
      nodes.forEach(function (node) {
        node.textContent = featured[field];
      });
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', render);
    } else {
      render();
    }
  }
})();
