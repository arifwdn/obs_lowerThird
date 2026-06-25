const lowerThird = document.getElementById('lower-third');
const viewTitle = document.getElementById('view-title');
const viewDesc = document.getElementById('view-desc');

let runTimeout; // Menyimpan timeout untuk siklus show/hide

function updateViewer() {
    const data = JSON.parse(localStorage.getItem('lt_data'));
    if (!data) return;

    // Terapkan durasi transisi masuk/keluar (IN-OUT)
    lowerThird.style.transition = `all ${data.settings.inout}s ease-in-out`;

    // Ambil nilai pengaturan waktu (konversi ke milidetik)
    const durationInOut = data.settings.inout * 1000;
    const durationActive = data.settings.active * 1000;
    const durationInterval = data.settings.interval * 1000;

    // Bersihkan semua jadwal animasi sebelumnya agar tidak bentrok
    clearTimeout(runTimeout);

    if (data.status === "show") {
        // Tampilkan teks terbaru
        viewTitle.innerText = data.live.title;
        viewDesc.innerText = data.live.desc;

        // Mulai siklus penampilan otomatis
        startLoop(durationActive, durationInterval, durationInOut);
    } else {
        // Jika status HIDE, langsung sembunyikan
        lowerThird.classList.add('hide');
    }
}

function startLoop(activeTime, intervalTime, inoutTime) {
    // 1. Munculkan Lower Third
    lowerThird.classList.remove('hide');

    // Jika ACTIVE diatur ke 0, maka lower third akan muncul terus tanpa hilang (kecuali di-klik HIDE)
    if (activeTime <= 0) return;

    // 2. Jadwalkan untuk menyembunyikan setelah waktu ACTIVE selesai
    runTimeout = setTimeout(() => {
        lowerThird.classList.add('hide');

        // Cek apakah fitur INTERVAL aktif (> 0 detik)
        if (intervalTime > 0) {
            // 3. Jika INTERVAL aktif, tunggu sampai durasi interval + durasi animasi keluar selesai, lalu ulangi lagi
            runTimeout = setTimeout(() => {
                // Ambil data terbaru dari localStorage untuk memastikan statusnya masih "show"
                const currentData = JSON.parse(localStorage.getItem('lt_data'));
                if (currentData && currentData.status === "show") {
                    startLoop(activeTime, intervalTime, inoutTime); // Panggil fungsi ini lagi (looping)
                }
            }, intervalTime + inoutTime);
        } else {
            // Jika INTERVAL = 0, ubah status di controller menjadi 'hide' setelah beres tampil sekali
            const data = JSON.parse(localStorage.getItem('lt_data'));
            if (data) {
                data.status = "hide";
                localStorage.setItem('lt_data', JSON.stringify(data));
            }
        }

    }, activeTime);
}

// Mendeteksi perubahan data dari controller secara real-time
window.addEventListener('storage', (e) => {
    if (e.key === 'lt_data') {
        updateViewer();
    }
});

// Jalankan fungsi saat browser source pertama kali dimuat
window.onload = () => {
    updateViewer();
};