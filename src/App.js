// @flow
//
import React, {useState, useEffect} from 'react';
import Map from './Map';
import {TransitionGroup, CSSTransition} from 'react-transition-group';

const importAll = r => r.keys().map(r);
const PHOTOS = importAll(
  require.context('./static/photos', false, /\.(png|jpe?g|svg)$/i),
);

const RotatingBackgroundImage = ({imgs, className}) => {
  const [curImage, setCurImage] = useState(1);
  const imgElems = imgs.map((src, i) => (
    <img className="img-cover" src={src} key={i} />
  ));

  useEffect(() => {
    const interval = setInterval(
      () => setCurImage((curImage + 1) % imgs.length),
      5000,
    );
    return function cleanup() {
      clearInterval(interval);
    };
  });

  return (
    <TransitionGroup className={`${className} full-cover-bg`}>
      <CSSTransition
        key={curImage}
        timeout={{enter: 300, exit: 300}}
        classNames="fade"
      >
        <img className="img-cover" src={imgs[curImage]} />
      </CSSTransition>
    </TransitionGroup>
  );
};

class App extends React.PureComponent {
  componentDidMount() {
    const nameplates = ['indie', 'local', 'real', 'creative', 'colorful'];
    const keepItNameplate = document.getElementById('keep-it-rotate');
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
          <div className="rowc row-12">
            <div className="landing-left col j-center padding-thick">
              <span>
                <span className="keep-it-text">Keep it</span>
                <br />
                <span className="keep-it-text" id="keep-it-rotate">
                  Indie
                </span>
                <br />
                <span className="keep-it-text">Keep it</span>
                <br />
                <span className="keep-it-text">Oakland</span>
              </span>
              <br />
              <p className="subtitle">
                Keep It Oakland is a lifestyle, a movement, and a celebration
                launched and championed by local independent businesses who have
                deep roots in our beloved Town.
              </p>
              <p className="subtitle">
                When you SHOP, DINE, DRINK & THRIVE at indie businesses, you
                support and help shape the community we love #KEEPITOAKLAND.
              </p>
            </div>
            <RotatingBackgroundImage className="landing-right" imgs={PHOTOS} />
          </div>
        </section>
        <Map />
        <section className="col full shopify-container-wrapper">
          <h2 className="section-header">SHOP KEEP IT OAKLAND</h2>
          <div
            id="collection-component-6e8fc3e1e2d"
            className="row-12 col-12 shopify-container"
          ></div>
        </section>
        <h2 className="section-header">SHARE YOUR TOWN LOVE</h2>
      </>
    );
  }
}

export default App;
