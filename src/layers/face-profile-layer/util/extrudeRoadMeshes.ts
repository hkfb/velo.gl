import { Geometry } from "@luma.gl/engine";

type RoadGeometryMeshes = {
    sideGeometry: Geometry;
    topGeometry: Geometry;
};

/**
 * Extrudes a polyline into two separate meshes (side and top) as luma.gl Geometry:
 *   - Sides have strictly horizontal normals (no Z component).
 *   - Top has normals that match the slope along the path direction in 3D.
 *
 * Cross section per vertex:
 *   - Side: 4 vertices (STL, SBL, SBR, STR)
 *   - Top:  2 vertices (TTL, TTR)
 *
 * @param polyline   Array of [x,y,z] points (the road centerline).
 * @param roadWidth  Width of the road in meters.
 * @returns { sideGeometry, topGeometry } as luma.gl Geometry
 */
export function extrudeRoadMeshes(
    polyline: number[][],
    roadWidth: number,
): RoadGeometryMeshes {
    const n = polyline.length;
    if (n < 2) {
        throw new Error("Polyline must have at least 2 points.");
    }

    // --------------------------------------------------------
    // 1) Compute distances for texture coordinate 'v' mapping
    // --------------------------------------------------------
    let totalLength = 0;
    const cumulativeLengths: number[] = [0];
    for (let i = 1; i < n; i++) {
        const [x0, y0, z0] = polyline[i - 1];
        const [x1, y1, z1] = polyline[i];
        const dx = x1 - x0,
            dy = y1 - y0,
            dz = z1 - z0;
        const segLen = Math.hypot(dx, dy, dz);
        totalLength += segLen;
        cumulativeLengths.push(totalLength);
    }

    // --------------------------------------------------------
    // 2) Compute 3D tangents at each vertex
    //    and strictly horizontal side normals in XY plane
    // --------------------------------------------------------
    // Segment directions in 3D
    const segmentTangents: [number, number, number][] = [];
    for (let i = 0; i < n - 1; i++) {
        const [x0, y0, z0] = polyline[i];
        const [x1, y1, z1] = polyline[i + 1];
        let dx = x1 - x0,
            dy = y1 - y0,
            dz = z1 - z0;
        const length = Math.hypot(dx, dy, dz);
        if (length < 1e-6) {
            throw new Error(
                `Zero-length segment between points ${i} and ${i + 1}.`,
            );
        }
        dx /= length;
        dy /= length;
        dz /= length;
        segmentTangents.push([dx, dy, dz]);
    }

    // For each vertex, define a tangent T_i by averaging adjacent segment tangents (if middle).
    // For first, use segmentTangents[0]. For last, use segmentTangents[n-2].
    const tangents3D: [number, number, number][] = [];
    for (let i = 0; i < n; i++) {
        if (i === 0) {
            tangents3D.push(segmentTangents[0]);
        } else if (i === n - 1) {
            tangents3D.push(segmentTangents[n - 2]);
        } else {
            const [dx1, dy1, dz1] = segmentTangents[i - 1];
            const [dx2, dy2, dz2] = segmentTangents[i];
            // Average them for a smooth transition
            const ax = dx1 + dx2,
                ay = dy1 + dy2,
                az = dz1 + dz2;
            const len = Math.hypot(ax, ay, az);
            if (len < 1e-6) {
                tangents3D.push(segmentTangents[i - 1]); // fallback
            } else {
                tangents3D.push([ax / len, ay / len, az / len]);
            }
        }
    }

    // Strictly horizontal side normals in XY plane
    // We still do a "mitered" approach in XY for side offset
    const sideNormalsXY: [number, number][] = [];
    for (let i = 0; i < n; i++) {
        if (i === 0) {
            const [dx, dy] = [segmentTangents[0][0], segmentTangents[0][1]];
            const perp = [-dy, dx];
            const pl = Math.hypot(perp[0], perp[1]);
            sideNormalsXY.push([perp[0] / pl, perp[1] / pl]);
        } else if (i === n - 1) {
            const [dx, dy] = [
                segmentTangents[n - 2][0],
                segmentTangents[n - 2][1],
            ];
            const perp = [-dy, dx];
            const pl = Math.hypot(perp[0], perp[1]);
            sideNormalsXY.push([perp[0] / pl, perp[1] / pl]);
        } else {
            const [dx1, dy1] = [
                segmentTangents[i - 1][0],
                segmentTangents[i - 1][1],
            ];
            const [dx2, dy2] = [segmentTangents[i][0], segmentTangents[i][1]];
            const perp1: [number, number] = [-dy1, dx1];
            const perp2 = [-dy2, dx2];
            const mx = perp1[0] + perp2[0];
            const my = perp1[1] + perp2[1];
            const mLen = Math.hypot(mx, my);
            if (mLen < 1e-6) {
                sideNormalsXY.push(perp1);
            } else {
                sideNormalsXY.push([mx / mLen, my / mLen]);
            }
        }
    }

    // --------------------------------------------------------
    // 3) Build side & top arrays
    //    For the top normals, we do N_top = T_3D x N_sideHorizontal
    // --------------------------------------------------------
    const sidePositions: number[] = [];
    const sideNormals: number[] = [];
    const sideTexCoords: number[] = [];
    const sideIndices: number[] = [];

    const topPositions: number[] = [];
    const topNormals: number[] = [];
    const topTexCoords: number[] = [];
    const topIndices: number[] = [];

    const halfWidth = roadWidth / 2;

    for (let i = 0; i < n; i++) {
        const [cx, cy, cz] = polyline[i];
        const [tx, ty, tz] = tangents3D[i];
        const [nx, ny] = sideNormalsXY[i];

        // Strictly horizontal offset
        const offsetX = nx * halfWidth;
        const offsetY = ny * halfWidth;

        // side: STL, SBL, SBR, STR
        const STLx = cx - offsetX,
            STLy = cy - offsetY,
            STLz = cz;
        const SBLx = cx - offsetX,
            SBLy = cy - offsetY,
            SBLz = 0;
        const SBRx = cx + offsetX,
            SBRy = cy + offsetY,
            SBRz = 0;
        const STRx = cx + offsetX,
            STRy = cy + offsetY,
            STRz = cz;

        sidePositions.push(
            STLx,
            STLy,
            STLz,
            SBLx,
            SBLy,
            SBLz,
            SBRx,
            SBRy,
            SBRz,
            STRx,
            STRy,
            STRz,
        );

        // side normals: purely horizontal
        sideNormals.push(nx, ny, 0, nx, ny, 0, nx, ny, 0, nx, ny, 0);

        // side texture coords
        const v = totalLength > 1e-6 ? cumulativeLengths[i] / totalLength : 0;
        sideTexCoords.push(
            0,
            v, // STL
            0,
            v, // SBL
            1,
            v, // SBR
            1,
            v, // STR
        );

        // top: TTL, TTR
        const TTLx = STLx,
            TTLy = STLy,
            TTLz = cz; // same as STL but top
        const TTRx = STRx,
            TTRy = STRy,
            TTRz = cz; // same as STR but top
        topPositions.push(TTLx, TTLy, TTLz, TTRx, TTRy, TTRz);

        // top normals: cross(T, sideNormal) to get a slope
        // sideNormal in 3D is (nx, ny, 0)
        const crossX = ty * 0 - tz * ny; // (T x side) x
        const crossY = tz * nx - tx * 0; // (T x side) y
        const crossZ = tx * ny - ty * nx; // (T x side) z
        const cLen = Math.hypot(crossX, crossY, crossZ);
        if (cLen < 1e-6) {
            // fallback if T is parallel or something unexpected
            // default to a pure up
            topNormals.push(0, 0, 1, 0, 0, 1);
        } else {
            // normalize
            const nxTop = crossX / cLen,
                nyTop = crossY / cLen,
                nzTop = crossZ / cLen;
            topNormals.push(nxTop, nyTop, nzTop, nxTop, nyTop, nzTop);
        }

        // top tex coords
        // e.g. left=0, right=1, same v
        topTexCoords.push(
            0,
            v, // TTL
            1,
            v, // TTR
        );
    }

    // --------------------------------------------------------
    // 4) Indices for side
    // --------------------------------------------------------
    for (let i = 0; i < n - 1; i++) {
        const baseThis = i * 4;
        const baseNext = (i + 1) * 4;

        // (STL, SBL) -> (STL, SBL)
        // rectangle => 2 triangles
        sideIndices.push(
            baseThis + 0,
            baseThis + 1,
            baseNext + 1,
            baseThis + 0,
            baseNext + 1,
            baseNext + 0,
        );

        // (SBL, SBR) -> (SBL, SBR)
        sideIndices.push(
            baseThis + 1,
            baseThis + 2,
            baseNext + 2,
            baseThis + 1,
            baseNext + 2,
            baseNext + 1,
        );

        // (SBR, STR) -> (SBR, STR)
        sideIndices.push(
            baseThis + 2,
            baseThis + 3,
            baseNext + 3,
            baseThis + 2,
            baseNext + 3,
            baseNext + 2,
        );
    }

    // --------------------------------------------------------
    // 5) Indices for top
    // --------------------------------------------------------
    for (let i = 0; i < n - 1; i++) {
        const baseThis = i * 2;
        const baseNext = (i + 1) * 2;
        topIndices.push(
            baseThis + 0,
            baseNext + 0,
            baseNext + 1,
            baseThis + 0,
            baseNext + 1,
            baseThis + 1,
        );
    }

    // --------------------------------------------------------
    // 6) Convert arrays to luma.gl Geometry
    // --------------------------------------------------------
    const sideGeometry = new Geometry({
        topology: "triangle-list",
        attributes: {
            positions: { size: 3, value: new Float32Array(sidePositions) },
            normals: { size: 3, value: new Float32Array(sideNormals) },
            texCoords: { size: 2, value: new Float32Array(sideTexCoords) },
        },
        indices: new Uint32Array(sideIndices),
    });

    const topGeometry = new Geometry({
        topology: "triangle-list",
        attributes: {
            positions: { size: 3, value: new Float32Array(topPositions) },
            normals: { size: 3, value: new Float32Array(topNormals) },
            texCoords: { size: 2, value: new Float32Array(topTexCoords) },
        },
        indices: new Uint32Array(topIndices),
    });

    // --------------------------------------------------------
    // 7) Return geometry objects
    // --------------------------------------------------------
    return { sideGeometry, topGeometry };
}
