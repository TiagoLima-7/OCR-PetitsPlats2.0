// compteur persistant entre appels
let totalSteps = 0;

//Utilitaires
const normalize = (str = "") => String(str).toLowerCase().trim();

//Suppresion balises HTML
const stripHtmlTags = (s = "") =>
(s || "").replace(/<\/?[^>]+(>|$)/g, "");

//Sanitize complèet : supprime balises HTMl et normalise
const sanitizeSearch = (s = "") => normalize(stripHtmlTags(s));

export function filterRecipes(recipes, selectedTags, mainSearch) {

  //Nettoyage entrée utilisateur
  const searchClean = sanitizeSearch(typeof mainSearch === "string" ? mainSearch : "");

    // Détection : aucun filtre actif ?
    const noFilter =
        selectedTags.ingredients.length === 0 &&
        selectedTags.ustensils.length === 0 &&
        selectedTags.appliances.length === 0 &&
        (!searchClean || searchClean.trim() === "");

    if (noFilter) {
        totalSteps = 0; // remise à zéro quand pas de filtre actif
        console.log("Aucun filtre actif, compteur remis à zéro");
        // retour direct sans filtrage ni comptage
        return recipes;
    }

    let stepsThisCall = 0;
    const result = [];

    for (let i = 0; i < recipes.length; i++) {
        stepsThisCall++;
        const recipe = recipes[i];
        let matches = true;

        // 1. Recherche principale (nom, description, ingrédients)
        if (mainSearch.length >= 3) {
            
            const inName = recipe.name.toLowerCase().includes(searchClean);
            const inDesc = recipe.description.toLowerCase().includes(searchClean);
            let inIngredients = false;
            let j = 0;
            while (!inIngredients && j < recipe.ingredients.length) {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(searchClean)) {
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
            const recipeIngredients = [];
            for (let k = 0; k < recipe.ingredients.length; k++) {
                recipeIngredients.push(recipe.ingredients[k].ingredient.toLowerCase());
            }
            let allIng = true, m = 0;
            while (allIng && m < selectedTags.ingredients.length) {
                const tag = selectedTags.ingredients[m].toLowerCase();
                if (recipeIngredients.indexOf(tag) === -1) {
                    allIng = false;
                }
                m++;
            }
            if (!allIng) {
                matches = false;
            }
        }

        // 3. Tags appareils
        if (matches && selectedTags.appliances.length > 0) {
            let allAp = true, n = 0;
            while (allAp && n < selectedTags.appliances.length) {
                const tag = selectedTags.appliances[n].toLowerCase();
                if (!(recipe.appliance && recipe.appliance.toLowerCase() === tag)) {
                    allAp = false;
                }
                n++;
            }
            if (!allAp) {
                matches = false;
            }
        }

        // 4. Tags ustensiles
        if (matches && selectedTags.ustensils.length > 0) {
            const recipeUstens = [];
            for (let k = 0; k < recipe.ustensils.length; k++) {
                recipeUstens.push(recipe.ustensils[k].toLowerCase());
            }
            let allUst = true, p = 0;
            while (allUst && p < selectedTags.ustensils.length) {
                const tag = selectedTags.ustensils[p].toLowerCase();
                if (recipeUstens.indexOf(tag) === -1) {
                    allUst = false;
                }
                p++;
            }
            if (!allUst) {
                matches = false;
            }
        }

        if (matches) {
            result.push(recipe);
        }
    }

    totalSteps += stepsThisCall;

    console.log("Nombre d'étapes (recettes testées) pour cet appel :", stepsThisCall);
    console.log("Nombre d'étapes cumulées depuis la dernière réinitialisation :", totalSteps);

    return result;
}
