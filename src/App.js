import './App.css';
import React, { useState, useEffect, createRef } from 'react';

import { CssBaseline, Grid } from '@material-ui/core'

import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

import { getPlacesData } from './api'

function App() {
  
  const [places, setPlaces] = useState([])
  const [coordinates, setCoordinates] = useState({})
  const [bounds, setBounds] = useState({})
  // const [childClicked, setChildClicked] = useState('')

  const [isLoading, setIsLoading] = useState(false)
  const [elRefs, setElRefs] = useState([])
  const [attractionType, setAttractionType] = useState('restaurants')
  const [rating, setRating] = useState('')
  const [filteredPlaces, setFilteredPlaces] = useState([])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: {latitude, longitude}}) => setCoordinates({ lat: latitude, lng: longitude}))
  }, [])
  

  useEffect(() => {
    // console.log(coordinates, bounds)
    if (bounds.sw && bounds.ne) {
      setIsLoading(true)
      getPlacesData(bounds.sw, bounds.ne, attractionType)
        .then(data => {
          //  console.log("App: useEffect(): data ", data)
          setPlaces(data?.filter(place => place.name && place.num_reviews > 0))
          setIsLoading(false)
          setFilteredPlaces([])
        })
    }

  }, [bounds, attractionType])

  // console.log("App: refs: ", elRefs)

  useEffect(() => {
    const refs = Array(places?.length).fill().map((_, i) => elRefs[i] || createRef())
    setElRefs(refs)
  }, [places])

  useEffect(() => {
    if(Number(rating) == 0) {
      setFilteredPlaces([])
      return
    }
    setFilteredPlaces(places.filter(place => Number(place.rating) > Number(rating)))
  }, [rating])
  
  
  return (
    <>
      <CssBaseline />
      <Header setCoordinates={setCoordinates} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places }
            // childClicked={childClicked}
            isLoading={isLoading}
            refs={elRefs}
            setAttractionType={setAttractionType}
            rating={rating}
            setRating={setRating}
            />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map 
              setCoordinates={setCoordinates}
              setBounds={setBounds}
              coordinates={coordinates}
              places={filteredPlaces.length ? filteredPlaces : places }
              // setChildClicked={setChildClicked}
              refs={elRefs}
              />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
