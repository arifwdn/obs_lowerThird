let logoBase64 = "";
let bgBase64 = "";
let speakersDatabase = [];
let activeSpeakerId = null;

// Fungsi Helper: Mengonversi HEX dan Alpha Slider menjadi string RGBA
function getRgbaValue(hexId, opacityId) {
    const hex = document.getElementById(hexId).value;
    const alpha = document.getElementById(opacityId).value;
    
    let c = hex.substring(1).split('');
    if(c.length === 3){
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    
    const r = (c >> 16) & 255;
    const g = (c >> 8) & 255;
    const b = c & 255;
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Listener file gambar
document.getElementById('logoInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) { logoBase64 = ev.target.result; autoUpdateLive(); };
        reader.readAsDataURL(file);
    }
});

document.getElementById('bgInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(ev) { bgBase64 = ev.target.result; autoUpdateLive(); };
        reader.readAsDataURL(file);
    }
});

// Daftarkan auto-update real-time untuk input gaya kustomisasi
const allInputs = [
    'bgColor', 'bgOpacity', 'borderColor', 'borderOpacity',
    'nameColor', 'nameOpacity', 'nameSize', 'nameBold', 'nameItalic',
    'subColor', 'subOpacity', 'subSize', 'subBold', 'subItalic'
];
allInputs.forEach(id => {
    document.getElementById(id).addEventListener('input', autoUpdateLive);
});

function autoUpdateLive() {
    if (activeSpeakerId) updateOBS();
}

function addSpeaker() {
    const nameInput = document.getElementById('speakerName');
    const subInput = document.getElementById('speakerSub');
    if (!nameInput.value.trim()) return;

    speakersDatabase.push({
        id: Date.now().toString(),
        name: nameInput.value,
        sub: subInput.value
    });
    saveDatabase();
    renderTable();
    nameInput.value = ""; subInput.value = "";
}

function deleteSpeaker(id) {
    speakersDatabase = speakersDatabase.filter(s => s.id !== id);
    if (activeSpeakerId === id) clearLowerThird();
    saveDatabase();
    renderTable();
}

function showToOBS(id) {
    activeSpeakerId = id;
    renderTable();
    updateOBS();
}

function updateOBS() {
    const speaker = speakersDatabase.find(s => s.id === activeSpeakerId);
    if (!speaker) return;

    const dataToOBS = {
        show: true,
        activeId: activeSpeakerId,
        name: speaker.name,
        sub: speaker.sub,
        logo: logoBase64,
        bg: bgBase64,
        styles: {
            rgbaBg: getRgbaValue('bgColor', 'bgOpacity'),
            rgbaBorder: getRgbaValue('borderColor', 'borderOpacity'),
            rgbaName: getRgbaValue('nameColor', 'nameOpacity'),
            rgbaSub: getRgbaValue('subColor', 'subOpacity'),
            nameSize: document.getElementById('nameSize').value + 'px',
            nameBold: document.getElementById('nameBold').checked ? 'bold' : 'normal',
            nameItalic: document.getElementById('nameItalic').checked ? 'italic' : 'normal',
            subSize: document.getElementById('subSize').value + 'px',
            subBold: document.getElementById('subBold').checked ? 'bold' : 'normal',
            subItalic: document.getElementById('subItalic').checked ? 'italic' : 'normal',
        },
        timestamp: Date.now()
    };

    localStorage.setItem('l3_live_stream_rgba', JSON.stringify(dataToOBS));
}

function clearLowerThird() {
    activeSpeakerId = null;
    renderTable();
    localStorage.setItem('l3_live_stream_rgba', JSON.stringify({ show: false, timestamp: Date.now() }));
}

function saveDatabase() {
    localStorage.setItem('l3_speakers_db', JSON.stringify(speakersDatabase));
}

function renderTable() {
    const tbody = document.getElementById('speaker-table-body');
    tbody.innerHTML = "";
    speakersDatabase.forEach(speaker => {
        const isLive = speaker.id === activeSpeakerId;
        const tr = document.createElement('tr');
        if (isLive) tr.className = 'active-row';
        tr.innerHTML = `
            <td><strong>${speaker.name}</strong></td>
            <td>${speaker.sub}</td>
            <td class="actions">
                <button class="btn-success" onclick="showToOBS('${speaker.id}')">${isLive ? 'LIVE' : 'TAYANG'}</button>
                <button class="btn-danger" onclick="deleteSpeaker('${speaker.id}')">Hapus</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Inisialisasi awal database dari localStorage saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    const savedDb = localStorage.getItem('l3_speakers_db');
    if (savedDb) { speakersDatabase = JSON.parse(savedDb); renderTable(); }
});