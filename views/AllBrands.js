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

let StyledBrand = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 0 10;
`;

let Thumbnail = styled.Image`
  width: 60;
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


let Brand = (props) => {
  let brand = props.data;
  // get logo based on url, see https://clearbit.com/logo
  let url = 'https://logo.clearbit.com/' + brand.url;
  return (
    <StyledBrand onPress={function(){props.pathChange(brand.name, brand.name)}.bind(this)}>
      <Thumbnail source={{uri: url}} />
      <Container>
        <Name>{brand.name}</Name>
      </Container>
    </StyledBrand>
  )
}

class AllBrands extends Component {
  
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
    // alert('AllBrands mount')
  }
  
  componentWillUnmount() {
    // alert('AllBrands unmount')
  }

  fetchData() {
    let REQUEST_URL = this.props.API + this.state.path;
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows( responseData['brands'] ),
          loaded: true,
          dataType: 'brands'
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
          renderRow={(rowData) => <Brand data={rowData} pathChange={this.pathChange.bind(this)} />}
        />
      </StyledView>
    )

  }
  
  pathChange(toAdd, name) {
    this.props.navigator.push({
      type: 'Brand',
      path: this.state.path + "/" + toAdd,
      name: name,
    })
  }
  
  // not used in this case as "AllBrands" is start View
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

export default AllBrands;
