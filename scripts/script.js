//UPDATE RECIPES COUNT
function updateRecipesCount() {
  // Sélectionne tous les enfants visibles (recettes affichées)
  const container = document.querySelector('.recipes-cards-container');
  // On suppose que chaque recette est dans un élément direct (ex: .card, .recipe-card, etc.)
  console.log(container.children.length)
  //   const visibleRecipes = Array.from(container.children)
//       .filter(child => child.offsetParent !== null); // visible à l'écran

//   // Met à jour le texte du span
   const countSpan = document.getElementById('recipes-count');
   countSpan.textContent = container.children.length + " Recettes";
 }


