// Los videos viven en el HTML (index.html). Este script solo filtra y busca.
const grid = document.getElementById('videoGrid');
const tarjetas = [...grid.querySelectorAll('.video-card')];
const contador = document.getElementById('videoCount');
const vacio = document.getElementById('emptyMsg');
const buscador = document.getElementById('searchInput');
const botones = document.querySelectorAll('.cat-btn');

const estado = { categoria: 'todos', busqueda: '' };
const normalizar = (t) => t.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

function filtrar() {
    const q = normalizar(estado.busqueda);
    let visibles = 0;

    tarjetas.forEach((card) => {
        const okCategoria = estado.categoria === 'todos' || card.dataset.category === estado.categoria;
        const okBusqueda = normalizar(card.textContent).includes(q);
        const mostrar = okCategoria && okBusqueda;
        card.hidden = !mostrar;
        if (mostrar) visibles++;
    });

    contador.textContent = `Mostrando ${visibles} de ${tarjetas.length} videos`;
    vacio.hidden = visibles > 0;
}

buscador.addEventListener('input', (e) => { estado.busqueda = e.target.value; filtrar(); });

botones.forEach((btn) => btn.addEventListener('click', () => {
    botones.forEach((b) => b.classList.toggle('active', b === btn));
    estado.categoria = btn.dataset.category;
    filtrar();
}));

// Solo un video reproduciéndose a la vez
grid.addEventListener('play', (e) => {
    grid.querySelectorAll('video').forEach((v) => { if (v !== e.target) v.pause(); });
}, true);

filtrar();

// Si un video no carga (URL mala, archivo no existe, formato no soportado), avisa en la tarjeta
grid.addEventListener('error', (e) => {
    const el = e.target;
    if (el.tagName !== 'SOURCE' && el.tagName !== 'VIDEO') return;
    const player = el.closest('.video-player');
    if (!player || player.querySelector('.video-error')) return;
    const msg = document.createElement('div');
    msg.className = 'video-error';
    msg.textContent = 'No se pudo cargar el video. Revisa la URL o la ruta del archivo (.mp4).';
    player.append(msg);
}, true);