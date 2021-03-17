'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var core = require('@capacitor/core');

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class TextToSpeechWeb extends core.WebPlugin {
    constructor() {
        super({
            name: 'TextToSpeech',
            platforms: ['web'],
        });
        this.speechSynthesis = null;
        if ('speechSynthesis' in window) {
            this.speechSynthesis = window.speechSynthesis;
        }
    }
    speak(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.speechSynthesis) {
                this.throwUnsupportedError();
            }
            yield this.stop();
            const speechSynthesis = this.speechSynthesis;
            const utterance = this.createSpeechSynthesisUtterance(options);
            return new Promise((resolve, reject) => {
                utterance.onend = () => {
                    resolve();
                };
                utterance.onerror = (event) => {
                    reject(event);
                };
                speechSynthesis.speak(utterance);
            });
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.speechSynthesis) {
                this.throwUnsupportedError();
            }
            this.speechSynthesis.cancel();
        });
    }
    getSupportedLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            const voices = this.getSpeechSynthesisVoices();
            const languages = voices.map(voice => voice.lang);
            const filteredLanguages = languages.filter((v, i, a) => a.indexOf(v) == i);
            return { languages: filteredLanguages };
        });
    }
    getSupportedVoices() {
        return __awaiter(this, void 0, void 0, function* () {
            const voices = this.getSpeechSynthesisVoices();
            return { voices };
        });
    }
    openInstall() {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwUnimplementedError();
        });
    }
    setPitchRate(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwUnimplementedError();
        });
    }
    setSpeechRate(_options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.throwUnimplementedError();
        });
    }
    createSpeechSynthesisUtterance(options) {
        const voices = this.getSpeechSynthesisVoices();
        const utterance = new SpeechSynthesisUtterance();
        const { text, locale, speechRate, volume, voice, pitchRate } = options;
        if (voice) {
            utterance.voice = voices[voice];
        }
        if (volume) {
            utterance.volume = volume >= 0 && volume <= 1 ? volume : 1;
        }
        if (speechRate) {
            utterance.rate = speechRate >= 0.1 && speechRate <= 10 ? speechRate : 1;
        }
        if (pitchRate) {
            utterance.pitch = pitchRate >= 0 && pitchRate <= 2 ? pitchRate : 2;
        }
        if (locale) {
            utterance.lang = locale;
        }
        utterance.text = text;
        return utterance;
    }
    getSpeechSynthesisVoices() {
        if (!this.speechSynthesis) {
            this.throwUnsupportedError();
        }
        return this.speechSynthesis.getVoices();
    }
    throwUnsupportedError() {
        throw new Error('Not supported on this device.');
    }
    throwUnimplementedError() {
        throw new Error('Not implemented on web.');
    }
}
const TextToSpeech = new TextToSpeechWeb();
core.registerWebPlugin(TextToSpeech);

exports.TextToSpeech = TextToSpeech;
exports.TextToSpeechWeb = TextToSpeechWeb;
//# sourceMappingURL=plugin.cjs.js.map
