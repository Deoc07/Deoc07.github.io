// 1. Al cargar la página, recuperar y mostrar comentarios guardados
document.addEventListener('DOMContentLoaded', () => {
    cargarComentarios();
});

const form = document.getElementById('comment-form');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const texto = document.getElementById('user-comment').value;
    
    if (texto.trim() !== "") {
        const nuevoComentario = {
            texto: texto,
            fecha: new Date().toLocaleDateString(),
            id: Date.now() // Identificador único
        };

        // Guardar en LocalStorage
        guardarComentario(nuevoComentario);
        
        // Mostrar en pantalla inmediatamente
        renderizarComentario(nuevoComentario);

        this.reset();
    }
});

function guardarComentario(comentario) {
    // Obtener los que ya existen o crear un array vacío si es el primero
    let comentarios = JSON.parse(localStorage.getItem('comentarios_actividad')) || [];
    comentarios.push(comentario);
    // Volver a guardar el array actualizado en formato texto (JSON)
    localStorage.setItem('comentarios_actividad', JSON.stringify(comentarios));
}

function cargarComentarios() {
    let comentarios = JSON.parse(localStorage.getItem('comentarios_actividad')) || [];
    // Limpiar el contenedor antes de cargar para evitar duplicados
    document.getElementById('display-comments').innerHTML = '';
    comentarios.forEach(com => renderizarComentario(com));
}

function renderizarComentario(comentario) {
    const box = document.getElementById('display-comments');
    const div = document.createElement('div');
    div.className = 'card'; 
    div.style.padding = "15px";
    div.style.marginBottom = "15px";
    div.style.borderLeft = "4px solid #38bdf8";
    
    div.innerHTML = `
        <small style="color:#38bdf8; font-weight: bold;">Estudiante - ${comentario.fecha}</small>
        <p style="margin-top: 5px; color: #e5e7eb;">${comentario.texto}</p>
    `;
    
    box.prepend(div); // Los más nuevos aparecen arriba
}
