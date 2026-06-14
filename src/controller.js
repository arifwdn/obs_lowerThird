// Database pembicara bawaan awal
let speakers = [
    { name: "Ustadz Dr. H. Ahmad Fauzi", title: "Kajian Rutin: Menjaga Keikhlasan Hati" },
    { name: "Prof. KH. Syukron Ma'mun", title: "Tafsir Al-Qur'an Surah Al-Hujurat" }
];

window.onload = function() {
    if(localStorage.getItem('db_speakers_v2')) {
        speakers = JSON.parse(localStorage.getItem('db_speakers_v2'));
    }
    renderList();
    loadLiveDisplay();
};

function renderList() {
    const listArea = document.getElementById('speaker-list-area');
    listArea.innerHTML = '';

    speakers.forEach((sp, index) => {
        const item = document.createElement('div');
        item.className = 'list-item';
        item.innerHTML = `
            <div class="item-info">
                <div class="item-name">${sp.name}</div>
                <div class="item-title">${sp.title}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-sm btn-list-show" onclick="liveDirect(${index})">SHOW</button>
                <button class="btn btn-sm btn-list-hide" onclick="triggerAction('hide')">HIDE</button>
                <button class="btn btn-sm btn-list-del" onclick="deleteSpeaker(${index})">❌</button>
            </div>
        `;
        listArea.appendChild(item);
    });

    localStorage.setItem('db_speakers_v2', JSON.stringify(speakers));
}

function addSpeaker() {
    const name = document.getElementById('input-name').value.trim();
    const title = document.getElementById('input-title').value.trim();

    if(!name || !title) return alert("Nama dan sub-title wajib diisi!");

    speakers.push({ name, title });
    document.getElementById('input-name').value = '';
    document.getElementById('input-title').value = '';
    renderList();
}

function deleteSpeaker(index) {
    if(confirm("Hapus pembicara dari list?")) {
        speakers.splice(index, 1);
        renderList();
    }
}

// Fungsi tombol 'SHOW' di samping list pembicara
function liveDirect(index) {
    const selected = speakers[index];
    
    // Update data live di localStorage
    localStorage.setItem('lt_name', selected.name);
    localStorage.setItem('lt_title', selected.title);
    localStorage.setItem('lt_timestamp', Date.now());
    
    // Update tampilan di layar HP controller
    loadLiveDisplay();

    // Pemicu animasi masuk
    triggerAction('show');
}

function loadLiveDisplay() {
    if(localStorage.getItem('lt_name')) {
        document.getElementById('live-name-display').innerText = localStorage.getItem('lt_name');
        document.getElementById('live-title-display').innerText = localStorage.getItem('lt_title');
    }
}

function triggerAction(action) {
    localStorage.setItem('lt_action', action);
    
    // Ambil nilai setting auto-hide
    const autoHideCheck = document.getElementById('setting-auto-hide').checked;
    const duration = document.getElementById('setting-time').value || 7;
    
    localStorage.setItem('lt_autohide', autoHideCheck ? "true" : "false");
    localStorage.setItem('lt_duration', duration);
    
    localStorage.setItem('lt_action_timestamp', Date.now());
}