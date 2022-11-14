use std::{env};
use std::net::{UdpSocket};
use tokio::time::{self, Duration};
//use ndarray::{Array2};

#[tokio::main]
async fn main() {
    
    // parse environment variables
    let host_: String;
    let target_: String;
    let frequency: f64;
    match env::var("HOST") {
        Ok(v) => { host_ = v; },
        Err(_e) => { host_ = "127.0.0.1:34254".to_owned(); }
    }
    let host: &str = &host_[..];
    match env::var("TARGET") {
        Ok(v) => { target_ = v; },
        Err(_e) => { target_ = "127.0.0.1:34255".to_owned(); }
    }
    let target: &str = &target_[..];
    match env::var("FREQUENCY") {
        Ok(v) => { frequency = v.parse::<f64>().unwrap(); },
        Err(_e) => { frequency = 1.0; }
    }

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

    let step: f64 = 1.0 / frequency;
    let mut t: f64 = 0.0;

    let pi: f64 = std::f64::consts::PI;

    loop {

        //let mut data = Array2::<u8>::zeros((10, 8));

        let mut count: u8 = 0;
        //while count < 10 {

        // parse environment variables
        let sig: String;
        match env::var(format!("SIG_TYP_{}", count)) {
            Ok(v) => { sig = v; },
            Err(_e) => { sig = "sin".to_owned(); }
        }
        let f: f64;
        match env::var(format!("SIG_FREQ_{}", count)) {
            Ok(v) => { f = v.parse::<f64>().unwrap(); },
            Err(_e) => { f = 1.0; }
        }
        let dur: f64 = 1.0 / f;
        let a: f64;
        match env::var(format!("SIG_AMP_{}", count)) {
            Ok(v) => { a = v.parse::<f64>().unwrap(); },
            Err(_e) => { a = 1.0; }
        }

        // generate data
        let v: f64;
        match &sig[..] {
            "sin" => { v = a * (pi * 2.0 * f * t).sin(); },
            "cos" => { v = a * (pi * 2.0 * f * t).cos(); },
            "saw" => { v = a * ((t / dur) * 2.0 - 1.0) },
            "stp" => { if t - (dur / 2.0) >= 0.0 { v = -a; } else { v = a; } },
            _ => { v = 0.0; }
        }
        let bytes: [u8; 8] = v.to_ne_bytes();
        t += step;
        while t >= dur { t -= dur; }

        //let mut c: u8 = 0;
        //while c < 8 {
        //    data[[count as usize, c as usize]] = bytes[c as usize];
        //    c += 1;
        //}

        //    count += 1;
        //}

        //let bytearray: [u8; 80] = data.into_shape(80).unwrap().as_slice().expect("oops").try_into().expect("ooops");

        // send packet
        socket.send(&bytes);
        /*match socket.send(&bytes) {
            Ok(n) => println!("sent values as {n} bytes: {:?}", &bytes),
            Err(e) => println!("failed sending: {e:?}.")
        }*/

        // wait to match desired frequency
        interval.tick().await;
    }
}

// async fn run(socket: &UdpSocket, frequency: f64) {
//     let mut interval = time::interval(Duration::from_nanos((1.0 / frequency * 1_000_000_000.0) as u64));

//     let f: f64 = env!("SIGNAL_FREQUENCY").parse::<f64>().unwrap();
//     let dur: f64 = 1.0 / f;
//     let a: f64 = env!("SIGNAL_AMPLITUDE").parse::<f64>().unwrap();
//     let sig: &str = &env!("SIGNAL_TYPE").to_lowercase();

//     let step: f64 = 1.0 / frequency;
//     let mut t: f64 = 0.0;

//     let pi: f64 = std::f64::consts::PI;

//     loop {
//         // generate data
//         let mut v: f64;
//         match sig {
//             "sin" => { v = a * (pi * 2.0 * f * t).sin(); },
//             "cos" => { v = a * (pi * 2.0 * f * t).cos(); },
//             "saw" => { v = a * ((t / dur) * 2.0 - 1.0) },
//             "stp" => { if t - (dur / 2.0) >= 0.0 { v = -a; } else { v = a; } },
//             _ => { v = 0.0; }
//         }
//         let data: [u8; 8] = v.to_ne_bytes();
//         t += step;
//         while t >= dur { t -= dur; }

//         // send packet
//         match socket.send(&data) {
//             Ok(n) => println!("sent value {:.4} as {n} bytes: {:?}", v, &data),
//             Err(e) => println!("failed sending: {e:?}.")
//         }

//         // wait to match desired frequency
//         interval.tick().await;
//     }
// }

// fn sample_data_channel() -> [u8;30] {
//     let mut data = Array2::<u8>::zeros((10, 3));
//     for (_, mut row) in data.axis_iter_mut(Axis(0)).enumerate() {
//         // Perform calculations and assign to `row`; this is a trivial example:
//         row.fill(1);
//     }
//     let flat = data.into_shape(30).unwrap();
//     let bytearray = flat.as_slice().expect("oops");
//     bytearray.try_into().expect("ooops")
// }
