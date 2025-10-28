const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config();

async function testHuggingFace() {
    console.log('Probando Hugging Face directamente...');
    console.log('API Key:', process.env.ANTHROPIC_API_KEY ? 'OK' : 'FALTA');
    
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.ANTHROPIC_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                inputs: "Hola, responde solo 'OK'"
            })
        });

        const data = await response.json();
        console.log('Respuesta de Hugging Face:', data);
    } catch (error) {
        console.error('Error con Hugging Face:', error.message);
    }
}

testHuggingFace();

