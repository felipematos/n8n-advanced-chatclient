// Chat Widget Script
(function() {
    // Limpar qualquer instância anterior do widget
    function cleanupExistingWidget() {
        // Remover elementos existentes do widget
        const existingWidget = document.querySelector('.n8n-chat-widget');
        if (existingWidget) {
            existingWidget.remove();
        }
        
        // Remover estilos existentes
        const existingStyle = document.getElementById('n8n-chat-widget-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
    }
    
    // Limpar quaisquer instâncias anteriores
    cleanupExistingWidget();
    
    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #080A56);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #0b0f7b);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #333333);
            font-family: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1001;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(8, 10, 86, 0.15);
            border: 1px solid rgba(8, 10, 86, 0.2);
            overflow: hidden;
            font-family: inherit;
            transition: all 0.3s ease;
        }

        .n8n-chat-widget .chat-container.expanded {
            width: 90vw;
            height: 90vh;
            top: 5vh;
            bottom: auto;
            right: 5vw;
        }

        .n8n-chat-widget .header-buttons {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: 24px;
        }

        .n8n-chat-widget .header-button {
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            opacity: 0.6;
            font-size: 20px;
        }

        .n8n-chat-widget .header-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .expand-button svg {
            width: 16px;
            height: 16px;
            transition: transform 0.3s ease;
        }

        .n8n-chat-widget .expanded .expand-button svg {
            transform: rotate(180deg);
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(8, 10, 86, 0.1);
            position: relative;
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--chat--color-font);
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.6;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header img {
            width: 32px;
            height: 32px;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: var(--chat--color-font);
        }

        .n8n-chat-widget .new-conversation {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            text-align: center;
            width: 100%;
            max-width: 300px;
        }

        .n8n-chat-widget .welcome-text {
            font-size: 24px;
            font-weight: 600;
            color: var(--chat--color-font);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .n8n-chat-widget .new-chat-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            width: 100%;
            padding: 16px 24px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            transition: transform 0.3s;
            font-weight: 500;
            font-family: inherit;
            margin-bottom: 12px;
        }

        .n8n-chat-widget .new-chat-btn:hover {
            transform: scale(1.02);
        }

        .n8n-chat-widget .message-icon {
            width: 20px;
            height: 20px;
        }

        .n8n-chat-widget .response-text {
            font-size: 14px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin: 0;
        }

        .n8n-chat-widget .chat-interface {
            display: none;
            flex-direction: column;
            height: 100%;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        .n8n-chat-widget .chat-interface.active {
            display: flex;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
            overflow-wrap: break-word;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(8, 10, 86, 0.2);
            border: none;
        }

        .n8n-chat-widget .chat-message.bot {
            background: var(--chat--color-background);
            border: 1px solid rgba(8, 10, 86, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .n8n-chat-widget .chat-input {
            padding: 8px;
            margin-bottom: 0;
            border-bottom-left-radius: 12px;
            border-bottom-right-radius: 12px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(8, 10, 86, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(8, 10, 86, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 20px;
            cursor: pointer;
            transition: transform 0.2s;
            font-family: inherit;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(8, 10, 86, 0.3);
            z-index: 1000;
            transition: transform 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .chat-footer {
            display: none;
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-size: 12px;
            opacity: 0.8;
            transition: opacity 0.2s;
            font-family: inherit;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 1;
        }

        .n8n-chat-widget .typing-indicator {
            display: flex;
            align-items: center;
            margin: 8px 0;
            padding: 12px 16px;
            border-radius: 12px;
            background: var(--chat--color-background);
            border: 1px solid rgba(8, 10, 86, 0.2);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            max-width: 80%;
        }
        
        .n8n-chat-widget .typing-indicator span {
            height: 8px;
            width: 8px;
            float: left;
            margin: 0 1px;
            background-color: var(--chat--color-primary);
            display: block;
            border-radius: 50%;
            opacity: 0.4;
        }
        
        .n8n-chat-widget .typing-indicator span:nth-of-type(1) {
            animation: 1s blink infinite 0.3333s;
        }
        
        .n8n-chat-widget .typing-indicator span:nth-of-type(2) {
            animation: 1s blink infinite 0.6666s;
        }
        
        .n8n-chat-widget .typing-indicator span:nth-of-type(3) {
            animation: 1s blink infinite 0.9999s;
        }
        
        @keyframes blink {
            50% {
                opacity: 1;
            }
        }
        
        .n8n-chat-widget .chat-message img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            display: block;
            margin: 10px auto;
        }
        
        .n8n-chat-widget .chat-message a {
            color: var(--chat--color-primary);
            text-decoration: underline;
            word-break: break-all;
        }
        
        .n8n-chat-widget .chat-message pre {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 10px;
            border-radius: 8px;
            overflow-x: auto;
            font-family: monospace;
            font-size: 12px;
        }
        
        .n8n-chat-widget .chat-message code {
            background-color: rgba(0, 0, 0, 0.05);
            padding: 2px 4px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
        }

        /* Animação de três pontos quando não há mensagens */
        .n8n-chat-widget .chat-messages:not(:has(div.chat-message))::after {
            content: "..." !important;
            display: block !important;
            font-size: 1.5rem !important;
            color: #333333 !important;
            text-align: center !important;
            padding: 12px 16px !important;
            animation: dots 1.5s infinite !important;
        }
        
        @keyframes dots {
            0% { content: "."; }
            33% { content: ".."; }
            66% { content: "..."; }
        }
        
        /* Ícone do botão de chat */
        .n8n-chat-widget .chat-toggle::before {
            content: "\\1F4AC" !important; /* Unicode para o ícone de balão de fala */
            font-size: 2rem !important;
            color: #ffffff !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 1 !important;
        }

        /* Estilos para listas */
        .n8n-chat-widget .chat-message ol,
        .n8n-chat-widget .chat-message ul {
            padding-left: 25px;
            margin: 8px 0;
        }
        
        .n8n-chat-widget .chat-message li {
            margin-bottom: 5px;
            padding-left: 5px;
        }
        
        .n8n-chat-widget .chat-message li > ol,
        .n8n-chat-widget .chat-message li > ul {
            margin-top: 5px;
            margin-bottom: 0;
        }
        
        .n8n-chat-widget .chat-message ol + br,
        .n8n-chat-widget .chat-message ul + br {
            display: none;
        }
        
        /* Estilos para cabeçalhos */
        .n8n-chat-widget .chat-message h1,
        .n8n-chat-widget .chat-message h2,
        .n8n-chat-widget .chat-message h3 {
            margin: 10px 0 5px 0;
            font-weight: bold;
        }
        
        .n8n-chat-widget .chat-message h1 {
            font-size: 1.5em;
        }
        
        .n8n-chat-widget .chat-message h2 {
            font-size: 1.3em;
        }
        
        .n8n-chat-widget .chat-message h3 {
            font-size: 1.1em;
        }

        .n8n-chat-widget .debug-image-placeholder {
            padding: 10px;
            background-color: #f0f0f0;
            border-radius: 8px;
            margin: 10px 0;
            color: #666;
            text-align: center;
            font-style: italic;
        }

        /* Atualizar os estilos para imagens */
        .n8n-chat-widget .chat-message.bot img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            display: block;
            margin: 10px auto;
            border: 1px solid rgba(8, 10, 86, 0.1);
        }
        
        .n8n-chat-widget .chat-message.bot .image-container {
            display: block;
            margin: 10px 0;
            text-align: center;
        }
        
        .n8n-chat-widget .image-placeholder {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f5f5f5;
            border-radius: 8px;
            margin: 10px 0;
            padding: 20px;
            border: 1px dashed rgba(8, 10, 86, 0.2);
            color: #666;
            font-style: italic;
        }

        /* Estilos para objetos de ação rápida */
        .n8n-chat-widget .quick-action-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .n8n-chat-widget .quick-action-button {
            background: linear-gradient(135deg, var(--chat--color-primary-light, #f0f2ff) 0%, var(--chat--color-secondary-light, #f5f0ff) 100%);
            color: var(--chat--color-primary, #080A56);
            border: 1px solid rgba(8, 10, 86, 0.1);
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 6px rgba(8, 10, 86, 0.05);
        }

        .n8n-chat-widget .quick-action-button:hover {
            background: linear-gradient(135deg, var(--chat--color-primary-light-hover, #e6e9ff) 0%, var(--chat--color-secondary-light-hover, #ede6ff) 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(8, 10, 86, 0.1);
        }

        .n8n-chat-widget .quick-action-button:active {
            transform: translateY(1px);
            box-shadow: 0 2px 4px rgba(8, 10, 86, 0.05);
        }

        .n8n-chat-widget .quick-action-button.external {
            padding-right: 12px;
        }

        .n8n-chat-widget .quick-action-button.external::after {
            content: "↗";
            font-size: 12px;
            opacity: 0.7;
        }

        .n8n-chat-widget .quick-action-select {
            background: linear-gradient(135deg, var(--chat--color-primary-light, #f0f2ff) 0%, var(--chat--color-secondary-light, #f5f0ff) 100%);
            color: var(--chat--color-primary, #080A56);
            border: 1px solid rgba(8, 10, 86, 0.1);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
            max-width: 100%;
            box-shadow: 0 2px 6px rgba(8, 10, 86, 0.05);
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23080A56' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 10px center;
            background-size: 15px;
            padding-right: 35px;
        }

        .n8n-chat-widget .quick-action-select:hover {
            background: linear-gradient(135deg, var(--chat--color-primary-light-hover, #e6e9ff) 0%, var(--chat--color-secondary-light-hover, #ede6ff) 100%);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(8, 10, 86, 0.1);
        }

        .n8n-chat-widget .quick-action-select:active {
            transform: translateY(1px);
            box-shadow: 0 2px 4px rgba(8, 10, 86, 0.05);
        }

        .n8n-chat-widget .quick-action-select option {
            background-color: var(--chat--color-background, #ffffff);
            color: var(--chat--color-font, #333333);
        }

        .n8n-chat-widget .quick-action-link {
            font-weight: bold;
            background: linear-gradient(to right, var(--chat--color-primary), var(--chat--color-secondary));
            -webkit-background-clip: text;
            color: transparent;
            text-decoration: none;
            cursor: pointer;
            transition: opacity 0.2s;
        }

        .n8n-chat-widget .quick-action-link:hover {
            opacity: 0.8;
        }

        /* Estilos para o balão de prompt proativo */
        .n8n-chat-widget .proactive-prompt {
            position: fixed;
            bottom: 90px; /* Acima do botão de toggle */
            right: 20px;
            width: 280px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            padding: 16px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(8, 10, 86, 0.2);
            z-index: 999; /* Abaixo do toggle */
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.4s ease, transform 0.4s ease;
            font-size: 14px;
            line-height: 1.5;
        }

        .n8n-chat-widget .proactive-prompt.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .proactive-prompt.show {
            opacity: 1;
            transform: translateY(0);
        }

        /* Seta apontando para o botão de toggle */
        .n8n-chat-widget .proactive-prompt::after {
            content: '';
            position: absolute;
            bottom: -10px; /* Posiciona a seta abaixo do balão */
            right: 25px; /* Alinha com o centro do botão toggle */
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid var(--chat--color-secondary); /* Cor correspondente ao gradiente */
        }

        .n8n-chat-widget .proactive-prompt.position-left::after {
            right: auto;
            left: 25px;
        }

        .n8n-chat-widget .proactive-prompt .close-prompt {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            color: white;
            opacity: 0.7;
            cursor: pointer;
            font-size: 18px;
            padding: 4px;
            line-height: 1;
            transition: opacity 0.2s;
        }

        .n8n-chat-widget .proactive-prompt .close-prompt:hover {
            opacity: 1;
        }
    `;

    // Load Geist font
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://cdn.jsdelivr.net/npm/geist@1.0.0/dist/fonts/geist-sans/style.css';
    document.head.appendChild(fontLink);

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.id = 'n8n-chat-widget-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '',
            responseTimeText: '',
            poweredBy: {
                text: '',
                link: ''
            }
        },
        style: {
            primaryColor: '#080A56',
            secondaryColor: '#0b0f7b',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#333333'
        },
        proactivePrompt: {
            enabled: false,
            delay: 10000, // 10 segundos
            message: {} // Será preenchido com traduções
        }
    };

    // Preencher mensagens padrão do prompt proativo
    defaultConfig.proactivePrompt.message = {
        en: "Chat with our AI now and resolve all your doubts!",
        pt: "Converse com nossa IA agora e resolva todas as suas dúvidas!",
        es: "¡Chatea con nuestra IA ahora y resuelve todas tus dudas!",
        ar: "تحدث مع الذكاء الاصطناعي الخاص بنا الآن وحل جميع شكوكك!"
    };

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style },
            // Mesclar configuração do prompt proativo
            proactivePrompt: { ...defaultConfig.proactivePrompt, ...(window.ChatWidgetConfig.proactivePrompt || {}) }
        } : defaultConfig;

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

    // Criar uma variável global para detectar o idioma
    const url = window.location.href;
    const langMatch = url.match(/\/(en|pt|es|ar)(\/|$)/);
    const lang = langMatch ? langMatch[1] : 'en';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    // Criar conteúdo do chat container diretamente
    let chatContainerHTML = `
        <div class="brand-header">
            ${config.branding.logo ? `<img src="${config.branding.logo}" alt="${config.branding.name || 'Chat'}" />` : ''}
            <span>${config.branding.name || 'Chat'}</span>
            <div class="header-buttons">
                <button class="header-button close-button" title="Fechar">×</button>
                <button class="header-button expand-button" title="Expandir/Contrair">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="chat-interface">
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="${lang === 'pt' ? 'Digite sua mensagem...' : lang === 'es' ? 'Escribe tu mensaje...' : lang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}" rows="1"></textarea>
                <button>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="new-conversation">
            <p class="welcome-text">${config.branding.welcomeText || 'Como posso ajudar?'}</p>
            <button class="new-chat-btn">
                <svg class="message-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.249 22 8.50148 21.566 6.90191 20.6992L2 22L3.30075 17.0981C2.43402 15.4985 2 13.751 2 12C2 6.47715 6.47715 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ${lang === 'pt' ? 'Iniciar conversa' : lang === 'es' ? 'Iniciar conversación' : lang === 'ar' ? 'بدء المحادثة' : 'Start chat'}
            </button>
            <p class="response-text">${config.branding.responseTimeText || 'Estamos prontos para responder suas perguntas.'}</p>
        </div>
    `;
    
    chatContainer.innerHTML = chatContainerHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const newChatBtn = chatContainer.querySelector('.new-chat-btn');
    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('.chat-input button');

    function generateUUID() {
        // Verificar se o método nativo está disponível
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        
        // Fallback para implementação manual de UUID v4
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Função para controlar logs de depuração
    function debug(message, data, isError = false) {
        // Verificar se o modo debug está ativado via configuração local ou global
        const debugMode = (window.ChatWidgetConfig && window.ChatWidgetConfig.debug === true) || 
                          (window.n8nChatDebug === true);
        
        if (debugMode) {
            const method = isError ? console.error : console.log;
            const prefix = '[n8n Chat Widget] ';
            if (data) {
                method(prefix + message, data);
            } else {
                method(prefix + message);
            }
        }
    }

    // Função para verificar se uma string é um JSON válido
    function isValidJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    // Função para tentar analisar JSON com segurança
    async function safeParseJSON(response) {
        try {
            // Primeiro obter a resposta como texto
            const text = await response.text();
            
            // Verificar se é um JSON válido
            if (isValidJSON(text)) {
                return JSON.parse(text);
            }
            
            // Se não for JSON válido, retornar um objeto padrão
            debug('Resposta não é JSON válido:', text, true);
            return { output: "Olá! Como posso ajudar?" };
        } catch (e) {
            debug('Erro ao analisar JSON:', e, true);
            return { output: "Olá! Como posso ajudar?" };
        }
    }

    // Função para mostrar o indicador de digitação
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        typingDiv.id = 'typing-indicator';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return typingDiv;
    }
    
    // Função para remover o indicador de digitação
    function hideTypingIndicator() {
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) {
            typingDiv.remove();
        }
    }

    // Função para verificar se estamos dentro de um bloco de código
    function isWithinCodeBlock(text, position) {
        // Encontrar todos os blocos de código ```
        const codeBlockRegex = /```[\s\S]*?```/g;
        let match;
        while ((match = codeBlockRegex.exec(text)) !== null) {
            // Verificar se a posição está dentro deste bloco
            if (position >= match.index && position < match.index + match[0].length) {
                return true;
            }
        }
        
        // Encontrar todos os trechos de código inline `
        const inlineCodeRegex = /`[^`]*`/g;
        while ((match = inlineCodeRegex.exec(text)) !== null) {
            // Verificar se a posição está dentro deste trecho
            if (position >= match.index && position < match.index + match[0].length) {
                return true;
            }
        }
        
        return false;
    }

    // Função melhorada para detectar se o conteúdo parece ser uma URL de imagem GIF ou um link de serviço de GIF
    function isGifURL(text) {
        if (!text) return false;
        
        // Verificar se é uma string
        if (typeof text !== 'string') return false;
        
        // Verificar se contém uma URL
        const urlMatch = text.match(/https?:\/\/\S+/i);
        if (!urlMatch) return false;
        
        const url = urlMatch[0].trim();
        
        // Remover caracteres de pontuação do final da URL
        let cleanUrl = url.replace(/[.,;!?]$/, '');
        
        // Verificar diretamente se é uma imagem com extensão suportada
        if (/\.(gif|jpe?g|png|webp|svg)(\?[^"'\s<>]*)?$/i.test(cleanUrl)) {
            return true;
        }
        
        // Verificar serviços de imagens conhecidos
        const imageServices = [
            /giphy\.com/i,
            /tenor\.com/i,
            /gfycat\.com/i,
            /media\.giphy\.com/i,
            /media\.tenor\.com/i,
            /imgur\.com/i,
            /cloudinary\.com/i,
            /unsplash\.com/i,
            /flickr\.com/i,
            /500px\.com/i,
            /instagram\.com/i
        ];
        
        return imageServices.some(regex => regex.test(cleanUrl));
    }

    // Função para processar uma única URL e determinar se é uma imagem
    function processImageURL(url) {
        if (!url) return null;
        
        // Limpar a URL
        let cleanUrl = url.trim();
        
        // Remover caracteres de pontuação no final
        cleanUrl = cleanUrl.replace(/[.,;!?]$/, '');
        
        // Verificar se é uma URL de imagem conhecida
        if (/\.(gif|jpe?g|png|webp|svg)(\?[^"'\s<>]*)?$/i.test(cleanUrl)) {
            return {
                url: cleanUrl,
                isImage: true,
                type: cleanUrl.match(/\.(gif|jpe?g|png|webp|svg)/i)[1].toLowerCase()
            };
        }
        
        // Verificar serviços de imagens conhecidos
        const imageServices = [
            { regex: /giphy\.com/i, type: 'gif' },
            { regex: /tenor\.com/i, type: 'gif' },
            { regex: /gfycat\.com/i, type: 'gif' },
            { regex: /media\.giphy\.com/i, type: 'gif' },
            { regex: /media\.tenor\.com/i, type: 'gif' },
            { regex: /imgur\.com/i, type: 'img' },
            { regex: /cloudinary\.com/i, type: 'img' },
            { regex: /unsplash\.com/i, type: 'img' },
            { regex: /flickr\.com/i, type: 'img' },
            { regex: /500px\.com/i, type: 'img' }
        ];
        
        for (const service of imageServices) {
            if (service.regex.test(cleanUrl)) {
                return {
                    url: cleanUrl,
                    isImage: true,
                    type: service.type
                };
            }
        }
        
        return {
            url: cleanUrl,
            isImage: false
        };
    }

    // Função para extrair URLs de GIF ou imagem de um texto
    function extractGifURL(text) {
        if (!text) return null;
        
        // Encontrar todas as URLs no texto
        const urlRegex = /https?:\/\/\S+/gi;
        let match;
        let validImages = [];
        
        while ((match = urlRegex.exec(text)) !== null) {
            const url = match[0];
            const urlPosition = match.index;
            
            // Verificar se a URL está dentro de um bloco de código ou atributo HTML
            if (isWithinCodeBlock(text, urlPosition) || 
                isWithinHTMLAttribute(text, urlPosition)) {
                continue;
            }
            
            // Processar a URL para determinar se é uma imagem
            const processedUrl = processImageURL(url);
            
            if (processedUrl.isImage) {
                validImages.push({ 
                    url: processedUrl.url, 
                    position: urlPosition,
                    type: processedUrl.type || 'img'
                });
            }
        }
        
        // Retornar a primeira URL válida encontrada
        return validImages.length > 0 ? validImages[0].url : null;
    }

    // Verificar se a URL está dentro de um atributo HTML como src ou href
    function isWithinHTMLAttribute(text, position) {
        // Procurar por padrões de atributos HTML antes da posição
        const beforeText = text.substring(0, position);
        const afterText = text.substring(position);
        
        // Verificar padrões como src="... ou href="...
        if (/\b(src|href)\s*=\s*["']?[^"']*$/i.test(beforeText)) {
            return true;
        }
        
        // Verificar se estamos dentro de uma tag HTML
        const openTagBefore = beforeText.lastIndexOf('<');
        const closeTagBefore = beforeText.lastIndexOf('>');
        const openTagAfter = afterText.indexOf('<');
        const closeTagAfter = afterText.indexOf('>');
        
        // Se há uma tag aberta antes e fechada depois, estamos dentro de uma tag
        if (openTagBefore > closeTagBefore && closeTagAfter >= 0 && 
            (openTagAfter < 0 || closeTagAfter < openTagAfter)) {
            return true;
        }
        
        return false;
    }

    // Função para renderizar conteúdo especial como GIFs e imagens
    function renderSpecialContent(text) {
        if (!text) return '';
        
        // Primeiro passo: verificar se o texto completo é uma URL de imagem
        if (/^https?:\/\/[^\s]+\.(gif|jpe?g|png|webp|svg)(\?[^"'\s<>]*)?$/i.test(text.trim())) {
            const url = text.trim();
            
            // Usar template string sem quebras de linha para evitar problemas
            return `<div class="image-container"><img src="${url}" alt="Imagem" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'image-placeholder\\'>Imagem não disponível</div>'"></div>`;
        }
        
        // Segundo passo: processar markdown e encontrar imagens
        const lines = text.split('\n');
        const processedLines = [];
        
        for (const line of lines) {
            // Verificar se a linha é uma imagem markdown
            const imageMarkdown = line.match(/^!\[(.*?)\]\((https?:\/\/[^)]+)\)$/);
            if (imageMarkdown) {
                const [_, alt, url] = imageMarkdown;
                // Usar template string sem quebras de linha
                processedLines.push(`<div class="image-container"><img src="${url}" alt="${alt || 'Imagem'}" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'image-placeholder\\'>Imagem não disponível</div>'"></div>`);
                continue;
            }
            
            // Verificar se a linha é uma URL de imagem
            const imageUrl = line.match(/^(https?:\/\/[^\s]+\.(gif|jpe?g|png|webp|svg)(\?[^"'\s<>]*)?)$/i);
            if (imageUrl) {
                const url = imageUrl[1];
                // Usar template string sem quebras de linha
                processedLines.push(`<div class="image-container"><img src="${url}" alt="Imagem" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'image-placeholder\\'>Imagem não disponível</div>'"></div>`);
                continue;
            }
            
            // Para outras linhas, apenas adicionar
            processedLines.push(line);
        }
        
        // Juntar as linhas processadas
        const processedText = processedLines.join('\n');
        
        // Processar o resto do markdown
        let processedHtml = renderMarkdown(processedText);
        
        // Procurar por URLs de imagem soltas no texto final
        processedHtml = processedHtml.replace(/(https?:\/\/[^\s<>"']+\.(gif|jpe?g|png|webp|svg)(\?[^"'\s<>]*)?)/gi, function(match) {
            // Verificar se já está dentro de uma tag img
            if (processedHtml.indexOf(`<img src="${match}"`) >= 0 || 
                processedHtml.indexOf(`<img src='${match}'`) >= 0) {
                return match;
            }
            return `<img src="${match}" alt="Imagem" onerror="this.style.display='none'; this.parentNode.innerHTML='<div class=\\'image-placeholder\\'>Imagem não disponível</div>'">`;
        });
        
        return processedHtml;
    }

    // Função para processar ![image](url) no Markdown
    function processImageMarkdown(text) {
        // Processar imagens - ![alt](url)
        return text.replace(
            /!\[([^\]]*)\]\(([^)]+)\)/g, 
            (match, alt, url) => {
                // Extrair extensão do arquivo para melhorar a tag alt
                const extension = url.toLowerCase().match(/\.(gif|jpe?g|png)(\?|$)/);
                const altText = alt || (extension ? extension[1].toUpperCase() : "Imagem");
                
                return `<img src="${url}" alt="${altText}" style="max-width:100%; border-radius:8px; display:block; margin:0 auto;" />`;
            }
        );
    }

    // Escape string para uso em regex
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Função para renderizar Markdown para HTML simples
    function renderMarkdown(text) {
        if (!text) return '';
        
        let html = text;
        
        // Armazenar temporariamente os marcadores de ação rápida
        const quickActionMarkers = [];
        let markerIndex = 0;
        
        // Preservar links de ação rápida - [texto](action:mensagem) ou [texto](acao:mensagem)
        html = html.replace(/\[([^\]]+)\]\((action|acao):([^)]+)\)/g, (match) => {
            const marker = `__QUICK_ACTION_LINK_${markerIndex++}__`;
            quickActionMarkers.push({ marker, content: match });
            return marker;
        });
        
        // Preservar botões - [{button:texto|mensagem}] ou [{botao:texto|mensagem}]
        html = html.replace(/\[\{(button|botao):([^|]+)\|([^}]+)\}\]/g, (match) => {
            const marker = `__QUICK_ACTION_BUTTON_${markerIndex++}__`;
            quickActionMarkers.push({ marker, content: match });
            return marker;
        });
        
        // Preservar listas de seleção - [{list:titulo|opção1:mensagem1|opção2:mensagem2}] ou [{lista:titulo|opção1:mensagem1|opção2:mensagem2}]
        html = html.replace(/\[\{(list|lista):([^|]+)\|((?:[^|:]+:[^|:]+\|?)+)\}\]/g, (match) => {
            const marker = `__QUICK_ACTION_SELECT_${markerIndex++}__`;
            quickActionMarkers.push({ marker, content: match });
            return marker;
        });
        
        // Processar imagens markdown - ![alt](url)
        html = html.replace(/!\[(.*?)\]\((https?:\/\/[^)]+)\)/gi, function(match, alt, url) {
            return `<img src="${url}" alt="${alt || 'Imagem'}" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%2270%22 viewBox=%220 0 100 70%22%3E%3Crect width=%22100%22 height=%2270%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%22 y=%2235%22 font-family=%22Arial%22 font-size=%228%22 text-anchor=%22middle%22 fill=%22%23999%22%3EImagem não disponível%3C/text%3E%3C/svg%3E';">`;
        });
        
        // Procurar por URLs de imagem diretamente no texto
        html = html.replace(/(https?:\/\/[^\s<>"']+?\.(gif|jpe?g|png|webp)(\?[^"'\s<>]*)?)/gi, function(match) {
            // Verificar se já está dentro de uma tag img
            if (html.indexOf(`<img src="${match}"`) >= 0 || 
                html.indexOf(`<img src='${match}'`) >= 0) {
                return match;
            }
            return `<img src="${match}" alt="Imagem" onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%2270%22 viewBox=%220 0 100 70%22%3E%3Crect width=%22100%22 height=%2270%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%22 y=%2235%22 font-family=%22Arial%22 font-size=%228%22 text-anchor=%22middle%22 fill=%22%23999%22%3EImagem não disponível%3C/text%3E%3C/svg%3E';">`;
        });
        
        // Pré-processamento para blocos de código
        html = html.replace(/```([^`]+)```/g, '<pre>$1</pre>');
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Processar cabeçalhos
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        
        // Processar links - [texto](url)
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Processar negrito - **texto**
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Processar itálico - *texto*
        html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
        
        // Processar listas ordenadas em uma única passagem
        html = html.replace(/(?:^\d+\.\s(.+)(?:\n|$))+/gm, function(match) {
            const items = match.split('\n').filter(line => line.trim());
            let counter = 1;
            return '<ol>' + items.map(item => {
                // Extrair o número original da lista
                const originalNumber = parseInt(item.match(/^(\d+)\./)[1], 10);
                // Se houver um salto na numeração, atualizar o contador
                if (originalNumber > counter) {
                    counter = originalNumber;
                }
                const content = item.replace(/^\d+\.\s+/, '');
                // Usar o valor do contador para a numeração
                const li = `<li value="${counter}">${content}</li>`;
                counter++;
                return li;
            }).join('') + '</ol>';
        });
        
        // Processar listas não ordenadas em uma única passagem
        html = html.replace(/(?:^[\*\-]\s(.+)(?:\n|$))+/gm, function(match) {
            const items = match.split('\n').filter(line => line.trim());
            return '<ul>' + items.map(item => {
                const content = item.replace(/^[\*\-]\s+/, '');
                return `<li>${content}</li>`;
            }).join('') + '</ul>';
        });
        
        // Processar quebras de linha
        html = html.replace(/\n\s*\n/g, '<br><br>');
        html = html.replace(/\n/g, '<br>');
        
        // Restaurar os marcadores de ação rápida
        quickActionMarkers.forEach(({ marker, content }) => {
            html = html.replace(marker, content);
        });
        
        return html;
    }

    // Função para mostrar uma mensagem do bot com suporte a markdown e conteúdo especial
    function displayBotMessage(message) {
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        
        // Verificar se a mensagem contém somente uma URL de imagem
        if (/^https?:\/\/[^\s]+\.(gif|jpe?g|png|webp|svg)(\?[^"'\s<>]*)?$/i.test(message.trim())) {
            const url = message.trim();
            
            // Criar elemento de imagem programaticamente para evitar problemas de escape
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Imagem';
            
            // Adicionar onerror handler como função em vez de string
            img.onerror = function() {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'image-placeholder';
                placeholder.textContent = 'Imagem não disponível';
                this.parentNode.innerHTML = '';
                this.parentNode.appendChild(placeholder);
            };
            
            imageContainer.appendChild(img);
            botMessageDiv.appendChild(imageContainer);
        } else {
            // Processar objetos de ação rápida
            const quickActions = processQuickActions(message);
            
            // Renderizar mensagem normalmente com o texto processado
            botMessageDiv.innerHTML = renderSpecialContent(quickActions.text);
            
            // Renderizar objetos de ação rápida, se houver
            renderQuickActions(quickActions, botMessageDiv);
        }
        
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Mensagens traduzidas
    const translations = {
        en: {
            connecting: "Hi! Connecting you...",
            fallback: "Hi! How can I help?",
            processing: "Thank you for your message. We're processing it and will respond shortly.",
            error: "Thank you for your message. How can I help you further?",
            proactiveMessage: defaultConfig.proactivePrompt.message['en'] // Default to English
        },
        pt: {
            connecting: "Olá! Estamos conectando você...",
            fallback: "Olá! Como posso ajudar?",
            processing: "Obrigado pela sua mensagem. Estamos processando e responderemos em breve.",
            error: "Obrigado pela sua mensagem. Como posso ajudar mais?",
            proactiveMessage: defaultConfig.proactivePrompt.message['pt']
        },
        es: {
            connecting: "¡Hola! Conectándote...",
            fallback: "¡Hola! ¿Cómo puedo ayudar?",
            processing: "Gracias por tu mensaje. Lo estamos procesando y responderemos pronto.",
            error: "Gracias por tu mensaje. ¿Cómo puedo ayudarte más?",
            proactiveMessage: defaultConfig.proactivePrompt.message['es']
        },
        ar: {
            connecting: "مرحباً! جاري توصيلك...",
            fallback: "مرحباً! كيف يمكنني المساعدة؟",
            processing: "شكراً لرسالتك. نحن نعالجها وسنرد قريباً.",
            error: "شكراً لرسالتك. كيف يمكنني المساعدة أكثر؟",
            proactiveMessage: defaultConfig.proactivePrompt.message['ar']
        }
    };

    // Função para obter mensagem traduzida
    function getTranslatedMessage(key) {
        return (translations[lang] && translations[lang][key]) || translations['en'][key];
    }

    // Sobrescrita global de fetch para suprimir erros 500
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        return originalFetch(url, options)
            .then(response => {
                // Se for um erro 500 para o webhook específico, suprimir o erro no console
                if (response.status === 500 && 
                    url.toString().includes(config.webhook.url)) {
                    // Silenciar o erro no console
                    console.groupCollapsed('[n8n Chat Widget] Requisição tratada (500)');
                    console.info('URL:', url);
                    console.info('Status:', response.status);
                    console.groupEnd();
                    
                    // Clonar a resposta para não alterá-la
                    const originalClone = response.clone();
                    
                    // Retornar uma resposta falsificada para o código continuar funcionando
                    return {
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        headers: new Headers({ "content-type": "application/json" }),
                        json: async () => { 
                            try {
                                // Tentar obter o corpo original primeiro
                                const text = await originalClone.text();
                                if (text && isValidJSON(text)) {
                                    return JSON.parse(text);
                                }
                            } catch (e) { /* silenciar erro */ }
                            
                            // Fallback para uma resposta genérica
                            return { output: getTranslatedMessage('fallback') };
                        },
                        text: async () => {
                            try {
                                return await originalClone.text();
                            } catch (e) {
                                return JSON.stringify({ output: getTranslatedMessage('fallback') });
                            }
                        },
                        clone: function() { return this; }
                    };
                }
                return response;
            })
            .catch(error => {
                // Se a URL for do webhook, interceptar o erro
                if (typeof url === 'string' && url.includes(config.webhook.url)) {
                    console.groupCollapsed('[n8n Chat Widget] Erro de rede interceptado');
                    console.info('URL:', url);
                    console.info('Erro:', error.message);
                    console.groupEnd();
                    
                    // Retornar uma resposta falsificada
                    return {
                        ok: true,
                        status: 200,
                        statusText: "OK",
                        headers: new Headers({ "content-type": "application/json" }),
                        json: async () => ({ output: getTranslatedMessage('fallback') }),
                        text: async () => JSON.stringify({ output: getTranslatedMessage('fallback') }),
                        clone: function() { return this; }
                    };
                }
                
                // Para outras URLs, deixar o erro passar normalmente
                throw error;
            });
    };

    async function startNewConversation() {
        currentSessionId = generateUUID();
        const data = {
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route || 'general',
            metadata: {
                userId: "",
                timestamp: new Date().toISOString(),
                language: lang
            }
        };
        
        // Mostrar indicador de digitação
        showTypingIndicator();
        
        try {
            debug('Iniciando nova conversa:', data);
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            debug('Resposta do webhook - Status:', response.status);
            let message = getTranslatedMessage('fallback');
            
            try {
                const responseText = await response.text();
                debug('Resposta do webhook - Texto:', responseText);
                
                if (responseText && responseText.trim()) {
                    const responseData = JSON.parse(responseText);
                    debug('Resposta do webhook - JSON:', responseData);
                    
                    if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].output) {
                        message = responseData[0].output;
                    } else if (responseData.output) {
                        message = responseData.output;
                    } else if (typeof responseData === 'string') {
                        message = responseData;
                    }
                }
            } catch (error) {
                debug('Erro ao processar resposta:', error, true);
                message = getTranslatedMessage('fallback');
            }

            // Remover o indicador de digitação
            hideTypingIndicator();
            
            // Atualizar a mensagem inicial
            const firstBotMessage = messagesContainer.querySelector('.chat-message.bot');
            if (firstBotMessage) {
                firstBotMessage.innerHTML = renderSpecialContent(message);
            } else {
                displayBotMessage(message);
            }
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            return message;
        } catch (error) {
            debug('Erro ao iniciar conversa:', error, true);
            hideTypingIndicator();
            
            const fallbackMessage = getTranslatedMessage('fallback');
            const firstBotMessage = messagesContainer.querySelector('.chat-message.bot');
            if (firstBotMessage) {
                firstBotMessage.textContent = fallbackMessage;
            } else {
                displayBotMessage(fallbackMessage);
            }
            
            throw error;
        }
    }
    
    async function sendMessage(message) {
        if (!message || message.trim() === '') return;

        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route || 'general',
            chatInput: message,
            metadata: {
                userId: "",
                timestamp: new Date().toISOString(),
                language: lang
            }
        };

        // Exibir mensagem do usuário 
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Mostrar indicador de digitação
        showTypingIndicator();

        try {
            debug('Enviando mensagem para webhook:', messageData);
            const response = await fetch(config.webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            debug('Resposta do webhook - Status:', response.status);
            let responseMessage = getTranslatedMessage('processing');
            
            // Verificar se a resposta é válida
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Tentar ler o texto da resposta primeiro
            const responseText = await response.text();
            debug('Resposta do webhook - Texto:', responseText);

            try {
                // Tentar fazer o parse do JSON apenas se houver conteúdo
                if (responseText && responseText.trim()) {
                    const data = JSON.parse(responseText);
                    debug('Resposta do webhook - JSON:', data);
                    
                    // Verificar diferentes formatos possíveis de resposta
                    if (data.output) {
                        responseMessage = data.output;
                    } else if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                        if (data.data[0].output) {
                            responseMessage = data.data[0].output;
                        }
                    } else if (typeof data === 'string') {
                        responseMessage = data;
                    } else {
                        debug('Resposta em formato desconhecido:', data);
                        responseMessage = getTranslatedMessage('fallback');
                    }
                } else {
                    debug('Resposta vazia do webhook');
                    responseMessage = getTranslatedMessage('fallback');
                }
            } catch (error) {
                debug('Erro ao processar JSON da resposta:', error, true);
                responseMessage = getTranslatedMessage('fallback');
            }
            
            // Remover o indicador de digitação
            hideTypingIndicator();
            
            // Mostrar a resposta do bot
            displayBotMessage(responseMessage);
        } catch (error) {
            debug('Erro na chamada do webhook:', error, true);
            hideTypingIndicator();
            displayBotMessage(getTranslatedMessage('fallback'));
        }
    }

    // Função auxiliar para extrair URLs de imagem
    function extractImageUrls(text) {
        if (!text) return [];
        
        const urls = [];
        const imageRegex = /https?:\/\/[^\s<>"']+\.(gif|jpe?g|png|webp|svg)(\?[^"'\s<>]*)?/gi;
        let match;
        
        while ((match = imageRegex.exec(text)) !== null) {
            urls.push(match[0]);
        }
        
        return urls;
    }

    // Função para verificar se uma string é uma URL válida
    function isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Função para processar objetos de ação rápida na mensagem
    function processQuickActions(text) {
        if (!text) return { text: '', hasQuickActions: false };
        
        let processedText = text;
        let buttons = [];
        let selectOptions = [];
        let links = [];
        
        // Processar links de ação rápida - [texto](action:mensagem) ou [texto](acao:mensagem)
        processedText = processedText.replace(/\[([^\]]+)\]\((action|acao):([^)]+)\)/g, (match, text, actionType, action) => {
            // Verificar se a ação é uma URL
            if (isValidUrl(action)) {
                buttons.push({ text, action, type: 'external' });
            } else {
                links.push({ text, action });
            }
            return ''; // Remover o link do texto
        });
        
        // Processar botões - [{button:texto|mensagem}] ou [{botao:texto|mensagem}]
        processedText = processedText.replace(/\[\{(button|botao):([^|]+)\|([^}]+)\}\]/g, (match, buttonType, text, action) => {
            // Verificar se a ação é uma URL
            if (isValidUrl(action)) {
                buttons.push({ text, action, type: 'external' });
            } else {
                buttons.push({ text, action, type: 'normal' });
            }
            return ''; // Remover o botão do texto
        });
        
        // Processar listas de seleção - [{list:titulo|opção1:mensagem1|opção2:mensagem2}] ou [{lista:titulo|opção1:mensagem1|opção2:mensagem2}]
        processedText = processedText.replace(/\[\{(list|lista):([^|]+)\|((?:[^|:]+:[^|:]+\|?)+)\}\]/g, (match, listType, title, optionsText) => {
            const options = optionsText.split('|').map(option => {
                const [text, action] = option.split(':');
                return { text, action, type: isValidUrl(action) ? 'external' : 'normal' };
            });
            selectOptions.push({ title, options });
            return ''; // Remover a lista do texto
        });
        
        // Limpar espaços extras após processamento
        processedText = processedText.trim();
        
        // Verificar se há objetos de ação rápida
        const hasQuickActions = buttons.length > 0 || selectOptions.length > 0 || links.length > 0;
        
        return {
            text: processedText,
            hasQuickActions,
            buttons,
            selectOptions,
            links
        };
    }
    
    // Função para renderizar objetos de ação rápida
    function renderQuickActions(quickActions, messageElement) {
        if (!quickActions.hasQuickActions) return;
        
        // Processar links embutidos e adicionar ao texto da mensagem
        if (quickActions.links.length > 0) {
            const originalContent = messageElement.innerHTML;
            let newContent = originalContent;
            
            quickActions.links.forEach(link => {
                const linkHTML = `<a class="quick-action-link" data-action="${link.action}">${link.text}</a>`;
                newContent += ' ' + linkHTML;
            });
            
            messageElement.innerHTML = newContent;
        }
        
        // Verificar se há botões ou listas de seleção
        if (quickActions.buttons.length > 0 || quickActions.selectOptions.length > 0) {
            const container = document.createElement('div');
            container.className = 'quick-action-container';
            
            // Adicionar botões (limitado a 4)
            const maxButtons = 4;
            if (quickActions.buttons.length > 0 && quickActions.selectOptions.length === 0) {
                quickActions.buttons.slice(0, maxButtons).forEach(button => {
                    const buttonElement = document.createElement('button');
                    buttonElement.className = `quick-action-button ${button.type === 'external' ? 'external' : ''}`;
                    buttonElement.textContent = button.text;
                    buttonElement.dataset.action = button.action;
                    buttonElement.dataset.type = button.type;
                    container.appendChild(buttonElement);
                });
            }
            
            // Adicionar lista de seleção (apenas uma, se não houver botões)
            if (quickActions.selectOptions.length > 0 && quickActions.buttons.length === 0) {
                const selectOption = quickActions.selectOptions[0];
                const selectElement = document.createElement('select');
                selectElement.className = 'quick-action-select';
                
                // Opção padrão com o título
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = selectOption.title;
                defaultOption.disabled = true;
                defaultOption.selected = true;
                selectElement.appendChild(defaultOption);
                
                // Adicionar opções da lista
                selectOption.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.action;
                    optionElement.textContent = option.text;
                    optionElement.dataset.type = option.type;
                    selectElement.appendChild(optionElement);
                });
                
                container.appendChild(selectElement);
            }
            
            messageElement.appendChild(container);
        }
        
        // Adicionar event listeners para os objetos de ação rápida
        addQuickActionEventListeners(messageElement);
    }
    
    // Função para adicionar event listeners aos objetos de ação rápida
    function addQuickActionEventListeners(element) {
        // Event listener para botões
        element.querySelectorAll('.quick-action-button').forEach(button => {
            button.addEventListener('click', function() {
                const action = this.dataset.action;
                const type = this.dataset.type;
                
                if (action) {
                    if (type === 'external') {
                        window.open(action, '_blank');
                    } else {
                        sendMessage(action);
                    }
                }
            });
        });
        
        // Event listener para links
        element.querySelectorAll('.quick-action-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const action = this.dataset.action;
                if (action) {
                    sendMessage(action);
                }
            });
        });
        
        // Event listener para listas de seleção
        element.querySelectorAll('.quick-action-select').forEach(select => {
            select.addEventListener('change', function() {
                const action = this.value;
                const selectedOption = this.options[this.selectedIndex];
                const type = selectedOption.dataset.type;
                
                if (action) {
                    if (type === 'external') {
                        window.open(action, '_blank');
                    } else {
                        sendMessage(action);
                    }
                    // Resetar a seleção após enviar a mensagem
                    this.selectedIndex = 0;
                }
            });
        });
    }

    // Modificar o handler do botão new-chat-btn
    newChatBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Apenas esconder a tela de nova conversa, mantendo o cabeçalho
        chatContainer.querySelector('.new-conversation').style.display = 'none';
        chatInterface.classList.add('active');
        
        // Adicionar mensagem inicial de boas-vindas enquanto carrega
        const initialMessage = document.createElement('div');
        initialMessage.className = 'chat-message bot';
        initialMessage.textContent = getTranslatedMessage('connecting');
        messagesContainer.appendChild(initialMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Então iniciar a conversa em segundo plano
        startNewConversation()
            .then(function() {
                // Focar na caixa de texto após a conversa ser inicializada
                setTimeout(function() {
                    textarea.focus();
                }, 100);
            })
            .catch(function(error) {
                debug('Erro ao iniciar conversa:', error, true);
                // Se houver um erro, substituir a mensagem inicial
                initialMessage.textContent = getTranslatedMessage('fallback');
                // Reportar erro se existir callback de erro configurado
                if (typeof config.onError === 'function') {
                    config.onError(error);
                }
                // Ainda assim, focar na caixa de texto
                setTimeout(function() {
                    textarea.focus();
                }, 100);
            });
    });
    
    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
        debug('Botão de chat clicado');
        const wasOpenBefore = chatContainer.classList.contains('open');
        chatContainer.classList.toggle('open');
        
        // Se o chat acabou de ser aberto, focar na caixa de texto
        if (!wasOpenBefore && chatContainer.classList.contains('open')) {
            // Usar um pequeno atraso para garantir que a interface esteja visível
            setTimeout(function() {
                textarea.focus();
            }, 100);
        }
        
        // Esconder o prompt proativo se estiver visível
        hideProactivePrompt();
        
        debug('Classe open ' + (chatContainer.classList.contains('open') ? 'adicionada' : 'removida'));
    });

    // Add close button handlers
    const closeButtons = chatContainer.querySelectorAll('.close-button');
    debug('Encontrados ' + closeButtons.length + ' botões de fechar');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            debug('Botão de fechar clicado');
            chatContainer.classList.remove('open');
        });
    });

    // Adicionar handlers para os novos botões
    const expandButton = chatContainer.querySelector('.expand-button');
    expandButton.addEventListener('click', () => {
        chatContainer.classList.toggle('expanded');
    });

    // Expor método de debug global
    window.enableN8nChatDebug = function() {
        window.n8nChatDebug = true;
        console.log('[n8n Chat Widget] Debug mode enabled. Refresh the page to see detailed logs.');
        return 'Debug mode enabled. Refresh the page to see detailed logs.';
    };

    // Função para criar e mostrar o balão de prompt proativo
    let proactivePromptTimeout;
    let proactivePromptElement = null;

    function createProactivePrompt() {
        if (!config.proactivePrompt.enabled || proactivePromptElement) return;

        const promptMessage = getTranslatedMessage('proactiveMessage');
        
        proactivePromptElement = document.createElement('div');
        proactivePromptElement.className = `proactive-prompt${config.style.position === 'left' ? ' position-left' : ''}`;
        proactivePromptElement.innerHTML = `
            ${promptMessage}
            <button class="close-prompt" title="Fechar">&times;</button>
        `;
        
        widgetContainer.appendChild(proactivePromptElement);

        // Adicionar listener para fechar o prompt
        const closePromptButton = proactivePromptElement.querySelector('.close-prompt');
        closePromptButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Impedir que o clique feche o chat se o prompt estiver sobre o botão
            hideProactivePrompt();
        });
        
        // Forçar reflow para garantir a animação
        void proactivePromptElement.offsetWidth;
        
        proactivePromptElement.classList.add('show');
        debug('Prompt proativo exibido');
    }

    // Função para esconder e remover o balão de prompt proativo
    function hideProactivePrompt() {
        if (proactivePromptElement) {
            proactivePromptElement.classList.remove('show');
            // Remover o elemento após a animação de fade out
            setTimeout(() => {
                if (proactivePromptElement) {
                    proactivePromptElement.remove();
                    proactivePromptElement = null;
                    debug('Prompt proativo removido');
                }
            }, 400); // Tempo correspondente à transição CSS
        }
        // Limpar o timeout se o usuário interagir antes
        clearTimeout(proactivePromptTimeout);
    }

    // Agendar a exibição do prompt proativo
    if (config.proactivePrompt.enabled) {
        proactivePromptTimeout = setTimeout(() => {
            // Verificar se o chat já está aberto
            if (!chatContainer.classList.contains('open')) {
                createProactivePrompt();
            }
        }, config.proactivePrompt.delay);
        debug(`Prompt proativo agendado para ${config.proactivePrompt.delay / 1000}s`);
    }
})();
