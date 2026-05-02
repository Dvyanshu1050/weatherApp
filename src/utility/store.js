import { configureStore } from "@reduxjs/toolkit";
import  LocationReducer  from "./loactionSlice";
import WeatherReducer from './weatherSlice'

const store=configureStore({
reducer:{
location:LocationReducer,
weather:WeatherReducer
}
})

export default store