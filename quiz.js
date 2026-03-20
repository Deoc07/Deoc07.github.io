document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES DE ESTADO ---
    let currentIdx = 0;
    let score = 0;
    let worstCase = "Cero Fallos";

    // --- CAPTURA DE ELEMENTOS DEL DOM ---
    const quizContent = document.getElementById('quiz-content');
    const loadingMsg = document.getElementById('loading-message');
    const titleEl = document.getElementById('scenario-title');
    const descEl = document.getElementById('scenario-description');
    const feedbackPanel = document.getElementById('feedback-panel');
    const btnPhishing = document.getElementById('btn-choice-phishing');
    const btnLegit = document.getElementById('btn-choice-legit');
    const btnForce = document.getElementById('btn-force-start');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const btnClear = document.getElementById('btn-clear-ranking');

    // --- DATA: 10 ESCENARIOS ---
    const scenarios = [
        { t: "Escenario 1: Fraude del CEO (BEC)", d: "Recibes un correo urgente de tu Director General: 'Estoy en una reunión, necesito que transfieras $5000 a esta cuenta de proveedor nuevo de inmediato'.", p: true, h: "Ataque BEC. El sentido de urgencia extrema y las instrucciones financieras anómalas por correo siempre deben validarse por otro medio (teléfono)." },
        { t: "Escenario 2: Notificación Interna IT", d: "El sistema de HelpDesk envía un ticket automático indicando que tu solicitud de equipo nuevo ha sido aprobada.", p: false, h: "Flujo de comunicación automatizado y estandarizado del sistema interno de la empresa." },
        { t: "Escenario 3: Typosquatting en Enlaces", d: "Alerta de Recursos Humanos: 'Actualiza tu información fiscal antes del viernes'. El enlace visible lleva a 'https://portal-miempresa.com'.", p: true, h: "El dominio es sutilmente diferente al oficial. Sustituir o añadir palabras clave ('portal-') es la base del Typosquatting." },
        { t: "Escenario 4: Confirmación de Google Workspace", d: "Recibes un aviso de Google Drive informando que tu compañero ha modificado el documento 'Presupuesto Q4'.", p: false, h: "Notificación oficial y verificada de actividad colaborativa." },
        { t: "Escenario 5: Malware en Facturas", d: "Un proveedor te envía un correo en blanco con un único archivo adjunto llamado 'Factura_Atrasada.ZIP'.", p: true, h: "Correos sin contexto con archivos comprimidos (.ZIP, .RAR) son el principal vector para desplegar Ransomware en la red corporativa." },
        { t: "Escenario 6: Smishing (SMS)", d: "Mensaje de texto a tu móvil: 'Su cuenta bancaria ha sido bloqueada temporalmente. Restáurela en bit.ly/bank-auth9'.", p: true, h: "Las instituciones financieras genuinas nunca utilizan servicios de acortamiento de URLs (bit.ly) para gestiones de seguridad." },
        { t: "Escenario 7: Redes Sociales Corporativas", d: "Notificación de Slack: '@canal IT realizará mantenimiento de servidores hoy a las 11:00 PM'.", p: false, h: "Canal y formato correcto para avisos de infraestructura tecnológica." },
        { t: "Escenario 8: Vishing (Voz)", d: "Llamada telefónica: 'Hola, soy de soporte técnico de Microsoft. Hemos detectado virus en su red, instale este programa de acceso remoto'.", p: true, h: "Soporte técnico externo nunca realiza llamadas proactivas no solicitadas pidiendo instalación de software de control remoto (AnyDesk, TeamViewer)." },
        { t: "Escenario 9: Actualización de Políticas", d: "Correo desde 'compliance@tuempresa.com' con un PDF adjunto sobre el nuevo código de vestimenta.", p: false, h: "Comunicación corporativa esperada, desde un dominio exacto y con un archivo de lectura estándar (.PDF)." },
        { t: "Escenario 10: Extorsión Emocional", d: "Correo en tu bandeja personal: 'Tengo un video tuyo grabado desde tu webcam. Paga $1000 en Bitcoin o lo enviaré a tus contactos'.", p: true, h: "Ataque de extorsión (Sextortion). Suele ser un engaño masivo donde el atacante realmente no tiene acceso a tu cámara ni equipo." }
    ];

    // --- FUNCIONES CORE ---

    function startQuiz() {
        if (loadingMsg) loadingMsg.style.display = 'none';
        if (quizContent) quizContent.style.display = 'block';
        loadScenario();
    }

    function loadScenario() {
        if (currentIdx < scenarios.length) {
            feedbackPanel.style.display = 'none';
            titleEl.innerText = scenarios[currentIdx].t;
            descEl.innerText = scenarios[currentIdx].d;
            
            btnPhishing.disabled = false;
            btnLegit.disabled = false;
        } else {
            quizContent.innerHTML = `<h3>✅ Auditoría Completada</h3>
                                     <p>Nivel de resiliencia frente a amenazas: <strong>${score} / 100 puntos</strong></p>
                                     <p>La telemetría ha sido registrada localmente.</p>`;
            saveResultLocally();
        }
    }

    function handleAnswer(isPhishingChoice) {
        btnPhishing.disabled = true;
        btnLegit.disabled = true;

        const isCorrect = isPhishingChoice === scenarios[currentIdx].p;
        feedbackPanel.style.display = 'block';

        if (isCorrect) {
            score += 10;
            feedbackPanel.className = "feedback correct-panel";
            feedbackPanel.innerHTML = `<strong>✓ Evaluación Correcta:</strong> ${scenarios[currentIdx].h}`;
        } else {
            worstCase = scenarios[currentIdx].t;
            feedbackPanel.className = "feedback wrong-panel";
            feedbackPanel.innerHTML = `<strong>✗ Riesgo Detectado:</strong> ${scenarios[currentIdx].h}`;
        }

        currentIdx++;
        setTimeout(loadScenario, 3500); 
    }

    // --- PERSISTENCIA ---
    const STORAGE_KEY = 'pr02_telemetry';

    function saveResultLocally() {
        let history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const anonID = "USR-" + Math.floor(Math.random() * 90000 + 10000);
        
        history.push({ id: anonID, points: score, failure: worstCase });
        history.sort((a, b) => b.points - a.points);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 10)));
        renderLeaderboard();
    }

    function renderLeaderboard() {
        if (!leaderboardBody) return;
        const history = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        if (history.length === 0) {
            leaderboardBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Base de datos local vacía.</td></tr>';
            return;
        }

        leaderboardBody.innerHTML = history.map((entry, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${entry.id}</td>
                <td><strong>${entry.points}%</strong></td>
                <td>${entry.failure}</td>
            </tr>
        `).join('');
    }

    // --- EVENTOS ---
    if (btnPhishing) btnPhishing.onclick = () => handleAnswer(true);
    if (btnLegit) btnLegit.onclick = () => handleAnswer(false);
    if (btnForce) btnForce.onclick = startQuiz;
    
    if (btnClear) {
        btnClear.onclick = () => {
            localStorage.removeItem(STORAGE_KEY);
            renderLeaderboard();
        };
    }

    // --- INICIALIZACIÓN ---
    renderLeaderboard();
    
    // Intento de auto-inicio tras 1.2 segundos
    setTimeout(() => {
        if (loadingMsg && loadingMsg.style.display !== 'none') {
            startQuiz();
        }
    }, 1200);
});
