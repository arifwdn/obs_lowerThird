const wrapper = document.getElementById('lt-wrapper');
        const nameEl = document.getElementById('lt-name');
        const titleEl = document.getElementById('lt-title');

        // Fungsi memuat data teks dari LocalStorage
        function loadData() {
            if(localStorage.getItem('lt_name')) {
                nameEl.innerText = localStorage.getItem('lt_name');
            }
            if(localStorage.getItem('lt_title')) {
                titleEl.innerText = localStorage.getItem('lt_title');
            }
        }

        // Dengar perubahan dari controller
        window.addEventListener('storage', function(e) {
            if (e.key === 'lt_timestamp') {
                loadData();
            }
            
            if (e.key === 'lt_action_timestamp') {
                const action = localStorage.getItem('lt_action');
                if(action === 'show') {
                    wrapper.classList.add('active');
                } else if(action === 'hide') {
                    wrapper.classList.remove('active');
                }
            }
        });

        // Load data awal saat OBS meload halaman ini
        loadData();