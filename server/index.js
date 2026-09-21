import { createApp } from './app.js';
import { config } from './config.js';

createApp().listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 서버가 gemini-3.6-flash 모델을 사용하여 LAN http://0.0.0.0:${config.port} 에서 작동 중!`);
});
