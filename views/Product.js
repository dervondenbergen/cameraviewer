import React, { Component } from 'react';
import {
  Text,
  View,
  Dimensions,
  Button,
} from 'react-native';

import styled from 'styled-components/native';
import Carousel from 'react-native-looped-carousel';
import SafariView from 'react-native-safari-view';

// get width of device, to show carousel / image in full width
const { width } = Dimensions.get('window');

// styles
let StyledView = styled.View`
  margin-top: 84;
  background-color: white;
  flex: 1;
  flex-direction: column;
`;

let ProductImage = styled.Image`
  height: 200;
  width: ${width - 30};
  margin-left: 15;
  resize-mode: contain;
`;

let ProductInfo = styled.View`
  margin-left: 20;
  margin-right: 20;
`;

  let Name = styled.Text`
    font-size: 20;
    font-weight: bold;
  `;

  let Specs = styled.View`
    margin: 10;
  `;

  let Spec = styled.Text`
  `;
  
  let Price = styled.Text`
    color: limegreen;
    margin-bottom: 20;
  `;

// carousel only supports styles as objects, not as styled-components
let carouselStyle = {
  Carousel: {
    width: width,
    height: 250,
  },
  bulletsContainerStyle: {
    height: 20,
    margin: 0,
  },
  bulletStyle: {
    backgroundColor: 'rgba(0, 0, 0, .32)',
    borderWidth: 0,
    height: 7,
    width: 7,
    margin: 8,
  },
  chosenBulletStyle: {
    backgroundColor: 'rgba(0, 0, 0, 1)',
    height: 7,
    width: 7,
    margin: 8,
  },
}

class Product extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      path: props.path,
    };
  }

  componentDidMount() {
    this.fetchData();
    // alert('Product mount')
  }
  
  componentWillUnmount() {
    // alert('Product unmount')
  }

  fetchData() {
    let REQUEST_URL = this.props.API + this.state.path;
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        
        this.setState({
          product: responseData.product,
          loaded: true,
          dataType: 'Product',
        })
          
      })
      .catch((error) => {
        console.error(error);
      });
  }
  
  viewInformation(url) {
    // show native iOS Safari using https://github.com/naoufal/react-native-safari-view
    SafariView.show({
      url: url,
    })
  }
  
  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    
    let product = this.state.product;
    
    let specs = product.specs.split('|')
    
    return (
      <StyledView>
        { (product.images.length > 1) ?
          <Carousel
            style={ carouselStyle.Carousel }
            autoplay={false}
            bullets={true}
            bulletsContainerStyle={ carouselStyle.bulletsContainerStyle }
            bulletStyle={ carouselStyle.bulletStyle }
            chosenBulletStyle={ carouselStyle.chosenBulletStyle }
          >
            {product.images.map((image, index) =>
              <ProductImage
                key={index}
                source={{uri: image}}
                />
            )}
          </Carousel>
          :
          <ProductImage
            style={{marginBottom: 20}}
            source={{uri: product.images[0]}}
            />
        }
        <ProductInfo>
          <Name selectable={true}>{product.name}</Name>
          <Specs>
            {specs.map((spec, index) =>
              <Spec key={index} >• { spec.trim() }</Spec>
            )}
          </Specs>
          <Price>{product.price}</Price>
          <Button
            title="Show More Information"
            onPress={function(){this.viewInformation(product.url)}.bind(this)} />
        </ProductInfo>
      </StyledView>
    )
  }
  
  // not used in this case
  pathChange(toAdd) {
    this.props.navigator.push({
      type: 'Brand',
      path: this.state.path + "/" + toAdd
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

export default Product;
