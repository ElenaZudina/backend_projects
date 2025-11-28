import 'dotenv/config'; // автоматически подгружает переменные из .env
import ngrok from 'ngrok';

(async () => {
    try {
        // Подключаемся к локальному серверу на порту 3000
        const url = await ngrok.connect({
            addr: 3000,
            authtoken: process.env.NGROK_TOKEN,
            name: undefined
        });

        console.log(`Tunnel running at: ${url}`);
    } catch (err) {
        console.error('Failed to start ngrok tunnel:', err);
    }
})();