import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

export default class Details extends Component {
  render() {
    const { distance, duration } = this.props;
    function toInt(n){
      return Math.round(Number(n));
    };
    return(
      <View style={styles.container}>
        <View style={styles.bubble}>
          <View>
            <Text style={styles.distance}>Distance : {toInt(distance)} km</Text>
            <Text style={styles.duration}>Duration : {toInt(duration)} mins</Text>
          </View>
        </View>
        <View style={styles.arrowBorder} />
        <View style={styles.arrow} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignSelf: 'flex-start',
  },
  // Callout bubble
  bubble: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 150,
  },
  // Arrow below the bubble
  arrow: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#fff',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -32,
  },
  arrowBorder: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderTopColor: '#007a87',
    borderWidth: 16,
    alignSelf: 'center',
    marginTop: -0.5,
  },
  // distance
  distance: {
    fontSize: 16,
    marginBottom: 5,
  },
  // duration
  duration: {
    fontSize: 16,
    marginBottom: 5,
  },
  //  image
  image: {
    width: 120,
    height: 80,
  },
});