// Speech Synthesis & Recognition Service for Chat Sir Lax

export class SpeechService {
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;

  public static isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static isSpeechRecognitionSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }

  public static speak(
    text: string,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void
  ): void {
    if (!this.synth) {
      if (onError) onError();
      return;
    }

    // Cancel any ongoing speech
    this.stopSpeaking();

    // Clean text of markdown asterisks and heavy symbols for smooth speech
    const cleanText = text
      .replace(/[*#_~`]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9; // Slightly slower, very friendly and clear for students
    utterance.pitch = 1.05;

    // Pick a natural English or Philippine English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('en-ph') ||
        v.lang.toLowerCase().includes('en-us') ||
        v.name.toLowerCase().includes('natural')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (onError) onError();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public static stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public static createSpeechRecognition(
    onResult: (transcript: string) => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ): any {
    if (!this.isSpeechRecognitionSupported()) return null;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Works well with English and simple Tagalog accents

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onend = () => {
      if (onEnd) onEnd();
    };

    recognition.onerror = (event: any) => {
      if (onError) onError(event);
    };

    return recognition;
  }
}
