use std::net::UdpSocket;


fn main() {
    listen("0.0.0.0:34255");
}

fn listen(address: &str) {
    let socket: UdpSocket = UdpSocket::bind(address).expect("couldn't bind to address {address:?}.");
    let mut buf = [0;10];
    println!("Listening ...");
    loop {
        match socket.recv(&mut buf) {
            Ok(n) => println!("received {n} bytes: {:?}", &buf[..n]),
            Err(e) => println!("socket#recv function failed: {e:?}")
        }
    }
}
