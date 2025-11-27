/* 
 * CONFIGURACIÓN GLOBAL - EL ZORRO
 * Edita este archivo para cambiar productos, premios, fechas y textos.
 */

var CONFIG = {
    // --- DATOS DE CONTACTO ---
    whatsappNumber: "34624416475", // Número de teléfono para pedidos (sin +)

    // --- FECHAS IMPORTANTES ---
    wheelExpirationDate: "2025-12-01T00:00:00", // Fecha en la que la ruleta deja de funcionar (YYYY-MM-DDTHH:mm:ss)

    // --- TEXTOS ---
    promoTexts: {
        'NAP15': { title: "Navidad Mágica", sub: "-15% Descuento" },
        'NAP10': { title: "Dulce Navidad", sub: "-10% Descuento" },
        'NAP5': { title: "Galletita Feliz", sub: "-5% Descuento" }
    }
};

// --- LISTA DE PRODUCTOS ---
// Añade, borra o edita productos aquí.
var productos = [
    {
        id: 1,
        nombre: "Roscos de Vino",
        desc: "Receta montoreña con vino tinto y ajonjolí.",
        cat: ["Tradicional", "Navideño"],
        img: "img/roscos-vino.jpeg",
        alergenos: ["Gluten (Trigo)", "Sulfitos (Vino)", "Frutos de Cáscara", "Sésamo"],
        precio: 0.45,
        packs: "Pack 6 (2,70€) | Pack 12 (5,40€)"
    },
    {
        id: 2,
        nombre: "Tiramisú Artesano",
        desc: "Capas de mascarpone, bizcocho y café.",
        cat: ["Tradicional"],
        img: "img/tiramisu.jpg",
        alergenos: ["Gluten (Trigo)", "Huevo", "Lácteos (Mascarpone)", "Sulfitos (Marsala)"]
    },
    {
        id: 3,
        nombre: "Mantecados de canela y ajonjolí",
        desc: "De canela y limón. Textura suave.",
        cat: ["Navideño"],
        img: "img/mantecados.jpeg",
        alergenos: ["Gluten (Trigo)", "Frutos de Cáscara (Almendra)", "Lácteos"],
        precio: 0.95,
        packs: "Pack 6 (5,70€) | Pack 10 (9,50€) | Pack 12 (11,40€)"
    },
    {
        id: 4,
        nombre: "Galletas de jengibre",
        desc: "Divertidas y crujientes con miel.",
        cat: ["Navideño"],
        img: "img/galletas gengibre.jpeg",
        alergenos: ["Gluten (Trigo)", "Huevo", "Lácteos (Mantequilla)", "Sulfitos"],
        precio: 0.80,
        packs: "Pack 6 (4,80€) | Pack 10 (8,00€) | Pack 12 (9,60€)"
    },
    {
        id: 5,
        nombre: "Palmeras de hojaldre",
        desc: "Mantequilla pura y caramelizado.",
        cat: ["Tradicional"],
        img: "img/palmeras.avif",
        alergenos: ["Gluten (Trigo)", "Lácteos (Mantequilla)"],
        precio: 0.75,
        packs: "Pack 6 (4,50€) | Pack 10 (7,50€) | Pack 12 (9,00€)"
    },
    {
        id: 6,
        nombre: "Roscos de Azúcar",
        desc: "Fritos del día, tiernos y rebozados.",
        cat: ["Tradicional"],
        img: "img/roscosdeazucar.jpg",
        alergenos: ["Gluten (Trigo)", "Huevo", "Lácteos"]
    },
    {
        id: 7,
        nombre: "Hojaldrinas",
        desc: "Deliciosas capas de hojaldre con un toque de naranja y vino.",
        cat: ["Navideño", "Tradicional"],
        img: "img/hojaldrinas.jpeg",
        alergenos: ["Gluten (Trigo)", "Lácteos (Mantequilla)", "Sulfitos (Vino)"]
    },
    {
        id: 8,
        nombre: "Magdalenas Caseras",
        desc: "Esponjosas, con alto copete, aceite de oliva y ralladura de limón.",
        cat: ["Tradicional"],
        img: "img/macdalenas.jpeg",
        alergenos: ["Gluten (Trigo)", "Huevo", "Lácteos"]
    },
    {
        id: 9,
        nombre: "Galletas con chips de chocolate",
        desc: "Crujientes por fuera y tiernas por dentro, con generosos chips de chocolate.",
        cat: ["Tradicional"],
        img: "img/cookies.png",
        alergenos: ["Gluten (Trigo)", "Huevo", "Lácteos (Mantequilla y Chocolate)", "Soja (Lecitina)"],
        precio: 1.18,
        packs: "Pack 6 (7,08€) | Pack 10 (11,80€) | Pack 12 (14,16€)"
    },
];

// --- PREMIOS DE LA RULETA ---
// id: Código del premio (o 'CASI' para perder)
// label: Texto que se muestra en la ruleta
// color: Color del segmento
var prizes = [
    { id: 'NAP15', label: '15% Dto - NAP15', color: '#FFD700' },
    { id: 'CASI', label: 'Casi Casi... 🥺', color: '#ff4757' },
    { id: 'NAP10', label: '10% Dto - NAP10', color: '#2ed573' },
    { id: 'NAP5', label: '5% Dto - NAP5', color: '#1e90ff' },
    { id: 'NAP15', label: '15% Dto - NAP15', color: '#FFD700' },
    { id: 'CASI', label: 'Casi Casi... 🥺', color: '#ff4757' },
    { id: 'NAP10', label: '10% Dto - NAP10', color: '#2ed573' },
    { id: 'NAP5', label: '5% Dto - NAP5', color: '#1e90ff' }
];
