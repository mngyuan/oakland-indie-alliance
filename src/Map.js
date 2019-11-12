// @flow
//
import React from 'react';
import GoogleMapReact from 'google-map-react';
import SHOPS from './SHOPS.json';
import {MAP_STYLE} from './Const';
import {GMAPS_API_KEY} from './KEYS';

const NAME = 'OIA MEMBERSHIP BUSINESS NAME';
const CATEGORY = 'WEBSITE CATEGORY';
const NEIGHBORHOOD = 'NEIGHBORHOOD';
const ADDRESS = 'Address';
const WEBSITE = 'Website';

function deleteEmptyProps(obj) {
  var propNames = Object.getOwnPropertyNames(obj);
  for (var i = 0; i < propNames.length; i++) {
    var propName = propNames[i];
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      obj[propName] === ''
    ) {
      delete obj[propName];
    }
  }
  return obj;
}

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
  console.log(JSON.stringify(SHOPS.map(deleteEmptyProps)));
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
    const focusOverlay =
      this.state.focusShop != null ? (
        <div className="col col-12 row-12 p-absolute focus-overlay padding-thick-left">
          <div
            className="close-button clickable"
            onClick={() => this.setState({focusShop: null})}
          >
            x
          </div>
          <h2>
            {this.state.focusShop[NAME]}
            <small className="neighborhood">
              {this.state.focusShop[NEIGHBORHOOD]}
            </small>
          </h2>
          <br />
          <i>{this.state.focusShop[CATEGORY]}</i>
          <br />
          <small>{this.state.focusShop[ADDRESS]}</small>
          <small>
            <a
              className="hover-swipe link-out"
              href={
                this.state.focusShop[WEBSITE].includes('http')
                  ? this.state.focusShop[WEBSITE]
                  : `http://${this.state.focusShop[WEBSITE]}`
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              {this.state.focusShop[WEBSITE]}
            </a>
          </small>
        </div>
      ) : null;
    const sidebar = (
      <>
        {focusOverlay}
        <div className="col col-12 row-12 p-relative o-scroll padding-thick-left">
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
              className="switcher clickable"
              onClick={() => this.setState({category: 'type'})}
            >
              TYPE
            </div>
            <div
              className="switcher clickable"
              onClick={() => this.setState({category: 'neighborhood'})}
            >
              NEIGHBORHOOD
            </div>
          </div>
          <br />
          <div className="rowc-desktop row-12 col-12">
            {this.state.category === 'type' ? (
              <>
                <div className="col colc-6">
                  <h4>DINE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[CATEGORY] === 'DINE')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li key={shop[NAME]}>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>DRINK</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[CATEGORY] === 'DRINK')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="col colc-6">
                  <h4>SHOP</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[CATEGORY] === 'SHOP')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>THRIVE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[CATEGORY] === 'THRIVE')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              </>
            ) : (
              <>
                <div className="col colc-6">
                  <h4>DIMOND/LAUREL</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(
                      shop => shop[NEIGHBORHOOD] === 'Dimond/Laurel',
                    )
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>CHINATOWN</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[NEIGHBORHOOD] === 'China Town')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>DOWNTOWN</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[NEIGHBORHOOD] === 'Downtown')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>FRUITVALE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[NEIGHBORHOOD] === 'Fruitvale')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>GRAND LAKE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[NEIGHBORHOOD] === 'Grand Lake')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>JACK LONDON</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(
                      shop =>
                        shop[NEIGHBORHOOD] === 'Jack London' ||
                        shop[NEIGHBORHOOD] === 'Jack London Square',
                    )
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="col colc-6">
                  <h4>MONTCLAIR</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[NEIGHBORHOOD] === 'Montclair')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>OLD OAKLAND</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[NEIGHBORHOOD] === 'Old Oakland')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>PIEDMONT AVE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(
                      shop =>
                        shop[NEIGHBORHOOD] === 'Piedmont Ave' ||
                        shop[NEIGHBORHOOD] === 'Piedmont',
                    )
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>ROCKRIDGE</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[NEIGHBORHOOD] === 'Rockridge')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
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
                        shop[NEIGHBORHOOD] === 'Temescal' ||
                        shop[NEIGHBORHOOD] === 'Temescale',
                    )
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                  <br />
                  <h4>UPTOWN</h4>
                  <br />
                  <ul className="shop-list">
                    {SHOPS.filter(shop => shop[NEIGHBORHOOD] === 'Uptown')
                      .filter(
                        shop =>
                          shop[NAME].toLowerCase().includes(
                            this.state.searchFilter.toLowerCase(),
                          ) ||
                          (shop[ADDRESS] || '')
                            .toLowerCase()
                            .includes(this.state.searchFilter.toLowerCase()),
                      )
                      .map(shop => (
                        <li>
                          <a
                            className="hover-swipe"
                            onClick={() => this.setState({focusShop: shop})}
                          >
                            {shop[NAME]}
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </>
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
      <section className="rowc a-center j-center full black-bg">
        <div className="rowc col-4 row-12 p-relative">{sidebar}</div>
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
              window.maps = maps;
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
                  shop[NAME] === this.state.focusShop[NAME]
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
