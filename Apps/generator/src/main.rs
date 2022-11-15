use std::{env};
use std::net::{UdpSocket};
use tokio::time::{self, Duration};
use dasp_signal::{self as signal, Signal};
use rand::Rng;

#[tokio::main]
async fn main() {
    // parse environment variables
    let host: String = match env::var("HOST") {
        Ok(v) => v,
        Err(_e) => "127.0.0.1:34254".to_owned()
    };
    let target: String = match env::var("TARGET") {
        Ok(v) => v,
        Err(_e) => "127.0.0.1:34255".to_owned()
    };
    let pps: f64 = match env::var("PPS") {
        Ok(v) => v.parse::<f64>().unwrap(),
        Err(_e) => 10000.0
    };
    let signal: String = match env::var("SIG_TYP") {
        Ok(v) => v,
        Err(_e) => "sin".to_owned()
    };
    let frequency: f64 = match env::var("SIG_FREQ") {
        Ok(v) => v.parse::<f64>().unwrap(),
        Err(_e) => 50.0
    };
    let amplitude: f64 = match env::var("SIG_AMP") {
        Ok(v) => v.parse::<f64>().unwrap(),
        Err(_e) => 1.0
    };

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

async fn run(socket: &UdpSocket, packages_per_second: f64, sig : &String,  frequency: f64, amplitude: f64 ) {
    let mut interval = time::interval(Duration::from_nanos((1.0 / packages_per_second * 1_000_000_000.0) as u64));

        let sampling_rate: f64 = packages_per_second;
        let mut sine_signal = signal::rate(sampling_rate).const_hz(frequency).sine();
        let mut saw_signal = signal::rate(sampling_rate).const_hz(frequency).saw();
        let mut square_signal = signal::rate(sampling_rate).const_hz(frequency).square();
        let mut rng = rand::thread_rng();

        loop {
            // create samples for 10 channels
            let mut samples: Vec<f64> = Vec::new();
            // add noise for better visibility of refresh rate
            let noise : f64 = 0.1 * (rng.gen::<f64>() - 0.5);
            samples.push(amplitude * square_signal.next() + noise);
            samples.push(amplitude * sine_signal.next() + noise);
            samples.push(amplitude * saw_signal.next() + noise);
            samples.push(0.0);
            samples.push(0.0);
            samples.push(0.0);
            samples.push(0.0);
            samples.push(0.0);
            samples.push(0.0);
            samples.push(0.0);
            let samples: Vec<u8> = bytes_from_samples(&samples);

            match socket.send(&samples) {
                Ok(n) => (),
                Err(e) => println!("failed sending: {e:?}.")
            }

            //wait to match desired packages per second
            interval.tick().await;
        }
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
