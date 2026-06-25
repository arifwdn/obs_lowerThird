// Database sederhana menggunakan localStorage
let lowerThirdData = JSON.parse(localStorage.getItem('lt_data')) || {
    live: { title: "HABIB SYECH BIN ABDUL QODIR AS SEGAF", desc: "MAJELIS AHBAABUL MUSTHOFA" },
    settings: { inout: 1, active: 5, interval: 0 },
    lists: [
        { id: 1, title: "HABIB SYECH BIN ABDUL QODIR AS SEGAF", desc: "MAJELIS AHBAABUL MUSTHOFA" }
    ],
    status: "hide" // show atau hide
};

// Inisialisasi Tampilan awal
function init() {
    updateLiveDisplay();
    renderLists();
    fetchJadwalSholat();
    
    document.getElementById('setting-inout').value = lowerThirdData.settings.inout;
    document.getElementById('setting-active').value = lowerThirdData.settings.active;
    document.getElementById('setting-interval').value = lowerThirdData.settings.interval;

    // Event Listeners Kontrol Utama
    document.getElementById('btn-show-live').addEventListener('click', () => changeStatus("show"));
    document.getElementById('btn-hide-live').addEventListener('click', () => changeStatus("hide"));
    
    // Simpan & Reset Settings
    document.getElementById('btn-save-settings').addEventListener('click', saveSettings);
    document.getElementById('btn-reset-settings').addEventListener('click', resetSettings);
    
    // Tambah List Baru
    document.getElementById('btn-add-list').addEventListener('click', addList);
}

function saveData() {
    localStorage.setItem('lt_data', JSON.stringify(lowerThirdData));
}

function updateLiveDisplay() {
    document.getElementById('live-title').innerText = lowerThirdData.live.title;
    document.getElementById('live-desc').innerText = lowerThirdData.live.desc;
}

function changeStatus(status) {
    lowerThirdData.status = status;
    saveData();
}

function saveSettings() {
    lowerThirdData.settings.inout = parseFloat(document.getElementById('setting-inout').value) || 1;
    lowerThirdData.settings.active = parseInt(document.getElementById('setting-active').value) || 5;
    lowerThirdData.settings.interval = parseInt(document.getElementById('setting-interval').value) || 0;
    saveData();
    alert("Pengaturan Berhasil Disimpan!");
}

function resetSettings() {
    document.getElementById('setting-inout').value = 1;
    document.getElementById('setting-active').value = 5;
    document.getElementById('setting-interval').value = 0;
    saveSettings();
}

function addList() {
    const title = document.getElementById('input-title').value.trim();
    const desc = document.getElementById('input-desc').value.trim();
    
    if(title === "" || desc === "") {
        alert("Judul dan Deskripsi tidak boleh kosong!");
        return;
    }
    
    const newItem = {
        id: Date.now(),
        title: title,
        desc: desc
    };
    
    lowerThirdData.lists.push(newItem);
    saveData();
    renderLists();
    
    // Kosongkan form input
    document.getElementById('input-title').value = "";
    document.getElementById('input-desc').value = "";
}

function deleteItem(id) {
    lowerThirdData.lists = lowerThirdData.lists.filter(item => item.id !== id);
    saveData();
    renderLists();
}

function applyToLive(title, desc) {
    lowerThirdData.live.title = title;
    lowerThirdData.live.desc = desc;
    updateLiveDisplay();
    saveData();
}

function renderLists() {
    const container = document.getElementById('lists-container');
    container.innerHTML = "";
    
    lowerThirdData.lists.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = "list-item";
        itemEl.innerHTML = `
            <div class="item-title">${item.title}</div>
            <div class="item-desc">${item.desc}</div>
            <div class="action-container">
                <div class="btn-small-group">
                    <button class="btn btn-green btn-sm" onclick="applyToLive('${item.title.replace(/'/g, "\\'")}', '${item.desc.replace(/'/g, "\\'")}')">SHOW</button>
                    <button class="btn btn-red btn-sm" onclick="changeStatus('hide')">HIDE</button>
                </div>
                <button class="btn-delete" onclick="deleteItem(${item.id})">🗑️</button>
            </div>
        `;
        container.appendChild(itemEl);
    });
}

// Fitur Ambil Data API Waktu Sholat Muslim v3 (Menggunakan endpoint Sholat.org / api.myquran.com terupdate)
async function fetchJadwalSholat() {
    const kotaInput = document.getElementById('input-kota').value.trim().toLowerCase();
    const btn = document.getElementById('btn-fetch-sholat');
    if(!kotaInput) return alert("Ketik nama kota dulu!");

    btn.innerText = "LOADING...";
    btn.disabled = true;

    try {
        // Step 1: Cari ID Kota
        const searchRes = await fetch(`https://api.myquran.com/v2/sholat/kota/cari/${kotaInput}`);
        const searchData = await searchRes.json();
        
        if(!searchData.status || searchData.data.length === 0) {
            throw new Error("Kota tidak ditemukan.");
        }

        const idKota = searchData.data[0].id;
        const namaKota = searchData.data[0].lokasi;

        // Step 2: Dapatkan jadwal harian berdasarkan tanggal hari ini
        const tgl = new Date();
        const y = tgl.getFullYear();
        const m = String(tgl.getMonth() + 1).padStart(2, '0');
        const d = String(tgl.getDate()).padStart(2, '0');

        const sholatRes = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${idKota}/${y}/${m}/${d}`);
        const sholatData = await sholatRes.json();

        if(sholatData.data && sholatData.data.jadwal) {
            const j = sholatData.data.jadwal;
            const teksHasil = `✨ JADWAL SHOLAT UNTUK KOTA ${namaKota} & SEKITARNYA HARI INI -> IMSAK: ${j.imsak} | SUBUH: ${j.subuh} | TERBIT: ${j.terbit} | DZUHUR: ${j.dzuhur} | ASHAR: ${j.ashar} | MAGHRIB: ${j.maghrib} | ISYA: ${j.isya} --- Silakan laksanakan ibadah tepat pada waktunya.`;
            
            document.getElementById('running-text-preview').value = teksHasil;
            lowerThirdData.runningText = teksHasil;
            saveData();
        }

    } catch (error) {
        alert("Gagal memuat API Jadwal Sholat: " + error.message);
    } finally {
        btn.innerText = "🔄 GET DATA";
        btn.disabled = false;
    }
}

window.onload = init;