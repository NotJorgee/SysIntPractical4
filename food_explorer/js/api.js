const MEALDB_API = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const BACKEND_API = '/food-explorer/backend/api.php'; 

export async function loginUserDB(username, password) {
    const response = await fetch(`${BACKEND_API}?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    return await response.json();
}

export async function searchMealsDB(query) {
    const response = await fetch(`${MEALDB_API}${query}`);
    const data = await response.json();
    return data.meals || [];
}

export async function getFavoritesDB(userId) {
    const response = await fetch(`${BACKEND_API}?action=get_favorites&user_id=${userId}`);
    return await response.json();
}

export async function saveFavoriteDB(meal, userId) {
    const response = await fetch(`${BACKEND_API}?action=save_favorite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: userId,
            meal_id: meal.idMeal,
            meal_name: meal.strMeal,
            meal_category: meal.strCategory,
            meal_area: meal.strArea,
            meal_thumb: meal.strMealThumb
        })
    });
    return response.ok;
}

export async function removeFavoriteDB(mealId, userId) {
    const response = await fetch(`${BACKEND_API}?action=delete_favorite&id=${mealId}&user_id=${userId}`, {
        method: 'DELETE'
    });
    return response.ok;
}