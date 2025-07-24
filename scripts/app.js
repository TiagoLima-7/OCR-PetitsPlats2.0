// import { recipes } from './recipes.js';

// let mainSearch = '';

// const mainInput = document.querySelector('.search-field input');
// if (mainInput) {
//     mainInput.addEventListener('input', (e) => {
//         mainSearch = e.target.value.trim().toLowerCase();
//         updateRecipesAndUI();
//     });
// }


// class Recipe {
//     constructor({ id, image, name, description, ingredients, time }) {
//         this.id = id;
//         this.image = image;
//         this.name = name;
//         this.description = description;
//         this.ingredients = ingredients;
//         this.time = time;
//     }

    

//     getIngredientsElements() {
//         const container = document.createElement('div');
//         container.className = "ingredients-grid";
//         const ul1 = document.createElement('ul');
//         ul1.className = "list-unstyled mb-2";
//         const ul2 = document.createElement('ul');
//         ul2.className = "list-unstyled mb-2";

//         this.ingredients.forEach((ing, index) => {
//             const li = document.createElement('li');
//             let txt = document.createElement('strong');
//             txt.textContent = ing.ingredient;
//             li.appendChild(txt);
//             if (ing.quantity !== undefined) {
//                 li.appendChild(document.createTextNode(`: ${ing.quantity}`));
//                 if (ing.unit) li.appendChild(document.createTextNode(` ${ing.unit}`));
//             }
//             (index % 2 === 0 ? ul1 : ul2).appendChild(li);
//         });
//         container.appendChild(ul1);
//         container.appendChild(ul2);
//         return container;
//     }

//     toCardElement() {
//         const col = document.createElement('div');
//         col.className = "col mb-4";
//         const card = document.createElement('div');
//         card.className = "card shadow-sm";
//         const img = document.createElement('img');
//         img.src = `../img/JSON_recipes/${this.image}`;
//         img.className = "card-img-top";
//         img.alt = this.name;
//         const cardBody = document.createElement('div');
//         cardBody.className = "card-body d-flex flex-column";
//         const title = document.createElement('h5');
//         title.className = "card-title ff-anton text-uppercase";
//         title.textContent = this.name;
//         const subtitle = document.createElement('h6');
//         subtitle.className = "card-subtitle mb-2";
//         subtitle.textContent = "Recette";
//         const desc = document.createElement('p');
//         desc.className = "card-text ff-manrope";
//         desc.textContent = this.description;
//         const ingregientsList = document.createElement('h6');
//         ingregientsList.className = "card-subtitle mb-2";
//         ingregientsList.textContent = "Ingrédients";
//         const ul = this.getIngredientsElements();
//         const divTime = document.createElement('div');
//         divTime.className = "mt-auto";
//         const timeStamp = document.createElement('span');
//         timeStamp.className = "timeStamp bg-warning text-dark ff-manrope";
//         const timeText = document.createTextNode(` ${this.time}min`);
//         timeStamp.appendChild(timeText);
//         divTime.appendChild(timeStamp);

//         cardBody.appendChild(title);
//         cardBody.appendChild(subtitle);
//         cardBody.appendChild(desc);
//         cardBody.appendChild(ingregientsList);
//         cardBody.appendChild(ul);

//         card.appendChild(img);
//         card.appendChild(divTime);
//         card.appendChild(cardBody);

//         col.appendChild(card);
//         return col;
//     }
// }

// // ----------------------
// // Gestion des tags sélectionnés
// // ----------------------
// let selectedTags = {
//     ingredients: [],
//     appliances: [],
//     ustensils: []
// };

// // Création dynamique du conteneur pour les tags sélectionnés si absent
// function ensureSelectedTagsContainer() {
//     if (!document.getElementById('selected-tags')) {
//         const tagsDiv = document.createElement('div');
//         tagsDiv.id = 'selected-tags';
//         tagsDiv.className = 'mb-3';
//         // Ajoute juste après la div.filters
//         const filters = document.querySelector('.filters');
//         filters.parentNode.insertBefore(tagsDiv, filters.nextSibling);
//     }
// }

// // Affichage des tags sélectionnés
// function renderSelectedTags() {
//     ensureSelectedTagsContainer();
//     const tagsContainer = document.getElementById('selected-tags');
//     tagsContainer.innerHTML = '';
//     ['ingredients', 'appliances', 'ustensils'].forEach(type => {
//         selectedTags[type].forEach(tag => {
//             const tagElem = document.createElement('span');
//             tagElem.className = `tag tag-${type} me-2 mb-2`;
//             tagElem.textContent = tag + ' ';
//             // Ajout d'une croix pour retirer le tag
//             const removeBtn = document.createElement('button');
//             removeBtn.className = 'tag-remove btn-close btn-close-white btn-sm ms-1';
//             removeBtn.type = 'button';
//             removeBtn.ariaLabel = 'Retirer';
//             removeBtn.addEventListener('click', () => {
//                 selectedTags[type] = selectedTags[type].filter(t => t !== tag);
//                 updateRecipesAndUI();
//             });
//             tagElem.appendChild(removeBtn);
//             tagsContainer.appendChild(tagElem);
//         });
//     });
// }


// // ----------------------
// // Filtrage des recettes selon les tags
// // ----------------------
// function filterRecipes() {
//     return recipes.filter(recipe => {
//         // Recherche principale (dans nom, description, ou ingrédients)
//         if (mainSearch.length >= 3) {
//             const inName = recipe.name.toLowerCase().includes(mainSearch);
//             const inDesc = recipe.description.toLowerCase().includes(mainSearch);
//             const inIngredients = recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(mainSearch));
//             if (!inName && !inDesc && !inIngredients) return false;
//         }
//         // Ingrédients tags
//         const recipeIngredients = recipe.ingredients.map(i => i.ingredient.toLowerCase());
//         if (selectedTags.ingredients.length > 0 &&
//             !selectedTags.ingredients.every(tag => recipeIngredients.includes(tag.toLowerCase()))
//         ) return false;
//         // Appareils tags
//         if (selectedTags.appliances.length > 0 &&
//             !selectedTags.appliances.every(tag => recipe.appliance && recipe.appliance.toLowerCase() === tag.toLowerCase())
//         ) return false;
//         // Ustensiles tags
//         const recipeUstensils = recipe.ustensils.map(u => u.toLowerCase());
//         if (selectedTags.ustensils.length > 0 &&
//             !selectedTags.ustensils.every(tag => recipeUstensils.includes(tag.toLowerCase()))
//         ) return false;
//         return true;
//     });
// }


// // ----------------------
// // Affichage des recettes filtrées
// // ----------------------
// function renderRecipes(filteredRecipes) {
//     const container = document.querySelector('.recipes-cards-container');
//     container.innerHTML = '';
//     if (filteredRecipes.length === 0) {
//         container.innerHTML = '<div class="alert alert-warning">Aucune recette trouvée.</div>';
//         updateRecipesCount(0);
//         return;
//     }
//     filteredRecipes.map(r => new Recipe(r)).forEach(r => {
//         container.appendChild(r.toCardElement());
//     });
//     updateRecipesCount(filteredRecipes.length);
// }

// function updateRecipesCount(count) {
//     const countSpan = document.getElementById('recipes-count');
//     countSpan.textContent = `${count} recette${count > 1 ? 's' : ''}`;
// }

// // ----------------------
// // Dropdown dynamique + filtrage live
// // ----------------------
// let allDropdownOptions = {
//     ingredients: [],
//     appliances: [],
//     ustensils: []
// };

// function getUniqueSorted(array) {
//     return Array.from(new Set(array)).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
// }

// function fillDropdownsFromRecipes(recipesList) {
//     // 1. Ingrédients
//     const ingredientsSet = new Set();
//     recipesList.forEach(recipe => {
//         recipe.ingredients.forEach(ing => {
//             if (ing.ingredient) ingredientsSet.add(ing.ingredient.trim());
//         });
//     });
//     const ingredients = getUniqueSorted(Array.from(ingredientsSet));
//     // 2. Appareils
//     const appliancesSet = new Set();
//     recipesList.forEach(recipe => {
//         if (recipe.appliance) appliancesSet.add(recipe.appliance.trim());
//     });
//     const appliances = getUniqueSorted(Array.from(appliancesSet));
//     // 3. Ustensiles
//     const ustensilsSet = new Set();
//     recipesList.forEach(recipe => {
//         if (Array.isArray(recipe.ustensils)) {
//             recipe.ustensils.forEach(u => {
//                 if (u) ustensilsSet.add(u.trim());
//             });
//         }
//     });
//     const ustensils = getUniqueSorted(Array.from(ustensilsSet));
//     allDropdownOptions.ingredients = ingredients;
//     allDropdownOptions.appliances = appliances;
//     allDropdownOptions.ustensils = ustensils;
//     updateDropdownList('ingredients', ingredients);
//     updateDropdownList('appliances', appliances);
//     updateDropdownList('ustensils', ustensils);
// }

// function updateDropdownList(type, options) {
//     let ul;
//     if (type === 'ingredients') {
//         ul = document.querySelector('#dropdown-ingredients .dropdown-list ul');
//     } else if (type === 'appliances') {
//         ul = document.querySelector('#dropdown-appliances .dropdown-list ul');
//     } else if (type === 'ustensils') {
//         ul = document.querySelector('#dropdown-ustensils .dropdown-list ul');
//     }
//     if (!ul) return;
//     ul.innerHTML = '';
//     options.forEach(opt => {
//         const li = document.createElement('li');
//         li.textContent = opt;
//         li.tabIndex = 0;
//         li.className = 'dropdown-option';
//         // Ajout du gestionnaire de sélection
//         li.addEventListener('click', () => {
//             if (!selectedTags[type].includes(opt)) {
//                 selectedTags[type].push(opt);
//                 updateRecipesAndUI();
//             }
//         });
//         ul.appendChild(li);
//     });
// }

// // Filtrage live dans les dropdowns
// function setupDropdownLiveFilter() {
//     [
//         { type: 'ingredients', selector: '#dropdown-ingredients .dropdown-search input' },
//         { type: 'appliances', selector: '#dropdown-appliances .dropdown-search input' },
//         { type: 'ustensils', selector: '#dropdown-ustensils .dropdown-search input' }
//     ].forEach(({ type, selector }) => {
//         const input = document.querySelector(selector);
//         if (!input) return;
//         input.addEventListener('input', (e) => {
//             const value = e.target.value.trim().toLowerCase();
//             let filtered = allDropdownOptions[type];
//             if (value.length > 0) {
//                 filtered = filtered.filter(opt => opt.toLowerCase().includes(value));
//             }
//             filtered = filtered.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
//             updateDropdownList(type, filtered);
//         });
//         input.addEventListener('blur', () => {
//             if (input.value.trim() === '') updateDropdownList(type, allDropdownOptions[type]);
//         });
//     });
// }

// // Fonction centrale pour tout mettre à jour
// function updateRecipesAndUI() {
//     renderSelectedTags();
//     const filtered = filterRecipes();
//     renderRecipes(filtered);
//     fillDropdownsFromRecipes(filtered.length > 0 ? filtered : recipes);
//     setupDropdownLiveFilter();
// }

// // Initialisation
// function init() {
//     ensureSelectedTagsContainer();
//     fillDropdownsFromRecipes(recipes);
//     setupDropdownLiveFilter();
//     updateRecipesAndUI();
// }

// // Dropdown ouverture/fermeture
// document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
//     const selected = dropdown.querySelector('.dropdown-selected');
//     selected.addEventListener('click', () => {
//         document.querySelectorAll('.custom-dropdown').forEach(d => {
//             if (d !== dropdown) d.classList.remove('open');
//         });
//         dropdown.classList.toggle('open');
//     });
// });
// document.addEventListener('click', (e) => {
//     if (!e.target.closest('.custom-dropdown')) {
//         document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
//     }
// });

// init();


/**************************** */

// app.js

import { recipes } from './recipes.js'; // Doit exister !
import { filterRecipes } from './filter.js';

let mainSearch = '';

const mainInput = document.querySelector('.search-field input');
if (mainInput) {
    mainInput.addEventListener('input', (e) => {
        mainSearch = e.target.value.trim().toLowerCase();
        updateRecipesAndUI();
    });
}

class Recipe {
    constructor({ id, image, name, description, ingredients, time }) {
        this.id = id;
        this.image = image;
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.time = time;
    }

    getIngredientsElements() {
        const container = document.createElement('div');
        container.className = "ingredients-grid";
        const ul1 = document.createElement('ul');
        ul1.className = "list-unstyled mb-2";
        const ul2 = document.createElement('ul');
        ul2.className = "list-unstyled mb-2";

        this.ingredients.forEach((ing, index) => {
            const li = document.createElement('li');
            let txt = document.createElement('strong');
            txt.textContent = ing.ingredient;
            li.appendChild(txt);
            if (ing.quantity !== undefined) {
                li.appendChild(document.createTextNode(`: ${ing.quantity}`));
                if (ing.unit) li.appendChild(document.createTextNode(` ${ing.unit}`));
            }
            (index % 2 === 0 ? ul1 : ul2).appendChild(li);
        });
        container.appendChild(ul1);
        container.appendChild(ul2);
        return container;
    }

    toCardElement() {
        const col = document.createElement('div');
        col.className = "col mb-4";
        const card = document.createElement('div');
        card.className = "card shadow-sm";
        const img = document.createElement('img');
        img.src = `../img/JSON_recipes/${this.image}`;
        img.className = "card-img-top";
        img.alt = this.name;
        const cardBody = document.createElement('div');
        cardBody.className = "card-body d-flex flex-column";
        const title = document.createElement('h5');
        title.className = "card-title ff-anton text-uppercase";
        title.textContent = this.name;
        const subtitle = document.createElement('h6');
        subtitle.className = "card-subtitle mb-2";
        subtitle.textContent = "Recette";
        const desc = document.createElement('p');
        desc.className = "card-text ff-manrope";
        desc.textContent = this.description;
        const ingregientsList = document.createElement('h6');
        ingregientsList.className = "card-subtitle mb-2";
        ingregientsList.textContent = "Ingrédients";
        const ul = this.getIngredientsElements();
        const divTime = document.createElement('div');
        divTime.className = "mt-auto";
        const timeStamp = document.createElement('span');
        timeStamp.className = "timeStamp bg-warning text-dark ff-manrope";
        const timeText = document.createTextNode(` ${this.time}min`);
        timeStamp.appendChild(timeText);
        divTime.appendChild(timeStamp);

        cardBody.appendChild(title);
        cardBody.appendChild(subtitle);
        cardBody.appendChild(desc);
        cardBody.appendChild(ingregientsList);
        cardBody.appendChild(ul);

        card.appendChild(img);
        card.appendChild(divTime);
        card.appendChild(cardBody);

        col.appendChild(card);
        return col;
    }
}

// ----------------------
// Gestion des tags sélectionnés
// ----------------------
let selectedTags = {
    ingredients: [],
    appliances: [],
    ustensils: []
};

// Création dynamique du conteneur pour les tags sélectionnés si absent
function ensureSelectedTagsContainer() {
    if (!document.getElementById('selected-tags')) {
        const tagsDiv = document.createElement('div');
        tagsDiv.id = 'selected-tags';
        tagsDiv.className = 'mb-3';
        // Ajoute juste après la div.filters
        const filters = document.querySelector('.filters');
        filters.parentNode.insertBefore(tagsDiv, filters.nextSibling);
    }
}

// Affichage des tags sélectionnés
function renderSelectedTags() {
    ensureSelectedTagsContainer();
    const tagsContainer = document.getElementById('selected-tags');
    tagsContainer.innerHTML = '';
    ['ingredients', 'appliances', 'ustensils'].forEach(type => {
        selectedTags[type].forEach(tag => {
            const tagElem = document.createElement('span');
            tagElem.className = `tag tag-${type} me-2 mb-2`;
            tagElem.textContent = tag + ' ';
            // Ajout d'une croix pour retirer le tag
            const removeBtn = document.createElement('button');
            removeBtn.className = 'tag-remove btn-close btn-close-white btn-sm ms-1';
            removeBtn.type = 'button';
            removeBtn.ariaLabel = 'Retirer';
            removeBtn.addEventListener('click', () => {
                selectedTags[type] = selectedTags[type].filter(t => t !== tag);
                updateRecipesAndUI();
            });
            tagElem.appendChild(removeBtn);
            tagsContainer.appendChild(tagElem);
        });
    });
}

// ----------------------
// Affichage des recettes filtrées
// ----------------------
// 
function renderRecipes(filteredRecipes) {
    const container = document.querySelector('.recipes-cards-container');
    container.innerHTML = '';
    if (filteredRecipes.length === 0) {
        // Construction du message personnalisé
        let msg;
        if (mainSearch && mainSearch.length > 0) {
            msg = `Aucune recette ne contient "${mainSearch}".Vous pouvez essayer "Tarte aux pommes" ou "Poisson"…`;
        } else {
            msg = `Aucune recette trouvée. Vous pouvez essayer "Tarte aux pommes" ou "Poisson"…`;
        }

        // Création du div d'alerte
        const divAlert = document.createElement('div');
        divAlert.className = 'alert alert-warning width-80';
        divAlert.textContent = msg;

        container.appendChild(divAlert);
        updateRecipesCount(0);
        return;
    }
    filteredRecipes.map(r => new Recipe(r)).forEach(r => {
        container.appendChild(r.toCardElement());
    });
    updateRecipesCount(filteredRecipes.length);
}



// ----------------------
// Dropdown dynamique + filtrage live
// ----------------------
let allDropdownOptions = {
    ingredients: [],
    appliances: [],
    ustensils: []
};

function getUniqueSorted(array) {
    return Array.from(new Set(array)).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
}

function fillDropdownsFromRecipes(recipesList) {
    // 1. Ingrédients
    const ingredientsSet = new Set();
    recipesList.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
            if (ing.ingredient) ingredientsSet.add(ing.ingredient.trim());
        });
    });
    const ingredients = getUniqueSorted(Array.from(ingredientsSet));
    // 2. Appareils
    const appliancesSet = new Set();
    recipesList.forEach(recipe => {
        if (recipe.appliance) appliancesSet.add(recipe.appliance.trim());
    });
    const appliances = getUniqueSorted(Array.from(appliancesSet));
    // 3. Ustensiles
    const ustensilsSet = new Set();
    recipesList.forEach(recipe => {
        if (Array.isArray(recipe.ustensils)) {
            recipe.ustensils.forEach(u => {
                if (u) ustensilsSet.add(u.trim());
            });
        }
    });
    const ustensils = getUniqueSorted(Array.from(ustensilsSet));
    allDropdownOptions.ingredients = ingredients;
    allDropdownOptions.appliances = appliances;
    allDropdownOptions.ustensils = ustensils;
    updateDropdownList('ingredients', ingredients);
    updateDropdownList('appliances', appliances);
    updateDropdownList('ustensils', ustensils);
}

function updateDropdownList(type, options) {
    let ul;
    if (type === 'ingredients') {
        ul = document.querySelector('#dropdown-ingredients .dropdown-list ul');
    } else if (type === 'appliances') {
        ul = document.querySelector('#dropdown-appliances .dropdown-list ul');
    } else if (type === 'ustensils') {
        ul = document.querySelector('#dropdown-ustensils .dropdown-list ul');
    }
    if (!ul) return;
    ul.innerHTML = '';
    options.forEach(opt => {
        const li = document.createElement('li');
        li.textContent = opt;
        li.tabIndex = 0;
        li.className = 'dropdown-option';
        // Ajout du gestionnaire de sélection
        li.addEventListener('click', () => {
            if (!selectedTags[type].includes(opt)) {
                selectedTags[type].push(opt);
                updateRecipesAndUI();
            }
        });
        ul.appendChild(li);
    });
}

// Filtrage live dans les dropdowns
function setupDropdownLiveFilter() {
    [
        { type: 'ingredients', selector: '#dropdown-ingredients .dropdown-search input' },
        { type: 'appliances', selector: '#dropdown-appliances .dropdown-search input' },
        { type: 'ustensils', selector: '#dropdown-ustensils .dropdown-search input' }
    ].forEach(({ type, selector }) => {
        const input = document.querySelector(selector);
        if (!input) return;
        input.addEventListener('input', (e) => {
            const value = e.target.value.trim().toLowerCase();
            let filtered = allDropdownOptions[type];
            if (value.length > 0) {
                filtered = filtered.filter(opt => opt.toLowerCase().includes(value));
            }
            filtered = filtered.sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
            updateDropdownList(type, filtered);
        });
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') updateDropdownList(type, allDropdownOptions[type]);
        });
    });
}


let prevSelectedTags = {
    ingredients: [],
    appliances: [],
    ustensils: []
  };
  let prevMainSearch = "";


// // Fonction centrale pour tout mettre à jour
// function updateRecipesAndUI() {
//     renderSelectedTags();
//     // Utilise la fonction importée depuis filters.js
//     const filtered = filterRecipes(recipes, selectedTags, mainSearch);
//     renderRecipes(filtered);
//     fillDropdownsFromRecipes(filtered.length > 0 ? filtered : recipes);
//     setupDropdownLiveFilter();
// }

//Fonction centrale pour tout mettre à jour
function updateRecipesAndUI() {
    renderSelectedTags();

    // Appelle filterRecipes en passant aussi la mémoire des états précédents
    const filtered = filterRecipes(recipes, selectedTags, mainSearch, prevSelectedTags, prevMainSearch);

    renderRecipes(filtered);
    fillDropdownsFromRecipes(filtered.length > 0 ? filtered : recipes);
    setupDropdownLiveFilter();

    // Mets à jour les états précédents pour le prochain appel
    // Profondeur limitée ici, adapte selon format réel de selectedTags
    prevSelectedTags = {
        ingredients: [...selectedTags.ingredients],
        appliances: [...selectedTags.appliances],
        ustensils: [...selectedTags.ustensils],
    };
    prevMainSearch = mainSearch;
}


// Initialisation
function init() {
    ensureSelectedTagsContainer();
    fillDropdownsFromRecipes(recipes);
    setupDropdownLiveFilter();
    updateRecipesAndUI();
}

// Dropdown ouverture/fermeture
document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
    const selected = dropdown.querySelector('.dropdown-selected');
    selected.addEventListener('click', () => {
        document.querySelectorAll('.custom-dropdown').forEach(d => {
            if (d !== dropdown) d.classList.remove('open');
        });
        dropdown.classList.toggle('open');
    });
});
document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
        document.querySelectorAll('.custom-dropdown').forEach(d => d.classList.remove('open'));
    }
});

init();
