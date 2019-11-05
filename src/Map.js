// @flow
//
import React from 'react';
import GoogleMapReact from 'google-map-react';
import SHOPS from './SHOPS.json';
import {MAP_STYLE} from './Const';
import {GMAPS_API_KEY} from './KEYS';

window.SHOPS = SHOPS;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const getLatLngFromAddr = (geocoder, addr) =>
  new Promise((resolve, reject) => {
    geocoder.geocode({address: `${addr}, Oakland, CA`}, (res, status) => {
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
    category: 'type',
  };

  render() {
    const sidebar =
      this.state.focusShop != null ? (
        <div className="col col-12 row-12">
          <div
            className="close-button clickable"
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
          <div className="row col-12 j-between">
            <div
              className="clickable"
              onClick={() => this.setState({category: 'type'})}
            >
              TYPE
            </div>
            <div
              className="clickable"
              onClick={() => this.setState({category: 'neighborhood'})}
            >
              NEIGHBORHOOD
            </div>
          </div>
          <br />
          <div className="rowc row-12 col-12">
            {this.state.category === 'type' ? (
              <>
                <div className="col colc-6">
                  <h4>DINE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(
                      shop =>
                        shop[
                          'Category (where you want your business listed)'
                        ] === 'DINE',
                    )
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                        shop[
                          'Category (where you want your business listed)'
                        ] === 'DRINK',
                    )
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                        shop[
                          'Category (where you want your business listed)'
                        ] === 'SHOP',
                    )
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                        shop[
                          'Category (where you want your business listed)'
                        ] === 'THRIVE (lifestyle+Wellness+Other)',
                    )
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
              </>
            ) : (
              <>
                <div className="col colc-6">
                  <h4>DIAMOND</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop['Neigborhood'] === 'Diamond')
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>DIAMOND/LAUREL</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(
                      shop => shop['Neigborhood'] === 'Diamond/Laurel',
                    )
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>DOWNTOWN</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop['Neigborhood'] === 'Downtown')
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>FRUITVALE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop['Neigborhood'] === 'Fruitvale')
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>GRAND LAKE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop['Neigborhood'] === 'Grand Lake')
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>JACK LONDON</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop['Neigborhood'] === 'Jack London')
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>MONTCLAIR</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop['Neigborhood'] === 'Montclair')
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>OLD OAKLAND</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop['Neigborhood'] === 'Old Oakland')
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>PIEDMONT AVE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(
                      shop => shop['Neigborhood'] === 'Piedmont Ave',
                    )
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>ROCKRIDGE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop['Neigborhood'] === 'Rockridge')
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>TEMESCAL</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(
                      shop =>
                        shop['Neigborhood'] === 'Temescal' ||
                        shop['Neigborhood'] === 'Temescale',
                    )
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
                  <h4>UPTOWN</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop['Neigborhood'] === 'Uptown')
                      .filter(
                        shop =>
                          shop['Business Name']
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()) ||
                          shop['Address']
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
              </>
            )}
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
              key: GMAPS_API_KEY,
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

export default Map;
