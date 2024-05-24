
import { View, Text, StyleSheet, Alert, Dimensions, Linking } from 'react-native'
import React, { createRef, forwardRef, useImperativeHandle, useRef, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps'
import AppMask from '../../../components/shared/AppMask';
import { IGeoJsonProps, IImageOverlayProps, IMapProps, IMarkerProps } from '@/app/modules/mapping/interfaces';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import MapMarker from './layers/Marker';
import GeoJsonLayer from './layers/GeoJsonLayer';
import ImageOverlay from './layers/ImageOverlay'; 
import WMSTileLayer from './layers/WMSTileLayer';
import MapQueryDialog from './map_query_dialog';
import { VectorService } from '@/app/services/vector';
import { MAPUTIL } from '@/app/modules/mapping/utils/map';
import { Avatar, Button, Card, Dialog, Divider, IconButton, List, Menu, Paragraph, Portal, Provider, Snackbar, Switch } from 'react-native-paper';
import AppSelect from '@/app/components/form/controls/select';
import { APP } from '@/app/utils/app';
import { AppMenu, AppMenuItem } from '@/app/common/components/Menu';
import { TechnicalAnalysisService } from '@/app/services/technical_analysis';
import { TechnicalAnalysisMenuItem } from './technical_analysis_menu_item'; 
import { DATASOURCE, DATA_TYPE } from '../enums';
import Carousel from 'react-native-reanimated-carousel'; 
import { AppIconButton } from '@/app/components/shared/AppIconButton';
import AcaciaWater from './acacia_water';
import SLMHelp from './slm_help';
import MapLegend from './map_legend';
import AnalysisDetails from './analysis_details';


const SUSTAINABLE_LAND_MANAGEMENT = 'slm';
const SELECTED_VECTOR_LAYER_NAME = 'Selected Vector'

/**
 * Component that renders the map and all its layers
 * @param props 
 */
const AppMap = class AppMap extends React.Component<IMapProps> {
    constructor(props: IMapProps) {
        super(props);
    } 
    width = Dimensions.get('window').width;
    map_ref = createRef<MapView>();
    // layer_refs = [];
    state = {
        markers: new Array<IMarkerProps>(),
        region: {} as Region, 
        geojson: [], // array of IGeoJsonProps,
        image_overlays: [], //array pf IImageOVerlayProps
        selected_feature: null, //currently selected feature
        selected_admin: null, //currently selected admin
        admins: null, //flattened list of admins
        settings_visible: true, //is settings menu visible
        technical_analyses: [], //list of published technical analyses
        opacities: [], //list of layer opacities
        selected_analyses: [], //list of analysis selected by the user
        raster_tiles: [], //list of raster tiles
        notify: false,
        notify_message: '',
        layer_refs: {}, //layers on the map,
        selected_point: {'lat': 0, 'lon': 0},
        slm_enabled: true, // Is sustainable land management analysis enabled?
        map_help_visible: false, //is SLMHelp popup to be shown
        slm_snack_bar_visible: false, //Is SLM_SnackBar visible
        active_analysis_visible: false, //Show details of the current analysis
        active_analysis: null, //current analysis
    };

    /**
     * Get layers
     */
    get layers() {
        return this.state.layers;
    }

    /**
     * Listener for change of region
     * @param region 
     */
    on_region_change = (region: Region) => { 
    }

    /**
     * Focus to specific region
     */
    focus_region = (region: Region, zoom?: number) => {
        // map_ref.current?.animateToRegion(region, 3000); 
        this.map_ref.current?.animateCamera({ center: region, zoom: zoom || 5 }, { duration: 3000 });
    }

    /**
     * Add markers to map
     * @param markers 
     */
    add_markers = (markers: Array<IMarkerProps>) => {
        this.setState({ markers });       
    }

    /**
     * Display markers on the map
     * @returns 
     */
    _display_markers = ()=> {
        return this.state.markers?.map((item, idx) => {
            return (
                <MapMarker
                    key={idx}
                    {...item} 
                />
            )
        });
    }

    /**
     * Add GEOJson Layer
     * @param name 
     * @param geojson 
     */
    add_geojson = (name: string, geojson/*: IGeoJsonProps*/) => { 
        const index = this.state.geojson.findIndex((itm) => itm.name === name);// Object.keys(state.geojson).includes(name);
        const new_state = [...this.state.geojson];
        if(index !== -1){
            const ref = new_state[index].ref
            new_state[index] = { name, geojson, ref };
        }
        else {
            const ref = createRef<typeof ImageOverlay>();
            new_state.push({ name, geojson, ref });
        }
        this.setState({ geojson: new_state });
    }

    /**
     * Add Image layer
     * @param name 
     * @param overlay 
     */
    add_image_overlay = (name: string, overlay: IImageOverlayProps) =>  {        
        const index = this.state.image_overlays.findIndex((itm) => itm.name === name);
        const new_state = [...this.state.image_overlays];
        if(index !== -1){
            const ref = new_state[index].ref
            new_state[index] = { name, overlay, ref };
        }
        else {
            const ref = createRef<typeof ImageOverlay>();
            new_state.push({ name, overlay, ref });
        }
        this.setState({ image_overlays: new_state });
    }

    /**
     * Add raster tile layer
     * @param url 
     * @param layer 
     * Sample object  
     *  "tiles": {
                "url": "http://192.168.101.6:8600/geoserver/participatory/wms",
                "layer": "participatory:kenya_land_cover20240325135240583027"
            }
     */
    add_tile_layer = (name: string, url: string, layer: string) => {
        const index = this.state.raster_tiles.findIndex((itm) => itm.name === name);
        const new_state = [...this.state.raster_tiles];
        if(index !== -1){
            const ref = new_state[index].ref
            new_state[index] = { name, url, layer, ref };
        }
        else {
            const ref = createRef<typeof ImageOverlay>();
            new_state.push({ name, url, layer, ref });
        }
        this.setState({ raster_tiles: new_state });
    }

    /**
     * Select a feauture
     * @param id 
     * @param level 
     * @param layer 
     * @returns 
     */
    select_feature = async (id: string, level: number, layer: object) => {
        this.setState({ selected_feature: null });

        let feature = this.get_feature(id, layer) 
        if(!feature){
          //try add the feature first
          const admin = await VectorService.get_admin(id, level);
          const bounds = admin.bounds;      
          this.fit_bounds(MAPUTIL.bounds_to_coordinates(bounds));
          let admin_geom = JSON.parse(admin.geom);
          // some geojson come with FeatureCollection and Features properties while others do not.
          // so check if `features` property exists
          // use `SELECTED_VECTOR_LAYER_NAME` as the layer name so that we only have a single vector showing on the map
          if ('features' in admin_geom){
            let added_layer = this.add_feature(admin_geom['features'][0], SELECTED_VECTOR_LAYER_NAME /*admin.name*/);
          } else {
            let added_layer = this.add_feature({ 'geometry': admin_geom }, SELECTED_VECTOR_LAYER_NAME /*admin.name*/ );
          }
          //   feature = this.get_feature(id, added_layer);
        }
        if(feature){ 
          this.setState({ select_feature: feature})
           /*feature.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                opacity: 1,
                fillOpacity: 0,// 0.7
            })
           */
        }
        return feature
      }
    
    /**
     * add feature
     * @param geojson_feature 
     * @param layer_id 
     * @returns 
    */
    add_feature = (geojson_feature: object, layer_name: string) => {
        // if(geojson_layer){
        //     //If there is a current layer, remove
        //     this.map_ref.current.removeLayer(geojson_layer)
        //     geojson_layer = null
        // }
        const clone = Object.assign({}, geojson_feature);
        const geom = geojson_feature.geometry;
        const geojson = {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {},
                    "geometry": geojson_feature['geometry']
                }
            ]
        }
        return this.add_geojson(layer_name, geojson);// geom)
        // delete clone.geometry
        // var feature = {
        //     "type": "Feature",
        //     "properties": clone,
        //     "geometry": geom
        // };
        // return add_geojson_layer(feature, layer_name, false) 
    }

    /**
     * Get JSON feature
     * state.geojson has array of {name: geojson}
     */
    get_feature = (id: string, feature: object) => {      
        let res = feature;
        if(!feature && id){
            for (var key of Object.keys(this.state.geojson)) {
                let geojson = this.state.geojson[key];

                //or(var g)
            }

            for(var i=0; i < Object.keys(this.state.geojson).length; i++){
                let obj_id = Object.keys(this.state.geojson)[i]
                let geojson = Object.values(obj_id)[i];
                let el = Object.values(this.state.geojson)[i] 
                if(el.feature !== undefined && el.feature.properties.name == id){
                    res = el 
                    break
                }
            } 
        } 
        return res;
    } 
    
    fit_bounds = (coordinates) => {  
        if(coordinates){
            this.map_ref?.current?.fitToCoordinates(coordinates, { animated: true });
        }
    }
   
    /**
     * Get all published analyses
     */
    get_analyses_from_db = async () => {
        TechnicalAnalysisService.get_analyses().then(recs => {  
            this.setState({ technical_analyses: recs });
            const opac = {};
            const actives = {};
            recs.map((el, idx) => {
                opac[el.name] = 0.5;
                actives[el.name] = false;
            })

            // Add sustainable land management
            opac[SUSTAINABLE_LAND_MANAGEMENT] = 0.5;
            actives[SUSTAINABLE_LAND_MANAGEMENT] = false;

            this.setState({ opacities: opac });
        })
    }

    /**
     * Toggle inclusion of analysis
     * @param analysis_id 
     * @param checked 
     */
    toggle_analysis = async(analysis: object, checked: boolean) => { 
        //enforce selection of admin even for vector based analysis since technical analysis data is loaded county by county
        if(/*analysis?.datasource_type == DATASOURCE.RASTER  &&*/ !this.state.selected_admin){  
            APP.alert_error(APP._('MAP_PAGE.MESSAGES.NO_SELECTED_ADMIN'));
            return;
        } 
        const exists = this.is_analysis_selected(analysis.name); 
        let next_state = [...this.state.selected_analyses];
        if(exists){
            next_state = next_state?.filter(el => el.name != analysis.name);
        } else {
            //create ref before adding to array
            let datasource_type = null;
            //this ref will be used when rendering map components. If you create them in the render function of Map.tsx, React will go into an infinite loop
            const ref = datasource_type == DATASOURCE.RASTER ? createRef<typeof WMSTileLayer>() : (datasource_type == DATASOURCE.VECTOR ? createRef<typeof GeoJsonLayer>() : createRef());
            analysis['ref'] = ref;
            analysis['results'] = {} // Results will be modified when analysis is completed. See WMSTileLayer
            next_state.push(analysis);
        } 
        this.setState((prev_state) => { 
            return { selected_analyses: next_state };
        });
    }   

    /**
     * Change map opacity
     * @param analysis 
     * @param val 
     */
    change_map_opacity = (analysis: object, val: number) => {
        const ref = analysis.ref;
        if(ref) {
            //Call change_opacity of respective mapping component
            ref.current.change_opacity(val);
        }
    }

    /**
     * Add analysis
     * @param analysis_name 
     * @param vector_id 
     * @param admin_level 
     */
    add_analysis = (analysis_name: string, vector_id: string, admin_level: number) => { 
        APP.toggle_loading(true);
        const analysis = TechnicalAnalysisService.get_analysis(analysis_name).then((doc) => {
        //   remove_analysis(doc.analysis_name); 
          
          TechnicalAnalysisService.get_computation(doc.name, vector_id, admin_level).then((res) => {
            // Check if it is vector or raster
            if(doc.datasource_type == DATASOURCE.VECTOR){
              /*let legend_items = make_legend(doc);      
              // The style_field is the analysis_name as the computation adds a new property analysi_name
              set_datasource(analysis_name, res.result, null, doc.analysis_name, DATA_TYPE.GEOJSON, analysis_name, legend_items)
              .then(res => {          
                add_legend_v2(doc.analysis_name, legend_items, doc.analysis_name);
                APP.toggle_loading(false);
              })
              */    
              this.add_geojson(analysis_name, res.result); 
              APP.toggle_loading(false); 
            }
            if(doc.datasource_type == DATASOURCE.RASTER){
              // The style_field is the analysis_name as the computation adds a new property analysi_name
              /*let url = APP.get_full_backend_url(res.result['rasterfile']);
              let layer_name = doc.analysis_name;
              if(ENABLE_TILES){
                url = res.result['tiles']['url'];
                layer_name = res.result['tiles']['layer'];
              }
              
              set_datasource(
                      analysis_name, 
                      null, 
                      url, 
                      doc.analysis_name, 
                      DATA_TYPE.RASTER, 
                      analysis_name, 
                      legend_items,
                      layer_name)
              .then(res => {          
                add_legend_v2(doc.analysis_name, legend_items, doc.analysis_name);
                APP.toggle_loading(false);
              })*/
            }
            // if(analysis_doc.datasource_type == DATASOURCE.TABULAR){
  
            // }   
          });     
          
          /*
          if(doc.datasource_type == DATASOURCE.VECTOR){
              let legend_items = make_legend(doc);      
              // The style_field is the analysis_name as the computation adds a new property analysi_name
              set_datasource(JSON.parse(doc.geom), null, doc.analysis_name, DATA_TYPE.GEOJSON, analysis_name, legend_items)
              .then(res => {          
                add_legend_v2(doc.analysis_name, legend_items, doc.analysis_name);
              })          
            }   
            if(analysis_doc.datasource_type == DATASOURCE.RASTER){
              
            }
            // if(analysis_doc.datasource_type == DATASOURCE.TABULAR){
  
            // }   
            */
        });  
      }

    /**
     * Get analysis from the list of published analyses
     * @param label 
     * @returns 
     */
    get_analysis = (name: string) => {
        let res = this.state.technical_analyses?.filter(el => el.name == name);
        return res?.length > 0 ? res[0] : null;
    }

    /**
     * Get analysis from the list of selected analyses
     * @param label 
     * @returns 
     */
    is_analysis_selected = (name: string) => {
        let res = this.state.selected_analyses?.filter(el => el.name == name);
        return res?.length > 0 ? res[0] : null;
    }

    /**
     * Does analysis exist on the map
     * @param name 
     * @returns 
     */
    analysis_exists = (name: string) => {
        let res = this.get_analysis(name);
        return res != null
    }

    /**
     * Take snapshot and share
     */
    take_snapshot_and_share = async () => {
        const snapshot = await this.map_ref?.current?.takeSnapshot({ width: 300, height: 300, result: 'base64' });
        //console.log(snapshot);
        const uri = FileSystem.documentDirectory + "snapshot.png";
        await FileSystem.writeAsStringAsync(uri, snapshot, { encoding: FileSystem.EncodingType.Base64 });
        await shareAsync(uri)
    }

    // /**
    //  * Set reference for map layer
    //  * @param ref_id 
    //  * @param ref_obj 
    //  */
    _set_layer_ref = (ref_id: string, ref_obj: React.RefObject<React.FunctionComponent>) => {
        const next_state = {...this.state.layer_refs};
        // const exists = Object.keys(next_state).includes(ref_id);
        next_state[ref_id] = ref_obj;
        this.setState({ layer_refs: next_state });
    }

    update_analysis_results = (analysis_name: string, results: {}) => { 
        let index = this.state.selected_analyses?.findIndex(el=>el.name == analysis_name);
        if(index != -1){
            let next_state = this.state.selected_analyses;
            next_state[index]['results'] = results;
            this.setState({ selected_analyses: next_state });
        }
    }

    componentDidMount(): void {  
        VectorService.get_admin_tree(false).then((res) => {  
            this.setState({ admins: res });            
            this.get_analyses_from_db().then(() => {});
            this.fit_bounds(MAPUTIL.bounds_to_coordinates(this.props.initial_bounds));
        });
    } 
  
    openMenu = () => this.setState({ settings_visible: true });  
    closeMenu = () => this.setState({ settings_visible: false });

    render() {
        return (
        //   <Provider>
            <View>
                <Card>
                    <Card.Actions style={{ }}>
                        <View style={styles.toolbar}>
                            <View style={styles.search_container}>
                                <AppSelect
                                    style={{ flex: 2 }}
                                    options={this.state.admins}
                                    label_field='admin_name'
                                    value_field='name'
                                    searchable
                                    placeholder={APP._('MAP_PAGE.SEARCH_REGION')}
                                    on_change_value={(admin) => {  
                                            this.setState({ selected_admin: admin }, ()=> {
                                                // select_admin(this.state.selected_admin);  
                                                if(admin){
                                                    this.select_feature(admin.name, admin.level, null);
                                                }
                                            });
                                        } 
                                    }
                                />

                            </View> 
                            <View style={[styles.toolbar_container, {flex: 1}]}> 
                                <View style={styles.options_container}>
                                    <Switch value={this.state.slm_enabled} onValueChange={()=> this.setState({ slm_enabled: !this.state.slm_enabled, slm_snack_bar_visible: true })} /> 

                                    <AppIconButton disabled={false} size={18} tooltip="help" icon="help" mode='contained-tonal' on_press={()=>{
                                        this.setState({ map_help_visible: true })
                                    }} />  
                                    
                                    <AppMenu 
                                        visible={true}
                                        disabled={this.state.slm_enabled}
                                        anchor_icon='cog'
                                        anchor_label=''
                                        anchor_size={18}
                                        // anchor_label={APP._('MAP_PAGE.OPTIONS')}
                                    >
                                        {
                                            this.state.technical_analyses?.map((analysis, idx) => {
                                                return <TechnicalAnalysisMenuItem key={idx} title={analysis.name} 
                                                            on_checkbox_value_change={(checked)=>{ 
                                                                this.toggle_analysis(analysis, checked);                                        
                                                                }
                                                            }
                                                            on_slider_value_change={(val: number) => { 
                                                                this.change_map_opacity(analysis, val);
                                                            }}
                                                    />
                                            })
                                        } 
                                    </AppMenu>    
                                </View>
                            </View>   
                        </View>
                    </Card.Actions>
                    {/* <Card.Content > */}
                </Card>
                <MapView
                    style={styles.map}
                    // style={{ flex: 1}}
                    initialRegion={this.props.initial_region}
                    region={this.state.region}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={this.props.show_user_location}
                    showsMyLocationButton={this.props.show_my_location_button}
                    onRegionChangeComplete={this.on_region_change}
                    zoomEnabled
                    zoomControlEnabled
                    zoomTapEnabled
                    ref={this.map_ref} 
                    onPress={(e) => {  
                        const coords = e.nativeEvent.coordinate;  
                        this.setState({ selected_point: { 'lat': coords.latitude, 'lon': coords.longitude }});                    
                    }}
                    // onPoiClick={(e) => {
                    //     console.log("on Point Of Interest...", e); // <------ add this 
                    // }}
                >       
                    {
                        /*Markers */
                        this._display_markers()
                    }   
                    {
                        /**selected analysis */
                        this.state?.selected_analyses?.map((analysis, idx) => {
                            const ref = analysis.ref;// createRef<typeof GeoJsonLayer>();
                            if(analysis.datasource_type == DATASOURCE.RASTER){ 
                                //this._set_layer_ref(analysis.name, ref);
                                return <WMSTileLayer 
                                            key={idx} 
                                            analysis_name={analysis.name} 
                                            admin_id={this.state.selected_admin.name} 
                                            admin_level={this.state.selected_admin.level} 
                                            parent_state_updater={this.update_analysis_results}
                                            ref={ref} />
                            } else if (analysis.datasource_type == DATASOURCE.VECTOR) {
                                //this._set_layer_ref(analysis.name, ref);
                                // this.add_analysis(analysis.name, this.state.selected_admin.name, this.state.selected_admin.level);
                                return null;
                                // return <GeoJsonLayer 
                                //             key={idx} 
                                //             geojson={null}
                                //             analysis_name={analysis.name} 
                                //             admin_id={this.state.selected_admin?.name} 
                                //             admin_level={this.state.selected_admin?.level} 
                                //             ref={ref}
                                //         />
                            }
                            // return <View></View>
                            // return <GeoJsonLayer key={idx} geojson={layer.geojson} properties={{}} ref2={layer.ref} />
                        })        
                    }             
                    {
                        /* Geojson */
                        this.state.geojson?.map((layer, idx) => {
                            // const ref_id = `geojson_${layer.name}`;
                            // const ref = createRef<typeof GeoJsonLayer>();
                            // //this._set_layer_ref(ref_id, ref);
                            return <GeoJsonLayer key={idx} geojson={layer.geojson} properties={{}} ref2={layer.ref} />
                        })            
                    }
                    {
                        /* Iamge overlays */
                        // this.state.image_overlays?.map((layer, idx) => { 
                        //     // const ref_id = `img_${layer.name}`;
                        //     // const ref = createRef<typeof ImageOverlay>();
                        //     // //this._set_layer_ref(ref_id, ref);

                        //     return <ImageOverlay key={idx} overlay={layer.overlay} ref2={layer.ref} />
                        // })            
                    }
                    {
                        /*  Raster tiled layers */
                    //    this.state.raster_tiles?.map((entry, idx) => { 
                    //        return <WMSTileLayer key={idx} url={entry.url} layer={entry.layer} ref2={layer.ref} />
                    //    })         
                    }
                    {
                        this.state.slm_enabled === true && 
                        this.state.selected_point && 
                        <MapMarker title="" location={{ 
                                latitude: this.state.selected_point?.lat,
                                longitude: this.state.selected_point?.lon
                            }} 
                            />
                    }
                </MapView>   
                {
                    this.state.slm_enabled === true && 
                        <Text style={styles.coordinates}>{this.state.selected_point?.lat} , {this.state.selected_point?.lon}</Text>
                }
                {  
                    this.state.slm_enabled === true && <AcaciaWater point={this.state.selected_point} /> 
                }
                {
                    this.state.slm_enabled === false && this.state.selected_analyses && 
                    <View style={{ flex: 1 }}>
                        <Carousel
                            loop={false}
                            width={this.width}
                            style={styles.legend}
                            // height={100}
                            // height={width / 2}
                            autoPlay={false}
                            //data={[...new Array(6).keys()]}
                            data={[...this.state?.selected_analyses]}
                            scrollAnimationDuration={1000}
                            onSnapToItem={(index) => { console.log('current index:', index);}}
                            renderItem={({item, index, animationValue}) => { 
                               return (
                                <View
                                    style={{
                                        flex: 1,
                                        borderWidth: 1,
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Card>
                                        <Card.Title 
                                            title={item.analysis_name}
                                            left={(props) => <Avatar.Icon {...props} icon="map-legend" />}
                                            right={(props) => <IconButton {...props} icon="dots-vertical" onPress={() => { 
                                                    this.setState({ active_analysis_visible: true, active_analysis: item}) 
                                                }
                                            } />}
                                            />
                                        <Card.Content>
                                            <MapLegend items={item.results?.result?.legend } />
                                             {/* <Paragraph style={styles.legend_content}>
                                                {item.description} 
                                            </Paragraph>   */}
                                        </Card.Content>
                                    </Card>                                   
                                </View>
                              )}
                            }
                        />
                    </View>
                }
                {
                    this.state.map_help_visible === true && 
                    <Portal>
                        <Dialog 
                            visible={this.state.map_help_visible} 
                            onDismiss={() => { 
                                    this.setState({ map_help_visible: false });
                                  }
                                }
                        >
                            {/* <Dialog.Title style={styles.dialog_title}>{props.item?.category}</Dialog.Title> */}
                            <Dialog.Content> 
                               <SLMHelp />
                            </Dialog.Content>
                        </Dialog>
                    </Portal> 
                }
                {
                    <Portal>
                        <Snackbar
                            visible={this.state.slm_snack_bar_visible}
                            onDismiss={()=>this.setState({slm_snack_bar_visible: false})}
                            duration={2000} 
                            // action={{
                            // label: 'Undo',
                            // onPress: () => {
                            //     // Do something
                            // },
                            // }}
                        >
                           {this.state.slm_enabled ? APP._('MAP_PAGE.MESSAGES.SLM_ENABLED') : APP._('MAP_PAGE.MESSAGES.SLM_DISABLED')}
                        </Snackbar>
                    </Portal>
                }
                {
                    this.state.active_analysis && this.state.active_analysis_visible &&
                    <Portal>
                        <Dialog visible={this.state.active_analysis_visible} onDismiss={()=> this.setState({ active_analysis_visible: false })}>
                            <AnalysisDetails analysis={this.state.active_analysis} />
                        </Dialog>
                    </Portal>
                    
                }
                {/* {
                    this.state.selected_admin && 
                    <Card>
                        <Card.Content>
                            <List.Item
                                title={this.state.selected_admin.name}
                                description={this.state.selected_admin.level}
                                left={props => <List.Icon {...props} icon="bike" />}
                                right={props => <View>
                                    <AppButton label={APP._('BUTTON.OK')} on_press={() => { 
                                    }}/> 
                                </View>} 
                            >
                            </List.Item>
                        </Card.Content>
                    </Card>
                }   */}

                {/* <MapView
                                style={styles.map}
                                // style={{ flex: 1}}
                                initialRegion={this.props.initial_region}
                                region={this.state.region}
                                provider={PROVIDER_GOOGLE}
                                showsUserLocation={this.props.show_user_location}
                                showsMyLocationButton={this.props.show_my_location_button}
                                onRegionChangeComplete={this.on_region_change}
                                zoomEnabled
                                zoomControlEnabled
                                zoomTapEnabled
                                ref={this.map_ref}
                           />               */}
            </View>
        //   </Provider>
        )
    } 
}

export default AppMap;

const styles = StyleSheet.create({
    map: {
        flex: 1,
        minHeight: 400, 
        //display: 'none'
    },
    legend: {
        height: 250
    },
    legend_content: {
        textAlign: 'justify'
    },
    toolbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row',
        flex: 1, 
    },
    toolbar_container: {
        margin: 3, 
        flex: 1
        // borderWidth: 1,
        // borderColor: 'gray' 
    },
    search_container: {
        flexBasis: '60%',
        margin: 3
    },
    options_container: {
        display: 'flex', 
        alignContent: 'space-between', 
        flexDirection: 'row'
    },
    coordinates: {
        marginLeft: 10,
        fontStyle: 'italic'
    }
})