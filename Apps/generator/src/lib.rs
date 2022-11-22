use dasp_signal::{self as signal, Signal};
use rand::Rng;
use std::{env, fmt, net::UdpSocket};
pub struct Config {
    pub host: String,
    pub target: String,
    pub pps: f64,
    pub signal_frequency: f64,
    pub signal_amplitude: f64,
}

impl Config {
    const DEFAULT_HOST: &str = "127.0.0.1:34254";
    const DEFAULT_TARGET: &str = "127.0.0.1:34255";
    const DEFAULT_PPS: f64 = 10_000.0;
    const DEFAULT_SIGNAL_FREQUENCY: f64 = 50.0;
    const DEFAULT_SIGNAL_AMPLITUDE: f64 = 1.0;

    pub fn build_from_environment_variables() -> Config {
        let host: String = match env::var("HOST") {
            Ok(v) => v,
            Err(_e) => Config::DEFAULT_HOST.to_string(),
        };
        let target: String = match env::var("TARGET") {
            Ok(v) => v,
            Err(_e) => Config::DEFAULT_TARGET.to_string(),
        };
        let pps: f64 = match env::var("PPS") {
            Ok(v) => v.parse::<f64>().unwrap(),
            Err(_e) => Config::DEFAULT_PPS,
        };
        let signal_frequency: f64 = match env::var("SIG_FREQ") {
            Ok(v) => v.parse::<f64>().unwrap(),
            Err(_e) => Config::DEFAULT_SIGNAL_FREQUENCY,
        };
        let signal_amplitude: f64 = match env::var("SIG_AMP") {
            Ok(v) => v.parse::<f64>().unwrap(),
            Err(_e) => Config::DEFAULT_SIGNAL_AMPLITUDE,
        };
        Config {
            host,
            target,
            pps,
            signal_frequency,
            signal_amplitude,
        }
    }
}

impl fmt::Display for Config {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let representation: String = format!(
            "Host: {host}\nTarget: {target}\nPPS: {pps}\nFrequency {frequency}\nApplitude {amplitude}\n",
            host = self.host, target = self.target, pps = self.pps, frequency = self.signal_frequency, amplitude = self.signal_amplitude);

        f.write_str(&representation)
    }
}

pub fn create_udp_socket(host: &String, target: &String) -> UdpSocket {
    println!("Setting up UDP socket");
    let socket: UdpSocket = UdpSocket::bind(host).expect("couldn't bind to address.");
    println!("Created UDP socket");
    socket.connect(target).expect("connect function failed");
    socket
}

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

pub fn bytes_from_samples(samples: &Vec<f64>) -> Vec<u8> {
    let mut data: Vec<u8> = Vec::new();

    for sample in samples {
        let bytes: [u8; 8] = sample.to_ne_bytes();
        for byte in bytes {
            data.push(byte)
        }
    }
    data
}
#[cfg(test)]
mod tests {
    use std::mem;

    use super::*;

    #[test]
    fn test_bytes_from_samples_number_bytes() {
        let samples = Vec::from([0.0, 0.0, 0.0, 0.0]);
        let result = bytes_from_samples(&samples);

        assert_eq!(result.len(), mem::size_of::<f64>() * samples.len());
    }
    #[test]
    fn test_bytes_from_samples_correct_bytes() {
        let samples = Vec::from([-0.1, 0.2]);
        let result = bytes_from_samples(&samples);

        assert!(samples.last().is_some());
        assert_eq!(samples.first().unwrap().to_ne_bytes(), &result[0..7]);

        assert!(samples.last().is_some());
        assert_eq!(samples.last().unwrap().to_ne_bytes(), &result[8..15]);
    }
    #[test]
    fn test_bytes_from_samples_empty_input() {
        let samples = Vec::from([]);
        let result = bytes_from_samples(&samples);

        assert!(result.is_empty());
    }
}
