import { WebPlugin } from '@capacitor/core';
import { TextToSpeechPlugin, SpeechSynthesisVoice, TTSOptions } from './definitions';
export declare class TextToSpeechWeb extends WebPlugin implements TextToSpeechPlugin {
    private speechSynthesis;
    constructor();
    speak(options: TTSOptions): Promise<void>;
    stop(): Promise<void>;
    getSupportedLanguages(): Promise<{
        languages: string[];
    }>;
    getSupportedVoices(): Promise<{
        voices: SpeechSynthesisVoice[];
    }>;
    openInstall(): Promise<void>;
    setPitchRate(_options: {
        pitchRate: number;
    }): Promise<void>;
    setSpeechRate(_options: {
        speechRate: number;
    }): Promise<void>;
    private createSpeechSynthesisUtterance;
    private getSpeechSynthesisVoices;
    private throwUnsupportedError;
    private throwUnimplementedError;
}
declare const TextToSpeech: TextToSpeechWeb;
export { TextToSpeech };
