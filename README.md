# N8N Chat Widget

A lightweight, customizable chat widget that integrates with n8n workflows with chat trigger nodes. This widget provides a modern chat interface that can be easily embedded into any website.

## Features

- **Multi-language Support**: Built-in support for English, Portuguese, Spanish, and Arabic
- **Automatic Language Detection**: Detects user's language from URL or browser settings
- **Location Detection**: Automatically detects user's location using IP geolocation
- **Customizable UI**: Fully customizable colors, branding, and positioning
- **Quick Actions**: Support for interactive buttons, links, and selection lists
- **Markdown Support**: Messages support markdown formatting
- **Image Support**: Automatic handling of image URLs and markdown images
- **Metadata Integration**: Sends user metadata with each message
- **Debug Mode**: Built-in debugging capabilities

## Installation

### Option 1: Direct Script Tag

Add the following script to your HTML:

```html
<script>
    window.ChatWidgetConfig = {
        webhook: {
            url: 'YOUR_N8N_WEBHOOK_URL',
            route: 'general'
        },
        branding: {
            logo: 'YOUR_LOGO_URL',
            name: 'YOUR_BRAND_NAME',
            welcomeText: 'Welcome message',
            responseTimeText: 'Response time message',
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
        debug: false
    };
</script>
<script src="https://drive.google.com/uc?id=1NtR0Dn8aMBUunifTjaPV6ayn35leK24X&export=download"></script>
```

### Option 2: Google Tag Manager

1. Create a new Custom HTML tag
2. Copy the entire script from `index.html`
3. Set the trigger to "All Pages" or your preferred trigger

## Configuration Options

### Webhook Configuration

```javascript
webhook: {
    url: 'YOUR_N8N_WEBHOOK_URL',  // Required
    route: 'general'               // Optional, defaults to 'general'
}
```

### Branding Configuration

```javascript
branding: {
    logo: 'URL_TO_YOUR_LOGO',      // Optional
    name: 'YOUR_BRAND_NAME',       // Optional
    welcomeText: 'Welcome message', // Optional
    responseTimeText: 'Response time message', // Optional
    poweredBy: {                   // Optional
        text: 'Powered by',
        link: 'https://example.com'
    }
}
```

### Style Configuration

```javascript
style: {
    primaryColor: '#080A56',       // Optional, default: '#080A56'
    secondaryColor: '#0b0f7b',     // Optional, default: '#0b0f7b'
    position: 'right',             // Optional, 'left' or 'right'
    backgroundColor: '#ffffff',    // Optional, default: '#ffffff'
    fontColor: '#333333'          // Optional, default: '#333333'
}
```

## Quick Action Objects

The widget supports three types of quick action objects in messages:

### 1. Quick Action Links
Format: `[text](action:message)`
Example: `[See pricing](action:Show me your pricing plans)`

### 2. Quick Action Buttons
Format: `[{button:text|message}]`
Example: `[{button:Yes, please|I want to subscribe to the newsletter}]`

### 3. Quick Action Select Lists
Format: `[{list:title|option1:message1|option2:message2}]`
Example: `[{list:Choose a plan|Basic:I want the Basic plan|Pro:I want the Pro plan}]`

## Language Support

The widget automatically detects the user's language from:
1. URL path (e.g., `/en/`, `/pt/`, `/es/`, `/ar/`)
2. Browser language settings

Supported languages:
- English (en)
- Portuguese (pt)
- Spanish (es)
- Arabic (ar)

## Metadata

The widget automatically sends the following metadata with each message:
- User's language
- Base URL
- Detected location
- Chat greeting
- User email (if available)

## Debug Mode

Enable debug mode to see detailed logs in the console:

```javascript
window.ChatWidgetConfig = {
    // ... other config
    debug: true
};
```

Or enable it programmatically:
```javascript
window.enableN8nChatDebug();
```

## Error Handling

The widget includes built-in error handling for:
- Failed webhook requests
- Invalid JSON responses
- Network errors
- Location detection failures

## Browser Support

The widget is compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Internet Explorer 11

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- n8n for the workflow automation platform
- All contributors who have helped improve this widget 