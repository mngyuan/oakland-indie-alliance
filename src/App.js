// @flow
//
import React from 'react';
import Map from './Map';

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
          <div className="row row-12">
            <div className="col colc-6">
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
                anyone who enjoys our beloved Town to patronize and preserve
                what makes Oakland so special: the flavor, color, and creativity
                of its independent businesses.
              </p>
              <br />
              <p>
                When you shop, dine and experience local businesses, rock the
                locally designed and produced Keep It Oakland merchandise or
                share your love for the movement on social media, you are making
                a powerful statement and demonstrating your commitment to the
                independent businesses that define Oakland’s culture, community,
                and local economy.
              </p>
            </div>
            <div className="col colc-6">test</div>
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
