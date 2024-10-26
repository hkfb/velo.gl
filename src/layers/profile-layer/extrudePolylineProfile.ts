export type Point3D = { x: number; y: number; z: number };
export type Point3dTuple = [number, number, number];
type Geometry = { vertices: Point3D[]; indices: number[] };

import proj4 from "proj4";

// Define projections
const WGS84 = "EPSG:4326";
const WebMercator = "EPSG:3857";

/**
 * Converts geographic coordinates (longitude, latitude) to meters (Web Mercator).
 * @param point - A Point3D with x as longitude and y as latitude.
 * @returns A Point3D with x and y in meters.
 */
export function lngLatToMeters(point: Point3dTuple): Point3dTuple {
    const [x, y] = proj4(WGS84, WebMercator, [point[0], point[1]]);
    return [x, y, point[2]];
}

/**
 * Converts meters (Web Mercator) back to geographic coordinates (longitude, latitude).
 * @param point - A Point3D with x and y in meters.
 * @returns A Point3D with x as longitude and y as latitude.
 */
export function metersToLngLat(point: Point3D): Point3D {
    const [x, y] = proj4(WebMercator, WGS84, [point.x, point.y]);
    return { x, y, z: point.z };
}

export function extrudePolylineProfile(
    polyline: Point3dTuple[],
    pathWidth = 3000
): { vertices: Point3dTuple[]; indices: number[] } {
    const keyedCoordinate = polyline.map(([x, y, z]) => ({
        x,
        y,
        z,
    }));
    const { vertices, indices } = extrudePolylineToRoad(
        keyedCoordinate,
        pathWidth
    );
    const unstructuredVertices: Point3dTuple[] = vertices.map(({ x, y, z }) => [
        x,
        y,
        z,
    ]);
    return { vertices: unstructuredVertices, indices };
}

/**
 * Extrudes a 3D polyline into a road geometry with constant width,
 * mitered corners, and vertical sides extending from sea level to the road level.
 * @param polyline - Array of 3D points representing the centerline of the road (in meters).
 * @param roadWidth - The constant width of the road (in meters).
 * @returns An object containing vertices and indices representing the tessellated road geometry.
 */
export function extrudePolylineToRoad(
    polyline: Point3D[],
    roadWidth: number
): Geometry {
    const vertices: Point3D[] = [];
    const indices: number[] = [];

    const n = polyline.length;
    if (n < 2) {
        throw new Error("Polyline must have at least 2 points.");
    }

    const leftOffsets: Point3D[] = [];
    const rightOffsets: Point3D[] = [];

    // Precompute segment directions and normals
    const segmentDirections: Point3D[] = [];
    for (let i = 0; i < n - 1; i++) {
        const p0 = polyline[i];
        const p1 = polyline[i + 1];
        const dir = {
            x: p1.x - p0.x,
            y: p1.y - p0.y,
            z: 0, // Ignore z for horizontal direction
        };
        const length = Math.hypot(dir.x, dir.y);
        if (length === 0) {
            throw new Error(
                `Zero-length segment between points ${i} and ${i + 1}.`
            );
        }
        // Normalize direction
        segmentDirections.push({ x: dir.x / length, y: dir.y / length, z: 0 });
    }

    // Compute mitered offsets at each vertex
    for (let i = 0; i < n; i++) {
        let normal: Point3D;
        let miterLength = roadWidth / 2;

        if (i === 0) {
            // Start point: use the normal of the first segment
            const dir = segmentDirections[0];
            normal = { x: -dir.y, y: dir.x, z: 0 };
        } else if (i === n - 1) {
            // End point: use the normal of the last segment
            const dir = segmentDirections[n - 2];
            normal = { x: -dir.y, y: dir.x, z: 0 };
        } else {
            // Middle points: compute mitered normal
            const dirPrev = segmentDirections[i - 1];
            const dirNext = segmentDirections[i];

            // Compute angle between segments
            const cosTheta = dirPrev.x * dirNext.x + dirPrev.y * dirNext.y;
            const sinTheta = dirPrev.x * dirNext.y - dirPrev.y * dirNext.x;

            // Miter vector is sum of normals of adjacent segments
            const normalPrev = { x: -dirPrev.y, y: dirPrev.x, z: 0 };
            const normalNext = { x: -dirNext.y, y: dirNext.x, z: 0 };
            const miter = {
                x: normalPrev.x + normalNext.x,
                y: normalPrev.y + normalNext.y,
                z: 0,
            };
            const miterLen = Math.hypot(miter.x, miter.y);
            if (miterLen === 0) {
                normal = normalPrev; // Degenerate case
            } else {
                // Calculate the miter length
                const sinHalfTheta = sinTheta / 2;
                const miterLengthDenom = sinHalfTheta || 1e-6; // Avoid division by zero
                miterLength = roadWidth / 2 / miterLengthDenom;

                // Cap the miter length to prevent excessive width
                const maxMiterLength = roadWidth * 2; // Adjust as needed
                miterLength = Math.min(miterLength, maxMiterLength);

                normal = {
                    x:
                        ((miter.x / miterLen) * (roadWidth / 2)) /
                        miterLengthDenom,
                    y:
                        ((miter.y / miterLen) * (roadWidth / 2)) /
                        miterLengthDenom,
                    z: 0,
                };
            }
        }

        // Normalize the normal vector
        const normalLen = Math.hypot(normal.x, normal.y);
        if (normalLen === 0) {
            throw new Error(`Zero-length normal at point ${i}.`);
        }
        normal = { x: normal.x / normalLen, y: normal.y / normalLen, z: 0 };

        // Apply the offset
        const offset = {
            x: normal.x * (roadWidth / 2),
            y: normal.y * (roadWidth / 2),
            z: 0,
        };

        // Offset points at the road level (top surface)
        leftOffsets.push({
            x: polyline[i].x + offset.x,
            y: polyline[i].y + offset.y,
            z: polyline[i].z,
        });
        rightOffsets.push({
            x: polyline[i].x - offset.x,
            y: polyline[i].y - offset.y,
            z: polyline[i].z,
        });
    }

    // Build the vertices array (top and bottom vertices for each side)
    for (let i = 0; i < n; i++) {
        // Top left and right vertices (at road level)
        const topLeft = leftOffsets[i];
        const topRight = rightOffsets[i];

        // Bottom left and right vertices (at sea level, z = 0)
        const bottomLeft = { x: leftOffsets[i].x, y: leftOffsets[i].y, z: 0 };
        const bottomRight = {
            x: rightOffsets[i].x,
            y: rightOffsets[i].y,
            z: 0,
        };

        // Add vertices in the order: topLeft, topRight, bottomRight, bottomLeft
        vertices.push(topLeft, topRight, bottomRight, bottomLeft);
    }

    // Build indices for triangles
    for (let i = 0; i < n - 1; i++) {
        const idx = i * 4;

        // Top surface (road surface)
        indices.push(idx, idx + 4, idx + 5);
        indices.push(idx, idx + 5, idx + 1);

        // Side surfaces
        // Left side
        indices.push(idx, idx + 3, idx + 7);
        indices.push(idx, idx + 7, idx + 4);

        // Right side
        indices.push(idx + 1, idx + 5, idx + 6);
        indices.push(idx + 1, idx + 6, idx + 2);

        // Front face (connecting bottom vertices)
        indices.push(idx + 2, idx + 6, idx + 7);
        indices.push(idx + 2, idx + 7, idx + 3);
    }

    return { vertices, indices };
}
