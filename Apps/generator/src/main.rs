use std::{env};
use std::net::{UdpSocket};
use tokio::time::{self, Duration};
use ndarray::{Array2, Axis};

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
        let data: &[u8] = &sample_data_chanel();

        // send packet
        match socket.send(&data) {
            Ok(n) => println!("sent {n} bytes: {:?}", &data[..n]),
            Err(e) => println!("failed sending: {e:?}."),
        }

        // wait to match desired frequency
        interval.tick().await;
    }
}

fn sample_data_chanel() -> [u8;30] {

    let mut data = Array2::<u8>::zeros((10, 3));
    for (_, mut row) in data.axis_iter_mut(Axis(0)).enumerate() {
        // Perform calculations and assign to `row`; this is a trivial example:
        row.fill(1);
    }
    let flat = data.into_shape(30).unwrap();
    let bytearray = flat.as_slice().expect("oops");
    bytearray.try_into().expect("ooops")
}
