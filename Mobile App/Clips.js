document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. CONFIGURATION (AUTO-DETECT) ---
    // We use a relative path so it works on Localhost AND Render automatically
    const API_BASE_URL = ""; 

    // --- 1. PAGE NAVIGATION ---
    window.showPage = function(pageName, btnElement) {
        const pages = ['homePage', 'trendPage', 'aboutPage', 'searchPage'];
        
        pages.forEach(p => {
            const el = document.getElementById(p);
            if(el) el.classList.add('d-none');
        });

        const selected = document.getElementById(pageName + 'Page');
        if(selected) selected.classList.remove('d-none');

        if (btnElement) {
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            btnElement.classList.add('active');
        }
    };

    // --- 2. API SEARCH LOGIC (CONNECTS TO FLASK) ---
    const searchInput = document.getElementById('searchInput');
    if(searchInput) {
        searchInput.addEventListener('keydown', async (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                
                if (!query.includes('#')) {
                    alert("Please use format: Name#Tag (e.g. Faker#KR1)");
                    return;
                }

                const [name, tag] = query.split('#');
                window.showPage('search'); 
                
                const spinner = document.getElementById('loadingSpinner');
                const content = document.getElementById('searchResultContent');
                
                if(spinner) spinner.classList.remove('d-none');
                if(content) content.innerHTML = '';

                try {
                    // CALLING YOUR PYTHON BACKEND HERE
                    const res = await fetch(`${API_BASE_URL}/api/proxy?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
                    const data = await res.json();

                    if(spinner) spinner.classList.add('d-none');

                    if(data.status) {
                        content.innerHTML = `<h3 class="text-danger fw-bold brand-font">SUMMONER NOT FOUND</h3><p class="text-muted">Check spelling and region.</p>`;
                    } else {
                        content.innerHTML = `
                            <div class="card hex-card p-5 mx-auto animate-in" style="max-width: 500px; border: 1px solid var(--hex-gold);">
                                <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/29.jpg" 
                                     class="rounded-circle mx-auto mb-4 border border-2 border-warning shadow-lg" width="120">
                                <h2 class="brand-font text-warning fw-bold mb-1">${data.gameName}</h2>
                                <span class="badge bg-secondary mb-4 px-3 py-2">#${data.tagLine}</span>
                                
                                <div class="bg-dark p-4 rounded-4 text-start border border-secondary">
                                    <small class="text-muted d-block fw-bold mb-1">ENCRYPTED PUUID</small>
                                    <code class="text-white text-break" style="font-size: 0.85rem;">${data.puuid}</code>
                                </div>
                                <button class="btn btn-warning btn-pill w-100 mt-4 fw-bold" onclick="alert('Match History feature coming soon!')">VIEW MATCH HISTORY</button>
                            </div>
                        `;
                    }
                } catch (err) {
                    if(spinner) spinner.classList.add('d-none');
                    content.innerHTML = `<h3 class="text-danger brand-font">CONNECTION ERROR</h3><p class="text-muted">Ensure the Python Backend is running.</p>`;
                }
            }
        });
    }

    // --- 3. FILTER LOGIC ---
    window.filterPatch = function(category, btn) {
        document.querySelectorAll('#homePage .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.patch-card').forEach(card => {
            card.style.display = (category === 'all' || card.classList.contains(category)) ? 'block' : 'none';
        });
    };

    window.filterTrend = function(category, btn) {
        document.querySelectorAll('#trendPage .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.trend-card').forEach(card => {
            if (category === 'all' || card.classList.contains(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // --- 4. THEME & FONT ---
    window.toggleTheme = function() {
        const body = document.body;
        const toggle = document.getElementById('darkModeToggle');
        if (!toggle.checked) body.classList.add('light-mode');
        else body.classList.remove('light-mode');
    };

    window.changeFont = function(fontName, btn) {
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.body.style.fontFamily = fontName === 'Cinzel' ? "'Cinzel', serif" : "'Inter', sans-serif";
    };

    // --- 5. AUTH ---
    window.enterDashboard = function() {
        document.getElementById('loginPhase').classList.add('d-none');
        document.getElementById('loginPhase').classList.remove('d-flex');
        document.getElementById('dashboardPhase').classList.remove('d-none');
    };

    window.logout = function() {
        document.getElementById('dashboardPhase').classList.add('d-none');
        document.getElementById('loginPhase').classList.remove('d-none');
        document.getElementById('loginPhase').classList.add('d-flex');
    };

    // --- 6. UPLOAD LOGIC ---
    const uploadForm = document.getElementById('uploadForm');
    if(uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const game = document.querySelector('input[name="game"]:checked').value;
            const hero = document.getElementById('heroName').value;
            const caption = document.getElementById('caption').value;
            
            let badgeClass = game === 'lol' ? 'lol' : 'val';
            let badgeText = game === 'lol' ? 'LEAGUE' : 'VALORANT';
            let bgImage = game === 'lol' ? 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg' : 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt6f13e593926ba19d/65a0459d2f2604085427d110/Valorant_Ep8_Act1_Thumbnail.jpg';

            const newCard = `
                <div class="col-md-4">
                    <div class="card hex-card h-100">
                        <div class="hex-card-img" style="background-image: url('${bgImage}')">
                            <span class="hex-badge ${badgeClass}">${badgeText}</span>
                        </div>
                        <div class="card-body">
                            <h5 class="fw-bold brand-font text-warning">${hero}</h5>
                            <p class="text-muted small">${caption}</p>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('emptyState')?.remove();
            document.getElementById('clipsFeed').insertAdjacentHTML('afterbegin', newCard);
            
            const modalEl = document.getElementById('uploadModal');
            const modal = bootstrap.Modal.getInstance(modalEl);
            modal.hide();
            
            e.target.reset();
        });
    }
});