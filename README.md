# 🛡️ SecurePass

> **A professional, cryptographically secure, privacy-first modern password & passphrase generator web application.**

Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **Vitest**. Engineered from the ground up following *Security-by-Design* and *Privacy-by-Design* principles.

---

## 🌟 Key Features

- **🔐 True Cryptographic Randomness (CSPRNG):** Powered exclusively by the browser's native `crypto.getRandomValues()`. Never uses insecure `Math.random()`.
- **⚖️ Zero Modulo Bias (Rejection Sampling):** Prevents modular arithmetic bias by implementing mathematical rejection sampling over 32-bit unsigned integers ($2^{32} - (2^{32} \pmod N)$).
- **🎯 Guaranteed Character Distribution:** Guarantees that at least one character from each selected character group (lowercase, uppercase, numbers, symbols) is present, followed by a cryptographically secure **Fisher-Yates shuffle**.
- **📖 Diceware Passphrase Mode:** Integrated local **EFF Long Wordlist** (7,776 words) providing $\approx 12.92$ bits of pure Diceware entropy per word. Completely offline without third-party API dependencies.
- **👓 Easy-to-Read Profile:** Excludes visually ambiguous characters (`0, O, o, 1, l, I, |, 8, B, 5, S, 2, Z`).
- **📊 Real-time Shannon Entropy & Crack Time Estimation:** Instant theoretical Shannon entropy calculation ($H = L \times \log_2(N)$) and modern GPU cluster brute-force resistance time estimates.
- **🛡️ Privacy by Design & Zero Knowledge:**
  - 100% client-side execution.
  - Zero network requests. No external APIs or telemetry.
  - Passwords are never saved in `localStorage`, `sessionStorage`, cookies, or URL parameters.
  - Never logged to `console.log`.
  - Copying requires explicit user interaction.
- **🎨 Modern Cyber-Grade UI/UX:** Dark mode by default, customizable light mode, fluid responsive layout, keyboard shortcuts (`Space` to regenerate), and accessible contrast.

---

## 📐 Cryptographic Architecture

### 1. CSPRNG vs. Pseudo-Random (Math.random)
Standard `Math.random()` implementations (like xorshift128+) are predictable and unsuitable for security. SecurePass strictly enforces:
```typescript
if (!globalThis.crypto?.getRandomValues) {
  throw new CryptoNotSupportedError();
}
```
If the Web Cryptography API is unavailable, the application halts password generation rather than falling back to an insecure method.

### 2. Modulo Bias Mitigation
When mapping a 32-bit integer ($0 \le X < 2^{32}$) to an interval $[0, N-1]$:
If $2^{32}$ is not evenly divisible by $N$, directly calculating `X % N` skews the distribution towards smaller indices.

**Rejection Sampling Solution:**
$$\text{Limit} = 2^{32} - (2^{32} \pmod N)$$
Any drawn value $X \ge \text{Limit}$ is rejected and re-drawn. Values in $[0, \text{Limit}-1]$ guarantee exact uniform probability $\frac{1}{N}$.

### 3. Fisher-Yates Cryptographic Shuffle
Mandatory characters are picked first, followed by pool characters. The resulting array is shuffled using the Fisher-Yates algorithm with CSPRNG-generated indices to eliminate predictable pattern layouts.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component-based interactive UI |
| **TypeScript (Strict)** | Static type safety and contract enforcement |
| **Vite 6** | High-performance build tool and dev server |
| **Tailwind CSS v4** | Modern, tokenized design system styling |
| **Lucide Icons** | Accessible, clean UI iconography |
| **Vitest & React Testing Library** | Unit, cryptographic, and integration testing |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `>= 18.0.0` (v20+ or v24+ recommended)
- **npm** `>= 9.0.0`

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/ahmetsalih-kargin/SecurePass.git
cd SecurePass
npm install
```

### Development Server
Start the local Vite dev server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Production Build
Type-check and bundle for production:
```bash
npm run build
```
The optimized static bundle will be output to the `dist/` directory, ready to deploy to GitHub Pages, Cloudflare Pages, Vercel, or any static host.

### Preview Production Build
```bash
npm run preview
```

### Running Tests
Execute unit and component integration tests:
```bash
npm test
```
Run tests in watch mode:
```bash
npm run test:watch
```

---

## 🧪 Test Coverage

SecurePass includes an extensive automated test suite covering:
1. **CSPRNG engine:** Availability validation and error handling when Web Crypto is absent.
2. **Rejection sampling:** Range bounds, boundary conditions, and unbiased integer generation.
3. **Character pool builder:** Inclusion, exclusion, ambiguous character removal, and pool conflict detection.
4. **Mandatory group guarantee:** Verified across 100 consecutive iterations that all active groups have at least 1 character represented.
5. **Length constraints:** Enforcement of minimum length $\ge$ active group count.
6. **EFF Diceware passphrase engine:** Exact 7,776-word dictionary integrity, word formatting, separators, and numeric injections.
7. **Entropy calculation:** Shannon entropy mathematical formula and GPU cluster crack time predictions.
8. **UI & User Interactions:** Password card rendering, mask/unmask toggle, copy-to-clipboard behavior, synchronized slider/inputs, and accessible modal controls.

---

## 🔒 Security & Privacy Disclosure

- **RAM / Garbage Collection:** In JavaScript environments, complete in-memory clearing of immutable strings cannot be guaranteed until garbage collection runs. SecurePass minimizes intermediate strings and never persists passwords in any client storage.
- **Browser Extensions:** Untrusted third-party browser extensions with DOM access can theoretically read rendered password text. We recommend generating passwords in a clean browser profile or incognito window without intrusive extensions.

---

## 🇹🇷 Türkçe Açıklama & Mimari Özeti

**SecurePass**, kullanıcıların hiçbir harici servise veya sunucuya bağımlı olmadan, tamamen kendi tarayıcıları içinde kriptografik olarak güvenli parolalar üretebilmelerini sağlayan modern bir web uygulamasıdır.

### Temel Özellikler:
1. **Asla `Math.random()` Kullanmaz:** Yalnızca tarayıcının `crypto.getRandomValues()` API'si kullanılır.
2. **Modulo Yanlılığına Son:** Rejection sampling tekniği ile her karakter kesinlikle eşit olasılıkla seçilir.
3. **Zorunlu Karakter Garantisi:** Seçilen her gruptan (büyük harf, küçük harf, rakam, sembol) en az bir karakter bulunması garanti edilir ve Fisher-Yates karıştırması uygulanır.
4. **Diceware Parola Cümlesi:** Resmi EFF 7.776 kelimelik liste ile akılda kalıcı, yüksek entropili cümleler üretilir.
5. **Sıfır Veri Saklama (Privacy by Design):** Parolalar asla sunucuya gitmez, loglanmaz, `localStorage` veya `cookies` içine yazılmaz.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.
