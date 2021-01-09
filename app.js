const search = document.querySelector("#search");
const submit = document.querySelector("#submit");
const random = document.querySelector("#random");
const mealsEL = document.querySelector("#meals");
const resultHeading = document.querySelector("#result-heading");
const single_mealEL = document.querySelector("#single-meal");

// search meal and fetch API
function searchMeal(e){
    e.preventDefault();

    // clear single meal
    single_mealEL.innerHTML = "";

    const term = search.value;
    console.log(term);

    // Check for Meal
    if(term.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${ term }`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            resultHeading.innerHTML = `<h2>Search Results for '${term}'</h2>`;
            if (data.meals == null) {
                resultHeading.innerHTML = `<h2>No results found for '${term}'</h2>`;
                mealsEL.innerHTML = "";     
            }
            else{
                mealsEL.innerHTML = data.meals.map(meal =>`
                    <div class="meal">
                        <img src="${meal.strMealThumb}" alt="meal.strMeal">
                        <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                        </div>
                    </div>
                `)
                .join('');
            }
        });
        search.value = "";
    }
    else{
        alert("Please enter the Search term")
    }
}

function getRandomMeal(e){

    // clear single meal
    mealsEL.innerHTML = "";
    resultHeading.innerHTML = "";

    // Check for random meal
    
        fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
        .then(res => res.json())
        .then(data => {
           const meal = data.meals[0];
           addMealToDom(meal);
        });
        search.value = "";
    
    
}

function getMealById(mealID){
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
    .then(res => res.json())
    .then(data => {
        const meal = data.meals[0];

        addMealToDom(meal);
    })
}

function addMealToDom(meal){
    const ingredients = []
    for(let i=1; i<= 20; i++){
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        }
        else{
            break;
        }
    }
    single_mealEL.innerHTML = `
        <div class="single-meal">
            <h1>${meal.strMeal}</h1>
            <img src="${meal.strMealThumb}" alt= "${meal.strMeal}" />
            <div class="single-meal-info">
                ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
                ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
            </div>
            <div class="main">
            <h2>Ingredients</h2>
            <ul>
            ${ingredients.map(ing => `<li>${ing}</li>`).join("")}
            </ul>
            <h2>Instructions</h2>
            <p>${meal.strInstructions}</p>
            </div>

        </div>
    `
}

// event listeners

submit.addEventListener('submit', searchMeal);



mealsEL.addEventListener("click", e => {
    const mealInfo = e.path.find(item => {
        // console.log(item);  
        if(item.classList) {
            return item.classList.contains("meal-info");
        }
        else{
            return false;
        }
    });

    if(mealInfo){
        const mealID = mealInfo.getAttribute("data-mealid");
        getMealById(mealID)
    }


})

random.addEventListener('click', getRandomMeal);
