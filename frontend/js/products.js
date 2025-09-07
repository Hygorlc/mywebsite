async function searchProducts(query) {
  const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

async function updateProduct(id, data) {
  const res = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    body: data
  });
  if (!res.ok) throw new Error('Update failed');
  return res.json();
}

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');
  const results = document.getElementById('search-results');
  const panel = document.getElementById('product-panel');
  const panelClose = document.getElementById('panel-close');
  const panelSave = document.getElementById('panel-save');
  const productList = document.getElementById('product-list');
  let currentProductId = null;

  input.addEventListener('input', async () => {
    const q = input.value.trim();
    if (!q) { results.innerHTML=''; return; }
    try {
      const items = await searchProducts(q);
      results.innerHTML = '';
      items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'product-item w3-padding';
        div.textContent = item.name;
        div.addEventListener('click', () => openPanel(item));
        results.appendChild(div);
      });
    } catch (err) {
      console.error(err);
    }
  });

  panelClose.addEventListener('click', () => {
    panel.style.display = 'none';
  });

  function openPanel(item) {
    currentProductId = item.id;
    document.getElementById('panel-image').src = item.image || '';
    document.getElementById('panel-name').value = item.name || '';
    document.getElementById('panel-description').value = item.description || '';
    document.getElementById('panel-price').value = item.price || '';
    panel.style.display = 'block';
  }

  panelSave.addEventListener('click', async () => {
    const formData = new FormData();
    formData.append('name', document.getElementById('panel-name').value);
    formData.append('description', document.getElementById('panel-description').value);
    formData.append('price', document.getElementById('panel-price').value);
    const file = document.getElementById('panel-photo').files[0];
    if (file) formData.append('photo', file);

    try {
      const updated = await updateProduct(currentProductId, formData);
      panel.style.display = 'none';
      const li = document.createElement('li');
      li.className = 'w3-padding';
      li.textContent = `${updated.name} - $${updated.price}`;
      productList.appendChild(li);
    } catch (err) {
      console.error(err);
    }
  });
});
