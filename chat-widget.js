// Chat Widget Script Version 0.6.1
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
            bottom: 90px; /* Ajustado para ficar acima do botão flutuante */
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
            gap: 10px; /* Espaçamento reduzido */
            align-items: center; /* Alinhar verticalmente */
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
            flex-shrink: 0; /* Ensure header doesn't shrink */
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
            /* height: 100%; */ /* Remove fixed height */
            flex: 1; /* Let interface grow to fill available space */
            overflow: hidden; /* Prevent interface from overflowing container */
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
            flex-shrink: 0; /* Prevent input area from shrinking */
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

        body .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            border-radius: 50%;
            padding: 10px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white; /* SVG will inherit this color via fill:currentColor */
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(8, 10, 86, 0.3);
            z-index: 1001;
            transition: all 0.2s ease-in-out;
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

        body .n8n-chat-widget .chat-toggle svg {
            width: 35px; 
            height: 35px; 
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
            bottom: 180px; /* Mantido alto */
            right: 20px;
            width: 380px; /* Largura reduzida */
            /* Estilo similar aos quick actions */
            background: linear-gradient(135deg, #f0f2ff 0%, #f5f0ff 100%); 
            border: 1px solid rgba(8, 10, 86, 0.1);
            color: var(--chat--color-primary, #080A56); /* Texto escuro */
            padding: 35px 30px; /* Padding vertical aumentado para mais altura */
            border-radius: 16px; 
            box-shadow: 0 15px 50px rgba(8, 10, 86, 0.25); 
            z-index: 999; 
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.4s ease, transform 0.4s ease;
            font-size: 18px; /* Fonte MAIOR */
            line-height: 1.5;
        }

        .n8n-chat-widget .proactive-prompt.position-left {
            right: auto;
            left: 35px; /* Ajustar posição horizontal para centralizar melhor com o botão */
        }

        .n8n-chat-widget .proactive-prompt.show {
            opacity: 1;
            transform: translateY(0);
        }

        /* Seta apontando para o botão de toggle */
        .n8n-chat-widget .proactive-prompt::after {
            content: '';
            position: absolute;
            bottom: -15px; /* Aumentar tamanho da seta e ajustar posição */
            right: 35px; /* Ajustar posição horizontal para centralizar melhor com o botão */
            width: 0;
            height: 0;
            border-left: 15px solid transparent; /* Base maior */
            border-right: 15px solid transparent; /* Base maior */
            /* Ajustar cor da seta para combinar com o fundo */
            border-top: 15px solid #f5f0ff; /* Altura maior e cor ajustada */
        }

        .n8n-chat-widget .proactive-prompt.position-left::after {
            right: auto;
            left: 35px; /* Ajustar posição horizontal para centralizar melhor com o botão */
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

        /* Font size classes */
        .n8n-chat-widget.font-size-sm .chat-message,
        .n8n-chat-widget.font-size-sm .chat-input textarea {
            font-size: 14px;
        }
        .n8n-chat-widget.font-size-md .chat-message,
        .n8n-chat-widget.font-size-md .chat-input textarea {
            font-size: 16px;
        }
        .n8n-chat-widget.font-size-lg .chat-message,
        .n8n-chat-widget.font-size-lg .chat-input textarea {
            font-size: 18px;
        }
        .n8n-chat-widget.font-size-xl .chat-message,
        .n8n-chat-widget.font-size-xl .chat-input textarea {
            font-size: 20px;
        }

        .n8n-chat-widget .quick-action-button.disabled,
        .n8n-chat-widget .quick-action-link.disabled,
        .n8n-chat-widget .quick-action-select.disabled,
        .n8n-chat-widget .phone-code-select {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        .n8n-chat-widget .quick-action-input-send.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }

        /* Add invalid/valid styles */
        .n8n-chat-widget .quick-action-container input.invalid {
            border-color: red;
            color: red;
            animation: blink-invalid 0.5s ease 0s 2;
        }
        .n8n-chat-widget .valid-check {
            color: green;
            margin-left: 4px;
        }
        @keyframes blink-invalid {
            0%,100% { opacity: 1; }
            50% { opacity: 0; }
        }
        
        .n8n-chat-widget .quick-action-link.disabled,
        .n8n-chat-widget .quick-action-select.disabled,
        .n8n-chat-widget .phone-code-select.disabled {
            opacity: 0.5;
            cursor: not-allowed;
            pointer-events: none;
        }
        .n8n-chat-widget .phone-code-select {
            width: 60px;
            margin-right: 4px;
        }
        
        .n8n-chat-widget .quick-action-input-send {
            height: 100%;
            padding: 0 8px;
            background: none;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            visibility: visible; /* Ensure visibility */
            height: 40px; /* Set explicit height */
        }

        .n8n-chat-widget .phone-code-select {
            pointer-events: auto; /* Ensure pointer-events is auto */
        }
        
        /* Quick-action send button styling - ensure visible and aligned */
        .n8n-chat-widget .quick-action-input-send {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 12px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
        }
        .n8n-chat-widget .quick-action-input-send:hover {
            transform: scale(1.05);
        }
        
        /* External-icon styling */
        .n8n-chat-widget .quick-action-button.external svg {
            width: 14px;
            height: 14px;
            margin-left: 6px;
            vertical-align: middle;
            opacity: 0.7;
        }
        
        /* Consistent input/secret styling */
        .n8n-chat-widget .quick-action-container input,
        .n8n-chat-widget .quick-action-container select {
            padding: 12px;
            border: 1px solid rgba(8, 10, 86, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            font-size: 14px;
            height: 40px;
            flex: 1 1 0%;
            box-sizing: border-box;
        }
        .n8n-chat-widget .quick-action-container {
            display: flex;
            align-items: center;
            gap: 4px;
            width: 100%;
            position: relative;
        }
        .n8n-chat-widget .quick-action-container .valid-check {
            position: absolute;
            right: 44px;
            top: 50%;
            transform: translateY(-50%);
            color: green;
            font-size: 18px;
            z-index: 2;
            pointer-events: none;
            background: transparent;
            display: none;
        }
        .n8n-chat-widget .quick-action-input-send {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 0 12px;
            height: 40px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
            margin-left: 4px;
        }
        .n8n-chat-widget .quick-action-input-send svg {
            fill: none;
            stroke: white;
            stroke-width: 2;
        }
        .n8n-chat-widget .phone-code-select {
            opacity: 1;
            border: 1px solid rgba(8,10,86,0.2);
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            font-size: 14px;
            height: 40px;
            border-radius: 8px;
            margin-right: 4px;
            padding: 0 8px;
            cursor: pointer;
            pointer-events: auto;
        }
        
        /* Phone-select width and clickable */
        .n8n-chat-widget .phone-code-select {
            width: 60px;
            margin-right: 4px;
            padding: 0 8px;
            cursor: pointer;
            pointer-events: auto;
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

    // Define default messages *before* defaultConfig uses them
    const defaultProactiveMessages = {
        en: "Chat with our AI now and resolve all your doubts!",
        pt: "Converse com nossa IA agora e resolva todas as suas dúvidas!",
        es: "¡Chatea con nuestra IA ahora y resuelve todas tus dudas!",
        ar: "تحدث مع الذكاء الاصطناعي الخاص بنا الآن وحل جميع شكوكك!"
    };

    const defaultGreetingMessages = {
        en: "Hi! How can I help you today?",
        pt: "Olá! Como posso ajudar você hoje?",
        es: "¡Hola! ¿Cómo puedo ayudarte hoy?",
        ar: "مرحباً! كيف يمكنني مساعدتك اليوم?"
    };

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: null,
            route: 'general'
        },
        branding: {
            logo: '',
            name: '',
            welcomeText: '', // Now an object in config, but empty here
            responseTimeText: '', // Now an object in config, but empty here
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
            fontColor: '#333333',
            fontSize: 1, // Default font size (1: sm, 2: md, 3: lg, 4: xl)
        },
        debug: false,
        detectLocation: true, // Default for location detection
        metadata: {}, // Default empty metadata object
        proactivePrompt: {
            enabled: false,
            delay: 10000,
            message: defaultProactiveMessages // Use the predefined object
        },
        skipWelcomeScreen: false,
        greetingMessage: defaultGreetingMessages, // Use the predefined object
        expandedView: false, // Default expanded view state
        languageTexts: {} // Initialize as empty, will be populated below
    };

    // Definir 'lang' mais cedo para estar disponível e detectar variações
    const url = window.location.href;
    // Regex para encontrar /<lang>-<region>/ ou /<lang>/ (ex: /pt-br/, /en-US/, /pt/)
    const langMatch = url.match(/\/([a-z]{2})(?:[-_]([a-z]{2}))?\/?(?:\?|#|$)/i);
    const detectedLang = langMatch ? langMatch[0].replace(/[/\\\?#]/g, '').toLowerCase() : 'en'; // ex: "pt-br", "en", "es"
    const baseLang = langMatch ? langMatch[1].toLowerCase() : 'en'; // ex: "pt", "en", "es"

    // Merge user config with defaults
    const config = window.ChatWidgetConfig ?
        {
            webhook: { ...defaultConfig.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultConfig.style, ...window.ChatWidgetConfig.style },
            proactivePrompt: { ...defaultConfig.proactivePrompt, ...(window.ChatWidgetConfig.proactivePrompt || {}) },
            skipWelcomeScreen: typeof window.ChatWidgetConfig.skipWelcomeScreen === 'boolean' ? window.ChatWidgetConfig.skipWelcomeScreen : defaultConfig.skipWelcomeScreen,
            greetingMessage: { ...defaultConfig.greetingMessage, ...(window.ChatWidgetConfig.greetingMessage || {}) },
            expandedView: window.ChatWidgetConfig.expandedView || defaultConfig.expandedView,
            languageTexts: { ...defaultConfig.languageTexts, ...(window.ChatWidgetConfig.languageTexts || {}) }, // Merge languageTexts as well
            metadata: { ...defaultConfig.metadata, ...(window.ChatWidgetConfig.metadata || {}) }, // Merge metadata
            detectLocation: typeof window.ChatWidgetConfig.detectLocation === 'boolean' ? window.ChatWidgetConfig.detectLocation : defaultConfig.detectLocation // Merge detectLocation
        } : defaultConfig;

    // Mensagens traduzidas padrão (usadas como último fallback dentro de getText)
    const defaultLanguageTexts = {
        en: {
            connecting: "Hi! Connecting you...",
            fallback: "Hi! How can I help?",
            processing: "Thank you for your message. We're processing it and will respond shortly.",
            error: "Thank you for your message. How can I help you further?",
            inputPlaceholder: "Type your message...",
            startChat: "Start chat",
            defaultResponseTime: "We typically respond right away",
            welcomeText: "Hi 👋, how can we help?"
        },
        pt: {
            connecting: "Olá! Estamos conectando você...",
            fallback: "Olá! Como posso ajudar?",
            processing: "Obrigado pela sua mensagem. Estamos processando e responderemos em breve.",
            error: "Obrigado pela sua mensagem. Como posso ajudar mais?",
            inputPlaceholder: "Digite sua mensagem...",
            startChat: "Iniciar conversa",
            defaultResponseTime: "Normalmente respondemos imediatamente",
            welcomeText: "Oi 👋, como podemos ajudar?"
        },
        es: {
            connecting: "¡Hola! Conectándote...",
            fallback: "¡Hola! ¿Cómo puedo ayudar?",
            processing: "Gracias por tu mensaje. Lo estamos procesando y responderemos pronto.",
            error: "Gracias por tu mensaje. ¿Cómo puedo ayudarte más?",
            inputPlaceholder: "Escribe tu mensaje...",
            startChat: "Iniciar conversación",
            defaultResponseTime: "Solemos responder de inmediato",
            welcomeText: "¡Hola 👋! ¿Cómo podemos ayudar?"
        },
        ar: {
            connecting: "مرحباً! جاري توصيلك...",
            fallback: "مرحباً! كيف يمكنني المساعدة؟",
            processing: "شكراً لرسالتك. نحن نعالجها وسنرد قريباً.",
            error: "شكراً لرسالتك. كيف يمكنني المساعدة أكثر؟",
            inputPlaceholder: "اكتب رسالتك...",
            startChat: "بدء المحادثة",
            defaultResponseTime: "عادة ما نرد على الفور",
            welcomeText: "مرحباً 👋! كيف يمكننا المساعدة؟"
        }
    };
     // Ensure defaultConfig.languageTexts points to the default translations
     // Assign it here AFTER defaultConfig is fully defined.
     defaultConfig.languageTexts = defaultLanguageTexts;

    // --- Helper Function to Get Text from languageTexts (Simplified) ---
    function getText(key, fallbackValue = '') {
        const userTexts = config.languageTexts;
        const defaultTexts = defaultConfig.languageTexts; // Assumes defaultConfig.languageTexts is set below

        // Check User Config
        if (userTexts) {
            if (userTexts[detectedLang] && userTexts[detectedLang][key] !== undefined) return userTexts[detectedLang][key];
            if (userTexts[baseLang] && userTexts[baseLang][key] !== undefined) return userTexts[baseLang][key];
            if (userTexts['en'] && userTexts['en'][key] !== undefined) return userTexts['en'][key];
        }
        // Check Default Config
        if (defaultTexts) {
             if (defaultTexts[detectedLang] && defaultTexts[detectedLang][key] !== undefined) return defaultTexts[detectedLang][key];
             if (defaultTexts[baseLang] && defaultTexts[baseLang][key] !== undefined) return defaultTexts[baseLang][key];
             if (defaultTexts['en'] && defaultTexts['en'][key] !== undefined) return defaultTexts['en'][key];
        }
        // Fallback
        return fallbackValue;
    }

    // --- DEBUG --- Logar a configuração mesclada
    debug('Configuração mesclada final:', config);
    // --- DEBUG --- Logar idiomas detectados
    debug(`Idioma detectado (completo): ${detectedLang}, Idioma base: ${baseLang}`);

    // Prevent multiple initializations
    if (window.N8NChatWidgetInitialized) return;
    window.N8NChatWidgetInitialized = true;

    let currentSessionId = '';

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
    
    // Function to get the correct language string from a potentially multi-language object
    function getBrandingText(brandingField, fallbackKey) {
        const textSource = config.branding[brandingField];
        if (typeof textSource === 'string') {
            return textSource; // Already a simple string
        } else if (typeof textSource === 'object' && textSource !== null) {
            // Find the best match: detectedLang -> baseLang -> en
            return textSource[detectedLang] ?? textSource[baseLang] ?? textSource['en'] ?? getText(fallbackKey, '');
        } else {
            // Use getText for fallback if field is missing or not string/object
            return getText(fallbackKey, '');
        }
    }
    
    // Criar conteúdo do chat container diretamente
    let chatContainerHTML = `
        <div class="brand-header">
            ${config.branding.logo ? `<img src="${config.branding.logo}" alt="${config.branding.name || 'Chat'}" />` : ''}
            <span>${config.branding.name || 'Chat'}</span>
            <div class="header-buttons">
                <!-- Botão de Tamanho de Fonte -->
                <button class="header-button font-size-button" title="Alterar Tamanho da Fonte">
                     <!-- Ícone 'Aa' mais claro -->
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:20px; height:20px;">
                        <path d="M3.5 15.5L7 9l3.5 6.5"/>
                        <path d="M14 19L18 5l4 14"/>
                        <path d="M15.3 15H20.7"/>
                        <path d="M4.9 13H9.1"/>
                    </svg>
                </button>
                 <!-- Ordem Definitiva: Expandir (esquerda), Fechar (direita) -->
                 <button class="header-button expand-button" title="Expandir/Contrair">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                </button>
                <button class="header-button close-button" title="Fechar">×</button>
            </div>
        </div>
        <div class="chat-interface">
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="${getText('inputPlaceholder', 'Type your message...')}" rows="1"></textarea>
                <button>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>
        </div>
        <div class="new-conversation">
            <p class="welcome-text">${getBrandingText('welcomeText', 'welcomeText')}</p>
            <button class="new-chat-btn">
                <!-- Novo ícone geométrico (ex: quadrado com plus) -->
                <svg class="message-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2"/>
                    <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                ${getText('startChat', 'Start chat')}
            </button>
            <p class="response-text">${getBrandingText('responseTimeText', 'defaultResponseTime')}</p>
        </div>
    `;
    
    chatContainer.innerHTML = chatContainerHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <!-- Standard chat baloon icon - Size controlled by CSS -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
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

    // Função para detectar se o conteúdo parece ser uma URL de imagem GIF ou um link de serviço de GIF
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
            /!\[([^\]]*)\]\((https?:\/\/[^)]+)\)/g, 
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
        html = html.replace(/\[\{(button|botao):([^|]+)\|([^|}\n]+)\}\]/g, (match) => {
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
        html = html.replace(/^## (.+)$/gm, '<h2>$2</h2>');
        html = html.replace(/^### (.+)$/gm, '<h3>$3</h3>');
        
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

    // Função para obter mensagem traduzida (DEPRECATED - Use getText)
    function getTranslatedMessage(key) {
        // Log warning about deprecated usage
        debug(`Deprecated function getTranslatedMessage called for key: ${key}. Use getText instead.`);
        // Use the new function as a fallback mechanism
        return getText(key, '');
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
                        json: async () => ({ output: getText('fallback', 'Hi! How can I help?') }),
                        text: async () => JSON.stringify({ output: getText('fallback', 'Hi! How can I help?') }),
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
                        json: async () => ({ output: getText('fallback', 'Hi! How can I help?') }),
                        text: async () => JSON.stringify({ output: getText('fallback', 'Hi! How can I help?') }),
                        clone: function() { return this; }
                    };
                }
                
                // Para outras URLs, deixar o erro passar normalmente
                throw error;
            });
    };

    async function startNewConversation() {
        currentSessionId = generateUUID();
        // Get metadata asynchronously first
        const metadata = await getMetadata();

        const data = {
            action: "loadPreviousSession",
            sessionId: currentSessionId,
            route: config.webhook.route || 'general',
            metadata: metadata // Use the gathered metadata object
        };

        // Remove any existing initial message (like "connecting...")
        const initialMessageDiv = messagesContainer.querySelector('.chat-message.bot');
        if (initialMessageDiv) {
            initialMessageDiv.remove();
        }

        // Show typing indicator while loading
        const typingIndicator = showTypingIndicator(); // Keep reference

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
            // Note: We don't use the response content directly for the *greeting* here.
            // The greeting comes from config or defaults.

            try {
                // We still need to consume the response body even if not using its content for greeting
                const responseText = await response.text();
                debug('Resposta inicial do webhook (consumida):', responseText);
                if (responseText && responseText.trim()) {
                     const responseData = JSON.parse(responseText);
                     debug('Resposta JSON inicial do webhook (consumida):', responseData);
                     // Potentially handle historical messages here in the future if needed
                }
            } catch (error) {
                 debug('Erro ao processar resposta inicial do webhook (ignorado para saudação):', error);
            }

            // --- Determine the final greeting message ---
            const finalGreetingMessage = getGreetingMessage();
            debug('Mensagem de saudação final a ser exibida:', finalGreetingMessage);

            // --- Render the final greeting ---
            hideTypingIndicator(); // Hide indicator *before* showing the actual message
            displayBotMessage(finalGreetingMessage); // Use the function that handles quick actions

            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            return finalGreetingMessage; // Return the rendered message content

        } catch (error) {
            debug('Erro ao iniciar conversa:', error, true);
            hideTypingIndicator(); // Ensure indicator is hidden on error

            // --- Render the fallback greeting on error ---
            const fallbackMessage = getGreetingMessage();
            displayBotMessage(fallbackMessage); // Use the function that handles quick actions

            throw error; // Re-throw error if needed
        }
    }
    
    async function sendMessage(message, { maskedMessage = null, skipLocal = false } = {}) {
        if (!message || message.trim() === '') return;

        // Get metadata asynchronously first
        const metadata = await getMetadata();

        const messageData = {
            action: "sendMessage",
            sessionId: currentSessionId,
            route: config.webhook.route || 'general',
            chatInput: message,
            metadata: metadata // Use the gathered metadata object
        };

        // Exibir mensagem do usuário
        if (!skipLocal) {
            const userMessageDiv = document.createElement('div');
            userMessageDiv.className = 'chat-message user';
            userMessageDiv.textContent = maskedMessage || message;
            messagesContainer.appendChild(userMessageDiv);
        }
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
            let responseMessage = getText('processing', 'Processing...'); // Use new function
            
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
                        responseMessage = getText('fallback', 'Hi! How can I help?'); // Use new function
                    }
                } else {
                    debug('Resposta vazia do webhook');
                    responseMessage = getText('fallback', 'Hi! How can I help?'); // Use new function
                }
            } catch (error) {
                debug('Erro ao processar JSON da resposta:', error, true);
                responseMessage = getText('fallback', 'Hi! How can I help?'); // Use new function
            }
            
            // Remover o indicador de digitação
            hideTypingIndicator();
            
            // Mostrar a resposta do bot
            displayBotMessage(responseMessage);
        } catch (error) {
            debug('Erro na chamada do webhook:', error, true);
            hideTypingIndicator();
            displayBotMessage(getText('error', 'Sorry, something went wrong.')); // Use new function for error message
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
        
        let processedText = text.trim();
        let buttons = [];
        let selectOptions = [];
        let links = [];
        let inputObject = null;
        
        // Process input/secret quick action
        processedText = processedText.replace(/(?:\[\{|\{\[)(input|secret)([\s\S]*?)(?:\}\]|\]\})/i,
            (match, type, body) => {
                // split by '|' and remove empty
                const parts = body.split('|').map(s=>s.trim()).filter(s=>s);
                let placeholder = '', prefix = '', required = false, validation = 'none';
                // categorize parts
                parts.forEach(p => {
                    const low = p.toLowerCase();
                    if (low === 'required') required = true;
                    else if (['email','url','phone'].includes(low)) validation = low;
                    else if (!placeholder) placeholder = p;
                    else if (!prefix) prefix = p;
                });
                inputObject = { type, placeholder, prefix, required, validation };
                return '';
            }
        );

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
        
        // Remove ALL malformed [{...}] directives first
        processedText = processedText.replace(/\[\{[^\]]*?\}\]/g, '').replace(/\{\[[^\]]*?\]\}/g, '');
        // Extract ALL [{button|Text|Action}] objects (Action can be plain text or URL)
        const buttonRegex = /\[\{(?:button|botao)\|([^|}]+)\|([^|}\n]+)\}\]/gi;
        let buttonMatch;
        while ((buttonMatch = buttonRegex.exec(processedText)) !== null) {
            const [, btnText, btnAction] = buttonMatch;
            const actionVal = (btnAction || btnText).trim();
            const isUrl = isValidUrl(actionVal);
            buttons.push({ text: btnText.trim(), action: actionVal, type: isUrl ? 'external' : 'normal' });
        }
        // Remove ALL button objects and any trailing markdown/parenthesis from the text before markdown rendering
        processedText = processedText.replace(buttonRegex, '').replace(/\([^)]+\)/g, '').replace(/\s{2,}/g, ' ').trim();
        // Suporte a até 4 botões por mensagem (não limitar aqui, limitar na renderização)
        // Suporte a outros tipos de objetos pode ser adicionado aqui, se necessário
        
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
        const hasQuickActions = inputObject !== null || buttons.length > 0 || selectOptions.length > 0 || links.length > 0;
        
        return {
            text: processedText,
            hasQuickActions,
            buttons: inputObject ? [] : buttons,
            selectOptions: inputObject ? [] : selectOptions,
            links: inputObject ? [] : links,
            input: inputObject
        };
    }
    
    // Função para renderizar objetos de ação rápida
    function renderQuickActions(quickActions, messageElement) {
        if (!quickActions.hasQuickActions) return;
        
        // Handle single input/secret object
        if (quickActions.input) {
            const obj = quickActions.input;
            const container = document.createElement('div');
            container.className = 'quick-action-container';
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.gap = '4px';
            wrapper.style.marginTop = '10px';
            wrapper.style.alignItems = 'center';
            let countrySelect = null;
            if (obj.validation === 'phone') {
                countrySelect = document.createElement('select');
                countrySelect.className = 'phone-code-select';
                // Full country list
                phoneCountryList.forEach(({iso, dialCode}) => {
                    const flag = iso.split('').map(c=>String.fromCodePoint(0x1f1e6 + c.charCodeAt(0)-65)).join('');
                    const opt = document.createElement('option');
                    opt.value = dialCode;
                    opt.textContent = `${flag} +${dialCode}`;
                    countrySelect.appendChild(opt);
                });
                wrapper.appendChild(countrySelect);
                // Sync input/select
                countrySelect.addEventListener('change', () => {
                    const raw = inEl.value.replace(/^\+?\d*/, '');
                    inEl.value = '+' + countrySelect.value + (raw ? ' ' + raw.replace(/^\d+\s*/, '') : '');
                });
            
            }
            const inEl = document.createElement('input');
            inEl.type = obj.type === 'secret' ? 'password' : 'text';
            inEl.placeholder = obj.placeholder;
            if (obj.required) inEl.required = true;
            inEl.style.flex = '1';
            inEl.style.height = '40px';
            inEl.style.paddingRight = '32px'; // room for tick
            wrapper.appendChild(inEl);
            // Tick container
            const tick = document.createElement('span');
            tick.className = 'valid-check';
            tick.textContent = '✓';
            tick.style.display = 'none';
            tick.style.position = 'absolute';
            tick.style.right = '10px';
            tick.style.top = '50%';
            tick.style.transform = 'translateY(-50%)';
            tick.style.color = 'green';
            tick.style.pointerEvents = 'none';
            tick.style.fontSize = '18px';
            tick.style.zIndex = '2';
            wrapper.style.position = 'relative';
            wrapper.appendChild(tick);
            const btn = document.createElement('button');
            btn.className = 'quick-action-input-send';
            btn.style.height = '40px';
            btn.style.display = 'flex';
            btn.style.alignItems = 'center';
            btn.style.justifyContent = 'center';
            btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
            wrapper.appendChild(btn);
            container.appendChild(wrapper);
            messageElement.appendChild(container);
            textarea.disabled = true;
            sendButton.disabled = true;
            setTimeout(() => inEl.focus(), 50); // Focus after a short delay
            // Live validation
            inEl.addEventListener('input', () => {
                let v = inEl.value;
                let ok = true;
                if (obj.required && !v) ok = false;
                if (obj.validation === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) ok = false;
                if (obj.validation === 'url' && v && !/^https?:\/\/.+/.test(v)) ok = false;
                if (obj.validation === 'phone' && v) {
                    v = v.replace(/^\+/, '');
                    ok = phoneCountryList.some(c=> v.startsWith(c.dialCode)) && /^\d+$/.test(v);
                }
                tick.style.display = ok ? 'block' : 'none';
                inEl.classList.toggle('invalid', !ok);
                // Phone: update select
                if (obj.validation === 'phone') {
                    const v2 = inEl.value.replace(/^\+/, '');
                    const found = phoneCountryList.find(c=> v2.startsWith(c.dialCode));
                    if (found) countrySelect.value = found.dialCode;
                }
            });
            btn.addEventListener('click', () => {
                let v = inEl.value.trim();
                if (obj.required && !v) {
                    inEl.classList.add('invalid');
                    setTimeout(() => inEl.classList.remove('invalid'), 1000);
                    return;
                }
                if (obj.validation === 'email' && !/^\S+@\S+\.\S+$/.test(v)) {
                    inEl.classList.add('invalid');
                    setTimeout(() => inEl.classList.remove('invalid'), 1000);
                    return;
                }
                if (obj.validation === 'url' && !/^https?:\/\/.+/.test(v)) {
                    inEl.classList.add('invalid');
                    setTimeout(() => inEl.classList.remove('invalid'), 1000);
                    return;
                }
                if (obj.validation === 'phone') v = countrySelect.value + v;
                const raw = obj.prefix + v;
                const display = obj.type === 'secret' ? obj.prefix + '*'.repeat(v.length) : raw;
                disableSmartObjectsInMessages();
                textarea.disabled = false;
                sendButton.disabled = false;
                sendMessage(raw, { maskedMessage: display });
            });
            inEl.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    btn.click();
                }
            });
            return;
        }

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
                    buttonElement.tabIndex = 0;
                    if (button.type === 'external') {
                        // append icon
                        const icon = document.createElement('span');
                        icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 3h7m0 0v7m0-7L10 14m-4 0v7a2 2 0 002 2h7a2 2 0 002-2v-7"/></svg>';
                        buttonElement.appendChild(icon);
                    }
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
    // Disable all interactive smart objects in previous messages
    function disableSmartObjectsInMessages() {
        document.querySelectorAll('.chat-message.bot, .chat-message.user').forEach(msg => {
            msg.querySelectorAll('button, select, input, a.quick-action-link').forEach(el => {
                el.disabled = true;
                el.classList.add('disabled');
                el.tabIndex = -1;
            });
        });
    }

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
                        disableSmartObjectsInMessages();
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
                    disableSmartObjectsInMessages();
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

        // Clear any previous messages if starting fresh
        messagesContainer.innerHTML = ''; // Clear messages to ensure only the greeting appears

        // *Don't* add the "connecting" message here directly.
        // Let startNewConversation handle the indicator and final message.

        // Iniciar a conversa (which will show indicator and then the greeting)
        startNewConversation()
            .then(function() {
                // Focar na caixa de texto após a conversa ser inicializada
                setTimeout(function() {
                    textarea.focus();
                }, 100);
            })
            .catch(function(error) {
                debug('Erro ao iniciar conversa no click:', error, true);
                // Error handling inside startNewConversation already displays the fallback greeting.
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
        const isOpen = chatContainer.classList.contains('open');
        const isFirstTime = !currentSessionId;

        if (!isOpen) {
            // Abrindo o chat
            chatContainer.classList.add('open');
            hideProactivePrompt(); // Esconder prompt se estiver visível

            if (config.skipWelcomeScreen && isFirstTime) {
                 // Pular tela de boas-vindas e iniciar direto
                debug('Pulando tela de boas-vindas');
                chatContainer.querySelector('.new-conversation').style.display = 'none';
                chatInterface.classList.add('active');

                // Clear any previous messages
                messagesContainer.innerHTML = '';

                // *Don't* add the "connecting" message here directly.
                // Let startNewConversation handle the indicator and final message.

                startNewConversation()
                    .then(() => {
                        setTimeout(() => textarea.focus(), 100);
                    })
                    .catch((error) => {
                        debug('Erro ao iniciar conversa (skip welcome):', error, true);
                        // Error handling inside startNewConversation already displays the fallback greeting.
                        if (typeof config.onError === 'function') config.onError(error);
                        setTimeout(() => textarea.focus(), 100);
                    });
            } else if (!isFirstTime) {
                 // Re-opening an existing chat, just focus
                 // Ensure chat interface is active if it wasn't already
                 if (!chatInterface.classList.contains('active')) {
                    chatContainer.querySelector('.new-conversation').style.display = 'none';
                    chatInterface.classList.add('active');
                 }
                setTimeout(() => textarea.focus(), 100);
            } else {
                // Opening for the first time WITHOUT skipWelcomeScreen
                // Show the welcome screen explicitly if it was hidden
                chatContainer.querySelector('.new-conversation').style.display = 'block'; // Changed from flex to block if needed
                chatInterface.classList.remove('active');
                 // Ensure messages are cleared for a clean welcome screen
                messagesContainer.innerHTML = '';
            }
        } else {
            // Fechando o chat
            chatContainer.classList.remove('open');
        }

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
    const fontSizeButton = chatContainer.querySelector('.font-size-button'); // Obter o novo botão
    expandButton.addEventListener('click', () => {
        chatContainer.classList.toggle('expanded');
        // Focus input after expanding/collapsing
        setTimeout(() => textarea.focus(), 50); 
    });

    // Lógica do botão de tamanho de fonte
    let currentFontSizeIndex = 0; // 0: sm, 1: md, 2: lg, 3: xl
    const fontSizes = ['sm', 'md', 'lg', 'xl'];
    // Aplicar tamanho inicial (small)
    widgetContainer.classList.add('font-size-sm');

    fontSizeButton.addEventListener('click', () => {
        // Remover classe de tamanho atual
        widgetContainer.classList.remove(`font-size-${fontSizes[currentFontSizeIndex]}`);
        
        // Calcular próximo índice
        currentFontSizeIndex = (currentFontSizeIndex + 1) % fontSizes.length;
        
        // Adicionar nova classe de tamanho
        const newSizeClass = `font-size-${fontSizes[currentFontSizeIndex]}`;
        widgetContainer.classList.add(newSizeClass);
        debug(`Tamanho da fonte alterado para: ${fontSizes[currentFontSizeIndex]}`);
        // Focus input after changing font size
        setTimeout(() => textarea.focus(), 50);
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

        // Usar a nova função para obter a mensagem correta
        const promptMessage = getProactiveMessage(); 
        
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

    // Função para obter mensagem de saudação traduzida (REVISADA - Simplified)
    function getGreetingMessage() {
        let message;
        // Priority: User Config (Full > Base > EN) -> Default Config (Full > Base > EN) -> fallback
        const userMsg = config.greetingMessage;
        const defaultMsg = defaultConfig.greetingMessage;

        if (userMsg && userMsg[detectedLang] !== undefined) message = userMsg[detectedLang];
        else if (userMsg && userMsg[baseLang] !== undefined) message = userMsg[baseLang];
        else if (userMsg && userMsg['en'] !== undefined) message = userMsg['en'];
        else if (defaultMsg && defaultMsg[detectedLang] !== undefined) message = defaultMsg[detectedLang];
        else if (defaultMsg && defaultMsg[baseLang] !== undefined) message = defaultMsg[baseLang];
        else if (defaultMsg && defaultMsg['en'] !== undefined) message = defaultMsg['en'];
        else message = "Hi there!"; // Absolute last fallback

        debug('[getGreetingMessage] Mensagem final escolhida:', message);
        return message;
     }

     // Função para obter mensagem do prompt proativo traduzida (REVISADA - Simplified)
     function getProactiveMessage() {
        let message;
        // Priority: User Config (Full > Base > EN) -> Default Config (Full > Base > EN) -> fallback
        const userPrompt = config.proactivePrompt?.message; // Use optional chaining
        const defaultPrompt = defaultConfig.proactivePrompt?.message;

        if (userPrompt && userPrompt[detectedLang] !== undefined) message = userPrompt[detectedLang];
        else if (userPrompt && userPrompt[baseLang] !== undefined) message = userPrompt[baseLang];
        else if (userPrompt && userPrompt['en'] !== undefined) message = userPrompt['en'];
        else if (defaultPrompt && defaultPrompt[detectedLang] !== undefined) message = defaultPrompt[detectedLang];
        else if (defaultPrompt && defaultPrompt[baseLang] !== undefined) message = defaultPrompt[baseLang];
        else if (defaultPrompt && defaultPrompt['en'] !== undefined) message = defaultPrompt['en'];
        else message = "Chat with us!"; // Absolute last fallback

        debug('[getProactiveMessage] Mensagem final escolhida:', message);
        return message;
     }

    // --- Location Detection Function ---
    async function fetchUserLocation() {
        let locationResult = null; // Store result to dispatch event later
        try {
            if (!config.detectLocation) {
                debug('Location detection is disabled by config.');
                return null;
            }

            // Use ipinfo.io for location detection (free tier available)
            const geoApiUrl = 'https://ipinfo.io/json';
            debug(`Fetching location from: ${geoApiUrl}`);

            const response = await fetch(geoApiUrl);
            if (!response.ok) {
                // Handle potential errors like rate limits or API issues
                console.error(`Geo API error: ${response.status} - ${response.statusText}`);
                throw new Error(`Geo API error: ${response.status}`);
            }
            const locationData = await response.json();
            debug('Fetched location data:', locationData);

            // Extract relevant fields (city, country) - Adjust if API changes
            if (locationData && locationData.city && locationData.country) {
                 locationResult = { city: locationData.city, country: locationData.country };
            } else {
                 console.warn('[n8n Chat Widget] Geo API response missing expected fields (city, country).', locationData);
                 locationResult = null; // Or set to a partial object if desired
            }

        } catch (error) {
            debug('Error fetching user location:', error, true);
            locationResult = null; // Ensure result is null on error
        }
        finally {
             // Dispatch custom event with the detected location (or null)
             const event = new CustomEvent('n8nLocationDetected', { detail: locationResult });
             document.body.dispatchEvent(event);
             debug('Dispatched n8nLocationDetected event with detail:', locationResult);
             return locationResult; // Return the result for getMetadata
        }
    }

    // --- Metadata Gathering Function ---
    async function getMetadata() {
        let locationData = null;
        if (config.detectLocation && !config.metadata?.detectedLocation) { // Only fetch if enabled and not overridden
            locationData = await fetchUserLocation();
        }

        // Detect timezone using Intl API if not overridden
        let timezone = config.metadata?.detectedTimeZone; // Check override first
        if (!timezone) {
            try {
                timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            } catch (e) {
                debug('Could not detect browser timezone.', e, true);
                timezone = null; // Set to null if detection fails
            }
        }

        const finalMetadata = {
            // Priority: Config Override > Detected/Default
            userId: config.metadata?.userId || '', // Default empty
            userEmail: config.metadata?.userEmail || '', // Default empty
            userLanguage: config.metadata?.language || detectedLang, // Default detectedLang
            baseUrl: config.metadata?.baseUrl || window.location.origin, // Default window origin
            detectedLocation: config.metadata?.detectedLocation || locationData, // Default fetched data (or null)
            detectedTimeZone: timezone, // Use detected/overridden timezone
            timestamp: new Date().toISOString() // Always add current timestamp
        };

        debug('Final metadata object:', finalMetadata);
        return finalMetadata;
    }
})();
