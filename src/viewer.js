const container = document.getElementById('lower-third-container');
const mainNameTxt = document.getElementById('main-name');
const subTitleTxt = document.getElementById('sub-title');
const logoZone = document.getElementById('logo-zone');
const displayLogo = document.getElementById('display-logo');

window.addEventListener('storage', function(e) {
    if (e.key === 'l3_live_stream_rgba') {
        const data = JSON.parse(e.newValue);
        
        if (data && data.show) {
            // 1. Ganti Konten Teks
            mainNameTxt.innerText = data.name;
            subTitleTxt.innerText = data.sub || "";

            // 2. Suntik Properti Style RGBA & Ukuran Dinamis
            if (data.styles) {
                const st = data.styles;
                
                // Gambar Latar / Warna Latar
                if (data.bg) {
                    container.style.backgroundImage = `url('${data.bg}')`;
                    container.style.backgroundColor = "transparent";
                } else {
                    container.style.backgroundImage = 'none';
                    container.style.backgroundColor = st.rgbaBg;
                }

                // Warna Garis Batas Kiri & Garis Pembatas Internal Logo
                container.style.borderColor = st.rgbaBorder;
                logoZone.style.borderColor = st.rgbaBorder;

                // Mengatur Style Nama Utama
                mainNameTxt.style.color = st.rgbaName;
                mainNameTxt.style.fontSize = st.nameSize;
                mainNameTxt.style.fontWeight = st.nameBold;
                mainNameTxt.style.fontStyle = st.nameItalic;

                // Mengatur Style Subtitle
                subTitleTxt.style.color = st.rgbaSub;
                subTitleTxt.style.fontSize = st.subSize;
                subTitleTxt.style.fontWeight = st.subBold;
                subTitleTxt.style.fontStyle = st.subItalic;
            }

            // 3. Kontrol Visibilitas Logo
            if (data.logo) {
                displayLogo.src = data.logo;
                logoZone.style.display = "block";
            } else {
                logoZone.style.display = "none";
            }

            // Jalankan animasi masuk
            container.classList.add('active');
        } else {
            // Jalankan animasi keluar
            container.classList.remove('active');
        }
    }
});