$(document).ready(persistData);

function persistData()  {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => items.forEach(item => appendPackingList(item)))
    .catch(error => console.log(error))
}

function appendPackingList({ id, item, packed }) {
  $('.packingList').append(
    `<article id="${id}">
      <h2>${item}</h2>
      <button class="packingList__item-delete">Delete</button>
      <input type="checkbox" name="packed" /> Packed
    </article>`
  );
}
