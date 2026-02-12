const API_BASE_URL = "https://web-rclips.onrender.com"; 


//  PHASE LOGIC 
function enterDashboard() {
    document.getElementById('loginPhase').style.display = 'none';
    document.getElementById('dashboardPhase').style.display = 'flex';
}

function logout() {
    document.getElementById('dashboardPhase').style.display = 'none';
    document.getElementById('loginPhase').style.display = 'flex';
}

// --- 2. ACCOUNT VERIFICATION LOGIC (PLACE IT HERE) ---
document.getElementById('verifyBtn').addEventListener('click', async () => {
    const name = document.getElementById('riotIdInput').value;
    const status = document.getElementById('verifyStatus');
    
    if (!name) {
        status.textContent = "Please enter a Summoner Name.";
        return;
    }

    status.style.color = "#888";
    status.textContent = "Connecting to Hexgate Core...";

    try {
        const response = await fetch(`${API_BASE_URL}/api/proxy?name=${encodeURIComponent(name)}`);
        const data = await response.json();

        if (response.ok) {
            status.style.color = "#0ac8b9";
            status.textContent = `Found: ${data.name}. Level ${data.summonerLevel}`;
            
            setTimeout(() => enterDashboard(), 1500);
        } else {
            status.style.color = "#d02e36";
            status.textContent = "Summoner not found. Check spelling.";
        }
    } catch (error) {
        status.style.color = "#d02e36";
        status.textContent = "Server connection failed.";
    }
});

//  NEWS TABS 
function filterNews(category, event) {
    const allNews = document.querySelectorAll('.news-card');
    const buttons = document.querySelectorAll('.tab-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');

    allNews.forEach(card => {
        // Don't hide our new Clips, only hide News Items inside the News Grid
        if (card.closest('#clipsFeed')) return; 

        if (category === 'all') {
            card.style.display = 'block';
        } else {
            if (card.classList.contains(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

//  MODALS 
function openUploadModal() { document.getElementById('uploadModal').style.display = 'flex'; }
function closeUploadModal() { document.getElementById('uploadModal').style.display = 'none'; }
function openSettings() { document.getElementById('settingsModal').style.display = 'flex'; }
function closeSettings() { document.getElementById('settingsModal').style.display = 'none'; }

// File Selection Preview
document.getElementById('fileInput').addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || "No file selected";
    document.getElementById('fileName').textContent = fileName;
});

// ADD CLIP LOGIC 
document.getElementById('uploadForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const file = document.getElementById('fileInput').files[0];
    const game = document.querySelector('input[name="game"]:checked').value;
    const hero = document.getElementById('heroName').value;
    const caption = document.getElementById('caption').value;

    if (!file) {
        alert("Please attach a video or image file!");
        return;
    }

    // Create a fake URL to display the file locally
    const fileURL = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video');

    const clipHTML = `
        <div class="news-card clip-item">
            <div class="news-image" style="height: 200px; background: #000; display: flex; align-items: center; justify-content: center;">
                ${isVideo 
                    ? `<video src="${fileURL}" controls style="width:100%; height:100%; object-fit: cover;"></video>` 
                    : `<img src="${fileURL}" style="width:100%; height:100%; object-fit: cover;">`
                }
            </div>
            <div class="news-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                    <span class="news-tag tag-${game}">${game === 'lol' ? 'LEAGUE' : 'VALORANT'}</span>
                    <span style="font-size: 11px; color: #888;">${hero}</span>
                </div>
                <h3>${caption}</h3>
                <div style="margin-top: 10px; display: flex; gap: 15px; color: #666; font-size: 12px;">
                    <span><i class="fas fa-heart"></i> 0</span>
                    <span><i class="fas fa-comment"></i> 0</span>
                    <span style="cursor:pointer;" onclick="alert('Shared!')"><i class="fas fa-share"></i> Share</span>
                </div>
            </div>
        </div>
    `;

    document.getElementById('clipsFeed').insertAdjacentHTML('afterbegin', clipHTML);
    
    closeUploadModal();
    e.target.reset();
    document.getElementById('fileName').textContent = "";
});

// --- 5. SETTINGS ---
function changeFont(fontName) {
    document.body.style.fontFamily = fontName + ", sans-serif";
}