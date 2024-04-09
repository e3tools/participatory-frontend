 
import { ImageRequireSource, ImageURISource } from "react-native";
import { Region } from "react-native-maps";
import { LEGEND_TYPE, DATASOURCE } from "./enums";
import { IMenuItemProps } from "@/app/common/interfaces";

/**
 * General map
 */
export interface IMapProps {
    initial_region: Region,
    initial_bounds: [],
    show_user_location?: boolean,
    show_my_location_button?: boolean
}

/**
 * App Marker
 */
export interface IMarkerProps {
    title: string,
    description?: string,
    location: {
        latitude: number,
        longitude: number,
    },
    draggable?: boolean
}

/**
 * GeoJSON geometry
 */
interface IGeometry {
    type: string,
    coordinates: []
}

/**
 * GeoJson Feature
 */
interface IFeature {
    type: string,
    properties: {},
    geometry: IGeometry
}

/**
 * GeoJSON 
 */
export interface IGeoJsonProps {
    type: string,
    features: Array<IFeature>
}

/**
 * Image Overlay
 */
export interface IImageOverlayProps {
    image: ImageURISource | ImageRequireSource,
    bounds: [[], []],
    opacity: number
}

export interface IWMSTileProps {
    // url: string, //host url. Geoserver
    // layer: string, //layer to pull
    // tile_size: number, //tile size
    // opacity: number, //layer opacity
    // format: string, //format of the tiled image
    analysis_name: string,
    admin_id: string,
    admin_level: number
}

interface ILegendItem {
    operator: string
    item_type: typeof LEGEND_TYPE,
    // alphatext_value: string,
    // numeric_value: number,
    // date_value: Date,
    absolute_val: object,
    lower_val: object,
    upper_val: object,
    label: string,
    color: string
}

/**
 * Interface for menu items when use clicks on options/settings button of the mapping page
 */
export interface IMappingOptionMenuItemProps extends IMenuItemProps {
    on_checkbox_value_change: (val)=>void, //handler for change of checkbox value
    on_slider_value_change: (val)=>void, //handler for change of opacity slider 
}


export interface IAnalysisProps {
    analysis_name: string, // name of analysis
    admin_id: string, //admin for which analysis is happening
    admin_level: number, //level of the admin
    datasource_type: 'Raster' | 'Vector' | 'Tabular', // DATASOURCE.RASTER | DATASOURCE.VECTOR | DATASOURCE.TABULAR,
}