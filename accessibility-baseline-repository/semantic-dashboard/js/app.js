"use strict";

import { fetchProducts } from "./api.js";

/* =========================================================
   STORAGE KEYS
========================================================= */

const CART_KEY = "enterprise-dashboard-cart";
const PRODUCTS_KEY = "enterprise-dashboard-products";
const AUTH_KEY = "enterprise-dashboard-user";


/* =========================================================
   APPLICATION STATE
========================================================= */

const state = {
  products: [],
  filteredProducts: [],
  searchTerm: "",
  category: "all",
  sortBy: "default",
  cart: loadCart(),
};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const productGrid =
  document.getElementById("product-grid");

const searchInput =
  document.getElementById("product-search");

const categoryContainer =
  document.getElementById("category-tabs");

const sortSelect =
  document.getElementById("sort-products");

const loadingState =
  document.getElementById("loading-state");

const errorBanner =
  document.getElementById("error-banner");

const errorMessage =
  document.getElementById("error-message");

const cartCount =
  document.getElementById("cart-count");

const cartMessage =
  document.getElementById("cart-message");

const logoutButton =
  document.getElementById("logout-button");


/* =========================================================
   APPLICATION INITIALIZATION
========================================================= */

async function init() {
  showLoading();

  initializeAuth();

  try {
    const savedProducts =
      loadSavedProducts();

    if (savedProducts && savedProducts.length > 0) {
      state.products = savedProducts;
    } else {
      state.products =
        await fetchProducts();

      saveProducts();
    }

    createCategoryTabs();

    applyFilters();

    updateCartCount();

    hideError();
    hideLoading();

  } catch (error) {
    console.error("API Error:", error);

    hideLoading();

    showError(
      "We could not load the products. Please check your internet connection and try again."
    );
  }
}


/* =========================================================
   LOADING
========================================================= */

function showLoading() {
  if (loadingState) {
    loadingState.hidden = false;
  }

  if (productGrid) {
    productGrid.hidden = true;
  }
}


function hideLoading() {
  if (loadingState) {
    loadingState.hidden = true;
  }

  if (productGrid) {
    productGrid.hidden = false;
  }
}


/* =========================================================
   ERROR HANDLING
========================================================= */

function showError(message) {
  if (!errorBanner || !errorMessage) {
    return;
  }

  errorBanner.hidden = false;
  errorMessage.textContent = message;
}


function hideError() {
  if (errorBanner) {
    errorBanner.hidden = true;
  }
}


/* =========================================================
   AUTHENTICATION SIMULATION
========================================================= */

function getCurrentUser() {
  try {
    return JSON.parse(
      localStorage.getItem(AUTH_KEY)
    );
  } catch (error) {
    return null;
  }
}


function simulateLogin(email) {
  const user = {
    email,
    name: email
      .split("@")[0]
      .replace(/[._-]/g, " "),
    loggedIn: true,
    loginTime:
      new Date().toISOString(),
  };

  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify(user)
  );

  return user;
}


function logoutUser() {
  localStorage.removeItem(AUTH_KEY);

  window.location.reload();
}


function initializeAuth() {
  const currentUser =
    getCurrentUser();

  if (!currentUser) {
    simulateLogin(
      "admin@example.com"
    );
  }

  if (logoutButton) {
    logoutButton.addEventListener(
      "click",
      logoutUser
    );
  }
}


/* =========================================================
   PRODUCTS - LOCAL STORAGE
========================================================= */

function loadSavedProducts() {
  try {
    const saved =
      localStorage.getItem(
        PRODUCTS_KEY
      );

    return saved
      ? JSON.parse(saved)
      : null;

  } catch (error) {
    console.error(
      "Could not load saved products:",
      error
    );

    return null;
  }
}


function saveProducts() {
  localStorage.setItem(
    PRODUCTS_KEY,
    JSON.stringify(state.products)
  );
}


/* =========================================================
   CREATE PRODUCT
========================================================= */

function createProduct(productData) {
  const newProduct = {
    id: Date.now(),

    title: productData.title,

    price: Number(
      productData.price
    ),

    category:
      productData.category,

    description:
      productData.description,

    image:
      productData.image ||
      "https://via.placeholder.com/300x300?text=Product",

    rating: {
      rate: 0,
      count: 0,
    },
  };

  state.products.unshift(
    newProduct
  );

  saveProducts();

  createCategoryTabs();

  applyFilters();

  closeProductModal();

  showCartMessage(
    "Product added successfully."
  );
}


/* =========================================================
   UPDATE PRODUCT
========================================================= */

function updateProduct(
  productId,
  updates
) {
  state.products =
    state.products.map(
      (product) => {
        if (
          Number(product.id) ===
          Number(productId)
        ) {
          return {
            ...product,
            ...updates,
            price: Number(
              updates.price
            ),
          };
        }

        return product;
      }
    );

  saveProducts();

  createCategoryTabs();

  applyFilters();

  closeProductModal();

  showCartMessage(
    "Product updated successfully."
  );
}


/* =========================================================
   DELETE PRODUCT
========================================================= */

function deleteProduct(productId) {
  const product =
    state.products.find(
      (item) =>
        Number(item.id) ===
        Number(productId)
    );

  if (!product) {
    return;
  }

  const confirmed =
    window.confirm(
      `Delete "${product.title}"?`
    );

  if (!confirmed) {
    return;
  }

  state.products =
    state.products.filter(
      (item) =>
        Number(item.id) !==
        Number(productId)
    );

  saveProducts();

  createCategoryTabs();

  applyFilters();

  showCartMessage(
    "Product deleted successfully."
  );
}


/* =========================================================
   CATEGORY TABS
========================================================= */

function createCategoryTabs() {
  if (!categoryContainer) {
    return;
  }

  const categories = [
    "all",
    ...new Set(
      state.products.map(
        (product) =>
          product.category
      )
    ),
  ];

  categoryContainer.innerHTML = "";

  categories.forEach(
    (category) => {
      const button =
        document.createElement(
          "button"
        );

      button.type = "button";

      button.className =
        "category-button";

      button.textContent =
        category === "all"
          ? "All Products"
          : formatCategory(
              category
            );

      button.dataset.category =
        category;

      button.setAttribute(
        "aria-pressed",
        String(
          category ===
            state.category
        )
      );

      button.addEventListener(
        "click",
        () => {
          state.category =
            category;

          updateActiveCategory();

          applyFilters();
        }
      );

      categoryContainer.appendChild(
        button
      );
    }
  );
}


function updateActiveCategory() {
  if (!categoryContainer) {
    return;
  }

  const buttons =
    categoryContainer.querySelectorAll(
      ".category-button"
    );

  buttons.forEach(
    (button) => {
      const active =
        button.dataset.category ===
        state.category;

      button.classList.toggle(
        "active",
        active
      );

      button.setAttribute(
        "aria-pressed",
        String(active)
      );
    }
  );
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


/* =========================================================
   SEARCH
========================================================= */

if (searchInput) {
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
}


/* =========================================================
   SORT
========================================================= */

if (sortSelect) {
  sortSelect.addEventListener(
    "change",
    (event) => {
      state.sortBy =
        event.target.value;

      applyFilters();
    }
  );
}


/* =========================================================
   FILTER + SORT
========================================================= */

function applyFilters() {
  let products = [
    ...state.products,
  ];

  if (state.searchTerm) {
    products =
      products.filter(
        (product) => {
          const title =
            String(
              product.title || ""
            ).toLowerCase();

          const description =
            String(
              product.description ||
                ""
            ).toLowerCase();

          return (
            title.includes(
              state.searchTerm
            ) ||
            description.includes(
              state.searchTerm
            )
          );
        }
      );
  }


  if (state.category !== "all") {
    products =
      products.filter(
        (product) =>
          product.category ===
          state.category
      );
  }


  switch (state.sortBy) {
    case "price-low":
      products.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );
      break;

    case "price-high":
      products.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );
      break;

    case "name":
      products.sort(
        (a, b) =>
          String(
            a.title
          ).localeCompare(
            String(b.title)
          )
      );
      break;

    default:
      break;
  }

  state.filteredProducts =
    products;

  renderProducts();
}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {
  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = "";

  if (
    state.filteredProducts
      .length === 0
  ) {
    renderEmptyState();
    return;
  }

  state.filteredProducts.forEach(
    (product) => {
      productGrid.appendChild(
        createProductCard(
          product
        )
      );
    }
  );
}


/* =========================================================
   PRODUCT CARD
========================================================= */

function createProductCard(product) {
  const article =
    document.createElement(
      "article"
    );

  article.className =
    "product-card";

  article.innerHTML = `
    <img
      src="${escapeHtml(
        product.image
      )}"
      alt="${escapeHtml(
        product.title
      )}"
      class="product-image"
      loading="lazy"
    >

    <div class="product-content">

      <p class="product-category">
        ${escapeHtml(
          product.category
        )}
      </p>

      <h3>
        ${escapeHtml(
          product.title
        )}
      </h3>

      <p class="product-description">
        ${escapeHtml(
          String(
            product.description ||
              ""
          ).substring(0, 120)
        )}...
      </p>

      <div class="product-footer">

        <strong class="product-price">
          $${Number(
            product.price
          ).toFixed(2)}
        </strong>

        <div class="product-actions">

          <button
            type="button"
            class="add-cart-button"
            data-action="cart"
            aria-label="Add ${escapeHtml(
              product.title
            )} to cart"
          >
            Add to cart
          </button>

          <button
            type="button"
            class="edit-product-button"
            data-action="edit"
            aria-label="Edit ${escapeHtml(
              product.title
            )}"
          >
            Edit
          </button>

          <button
            type="button"
            class="delete-product-button"
            data-action="delete"
            aria-label="Delete ${escapeHtml(
              product.title
            )}"
          >
            Delete
          </button>

        </div>

      </div>

    </div>
  `;


  const cartButton =
    article.querySelector(
      '[data-action="cart"]'
    );

  const editButton =
    article.querySelector(
      '[data-action="edit"]'
    );

  const deleteButton =
    article.querySelector(
      '[data-action="delete"]'
    );


  cartButton.addEventListener(
    "click",
    () => {
      addToCart(product);
    }
  );


  editButton.addEventListener(
    "click",
    () => {
      openProductModal(product);
    }
  );


  deleteButton.addEventListener(
    "click",
    () => {
      deleteProduct(
        product.id
      );
    }
  );


  return article;
}


/* =========================================================
   EMPTY STATE
========================================================= */

function renderEmptyState() {
  if (!productGrid) {
    return;
  }

  productGrid.innerHTML = `
    <div class="empty-state">

      <h3>
        No products found
      </h3>

      <p>
        Try another search term
        or category.
      </p>

    </div>
  `;
}


/* =========================================================
   CART
========================================================= */

function addToCart(product) {
  const existing =
    state.cart.find(
      (item) =>
        Number(item.id) ===
        Number(product.id)
    );

  if (existing) {
    existing.quantity += 1;
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
  if (!cartCount) {
    return;
  }

  const count =
    state.cart.reduce(
      (total, item) =>
        total +
        Number(
          item.quantity || 0
        ),
      0
    );

  cartCount.textContent =
    count;
}


/* =========================================================
   CART LOCAL STORAGE
========================================================= */

function loadCart() {
  try {
    const saved =
      localStorage.getItem(
        CART_KEY
      );

    return saved
      ? JSON.parse(saved)
      : [];

  } catch (error) {
    console.error(
      "Could not load cart:",
      error
    );

    return [];
  }
}


function saveCart() {
  localStorage.setItem(
    CART_KEY,
    JSON.stringify(state.cart)
  );
}


/* =========================================================
   CART MESSAGE
========================================================= */

function showCartMessage(message) {
  if (!cartMessage) {
    return;
  }

  cartMessage.textContent =
    message;

  window.setTimeout(
    () => {
      cartMessage.textContent =
        "";
    },
    3000
  );
}


/* =========================================================
   PRODUCT MODAL
========================================================= */

const productModal =
  document.getElementById(
    "product-modal"
  );

const productForm =
  document.getElementById(
    "product-form"
  );

const modalTitle =
  document.getElementById(
    "product-modal-title"
  );

const productIdInput =
  document.getElementById(
    "product-id"
  );

const productTitleInput =
  document.getElementById(
    "product-title"
  );

const productPriceInput =
  document.getElementById(
    "product-price"
  );

const productCategoryInput =
  document.getElementById(
    "product-category"
  );

const productImageInput =
  document.getElementById(
    "product-image"
  );

const productDescriptionInput =
  document.getElementById(
    "product-description"
  );

const addProductButton =
  document.getElementById(
    "add-product-button"
  );

const closeProductModalButton =
  document.getElementById(
    "close-product-modal"
  );


function openProductModal(
  product = null
) {
  if (!productModal) {
    return;
  }

  productModal.showModal();

  document.body.classList.add(
    "modal-open"
  );

  if (product) {
    modalTitle.textContent =
      "Edit Product";

    productIdInput.value =
      product.id;

    productTitleInput.value =
      product.title;

    productPriceInput.value =
      product.price;

    productCategoryInput.value =
      product.category;

    productImageInput.value =
      product.image;

    productDescriptionInput.value =
      product.description;

  } else {
    modalTitle.textContent =
      "Add Product";

    productForm.reset();

    productIdInput.value =
      "";
  }

  productTitleInput.focus();
}


function closeProductModal() {
  if (!productModal) {
    return;
  }

productModal.close();

  document.body.classList.remove(
    "modal-open"
  );
}
const cancelProductModal =
  document.getElementById(
    "cancel-product-modal"
  );

if (cancelProductModal) {
  cancelProductModal.addEventListener(
    "click",
    closeProductModal
  );
}


if (addProductButton) {
  addProductButton.addEventListener(
    "click",
    () => {
      openProductModal();
    }
  );
}


if (closeProductModalButton) {
  closeProductModalButton.addEventListener(
    "click",
    closeProductModal
  );
}


if (productModal) {
  productModal.addEventListener(
    "click",
    (event) => {
      if (
        event.target ===
        productModal
      ) {
        closeProductModal();
      }
    }
  );
}


if (productForm) {
  productForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      const formData =
        new FormData(
          productForm
        );

      const productData = {
        title:
          formData.get(
            "productTitle"
          ),

        price:
          formData.get(
            "productPrice"
          ),

        category:
          formData.get(
            "productCategory"
          ),

        image:
          formData.get(
            "productImage"
          ),

        description:
          formData.get(
            "productDescription"
          ),
      };


      if (
        !productData.title ||
        !productData.price ||
        !productData.category ||
        !productData.description
      ) {
        showCartMessage(
          "Please fill all required fields."
        );

        return;
      }


      const existingId =
        productIdInput.value;


      if (existingId) {
        updateProduct(
          Number(existingId),
          productData
        );
      } else {
        createProduct(
          productData
        );
      }
    }
  );
}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHtml(value) {
  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );
}


/* =========================================================
   START
========================================================= */

init();