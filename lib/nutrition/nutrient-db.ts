// Nutrition database and calculation utilities
interface FoodNutrient {
  name: string
  calories: number // per 100g
  protein: number // g per 100g
  carbs: number // g per 100g
  fat: number // g per 100g
  iron: number // mg per 100g
  vitaminC: number // mg per 100g
  calcium: number // mg per 100g
  magnesium: number // mg per 100g
}

// Mock nutrition database - in production, use USDA FoodData Central API
const nutritionDB: Record<string, FoodNutrient> = {
  spinach: {
    name: "Spinach",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    iron: 2.7,
    vitaminC: 28.1,
    calcium: 99,
    magnesium: 79,
  },
  chicken_breast: {
    name: "Chicken Breast",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    iron: 0.7,
    vitaminC: 0,
    calcium: 15,
    magnesium: 29,
  },
  brown_rice: {
    name: "Brown Rice",
    calories: 111,
    protein: 2.6,
    carbs: 23,
    fat: 0.9,
    iron: 0.4,
    vitaminC: 0,
    calcium: 10,
    magnesium: 43,
  },
  salmon: {
    name: "Salmon",
    calories: 208,
    protein: 25.4,
    carbs: 0,
    fat: 12.4,
    iron: 0.3,
    vitaminC: 0,
    calcium: 9,
    magnesium: 30,
  },
  lentils: {
    name: "Lentils",
    calories: 116,
    protein: 9,
    carbs: 20,
    fat: 0.4,
    iron: 3.3,
    vitaminC: 1.5,
    calcium: 19,
    magnesium: 36,
  },
}

export function calculateNutrients(foods: string[], portions: number[] = []) {
  const totalNutrients = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    iron: 0,
    vitaminC: 0,
    calcium: 0,
    magnesium: 0,
  }

  foods.forEach((food, index) => {
    const foodData = nutritionDB[food.toLowerCase().replace(" ", "_")]
    if (foodData) {
      const portion = portions[index] || 100 // default 100g
      const multiplier = portion / 100

      totalNutrients.calories += foodData.calories * multiplier
      totalNutrients.protein += foodData.protein * multiplier
      totalNutrients.carbs += foodData.carbs * multiplier
      totalNutrients.fat += foodData.fat * multiplier
      totalNutrients.iron += foodData.iron * multiplier
      totalNutrients.vitaminC += foodData.vitaminC * multiplier
      totalNutrients.calcium += foodData.calcium * multiplier
      totalNutrients.magnesium += foodData.magnesium * multiplier
    }
  })

  return totalNutrients
}

export function getFoodNutrients(foodName: string): FoodNutrient | null {
  return nutritionDB[foodName.toLowerCase().replace(" ", "_")] || null
}

export function searchFoods(query: string): FoodNutrient[] {
  const results = Object.values(nutritionDB).filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))
  return results
}
