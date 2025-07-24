let totalSteps = 0;

// On stocke la liste filtrée courante (initialisée à toutes recettes)
let currentFilteredList = [];

export function filterRecipes(
  recipes,
  selectedTags,
  mainSearch,
  prevSelectedTags,
  prevMainSearch
) {
  // Initialisation au premier appel
  if (currentFilteredList.length === 0) {
    currentFilteredList = [...recipes];
  }

  // Fonctions utilitaires pour comparer deux listes de tags
  function tagsAddedOrRemoved(currentTags, prevTags) {
    const currentSet = new Set(currentTags.map(t => t.toLowerCase()));
    const prevSet = new Set(prevTags.map(t => t.toLowerCase()));

    if (currentSet.size !== prevSet.size) return true;

    for (const tag of currentSet) {
      if (!prevSet.has(tag)) return true;
    }
    return false;
  }

  // Détecter si un filtre a été ajouté ou retiré
  const ingredientChanged = tagsAddedOrRemoved(selectedTags.ingredients, prevSelectedTags.ingredients);
  const ustensilsChanged = tagsAddedOrRemoved(selectedTags.ustensils, prevSelectedTags.ustensils);
  const appliancesChanged = tagsAddedOrRemoved(selectedTags.appliances, prevSelectedTags.appliances);
  const mainSearchChanged = (mainSearch.trim() !== prevMainSearch.trim());

  // Est-ce un ajout ou une suppression ?  
  // On compare la taille des tags pour simplifier la détection (on peut affiner)
  function isFilterAdded(currentTags, prevTags) {
    return currentTags.length > prevTags.length;
  }

  let isAnyFilterAdded =
    (ingredientChanged && isFilterAdded(selectedTags.ingredients, prevSelectedTags.ingredients)) ||
    (ustensilsChanged && isFilterAdded(selectedTags.ustensils, prevSelectedTags.ustensils)) ||
    (appliancesChanged && isFilterAdded(selectedTags.appliances, prevSelectedTags.appliances)) ||
    mainSearchChanged; // On considère un changement dans la recherche comme un ajout (filtrage plus restrictif)

  let noFilter =
    selectedTags.ingredients.length === 0 &&
    selectedTags.ustensils.length === 0 &&
    selectedTags.appliances.length === 0 &&
    (!mainSearch || mainSearch.trim() === "");

  // Cas où aucun filtre actif -> réinitialiser complètement
  if (noFilter) {
    totalSteps = 0;
    currentFilteredList = [...recipes];
    console.log("Aucun filtre actif, compteur remis à zéro");
    return currentFilteredList;
  }

  let baseArray;

  if (isAnyFilterAdded) {
    // Filtrer sur la liste actuelle (plus restreinte)
    baseArray = currentFilteredList;
    console.log("Nouveau filtre ajouté - filtrage sur la liste filtrée courante");
  } else {
    // Filtre retiré : on repart de l'original pour re-filtrer avec les autres filtres restants
    baseArray = recipes;
    console.log("Filtre retiré - repart de la liste complète");
  }

  let stepsThisCall = 0;
  const result = [];

  for (let i = 0; i < baseArray.length; i++) {
    stepsThisCall++;
    const recipe = baseArray[i];
    let matches = true;

    // 1. Recherche principale (nom, description, ingrédients)
    if (mainSearch.length >= 3) {
      const search = mainSearch.toLowerCase();
      const inName = recipe.name.toLowerCase().includes(search);
      const inDesc = recipe.description.toLowerCase().includes(search);
      let inIngredients = false;
      let j = 0;
      while (!inIngredients && j < recipe.ingredients.length) {
        if (recipe.ingredients[j].ingredient.toLowerCase().includes(search)) {
          inIngredients = true;
        }
        j++;
      }
      if (!inName && !inDesc && !inIngredients) {
        matches = false;
      }
    }

    // 2. Tags ingrédients
    if (matches && selectedTags.ingredients.length > 0) {
      const recipeIngredients = recipe.ingredients.map(ing => ing.ingredient.toLowerCase());
      for (const tag of selectedTags.ingredients) {
        if (!recipeIngredients.includes(tag.toLowerCase())) {
          matches = false;
          break;
        }
      }
    }

    // 3. Tags appareils
    if (matches && selectedTags.appliances.length > 0) {
      for (const tag of selectedTags.appliances) {
        if (!(recipe.appliance && recipe.appliance.toLowerCase() === tag.toLowerCase())) {
          matches = false;
          break;
        }
      }
    }

    // 4. Tags ustensiles
    if (matches && selectedTags.ustensils.length > 0) {
      const recipeUstens = recipe.ustensils.map(u => u.toLowerCase());
      for (const tag of selectedTags.ustensils) {
        if (!recipeUstens.includes(tag.toLowerCase())) {
          matches = false;
          break;
        }
      }
    }

    if (matches) {
      result.push(recipe);
    }
  }

  totalSteps += stepsThisCall;
  currentFilteredList = result;

  console.log("Nombre d'étapes (recettes testées) pour cet appel :", stepsThisCall);
  console.log("Nombre d'étapes cumulées :", totalSteps);

  return result;
}