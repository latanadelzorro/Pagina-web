// Versión de la web
console.log('🦊 La Tana del Zorro - Versión: 0.0.0.1');

/* --- PRELOADER LOGIC --- */
const hidePreloader = () => {
    console.log('Attempting to hide preloader');
    const loader = document.getElementById('preloader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.style.display = 'none';
        console.log('Preloader hidden');
    } else {
        console.warn('Preloader element not found');
    }
};

// Failsafe: Force hide after 3 seconds no matter what
setTimeout(hidePreloader, 3000);

if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 1200);
} else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 1200));
}

// Safety check
if (typeof CONFIG === 'undefined' || typeof productos === 'undefined') {
    console.error("CRITICAL: config.js not loaded!");
    alert("Error de carga: config.js no encontrado. Recarga la página.");
}

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
// Los productos ahora se cargan desde js/config.js

let cart = {};
let favorites = [];

try {
    cart = JSON.parse(localStorage.getItem('zorro_cart_v2')) || {};
} catch (e) {
    console.error("Error parsing cart:", e);
    localStorage.removeItem('zorro_cart_v2');
}

try {
    favorites = JSON.parse(localStorage.getItem('zorro_favs')) || [];
} catch (e) {
    console.error("Error parsing favorites:", e);
    localStorage.removeItem('zorro_favs');
}

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

    let descHTML = p.desc + " Elaborados a mano cada mañana para asegurar la máxima frescura.";
    if (p.precio) {
        let packsHTML = '';
        if (p.packs) {
            const packsArr = p.packs.split(' | ');
            packsHTML = `<div class="pack-title"><i class="fas fa-box-open" style="color:var(--primary);"></i> Packs Ahorro</div>
                         <div class="pack-list">
                            ${packsArr.map(pack => {
                // Separar nombre y precio "Pack 6 (7,08€)"
                const match = pack.match(/(.*)\s\((.*)€\)/);
                if (match) {
                    const packName = match[1];
                    const packPrice = parseFloat(match[2].replace(',', '.'));
                    return `<div class="pack-item" onclick="addToCart(${p.id}, this, '${packName}', ${packPrice})" style="cursor:pointer;">
                                                <span class="pack-name">${packName}</span>
                                                <span class="pack-price">${match[2]}€</span>
                                                <i class="fas fa-plus-circle" style="color:var(--primary); margin-left:10px;"></i>
                                            </div>`;
                }
                return `<div class="pack-item"><span class="pack-name">${pack}</span></div>`;
            }).join('')}
                         </div>`;
        }

        descHTML += `<div class="price-box-modal">
            <div class="price-main">${p.precio.toFixed(2).replace('.', ',')}€ <span>/ unidad</span></div>
            ${packsHTML}
        </div>`;
    }
    document.getElementById('pm-desc').innerHTML = descHTML;
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
// Los premios (prizes) ahora se cargan desde js/config.js

let storedCode = localStorage.getItem('zorro_promo_code');
let hasSpun = localStorage.getItem('zorro_has_spun');

function checkWheelState() {
    const btn = document.getElementById('wheel-trigger');
    const now = new Date();
    const expirationDate = new Date(CONFIG.wheelExpirationDate);

    if (now >= expirationDate) {
        // Expired: Clear cache and hide wheel
        localStorage.removeItem('zorro_promo_code');
        localStorage.removeItem('zorro_has_spun');
        if (btn) btn.style.display = 'none';
        return;
    }

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
    // Lógica de probabilidades ponderada
    // CASI: 50%, NAP5: 30%, NAP10: 15%, NAP15: 5%
    const rand = Math.random();
    let winningId = 'CASI';

    if (rand < 0.50) winningId = 'CASI';
    else if (rand < 0.80) winningId = 'NAP5';
    else if (rand < 0.95) winningId = 'NAP10';
    else winningId = 'NAP15';

    // Buscar qué segmentos (índices) corresponden al premio ganado
    const candidates = [];
    prizes.forEach((p, i) => {
        if (p.id === winningId) candidates.push(i);
    });

    // Elegir uno de los segmentos válidos al azar para la animación
    const winnerIndex = candidates[Math.floor(Math.random() * candidates.length)];
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
    if (!CONFIG.promoTexts[code]) return;

    const { title, sub } = CONFIG.promoTexts[code];
    area.innerHTML = `<div class="cart-promo-banner"><i class="fas fa-gift"></i><div style="flex-grow:1;"><div>${title}</div><div style="font-size:0.8rem; opacity:0.9">${sub}</div></div><i class="fas fa-check"></i></div>`;
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
                        ${p.precio ? `<div class="price-tag-grid">${p.precio.toFixed(2).replace('.', ',')}€ <small>/ ud</small></div>` : ''}
                        <p>${p.desc}</p>
                        <div class="cat-tag-small">${p.cat[0]}</div>
                    </div>
                `;
        grid.appendChild(div);
    });
}

function addToCart(id, btn, variantName = null, variantPrice = null) {
    const item = productos.find(p => p.id === id);
    if (!item) return;

    // Generar clave única: ID o ID_VARIANT
    let key = item.id.toString();
    let finalName = item.nombre;
    let finalPrice = item.precio || 0; // Fallback si no tiene precio definido
    let finalImg = item.img;

    if (variantName) {
        key = `${item.id}_${variantName.replace(/\s+/g, '')}`;
        finalName = `${item.nombre} (${variantName})`;
        finalPrice = variantPrice;
    }

    if (cart[key]) {
        cart[key].qty++;
    } else {
        cart[key] = {
            id: item.id,
            key: key, // Guardamos la key para referencias futuras
            nombre: finalName,
            img: finalImg,
            cat: item.cat,
            qty: 1,
            price: finalPrice
        };
    }

    if (btn) {
        // Animación simple del botón
        const originalTransform = btn.style.transform;
        btn.style.transform = "scale(0.95)";
        setTimeout(() => btn.style.transform = originalTransform, 150);

        // Si es el botón flotante mini
        if (btn.classList.contains('btn-add-mini')) {
            btn.classList.add('active');
            setTimeout(() => btn.classList.remove('active'), 300);
        }
    }

    showToast(`Añadido: ${finalName}`);
    saveCart(); updateUI();
}

function updateQty(key, delta) {
    if (cart[key]) {
        cart[key].qty += delta;
        if (cart[key].qty <= 0) delete cart[key];
    }
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
                        <div style="font-size:0.8rem; color:var(--gray);">${i.cat ? i.cat[0] : ''} ${i.price ? `| ${i.price.toFixed(2).replace('.', ',')}€` : ''}</div>
                    </div>
                    <div class="qty-box">
                        <button onclick="updateQty('${i.key || i.id}', -1)">-</button>
                        <span style="font-size:0.9rem; width:25px; text-align:center;">${i.qty}</span>
                        <button onclick="updateQty('${i.key || i.id}', 1)">+</button>
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
        if (CONFIG.promoTexts[storedCode]) {
            const { title, sub } = CONFIG.promoTexts[storedCode];
            msg += `%0A%0A🎁 *CÓDIGO GANADO:* ${title} (${sub}) [${storedCode}]`;
        }
    }
    msg += "%0A%0AQuedo a la espera de confirmación. ¡Gracias!";
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`, '_blank');
}
