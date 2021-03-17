import AVFoundation
import Capacitor

@objc(TextToSpeech)
public class TextToSpeech: CAPPlugin {
    
    var ttsSynthesizer: AVSpeechSynthesizer?
    var hasInitialized: Bool = false
    var supportedLangs: [String] = Array(AVSpeechSynthesisVoice.speechVoices().map{
        return $0.language
    })
    var ttsUtterance: AVSpeechUtterance?
    var prevCategory: AVAudioSession.Category?
        
    public override func load() {
        if (!self.hasInitialized) {
            self.ttsSynthesizer = AVSpeechSynthesizer()
            self.hasInitialized = true
        }
    }
    
    @objc func speak(_ call: CAPPluginCall) {
        let text = call.getString("text") ?? ""
        let locale = call.getString("locale") ?? "en-US"
        let speechRate = call.getFloat("speechRate") ?? 1.0
        let pitchRate = call.getFloat("pitchRate") ?? 1.0
        let category = call.getString("category") ?? "ambient"
        let volume = call.getFloat("volume") ?? 1.0
        
        var avAudioSessionCategory = AVAudioSession.Category.ambient
        if category != "ambient" {
            avAudioSessionCategory = AVAudioSession.Category.playback
        }
        
        do {
            if prevCategory == nil {
                prevCategory = avAudioSessionCategory
                try AVAudioSession.sharedInstance().setCategory(avAudioSessionCategory, mode:.default, options: AVAudioSession.CategoryOptions.duckOthers)
            } else if prevCategory != avAudioSessionCategory {
                self.ttsSynthesizer?.stopSpeaking(at: .immediate)
                try AVAudioSession.sharedInstance().setActive(false)
                try AVAudioSession.sharedInstance().setCategory(avAudioSessionCategory, mode:.default, options: AVAudioSession.CategoryOptions.duckOthers)
                try AVAudioSession.sharedInstance().setActive(true)
            }
        } catch {
            call.reject(error.localizedDescription)
        }
        
        self.ttsUtterance = type(of: AVSpeechUtterance()).init(string: text)
        self.ttsUtterance?.voice = AVSpeechSynthesisVoice(language: locale)
        self.ttsUtterance?.rate = adjustRate(speechRate);
        self.ttsUtterance?.pitchMultiplier = pitchRate
        self.ttsUtterance?.volume = volume
        self.ttsSynthesizer?.speak(self.ttsUtterance!)
        
        call.success()
    }
    
    @objc func stop(_ call: CAPPluginCall) {
        if self.ttsSynthesizer != nil {
            self.ttsSynthesizer?.pauseSpeaking(at: .immediate)
            self.ttsSynthesizer?.stopSpeaking(at: .immediate)
            
            call.success()
        }
    }
    
    @objc func openInstall(_ call: CAPPluginCall) {
        call.success()
    }
    
    @objc func setSpeechRate(_ call: CAPPluginCall) {
        if call.hasOption("speechRate") {
            let speechRate = call.getFloat("speechRate")
            
            if speechRate != nil {
                self.ttsUtterance?.rate = speechRate!
            }
        }
    }
    
    @objc func setPitchRate(_ call: CAPPluginCall) {
        if call.hasOption("pitchRate") {
            let pitchRate = call.getFloat("pitchRate")
            
            if pitchRate != nil {
                self.ttsUtterance?.pitchMultiplier = pitchRate!
            }
        }
    }
    
    @objc func getSupportedLanguages(_ call: CAPPluginCall) {
        call.success([
            "languages": supportedLangs
        ])
    }
    
    @objc func getSupportedVoices(_ call: CAPPluginCall) {
        call.success([
            "voices": []
        ])
    }

    // Adjust rate for a closer match to other platform.
    @objc func adjustRate(_ rate: Float) -> Float {
        let baseRate = AVSpeechUtteranceDefaultSpeechRate
        if rate == 1 {
            return baseRate
        }
        if rate > baseRate {
            return baseRate + (rate * 0.025)
        }
        return rate / 2
    }
}
