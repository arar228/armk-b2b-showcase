const form = document.querySelector('#search-form');
const input = document.querySelector('#search-input');
const grid = document.querySelector('#catalog-grid');
const resultLine = document.querySelector('#result-line');

const formatPrice = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});

function createTextElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  element.textContent = text;
  return element;
}

function render(items) {
  grid.replaceChildren();
  resultLine.textContent = `${items.length} synthetic products`;

  for (const item of items) {
    const card = document.createElement('article');
    card.className = 'product-card';

    const top = document.createElement('div');
    top.className = 'product-top';
    top.append(
      createTextElement('span', 'category', item.category),
      createTextElement('span', 'availability', item.availability),
    );

    card.append(
      top,
      createTextElement('p', 'manufacturer', item.manufacturer),
      createTextElement('h3', '', item.name),
      createTextElement('p', 'part-number', item.partNumber),
      createTextElement('p', 'price', formatPrice.format(item.displayPriceRub)),
    );
    grid.append(card);
  }
}

async function loadCatalog(query = '') {
  resultLine.textContent = 'Loading synthetic catalog…';
  try {
    const response = await fetch(`/api/catalog?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error(`Request failed with ${response.status}`);
    const payload = await response.json();
    render(payload.items);
  } catch {
    grid.replaceChildren();
    resultLine.textContent = 'The showcase API is temporarily unavailable.';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  loadCatalog(input.value);
});

loadCatalog();
