use std::{env};
use std::net::{UdpSocket, IpAddr};
use tokio::time::{self, Duration};

#[tokio::main]
async fn main() {
    
    // default parameters
    let host: &str = env!("HOST");
    let target: &str = env!("TARGET");
    let frequency: f64 = env!("FREQUENCY").parse::<f64>().unwrap();

    println!("Host: {host}");
    println!("Target: {target}");
    println!("Frequency: {:?} [Hz]", frequency);
    
    println!("Setting up UDP socket");
    let socket: UdpSocket = UdpSocket::bind(host).expect("couldn't bind to address.");
    println!("Created UDP socket");  
    socket.connect(target).expect("connect function failed");

    println!("Beginning to send ...");
    run(&socket, frequency).await;
}

async fn run(socket: &UdpSocket, frequency: f64) {
    let mut interval = time::interval(Duration::from_nanos((1.0 / frequency * 1_000_000_000.0) as u64));
    loop {
        // generate data
        let data: &[u8] = &sample_data();

        // send packet
        match socket.send(&data) {
            Ok(n) => println!("sent {n} bytes: {:?}", &data[..n]),
            Err(e) => println!("failed sending: {e:?}."),
        }

        // wait to match desired frequency
        interval.tick().await;
    }
}

fn sample_data() -> [u8;10] {
    let data: [u8;10] = [0;10];
    
    // claculate realistic data
    // https://doc.rust-lang.org/std/primitive.f64.html#method.sin

    data
}
