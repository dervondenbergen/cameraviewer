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

let StyledProduct = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 10;
`;

let Thumbnail = styled.Image`
  width: 80;
  height: 80;
  resize-mode: contain;
`;

let Container = styled.View`
  flex: 1;
`;

let Name = styled.Text`
  font-size: 17;
  margin: 0 10;
`;

let Product = (props) => {
  let product = props.data;
  return (
    <StyledProduct onPress={function(){props.pathChange(props.id, product.name)}.bind(this)}>
      <Thumbnail source={{uri: product.image}} />
      <Container>
        <Name>{product.name} {product.id}</Name>
      </Container>
    </StyledProduct>
  )
}

class AllProducts extends Component {
  
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
    // alert('AllProducts mount')
  }
  
  componentWillUnmount() {
    // alert('AllProducts unmount')
  }

  fetchData() {
    let REQUEST_URL = this.props.API + this.state.path;
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows( responseData['products'] ),
          loaded: true,
          dataType: 'products'
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
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData, sectionID, rowID) => <Product data={rowData} id={rowID} pathChange={this.pathChange.bind(this)} />}
        />
      </StyledView>
    )

  }
  
  pathChange(toAdd, name) {
    this.props.navigator.push({
      type: 'Product',
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

export default AllProducts;
