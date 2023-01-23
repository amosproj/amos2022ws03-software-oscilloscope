use dasp_signal::{self as signal, Signal};
use rand::Rng;
use rand::thread_rng;
const RANDOM_DIFF: f64 = 0.01;

pub struct TenChannelSampleGenerator {
    pub sine_signal: signal::Sine<signal::ConstHz>,
    pub saw_signal: signal::Saw<signal::ConstHz>,
    pub square_signal: signal::Square<signal::ConstHz>,
    pub rng: rand::rngs::ThreadRng,
    pub amplitude: f64,
    pub add_noise: bool,
    pub prev_rand_value: f64,
    pub sine_amplitude_iterator: Box<dyn Iterator<Item=f64>>,
    pub sine_amplitude_signal: signal::Sine<signal::ConstHz>,
    pub sine_signal_no_noise: signal::Sine<signal::ConstHz>,
    pub saw_signal_no_noise: signal::Saw<signal::ConstHz>,
    pub square_signal_no_noise: signal::Square<signal::ConstHz>,
}

impl TenChannelSampleGenerator {
    pub fn new(
        sampling_rate: f64,
        frequency: f64,
        amplitude: f64,
        add_noise: bool,
    ) -> TenChannelSampleGenerator {
        fn oscillate(rate: f64) -> impl Iterator<Item=f64> {
            (0..).map(move |x| ((x as f64 * std::f64::consts::PI / rate).sin() + 1.0) / 2.0)
        }
        let sine_signal = signal::rate(sampling_rate).const_hz(frequency).sine();
        let saw_signal = signal::rate(sampling_rate).const_hz(frequency).saw();
        let square_signal = signal::rate(sampling_rate).const_hz(frequency).square();
        let rng = thread_rng();
        let prev_rand_value = 0.0;
        let sine_amplitude_iterator = Box::new(oscillate(sampling_rate * 10.0));
        let sine_amplitude_signal = signal::rate(sampling_rate).const_hz(frequency).sine();
        let sine_signal_no_noise = signal::rate(sampling_rate).const_hz(frequency).sine();
        let saw_signal_no_noise = signal::rate(sampling_rate).const_hz(frequency).saw();
        let square_signal_no_noise = signal::rate(sampling_rate).const_hz(frequency).square();

        TenChannelSampleGenerator {
            sine_signal,
            saw_signal,
            square_signal,
            rng,
            amplitude,
            add_noise,
            prev_rand_value,
            sine_amplitude_iterator,
            sine_amplitude_signal,
            sine_signal_no_noise,
            saw_signal_no_noise,
            square_signal_no_noise,
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
        samples.push(self.amplitude * self.random_bounded_values());
        samples.push(self.rng.gen_range(-1.0..1.0));
        samples.push(self.amplitude * self.sine_amplitude_signal.next() * self.sine_amplitude_iterator.next().unwrap());
        samples.push(self.amplitude * self.sine_signal_no_noise.next());
        samples.push(self.amplitude * self.saw_signal_no_noise.next());
        samples.push(self.amplitude * self.square_signal_no_noise.next());

        // remaining channels are set to a constant 0-Signal
        samples.push(0.0);
        samples
    }

    fn random_bounded_values(self: &mut TenChannelSampleGenerator) -> f64 {
        let mut rng = thread_rng();
        let prev_value = self.prev_rand_value;
        loop {
            let value = rng.gen_range(-1.0..1.0);
            if (prev_value - value).abs() <= RANDOM_DIFF {
                self.prev_rand_value = value;
                return value;
            }
        }
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

        assert_eq!(first[0..3], second[0..3]);
        assert_eq!(second[0..3], third[0..3]);
    }

    #[test]
    fn test_random_bounded_values() {
        const SAMPLING_RATE: f64 = 50.0;
        const FREQUENCY: f64 = 1.0;
        const AMPLITUDE: f64 = 10.0;
        let mut generator = TenChannelSampleGenerator::new(SAMPLING_RATE, FREQUENCY, AMPLITUDE, false);
        let first_value = generator.random_bounded_values();

        let second_value = generator.random_bounded_values();
        assert!((first_value - second_value).abs() <= RANDOM_DIFF);

        let third_value = generator.random_bounded_values();
        assert!((first_value - third_value).abs() <= RANDOM_DIFF * 2.0);
        assert!((second_value - third_value).abs() <= RANDOM_DIFF);

        let fourth_value = generator.random_bounded_values();
        assert!((first_value - fourth_value).abs() <= 3.0 * RANDOM_DIFF);
        assert!((second_value - fourth_value).abs() <= 2.0 * RANDOM_DIFF);
        assert!((third_value - fourth_value).abs() <= RANDOM_DIFF);
    }

    #[test]
    fn test_random_bounded_values_min_max() {
        let mut min: f64 = 10000.0;
        let mut max: f64 = -100000.0;

        const SAMPLING_RATE: f64 = 50.0;
        const FREQUENCY: f64 = 1.0;
        const AMPLITUDE: f64 = 10.0;
        let mut generator = TenChannelSampleGenerator::new(SAMPLING_RATE, FREQUENCY, AMPLITUDE, false);

        for _ in 0..1000 {
            let value = generator.random_bounded_values();
            min = min.min(value);
            max = max.max(value);
        }

        assert!(min > -1.0);
        assert!(max < 1.0);
    }
}
