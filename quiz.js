function forzarInicio() {
    document.getElementById('loading-message').style.display = 'none';
    document.getElementById('quiz-content').style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    const quizContent = document.getElementById('quiz-content');
    const loadingMsg = document.getElementById('loading-message');
    const titleEl = document.getElementById('scenario-title');
    const descEl = document.getElementById('scenario-description');
    const feedbackPanel = document.getElementById('feedback-panel');
    const btnPhishing = document.getElementById('btn-choice-phishing');
    const btnLegit = document.getElementById('btn-choice-legit');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const btnClear = document.getElementById('btn-clear-ranking');

    const scenarios = [
        { t: "Escenario 1", d: "Correo de 'it-support@empresa-segura.xyz' pidiendo validar tu contraseña.", p: true, h: "El dominio .xyz no es el oficial de la empresa." },
        { t: "Escenario 2", d: "Factura de luz enviada por el dominio oficial de la proveedora eléctrica.", p: false, h: "Comunicación estándar esperada." },
        { t: "Escenario 3", d: "SMS: 'DHL: Paquete detenido, paga $1 de tarifa' en bit.ly/shipping-dhl.", p: true, h: "DHL no usa bit.ly para cobros directos." },
        { t: "Escenario 4", d: "Recordatorio de reunión de Google Calendar desde 'calendar-notification@google.com'.", p: false, h: "Correo oficial del servicio." },
        { t: "Escenario 5", d: "Adjunto: 'Nomina_2026.pdf.exe' enviado por un contacto conocido.", p: true, h: "Doble extensión detectada (.exe). Es malware." },
        { t: "Escenario 6", d: "Solicitud de amistad en LinkedIn con enlace directo a linkedin.com.", p: false, h: "Comportamiento normal de la plataforma." },
        { t: "Escenario 7", d: "Llamada del 'Banco' pidiendo tu código SMS para 'cancelar una compra'.", p: true, h: "Vishing. El banco nunca pide códigos SMS por teléfono." },
        { t: "Escenario 8", d: "Aviso de Netflix: 'Actualiza tu pago' que lleva a netflix-pago.top.", p: true, h: "El dominio .top es señal de fraude." },
        { t: "Escenario 9", d: "Correo de Recursos Humanos con el menú de la cafetería semanal.", p: false, h: "Comunicación interna legítima." },
        { t: "Escenario 10", d: "IT te pide tu clave por chat de Teams para arreglar tu laptop remotamente.", p: true, h: "IT nunca pide claves personales por chat." }
    ];

    let currentIdx = 0;
    let score = 0;
    let worstCase = "Ninguno";

    function loadScenario() {
        if (currentIdx < scenarios.length) {
            loadingMsg.style.display = 'none';
            quizContent.style.display = 'block';
            feedbackPanel.style.display = 'none';
            titleEl.innerText = scenarios[currentIdx].t;
            descEl.innerText = scenarios[currentIdx].d;
            btnPhishing.disabled = false;
            btnLegit.disabled = false;
        } else {
            quizContent.innerHTML = `<h3>Fin de la Simulación</h3><p>Puntaje: ${score}/100</p>`;
            save();
        }
    }

    function process(choice) {
        const correct = choice === scenarios[currentIdx].p;
        btnPhishing.disabled = true;
        btnLegit.disabled = true;
        feedbackPanel.style.display = 'block';

        if (correct) {
            score += 10;
            feedbackPanel.className = "feedback correct-panel";
            feedbackPanel.innerText = "✓ Correcto: " + scenarios[currentIdx].h;
        } else {
            worstCase = scenarios[currentIdx].t;
            feedbackPanel.className = "feedback wrong-panel";
            feedbackPanel.innerText = "✗ Incorrecto: " + scenarios[currentIdx].h;
        }
        currentIdx++;
        setTimeout(loadScenario, 2200);
    }

    function save() {
        let history = JSON.parse(localStorage.getItem('pr02_res')) || [];
        history.push({ id: "User_" + Math.floor(Math.random()*99), pts: score, fail: worstCase });
        history.sort((a,b) => b.pts - a.pts);
        localStorage.setItem('pr02_res', JSON.stringify(history.slice(0,5)));
        render();
    }

    function render() {
        const history = JSON.parse(localStorage.getItem('pr02_res')) || [];
        leaderboardBody.innerHTML = history.map((e, i) => `
            <tr><td>${i+1}</td><td>${e.id}</td><td>${e.pts}</td><td>${e.fail}</td></tr>
        `).join('') || '<tr><td colspan="4">No hay datos</td></tr>';
    }

    btnPhishing.onclick = () => process(true);
    btnLegit.onclick = () => process(false);
    btnClear.onclick = () => { localStorage.removeItem('pr02_res'); render(); };

    render();
    setTimeout(loadScenario, 800);
});