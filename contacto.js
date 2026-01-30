emailjs.init('UqThZHhRETFeKbc-f')
const btn = document.getElementById('button');
const cajaRespuesta = document.getElementById("respuesta");
document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault();

   btn.value = 'Sending...';

   const serviceID = 'default_service';
   const templateID = 'template_wk0nxy7';

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Send Email';
      //alert('Sent!');
     cajaRespuesta.style.display = "block";
    cajaRespuesta.style.backgroundColor = "#d4edda";
    cajaRespuesta.innerHTML = `
      <strong>¡Gracias, ${nombre}!</strong><br>
      Tu mensaje fue enviado correctamente.
    `;
     this.reset(); // Limpia el formulario
    }, (err) => {
     cajaRespuesta.style.display = "block";
    cajaRespuesta.style.backgroundColor = "#f8d7da";
    cajaRespuesta.innerHTML = `Error al enviar: ${error.text}`;
      btn.value = 'Send Email';
      alert(JSON.stringify(err));
    });
});
