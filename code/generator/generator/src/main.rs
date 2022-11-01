use std::{net, env};
use tokio::time::{self, Duration};

#[tokio::main]
async fn main() {
    
    // default parameters
    let mut host: &str = "127.0.0.1:34254";
    let mut target: &str = "127.0.0.1:34255";
    let mut frequency: f64 = 1.0;

    // pargs command line args
    let args: Vec<String> = env::args().collect();
    if args.len() == 4 {
        println!("Using command line arguments:");
        host = &args[1];
        target = &args[2];
        frequency = args[3].parse::<f64>().unwrap();
    } else {
        println!("Using default parameterization:");
    }

    println!("Host: {host}");
    println!("Target: {target}");
    println!("Frequency: {:?} [Hz]", frequency);
    
    println!("Beginning to send ...");
    run(host, target, frequency);
}

async fn run(host: &str, target: &str, frequency: f64) {
    let mut interval = time::interval(Duration::from_nanos((1.0 / frequency * 1_000_000_000.0) as u64));
    loop {
        // generate data
        let data: &[u8] = &sample_data();

        // send packet
        send(host, target, data);

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

fn send(host: &str, target: &str, buffer: &[u8]) {
    let socket: net::UdpSocket = net::UdpSocket::bind(host).expect("couldn't bind to address.");
    socket.connect(target).expect("connect function failed");
    match socket.send(&buffer) {
        Ok(n) => println!("sent {n} bytes: {:?}", &buffer[..n]),
        Err(e) => println!("failed sending: {e:?}."),
    }
}
