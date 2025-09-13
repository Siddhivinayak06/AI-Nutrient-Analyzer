// Ayurvedic nutrition utilities
export function suggestAyurvedicModifications(dosha: string, nutrients: any): string[] {
  const suggestions: string[] = []

  switch (dosha?.toUpperCase()) {
    case "VATA":
      suggestions.push(
        "Favor warm, cooked foods over raw foods",
        "Add ghee and warming spices like ginger and cinnamon",
        "Eat regular meals at consistent times",
        "Include sweet, sour, and salty tastes",
        "Avoid excessive cold or dry foods",
      )
      break

    case "PITTA":
      suggestions.push(
        "Favor cooling foods like cucumber and mint",
        "Reduce spicy, oily, and acidic foods",
        "Include sweet, bitter, and astringent tastes",
        "Eat moderate portions at regular times",
        "Avoid excessive heat-generating foods",
      )
      break

    case "KAPHA":
      suggestions.push(
        "Favor light, dry, and warm foods",
        "Include pungent, bitter, and astringent tastes",
        "Reduce heavy, oily, and sweet foods",
        "Eat smaller portions and avoid overeating",
        "Include stimulating spices like black pepper and turmeric",
      )
      break

    default:
      suggestions.push("Follow a balanced approach suitable for your constitution")
  }

  // Add specific nutrient-based Ayurvedic advice
  if (nutrients.iron < 10) {
    suggestions.push("Include iron-rich foods like sesame seeds and dark leafy greens")
  }

  if (nutrients.vitaminC < 30) {
    suggestions.push("Add amla (Indian gooseberry) for natural vitamin C")
  }

  return suggestions
}

export function getDoshaFoodRecommendations(dosha: string) {
  const recommendations = {
    VATA: {
      favor: ["Warm cooked grains", "Root vegetables", "Nuts and seeds", "Ghee", "Warm milk"],
      avoid: ["Raw vegetables", "Cold foods", "Dry foods", "Excessive beans", "Caffeine"],
      spices: ["Ginger", "Cinnamon", "Cardamom", "Fennel", "Cumin"],
    },
    PITTA: {
      favor: ["Sweet fruits", "Leafy greens", "Coconut", "Cooling herbs", "Basmati rice"],
      avoid: ["Spicy foods", "Sour foods", "Tomatoes", "Excessive salt", "Red meat"],
      spices: ["Coriander", "Fennel", "Mint", "Dill", "Turmeric (small amounts)"],
    },
    KAPHA: {
      favor: ["Light fruits", "Leafy greens", "Legumes", "Quinoa", "Herbal teas"],
      avoid: ["Heavy foods", "Dairy", "Sweet foods", "Oily foods", "Cold foods"],
      spices: ["Black pepper", "Ginger", "Turmeric", "Mustard seeds", "Chili"],
    },
  }

  return recommendations[dosha?.toUpperCase() as keyof typeof recommendations] || recommendations.VATA
}

export function getSeasonalRecommendations(season: string, dosha: string) {
  // Seasonal eating recommendations based on Ayurvedic principles
  const seasonalAdvice = {
    spring: {
      general: "Light, detoxifying foods to cleanse winter accumulation",
      VATA: "Gentle detox with warm, light foods",
      PITTA: "Bitter greens and cooling foods",
      KAPHA: "Spicy, light foods to reduce excess kapha",
    },
    summer: {
      general: "Cool, hydrating foods to balance heat",
      VATA: "Sweet, cooling foods but not too cold",
      PITTA: "Very cooling foods, avoid heating spices",
      KAPHA: "Light, cooling foods with some warming spices",
    },
    fall: {
      general: "Warm, grounding foods to prepare for winter",
      VATA: "Warm, oily, grounding foods",
      PITTA: "Sweet, grounding foods, reduce heating foods",
      KAPHA: "Warm, light foods with stimulating spices",
    },
    winter: {
      general: "Nourishing, warming foods for strength",
      VATA: "Heavy, warm, oily foods",
      PITTA: "Warm but not overly heating foods",
      KAPHA: "Warm, light, spicy foods",
    },
  }

  const currentSeason = season.toLowerCase()
  return (
    seasonalAdvice[currentSeason as keyof typeof seasonalAdvice]?.[dosha] ||
    seasonalAdvice[currentSeason as keyof typeof seasonalAdvice]?.general ||
    "Follow seasonal eating principles"
  )
}
