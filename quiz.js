/* quiz.js — Simulador de Phishing PR02 */

document.addEventListener('DOMContentLoaded', () => {

    // --- ESTADO ---
    let currentIdx = 0;
    let score      = 0;
    let worstCase  = "Sin fallos";
    let playerName = "";

    // --- DOM ---
    const startScreen    = document.getElementById('start-screen');
    const quizContent    = document.getElementById('quiz-content');
    const playerNameEl   = document.getElementById('player-name');
    const btnStart       = document.getElementById('btn-start-quiz');
    const titleEl        = document.getElementById('scenario-title');
    const descEl         = document.getElementById('scenario-description');
    const feedbackPanel  = document.getElementById('feedback-panel');
    const btnPhishing    = document.getElementById('btn-choice-phishing');
    const btnLegit       = document.getElementById('btn-choice-legit');
    const leaderboardBody = document.getElementById('leaderboard-body');
    const btnClear       = document.getElementById('btn-clear-ranking');
    const progressBar    = document.getElementById('progress-bar');
    const progressLabel  = document.getElementById('progress-label');

    // --- ESCENARIOS ---
    const scenarios = [
        {
            t: "Escenario 1: Fraude del CEO (BEC)",
            d: "Recibes un correo urgente de tu Director General: 'Estoy en una reunión, necesito que transfieras $5000 a esta cuenta de proveedor nuevo de inmediato'.",
            p: true,
            h: "Ataque BEC. El sentido de urgencia extrema y las instrucciones financieras anómalas por correo siempre deben validarse por otro medio (teléfono)."
        },
        {
            t: "Escenario 2: Notificación Interna IT",
            d: "El sistema de HelpDesk envía un ticket automático indicando que tu solicitud de equipo nuevo ha sido aprobada.",
            p: false,
            h: "Flujo de comunicación automatizado y estandarizado del sistema interno de la empresa."
        },
        {
            t: "Escenario 3: Typosquatting en Enlaces",
            d: "Alerta de Recursos Humanos: 'Actualiza tu información fiscal antes del viernes'. El enlace visible lleva a 'https://portal-miempresa.com'.",
            p: true,
            h: "El dominio es sutilmente diferente al oficial. Sustituir o añadir palabras clave ('portal-') es la base del Typosquatting."
        },
        {
            t: "Escenario 4: Confirmación de Google Workspace",
            d: "Recibes un aviso de Google Drive informando que tu compañero ha modificado el documento 'Presupuesto Q4'.",
            p: false,
            h: "Notificación oficial y verificada de actividad colaborativa."
        },
        {
            t: "Escenario 5: Malware en Facturas",
            d: "Un proveedor te envía un correo en blanco con un único archivo adjunto llamado 'Factura_Atrasada.ZIP'.",
            p: true,
            h: "Correos sin contexto con archivos comprimidos (.ZIP, .RAR) son el principal vector para desplegar Ransomware en la red corporativa."
        },
        {
            t: "Escenario 6: Smishing (SMS)",
            d: "Mensaje de texto a tu móvil: 'Su cuenta bancaria ha sido bloqueada temporalmente. Restáurela en bit.ly/bank-auth9'.",
            p: true,
            h: "Las instituciones financieras genuinas nunca utilizan servicios de acortamiento de URLs (bit.ly) para gestiones de seguridad."
        },
        {
            t: "Escenario 7: Redes Sociales Corporativas",
            d: "Notificación de Slack: '@canal IT realizará mantenimiento de servidores hoy a las 11:00 PM'.",
            p: false,
            h: "Canal y formato correcto para avisos de infraestructura tecnológica."
        },
        {
            t: "Escenario 8: Vishing (Voz)",
            d: "Llamada telefónica: 'Hola, soy de soporte técnico de Microsoft. Hemos detectado virus en su red, instale este programa de acceso remoto'.",
            p: true,
            h: "Soporte técnico externo nunca realiza llamadas proactivas no solicitadas pidiendo instalación de software de control remoto (AnyDesk, TeamViewer)."
        },
        {
            t: "Escenario 9: Actualización de Políticas",
            d: "Correo desde 'compliance@tuempresa.com' con un PDF adjunto sobre el nuevo código de vestimenta.",
            p: false,
            h: "Comunicación corporativa esperada, desde un dominio exacto y con un archivo de lectura estándar (.PDF)."
        },
        {
            t: "Escenario 10: Extorsión Emocional",
            d: "Correo en tu bandeja personal: 'Tengo un video tuyo grabado desde tu webcam. Paga $1000 en Bitcoin o lo enviaré a tus contactos'.",
            p: true,
            h: "Ataque de extorsión (Sextortion). Suele ser un engaño masivo donde el atacante realmente no tiene acceso a tu cámara ni equipo."
        }
    ];

    // --- INICIO DEL QUIZ ---
    if (btnStart) {
        btnStart.addEventListener('click', startQuiz);
    }

    if (playerNameEl) {
        playerNameEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') startQuiz();
        });
    }

    function startQuiz() {
        const name = playerNameEl ? playerNameEl.value.trim() : '';
        playerName = name.length > 0 ? name : "Anonimo";
        if (startScreen) startScreen.style.display = 'none';
        if (quizContent) quizContent.style.display = 'block';
        loadScenario();
    }

    // --- CARGAR ESCENARIO ---
    function loadScenario() {
        if (currentIdx < scenarios.length) {
            if (feedbackPanel) {
                feedbackPanel.style.display = 'none';
                feedbackPanel.innerHTML = '';
            }
            if (titleEl) titleEl.innerText = scenarios[currentIdx].t;
            if (descEl)  descEl.innerText  = scenarios[currentIdx].d;
            if (btnPhishing) btnPhishing.disabled = false;
            if (btnLegit)    btnLegit.disabled    = false;

            const pct = Math.round((currentIdx / scenarios.length) * 100);
            if (progressBar)  progressBar.style.width = pct + '%';
            if (progressLabel) progressLabel.innerText = `Escenario ${currentIdx + 1} de ${scenarios.length}`;
        } else {
            showResults();
        }
    }

    // --- MANEJAR RESPUESTA ---
    function handleAnswer(isPhishingChoice) {
        if (btnPhishing) btnPhishing.disabled = true;
        if (btnLegit)    btnLegit.disabled    = true;

        const isCorrect = isPhishingChoice === scenarios[currentIdx].p;

        if (feedbackPanel) {
            feedbackPanel.style.display = 'block';
            if (isCorrect) {
                score += 10;
                feedbackPanel.className = "feedback correct-panel";
                feedbackPanel.innerHTML = `<strong>Evaluacion Correcta:</strong> ${scenarios[currentIdx].h}`;
            } else {
                if (worstCase === "Sin fallos") worstCase = scenarios[currentIdx].t;
                feedbackPanel.className = "feedback wrong-panel";
                feedbackPanel.innerHTML = `<strong>Riesgo Detectado:</strong> ${scenarios[currentIdx].h}`;
            }
        }

        currentIdx++;
        const pct = Math.round((currentIdx / scenarios.length) * 100);
        if (progressBar) progressBar.style.width = pct + '%';

        setTimeout(loadScenario, 3500);
    }

    // --- RESULTADOS FINALES ---
    function showResults() {
        const nivel      = score === 100 ? 'Optimo'    : score >= 70 ? 'Aceptable' : 'Critico';
        const nivelColor = score === 100 ? '#16a34a'   : score >= 70 ? '#2563eb'   : '#dc2626';
        if (quizContent) {
            quizContent.innerHTML = `
                <h3 style="color:#0f172a; margin-top:0; font-size:1.5rem; font-weight:700;">
                    Auditoria Completada
                </h3>
                <p style="font-size:1.2rem; color:#0f172a; margin-bottom:8px;">
                    <strong>${playerName}</strong> &mdash; Puntaje: <strong>${score} / 100 puntos</strong>
                </p>
                <p style="font-size:0.95rem; color:#64748b; margin-bottom:28px;">
                    Nivel de resiliencia: <strong style="color:${nivelColor};">${nivel}</strong>.
                    Tu resultado ha sido registrado en el ranking del dia.
                </p>
                <button class="btn-start" onclick="location.reload()">Repetir simulacion</button>
            `;
        }
        saveResult();
    }

    // --- PERSISTENCIA CON RESET DIARIO ---
    const STORAGE_KEY = 'pr02_telemetry_v2';

    function getTodayKey() {
        const d = new Date();
        return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    }

    function saveResult() {
        const today = getTodayKey();
        let stored = {};
        try {
            stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (e) { stored = {}; }

        if (stored.date !== today) {
            stored = { date: today, entries: [] };
        }

        stored.entries.push({ name: playerName, points: score, failure: worstCase });
        stored.entries.sort((a, b) => b.points - a.points);
        stored.entries = stored.entries.slice(0, 15);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
        renderLeaderboard();
    }

    function renderLeaderboard() {
        if (!leaderboardBody) return;
        const today = getTodayKey();
        let stored = {};
        try {
            stored = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
        } catch (e) { stored = {}; }

        if (stored.date !== today) {
            localStorage.removeItem(STORAGE_KEY);
            leaderboardBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#94a3b8; padding:20px;">El ranking de hoy esta vacio. Se el primero en completar el quiz.</td></tr>';
            return;
        }

        const entries = stored.entries || [];
        if (entries.length === 0) {
            leaderboardBody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#94a3b8; padding:20px;">El ranking de hoy esta vacio. Se el primero en completar el quiz.</td></tr>';
            return;
        }

        const pos = ['1', '2', '3'];
        leaderboardBody.innerHTML = entries.map((entry, i) => `
            <tr>
                <td>${pos[i] || (i + 1)}</td>
                <td><strong>${entry.name}</strong></td>
                <td><strong>${entry.points}%</strong></td>
                <td>${entry.failure}</td>
            </tr>
        `).join('');
    }

    // --- EVENTOS ---
    if (btnPhishing) btnPhishing.addEventListener('click', () => handleAnswer(true));
    if (btnLegit)    btnLegit.addEventListener('click',    () => handleAnswer(false));

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            localStorage.removeItem(STORAGE_KEY);
            renderLeaderboard();
        });
    }

    // --- INICIALIZAR LEADERBOARD ---
    renderLeaderboard();
});
