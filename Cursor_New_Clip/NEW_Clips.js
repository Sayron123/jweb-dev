document.addEventListener('DOMContentLoaded', () => {
    
    // --- 0. CONFIGURATION (AUTO-DETECT) ---
    // We use a relative path so it works on Localhost AND Render automatically
    const API_BASE_URL = ""; 

    // --- 1. PAGE NAVIGATION ---
    window.showPage = function(pageName, btnElement) {
        const pages = ['homePage', 'trendPage', 'clipsPage', 'aboutPage', 'searchPage'];
        
        pages.forEach(p => {
            const el = document.getElementById(p);
            if(el) el.classList.add('d-none');
        });

        const selected = document.getElementById(pageName + 'Page');
        if(selected) selected.classList.remove('d-none');

        // Only highlight the nav link for the current page (Home, Trend, Clips, About)
        if (btnElement) {
            document.querySelectorAll('.nav-page-link').forEach(link => link.classList.remove('active'));
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
        const icon = document.getElementById('darkModeIcon');
        if (!toggle.checked) {
            body.classList.add('light-mode');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            body.classList.remove('light-mode');
            if (icon) icon.className = 'fas fa-moon';
        }
        try { localStorage.setItem('hexgate-darkmode', toggle.checked ? 'dark' : 'light'); } catch (e) {}
        
        // Re-apply language to ensure text visibility
        if (window._currentLang && window.applyLanguage) {
            setTimeout(() => window.applyLanguage(window._currentLang), 100);
        }
    };

    // Champion Theme Switcher
    window.setTheme = function(themeName, btnElement) {
        const body = document.body;
        // Remove all theme classes
        body.classList.remove('theme-ahri', 'theme-yasuo', 'theme-garen', 'theme-kalista');
        // Add selected theme
        if (themeName && themeName !== 'default') {
            body.classList.add('theme-' + themeName);
        }
        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.remove('active', 'border-[var(--hex-gold)]');
        });
        if (btnElement) {
            btnElement.classList.add('active');
        }
        try { localStorage.setItem('hexgate-theme', themeName || 'default'); } catch (e) {}
    };

    // Load saved theme on page load
    document.addEventListener('DOMContentLoaded', function() {
        try {
            const savedTheme = localStorage.getItem('hexgate-theme');
            if (savedTheme && savedTheme !== 'default') {
                setTimeout(() => {
                    const btn = document.querySelector(`[data-theme="${savedTheme}"]`);
                    if (btn) window.setTheme(savedTheme, btn);
                }, 100);
            }
            const savedDarkMode = localStorage.getItem('hexgate-darkmode');
            if (savedDarkMode === 'light') {
                const toggle = document.getElementById('darkModeToggle');
                if (toggle) {
                    toggle.checked = false;
                    window.toggleTheme();
                }
            }
        } catch (e) {}
    });

    window.changeFont = function(fontName, btn) {
        btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.body.style.fontFamily = fontName === 'Cinzel' ? "'Cinzel', serif" : "'DM Sans', system-ui, sans-serif";
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
    const fileInput = document.getElementById('fileInput');
    const uploadText = document.getElementById('uploadText');
    const fileName = document.getElementById('fileName');
    const uploadIcon = document.getElementById('uploadIcon');

    if (fileInput && fileName && uploadText && uploadIcon) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
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

    const uploadForm = document.getElementById('uploadForm');
    if(uploadForm) {
        uploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const game = document.querySelector('input[name="game"]:checked').value;
            const hero = document.getElementById('heroName').value;
            const caption = document.getElementById('caption').value;
            const file = fileInput?.files[0];
            
            if (!file && !hero) {
                if (window.showToast) {
                    window.showToast('Please select a file or enter a champion/agent name', 'warning');
                } else {
                    alert('Please select a file or enter a champion/agent name');
                }
                return;
            }

            let badgeClass = game === 'lol' ? 'lol' : 'val';
            let badgeText = game === 'lol' ? 'LEAGUE' : 'VALORANT';
            let bgImage = game === 'lol' ? 'https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Jinx_0.jpg' : 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt6f13e593926ba19d/65a0459d2f2604085427d110/Valorant_Ep8_Act1_Thumbnail.jpg';
            
            // If file is selected, create preview
            let filePreview = '';
            if (file) {
                const fileURL = URL.createObjectURL(file);
                if (file.type.startsWith('image/')) {
                    bgImage = fileURL;
                } else if (file.type.startsWith('video/')) {
                    filePreview = `<video class="hex-card-img h-40 bg-cover bg-center object-cover" controls><source src="${fileURL}" type="${file.type}"></video>`;
                }
            }

            const newCard = `
                <div class="col-md-4">
                    <div class="clip-card card hex-card h-100 rounded-2xl border border-[var(--hex-border)] bg-[var(--hex-panel)] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[var(--hex-gold)] relative">
                        <div class="clip-menu-container absolute top-2 right-2 text-right z-[2]">
                            <button class="clip-menu-toggle text-gray-300 hover:text-[var(--hex-gold)]" type="button">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <div class="clip-menu d-none mt-2 w-40 rounded-xl bg-[var(--hex-panel)] border border-[var(--hex-border)] shadow-lg text-sm text-[var(--hex-text)]">
                                <button type="button" class="clip-menu-item w-full text-left px-4 py-2 hover:bg-white/10" data-action="edit">Edit</button>
                                <button type="button" class="clip-menu-item w-full text-left px-4 py-2 hover:bg-white/10" data-action="toggle-visibility">Make Private</button>
                                <button type="button" class="clip-menu-item w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10" data-action="delete">Delete</button>
                            </div>
                        </div>
                        ${filePreview || `<div class="hex-card-img h-40 bg-cover bg-center" style="background-image: url('${bgImage}')">
                            <span class="hex-badge absolute top-2.5 left-2.5 px-3 py-1 rounded-full text-xs font-extrabold text-white ${badgeClass === 'lol' ? 'bg-[#0ac8b9]' : 'bg-[#ff4655]'}">${badgeText}</span>
                        </div>`}
                        <div class="p-4">
                            <h5 class="font-bold brand-font text-[var(--hex-gold)]">${hero || 'Untitled'}</h5>
                            <p class="text-gray-500 text-sm mt-1">${caption || 'No caption'}</p>
                            <p class="clip-visibility text-xs text-gray-500 mt-2">Status: Public</p>
                        </div>
                    </div>
                </div>
            `;
            document.getElementById('emptyState')?.remove();
            document.getElementById('clipsFeed').insertAdjacentHTML('afterbegin', newCard);
            
            const modalEl = document.getElementById('uploadModal');
            if (modalEl) modalEl.classList.add('d-none');
            
            // Show success toast
            if (window.showToast) {
                window.showToast('Clip uploaded successfully!', 'success');
            }
            
            // Clear draft
            try {
                localStorage.removeItem('hexgate-upload-draft');
            } catch (e) {}
            
            // Reset form
            e.target.reset();
            if (fileInput) fileInput.value = '';
            if (fileName) {
                fileName.textContent = '';
                fileName.classList.add('hidden');
            }
            if (uploadText) uploadText.textContent = 'Click to upload clip';
            if (uploadIcon) uploadIcon.className = 'fas fa-cloud-upload-alt text-4xl text-gray-500 mb-3';
        });
    }

    // --- 7. CLIP ACTION MENU (Edit / Delete / Public-Private) ---
    const clipsFeedEl = document.getElementById('clipsFeed');
    if (clipsFeedEl) {
        clipsFeedEl.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement)) return;

            // Toggle menu open/close
            const toggleBtn = target.closest('.clip-menu-toggle');
            if (toggleBtn) {
                const menu = toggleBtn.parentElement?.querySelector('.clip-menu');
                if (menu) {
                    menu.classList.toggle('d-none');
                }
                return;
            }

            // Handle menu item actions
            const menuItem = target.closest('.clip-menu-item');
            if (!menuItem) return;

            const action = menuItem.getAttribute('data-action');
            const card = menuItem.closest('.clip-card');
            if (!card) return;

            // Always close the menu after an action
            const menu = menuItem.closest('.clip-menu');
            if (menu) menu.classList.add('d-none');

            if (action === 'delete') {
                const col = card.closest('.col-md-4');
                if (col && col.parentElement) {
                    col.parentElement.removeChild(col);
                }
                return;
            }

            if (action === 'edit') {
                const titleEl = card.querySelector('h5');
                const captionEl = card.querySelector('p.text-gray-500');
                const currentTitle = titleEl?.textContent || '';
                const currentCaption = captionEl?.textContent || '';

                const newTitle = prompt('Edit title', currentTitle);
                if (newTitle !== null && newTitle.trim() !== '' && titleEl) {
                    titleEl.textContent = newTitle.trim();
                }

                const newCaption = prompt('Edit caption', currentCaption);
                if (newCaption !== null && newCaption.trim() !== '' && captionEl) {
                    captionEl.textContent = newCaption.trim();
                }
                return;
            }

            if (action === 'toggle-visibility') {
                const visibilityEl = card.querySelector('.clip-visibility');
                const isPrivate = card.getAttribute('data-private') === 'true';
                const nowPrivate = !isPrivate;
                card.setAttribute('data-private', nowPrivate ? 'true' : 'false');

                if (visibilityEl) {
                    visibilityEl.textContent = 'Status: ' + (nowPrivate ? 'Private' : 'Public');
                }

                // Update menu text
                if (menuItem) {
                    menuItem.textContent = nowPrivate ? 'Make Public' : 'Make Private';
                }
                return;
            }
        });
    }

    // --- 8. GAME CATEGORY VISUAL STATE (ensure only one looks selected) ---
    const gameRadios = document.querySelectorAll('input[name="game"]');
    function updateGameLabels() {
        gameRadios.forEach((radio) => {
            const input = radio;
            if (!(input instanceof HTMLInputElement)) return;
            const label = document.querySelector(`label[for="${input.id}"]`);
            if (!(label instanceof HTMLElement)) return;
            if (input.checked) {
                label.classList.add('game-label-selected');
            } else {
                label.classList.remove('game-label-selected');
            }
        });
    }
    if (gameRadios.length) {
        gameRadios.forEach((radio) => {
            radio.addEventListener('change', updateGameLabels);
        });
        updateGameLabels();
    }
});