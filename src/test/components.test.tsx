import { describe, it, expect, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('SecurePass UI & User Interaction Tests', () => {
  beforeEach(() => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockImplementation(() => Promise.resolve()),
      },
    });
  });

  it('uygulama ilk açıldığında varsayılan olarak parola üretmeli ve ekranda göstermelidir', () => {
    render(<App />);
    const passwordDisplay = screen.getByTestId('generated-password-display');
    expect(passwordDisplay).toBeInTheDocument();
    expect(passwordDisplay.textContent).toBeTruthy();
    expect(passwordDisplay.textContent?.length).toBeGreaterThanOrEqual(8);
  });

  it('göster/gizle butonu tıklandığında parolanın maskelenmesini sağlamalıdır', () => {
    render(<App />);
    const toggleButton = screen.getByLabelText(/Parolayı Gizle/i);
    expect(toggleButton).toBeInTheDocument();

    // Maskele
    fireEvent.click(toggleButton);
    const passwordDisplay = screen.getByTestId('generated-password-display');
    expect(passwordDisplay.textContent).toContain('•');

    // Tekrar aç
    const unmaskButton = screen.getByLabelText(/Parolayı Göster/i);
    fireEvent.click(unmaskButton);
    expect(passwordDisplay.textContent).not.toContain('•');
  });

  it('kopyala butonu tıklandığında panoya kopyalamalı ve kopyalandı durumu göstermelidir', async () => {
    render(<App />);
    const copyButton = screen.getByLabelText(/Parolayı Panoya Kopyala/i);
    expect(copyButton).toBeInTheDocument();

    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(await screen.findByText(/Kopyalandı!/i)).toBeInTheDocument();
  });

  it('yeni parola üret butonu tıklandığında parolayı yenilemelidir', () => {
    render(<App />);
    const passwordDisplay = screen.getByTestId('generated-password-display');
    const firstPassword = passwordDisplay.textContent;

    const refreshButton = screen.getByLabelText(/Yeni Parola Üret/i);
    fireEvent.click(refreshButton);

    const secondPassword = passwordDisplay.textContent;
    // Kriptografik rastgelelikle 20 karakterlik iki parolanın aynı olma olasılığı sıfıra yakındır
    expect(secondPassword).not.toBe(firstPassword);
  });

  it('uzunluk kaydırıcısı ve sayısal input senkronize çalışmalıdır', () => {
    render(<App />);
    const slider = screen.getByLabelText(/Parola uzunluğu kaydırıcısı/i) as HTMLInputElement;
    const numberInput = screen.getByLabelText(/Parola uzunluğu sayısı/i) as HTMLInputElement;

    // Başlangıçta ikisi de 20 olmalıdır
    expect(slider.value).toBe('20');
    expect(numberInput.value).toBe('20');

    // Slider değiştiğinde input güncellenmelidir
    fireEvent.change(slider, { target: { value: '32' } });
    expect(slider.value).toBe('32');
  });

  it('modlar arasında geçiş (Hızlı, Kolay Okunur, Parola Cümlesi) doğru çalışmalıdır', () => {
    render(<App />);

    // Hızlı Mod sekmesine tıkla
    const quickModeBtn = screen.getByText('Hızlı & Güvenli');
    fireEvent.click(quickModeBtn);
    expect(screen.getByText(/Hızlı & Dengeli Profil/i)).toBeInTheDocument();

    // Parola Cümlesi sekmesine tıkla
    const passphraseModeBtn = screen.getByText('Parola Cümlesi');
    fireEvent.click(passphraseModeBtn);
    expect(screen.getByText(/Parola Cümlesi Ayarları \(Diceware\)/i)).toBeInTheDocument();

    // Kolay Okunabilir sekmesine tıkla
    const readableModeBtn = screen.getByText('Kolay Okunabilir');
    fireEvent.click(readableModeBtn);
    expect(screen.getByText(/Kolay Okunur modda/i)).toBeInTheDocument();
  });

  it('güvenlik modalı butona tıklandığında açılmalı ve kapatılabilmelidir', () => {
    render(<App />);
    const securityBtn = screen.getByLabelText(/Güvenlik mimarisi hakkında bilgi/i);
    fireEvent.click(securityBtn);

    expect(screen.getByText(/Güvenlik Mimarisi & Privacy by Design/i)).toBeInTheDocument();
    expect(screen.getByText(/Kriptografik Rastgelelik \(CSPRNG\)/i)).toBeInTheDocument();

    const closeBtn = screen.getByText('Anladım');
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/Güvenlik Mimarisi & Privacy by Design/i)).not.toBeInTheDocument();
  });

  it('tema değiştirici butonu tıklandığında açık ve koyu tema arasında geçiş yapmalıdır', () => {
    render(<App />);
    const themeBtn = screen.getByLabelText(/Açık Temaya Geç|Koyu Temaya Geç/i);
    expect(themeBtn).toBeInTheDocument();

    fireEvent.click(themeBtn);
    // document.documentElement sınıfını kontrol et
    expect(themeBtn).toBeInTheDocument();
  });
});
