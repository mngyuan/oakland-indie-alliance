// @flow
//
import React from 'react';
import GoogleMapReact from 'google-map-react';
import SHOPS from './SHOPS.json';

const MAP_STYLE = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#212121',
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
        color: '#757575',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#212121',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
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
        color: '#181818',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#1b1b1b',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#2c2c2c',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#8a8a8a',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [
      {
        color: '#373737',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#3c3c3c',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry',
    stylers: [
      {
        color: '#4e4e4e',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#3d3d3d',
      },
    ],
  },
];

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getLatLngFromAddr = (geocoder, addr) =>
  new Promise((resolve, reject) => {
    geocoder.geocode({address: addr}, (res, status) => {
      if (status === 'OK') {
        resolve(res[0].geometry.location);
      } else {
        reject(status);
      }
    });
  });

const updateShops = async maps => {
  const geocoder = new maps.Geocoder();
  for (const shop of SHOPS) {
    try {
      const res = await getLatLngFromAddr(geocoder, shop.Address);
      await sleep(1000);
      shop.lat = res.lat();
      shop.lng = res.lng();
    } catch (error) {
      console.log(error);
    }
  }
  console.log(JSON.stringify(SHOPS));
};

const Marker = ({$hover, shop, onClick, active}) => (
  <div
    className={`map-marker ${$hover || active ? 'active' : ''}`}
    onClick={() => onClick(shop)}
  />
);

class Map extends React.PureComponent {
  defaultCenter = {
    lat: 37.802375,
    lng: -122.276008,
  };
  defaultZoom = 13;

  state = {
    focusShop: null,
    searchFilter: '',
  };

  render() {
    const sidebar =
      this.state.focusShop != null ? (
        <div className="col col-12 row-12">
          <div
            className="close-button"
            onClick={() => this.setState({focusShop: null})}
          >
            x
          </div>
          <h2>
            {this.state.focusShop['Business Name']}
            <small className="neighborhood">
              {this.state.focusShop['Neigborhood']}
            </small>
          </h2>
          <br />
          <i>
            {
              this.state.focusShop[
                'Category (where you want your business listed)'
              ]
            }
          </i>
          <br />
          <small>{this.state.focusShop['Address']}</small>
          <small>
            <a
              className="hover-swipe link-out"
              href={
                this.state.focusShop['Website'].includes('http')
                  ? this.state.focusShop['Website']
                  : `http://${this.state.focusShop['Website']}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.state.focusShop['Website']}
            </a>
          </small>
        </div>
      ) : (
        <div className="col col-12 row-12">
          <input
            type="text"
            onChange={e => this.setState({searchFilter: e.target.value})}
            value={this.state.searchFilter}
            className="search-filter"
            placeholder="SEARCH ANYTHING"
          />
          <br />
          <div className="rowc row-12 col-12">
            <div className="col colc-6">
              <h4>DINE</h4>
              <br />
              <ul className="shop-list">
                {SHOPS.filter(
                  shop =>
                    shop['Category (where you want your business listed)'] ===
                    'DINE',
                )
                  .filter(shop =>
                    shop['Business Name']
                      .toLowerCase()
                      .includes(this.state.searchFilter.toLowerCase()),
                  )
                  .map(shop => (
                    <li>
                      <a
                        className="hover-swipe"
                        onClick={() => this.setState({focusShop: shop})}
                      >
                        {shop['Business Name']}
                      </a>
                    </li>
                  ))}
              </ul>
              <br />
              <h4>DRINK</h4>
              <br />
              <ul className="shop-list">
                {SHOPS.filter(
                  shop =>
                    shop['Category (where you want your business listed)'] ===
                    'DRINK',
                )
                  .filter(shop =>
                    shop['Business Name']
                      .toLowerCase()
                      .includes(this.state.searchFilter.toLowerCase()),
                  )
                  .map(shop => (
                    <li>
                      <a
                        className="hover-swipe"
                        onClick={() => this.setState({focusShop: shop})}
                      >
                        {shop['Business Name']}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="col colc-6">
              <h4>SHOP</h4>
              <br />
              <ul className="shop-list">
                {SHOPS.filter(
                  shop =>
                    shop['Category (where you want your business listed)'] ===
                    'SHOP',
                )
                  .filter(shop =>
                    shop['Business Name']
                      .toLowerCase()
                      .includes(this.state.searchFilter.toLowerCase()),
                  )
                  .map(shop => (
                    <li>
                      <a
                        className="hover-swipe"
                        onClick={() => this.setState({focusShop: shop})}
                      >
                        {shop['Business Name']}
                      </a>
                    </li>
                  ))}
              </ul>
              <br />
              <h4>THRIVE</h4>
              <br />
              <ul className="shop-list">
                {SHOPS.filter(
                  shop =>
                    shop['Category (where you want your business listed)'] ===
                    'THRIVE (lifestyle+Wellness+Other)',
                )
                  .filter(shop =>
                    shop['Business Name']
                      .toLowerCase()
                      .includes(this.state.searchFilter.toLowerCase()),
                  )
                  .map(shop => (
                    <li>
                      <a
                        className="hover-swipe"
                        onClick={() => this.setState({focusShop: shop})}
                      >
                        {shop['Business Name']}
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      );

    const mapProps =
      this.state.focusShop != null
        ? {
            center: {
              lat: this.state.focusShop.lat,
              lng: this.state.focusShop.lng,
            },
            zoom: 19,
          }
        : {};
    return (
      <section className="row a-center j-center full black-bg">
        <div className="rowc col-4 row-12 padding-24 o-scroll">{sidebar}</div>
        <div className="col col-8 row-12">
          <GoogleMapReact
            bootstrapURLKeys={{
              key: '	AIzaSyC3UZzjQjemSy8oeoeevKsVYVB-YmJIkr8',
            }}
            defaultCenter={this.defaultCenter}
            defaultZoom={this.defaultZoom}
            yesIWantToUseGoogleMapApiInternals
            options={{
              styles: MAP_STYLE,
            }}
            onGoogleApiLoaded={({maps}) => {
              // updateShops();
            }}
            hoverDistance={20}
            {...mapProps}
          >
            {SHOPS.map(shop => (
              <Marker
                lat={shop.lat}
                lng={shop.lng}
                shop={shop}
                onClick={() => this.setState({focusShop: shop})}
                active={
                  this.state.focusShop &&
                  shop['Business Name'] ===
                    this.state.focusShop['Business Name']
                }
              />
            ))}
          </GoogleMapReact>
        </div>
      </section>
    );
  }
}

class App extends React.PureComponent {
  componentDidMount() {
    const nameplates = ['Oakland', 'indie', 'local', 'real'];
    const keepItNameplate = document.getElementById('keep-it-oakland');
    let i = 0;
    setInterval(() => {
      keepItNameplate.innerText = nameplates[i];
      i = (i + 1) % nameplates.length;
    }, 1000);
  }

  render() {
    return (
      <>
        <section className="col full keep-it">
          <div className="col col-9 margin-h-col-2">
            <span>
              <span className="keep-it-text">Keep it</span>
              <br />
              <span className="keep-it-text" id="keep-it-oakland">
                Oakland
              </span>
            </span>
            <br />
            <p>
              The Keep It Oakland movement to inspire residents, visitors, and
              anyone who enjoys our beloved Town to patronize and preserve what
              makes Oakland so special: the flavor, color, and creativity of its
              independent businesses.
            </p>
            <br />
            <p>
              When you shop, dine and experience local businesses, rock the
              locally designed and produced Keep It Oakland merchandise or share
              your love for the movement on social media, you are making a
              powerful statement and demonstrating your commitment to the
              independent businesses that define Oakland’s culture, community,
              and local economy.
            </p>
          </div>
        </section>
        <Map />
        <section className="row a-center j-center full">
          <div
            id="collection-component-6e8fc3e1e2d"
            className="shopify-container"
          ></div>
        </section>
        <section className="row a-center j-center full">test</section>
      </>
    );
  }
}

export default App;
