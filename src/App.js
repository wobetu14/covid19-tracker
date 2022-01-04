import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useState, useEffect } from 'react';
import './App.css';
import InfoBox from './InfoBox';
import LiveCases from './LiveCases';
import Map from './Map';

function App() {
  const countriesURL="https://disease.sh/v3/covid-19/countries";
  const [countries, setCountries]=useState([]);
  const [country, setCountry]=useState("worldwide");
  const [countryInfo, setCountryInfo]=useState({});
  const [tableData, setTableData]=useState([]);

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
    });
  }, [])

  useEffect(() => {
    // const timeInterval=setInterval(() => {
      fetch("https://disease.sh/v3/covid-19/countries")
      .then((response=>response.json()))
      .then((data)=>{
        const countries=data.map((country)=>(
          {
            countryName:country.country,
            countryCode:country.countryInfo.iso2
          }
        ));
        setTableData(data);
        setCountries(countries);
      });

      // const myCounter=counter+1;
      // setCounter(myCounter);

    // }, 10000); // updated every 10 mins
    // return () => clearInterval(timeInterval);
  }, []);

  const onCountryChange= async (event)=>{
    const countryCode=event.target.value;
    setCountry(countryCode);

    const url=country==='worldwide' ? 'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data);
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
          <InfoBox title="New cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
        </div>

        <Map />   
      </div>

      <Card className='app_right'>
            <CardContent>
              <h3>Live Cases by Country</h3>
                <LiveCases countries={tableData} />
              <h3>Worldwide new cases</h3>
            </CardContent>
      </Card>





    </div>
  );
}

export default App;
