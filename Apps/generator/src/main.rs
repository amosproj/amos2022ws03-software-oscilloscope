use std::{env};
use std::net::{UdpSocket};
use tokio::time::{self, Duration};
use dasp_signal::{self as signal, Signal};

#[tokio::main]
async fn main() {
    
    // parse environment variables
    let host: String;
    let target: String;
    let pps: f64;

    let signal: String;
    let frequency: f64;
    let amplitude: f64;

    match env::var("HOST") {
        Ok(v) => { host = v; },
        Err(_e) => { host = "127.0.0.1:34254".to_owned(); }
    }
    match env::var("TARGET") {
        Ok(v) => { target = v; },
        Err(_e) => { target = "127.0.0.1:34255".to_owned(); }
    }
    match env::var("PPS") {
        Ok(v) => { pps = v.parse::<f64>().unwrap(); },
        Err(_e) => { pps = 100.0; }
    }
    match env::var("SIG_TYP") {
        Ok(v) => { signal = v; },
        Err(_e) => { signal = "sin".to_owned(); }
    }
    match env::var("SIG_FREQ") {
        Ok(v) => { frequency = v.parse::<f64>().unwrap(); },
        Err(_e) => { frequency = 1.0; }
    }
    match env::var("SIG_AMP") {
        Ok(v) => { amplitude = v.parse::<f64>().unwrap(); },
        Err(_e) => { amplitude = 1.0; }
    }

    println!("Host: {host}");
    println!("Target: {target}");
    println!("PPS: {:?} [Hz]", pps);
    println!("Signal: {:?}", signal);
    println!("Frequency: {:?}", frequency);
    println!("Applitude: {:?}", amplitude);
    
    println!("Setting up UDP socket");
    let socket: UdpSocket = UdpSocket::bind(host).expect("couldn't bind to address.");
    println!("Created UDP socket");  
    socket.connect(target).expect("connect function failed");

    println!("Beginning to send ...");
    run(&socket, pps, &signal, frequency, amplitude).await;
}

fn bytes_from_samples(samples: &Vec<f64>) -> Vec<u8> {
    let mut data: Vec<u8> = Vec::new();

    for sample in samples {
        let bytes : [u8; 8] = sample.to_ne_bytes();
        for byte in bytes {
            data.push(byte)
        }
    }
    data
}

async fn run(socket: &UdpSocket, packages_per_second: f64, sig : &String,  frequency: f64, amplitude: f64 ) {
    let mut interval = time::interval(Duration::from_nanos((1.0 / packages_per_second * 1_000_000_000.0) as u64));

        let sampling_rate: f64 = packages_per_second;

        let mut sine_signal = signal::rate(sampling_rate).const_hz(frequency).sine();
        let mut saw_signal = signal::rate(sampling_rate).const_hz(frequency).saw();
        let mut square_signal = signal::rate(sampling_rate).const_hz(frequency).square();
        let noise = rng.gen_range(0.0..10.0)
        loop {
            let mut samples: Vec<f64> = Vec::new();
            samples.push(square_signal.next());
            samples.push(saw_signal.next());
            samples.push(sine_signal.next());
            let samples: Vec<u8> = bytes_from_samples(&samples);

            match socket.send(&samples) {
                Ok(n) => (),
                Err(e) => println!("failed sending: {e:?}.")
            }

            //wait to match desired packages per second
            interval.tick().await;
        }
}
