import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Input,
  Button,
  Footer,
  FooterTab,
  StyleProvider
} from 'native-base';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import MapViewDirections from 'react-native-maps-directions';
import getTheme from './../native-base-theme/components';
import material from './../native-base-theme/variables/material';
import Details from './Details';

const { width, height } = Dimensions.get('window');
const ratio = width / height;
const API_KEY = 'AIzaSyDFWvsFHI2OHt9nBFAwuZ0dfwcVlamWvpI'
const LATITUDE = 17.38;
const LONGITUDE = 78.55;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ratio;

export default class MainActivity extends Component{
  constructor(props) {
    super(props);
    this.state = {
      coords: [],
      source: '',
      destination: '',
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      markerPosition: {
        latitude: LATITUDE, 
        longitude: LONGITUDE,
      },
      startPosition: {
        latitude: 3.148561, 
        longitude: 101.652778
      },
      stopPosition: {
        latitude: 3.149771,
        longitude: 101.655449
      },
      disTimeVal: {
        distance: 0,
        duration: 0,
      },
      markers: [{
        title: 'source',
        coordinates: {
          latitude: 3.148561, 
          longitude: 101.652778
        },
      },
      {
        title: 'destination',
        coordinates: {
          latitude: 3.149771,
          longitude: 101.655449
        },
      }]
    }
  }

  watchID: ?number = null

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var lat = parseFloat(position.coords.latitude)
        var long = parseFloat(position.coords.longitude)
        var initialRegion = {
          latitude: lat,
          longitude: long,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        this.setState({ region: initialRegion })
        this.setState({ markerPosition: intialRegion })
      },
      (error) => console.log(error.message),
      { 
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 2000 
      },
    );
    this.watchID = navigator.geolocation.watchPosition(
      position => {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }
        });
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  async getDirections(startLoc, destinationLoc) {
    try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }`)
        let respJson = await resp.json();
        let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        });
        if(respJson.routes.length){
          const route = respJson.routes[0];
          let newdisTimeVal = {
            distance: route.legs.reduce((carry, curr) => {
              return carry + curr.distance.value;
            }, 0) / 1000,
            duration: route.legs.reduce((carry, curr) => {
              return carry + curr.duration.value;
            }, 0) / 60
          }
          this.setState({disTimeVal: newdisTimeVal})
        }
        this.setState({coords: coords})
        this.setState({startPosition: this.state.coords[0]})
        this.setState({stopPosition: this.state.coords[this.state.coords.length - 1]})
        let newRegion = {
          latitude: this.state.coords[0].latitude,
          longitude: this.state.coords[0].longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
        }
        this.setState({region: newRegion})
        return coords
    } catch(error) {
        alert(error)
        return error
    }
  }

  direction = () => {
    let source = this.state.source;
    let destination = this.state.destination;
    this.getDirections(source, destination)
  }

  render() {
    return (
        <Container style={styles.container}>
        <StatusBar barStyle="light-content" />
          <Content>
            <View style={styles.headerView}>
              <Input style={styles.inputs} 
                placeholder="From.." 
                placeholderTextColor='white' 
                autoCorrect={false} 
                returnKeyType='next' 
                onChangeText={(source) => { this.setState({source}); }}
                onSubmitEditing={() => this.origin.focus()} />
              <Input style={styles.inputs} 
                placeholder="To.." 
                placeholderTextColor='white' 
                autoCorrect={false} 
                returnKeyType='go' 
                onChangeText={(destination) => { this.setState({destination}); }}
                ref={(input) => this.origin = input} />
            </View>
            <View style={{ flex: 1, alignItems: 'stretch' }}>
                <MapView 
                rotateEnabled={true}
                showsUserLocation={true}
                maxZoomLevel={20}
                region={ this.state.region }
                style={styles.map}>

                <MapView.Marker
                coordinate={ this.state.markerPosition }
                title={'My place'}
                description={'I am here now'}
                />
		
		            <MapView.Marker
                coordinate={ this.state.startPosition }
                title={'Start'}
                description={'From here'}            
                pinColor={'#009688'}
                />
            
                <MapView.Marker
                  coordinate={ this.state.stopPosition }
                  title={'End'}
                  description={'Trip ends here'}
                  calloutOffset={{ x: -8, y: 28 }}
                  calloutAnchor={{ x: 0.5, y: 0.4 }}
                >
                <Details tooltip style={styles.customView} 
                  distance = {this.state.disTimeVal.distance}
                  duration = {this.state.disTimeVal.duration}
                  >              
                </Details>  
                </MapView.Marker>     
          

                <MapView.Polyline 
                coordinates={this.state.coords}
                strokeWidth={2}
    strokeColor="red"/>       
                  
                </MapView>
            </View>
            <View>

            </View>
          </Content>
          <Footer>
            <FooterTab style={{ backgroundColor: '#009688' }}>
              <Button transparent onPress={this.direction}><Text style={styles.footerTabs}>Driving</Text></Button>
              <Button transparent><Text style={styles.footerTabs}>Bike</Text></Button>
              <Button transparent><Text style={styles.footerTabs}>Walk</Text></Button>
              <Button transparent><Text style={styles.footerTabs}>Transit</Text></Button>
            </FooterTab>
          </Footer>
        </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-start',
  },
  headerView: {
    backgroundColor: '#009688',
    flexDirection: 'column',
    padding: 15,
  },
  map: {
    height: height,
    alignItems: 'stretch',
  },
  footerTabs: {
    color: 'white',
  },
  inputs: {
    height: 40,
        marginBottom: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        color: '#fff',
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    customView: {
      width: 140,
      height: 100,
  },
});
