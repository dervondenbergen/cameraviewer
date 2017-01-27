/**
 * CameraViewer
 * https://github.com/dervondenbergen/cameraviewer
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  ListView,
  StyleSheet,
  Navigator,
} from 'react-native';

import styled from 'styled-components/native'

// differen Views
import AllBrands from './views/AllBrands'
import Brand from './views/Brand'
import AllProducts from './views/AllProducts'
import Product from './views/Product'

// API url kann gleiche bleiben oder eigene cameraviewer-api instanz (siehe README.md#api)
const API = 'https://cameraviewerapi.herokuapp.com'

// return Type of data based on length of path
const getDataType = (path) => {
  const dataTypes = [
    'AllBrands',
    'Brand',
    'AllProducts',
    'Product',
  ]
  return dataTypes[ path.split('/').length - 2 ]
}

// styles
let HeaderStyle = StyleSheet.create({
  HeaderStyle: {
  	height: 64,
    backgroundColor: '#efefef'
  }
}).HeaderStyle

let HeaderTitle = styled.Text`
  font-size: 17;
  font-weight: 600;
  height: 44;
  width: 170;
  text-align: center;
`;

let HeaderBackButton = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  padding: 11 8;
`;

let Chevron = styled.Image`
  height: 22;
  width: 14;
`;

let HeaderBackText = styled.Text`
  font-size: 17;
  color: #007AFF;
  margin-left: 5;
`;

var NavigationBarRouteMapper = {
  LeftButton(route, navigator, index, navState) {
    if(index > 0) {
      let backText =  navigator.getCurrentRoutes()[ index - 1 ].name;
      return (
        <HeaderBackButton
          onPress={() => { if (index > 0) { navigator.pop() } }} >
          <Chevron source={require('./img/chevron.png')} />
          <HeaderBackText>{ backText }</HeaderBackText>
        </HeaderBackButton>
      )
    }
    else { return null }
  },
  RightButton(route, navigator, index, navState) {
  },
  Title(route, navigator, index, navState) {
    let title = navigator.getCurrentRoutes()[ index ].name;
    return <HeaderTitle adjustsFontSizeToFit={true}>{ title }</HeaderTitle>
  }
};

class cameraviewer extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      path: '/brands'
    }
  }

  componentDidMount() {
    this.setState({
      dataType: getDataType(this.state.path),
    })
  }
  
  render() {
    return (
      <Navigator
        initialRoute={{ type: 'AllBrands', path: '/brands', name: 'CameraList' }}
        renderScene={ this.renderScene }
        navigationBar={
          <Navigator.NavigationBar
            style={HeaderStyle}
            routeMapper={ NavigationBarRouteMapper } />
        } />
    )
  }
  
  renderScene(route, navigator) {
    if (route.type == 'AllBrands') {
      return (
        <AllBrands
          navigator={navigator}
          path={route.path}
          API={API} />
      );
    }
    if (route.type == 'Brand') {
      return (
        <Brand
          navigator={navigator}
          path={route.path}
          API={API} />
      );
    }
    if (route.type == 'AllProducts') {
      return (
        <AllProducts
          navigator={navigator}
          path={route.path}
          API={API} />
      );
    }
    if (route.type == 'Product') {
      return (
        <Product
          navigator={navigator}
          path={route.path}
          API={API} />
      )
    }
  }
  
  /*
  
  goBack={this.goBack.bind(this)}
  pathChange={this.pathChange.bind(this)}
  path={this.state.path}
  
  */
  
  pathChange(path) {
    this.setState({
      path: path,
      dataType: getDataType(path),
    })
  }
  
  goBack() {
    let newPath = this.state.path.split('/')
    newPath.pop()
    newPath = newPath.join('/')
    this.pathChange(newPath)
  }
  
}

AppRegistry.registerComponent('cameraviewer', () => cameraviewer);
