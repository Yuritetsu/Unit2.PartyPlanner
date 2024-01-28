const API_URL = 'https://fsa-crud-2aa9294fe819.herokuapp.com/api';
const COHORT = "2311-FSA-ET-WEB-PT-SF";

const state = {
  parties: [],
};


const recipesList = document.querySelector('#parties');

const addRecipeForm = document.querySelector('#addParty');
addRecipeForm.addEventListener('submit', addParty);

/**
 * 
 */
async function render() {
  await getParties();
  renderParties();
}

render();

/**
 * Update state with recipes from API
 */
async function getRecipes() {
  try {
    // which HTTP verb is fetch using here? 
    const response = await fetch(API_URL);
    const data = await response.json()
    state.recipes = data.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Handle form submission for adding a recipe
 * @param {Event} event
 */
async function addRecipe(event) {
  // we do not want the page to re-render - we're preventing default behavior here
  event.preventDefault();
  // each of our inputs has a name property, which we can acces directly from the form element
  const title = addRecipeForm.title.value; 
  const imageUrl = addRecipeForm.imageUrl.value;
  const instructions = addRecipeForm.instructions.value;
  
  await createRecipe(
   title,
   imageUrl,
   instructions
  );
}

/**
 * Ask API to create a new recipe and rerender
 * @param {string} name name of recipe
 * @param {string} imageUrl url of recipe image
 * @param {string} description description of the recipe
 */
async function createRecipe(name, imageUrl, description) {
  try {
    // 
    const response = await fetch(API_URL, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      // why do we need to convert the body here?
      body: JSON.stringify({ name, imageUrl, description }),
    });
    const json = await response.json();

    // This is a good time to explain how we're handling errors.
    // Refer to the API documentation!
    // Differentiate between a network error and an API error.
    if (json.error) {
      throw new Error(json.message);
    }
    // is our newly added recipe being added to the DOM?
    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask API to update an existing recipe and rerender
 * NOTE: This is not currently used in the app, but it's here for reference.
 * @param {number} id id of the recipe to update
 * @param {string} name new name of recipe
 * @param {string} imageUrl new url of recipe image
 * @param {string} description new description for recipe
 */

async function updateRecipe(id, name, imageUrl, description) {
  try {
    // where is this ID coming from? 
    // how do we know where to send this request?? 
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, imageUrl, description }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }

    render();
  } catch (error) {
    console.error(error);
  }
}

/**
 * Ask API to delete a recipe and rerender
 * @param {number} id id of recipe to delete
 */
async function deleteRecipe(id) {
  // This is much simpler than `createRecipe` so you can move through it quickly.
  // Instead, focus on how the event listener is attached to a rendered button
  // so that the correct recipe is deleted.
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    // Explain that we're handling errors differently here, since
    // a successful deletion only sends back a status code.
    if (!response.ok) {
      throw new Error('Recipe could not be deleted.');
    }

    render();
  } catch (error) {
    console.log(error);
  }
}

/**
 * Render recipes from state
 */
function renderRecipes() {
  if (!state.recipes.length) {
    recipesList.innerHTML = `<li>No recipes found.</li>`;
    return;
  }
  // This uses a combination of `createElement` and `innerHTML`;
  // point out that you can use either one, but `createElement` is
  // more flexible and `innerHTML` is more concise.
  const recipeCards = state.recipes.map((recipe) => {
    const recipeCard = document.createElement('li');
    recipeCard.classList.add('recipe');
    recipeCard.innerHTML = `
      <h2>${recipe.name}</h2>
      <img src="${recipe.imageUrl}" alt="${recipe.name}" />
      <p>${recipe.description}</p>
    `;

    // We use createElement because we need to attach an event listener.
    // If we used `innerHTML`, we'd have to use `querySelector` as well.
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Recipe';
    recipeCard.append(deleteButton);

    // Explain how closure allows us to access the correct recipe id
    deleteButton.addEventListener('click', () => deleteRecipe(recipe.id));

    return recipeCard;
  });
  recipesList.replaceChildren(...recipeCards);
}