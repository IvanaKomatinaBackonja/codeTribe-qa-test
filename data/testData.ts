export const testData = {
  search: {
    term: "computer",
  },

  categories: {
    computers: {
      name: "Computers",
      url: "/computers",
      subcategories: {
        desktops: { name: "Desktops", url: "/desktops" },
      },
    },
    apparelAndShoes: {
      name: "Apparel & Shoes",
      url: "/apparel-shoes",
    },
  },

  pagination: {
    pageTwoUrlParam: "pagenumber=2",
  },

  sort: {
    option: "Price: Low to High",
  },
} as const;
