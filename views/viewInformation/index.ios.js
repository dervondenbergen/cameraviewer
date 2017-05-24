import React, { Component } from 'react';
import {} from 'react-native';

import SafariView from 'react-native-safari-view';

function viewInformation (url) {
  // show native iOS Safari using https://github.com/naoufal/react-native-safari-view
  SafariView.show({
    url: url,
  })
}

export default viewInformation
