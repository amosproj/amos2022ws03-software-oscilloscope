use std::net::UdpSocket;

pub fn create_udp_socket(host: &String, target: &String) -> UdpSocket {
    println!("Setting up UDP socket");
    let socket: UdpSocket = UdpSocket::bind(host).expect("couldn't bind to address.");
    println!("Created UDP socket");
    socket.connect(target).expect("connect function failed");
    socket
}

pub fn bytes_from_samples(samples: &Vec<f64>) -> Vec<u8> {
    let mut data: Vec<u8> = Vec::new();

    for sample in samples {
        let bytes: [u8; 8] = sample.to_ne_bytes();
        for byte in bytes {
            data.push(byte)
        }
    }
    data
}
#[cfg(test)]
mod tests {
    use std::mem;

    use super::*;

    #[test]
    fn test_bytes_from_samples_number_bytes() {
        let samples = Vec::from([0.0, 0.0, 0.0, 0.0]);
        let result = bytes_from_samples(&samples);

        assert_eq!(result.len(), mem::size_of::<f64>() * samples.len());
    }
    #[test]
    fn test_bytes_from_samples_correct_bytes() {
        let samples = Vec::from([-0.1, 0.2]);
        let result = bytes_from_samples(&samples);

        assert!(samples.last().is_some());
        assert_eq!(samples.first().unwrap().to_ne_bytes(), &result[0..8]);

        assert!(samples.last().is_some());
        assert_eq!(samples.last().unwrap().to_ne_bytes(), &result[8..16]);
    }
    #[test]
    fn test_bytes_from_samples_empty_input() {
        let samples = Vec::from([]);
        let result = bytes_from_samples(&samples);

        assert!(result.is_empty());
    }
}
