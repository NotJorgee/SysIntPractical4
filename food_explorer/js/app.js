import { searchMealsDB, getFavoritesDB, saveFavoriteDB, removeFavoriteDB } from './api.js';
import { switchTab, renderMeals } from './ui.js';

// --- AUTHENTICATION GUARD ---
let currentUserId = localStorage.getItem('food_user_id');

// If there is no user ID, redirect to the login page immediately
if (!currentUserId) {
    window.location.href = 'index.html';
}

// --- EVENT LISTENERS ---
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('food_user_id');
    window.location.href = 'index.html'; // Kick them back to login
});

document.getElementById('tab-search').addEventListener('click', () => switchTab('search'));
document.getElementById('tab-favorites').addEventListener('click', () => {
    switchTab('favorites');
    loadFavorites();
});

document.getElementById('searchBtn').addEventListener('click', handleSearch);
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// --- CORE FUNCTIONS ---
async function handleSearch() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;
    
    document.getElementById('searchResults').innerHTML = '<p class="empty-message">Searching...</p>';
    const meals = await searchMealsDB(query);
    renderMeals(meals, 'searchResults', 'search', handleSaveFavorite);
}

async function loadFavorites() {
    document.getElementById('favoritesList').innerHTML = '<p class="empty-message">Loading favorites...</p>';
    const favorites = await getFavoritesDB(currentUserId);
    renderMeals(favorites, 'favoritesList', 'favorites', handleRemoveFavorite);
}

async function handleSaveFavorite(meal) {
    const success = await saveFavoriteDB(meal, currentUserId);
    if (success) {
        alert(`${meal.strMeal} saved to favorites!`);
    } else {
        alert('Could not save. It might already be in your favorites!');
    }
}

async function handleRemoveFavorite(meal) {
    const mealId = meal.idMeal || meal.meal_id;
    const success = await removeFavoriteDB(mealId, currentUserId);
    if (success) {
        loadFavorites(); 
    }
}