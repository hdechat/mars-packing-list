$(document).ready(persistData);

function persistData()  {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => items.forEach(item => appendPackingList(item)))
    .catch(error => console.log(error))
}

function appendPackingList({ id, item, packed}) {
  $('.packingList').append(
    `<article id="${id}">
      <h2>${item}</h2>
      <button class="packingList__item-delete">Delete</button>
      <div class="packingList__checkbox">
        <input class="packingList__item-packed" type="checkbox" name="packed" /> Packed
      </div>
    </article>`
  );

  packed ? checkPacked(id) : '';
}

function checkPacked(id) {
  $(`#${id}`).find('.packingList__item-packed').replaceWith(`
    <input class="packingList__item-packed" type="checkbox" name="packed" checked/>
    `)
}

$('#userInput__button').on('click', addItem)

function addItem() {
  const item = $('#userInput__item').val();
  $('#userInput__item').val('')

  fetch('/api/v1/items', {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item, packed: false })
  })
  .then(response => response.json())
  .then(({ id }) => {
    appendPackingList({ id, item, packed: false })
  })
  .catch(error => console.log(error));
};

$('.packingList').on('click', '.packingList__item-delete', deleteItem)

function deleteItem() {
  const itemId = $(this).parent().attr('id');
  $(this).parent().remove();

  fetch(`/api/v1/items/${itemId}`, { method: 'DELETE' })
    .then(response => response)
    .catch(error => console.log(error));
};

$('.packingList').on('click', '.packingList__item-packed', togglePacked)

function togglePacked() {
  const itemId = $(this).parents('article').attr('id');
  const value = this.checked;

  fetch(`/api/v1/items/${itemId}`, {
    method: 'PUT',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ packed: value })
  })
  .then(response => response)
  .catch(error => console.log(error));
};
