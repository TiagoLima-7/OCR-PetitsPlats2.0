export function filterRecipes(recipes, selectedTags, mainSearch) {
    console.time("filterRecipes");
    const filtered = recipes.filter(recipe => {
        // Recherche principale (dans nom, description, ou ingrédients)
        if (mainSearch.length >= 3) {
            const inName = recipe.name.toLowerCase().includes(mainSearch);
            const inDesc = recipe.description.toLowerCase().includes(mainSearch);
            const inIngredients = recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(mainSearch));
            if (!inName && !inDesc && !inIngredients) return false;
        }
        // Ingrédients tags
        const recipeIngredients = recipe.ingredients.map(i => i.ingredient.toLowerCase());
        if (selectedTags.ingredients.length > 0 &&
            !selectedTags.ingredients.every(tag => recipeIngredients.includes(tag.toLowerCase()))
        ) return false;
        // Appareils tags
        if (selectedTags.appliances.length > 0 &&
            !selectedTags.appliances.every(tag => recipe.appliance && recipe.appliance.toLowerCase() === tag.toLowerCase())
        ) return false;
        // Ustensiles tags
        const recipeUstensils = recipe.ustensils.map(u => u.toLowerCase());
        if (selectedTags.ustensils.length > 0 &&
            !selectedTags.ustensils.every(tag => recipeUstensils.includes(tag.toLowerCase()))
        ) return false;
        return true;
    });
    console.timeEnd("filterRecipes");
    return filtered;
}