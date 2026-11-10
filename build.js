#!/usr/bin/env node
/*
 * Сборка приложения: берёт ЧИТАЕМЫЙ исходник из папки src/ и кладёт в корень
 * ЗАПУТАННУЮ (obfuscated) версию, которую и раздаёт сайт.
 *
 * РЕДАКТИРУЕМ ТОЛЬКО ФАЙЛЫ В src/. После правок запускаем:  node build.js
 * Файлы app.js и data.js в корне — это сгенерированный результат, править их руками нельзя.
 *
 * Важно: renameGlobals=false — глобальные имена функций НЕ переименовываются,
 * потому что они вызываются из inline-обработчиков в HTML (onclick="closeModal()").
 * Запутывается всё, что внутри функций (логика, строки, числа).
 */
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const FILES = ['data.js', 'app.js', 'promo.js'];

const OPTIONS = {
  compact: true,
  renameGlobals: false,            // КРИТИЧНО: не ломать inline onclick-обработчики
  identifierNamesGenerator: 'hexadecimal',
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.7,
  deadCodeInjection: false,        // ради скорости на телефоне
  numbersToExpressions: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 8,
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  stringArrayWrappersCount: 2,
  stringArrayWrappersType: 'function',
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  selfDefending: false,            // избегаем — надёжнее на разных браузерах
  debugProtection: false,
};

const BANNER = '/* Türkçe Quest — собранная версия. Исходный код: src/. Собирается через build.js */\n';

let total = 0;
for (const f of FILES) {
  const code = fs.readFileSync(path.join(SRC, f), 'utf8');
  const out = JavaScriptObfuscator.obfuscate(code, OPTIONS).getObfuscatedCode();
  fs.writeFileSync(path.join(ROOT, f), BANNER + out);
  const kb = (Buffer.byteLength(out) / 1024).toFixed(0);
  total += Buffer.byteLength(out);
  console.log(`✓ ${f}: ${(Buffer.byteLength(code) / 1024).toFixed(0)}KB → ${kb}KB (обфусцировано)`);
}
console.log(`Готово. Общий размер: ${(total / 1024).toFixed(0)}KB`);
