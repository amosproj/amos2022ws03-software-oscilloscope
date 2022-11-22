use dasp_signal::{self as signal, Signal};
use rand::Rng;

pub struct TenChannelSampleGenerator {
    pub sine_signal: signal::Sine<signal::ConstHz>,
    pub saw_signal: signal::Saw<signal::ConstHz>,
    pub square_signal: signal::Square<signal::ConstHz>,
    pub rng: rand::rngs::ThreadRng,
    pub amplitude: f64,
}

impl TenChannelSampleGenerator {
    pub fn new(sampling_rate: f64, frequency: f64, amplitude: f64) -> TenChannelSampleGenerator {
        let sine_signal = signal::rate(sampling_rate).const_hz(frequency).sine();
        let saw_signal = signal::rate(sampling_rate).const_hz(frequency).saw();
        let square_signal = signal::rate(sampling_rate).const_hz(frequency).square();
        let rng = rand::thread_rng();

        TenChannelSampleGenerator {
            sine_signal,
            saw_signal,
            square_signal,
            rng,
            amplitude,
        }
    }

    pub fn next(self: &mut TenChannelSampleGenerator) -> Vec<f64> {
        let mut samples: Vec<f64> = Vec::new();
        // add noise for better visibility of refresh rate
        let noise: f64 = 0.1 * (self.rng.gen::<f64>() - 0.5);
        samples.push(self.amplitude * self.square_signal.next() + noise);
        samples.push(self.amplitude * self.sine_signal.next() + noise);
        samples.push(self.amplitude * self.saw_signal.next() + noise);
        // remaining channels are set to a constant 0-Signal
        samples.push(0.0);
        samples.push(0.0);
        samples.push(0.0);
        samples.push(0.0);
        samples.push(0.0);
        samples.push(0.0);
        samples.push(0.0);
        samples
    }
}