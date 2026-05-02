import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"

export const weatherThunk = createAsyncThunk(
  "weatherThunk",
  async ({ city, lat, lon }, { rejectWithValue }) => {

    const apiKey = import.meta.env.VITE_API_KEY

    try {
      let url = ""

      if (city) {
        url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
      } 
      else if (lat && lon) {
        url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}`
      } 
      else {
        return rejectWithValue("Invalid input")
      }

      const res = await fetch(url)
      const data = await res.json()

      if (data.error) {
        return rejectWithValue(data.error.message)
      }

      return data

    } catch (err) {
      return rejectWithValue("Network error")
    }
  }
)

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    loading: false,
    data: null,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(weatherThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(weatherThunk.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(weatherThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Something went wrong"
      })
  }
})

export default weatherSlice.reducer