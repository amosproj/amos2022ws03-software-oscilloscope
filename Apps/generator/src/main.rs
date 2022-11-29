use crate::config::Config;
use crate::helper::{bytes_from_samples, create_udp_socket};
use crate::sample_generator::TenChannelSampleGenerator;
use std::net::UdpSocket;
use tokio::time::{self, Duration};

mod config;
mod helper;
mod sample_generator;

#[tokio::main]
async fn main() {
    let config: Config = Config::build_from_environment_variables();

    println!("{}", config);

    let socket: UdpSocket = create_udp_socket(&config.host, &config.target);

    run(&socket, &config).await;
}

async fn run(socket: &UdpSocket, config: &Config) {
    let mut generator = TenChannelSampleGenerator::new(
        config.pps,
        config.signal_frequency,
        config.signal_amplitude,
        true,
    );
    let nanos_between_packages = (1.0 / config.pps * 1_000_000_000.0) as u64;
    let package_interval = Duration::from_nanos(nanos_between_packages);
    let mut package_interval = time::interval(package_interval);

    loop {
        let samples: Vec<f64> = generator.next();
        let data: Vec<u8> = bytes_from_samples(&samples);

        match socket.send(&data) {
            Ok(_) => (),
            Err(e) => println!("failed sending: {e:?}."),
        }

        //wait to match desired packages per second
        package_interval.tick().await;
    }
}
