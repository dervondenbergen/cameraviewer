import React, { Component } from 'react';
import {
  Text,
  View,
  ListView,
} from 'react-native';

import styled from 'styled-components/native';

// styles
let StyledView = styled.View`
  margin-top: 64;
  background: white;
  flex: 1;
`;

let StyledType = styled.TouchableOpacity`
  margin: 20;
  margin-bottom: 0;
  height: 120;
  width: 100;
  align-items: center;
  justify-content: center;
  border: 2 solid grey;
  border-radius: 10;
`;

let Icon = styled.Image`
  height: 70;
  width: 70;
  resize-mode: contain;
  margin-bottom: 5;
`;

let List = styled.ListView`
  flex-direction: row;
  flex-wrap: wrap;
`;

let ProductType = (props) => {
  let name = props.data;
  return (
    <StyledType onPress={function(){props.pathChange(name.name, name.name)}}>
      <Icon source={{uri: `https://4.img-dpreview.com/resources/images/category-index-intro-image-${name.name}-light.png?v=3921`}} />
      <Text>{name.count} {name.name}</Text>
    </StyledType>
  )
}

class Brand extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
      path: props.path,
    };
  }

  componentDidMount() {
    this.fetchData();
    // alert('Brand mount')
  }
  
  componentWillUnmount() {
    // alert('Brand unmount')
  }

  fetchData() {
    let REQUEST_URL = this.props.API + this.state.path;
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows( responseData['productTypes'] ),
          loaded: true,
          dataType: 'productTypes'
        });
          
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    
    return (
      <StyledView>
        <List
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <ProductType data={rowData} pathChange={this.pathChange.bind(this)} />}
        />
      </StyledView>
    )

  }
  
  pathChange(toAdd, name) {
    this.props.navigator.push({
      type: 'AllProducts',
      path: this.state.path + "/" + toAdd,
      name: name,
    })
  }
  
  goBack() {
    this.props.navigator.pop()
  }
  
  renderLoadingView() {
    return (
      <View>
        <Text>
          Loading {this.state.dataType}
        </Text>
      </View>
    );
  }
  
}

export default Brand;
