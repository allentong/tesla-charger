import React, { Component } from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    const opts = {
      method: "GET"
    };
    const self = this;
    fetch("https://supercharge.info/service/supercharge/allSites", opts)
      .then(res => res.json())
      .then(res => {
        self.points = res
          .filter(loc => loc.address.state === "CA")
          .map(loc =>
            self.createFeature([loc.gps.longitude, loc.gps.latitude])
          );
      });
  }
  createFeature(coordinates) {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates
      }
    };
  }
  mapLoaded(map) {
    const self = this;
    map.addLayer({
      id: "points",
      type: "symbol",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: this.points
        }
      },
      layout: {
        "icon-image": "harbor-15"
      }
    });
  }
  componentDidMount() {
    window.navigator.geolocation.getCurrentPosition(pos => {
      mapboxgl.accessToken =
        "pk.eyJ1Ijoic2xlZXB5eGl2byIsImEiOiJjamFxYXJnaWUwb3lhMnhwaHQ0NmE2NGF0In0.Zvg5mJxAN3KxuJgmaMUw6Q";

      const map = new mapboxgl.Map({
        container: "mapbox",
        center: [pos.coords.longitude, pos.coords.latitude],
        zoom: 13,
        style: "mapbox://styles/mapbox/streets-v9"
      });
      setTimeout(() => {
        this.mapLoaded(map);
      }, 2000);
    });
  }
  render() {
    return (
      <div className="App">
        <div id="mapbox" />
      </div>
    );
  }
}

export default App;
