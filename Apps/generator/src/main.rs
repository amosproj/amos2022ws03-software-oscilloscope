use generator::bytes_from_samples;
use generator::create_udp_socket;
use generator::{Config, TenChannelSampleGenerator};
use std::net::UdpSocket;
use tokio::time::{self, Duration};

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
    );

    let mut interval = time::interval(Duration::from_nanos(
        (1.0 / config.pps * 1_000_000_000.0) as u64,
    ));

    loop {
        let samples: Vec<f64> = generator.next();
        let data: Vec<u8> = bytes_from_samples(&samples);

        match socket.send(&data) {
            Ok(n) => (),
            Err(e) => println!("failed sending: {e:?}."),
        }

        //wait to match desired packages per second
        interval.tick().await;
    }
}
