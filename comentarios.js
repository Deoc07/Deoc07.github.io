const form = document.getElementById('comment-form');
const display = document.getElementById('display-comments');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = document.getElementById('user-comment').value;
  if(text) {
    const nuevoComentario = document.createElement('p');
    nuevoComentario.innerHTML = `<strong>Anónimo:</strong> ${text}`;
    nuevoComentario.style.borderBottom = "1px solid #333";
    nuevoComentario.style.padding = "10px 0";
    display.appendChild(nuevoComentario);
    form.reset();
  }
});
