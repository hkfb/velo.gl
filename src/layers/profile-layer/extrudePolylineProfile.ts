import { LngLatToLocaleCartesian } from "converter-locale-cartesian";

export type Point3d = [number, number, number];
export type Polyline = Point3d[];

/**
 * Compute per-vertex normals by averaging the normals of all faces that share each vertex.
 * @param positions - Flat array of vertex positions [x,y,z,...]
 * @param indices - Array of triangle indices
 */
function computePerVertexNormals(
    positions: number[],
    indices: number[],
): number[] {
    const vertexCount = positions.length / 3;
    const normals = new Float32Array(vertexCount * 3);

    // Accumulate normals
    for (let i = 0; i < indices.length; i += 3) {
        const i0 = indices[i] * 3;
        const i1 = indices[i + 1] * 3;
        const i2 = indices[i + 2] * 3;

        const x0 = positions[i0],
            y0 = positions[i0 + 1],
            z0 = positions[i0 + 2];
        const x1 = positions[i1],
            y1 = positions[i1 + 1],
            z1 = positions[i1 + 2];
        const x2 = positions[i2],
            y2 = positions[i2 + 1],
            z2 = positions[i2 + 2];

        // Edges
        const ex1 = x1 - x0,
            ey1 = y1 - y0,
            ez1 = z1 - z0;
        const ex2 = x2 - x0,
            ey2 = y2 - y0,
            ez2 = z2 - z0;

        // Face normal via cross product
        const nx = ey1 * ez2 - ez1 * ey2;
        const ny = ez1 * ex2 - ex1 * ez2;
        const nz = ex1 * ey2 - ey1 * ex2;

        // Add to each vertex normal
        normals[i0] += nx;
        normals[i0 + 1] += ny;
        normals[i0 + 2] += nz;
        normals[i1] += nx;
        normals[i1 + 1] += ny;
        normals[i1 + 2] += nz;
        normals[i2] += nx;
        normals[i2 + 1] += ny;
        normals[i2 + 2] += nz;
    }

    // Normalize each vertex normal
    for (let i = 0; i < vertexCount; i++) {
        const ix = i * 3;
        const nx = normals[ix],
            ny = normals[ix + 1],
            nz = normals[ix + 2];
        const len = Math.hypot(nx, ny, nz);
        if (len > 1e-6) {
            normals[ix] /= len;
            normals[ix + 1] /= len;
            normals[ix + 2] /= len;
        } else {
            // In case of a degenerate normal, just set it to something consistent
            normals[ix] = 0;
            normals[ix + 1] = 0;
            normals[ix + 2] = 1;
        }
    }

    return Array.from(normals);
}

export function getOffset(geometry: Polyline, origin: number[]): Polyline {
    const lngLatToLocalCartesian = new LngLatToLocaleCartesian(
        origin[0],
        origin[1],
    );
    const offset = geometry.map((v) => {
        const { x, y } = lngLatToLocalCartesian.converter(v[0], v[1]);
        return [x, y, v[2]] as Point3d;
    });
    return offset;
}

/**
 * Extrudes a 3D polyline into a road geometry with constant width,
 * mitered corners, and vertical sides extending from sea level to the road level.
 * Vertices are represented as flat arrays.
 * @param polyline - Array of 3D points [[x0, y0, z0], [x1, y1, z1], ...] representing the centerline of the road (in meters).
 * @param roadWidth - The constant width of the road (in meters).
 * @returns An object containing flat arrays for positions and indices representing the tessellated road geometry.
 */
export function extrudeProfile(
    polyline: Polyline,
    roadWidth: number,
): { positions: number[]; indices: number[]; normals: number[] } {
    const positions: number[] = [];
    const indices: number[] = [];

    const n = polyline.length;
    if (n < 2) {
        throw new Error("Polyline must have at least 2 points.");
    }

    const halfWidth = roadWidth / 2;

    // Compute normals and mitered offsets
    const normals: number[][] = []; // Normals at each point
    const miterLengths: number[] = []; // Miter lengths at each point

    // Precompute segment directions
    const segmentDirections: number[][] = [];
    for (let i = 0; i < n - 1; i++) {
        const p0 = polyline[i];
        const p1 = polyline[i + 1];
        const dx = p1[0] - p0[0];
        const dy = p1[1] - p0[1];
        const length = Math.hypot(dx, dy);
        if (length === 0) {
            throw new Error(
                `Zero-length segment between points ${i} and ${i + 1}.`,
            );
        }
        segmentDirections.push([dx / length, dy / length]);
    }

    // Compute normals and mitered offsets at each point
    for (let i = 0; i < n; i++) {
        let normal: number[];
        let miterLength = 1;

        if (i === 0) {
            // Start point
            const dir = segmentDirections[0];
            normal = [-dir[1], dir[0]]; // Perpendicular to dir
        } else if (i === n - 1) {
            // End point
            const dir = segmentDirections[n - 2];
            normal = [-dir[1], dir[0]];
        } else {
            // Middle points
            const dirPrev = segmentDirections[i - 1];
            const dirNext = segmentDirections[i];

            // Compute miter vector
            const normalPrev = [-dirPrev[1], dirPrev[0]];
            const normalNext = [-dirNext[1], dirNext[0]];

            const miter = [
                normalPrev[0] + normalNext[0],
                normalPrev[1] + normalNext[1],
            ];
            const miterLen = Math.hypot(miter[0], miter[1]);

            if (miterLen === 0) {
                normal = normalPrev;
                miterLength = 1;
            } else {
                normal = [miter[0] / miterLen, miter[1] / miterLen];

                // Compute miter length
                const cosHalfAngle =
                    normal[0] * normalNext[0] + normal[1] * normalNext[1];
                miterLength = 1 / cosHalfAngle;

                // Cap the miter length to prevent excessive extension
                miterLength = Math.min(miterLength, 5); // Adjust the cap as needed
            }
        }

        normals.push(normal);
        miterLengths.push(miterLength);
    }

    // Build vertices
    for (let i = 0; i < n; i++) {
        const p = polyline[i];
        const normal = normals[i];
        const miterLength = miterLengths[i];

        const offsetX = normal[0] * halfWidth * miterLength;
        const offsetY = normal[1] * halfWidth * miterLength;

        // Left side (offset negative normal)
        const xLeft = p[0] - offsetX;
        const yLeft = p[1] - offsetY;

        // Right side (offset positive normal)
        const xRight = p[0] + offsetX;
        const yRight = p[1] + offsetY;

        // Add vertices in the order: TL, BL, BR, TR
        // Top Left (TL)
        positions.push(xLeft, yLeft, p[2]);
        // Bottom Left (BL)
        positions.push(xLeft, yLeft, 0);
        // Bottom Right (BR)
        positions.push(xRight, yRight, 0);
        // Top Right (TR)
        positions.push(xRight, yRight, p[2]);
    }

    // Build indices
    for (let i = 0; i < n - 1; i++) {
        const idx = i * 4;

        // Top surface
        indices.push(idx, idx + 4, idx + 7);
        indices.push(idx, idx + 7, idx + 3);

        // Bottom surface (optional)
        indices.push(idx + 1, idx + 2, idx + 6);
        indices.push(idx + 1, idx + 6, idx + 5);

        // Left side
        indices.push(idx, idx + 1, idx + 5);
        indices.push(idx, idx + 5, idx + 4);

        // Right side
        indices.push(idx + 3, idx + 7, idx + 6);
        indices.push(idx + 3, idx + 6, idx + 2);
    }

    const vertexNormals = computePerVertexNormals(positions, indices);

    return { positions, indices, normals: vertexNormals };
}
