import QRCode from '../qrcode.js';

const text = document.querySelector('#text');
const image = document.querySelector('#qr');
const empty = document.querySelector('#empty');
const actions = document.querySelector('#actions');
const download = document.querySelector('#download');
const dimensions = document.querySelector('#dimensions');
const status = document.querySelector('#status');
let debounce;

function getURLWarning(value) {
  try {
    new URL(value);
    return '';
  } catch {
    return 'Warning: not a valid URL';
  }
}

function clearQR(message = '') {
  image.hidden = true;
  image.removeAttribute('src');
  actions.hidden = true;
  download.removeAttribute('href');
  empty.hidden = false;
  status.textContent = message;
}

function generateQR(value) {
  if (value === '') {
    clearQR();
    return null;
  }

  try {
    if (value.length > 7089) throw new Error('Text exceeds QR capacity.');

    const { modules } = QRCode.create(value, { errorCorrectionLevel: 'L' });
    // Whole pixels per module keep the PNG sharp, at a minimum of 2048 px.
    const scale = Math.ceil(2048 / modules.size);
    const size = modules.size * scale;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, size, size);
    context.fillStyle = '#000';

    // Draw directly to the edges: no frame, padding, or decorative elements.
    for (let row = 0; row < modules.size; row++) {
      for (let col = 0; col < modules.size; col++) {
        if (modules.get(row, col)) {
          context.fillRect(col * scale, row * scale, scale, scale);
        }
      }
    }

    const png = canvas.toDataURL('image/png');
    image.src = png;
    image.hidden = false;
    empty.hidden = true;
    download.href = png;
    dimensions.textContent = `${size.toLocaleString()} × ${size.toLocaleString()} px`;
    actions.hidden = false;
    status.textContent = getURLWarning(value);
    return { format: 'PNG', width: size, height: size };
  } catch {
    clearQR('This text is too long for one QR code. Try a shorter message.');
    return null;
  }
}

text.addEventListener('input', () => {
  clearTimeout(debounce);
  // Keep the current QR visible until typing has stopped for half a second.
  debounce = setTimeout(() => generateQR(text.value), 500);
});

// Use the same action for browsers that support structured page tools.
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  try {
    Promise.resolve(document.modelContext.registerTool({
      name: 'generate_qr_code',
      description: 'Encode text into a QR code and make its high-resolution PNG available to download.',
      inputSchema: {
        type: 'object',
        properties: { text: { type: 'string', minLength: 1 } },
        required: ['text'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute(input) {
        if (!input || typeof input.text !== 'string' || input.text === '') {
          throw new Error('Provide a non-empty text string.');
        }
        clearTimeout(debounce);
        text.value = input.text;
        const result = generateQR(input.text);
        if (!result) throw new Error(status.textContent);
        return result;
      },
    }, { signal: lifecycle.signal })).catch(() => {});
    window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  } catch { /* Regular input works when page tools are unavailable. */ }
}
