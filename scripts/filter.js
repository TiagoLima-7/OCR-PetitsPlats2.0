// let totalSteps = 0;

// // On stocke la liste filtrée courante (initialisée à toutes recettes)
// let currentFilteredList = [];

// export function filterRecipes(
//   recipes,
//   selectedTags,
//   mainSearch,
//   prevSelectedTags,
//   prevMainSearch
// ) {
//   // Initialisation au premier appel
//   if (currentFilteredList.length === 0) {
//     currentFilteredList = [...recipes];
//   }

//   // Fonctions utilitaires pour comparer deux listes de tags
//   function tagsAddedOrRemoved(currentTags, prevTags) {
//     const currentSet = new Set(currentTags.map(t => t.toLowerCase()));
//     const prevSet = new Set(prevTags.map(t => t.toLowerCase()));

//     if (currentSet.size !== prevSet.size) return true;

//     for (const tag of currentSet) {
//       if (!prevSet.has(tag)) return true;
//     }
//     return false;
//   }

//   // Détecter si un filtre a été ajouté ou retiré
//   const ingredientChanged = tagsAddedOrRemoved(selectedTags.ingredients, prevSelectedTags.ingredients);
//   const ustensilsChanged = tagsAddedOrRemoved(selectedTags.ustensils, prevSelectedTags.ustensils);
//   const appliancesChanged = tagsAddedOrRemoved(selectedTags.appliances, prevSelectedTags.appliances);
//   const mainSearchChanged = (mainSearch.trim() !== prevMainSearch.trim());

//   // Est-ce un ajout ou une suppression ?  
//   // On compare la taille des tags pour simplifier la détection (on peut affiner)
//   function isFilterAdded(currentTags, prevTags) {
//     return currentTags.length > prevTags.length;
//   }

//   let isAnyFilterAdded =
//     (ingredientChanged && isFilterAdded(selectedTags.ingredients, prevSelectedTags.ingredients)) ||
//     (ustensilsChanged && isFilterAdded(selectedTags.ustensils, prevSelectedTags.ustensils)) ||
//     (appliancesChanged && isFilterAdded(selectedTags.appliances, prevSelectedTags.appliances)) ||
//     mainSearchChanged; // On considère un changement dans la recherche comme un ajout (filtrage plus restrictif)

//   let noFilter =
//     selectedTags.ingredients.length === 0 &&
//     selectedTags.ustensils.length === 0 &&
//     selectedTags.appliances.length === 0 &&
//     (!mainSearch || mainSearch.trim() === "");

//   // Cas où aucun filtre actif -> réinitialiser complètement
//   if (noFilter) {
//     totalSteps = 0;
//     currentFilteredList = [...recipes];
//     console.log("Aucun filtre actif, compteur remis à zéro");
//     return currentFilteredList;
//   }

//   let baseArray;

//   if (isAnyFilterAdded) {
//     // Filtrer sur la liste actuelle (plus restreinte)
//     baseArray = currentFilteredList;
//     console.log("Nouveau filtre ajouté - filtrage sur la liste filtrée courante");
//   } else {
//     // Filtre retiré : on repart de l'original pour re-filtrer avec les autres filtres restants
//     baseArray = recipes;
//     console.log("Filtre retiré - repart de la liste complète");
//   }

//   let stepsThisCall = 0;
//   const result = [];

//   for (let i = 0; i < baseArray.length; i++) {
//     stepsThisCall++;
//     const recipe = baseArray[i];
//     let matches = true;

//     // 1. Recherche principale (nom, description, ingrédients)
//     if (mainSearch.length >= 3) {
//       const search = mainSearch.toLowerCase();
//       const inName = recipe.name.toLowerCase().includes(search);
//       const inDesc = recipe.description.toLowerCase().includes(search);
//       let inIngredients = false;
//       let j = 0;
//       while (!inIngredients && j < recipe.ingredients.length) {
//         if (recipe.ingredients[j].ingredient.toLowerCase().includes(search)) {
//           inIngredients = true;
//         }
//         j++;
//       }
//       if (!inName && !inDesc && !inIngredients) {
//         matches = false;
//       }
//     }

//     // 2. Tags ingrédients
//     if (matches && selectedTags.ingredients.length > 0) {
//       const recipeIngredients = recipe.ingredients.map(ing => ing.ingredient.toLowerCase());
//       for (const tag of selectedTags.ingredients) {
//         if (!recipeIngredients.includes(tag.toLowerCase())) {
//           matches = false;
//           break;
//         }
//       }
//     }

//     // 3. Tags appareils
//     if (matches && selectedTags.appliances.length > 0) {
//       for (const tag of selectedTags.appliances) {
//         if (!(recipe.appliance && recipe.appliance.toLowerCase() === tag.toLowerCase())) {
//           matches = false;
//           break;
//         }
//       }
//     }

//     // 4. Tags ustensiles
//     if (matches && selectedTags.ustensils.length > 0) {
//       const recipeUstens = recipe.ustensils.map(u => u.toLowerCase());
//       for (const tag of selectedTags.ustensils) {
//         if (!recipeUstens.includes(tag.toLowerCase())) {
//           matches = false;
//           break;
//         }
//       }
//     }

//     if (matches) {
//       result.push(recipe);
//     }
//   }

//   totalSteps += stepsThisCall;
//   currentFilteredList = result;

//   console.log("Nombre d'étapes (recettes testées) pour cet appel :", stepsThisCall);
//   console.log("Nombre d'étapes cumulées :", totalSteps);

//   return result;
// }




let totalSteps = 0;

// On stocke la liste filtrée courante (initialisée à toutes recettes)
let currentFilteredList = [];

// Utilitaires
const normalize = (str = "") => String(str).toLowerCase().trim();

//Suppression des balises HTML
const stripHtmlTags = (s = "") =>
  (s || "").replace(/<\/?[^>]+(>|$)/g, "");

//Sanitize complèt de la recherche: Supprime les balises HTML et normalise
const sanitizeSearch = (s = "") => normalize(stripHtmlTags(s));

const tagsChanged = (current = [], prev = []) => {
  const currentSet = new Set(current.map(normalize));
  const prevSet = new Set(prev.map(normalize));
  return (
    currentSet.size !== prevSet.size ||
    [...currentSet].some(tag => !prevSet.has(tag))
  );
};

const isFilterAdded = (current = [], prev = []) => current.length > prev.length;

// Ici : on considère la recherche principale **active** seulement si length >= 3
const noFilterActive = (tags = { ingredients: [], ustensils: [], appliances: [] }, search = "") =>
  (tags.ingredients || []).length === 0 &&
  (tags.ustensils || []).length === 0 &&
  (tags.appliances || []).length === 0 &&
  (typeof search !== "string" || search.trim().length < 3);

// Vérifie si une recette correspond aux filtres (pures fonctions)
const matchesRecipe = (recipe, { tags = { ingredients: [], ustensils: [], appliances: [] }, search = "" }) => {
  const searchLower = normalize(search);

  // 1. Recherche principale : n'est prise en compte que si searchLower.length >= 3
  const matchesSearch =
    searchLower.length < 3 ||
    normalize(recipe.name).includes(searchLower) ||
    normalize(recipe.description).includes(searchLower) ||
    (Array.isArray(recipe.ingredients) &&
      recipe.ingredients.some(ing => normalize(ing.ingredient).includes(searchLower)));

  if (!matchesSearch) return false;

  // 2. Ingrédients (tous les tags ingrédients doivent être présents)
  const recipeIngredients = (recipe.ingredients || []).map(i => normalize(i.ingredient));
  const matchesIngredients = (tags.ingredients || []).every(tag => recipeIngredients.includes(normalize(tag)));
  if (!matchesIngredients) return false;

  // 3. Appareils (tous les tags appareils doivent correspondre)
  const matchesAppliances = (tags.appliances || []).every(tag => normalize(recipe.appliance || "") === normalize(tag));
  if (!matchesAppliances) return false;

  // 4. Ustensiles (tous les tags ustensiles doivent être présents)
  const recipeUstens = (recipe.ustensils || []).map(normalize);
  const matchesUstensils = (tags.ustensils || []).every(tag => recipeUstens.includes(normalize(tag)));
  if (!matchesUstensils) return false;

  return true;
};

// Fonction principale
export function filterRecipes(
  recipes,
  selectedTags,
  mainSearch,
  prevSelectedTags,
  prevMainSearch
) {
  // Défauts sûrs si undefined
  const tags = selectedTags || { ingredients: [], ustensils: [], appliances: [] };
  const prevTags = prevSelectedTags || { ingredients: [], ustensils: [], appliances: [] };
  const currSearch = sanitizeSearch(typeof mainSearch === "string" ? mainSearch.trim() : "");
  const prevSearch = sanitizeSearch(typeof prevMainSearch === "string" ? prevMainSearch.trim() : "");

  // Initialisation au premier appel
  if (currentFilteredList.length === 0) {
    currentFilteredList = Array.isArray(recipes) ? [...recipes] : [];
  }

  // 1) Si aucun filtre actif (y compris recherche < 3 caractères) -> reset complet
  if (noFilterActive(tags, currSearch)) {
    totalSteps = 0;
    currentFilteredList = Array.isArray(recipes) ? [...recipes] : [];
    console.log("Aucun filtre actif (recherche < 3 & aucun tag), compteur remis à zéro");
    return currentFilteredList;
  }

  // 2) Détection des changements sur tags et recherche
  const ingredientChanged = tagsChanged(tags.ingredients, prevTags.ingredients);
  const ustensilsChanged = tagsChanged(tags.ustensils, prevTags.ustensils);
  const appliancesChanged = tagsChanged(tags.appliances, prevTags.appliances);

  const currLen = currSearch.length;
  const prevLen = prevSearch.length;
  const mainSearchChanged = currSearch !== prevSearch;
  const mainSearchActive = currLen >= 3;
  const mainSearchPrevActive = prevLen >= 3;

  // Cas où la recherche devient active (passe <3 -> >=3) ou est modifiée alors qu'elle est active (>=3 -> >=3)
  const mainSearchBecameActive = mainSearchActive && !mainSearchPrevActive; // passage au seuil des 3 chars
  const mainSearchRefined = mainSearchActive && mainSearchPrevActive && mainSearchChanged; // modif pendant activation
  const mainSearchBecameInactive = !mainSearchActive && mainSearchPrevActive; // on a supprimé la recherche (>=3 -> <3)

  // On ne veut **pas** considérer comme "changement utile" les modifications de la recherche
  // quand elle est restée en dessous de 3 caractères (ex: taper 'a' puis 'ab' doit être ignoré)
  const mainSearchAdded = mainSearchBecameActive || mainSearchRefined;

  // Si rien d'utile n'a changé (ni tags, ni recherche active) -> on retourne l'état courant (pas de recalcul, pas d'incrément)
  const anyTagChanged = ingredientChanged || ustensilsChanged || appliancesChanged;
  if (!anyTagChanged) {
    // recherche non utile : modif mais toujours <3 caractères => on ignore
    if (!mainSearchChanged) {
      // rien n'a changé du tout
      return currentFilteredList;
    }
    if (!mainSearchActive && !mainSearchPrevActive) {
      // recherche modifiée mais restée < 3 caractères à la fois avant et maintenant -> rien à faire
      return currentFilteredList;
    }
  }

  // 3) Déterminer si on filtre sur la liste courante (ajout de filtre) ou sur l'original (suppression)
  const ingredientAdded = ingredientChanged && isFilterAdded(tags.ingredients, prevTags.ingredients);
  const ustensilsAdded = ustensilsChanged && isFilterAdded(tags.ustensils, prevTags.ustensils);
  const appliancesAdded = appliancesChanged && isFilterAdded(tags.appliances, prevTags.appliances);

  const isAnyFilterAdded = ingredientAdded || ustensilsAdded || appliancesAdded || mainSearchAdded;

  // Si la recherche a été désactivée (>=3 -> <3), on considère cela comme suppression de filtre (= repartir de la liste complète)
  const baseArray = isAnyFilterAdded && !mainSearchBecameInactive ? currentFilteredList : recipes;

  console.log(
    isAnyFilterAdded && !mainSearchBecameInactive
      ? "Nouveau filtre ajouté / raffinement - filtrage sur la liste filtrée courante"
      : "Filtre retiré ou re-calcul global - repart de la liste complète"
  );

  // 4) Filtrage (fonctionnel)
  // On calcule le résultat et on incrémente le compteur *seulement* parce qu'on a réellement effectué le filtrage maintenant.
  const stepsThisCall = Array.isArray(baseArray) ? baseArray.length : 0;
  const result = (Array.isArray(baseArray) ? baseArray : [])
    .filter(recipe => matchesRecipe(recipe, { tags, search: currSearch }));

  // Mise à jour du compteur et de la liste courante
  totalSteps += stepsThisCall;
  currentFilteredList = result;

  console.log("Nombre d'étapes (recettes testées) pour cet appel :", stepsThisCall);
  console.log("Nombre d'étapes cumulées :", totalSteps);

  return result;
}
