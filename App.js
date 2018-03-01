import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import MainActivity from './src/MainActivity'

export default class App extends Component{
  render() {
    return (
      <MainActivity />
    );
  }
}
