import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import LiveCases from './LiveCases';
import Map from './Map';
import { sortData } from './util';
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from './util';

// import LineGraph from './LineGraph';

function App() {
  // const countriesURL="https://disease.sh/v3/covid-19/countries";
  const [countries, setCountries]=useState([]);
  const [country, setCountry]=useState("worldwide");
  const [countryInfo, setCountryInfo]=useState({});
  const [tableData, setTableData]=useState([]);
  const [mapCenter, setMapCenter]=useState({lat:8.982430, lng:38.760080});
  const [mapZoom, setMapZoom]=useState(3);
  const [mapCountries, setMapCountries]=useState([]);
  const [casesType, setCasesType]=useState("cases");

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    });
  }, [])

  useEffect(() => {
    const getCountriesData=async () => {
    await  fetch("https://disease.sh/v3/covid-19/countries")
      .then((response=>response.json()))
      .then((data)=>{
        const countries=data.map((country)=>(
          {
            countryName:country.country,
            countryCode:country.countryInfo.iso2
          }
        ));

        const sortedData=sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
    });

  };
  getCountriesData();

  }, []);

  const onCountryChange= async (event)=>{
    const countryCode=event.target.value;
    setCountry(countryCode);

    const url=country==='worldwide' ? 'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
      setMapCenter({ lat:data.countryInfo.lat, lng:data.countryInfo.long });
        setMapZoom(4);
    });
  };

  return (
    <div className="App">
      <div className='app__left'>
          <div className='app__header'>
          <h1>Covid-19 Tracker App</h1>
          <FormControl className="app_dropdown">
            <Select
            variant='outlined'
            value={country}
            onChange={onCountryChange}
            >
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map(country=>
              <MenuItem key={country.id} value={country.countryCode}>{country.countryName}</MenuItem>)
            }
            </Select>
          </FormControl>
        </div>

        <div className='app_stats'>
          <InfoBox
          onClick={e=>setCasesType('cases')}
           title="New cases"
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={prettyPrintStat(countryInfo.cases)}
            />
          <InfoBox 
          onClick={e=>setCasesType('recovered')}
          title="Recovered" 
          cases={prettyPrintStat(countryInfo.todayRecovered)} 
          />

          <InfoBox 
          onClick={e=>setCasesType('deaths')}
          title="Deaths" 
          cases={prettyPrintStat(countryInfo.todayDeaths)} 
          total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

            

        <Map 
        casesType={casesType}
        countries={mapCountries} 
        center={mapCenter} 
        zoom={mapZoom}/>   
      </div>

      <Card className='app_right'>
            <CardContent>
              <h3>Live Cases by Country</h3>
                <LiveCases countries={tableData} />
              <h3>Worldwide new cases</h3>
              {/* <LineGraph />Pai */}
            </CardContent>
      </Card>
    </div>
  );
}

export default App;
