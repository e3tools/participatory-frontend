const MAPUTIL = class MapUtil {
    constructor(){ 
    }

    /**
     * Convert GeoJSON bounds to coordinates
     * @param bounds 
     */
    static bounds_to_coordinates = (bbox: Array<number>) => {
        const coords = [
            {
              longitude: bbox[0],
              latitude: bbox[1]
            }, 
            {
              longitude: bbox[2],
              latitude: bbox[3], 
            }
        ]
        return coords;
    }
}

export { MAPUTIL }