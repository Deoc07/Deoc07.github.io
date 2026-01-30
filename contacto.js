// Inicializar EmailJS
emailjs.init("UqThZHhRETFeKbc-f");

document.getElementById("miFormulario").addEventListener("submit", function (event) {
  event.preventDefault();

  const nombre = document.getElementById("user_name").value;
  const correo = document.getElementById("user_email").value;
  const cajaRespuesta = document.getElementById("respuesta");

  emailjs.sendForm(
    "service_97vc3cp",
    "template_wk0nxy7",
    this
  ).then(() => {
    cajaRespuesta.style.display = "block";
    cajaRespuesta.style.backgroundColor = "#d4edda";
    cajaRespuesta.innerHTML = `
      <strong>¡Gracias, ${nombre}!</strong><br>
      Tu mensaje fue enviado correctamente.
    `;
    this.reset(); // Limpia el formulario
  }).catch((error) => {
    cajaRespuesta.style.display = "block";
    cajaRespuesta.style.backgroundColor = "#f8d7da";
    cajaRespuesta.innerHTML = `Error al enviar: ${error.text}`;
  });
});
