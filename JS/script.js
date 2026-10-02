const videosData = [];

function generate30Videos() {
    const categories = ['autenticacion', 'maquinaria', 'inventario', 'reportes'];
    const sampleVideos = [
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    ];

    for (let i = 1; i <= 30; i++) {
        let cat = categories[(i - 1) % categories.length];
        let titleName = "";
        
        if (cat === 'autenticacion') titleName = `Video ${i}: Autenticacion y Roles de Usuario ${i}`;
        else if (cat === 'maquinaria') titleName = `Video ${i}: Registro y Operacion de Telar ${i}`;
        else if (cat === 'inventario') titleName = `Video ${i}: Control de Hilos y Materia Prima ${i}`;
        else titleName = `Video ${i}: Generacion de Reporte en PDF ${i}`;

        videosData.push({
            id: i,
            title: titleName,
            category: cat,
            duration: `0${(i % 5) + 2}:30`,
            videoUrl: sampleVideos[i % sampleVideos.length],
            description: `Explicacion paso a paso sobre el funcionamiento del modulo ${cat} dentro de la aplicacion FIMACOR.`
        });
    }
}

generate30Videos();

let currentCategory = "todos";
let currentSearch = "";

const videoGrid = document.getElementById('videoGrid');
const searchInput = document.getElementById('searchInput');
const categoryButtons = document.querySelectorAll('.cat-btn');
const videoCountText = document.getElementById('videoCount');

window.addEventListener('DOMContentLoaded', () => {
    renderVideos();
    setupFilters();
});

function renderVideos() {
    videoGrid.innerHTML = "";

    const filtered = videosData.filter(item => {
        const matchesCategory = currentCategory === "todos" || item.category === currentCategory;
        const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase()) || 
                              item.description.toLowerCase().includes(currentSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    videoCountText.textContent = `Mostrando ${filtered.length} de ${videosData.length} videos`;

    if (filtered.length === 0) {
        videoGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px 0;">No se encontraron videos con los criterios ingresados.</p>`;
        return;
    }

    filtered.forEach(video => {
        const card = document.createElement('div');
        card.className = 'video-card';

        card.innerHTML = `
            <div class="video-player-box">
                <span class="card-category-tag">${video.category}</span>
                <video controls preload="metadata">
                    <source src="${video.videoUrl}" type="video/mp4">
                    Tu navegador no soporta el reproductor.
                </video>
            </div>
            <div class="video-card-body">
                <div>
                    <h4>${video.title}</h4>
                    <p>${video.description}</p>
                </div>
                <div class="video-meta">
                    <span>Modulo FIMACOR</span>
                    <span>Duracion: ${video.duration}</span>
                </div>
            </div>
        `;

        videoGrid.appendChild(card);
    });
}

function setupFilters() {
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        renderVideos();
    });

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.getAttribute('data-category');
            renderVideos();
        });
    });
}

function downloadResource(fileName) {
    alert(`Descargando recurso: ${fileName}`);
}