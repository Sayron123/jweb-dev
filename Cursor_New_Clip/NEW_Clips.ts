
document.addEventListener('DOMContentLoaded', (): void => {
    
    // --- 0. CONFIGURATION (AUTO-DETECT) ---
    const API_BASE_URL: string = ""; 

    // --- 1. PAGE NAVIGATION ---
    window.showPage = function(pageName: PageName, btnElement?: HTMLElement | null): void {
        const pages: string[] = ['homePage', 'trendPage', 'clipsPage', 'aboutPage', 'searchPage'];
        
        pages.forEach((p: string): void => {
            const el = document.getElementById(p);
            if (el) el.classList.add('d-none');
        });

        const selected = document.getElementById(pageName + 'Page');
        if (selected) selected.classList.remove('d-none');

        // Only highlight the nav link for the current page (Home, Trend, Clips, About)
        if (btnElement) {
            document.querySelectorAll('.nav-page-link').forEach((link: Element): void => {
                link.classList.remove('active');
            });
            btnElement.classList.add('active');
        }
    };

    // --- 2. API SEARCH LOGIC (CONNECTS TO FLASK) ---
    const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
    if (searchInput) {
        searchInput.addEventListener('keydown', async (e: KeyboardEvent): Promise<void> => {
            if (e.key === 'Enter') {
                const query: string = searchInput.value.trim();
                
                if (!query.includes('#')) {
                    if (window.showToast) {
                        window.showToast("Please use format: Name#Tag (e.g. Faker#KR1)", 'warning');
                    } else {
                        alert("Please use format: Name#Tag (e.g. Faker#KR1)");
                    }
                    return;
                }

                const [name, tag] = query.split('#');
                window.showPage('search'); 
                
                const spinner = document.getElementById('loadingSpinner');
                const content = document.getElementById('searchResultContent');
                
                if (spinner) spinner.classList.remove('d-none');
                if (content) content.innerHTML = '';

                try {
                    // CALLING YOUR PYTHON BACKEND HERE
                    const res = await fetch(`${API_BASE_URL}/api/proxy?name=${encodeURIComponent(name)}&tag=${encodeURIComponent(tag)}`);
                    const data: SummonerResponse = await res.json();

                    if (spinner) spinner.classList.add('d-none');

                    if (data.status) {
                        if (content) {
                            content.innerHTML = `<h3 class="text-danger fw-bold brand-font">SUMMONER NOT FOUND</h3><p class="text-muted">Check spelling and region.</p>`;
                        }
                    } else {
                        if (content) {
                            content.innerHTML = `
                                <div class="card hex-card p-5 mx-auto animate-in" style="max-width: 500px; border: 1px solid var(--hex-gold);">
                                    <img src="https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/profile-icons/29.jpg" 
                                         class="rounded-circle mx-auto mb-4 border border-2 border-warning shadow-lg" width="120">
                                    <h2 class="brand-font text-warning fw-bold mb-1">${data.gameName || 'Unknown'}</h2>
                                    <span class="badge bg-secondary mb-4 px-3 py-2">#${data.tagLine || ''}</span>
                                    
                                    <div class="bg-dark p-4 rounded-4 text-start border border-secondary">
                                        <small class="text-muted d-block fw-bold mb-1">ENCRYPTED PUUID</small>
                                        <code class="text-white text-break" style="font-size: 0.85rem;">${data.puuid || ''}</code>
                                    </div>
                                    <button class="btn btn-warning btn-pill w-100 mt-4 fw-bold" onclick="alert('Match History feature coming soon!')">VIEW MATCH HISTORY</button>
                                </div>
                            `;
                        }
                    }
                } catch (err) {
                    if (spinner) spinner.classList.add('d-none');
                    if (content) {
                        content.innerHTML = `<h3 class="text-danger brand-font">CONNECTION ERROR</h3><p class="text-muted">Ensure the Python Backend is running.</p>`;
                    }
                }
            }
        });
    }

    // --- 3. FILTER LOGIC ---
    window.filterPatch = function(category: string, btn: HTMLElement): void {
        document.querySelectorAll('#homePage .filter-btn').forEach((b: Element): void => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        document.querySelectorAll('.patch-card').forEach((card: Element): void => {
            (card as HTMLElement).style.display = (category === 'all' || card.classList.contains(category)) ? 'block' : 'none';
        });
    };

    window.filterTrend = function(category: string, btn: HTMLElement): void {
        document.querySelectorAll('#trendPage .filter-btn').forEach((b: Element): void => {
            b.classList.remove('active');
        });
        btn.classList.add('active');
        document.querySelectorAll('.trend-card').forEach((card: Element): void => {
            (card as HTMLElement).style.display = (category === 'all' || card.classList.contains(category)) ? 'block' : 'none';
        });
    };

    // --- 4. THEME & FONT ---
    window.toggleTheme = function(): void {
        const body = document.body;
        const toggle = document.getElementById('darkModeToggle') as HTMLInputElement | null;
        const icon = document.getElementById('darkModeIcon');
        
        if (!toggle) return;
        
        if (!toggle.checked) {
            body.classList.add('light-mode');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            body.classList.remove('light-mode');
            if (icon) icon.className = 'fas fa-moon';
        }
        
        try {
            localStorage.setItem('hexgate-darkmode', toggle.checked ? 'dark' : 'light');
        } catch (e) {
            console.error('Failed to save dark mode preference:', e);
        }
        
        // Re-apply language to ensure text visibility
        if (window._currentLang && window.applyLanguage) {
            setTimeout((): void => {
                window.applyLanguage(window._currentLang);
            }, 100);
        }
    };

    // Champion Theme Switcher
    window.setTheme = function(themeName: ThemeName, btnElement?: HTMLElement | null): void {
        const body = document.body;
        // Remove all theme classes
        body.classList.remove('theme-ahri', 'theme-yasuo', 'theme-garen', 'theme-kalista');
        // Add selected theme
        if (themeName && themeName !== 'default') {
            body.classList.add('theme-' + themeName);
        }
        // Update active button
        document.querySelectorAll('.theme-btn').forEach((btn: Element): void => {
            btn.classList.remove('active', 'border-[var(--hex-gold)]');
        });
        if (btnElement) {
            btnElement.classList.add('active');
        }
        try {
            localStorage.setItem('hexgate-theme', themeName || 'default');
        } catch (e) {
            console.error('Failed to save theme preference:', e);
        }
    };

    // Load saved theme on page load
    document.addEventListener('DOMContentLoaded', function(): void {
        try {
            const savedTheme = localStorage.getItem('hexgate-theme') as ThemeName | null;
            if (savedTheme && savedTheme !== 'default') {
                setTimeout((): void => {
                    const btn = document.querySelector(`[data-theme="${savedTheme}"]`) as HTMLElement | null;
                    if (btn) window.setTheme(savedTheme, btn);
                }, 100);
            }
            const savedDarkMode = localStorage.getItem('hexgate-darkmode');
            if (savedDarkMode === 'light') {
                const toggle = document.getElementById('darkModeToggle') as HTMLInputElement | null;
                if (toggle) {
                    toggle.checked = false;
                    window.toggleTheme();
                }
            }
        } catch (e) {
            console.error('Failed to load saved preferences:', e);
        }
    });

    window.changeFont = function(fontName: string, btn: HTMLElement): void {
        const parent = btn.parentElement;
        if (parent) {
            parent.querySelectorAll('button').forEach((b: Element): void => {
                b.classList.remove('active');
            });
        }
        btn.classList.add('active');
        document.body.style.fontFamily = fontName === 'Cinzel' ? "'Cinzel', serif" : "'DM Sans', system-ui, sans-serif";
    };

    // --- 5. AUTH ---
    window.enterDashboard = function(): void {
        const loginPhase = document.getElementById('loginPhase');
        const dashboardPhase = document.getElementById('dashboardPhase');
        if (loginPhase) {
            loginPhase.classList.add('d-none');
            loginPhase.classList.remove('d-flex');
        }
        if (dashboardPhase) dashboardPhase.classList.remove('d-none');
    };

    window.logout = function(): void {
        const loginPhase = document.getElementById('loginPhase');
        const dashboardPhase = document.getElementById('dashboardPhase');
        if (dashboardPhase) dashboardPhase.classList.add('d-none');
        if (loginPhase) {
            loginPhase.classList.remove('d-none');
            loginPhase.classList.add('d-flex');
        }
    };

    // --- 6. UPLOAD LOGIC ---
    const fileInput = document.getElementById('fileInput') as HTMLInputElement | null;
    const uploadText = document.getElementById('uploadText');
    const fileName = document.getElementById('fileName');
    const uploadIcon = document.getElementById('uploadIcon');

    if (fileInput && fileName && uploadText && uploadIcon) {
        fileInput.addEventListener('change', function(e: Event): void {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                fileName.textContent = `${file.name} (${fileSize} MB)`;
                fileName.classList.remove('hidden');
                uploadText.textContent = 'File selected';
                uploadIcon.className = 'fas fa-check-circle text-4xl text-green-500 mb-3';
            } else {
                fileName.textContent = '';
                fileName.classList.add('hidden');
                uploadText.textContent = 'Click to upload clip';
                uploadIcon.className = 'fas fa-cloud-upload-alt text-4xl text-gray-500 mb-3';
            }
        });
    }

    const uploadForm = document.getElementById('uploadForm') as HTMLFormElement | null;
    if (uploadForm) {
        uploadForm.addEventListener('submit', (e: Event): void => {
            e.preventDefault();
            const gameRadio = document.querySelector('input[name="game"]:checked') as HTMLInputElement | null;
            const heroInput = document.getElementById('heroName') as HTMLInputElement | null;
            const captionInput = document.getElementById('caption') as HTMLInputElement | null;
            
            const game: GameType = (gameRadio?.value as GameType) || 'lol';
            const hero: string = heroInput?.value || '';
            const caption: string = captionInput?.value || '';
            const file: File | undefined = fileInput?.files?.[0];
            
            if (!file && !hero) {
                if (window.showToast) {
                    window.showToast('Please select a file or enter a champion/agent name', 'warning');
                } else {
                    alert('Please select a file or enter a champion/agent name');
                }
                return;
            }

            const badgeClass: string = game === 'lol' ? 'lol' : 'val';
            const badgeText: string = game === 'lol' ? 'LEAGUE' : 'VALORANT';
            let bgImage: string = game === 'lol' 
                ? 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg' 
                : 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt6f13e593926ba19d/65a0459d2f2604085427d110/Valorant_Ep8_Act1_Thumbnail.jpg';
            
            // If file is selected, create preview
            let filePreview: string = '';
            if (file) {
                const fileURL = URL.createObjectURL(file);
                if (file.type.startsWith('image/')) {
                    bgImage = fileURL;
                } else if (file.type.startsWith('video/')) {
                    filePreview = `<video class="hex-card-img h-40 bg-cover bg-center object-cover" controls><source src="${fileURL}" type="${file.type}"></video>`;
                }
            }

            const newCard: string = `
                <div class="col-md-4">
                    <div class="card hex-card h-100 rounded-2xl border border-[var(--hex-border)] bg-[var(--hex-panel)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[var(--hex-gold)]">
                        ${filePreview || `<div class="hex-card-img h-40 bg-cover bg-center" style="background-image: url('${bgImage}')">
                            <span class="hex-badge absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-extrabold text-white ${badgeClass === 'lol' ? 'bg-[#0ac8b9]' : 'bg-[#ff4655]'}">${badgeText}</span>
                        </div>`}
                        <div class="p-4">
                            <h5 class="font-bold brand-font text-[var(--hex-gold)]">${hero || 'Untitled'}</h5>
                            <p class="text-gray-500 text-sm mt-1">${caption || 'No caption'}</p>
                        </div>
                    </div>
                </div>
            `;
            
            const emptyState = document.getElementById('emptyState');
            const clipsFeed = document.getElementById('clipsFeed');
            if (emptyState) emptyState.remove();
            if (clipsFeed) clipsFeed.insertAdjacentHTML('afterbegin', newCard);
            
            const modalEl = document.getElementById('uploadModal');
            if (modalEl) modalEl.classList.add('d-none');
            
            // Show success toast
            if (window.showToast) {
                window.showToast('Clip uploaded successfully!', 'success');
            }
            
            // Clear draft
            try {
                localStorage.removeItem('hexgate-upload-draft');
            } catch (e) {
                console.error('Failed to clear draft:', e);
            }
            
            // Reset form
            uploadForm.reset();
            if (fileInput) fileInput.value = '';
            if (fileName) {
                fileName.textContent = '';
                fileName.classList.add('hidden');
            }
            if (uploadText) uploadText.textContent = 'Click to upload clip';
            if (uploadIcon) uploadIcon.className = 'fas fa-cloud-upload-alt text-4xl text-gray-500 mb-3';
        });
    }
});
