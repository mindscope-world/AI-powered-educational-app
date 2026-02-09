import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

export interface AudioOptions {
    language?: string;
    rate?: number;
    pitch?: number;
    voice?: SpeechSynthesisVoice;
    model?: 'browser' | 'elevenlabs';
    elevenLabsVoiceId?: string;
}

class AudioService {
    private synth: SpeechSynthesis | null = null;
    private voices: SpeechSynthesisVoice[] = [];
    private elevenLabsClient: ElevenLabsClient | null = null;
    private currentAudio: HTMLAudioElement | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            if ('speechSynthesis' in window) {
                this.synth = window.speechSynthesis;
                this.loadVoices();
                if (this.synth.onvoiceschanged !== undefined) {
                    this.synth.onvoiceschanged = () => this.loadVoices();
                }
            }

            const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
            if (apiKey) {
                this.elevenLabsClient = new ElevenLabsClient({ apiKey });
            }
        }
    }

    private loadVoices() {
        if (!this.synth) return;
        this.voices = this.synth.getVoices();
    }

    public getAvailableVoices(lang?: string): SpeechSynthesisVoice[] {
        if (lang) {
            return this.voices.filter(v => v.lang.startsWith(lang.substring(0, 2)));
        }
        return this.voices;
    }

    public async speak(text: string, options: AudioOptions = {}): Promise<void> {
        this.stop(); // Stop any current speech or audio

        if (options.model === 'elevenlabs' && this.elevenLabsClient) {
            return this.speakElevenLabs(text, options);
        }

        return this.speakBrowser(text, options);
    }

    private speakBrowser(text: string, options: AudioOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.synth) {
                reject(new Error('Speech Synthesis not supported'));
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);

            if (options.language) {
                const langMap: Record<string, string> = {
                    'English': 'en-US',
                    'Spanish': 'es-ES',
                    'French': 'fr-FR',
                    'German': 'de-DE',
                    'Swahili': 'sw-KE',
                    'Mandarin': 'zh-CN',
                    'Arabic': 'ar-SA',
                    'Hindi': 'hi-IN'
                };
                utterance.lang = langMap[options.language] || options.language;
            }

            if (options.rate) utterance.rate = options.rate;
            if (options.pitch) utterance.pitch = options.pitch;

            if (options.voice) {
                utterance.voice = options.voice;
            } else if (options.language) {
                const matchingVoices = this.getAvailableVoices(options.language);
                if (matchingVoices.length > 0) {
                    const premiumVoice = matchingVoices.find(v => v.name.includes('Google') || v.name.includes('Natural')) || matchingVoices[0];
                    utterance.voice = premiumVoice;
                }
            }

            utterance.onend = () => resolve();
            utterance.onerror = (event) => reject(event);

            this.synth.speak(utterance);
        });
    }

    private async speakElevenLabs(text: string, options: AudioOptions): Promise<void> {
        if (!this.elevenLabsClient) throw new Error('ElevenLabs client not initialized');

        try {
            const voiceId = options.elevenLabsVoiceId || 'JBFqnCBsd6RMkjVDRZzb'; // Default voice
            const response = await this.elevenLabsClient.textToSpeech.convert(voiceId, {
                text,
                modelId: 'eleven_multilingual_v2',
                outputFormat: 'mp3_44100_128',
            });

            // Convert readability stream to a blob for browser playback
            const reader = response.getReader();
            const chunks = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                chunks.push(value);
            }
            const blob = new Blob(chunks, { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);

            return new Promise((resolve, reject) => {
                this.currentAudio = new Audio(url);
                this.currentAudio.onended = () => {
                    URL.revokeObjectURL(url);
                    this.currentAudio = null;
                    resolve();
                };
                this.currentAudio.onerror = (e) => {
                    URL.revokeObjectURL(url);
                    this.currentAudio = null;
                    reject(e);
                };
                this.currentAudio.play();
            });
        } catch (error) {
            console.error('ElevenLabs speak error:', error);
            // Fallback to browser TTS if ElevenLabs fails
            return this.speakBrowser(text, options);
        }
    }

    public pause() {
        this.synth?.pause();
        this.currentAudio?.pause();
    }

    public resume() {
        this.synth?.resume();
        this.currentAudio?.play();
    }

    public stop() {
        this.synth?.cancel();
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
    }
}

export const audioService = new AudioService();
