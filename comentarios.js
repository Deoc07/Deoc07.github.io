document.getElementById('comment-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Evita que la página se recargue

    const commentText = document.getElementById('user-comment').value;
    const displayArea = document.getElementById('display-comments');

    if (commentText.trim() !== "") {
        // Crear el elemento del comentario
        const nuevoDiv = document.createElement('div');
        
        // Estilo rápido para el comentario
        nuevoDiv.style.background = "rgba(56, 189, 248, 0.1)";
        nuevoDiv.style.padding = "15px";
        nuevoDiv.style.borderRadius = "8px";
        nuevoDiv.style.marginBottom = "10px";
        nuevoDiv.style.borderLeft = "4px solid #38bdf8";

        // Insertar el contenido
        nuevoDiv.innerHTML = `
            <p style="color: #38bdf8; font-weight: bold; font-size: 0.8rem; margin-bottom: 5px;">Usuario - ${new Date().toLocaleDateString()}</p>
            <p style="color: #e5e7eb;">${commentText}</p>
        `;

        // Agregar al área de visualización
        displayArea.appendChild(nuevoDiv);

        // Limpiar el formulario
        document.getElementById('user-comment').value = "";
    }
});
