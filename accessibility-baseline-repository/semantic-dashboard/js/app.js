"use strict";

import { fetchProducts } from "./api.js";

/* ================================
   STATE
================================ */

const state = {
  products: [],
  filteredProducts: [],
  searchTerm: "",
  category: "all",
  sortBy: "default",
  cart: loadCart(),
};


/* ================================
   DOM ELEMENTS
================================ */

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("product-search");
const categoryContainer = document.getElementById("category-tabs");
const sortSelect = document.getElementById("sort-products");

const loadingState = document.getElementById("loading-state");
const errorBanner = document.getElementById("error-banner");
const errorMessage = document.getElementById("error-message");

const cartCount = document.getElementById("cart-count");


/* ================================
   INITIALIZE APP
================================ */

async function init() {
  showLoading();

  try {
    state.products = await fetchProducts();

    createCategoryTabs();
    applyFilters();
    updateCartCount();

    hideLoading();

  } catch (error) {
    console.error("API Error:", error);

    hideLoading();

    showError(
      "We could not load the products. Please check your internet connection and try again."
    );
  }
}


/* ================================
   LOADING STATE
================================ */

function showLoading() {
  loadingState.hidden = false;
  productGrid.hidden = true;
}

function hideLoading() {
  loadingState.hidden = true;
  productGrid.hidden = false;
}


/* ================================
   ERROR BANNER
================================ */

function showError(message) {
  errorBanner.hidden = false;
  errorMessage.textContent = message;
}

function hideError() {
  errorBanner.hidden = true;
}


/* ================================
   CATEGORY TABS
================================ */

function createCategoryTabs() {
  const categories = [
    "all",
    ...new Set(
      state.products.map((product) => product.category)
    ),
  ];

  categoryContainer.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");

    button.type = "button";

    button.className = "category-button";

    button.textContent =
      category === "all"
        ? "All Products"
        : formatCategory(category);

    button.dataset.category = category;

    button.addEventListener("click", () => {
      state.category = category;

      updateActiveCategory();

      applyFilters();
    });

    categoryContainer.appendChild(button);
  });

  updateActiveCategory();
}


function updateActiveCategory() {
  const buttons =
    categoryContainer.querySelectorAll(
      ".category-button"
    );

  buttons.forEach((button) => {
    const isActive =
      button.dataset.category === state.category;

    button.classList.toggle(
      "active",
      isActive
    );

    button.setAttribute(
      "aria-pressed",
      String(isActive)
    );
  });
}


function formatCategory(category) {
  return category
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}


/* ================================
   SEARCH
================================ */

searchInput.addEventListener(
  "input",
  (event) => {
    state.searchTerm =
      event.target.value
        .trim()
        .toLowerCase();

    applyFilters();
  }
);


/* ================================
   SORTING
================================ */

sortSelect.addEventListener(
  "change",
  (event) => {
    state.sortBy = event.target.value;

    applyFilters();
  }
);


/* ================================
   FILTER + SORT
================================ */

function applyFilters() {
  let products = [...state.products];

  /* Search */

  if (state.searchTerm) {
    products = products.filter((product) => {
      return (
        product.title
          .toLowerCase()
          .includes(state.searchTerm) ||

        product.description
          .toLowerCase()
          .includes(state.searchTerm)
      );
    });
  }

  /* Category */

  if (state.category !== "all") {
    products = products.filter(
      (product) =>
        product.category ===
        state.category
    );
  }

  /* Sorting */

  switch (state.sortBy) {

    case "price-low":
      products.sort(
        (a, b) => a.price - b.price
      );
      break;

    case "price-high":
      products.sort(
        (a, b) => b.price - a.price
      );
      break;

    case "name":
      products.sort(
        (a, b) =>
          a.title.localeCompare(
            b.title
          )
      );
      break;

    default:
      break;
  }

  state.filteredProducts = products;

  renderProducts();
}


/* ================================
   RENDER PRODUCTS
================================ */

function renderProducts() {
  productGrid.innerHTML = "";

  if (state.filteredProducts.length === 0) {
    renderEmptyState();
    return;
  }

  state.filteredProducts.forEach(
    (product) => {
      productGrid.appendChild(
        createProductCard(product)
      );
    }
  );
}


/* ================================
   PRODUCT CARD
================================ */

function createProductCard(product) {
  const article =
    document.createElement("article");

  article.className =
    "product-card";

  article.innerHTML = `
    <img
      src="${escapeHtml(product.image)}"
      alt="${escapeHtml(product.title)}"
      class="product-image"
      loading="lazy"
    >

    <div class="product-content">

      <p class="product-category">
        ${escapeHtml(product.category)}
      </p>

      <h3>
        ${escapeHtml(product.title)}
      </h3>

      <p class="product-description">
        ${escapeHtml(
          product.description.substring(
            0,
            120
          )
        )}...
      </p>

      <div class="product-footer">

        <strong class="product-price">
          $${product.price.toFixed(2)}
        </strong>

        <button
          type="button"
          class="add-cart-button"
          data-product-id="${product.id}"
          aria-label="Add ${escapeHtml(
            product.title
          )} to cart"
        >
          Add to cart
        </button>

      </div>

    </div>
  `;

  const cartButton =
    article.querySelector(
      ".add-cart-button"
    );

  cartButton.addEventListener(
    "click",
    () => {
      addToCart(product);
    }
  );

  return article;
}


/* ================================
   EMPTY STATE
================================ */

function renderEmptyState() {
  productGrid.innerHTML = `
    <div class="empty-state">
      <h3>No products found</h3>

      <p>
        Try a different search term
        or category.
      </p>
    </div>
  `;
}


/* ================================
   CART
================================ */

function addToCart(product) {
  const existingItem =
    state.cart.find(
      (item) =>
        item.id === product.id
    );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
    });
  }

  saveCart();

  updateCartCount();

  showCartMessage(
    `${product.title} added to cart.`
  );
}


function updateCartCount() {
  const count =
    state.cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  cartCount.textContent = count;
}


/* ================================
   LOCAL STORAGE
================================ */

function saveCart() {
  localStorage.setItem(
    "enterprise-dashboard-cart",
    JSON.stringify(state.cart)
  );
}


function loadCart() {
  try {
    const savedCart =
      localStorage.getItem(
        "enterprise-dashboard-cart"
      );

    return savedCart
      ? JSON.parse(savedCart)
      : [];

  } catch (error) {
    console.error(
      "Could not load cart:",
      error
    );

    return [];
  }
}


/* ================================
   CART MESSAGE
================================ */

function showCartMessage(message) {
  const messageElement =
    document.getElementById(
      "cart-message"
    );

  if (!messageElement) {
    return;
  }

  messageElement.textContent =
    message;

  window.setTimeout(() => {
    messageElement.textContent = "";
  }, 3000);
}


/* ================================
   HTML SAFETY
================================ */

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* ================================
   START APPLICATION
================================ */

init();