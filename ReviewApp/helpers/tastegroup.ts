export const tasteGroupsFormValues = [
  {
    group: "🍭 Sweet",
    color: "#E6B17E", // warm caramel, dessert-friendly
    tastes: ["Sweet", "Vanilla", "Caramel", "Chocolate"],
  },
  {
    group: "🍎 Fruity",
    color: "#FF914D", // juicy orange, pops nicely
    tastes: ["Citrus", "Berry", "Apple/Pear", "Tropical"],
  },
  {
    group: "🌿 Fresh",
    color: "#7CCBA2", // soft green, clean and herbal
    tastes: ["Herbal", "Minty", "Floral"],
  },
  {
    group: "🔥 Bold",
    color: "#C44536", // rich red-brown, bold & smoky
    tastes: ["Spicy", "Smoky", "Woody"],
  },
];

export const textColor = "#fff"; // universal text color for readability

// select color by taste (but get from group)
export const selectColor = (value: string) => {
  const group = tasteGroupsFormValues.find((g) => g.tastes.includes(value));
  if (group) {
    return { color: group.color, textColor };
  }
  return { color: "#E0E0E0", textColor }; // fallback neutral gray
};
