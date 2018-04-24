import React, { PropTypes } from 'react';
import GoogleMapReact from 'google-map-react';

class MapSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (<section>
      <div className="wrapper map">
        <div style={{ height: '100%' }}>
          <GoogleMapReact
            defaultCenter={{ lat: 37.784326, lng: -122.406359 }}
            defaultZoom={17}
            options={{
              draggable: false,
              fullscreenControl: false,
              scrollwheel: false,
              styles: [
                {
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#f5f5f5',
                    },
                  ],
                },
                {
                  elementType: 'labels.icon',
                  stylers: [
                    {
                      visibility: 'off',
                    },
                  ],
                },
                {
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#616161',
                    },
                  ],
                },
                {
                  elementType: 'labels.text.stroke',
                  stylers: [
                    {
                      color: '#f5f5f5',
                    },
                  ],
                },
                {
                  featureType: 'administrative.land_parcel',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#bdbdbd',
                    },
                  ],
                },
                {
                  featureType: 'poi',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#eeeeee',
                    },
                  ],
                },
                {
                  featureType: 'poi',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#757575',
                    },
                  ],
                },
                {
                  featureType: 'poi.park',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#e5e5e5',
                    },
                  ],
                },
                {
                  featureType: 'poi.park',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#9e9e9e',
                    },
                  ],
                },
                {
                  featureType: 'road',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#ffffff',
                    },
                  ],
                },
                {
                  featureType: 'road.arterial',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#757575',
                    },
                  ],
                },
                {
                  featureType: 'road.highway',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#dadada',
                    },
                  ],
                },
                {
                  featureType: 'road.highway',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#616161',
                    },
                  ],
                },
                {
                  featureType: 'road.local',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#9e9e9e',
                    },
                  ],
                },
                {
                  featureType: 'transit.line',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#e5e5e5',
                    },
                  ],
                },
                {
                  featureType: 'transit.station',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#eeeeee',
                    },
                  ],
                },
                {
                  featureType: 'water',
                  elementType: 'geometry',
                  stylers: [
                    {
                      color: '#c9c9c9',
                    },
                  ],
                },
                {
                  featureType: 'water',
                  elementType: 'labels.text.fill',
                  stylers: [
                    {
                      color: '#9e9e9e',
                    },
                  ],
                },
              ],
            }}
          >
            {/* <AnyReactComponent
              lat={37.784326}
              lng={-122.406359}
              text=""
              imageId="if_map-marker_322462_1_ipmwnh"
            /> */}
          </GoogleMapReact>
        </div>
      </div>
    </section>);
  }
}

MapSection.propTypes = {
};

MapSection.defaultProps = {
};

// Wrap the component to inject dispatch and state into it
export default MapSection;
