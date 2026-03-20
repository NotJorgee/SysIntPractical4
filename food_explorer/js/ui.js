export function switchTab(tabName) {
    document.getElementById('searchSection').classList.toggle('hidden', tabName !== 'search');
    document.getElementById('favoritesSection').classList.toggle('hidden', tabName === 'favorites');
    document.getElementById('tab-search').classList.toggle('active', tabName === 'search');
    document.getElementById('tab-favorites').classList.toggle('active', tabName === 'favorites');
}

export function renderMeals(meals, containerId, mode, actionCallback) {
    const container = document.getElementById(containerId);
    container.innerHTML = meals.length === 0 ? '<p class="empty-message">No meals found.</p>' : '';

    meals.forEach(meal => {
        const id = meal.idMeal || meal.meal_id;
        const name = meal.strMeal || meal.meal_name;
        const category = meal.strCategory || meal.meal_category;
        const thumb = meal.strMealThumb || meal.meal_thumb;

        const card = document.createElement('div');
        card.className = 'card';
        
        const btnText = mode === 'search' ? '❤️ Save to Favorites' : '🗑️ Remove';
        const btnClass = mode === 'search' ? 'btn-save' : 'btn-remove';

        card.innerHTML = `
            <img src="${thumb}" alt="${name}">
            <div class="card-content">
                <div>
                    <h3 class="card-title">${name}</h3>
                    <p class="card-category">${category}</p>
                </div>
                <button class="${btnClass}">${btnText}</button>
            </div>
        `;

        card.querySelector('button').addEventListener('click', () => actionCallback(meal));
        container.appendChild(card);
    });
}