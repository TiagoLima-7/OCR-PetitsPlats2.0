//UPDATE RECIPES COUNT
function updateRecipesCount() {
  // Sélectionne tous les enfants visibles (recettes affichées)
  const container = document.querySelector('.recipes-cards-container');
  // On suppose que chaque recette est dans un élément direct (ex: .card, .recipe-card, etc.)
  const visibleRecipes = Array.from(container.children)
      .filter(child => child.offsetParent !== null); // visible à l'écran

  // Met à jour le texte du span
  const countSpan = document.getElementById('recipes-count');
  countSpan.textContent = visibleRecipes.length + (visibleRecipes.length > 1 ? ' recettes' : ' recette');
}


