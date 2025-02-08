export const tripOptions = {
  tripType: [
    { id: 1, label: "Solo Adventure", value: "solo" },
    { id: 2, label: "Family Vacation", value: "family" },
    { id: 3, label: "Romantic Getaway", value: "romantic" },
    { id: 4, label: "Business Trip", value: "business" },
    { id: 5, label: "Group Tour", value: "group" }
  ],
  
  budget: [
    { id: 1, label: "Budget Friendly", value: "budget", range: "Under $1000" },
    { id: 2, label: "Mid-Range", value: "mid", range: "$1000-$3000" },
    { id: 3, label: "Luxury", value: "luxury", range: "$3000-$5000" },
    { id: 4, label: "Ultra Luxury", value: "ultra", range: "$5000+" }
  ],

  interests: [
    { id: 1, label: "Cultural & Historical", value: "cultural" },
    { id: 2, label: "Adventure & Sports", value: "adventure" },
    { id: 3, label: "Food & Cuisine", value: "food" },
    { id: 4, label: "Nature & Wildlife", value: "nature" },
    { id: 5, label: "Shopping & Entertainment", value: "shopping" },
    { id: 6, label: "Relaxation & Wellness", value: "relaxation" }
  ],

  pace: [
    { id: 1, label: "Relaxed", value: "relaxed", description: "Plenty of free time" },
    { id: 2, label: "Moderate", value: "moderate", description: "Balanced schedule" },
    { id: 3, label: "Fast", value: "fast", description: "Action-packed" }
  ]
};
