// earthWorker.js - Web Worker for ASCII 3D Earth geometry calculations

onmessage = function(e) {
    const { rotationX, rotationY, grid, landPolygons } = e.data;
    const radius = 1;
    const points = [];

    for (let lat = -90; lat <= 90; lat += 4) {
        for (let lon = -180; lon <= 180; lon += 6) {
            const phi = (90 - lat) * Math.PI / 180;
            const theta = lon * Math.PI / 180;

            let x = radius * Math.sin(phi) * Math.cos(theta);
            let y = radius * Math.cos(phi);
            let z = radius * Math.sin(phi) * Math.sin(theta);

            // Apply tilt rotation
            let newY = y * Math.cos(rotationX) - z * Math.sin(rotationX);
            let newZ = y * Math.sin(rotationX) + z * Math.cos(rotationX);
            y = newY; z = newZ;

            // Apply horizontal rotation
            let newX = x * Math.cos(rotationY) + z * Math.sin(rotationY);
            newZ = -x * Math.sin(rotationY) + z * Math.cos(rotationY);
            x = newX; z = newZ;

            if (z > -0.3) {
                let char = '~';
                let color = 'ocean';
                let isPolar = Math.abs(lat) > 75;
                
                // Point-in-polygon land check
                let isLand = false;
                for (let polygon of landPolygons) {
                    if (pointInPolygon(lat, lon, polygon)) {
                        isLand = true;
                        break;
                    }
                }

                if (isPolar) {
                    char = ['*', '◦'][Math.floor(Math.random() * 2)];
                    color = 'ice';
                } else if (isLand) {
                    const chars = ['#', '%', '+', '@'];
                    const index = Math.floor((z + 1) / 2 * (chars.length * 1.25));
                    char = chars[Math.min(chars.length - 1, index)];
                    color = 'land';
                } else {
                    char = ['~', '≈'][Math.floor((1 - z) / 2 * 1)];
                }

                points.push({ x, y, z, char, color, lat, lon });
            }
        }
    }

    postMessage(points);
};

function pointInPolygon(lat, lon, polygon) {
    let inside = false;
    let x = lon, y = lat;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0], yi = polygon[i][1];
        let xj = polygon[j][0], yj = polygon[j][1];
        let intersect = ((yi > y) !== (yj > y)) &&
                        (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
} 