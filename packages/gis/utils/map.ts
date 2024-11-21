const MAPUTIL = class MapUtil {
    constructor(){ 
    }

    /**
     * Convert GeoJSON bounds to coordinates
     * @param bounds 
     */
    static bounds_to_coordinates = (bbox: any) => {
      let parsed_array = Array<number>();
      let vals = bbox.toString().replace("[", "").replace("]","").split(","); 
      vals?.map((el) => {
        if(!isNaN(el)){
          parsed_array.push(parseFloat(el)); 
        }
      })
      if(parsed_array.length != 4) return null; 

      const coords = [
          {
            longitude: parsed_array[0],
            latitude: parsed_array[1]
          },
          {
            longitude: parsed_array[2],
            latitude: parsed_array[3], 
          }
      ]
      return coords;
    }
}

export { MAPUTIL }