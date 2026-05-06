// Routes Index Page - Client-side filtering
(function () {
    const searchInput = document.querySelector('#search-input');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const cards = document.querySelectorAll('.ns-card');
    const noResults = document.querySelector('#no-results');
    let activeCategory = 'all';
    let searchTerm = '';

    function normalize(str) {
        return (str || '').toLowerCase().replaceAll(/[^\w\u4E00-\u9FFF]/g, '');
    }

    function filterCards() {
        let count = 0;
        for (const card of cards) {
            const ns = card.dataset.ns || '';
            const name = card.dataset.name || '';
            const desc = card.dataset.desc || '';
            const catsRaw = card.dataset.cats || '[]';
            let cats = [];
            try {
                cats = JSON.parse(catsRaw);
            } catch {
                // ignore parse errors
            }

            const matchSearch = !searchTerm || normalize(name).includes(searchTerm) || normalize(ns).includes(searchTerm) || normalize(desc).includes(searchTerm);

            const matchCat = activeCategory === 'all' || cats.includes(activeCategory);

            if (matchSearch && matchCat) {
                card.style.display = '';
                count++;
            } else {
                card.style.display = 'none';
            }
        }
        if (noResults) {
            noResults.classList.toggle('hidden', count > 0);
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchTerm = normalize(searchInput.value);
            filterCards();
        });
    }

    for (const tab of categoryTabs) {
        tab.addEventListener('click', () => {
            activeCategory = tab.dataset.category || 'all';
            for (const t of categoryTabs) {
                t.classList.remove('bg-[#F5712C]', 'text-white', 'border-[#F5712C]');
                t.classList.add('text-zinc-600', 'border-transparent');
            }
            tab.classList.add('bg-[#F5712C]', 'text-white', 'border-[#F5712C]');
            tab.classList.remove('text-zinc-600', 'border-transparent');
            filterCards();
        });
    }

    // Init active tab
    const firstTab = document.querySelector('.category-tab[data-category="all"]');
    if (firstTab) {
        firstTab.classList.add('bg-[#F5712C]', 'text-white', 'border-[#F5712C]');
    }

    // Render route grid on client from injected data
    // (For SSR, cards are rendered server-side; this script handles filtering only)
})();
