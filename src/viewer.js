const wrapper = document.getElementById('lt-wrapper');
const nameEl = document.getElementById('lt-name');
const titleEl = document.getElementById('lt-title');
let autoHideTimer = null;

function loadData() {
    if(localStorage.getItem('lt_name')) nameEl.innerText = localStorage.getItem('lt_name');
    if(localStorage.getItem('lt_title')) titleEl.innerText = localStorage.getItem('lt_title');
}

window.addEventListener('storage', function(e) {
    if (e.key === 'lt_timestamp') {
        loadData();
    }
    
    if (e.key === 'lt_action_timestamp') {
        const action = localStorage.getItem('lt_action');
        
        if (action === 'show') {
            wrapper.classList.add('active');
            
            // Logika Auto-Hide Durasi
            clearTimeout(autoHideTimer);
            const isAutoHide = localStorage.getItem('lt_autohide') === "true";
            if (isAutoHide) {
                const duration = parseInt(localStorage.getItem('lt_duration') || 7) * 1000;
                autoHideTimer = setTimeout(() => {
                    wrapper.classList.remove('active');
                }, duration);
            }
            
        } else if (action === 'hide') {
            clearTimeout(autoHideTimer);
            wrapper.classList.remove('active');
            
        } else if (action === 'reload') {
            // Fitur auto-reload halaman viewer OBS
            location.reload();
        }
    }
});

// Memuat data awal saat OBS dinyalakan
loadData();