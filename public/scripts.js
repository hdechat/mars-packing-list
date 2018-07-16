$(document).ready(persistData);

function persistData()  {
  fetch('/api/v1/items')
    .then(response => response.json())
    .then(items => items.forEach(item => appendPackingList(item)))
    .catch(error => console.log(error))
}

function appendPackingList({ id, item, packed}) {
  console.log(packed)
  if(packed) {
    $('.packingList').append(
    `<article id="${id}">
      <h2>${item}</h2>
      <button class="packingList__item-delete">Delete</button>
      <input class="packingList__item-packed" type="checkbox" name="packed" checked/> Packed
    </article>`
  );
  } else {
    $('.packingList').append(
      `<article id="${id}">
        <h2>${item}</h2>
        <button class="packingList__item-delete">Delete</button>
        <input class="packingList__item-packed" type="checkbox" name="packed" /> Packed
      </article>`
    );
  }
}

$('#userInput__button').on('click', function() {
  const item = $('#userInput__item').val();
  fetch('/api/v1/items', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      item,
      packed: false
    })
  })
  .then(res => res.json())
  .then(id => {
    items = {id: id.id, item: item, packed: false}
    appendPackingList(items)
  })
  .catch(error => console.log(error));
});

$('.packingList').on('click', '.packingList__item-delete', function(event) {
  event.preventDefault();
  var itemId = $(this).parent().attr('id');
  fetch(`/api/v1/items/${itemId}`, {
    method: 'DELETE'
  })
  .then(response => console.log('status is ' + response.status))
  .catch(error => console.log(error));
  $(this).parent().remove();
});

$('.packingList').on('click', '.packingList__item-packed', function(event) {
  const itemId = $(this).parent().attr('id');
  const value = this.checked
  fetch(`/api/v1/items/${itemId}`, {
    method: 'PUT',
    headers: {
    "Content-Type": "application/json"
    },
    body: JSON.stringify({
      packed: value
    })
  })
  .then(response => console.log(response.status))
  .catch(error => console.log(error));
});
