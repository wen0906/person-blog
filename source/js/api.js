const API_BASE_URL = 'http://localhost:3001/api/public';

const api = {
  async getPosts(params = {}) {
    const url = new URL(`${API_BASE_URL}/posts`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    const response = await fetch(url);
    return await response.json();
  },

  async getPost(id) {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`);
    return await response.json();
  },

  async getCategories() {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return await response.json();
  },

  async getTags() {
    const response = await fetch(`${API_BASE_URL}/tags`);
    return await response.json();
  },

  async getSettings() {
    const response = await fetch(`${API_BASE_URL}/settings`);
    return await response.json();
  },

  async getArchives() {
    const response = await fetch(`${API_BASE_URL}/archives`);
    return await response.json();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  if (window.BlogAPI) return;
  window.BlogAPI = api;
});