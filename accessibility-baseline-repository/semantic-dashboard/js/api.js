"use strict";

const API_URL = "https://fakestoreapi.com/products";

/**
 * Fetch all products from Fake Store API.
 */
export async function fetchProducts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Unable to load products. Server returned ${response.status}.`
    );
  }

  return await response.json();
}