type Quaternion = [w: number, x: number, y: number, z: number];

type Attitude = [roll: number, pitch: number, yaw: number];

/**
 * Convert a quaternion to an attitude; e.g. roll, pitch, and yaw.
 * <p>
 * Note: the sensor data from a Sentry device, exposed in `http://192.168.4.1/data/Lyymmddhhmmss_*.csv` files, positions
 * the quaternion components at indices 5, 6, 7, and 8 (w, x, y, and z.)
 *
 * @param q the quaternion.
 */
export function quaternionToAttitude(q: Quaternion): Attitude {
    const [w, x, y, z] = q;
    return [
        Math.atan2(2.0 * (x * y + w * z), w * w + x * x - y * y - z * z),
        Math.asin(-2.0 * (x * z - w * y)),
        Math.atan2(2.0 * (y * z + w * x), w * w - x * x - y * y + z * z),
    ];
}
