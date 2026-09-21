import { createApp } from './app.js';
import { config } from './config.js';

createApp().listen(config.port, '0.0.0.0', () => {
  console.log(`🚀 서버가 ${config.geminiModel} 모델을 우선 사용하여 http://0.0.0.0:${config.port} 에서 작동 중!`);
});
