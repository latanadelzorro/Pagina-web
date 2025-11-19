/* --- PRELOADER LOGIC --- */
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('preloader');
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
    }, 1200); // Tiempo de gracia para ver el logo
});

/* --- MODO OSCURO LOGICA --- */
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('zorro_theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
    const icon = document.getElementById('theme-icon');
    if (isDark) {
        icon.className = 'fas fa-sun';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#121212');
    } else {
        icon.className = 'fas fa-moon';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', '#FFFBF2');
    }
}

/* --- DATOS EXTENDIDOS --- */
/* --- DATOS EXTENDIDOS --- */
const productos = [
    { id: 1, nombre: "Roscos de Vino", desc: "Receta montoreña con vino tinto y ajonjolí.", cat: ["Tradicional", "Navideño"], img: "img/roscos-vino.jpeg", alergenos: ["Gluten", "Sulfitos", "Sésamo"] },
    { id: 2, nombre: "Tiramisú Artesano", desc: "Capas de mascarpone, bizcocho y café.", cat: ["Tradicional"], img: "img/tiramisu.jpg", alergenos: ["Lácteos", "Gluten", "Huevo"] },
    { id: 3, nombre: "Mantecados Clásicos", desc: "De canela y limón. Textura suave.", cat: ["Navideño"], img: "img/mantecados.jpeg", alergenos: ["Gluten", "Frutos Secos"] },
    { id: 4, nombre: "Galletas Jengibre", desc: "Divertidas y crujientes con miel.", cat: ["Navideño"], img: "img/galletas gengibre.jpeg", alergenos: ["Gluten", "Huevo"] },
    { id: 5, nombre: "Palmeras Hojaldre", desc: "Mantequilla pura y caramelizado.", cat: ["Tradicional"], img: "img/palmeras.avif", alergenos: ["Gluten", "Lácteos"] },
    { id: 6, nombre: "Roscos de Azúcar", desc: "Fritos del día, tiernos y rebozados.", cat: ["Tradicional"], img: "img/roscosdeazucar.jpg", alergenos: ["Gluten", "Huevo"] },
    { id: 7, nombre: "Pestiños de Miel", desc: "Clásico con vino, anís y baño de miel.", cat: ["Semana Santa"], img: "img/pestiños.jpg", alergenos: ["Gluten", "Sulfitos"] },
    { id: 8, nombre: "Magdalenas Caseras", desc: "Esponjosas, con alto copete, aceite de oliva y ralladura de limón.", cat: ["Tradicional"], img: "img/macdalenas.jpeg", alergenos: ["Gluten", "Huevo"] },
    { id: 9, nombre: "Cookies con Chips", desc: "Crujientes por fuera y tiernas por dentro, con generosos chips de chocolate.", cat: ["Tradicional"], img: "img/cookies.png", alergenos: ["Gluten", "Huevo", "Lácteos", "Soja"] },
];

let cart = JSON.parse(localStorage.getItem('zorro_cart_v2')) || {};
let favorites = JSON.parse(localStorage.getItem('zorro_favs')) || [];

/* --- FUNCIONES FAVORITOS --- */
function toggleFav(id, event) {
    if (event) event.stopPropagation(); // Para no abrir la vista rápida
    const index = favorites.indexOf(id);
    if (index > -1) {
        favorites.splice(index, 1);
        showToast('Eliminado de favoritos');
    } else {
        favorites.push(id);
        showToast('Guardado en favoritos');
    }
    localStorage.setItem('zorro_favs', JSON.stringify(favorites));

    // Re-render si estamos en la pestaña favoritos
    const activeTab = document.querySelector('.cat-chip.active');
    if (activeTab && activeTab.innerText.includes('Favoritos')) {
        renderGrid('Favoritos');
    } else {
        renderGrid(activeTab ? (activeTab.innerText === 'Todo' ? 'todos' : activeTab.innerText) : 'todos');
    }
}

/* --- VISTA RAPIDA (MODAL) --- */
function openProduct(id) {
    const p = productos.find(x => x.id === id);
    if (!p) return;

    document.getElementById('pm-img').src = p.img;
    document.getElementById('pm-title').innerText = p.nombre;
    document.getElementById('pm-desc').innerText = p.desc + " Elaborados a mano cada mañana para asegurar la máxima frescura.";
    document.getElementById('pm-cat').innerText = p.cat.join(" | ");

    // Alérgenos
    const alDiv = document.getElementById('pm-allergens');
    alDiv.innerHTML = p.alergenos.map(al => `<span class="allergen-tag"><i class="fas fa-check"></i> ${al}</span>`).join('');

    // Botón acción
    document.getElementById('pm-btn-add').onclick = function () {
        addToCart(p.id, this);
        setTimeout(closeProduct, 300);
    };

    document.getElementById('overlay').classList.add('active');
    const modal = document.getElementById('product-modal');
    modal.style.display = 'flex';
    // Truco para animar display:flex
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeProduct() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    setTimeout(() => { if (!document.getElementById('cart-sheet').classList.contains('active')) modal.style.display = 'none'; }, 300);
}


/* --- RULETA LOGICA --- */
const prizes = [
    { id: 'NAP15', label: '15% Dto - NAP15', color: '#FFD700' },
    { id: 'CASI', label: 'Casi Casi... 🥺', color: '#ff4757' },
    { id: 'NAP10', label: '10% Dto - NAP10', color: '#2ed573' },
    { id: 'NAP5', label: '5% Dto - NAP5', color: '#1e90ff' },
    { id: 'NAP15', label: '15% Dto - NAP15', color: '#FFD700' },
    { id: 'CASI', label: 'Casi Casi... 🥺', color: '#ff4757' },
    { id: 'NAP10', label: '10% Dto - NAP10', color: '#2ed573' },
    { id: 'NAP5', label: '5% Dto - NAP5', color: '#1e90ff' }
];

let storedCode = localStorage.getItem('zorro_promo_code');
let hasSpun = localStorage.getItem('zorro_has_spun');

function checkWheelState() {
    const btn = document.getElementById('wheel-trigger');
    if (hasSpun === 'true') {
        btn.classList.add('hidden');
        if (storedCode && storedCode !== 'CASI') showPromoInCart(storedCode);
    }
}

function openWheel() { document.getElementById('wheel-modal').style.display = 'flex'; }
function closeWheel() { document.getElementById('wheel-modal').style.display = 'none'; }

function spinWheel() {
    if (hasSpun === 'true') return;
    const btn = document.getElementById('btn-spin');
    btn.disabled = true; btn.innerText = "Girando...";
    const winnerIndex = Math.floor(Math.random() * prizes.length);
    const winner = prizes[winnerIndex];
    const segmentAngle = (winnerIndex * 45) + 22.5;
    const spins = 5;
    const finalRotate = (360 * spins) - segmentAngle;
    const wheel = document.getElementById('the-wheel');
    wheel.style.transform = `rotate(${finalRotate}deg)`;
    setTimeout(() => { finishSpin(winner); }, 5000);
}

function finishSpin(winner) {
    localStorage.setItem('zorro_has_spun', 'true');
    hasSpun = 'true';
    const resDiv = document.getElementById('result-area');
    if (winner.id === 'CASI') {
        resDiv.innerHTML = `<h3 style="color:#ff4757">¡Oooh! Casi...</h3><p>Hoy no hubo suerte.</p>`;
        localStorage.setItem('zorro_promo_code', 'CASI');
    } else {
        resDiv.innerHTML = `<h3 style="color:#2ed573">¡GANASTE! 🎉</h3><p style="font-size:1.2rem;">${winner.label}</p><p>Guardado en cesta.</p>`;
        localStorage.setItem('zorro_promo_code', winner.id);
        storedCode = winner.id; showPromoInCart(winner.id);
        var end = Date.now() + (2 * 1000);
        (function frame() { confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } }); confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } }); if (Date.now() < end) requestAnimationFrame(frame); }());
    }
    setTimeout(() => { closeWheel(); document.getElementById('wheel-trigger').classList.add('hidden'); if (winner.id !== 'CASI') openCart(); }, 4000);
}

function showPromoInCart(code) {
    const area = document.getElementById('promo-area');
    let text = "", subtext = "";
    if (code === 'NAP15') { text = "Navidad Mágica"; subtext = "-15% Descuento"; }
    if (code === 'NAP10') { text = "Dulce Navidad"; subtext = "-10% Descuento"; }
    if (code === 'NAP5') { text = "Galletita Feliz"; subtext = "-5% Descuento"; }
    area.innerHTML = `<div class="cart-promo-banner"><i class="fas fa-gift"></i><div style="flex-grow:1;"><div>${text}</div><div style="font-size:0.8rem; opacity:0.9">${subtext}</div></div><i class="fas fa-check"></i></div>`;
}

// --- PRINCIPAL ---
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('zorro_theme');
    if (savedTheme === 'dark') { document.body.classList.add('dark-mode'); updateThemeIcon(true); }
    renderGrid('todos'); updateUI(); checkWheelState();
});

function renderGrid(filtro) {
    const grid = document.getElementById('grid');
    grid.innerHTML = '';
    let items = [];

    if (filtro === 'todos') {
        items = productos;
    } else if (filtro === 'Favoritos') {
        items = productos.filter(p => favorites.includes(p.id));
        if (items.length === 0) {
            grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; opacity:0.6;"><i class="far fa-heart" style="font-size:3rem; margin-bottom:10px;"></i><p>No tienes favoritos guardados aún.</p></div>`;
            return;
        }
    } else {
        items = productos.filter(p => p.cat.includes(filtro));
    }

    items.forEach(p => {
        const div = document.createElement('div');
        div.className = 'product-card';
        const isFav = favorites.includes(p.id);
        const fallback = "this.src='https://placehold.co/300?text=El+Zorro'";
        div.innerHTML = `
                    <button class="btn-fav ${isFav ? 'active' : ''}" onclick="toggleFav(${p.id}, event)">
                        <i class="${isFav ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    <div class="img-wrapper" onclick="openProduct(${p.id})">
                        <img src="${p.img}" loading="lazy" alt="${p.nombre}" onerror="${fallback}">
                        <div class="btn-add-mini" onclick="event.stopPropagation(); addToCart(${p.id}, this)"><i class="fas fa-plus"></i></div>
                    </div>
                    <div class="info-wrapper" onclick="openProduct(${p.id})" style="cursor:pointer;">
                        <h4>${p.nombre}</h4>
                        <p>${p.desc}</p>
                        <div class="cat-tag-small">${p.cat[0]}</div>
                    </div>
                `;
        grid.appendChild(div);
    });
}

function addToCart(id, btn) {
    const item = productos.find(p => p.id === id);
    if (cart[id]) cart[id].qty++; else cart[id] = { ...item, qty: 1 };
    if (btn) { btn.classList.add('active'); setTimeout(() => btn.classList.remove('active'), 300); }
    showToast(`Añadido: ${item.nombre}`);
    saveCart(); updateUI();
}

function updateQty(id, delta) {
    if (cart[id]) { cart[id].qty += delta; if (cart[id].qty <= 0) delete cart[id]; }
    saveCart(); updateUI(); renderCartItems();
}

function saveCart() { localStorage.setItem('zorro_cart_v2', JSON.stringify(cart)); }

function updateUI() {
    const total = Object.values(cart).reduce((acc, i) => acc + i.qty, 0);
    const badge = document.getElementById('nav-badge');
    const dot = document.getElementById('top-dot');
    document.getElementById('total-items').innerText = total;
    if (total > 0) { badge.classList.add('show'); dot.classList.add('show'); badge.innerText = total; }
    else { badge.classList.remove('show'); dot.classList.remove('show'); }
}

function openCart() { renderCartItems(); document.getElementById('overlay').classList.add('active'); document.getElementById('cart-sheet').classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeCart() { document.getElementById('overlay').classList.remove('active'); document.getElementById('cart-sheet').classList.remove('active'); document.body.style.overflow = ''; }

function renderCartItems() {
    const div = document.getElementById('cart-items');
    const items = Object.values(cart);
    if (items.length === 0) { div.innerHTML = `<div style='text-align:center; margin-top:40px; opacity:0.5;'><i class="fas fa-shopping-basket" style="font-size:3rem; margin-bottom:15px; color:var(--gray);"></i><p>Tu cesta está vacía.</p></div>`; return; }
    div.innerHTML = items.map(i => `
                <div class="cart-row">
                    <img src="${i.img}" alt="${i.nombre}">
                    <div style="flex-grow:1">
                        <div style="font-weight:bold; font-size:0.95rem; color:var(--dark);">${i.nombre}</div>
                        <div style="font-size:0.8rem; color:var(--gray);">${i.cat[0]}</div>
                    </div>
                    <div class="qty-box">
                        <button onclick="updateQty(${i.id}, -1)">-</button>
                        <span style="font-size:0.9rem; width:25px; text-align:center;">${i.qty}</span>
                        <button onclick="updateQty(${i.id}, 1)">+</button>
                    </div>
                </div>
            `).join('');
}

function filter(cat, btn) { document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active')); btn.classList.add('active'); renderGrid(cat); }
function showToast(msg) { const t = document.getElementById('toast'); t.querySelector('span').innerText = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2000); }

function sendOrder() {
    const items = Object.values(cart);
    if (items.length === 0) return;
    let msg = "👋 Hola El Zorro! Me gustaría hacer este pedido:%0A%0A";
    items.forEach(i => msg += `▪️ *${i.nombre}* (x${i.qty})%0A`);
    msg += `%0A📦 *Total unidades:* ${document.getElementById('total-items').innerText}`;
    if (storedCode && storedCode !== 'CASI') {
        let promoText = "";
        if (storedCode === 'NAP15') promoText = "Navidad Mágica (-15%)";
        if (storedCode === 'NAP10') promoText = "Dulce Navidad (-10%)";
        if (storedCode === 'NAP5') promoText = "Galletita Feliz (-5%)";
        msg += `%0A%0A🎁 *CÓDIGO GANADO:* ${promoText} [${storedCode}]`;
    }
    msg += "%0A%0AQuedo a la espera de confirmación. ¡Gracias!";
    window.open(`https://wa.me/34624416475?text=${msg}`, '_blank');
}
