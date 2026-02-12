document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. PAGE NAVIGATION ---
    window.showPage = function(pageName, btnElement) {
        const home = document.getElementById('homePage');
        const trend = document.getElementById('trendPage');
        const navLinks = document.querySelectorAll('.nav-link');

        if (btnElement) {
            navLinks.forEach(link => link.classList.remove('active'));
            btnElement.classList.add('active');
        }

        if (pageName === 'home') {
            home.classList.remove('d-none');
            trend.classList.add('d-none');
        } else if (pageName === 'trend') {
            home.classList.add('d-none');
            trend.classList.remove('d-none');
        }
    };

    // --- 2. PATCH NOTES FILTER ---
    window.filterPatch = function(category, btn) {
        document.querySelectorAll('#homePage .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cards = document.querySelectorAll('.patch-card');
        cards.forEach(card => {
            if (category === 'all' || card.classList.contains(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // --- 3. TREND CLIPS FILTER (New) ---
    window.filterTrend = function(category, btn) {
        document.querySelectorAll('#trendPage .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cards = document.querySelectorAll('.trend-card');
        cards.forEach(card => {
            if (category === 'all' || card.classList.contains(category)) {
                card.parentElement.style.display = 'block'; // Grid column wrapper
            } else {
                card.parentElement.style.display = 'none';
            }
        });
    };

    // --- 4. FONT & THEME SETTINGS ---
    window.toggleTheme = function() {
        const body = document.body;
        const toggle = document.getElementById('darkModeToggle');
        if (!toggle.checked) body.classList.add('light-mode');
        else body.classList.remove('light-mode');
    };

    window.changeFont = function(fontName, btn) {
        // Update Buttons
        const btns = btn.parentElement.querySelectorAll('button');
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Apply Font
        if (fontName === 'Cinzel') {
            document.body.style.fontFamily = "'Cinzel', serif";
        } else {
            document.body.style.fontFamily = "'Inter', sans-serif";
        }
    };

    // --- 5. LOGIN / LOGOUT ---
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
            bootstrap.Modal.getInstance(document.getElementById('uploadModal')).hide();
            e.target.reset();
        });
    }

});