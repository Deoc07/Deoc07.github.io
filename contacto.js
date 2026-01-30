emailjs.init('UqThZHhRETFeKbc-f');

const form = document.getElementById('form');
const btn = document.getElementById('button');
const cajaRespuesta = document.getElementById('respuesta');

form.addEventListener('submit', function (event) {
  event.preventDefault();

  btn.value = 'Enviando...';

  const nombre = document.getElementById("name").value;

  emailjs.sendForm(
    'service_97vc3cp',      // tu servicio REAL
    'template_wk0nxy7',     // tu template
    this
  ).then(() => {

    cajaRespuesta.style.display = "block";
    cajaRespuesta.style.color = "#000000";
    cajaRespuesta.style.backgroundColor = "#d4edda";
    

    cajaRespuesta.innerHTML = `
      <strong>¡Gracias, ${nombre}!</strong><br>
      Tu mensaje fue enviado correctamente.
    `;

    btn.value = 'Send Email';
    this.reset(); // ✅ ahora SÍ se limpia

  }).catch((error) => {

    cajaRespuesta.style.display = "block";
    cajaRespuesta.style.color = "#000000";
    cajaRespuesta.style.backgroundColor = "#f8d7da";
    

    cajaRespuesta.innerHTML = `Error al enviar: ${error.text}`;

    btn.value = 'Send Email';
  });
});
