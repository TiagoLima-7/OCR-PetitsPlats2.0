// filters.js

export function filterRecipes(recipes, selectedTags, mainSearch) {
    console.time("filterRecipes");
    const result = [];
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        let matches = true;

        // 1. Recherche principale dans nom, description, ou ingrédients
        if (mainSearch.length >= 3) {
            const search = mainSearch;
            let inName = recipe.name.toLowerCase().includes(search);
            let inDesc = recipe.description.toLowerCase().includes(search);
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
            // Construire une liste d'ingrédients normalisés en minuscule
            const recipeIngredients = [];
            for (let k = 0; k < recipe.ingredients.length; k++) {
                recipeIngredients.push(recipe.ingredients[k].ingredient.toLowerCase());
            }
            // Vérifier chaque tag
            let allIng = true, m = 0;
            while (allIng && m < selectedTags.ingredients.length) {
                let tag = selectedTags.ingredients[m].toLowerCase();
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
                let tag = selectedTags.appliances[n].toLowerCase();
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
            // Construire une liste d'ustensiles normalisés en minuscule
            const recipeUstens = [];
            for (let k = 0; k < recipe.ustensils.length; k++) {
                recipeUstens.push(recipe.ustensils[k].toLowerCase());
            }
            let allUst = true, p = 0;
            while (allUst && p < selectedTags.ustensils.length) {
                let tag = selectedTags.ustensils[p].toLowerCase();
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
    console.timeEnd("filterRecipes");
    return result;
}

