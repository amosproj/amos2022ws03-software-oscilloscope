use std::{env, fmt};

pub struct Config {
    pub host: String,
    pub target: String,
    pub packages_per_second: f64,
    pub signal_frequency: f64,
    pub signal_amplitude: f64,
}

impl Config {
    const DEFAULT_HOST: &str = "127.0.0.1:34254";
    const DEFAULT_TARGET: &str = "127.0.0.1:34255";
    const DEFAULT_PACKAGES_PER_SECOND: f64 = 10_000.0;
    const DEFAULT_SIGNAL_FREQUENCY: f64 = 50.0;
    const DEFAULT_SIGNAL_AMPLITUDE: f64 = 1.0;

    pub fn build_from_environment_variables() -> Config {
        let host: String = match env::var("HOST") {
            Ok(v) => v,
            Err(_) => Config::DEFAULT_HOST.to_string(),
        };
        let target: String = match env::var("TARGET") {
            Ok(v) => v,
            Err(_) => Config::DEFAULT_TARGET.to_string(),
        };
        let packages_per_second: f64 = match env::var("PPS") {
            Ok(v) => v.parse::<f64>().unwrap(),
            Err(_) => Config::DEFAULT_PACKAGES_PER_SECOND,
        };
        let signal_frequency: f64 = match env::var("SIG_FREQ") {
            Ok(v) => v.parse::<f64>().unwrap(),
            Err(_) => Config::DEFAULT_SIGNAL_FREQUENCY,
        };
        let signal_amplitude: f64 = match env::var("SIG_AMP") {
            Ok(v) => v.parse::<f64>().unwrap(),
            Err(_) => Config::DEFAULT_SIGNAL_AMPLITUDE,
        };
        Config {
            host,
            target,
            packages_per_second,
            signal_frequency,
            signal_amplitude,
        }
    }
}

impl fmt::Display for Config {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        let representation: String = format!(
            "Host: {host}\nTarget: {target}\nPackages/s: {packages_per_second}\nFrequency {frequency}\nApplitude {amplitude}\n",
            host = self.host, target = self.target, packages_per_second = self.packages_per_second, frequency = self.signal_frequency, amplitude = self.signal_amplitude);

        formatter.write_str(&representation)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let default_config: Config = Config::build_from_environment_variables();
        assert_eq!(default_config.host, Config::DEFAULT_HOST);
        assert_eq!(default_config.target, Config::DEFAULT_TARGET);
        assert_eq!(
            default_config.packages_per_second,
            Config::DEFAULT_PACKAGES_PER_SECOND
        );
        assert_eq!(
            default_config.signal_frequency,
            Config::DEFAULT_SIGNAL_FREQUENCY
        );
        assert_eq!(
            default_config.signal_amplitude,
            Config::DEFAULT_SIGNAL_AMPLITUDE
        );
    }
}
