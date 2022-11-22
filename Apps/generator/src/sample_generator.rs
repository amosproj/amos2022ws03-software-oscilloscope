use dasp_signal::{self as signal, Signal};
use rand::Rng;

pub struct TenChannelSampleGenerator {
    pub sine_signal: signal::Sine<signal::ConstHz>,
    pub saw_signal: signal::Saw<signal::ConstHz>,
    pub square_signal: signal::Square<signal::ConstHz>,
    pub rng: rand::rngs::ThreadRng,
    pub amplitude: f64,
    pub add_noise: bool,
}

impl TenChannelSampleGenerator {
    pub fn new(
        sampling_rate: f64,
        frequency: f64,
        amplitude: f64,
        add_noise: bool,
    ) -> TenChannelSampleGenerator {
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
            add_noise,
        }
    }

    pub fn next(self: &mut TenChannelSampleGenerator) -> Vec<f64> {
        let mut samples: Vec<f64> = Vec::new();

        // add noise for better visibility of refresh rate
        let noise: f64 = if self.add_noise {
            0.1 * (self.rng.gen::<f64>() - 0.5)
        } else {
            0.0
        };

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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_next_ten_channels() {
        const EXPECTED_NUMBER_OF_SAMPLES: usize = 10;
        let mut generator = TenChannelSampleGenerator::new(1.0, 1.0, 1.0, false);

        assert_eq!(generator.next().len(), EXPECTED_NUMBER_OF_SAMPLES);
    }

    #[test]
    fn test_next_changing_samples() {
        const SAMPLING_RATE: f64 = 50.0;
        const FREQUENCY: f64 = 1.0;
        let mut generator = TenChannelSampleGenerator::new(SAMPLING_RATE, FREQUENCY, 1.0, false);
        let first: Vec<f64> = generator.next();
        let second: Vec<f64> = generator.next();
        assert_ne!(first, second)
    }

    #[test]
    fn test_next_samples_bound_by_amplitude() {
        const SAMPLING_RATE: f64 = 50.0;
        const FREQUENCY: f64 = 1.0;
        const AMPLITUDE: f64 = 10.0;

        let mut generator =
            TenChannelSampleGenerator::new(SAMPLING_RATE, FREQUENCY, AMPLITUDE, false);

        for _ in 0..50 {
            let samples: Vec<f64> = generator.next();

            for s in samples {
                assert!(s.abs() <= AMPLITUDE)
            }
        }
    }

    #[test]
    fn test_next_sampling_rate_equals_frequency() {
        const SAMPLING_RATE: f64 = 1.0;
        const FREQUENCY: f64 = 1.0;

        let mut generator = TenChannelSampleGenerator::new(SAMPLING_RATE, FREQUENCY, 1.0, false);

        let first: Vec<f64> = generator.next();
        let second: Vec<f64> = generator.next();
        let third: Vec<f64> = generator.next();

        assert_eq!(first, second);
        assert_eq!(second, third);
    }
}
