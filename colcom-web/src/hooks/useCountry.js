import { useContext } from 'react';
import { CountryContext } from '../context/CountryContext.jsx';

export const useCountry = () => useContext(CountryContext);
