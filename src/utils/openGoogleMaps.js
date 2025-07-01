import {
  Platform,
  Linking,
} from 'react-native';

const openGoogleMaps = ({ lat, lng }, address) => {
  const location = encodeURIComponent(address);

  const url = Platform.select({
    ios: `maps:0,0?q=${location}`,
    android: `geo:0,0?q=${location}`
  });
  
  Linking.canOpenURL(url)
    .then(supported => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        const browserUrl = `https://www.google.com/maps/search/?api=1&query=${location}`;
        return Linking.openURL(browserUrl);
      }
    })
    .catch(err => console.error('Error al abrir Google Maps:', err));
};

export default openGoogleMaps