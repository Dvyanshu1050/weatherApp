import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { weatherThunk } from "./utility/weatherSlice";
import { locationThunk } from "./utility/loactionSlice";

const App = () => {
  const dispatch = useDispatch();
  const location = useSelector((state) => state.location.data);
  const { data: weather, loading, error } = useSelector((state) => state.weather);
  const [city, setCity] = useState("");

  useEffect(() => {
    dispatch(locationThunk());
  }, [dispatch]);

  useEffect(() => {
    if (location?.lat && location?.lon) {
      dispatch(weatherThunk({ lat: location.lat, lon: location.lon }));
    }
  }, [location, dispatch]);

  const handleSearch = () => {
    if (!city.trim()) return;
    dispatch(weatherThunk({ city }));
  };

  const condition = weather?.current?.condition?.text?.toLowerCase() || "";
  const isNight = weather?.current?.is_day === 0;

  // --- Animation Helpers ---
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center overflow-hidden font-sans transition-colors duration-1000 
      ${isNight ? "bg-[#0f172a] text-slate-100" : "bg-[#38bdf8] text-white"}`}>
      
      {/* 🌌 DYNAMIC BACKGROUND OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none">
        {condition.includes("rain") && <RainEffect />}
        {condition.includes("snow") && <SnowEffect />}
        {condition.includes("cloud") && <CloudEffect />}
        
        {/* Decorative Orbs */}
        <div className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[120px] opacity-50 
          ${isNight ? "bg-purple-900" : "bg-yellow-200"}`} />
        <div className={`absolute -bottom-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-30 
          ${isNight ? "bg-blue-900" : "bg-pink-300"}`} />
      </div>

      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 p-6 md:p-12"
      >
        {/* 🌍 LEFT: HERO SECTION */}
        <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-6">
          <motion.div variants={itemVariants}>
            <p className="text-lg font-medium tracking-widest uppercase opacity-70">
              {weather?.location?.region || "Current Location"}
            </p>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
              {weather?.location?.name || "Detecting..." }
            </h2>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <span className="text-[100px] md:text-[160px] font-black leading-none drop-shadow-2xl">
              {weather?.current?.temp_c ?? "--"}°
            </span>
            <div className="text-6xl md:text-8xl">
              <img 
                src={weather?.current?.condition?.icon} 
                alt="weather-icon" 
                className="w-24 h-24 md:w-32 md:h-32 drop-shadow-lg animate-bounce-slow"
              />
            </div>
          </motion.div>

          <motion.p variants={itemVariants} className="text-2xl md:text-3xl font-light opacity-90">
            {weather?.current?.condition?.text}
          </motion.p>
        </div>

        {/* 🎯 RIGHT: INTERACTIVE CARD */}
        <motion.div 
          variants={itemVariants}
          className="glass-card overflow-hidden"
        >
          {/* 🔍 SEARCH BAR */}
          <div className="relative group mb-8">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search another city..."
              className="w-full bg-white/10 border border-white/20 backdrop-blur-md p-4 pr-16 rounded-2xl text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 transition-all"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 bottom-2 bg-white text-blue-600 px-4 rounded-xl hover:bg-blue-50 active:scale-95 transition-all shadow-lg"
            >
              🔍
            </button>
          </div>

          {/* 📊 WEATHER METRICS */}
          <div className="grid grid-cols-2 gap-4">
            <MetricBox label="Humidity" value={`${weather?.current?.humidity}%`} icon="💧" />
            <MetricBox label="Wind" value={`${weather?.current?.wind_kph} km/h`} icon="🌬️" />
            <MetricBox label="Feels Like" value={`${weather?.current?.feelslike_c}°`} icon="🌡️" />
            <MetricBox label="UV Index" value={weather?.current?.uv} icon="☀️" />
          </div>

          {loading && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </motion.div>
      </motion.main>

      {/* STYLES (Use Tailwind or Global CSS) */}
      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 2rem;
          padding: 2rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(-5%); }
          50% { transform: translateY(0); }
        }
        .rain {
          position: absolute;
          background: white;
          width: 2px;
          height: 15px;
          opacity: 0.4;
        }
      `}</style>
    </div>
  );
};

// --- Sub-Components for Effects ---

const MetricBox = ({ label, value, icon }) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-colors">
    <div className="text-xl mb-1">{icon}</div>
    <div className="text-sm opacity-60 uppercase font-bold tracking-wider">{label}</div>
    <div className="text-2xl font-semibold">{value ?? "--"}</div>
  </div>
);

const RainEffect = () => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="rain bg-blue-200"
        initial={{ y: -100 }}
        animate={{ y: 1000 }}
        transition={{ duration: Math.random() * 0.5 + 0.5, repeat: Infinity, ease: "linear", delay: Math.random() * 2 }}
        style={{ left: `${Math.random() * 100}%` }}
      />
    ))}
  </div>
);

const SnowEffect = () => (
  <div className="absolute inset-0 overflow-hidden">
    {[...Array(40)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-white text-xl"
        initial={{ y: -20, x: Math.random() * 100 + "%" }}
        animate={{ y: "100vh", x: (Math.random() * 100 - 10) + "%" }}
        transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear" }}
      >
        ❄
      </motion.div>
    ))}
  </div>
);

const CloudEffect = () => (
  <div className="absolute inset-0 opacity-20 pointer-events-none">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white rounded-full blur-3xl"
        style={{ width: 300, height: 150, top: `${i * 20}%` }}
        initial={{ x: "-100%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
      />
    ))}
  </div>
);

export default App;