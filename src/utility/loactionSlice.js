import {  createAsyncThunk, createSlice } from "@reduxjs/toolkit";
export const locationThunk=createAsyncThunk("locationThunk",async(_, { getState })=>{

     const state = getState()

    // 👉 cache check
    if (state.location.data) {
      return state.location.data   // 🔥 already data है → API skip
    }
    
    console.log("hello");
    
const coords =await new Promise((resolve,rejected)=>{
    navigator.geolocation.getCurrentPosition((position)=>{
       resolve({
         lat:position.coords.latitude,
        lon:position.coords.longitude
       })
    },(error)=>rejected(error))
})

const res=await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lon}&format=json`)
let data=await res.json()
coords.location=data.display_name
return coords
})

export const sliceLocationReducer=createSlice({
    name:"location",
    initialState:{
        loading:false,
        data:null,
        error:false
    },
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(locationThunk.pending,(state)=>{
         state.loading=true
        })
        .addCase(locationThunk.fulfilled,(state,action)=>{
            state.loading=false,
            state.data=action.payload
        })
        .addCase(locationThunk.rejected,(state,action)=>{
         state.loading=false,
         state.error=action.error.message
        })
    }

 })

 export default sliceLocationReducer.reducer