// Ожидаем, пока вся HTML-страница будет загружена
document.addEventListener("DOMContentLoaded", () => {

  // Находим ключевые элементы на странице
  const cheeseList = document.getElementById("cheese-list");
  const addCheeseForm = document.getElementById("add-cheese-form");
  const editModal = document.getElementById("edit-modal");
  const editCheeseForm = document.getElementById("edit-cheese-form");
  const closeModalButton = document.querySelector(".close-button");

  // --- Функция для выполнения GraphQL запросов --- //
  const graphqlQuery = async (query, variables = {}) => {
    const response = await fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    return await response.json();
  };

  // --- Функция для отображения сыров --- //
  const displayCheeses = (cheeses) => {
    cheeseList.innerHTML = "";
    cheeses.forEach((cheese) => {
      const cheeseCard = `
        <div class="cheese-card" data-id="${cheese.id}">
          <img src="${cheese.image}" alt="${cheese.name}">
          <div class="cheese-card-content">
            <h3>${cheese.name}</h3>
            <h4>${cheese.category}</h4>
            <p>${cheese.description}</p>
            <div class="price">€${cheese.price.toFixed(2)}</div>
          </div>
          <div class="cheese-card-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        </div>
      `;
      cheeseList.innerHTML += cheeseCard;
    });
  };

  // --- Загрузка сыров с сервера --- //
  const fetchCheeses = async () => {
    const query = `
      query {
        cheeses {
          id
          name
          category
          description
          price
          image
        }
      }
    `;
    const data = await graphqlQuery(query);
    if (data.data && data.data.cheeses) {
      displayCheeses(data.data.cheeses);
    }
  };

  // --- Добавление нового сыра --- //
  addCheeseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const image = document.getElementById('image').value;

    const mutation = `
      mutation AddCheese($name: String!, $category: String!, $description: String!, $price: Float!, $image: String!) {
        addCheese(name: $name, category: $category, description: $description, price: $price, image: $image) {
          id
          name
        }
      }
    `;

    const variables = { name, category, description, price, image };
    const data = await graphqlQuery(mutation, variables);

    if (data.data && data.data.addCheese) {
      console.log('Сыр успешно добавлен:', data.data.addCheese);
      fetchCheeses();
      addCheeseForm.reset();
    } else {
      console.error('Ошибка добавления сыра:', data.errors);
    }
  });

  // --- Редактирование и удаление сыров --- //
  cheeseList.addEventListener('click', (e) => {
    const target = e.target;
    const cheeseCard = target.closest('.cheese-card');
    const cheeseId = cheeseCard.dataset.id;

    if (target.classList.contains('edit-btn')) {
      openEditModal(cheeseId);
    } else if (target.classList.contains('delete-btn')) {
      deleteCheese(cheeseId);
    }
  });

  // --- Открытие модального окна редактирования --- //
  const openEditModal = async (cheeseId) => {
    const query = `
      query getCheese($id: ID!) {
        cheese(id: $id) {
          name
          category
          description
          price
          image
        }
      }
    `;
    const variables = { id: cheeseId };
    const data = await graphqlQuery(query, variables);

    if (data.data && data.data.cheese) {
      const cheese = data.data.cheese;
      document.getElementById('edit-cheese-id').value = cheeseId;
      document.getElementById('edit-name').value = cheese.name;
      document.getElementById('edit-category').value = cheese.category;
      document.getElementById('edit-description').value = cheese.description;
      document.getElementById('edit-price').value = cheese.price;
      document.getElementById('edit-image').value = cheese.image;
      editModal.style.display = 'block';
    }
  };

  const closeEditModal = () => { editModal.style.display = 'none'; };
  closeModalButton.addEventListener('click', closeEditModal);
  window.addEventListener('click', (e) => { if (e.target == editModal) closeEditModal(); });

  // --- Сохранение изменений сыра --- //
  editCheeseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-cheese-id').value;
    const name = document.getElementById('edit-name').value;
    const category = document.getElementById('edit-category').value;
    const description = document.getElementById('edit-description').value;
    const price = parseFloat(document.getElementById('edit-price').value);
    const image = document.getElementById('edit-image').value;

    const mutation = `
      mutation UpdateCheese($id: ID!, $name: String, $category: String, $description: String, $price: Float, $image: String) {
        updateCheese(id: $id, name: $name, category: $category, description: $description, price: $price, image: $image) {
          id
        }
      }
    `;

    const variables = { id, name, category, description, price, image };
    const data = await graphqlQuery(mutation, variables);

    if (data.data && data.data.updateCheese) {
      console.log('Сыр успешно обновлен');
      closeEditModal();
      fetchCheeses();
    } else {
      console.error('Ошибка обновления сыра:', data.errors);
    }
  });

  // --- Удаление сыра --- //
  const deleteCheese = async (cheeseId) => {
    if (!confirm('Вы уверены, что хотите удалить этот сыр?')) return;

    const mutation = `
      mutation DeleteCheese($id: ID!) {
        deleteCheese(id: $id) {
          id
        }
      }
    `;
    const variables = { id: cheeseId };
    const data = await graphqlQuery(mutation, variables);

    if (data.data && data.data.deleteCheese) {
      console.log('Сыр успешно удален');
      fetchCheeses();
    } else {
      console.error('Ошибка удаления сыра:', data.errors);
    }
  };

  // --- Изначальная загрузка сыров --- //
  fetchCheeses();
});
