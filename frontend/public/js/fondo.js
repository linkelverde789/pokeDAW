function cambiarImagenFondo() {
    const imagenes = [
        '80.png',
        '54.png',
        '7.png',
    ];
    const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
    document.body.style.backgroundImage = `url(../public/images/${imagenes[indiceAleatorio]})`;
}
cambiarImagenFondo();