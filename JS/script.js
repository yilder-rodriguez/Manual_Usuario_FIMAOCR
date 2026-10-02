// Datos de ejemplo. Reemplaza este arreglo por tus videos reales
// (o por un fetch al servlet que los entregue).
const CATEGORIAS = {
    autenticacion: { titulo: 'Autenticación y Roles de Usuario', modulo: 'Autenticación' },
    maquinaria:    { titulo: 'Registro y Operación de Telar',    modulo: 'Maquinaria Textil' },
    inventario:    { titulo: 'Control de Hilos y Materia Prima', modulo: 'Inventarios' },
    reportes:      { titulo: 'Generación de Reporte en PDF',     modulo: 'Reportes' }
};

const VIDEOS_MUESTRA = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
];

const claves = Object.keys(CATEGORIAS);

const videos = Array.from({ length: 30 }, (_, i) => {
    const n = i + 1;
    const categoria = claves[i % claves.length];
    return {
        titulo: `Video ${n}: ${CATEGORIAS[categoria].titulo}`,
        categoria,
        duracion: `0${(n % 5) + 2}:30`,
        url: VIDEOS_MUESTRA[n % VIDEOS_MUESTRA.length],
        descripcion: `Explicación paso a paso del módulo ${CATEGORIAS[categoria].modulo} dentro de FIMACOR.`
    };
});

const estado = { categoria: 'todos', busqueda: '' };

const grid = document.getElementById('videoGrid');
const contador = document.getElementById('videoCount');
const buscador = document.getElementById('searchInput');
const botones = document.querySelectorAll('.cat-btn');
const btnTema = document.getElementById('themeToggle');

const normalizar = (t) => t.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

function crearTarjeta(v) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'video-card';
    tarjeta.innerHTML = `
        <div class="video-player">
            <span class="card-tag"></span>
            <video controls preload="none"></video>
        </div>
        <div class="video-body">
            <div><h4></h4><p></p></div>
            <div class="video-meta"><span>Módulo FIMACOR</span><span></span></div>
        </div>`;

    // textContent evita inyectar HTML si algún día los datos vienen de la BD
    tarjeta.querySelector('.card-tag').textContent = CATEGORIAS[v.categoria].modulo;
    tarjeta.querySelector('video').src = v.url;
    tarjeta.querySelector('h4').textContent = v.titulo;
    tarjeta.querySelector('p').textContent = v.descripcion;
    tarjeta.querySelector('.video-meta span:last-child').textContent = `Duración: ${v.duracion}`;
    return tarjeta;
}

function render() {
    const q = normalizar(estado.busqueda);
    const lista = videos.filter((v) =>
        (estado.categoria === 'todos' || v.categoria === estado.categoria) &&
        normalizar(`${v.titulo} ${v.descripcion}`).includes(q)
    );

    contador.textContent = `Mostrando ${lista.length} de ${videos.length} videos`;
    grid.replaceChildren();

    if (!lista.length) {
        const vacio = document.createElement('p');
        vacio.className = 'empty';
        vacio.textContent = 'No se encontraron videos con los criterios ingresados.';
        grid.append(vacio);
        return;
    }
    grid.append(...lista.map(crearTarjeta));
}

// Solo un video reproduciéndose a la vez
grid.addEventListener('play', (e) => {
    grid.querySelectorAll('video').forEach((v) => { if (v !== e.target) v.pause(); });
}, true);

buscador.addEventListener('input', (e) => { estado.busqueda = e.target.value; render(); });

botones.forEach((btn) => btn.addEventListener('click', () => {
    botones.forEach((b) => b.classList.toggle('active', b === btn));
    estado.categoria = btn.dataset.category;
    render();
}));

// Modo oscuro (misma clase que usa el sistema FIMACOR)
function aplicarTema(oscuro) {
    document.body.classList.toggle('fimacor-dark-mode', oscuro);
    btnTema.textContent = oscuro ? '☀️' : '🌙';
}
try { aplicarTema(localStorage.getItem('fimacorTema') === 'dark'); } catch { aplicarTema(false); }
btnTema.addEventListener('click', () => {
    const oscuro = !document.body.classList.contains('fimacor-dark-mode');
    aplicarTema(oscuro);
    try { localStorage.setItem('fimacorTema', oscuro ? 'dark' : 'light'); } catch { /* sin storage */ }
});

render();