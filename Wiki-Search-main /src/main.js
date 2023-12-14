document.addEventListener('DOMContentLoaded', () => {
    // Cached DOM elements
    const form = document.querySelector('form');
    const randomButton = document.getElementById('random-article');
    const resultsContainer = document.getElementById('results');
    const searchInput = document.getElementById('search-input');
    const suggestionsContainer = document.getElementById('suggestions');
    const loader = document.getElementById('loader');

    // Wikipedia API endpoints
    const searchEndpoint = 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*';
    const suggestionsEndpoint = 'https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*';
    const randomArticleEndpoint = 'https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*';

    // Function to fetch search suggestions
    async function fetchSearchSuggestions(searchTerm) {
        try {
            const response = await fetch(`${suggestionsEndpoint}&search=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            const suggestions = data[1];
            displaySuggestions(suggestions);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    // Function to fetch search results from Wikipedia API
    async function fetchSearchResults(searchTerm) {
        try {
            const response = await fetch(`${searchEndpoint}&srsearch=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();
            const results = data.query.search;
            displayResults(results);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    // Function to fetch a random article from Wikipedia API
    async function fetchRandomArticle() {
        try {
            const response = await fetch(randomArticleEndpoint);
            const data = await response.json();
            const result = data.query.random[0];
            displayRandomArticle(result);
        } catch (error) {
            console.error('An error occurred:', error);
        }
    }

    // Function to display search suggestions
    function displaySuggestions(suggestions) {
        suggestionsContainer.innerHTML = '';
        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.textContent = suggestion;
            suggestionItem.addEventListener('click', () => {
                searchInput.value = suggestion;
                suggestionsContainer.innerHTML = ''; // Clear suggestions
            });
            suggestionsContainer.appendChild(suggestionItem);
        });
        suggestionsContainer.style.display = 'block'; // Show suggestions
    }

    // Function to hide search suggestions
    function hideSuggestions() {
        suggestionsContainer.style.display = 'none';
    }

    // Function to display search results
    function displayResults(results) {
        resultsContainer.innerHTML = '';
        results.forEach(result => {
            const url = `https://en.wikipedia.org/?curid=${result.pageid}`;
            resultsContainer.innerHTML += `<div class="result-item">
                <h3><a href="${url}" target="_blank">${result.title}</a></h3>
                <span>${result.snippet}</span>
            </div>`;
        });
    }

    // Function to display a random article
    function displayRandomArticle(article) {
        const url = `https://en.wikipedia.org/?curid=${article.id}`;
        resultsContainer.innerHTML = `<div class="result-item">
            <h3><a href="${url}" target="_blank">${article.title}</a></h3>
        </div>`;
    }

    // Function to show the loader
    function showLoader() {
        loader.style.display = 'block';
    }

    // Function to hide the loader
    function hideLoader() {
        loader.style.display = 'none';
    }

    // Event listener for form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const searchTerm = searchInput.value;
        fetchSearchResults(searchTerm);
        hideSuggestions(); // Hide suggestions on form submission
    });

    // Event listener for the random article button
    randomButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await fetchRandomArticle();
    });

    // Event listener for input change (typing) to fetch suggestions
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        if (searchTerm.length >= 3) {
            fetchSearchSuggestions(searchTerm);
        } else {
            suggestionsContainer.innerHTML = ''; // Clear suggestions if input is too short
        }
    });

    // Initial loader display
    showLoader();

    // Hide the loader after the initial loading
    hideLoader();
});

