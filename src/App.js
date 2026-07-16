import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import './App.css';
import { APP_LAST_UPDATED, APP_VERSION } from './appMeta';
import {
  loadProgress,
  recordProgressAnswer,
  resetProgress,
  saveProgress
} from './progress';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Complete country list with numeric IDs matching world-atlas data
const continents = {
  europe: {
    name: 'Europe',
    center: [15, 54],
    zoom: 3.5,
    countries: [
      { code: '250', name: 'France', capital: 'Paris', flag: 'fr' },
      { code: '276', name: 'Germany', capital: 'Berlin', flag: 'de' },
      { code: '724', name: 'Spain', capital: 'Madrid', flag: 'es' },
      { code: '380', name: 'Italy', capital: 'Rome', flag: 'it' },
      { code: '826', name: 'United Kingdom', capital: 'London', flag: 'gb' },
      { code: '616', name: 'Poland', capital: 'Warsaw', flag: 'pl' },
      { code: '752', name: 'Sweden', capital: 'Stockholm', flag: 'se' },
      { code: '578', name: 'Norway', capital: 'Oslo', flag: 'no' },
      { code: '620', name: 'Portugal', capital: 'Lisbon', flag: 'pt' },
      { code: '300', name: 'Greece', capital: 'Athens', flag: 'gr' },
      { code: '528', name: 'Netherlands', capital: 'Amsterdam', flag: 'nl' },
      { code: '056', name: 'Belgium', capital: 'Brussels', flag: 'be' },
      { code: '040', name: 'Austria', capital: 'Vienna', flag: 'at' },
      { code: '756', name: 'Switzerland', capital: 'Bern', flag: 'ch' },
      { code: '372', name: 'Ireland', capital: 'Dublin', flag: 'ie' },
      { code: '246', name: 'Finland', capital: 'Helsinki', flag: 'fi' },
      { code: '208', name: 'Denmark', capital: 'Copenhagen', flag: 'dk' },
      { code: '203', name: 'Czech Republic', capital: 'Prague', flag: 'cz' },
      { code: '642', name: 'Romania', capital: 'Bucharest', flag: 'ro' },
      { code: '348', name: 'Hungary', capital: 'Budapest', flag: 'hu' },
      { code: '804', name: 'Ukraine', capital: 'Kyiv', flag: 'ua' },
      { code: '703', name: 'Slovakia', capital: 'Bratislava', flag: 'sk' },
      { code: '191', name: 'Croatia', capital: 'Zagreb', flag: 'hr' },
      { code: '688', name: 'Serbia', capital: 'Belgrade', flag: 'rs' },
      { code: '100', name: 'Bulgaria', capital: 'Sofia', flag: 'bg' },
      { code: '112', name: 'Belarus', capital: 'Minsk', flag: 'by' },
      { code: '440', name: 'Lithuania', capital: 'Vilnius', flag: 'lt' },
      { code: '428', name: 'Latvia', capital: 'Riga', flag: 'lv' },
      { code: '233', name: 'Estonia', capital: 'Tallinn', flag: 'ee' },
      { code: '705', name: 'Slovenia', capital: 'Ljubljana', flag: 'si' },
      { code: '008', name: 'Albania', capital: 'Tirana', flag: 'al' },
      { code: '807', name: 'North Macedonia', capital: 'Skopje', flag: 'mk' },
      { code: '498', name: 'Moldova', capital: 'Chișinău', flag: 'md' },
      { code: '070', name: 'Bosnia and Herzegovina', capital: 'Sarajevo', flag: 'ba' },
      { code: '352', name: 'Iceland', capital: 'Reykjavik', flag: 'is' },
      { code: '499', name: 'Montenegro', capital: 'Podgorica', flag: 'me' },
      { code: '643', name: 'Russia', capital: 'Moscow', flag: 'ru' },
      { code: '196', name: 'Cyprus', capital: 'Nicosia', flag: 'cy' },
    ]
  },
  asia: {
    name: 'Asia',
    center: [100, 35],
    zoom: 2.2,
    countries: [
      { code: '156', name: 'China', capital: 'Beijing', flag: 'cn' },
      { code: '392', name: 'Japan', capital: 'Tokyo', flag: 'jp' },
      { code: '356', name: 'India', capital: 'New Delhi', flag: 'in' },
      { code: '410', name: 'South Korea', capital: 'Seoul', flag: 'kr' },
      { code: '764', name: 'Thailand', capital: 'Bangkok', flag: 'th' },
      { code: '704', name: 'Vietnam', capital: 'Hanoi', flag: 'vn' },
      { code: '360', name: 'Indonesia', capital: 'Jakarta', flag: 'id' },
      { code: '608', name: 'Philippines', capital: 'Manila', flag: 'ph' },
      { code: '458', name: 'Malaysia', capital: 'Kuala Lumpur', flag: 'my' },
      { code: '586', name: 'Pakistan', capital: 'Islamabad', flag: 'pk' },
      { code: '682', name: 'Saudi Arabia', capital: 'Riyadh', flag: 'sa' },
      { code: '792', name: 'Turkey', capital: 'Ankara', flag: 'tr' },
      { code: '364', name: 'Iran', capital: 'Tehran', flag: 'ir' },
      { code: '368', name: 'Iraq', capital: 'Baghdad', flag: 'iq' },
      { code: '784', name: 'United Arab Emirates', capital: 'Abu Dhabi', flag: 'ae' },
      { code: '398', name: 'Kazakhstan', capital: 'Astana', flag: 'kz' },
      { code: '860', name: 'Uzbekistan', capital: 'Tashkent', flag: 'uz' },
      { code: '104', name: 'Myanmar', capital: 'Naypyidaw', flag: 'mm' },
      { code: '004', name: 'Afghanistan', capital: 'Kabul', flag: 'af' },
      { code: '887', name: 'Yemen', capital: 'Sanaa', flag: 'ye' },
      { code: '524', name: 'Nepal', capital: 'Kathmandu', flag: 'np' },
      { code: '408', name: 'North Korea', capital: 'Pyongyang', flag: 'kp' },
      { code: '760', name: 'Syria', capital: 'Damascus', flag: 'sy' },
      { code: '400', name: 'Jordan', capital: 'Amman', flag: 'jo' },
      { code: '031', name: 'Azerbaijan', capital: 'Baku', flag: 'az' },
      { code: '496', name: 'Mongolia', capital: 'Ulaanbaatar', flag: 'mn' },
      { code: '762', name: 'Tajikistan', capital: 'Dushanbe', flag: 'tj' },
      { code: '418', name: 'Laos', capital: 'Vientiane', flag: 'la' },
      { code: '417', name: 'Kyrgyzstan', capital: 'Bishkek', flag: 'kg' },
      { code: '795', name: 'Turkmenistan', capital: 'Ashgabat', flag: 'tm' },
      { code: '512', name: 'Oman', capital: 'Muscat', flag: 'om' },
      { code: '116', name: 'Cambodia', capital: 'Phnom Penh', flag: 'kh' },
      { code: '051', name: 'Armenia', capital: 'Yerevan', flag: 'am' },
      { code: '268', name: 'Georgia', capital: 'Tbilisi', flag: 'ge' },
      { code: '050', name: 'Bangladesh', capital: 'Dhaka', flag: 'bd' },
      { code: '144', name: 'Sri Lanka', capital: 'Colombo', flag: 'lk' },
      { code: '634', name: 'Qatar', capital: 'Doha', flag: 'qa' },
      { code: '414', name: 'Kuwait', capital: 'Kuwait City', flag: 'kw' },
      { code: '376', name: 'Israel', capital: 'Jerusalem', flag: 'il' },
      { code: '422', name: 'Lebanon', capital: 'Beirut', flag: 'lb' },
      { code: '064', name: 'Bhutan', capital: 'Thimphu', flag: 'bt' },
      { code: '158', name: 'Taiwan', capital: 'Taipei', flag: 'tw' },
      { code: '096', name: 'Brunei', capital: 'Bandar Seri Begawan', flag: 'bn' },
    ]
  },
  africa: {
    name: 'Africa',
    center: [20, 0],
    zoom: 2,
    countries: [
      { code: '818', name: 'Egypt', capital: 'Cairo', flag: 'eg' },
      { code: '710', name: 'South Africa', capital: 'Pretoria', flag: 'za' },
      { code: '566', name: 'Nigeria', capital: 'Abuja', flag: 'ng' },
      { code: '404', name: 'Kenya', capital: 'Nairobi', flag: 'ke' },
      { code: '504', name: 'Morocco', capital: 'Rabat', flag: 'ma' },
      { code: '231', name: 'Ethiopia', capital: 'Addis Ababa', flag: 'et' },
      { code: '834', name: 'Tanzania', capital: 'Dodoma', flag: 'tz' },
      { code: '012', name: 'Algeria', capital: 'Algiers', flag: 'dz' },
      { code: '288', name: 'Ghana', capital: 'Accra', flag: 'gh' },
      { code: '180', name: 'DR Congo', capital: 'Kinshasa', flag: 'cd' },
      { code: '024', name: 'Angola', capital: 'Luanda', flag: 'ao' },
      { code: '729', name: 'Sudan', capital: 'Khartoum', flag: 'sd' },
      { code: '800', name: 'Uganda', capital: 'Kampala', flag: 'ug' },
      { code: '788', name: 'Tunisia', capital: 'Tunis', flag: 'tn' },
      { code: '434', name: 'Libya', capital: 'Tripoli', flag: 'ly' },
      { code: '384', name: 'Ivory Coast', capital: 'Yamoussoukro', flag: 'ci' },
      { code: '120', name: 'Cameroon', capital: 'Yaoundé', flag: 'cm' },
      { code: '516', name: 'Namibia', capital: 'Windhoek', flag: 'na' },
      { code: '072', name: 'Botswana', capital: 'Gaborone', flag: 'bw' },
      { code: '894', name: 'Zambia', capital: 'Lusaka', flag: 'zm' },
      { code: '716', name: 'Zimbabwe', capital: 'Harare', flag: 'zw' },
      { code: '508', name: 'Mozambique', capital: 'Maputo', flag: 'mz' },
      { code: '450', name: 'Madagascar', capital: 'Antananarivo', flag: 'mg' },
      { code: '686', name: 'Senegal', capital: 'Dakar', flag: 'sn' },
      { code: '466', name: 'Mali', capital: 'Bamako', flag: 'ml' },
      { code: '562', name: 'Niger', capital: 'Niamey', flag: 'ne' },
      { code: '854', name: 'Burkina Faso', capital: 'Ouagadougou', flag: 'bf' },
      { code: '148', name: 'Chad', capital: "N'Djamena", flag: 'td' },
      { code: '178', name: 'Republic of the Congo', capital: 'Brazzaville', flag: 'cg' },
      { code: '646', name: 'Rwanda', capital: 'Kigali', flag: 'rw' },
      { code: '454', name: 'Malawi', capital: 'Lilongwe', flag: 'mw' },
      { code: '706', name: 'Somalia', capital: 'Mogadishu', flag: 'so' },
      { code: '232', name: 'Eritrea', capital: 'Asmara', flag: 'er' },
      { code: '478', name: 'Mauritania', capital: 'Nouakchott', flag: 'mr' },
      { code: '266', name: 'Gabon', capital: 'Libreville', flag: 'ga' },
      { code: '426', name: 'Lesotho', capital: 'Maseru', flag: 'ls' },
      { code: '624', name: 'Guinea-Bissau', capital: 'Bissau', flag: 'gw' },
      { code: '324', name: 'Guinea', capital: 'Conakry', flag: 'gn' },
      { code: '430', name: 'Liberia', capital: 'Monrovia', flag: 'lr' },
      { code: '694', name: 'Sierra Leone', capital: 'Freetown', flag: 'sl' },
      { code: '768', name: 'Togo', capital: 'Lomé', flag: 'tg' },
      { code: '204', name: 'Benin', capital: 'Porto-Novo', flag: 'bj' },
      { code: '140', name: 'Central African Republic', capital: 'Bangui', flag: 'cf' },
      { code: '728', name: 'South Sudan', capital: 'Juba', flag: 'ss' },
      { code: '108', name: 'Burundi', capital: 'Gitega', flag: 'bi' },
      { code: '748', name: 'Eswatini', capital: 'Mbabane', flag: 'sz' },
      { code: '226', name: 'Equatorial Guinea', capital: 'Malabo', flag: 'gq' },
      { code: '262', name: 'Djibouti', capital: 'Djibouti', flag: 'dj' },
      { code: '732', name: 'Western Sahara', capital: 'El Aaiún', flag: 'eh' },
      { code: '270', name: 'Gambia', capital: 'Banjul', flag: 'gm' },
    ]
  },
  northamerica: {
    name: 'North America',
    center: [-100, 45],
    zoom: 2,
    countries: [
      { code: '840', name: 'United States', capital: 'Washington D.C.', flag: 'us' },
      { code: '124', name: 'Canada', capital: 'Ottawa', flag: 'ca' },
      { code: '484', name: 'Mexico', capital: 'Mexico City', flag: 'mx' },
      { code: '192', name: 'Cuba', capital: 'Havana', flag: 'cu' },
      { code: '388', name: 'Jamaica', capital: 'Kingston', flag: 'jm' },
      { code: '332', name: 'Haiti', capital: 'Port-au-Prince', flag: 'ht' },
      { code: '320', name: 'Guatemala', capital: 'Guatemala City', flag: 'gt' },
      { code: '591', name: 'Panama', capital: 'Panama City', flag: 'pa' },
      { code: '188', name: 'Costa Rica', capital: 'San José', flag: 'cr' },
      { code: '340', name: 'Honduras', capital: 'Tegucigalpa', flag: 'hn' },
      { code: '214', name: 'Dominican Republic', capital: 'Santo Domingo', flag: 'do' },
      { code: '222', name: 'El Salvador', capital: 'San Salvador', flag: 'sv' },
      { code: '558', name: 'Nicaragua', capital: 'Managua', flag: 'ni' },
      { code: '084', name: 'Belize', capital: 'Belmopan', flag: 'bz' },
      { code: '044', name: 'Bahamas', capital: 'Nassau', flag: 'bs' },
      { code: '780', name: 'Trinidad and Tobago', capital: 'Port of Spain', flag: 'tt' },
      { code: '630', name: 'Puerto Rico', capital: 'San Juan', flag: 'pr' },
      { code: '304', name: 'Greenland', capital: 'Nuuk', flag: 'gl' },
    ]
  },
  southamerica: {
    name: 'South America',
    center: [-60, -15],
    zoom: 2,
    countries: [
      { code: '076', name: 'Brazil', capital: 'Brasília', flag: 'br' },
      { code: '032', name: 'Argentina', capital: 'Buenos Aires', flag: 'ar' },
      { code: '170', name: 'Colombia', capital: 'Bogotá', flag: 'co' },
      { code: '604', name: 'Peru', capital: 'Lima', flag: 'pe' },
      { code: '152', name: 'Chile', capital: 'Santiago', flag: 'cl' },
      { code: '862', name: 'Venezuela', capital: 'Caracas', flag: 've' },
      { code: '218', name: 'Ecuador', capital: 'Quito', flag: 'ec' },
      { code: '068', name: 'Bolivia', capital: 'La Paz', flag: 'bo' },
      { code: '600', name: 'Paraguay', capital: 'Asunción', flag: 'py' },
      { code: '858', name: 'Uruguay', capital: 'Montevideo', flag: 'uy' },
      { code: '328', name: 'Guyana', capital: 'Georgetown', flag: 'gy' },
      { code: '740', name: 'Suriname', capital: 'Paramaribo', flag: 'sr' },
      { code: '238', name: 'Falkland Islands', capital: 'Stanley', flag: 'fk' },
      { code: '254', name: 'French Guiana', capital: 'Cayenne', flag: 'gf' },
    ]
  },
  oceania: {
    name: 'Oceania',
    center: [140, -25],
    zoom: 2.5,
    countries: [
      { code: '036', name: 'Australia', capital: 'Canberra', flag: 'au' },
      { code: '554', name: 'New Zealand', capital: 'Wellington', flag: 'nz' },
      { code: '242', name: 'Fiji', capital: 'Suva', flag: 'fj' },
      { code: '598', name: 'Papua New Guinea', capital: 'Port Moresby', flag: 'pg' },
      { code: '090', name: 'Solomon Islands', capital: 'Honiara', flag: 'sb' },
      { code: '548', name: 'Vanuatu', capital: 'Port Vila', flag: 'vu' },
      { code: '540', name: 'New Caledonia', capital: 'Nouméa', flag: 'nc' },
      { code: '626', name: 'Timor-Leste', capital: 'Dili', flag: 'tl' },
    ]
  }
};

const continentOrder = ['europe', 'asia', 'africa', 'northamerica', 'southamerica', 'oceania'];

const gameTypes = [
  { id: 'location', name: 'Countries', icon: '🗺️', description: 'Find countries on the map', instruction: 'Click on' },
  { id: 'capital', name: 'Capitals', icon: '🏛️', description: 'Match capitals to countries', instruction: 'What is the capital of' },
  { id: 'flag', name: 'Flags', icon: '🚩', description: 'Identify country flags', instruction: 'Which country has this flag?' }
];

const difficultyLevels = [
  { id: 'easy', name: 'Easy', icon: '😊', count: 10, description: '10 countries' },
  { id: 'medium', name: 'Medium', icon: '🤔', count: 20, description: '20 countries' },
  { id: 'hard', name: 'Hard', icon: '😤', count: null, description: 'All countries' }
];

// Get all country codes for highlighting on world map
const getAllCountryCodes = () => {
  const codes = {};
  continentOrder.forEach(cont => {
    continents[cont].countries.forEach(country => {
      codes[country.code] = cont;
    });
  });
  return codes;
};

const allCountryCodes = getAllCountryCodes();

const continentColors = {
  europe: '#3b82f6',
  asia: '#f59e0b',
  africa: '#10b981',
  northamerica: '#ef4444',
  southamerica: '#8b5cf6',
  oceania: '#ec4899'
};

// Flag component using flagcdn.com
const Flag = ({ countryCode, size = 80 }) => (
  <img 
    src={`https://flagcdn.com/w${size}/${countryCode}.png`}
    srcSet={`https://flagcdn.com/w${size * 2}/${countryCode}.png 2x`}
    alt="Country flag"
    style={{ 
      width: size, 
      height: 'auto',
      borderRadius: '4px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }}
  />
);

const panelStyle = {
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '1.5rem',
  border: '1px solid rgba(255,255,255,0.2)'
};

const screenStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0d9488 100%)',
  padding: '1rem'
};

const buttonStyle = {
  border: 'none',
  borderRadius: '0.75rem',
  cursor: 'pointer',
  color: 'white',
  fontWeight: 'bold'
};

const accuracyFor = (bucket) => (
  bucket?.answers ? Math.round((bucket.correct / bucket.answers) * 100) : 0
);

const formatUpdateDate = (value) => new Intl.DateTimeFormat(undefined, {
  dateStyle: 'full',
  timeStyle: 'short'
}).format(new Date(value));

const SettingsGear = ({ onClick }) => (
  <button
    onClick={onClick}
    title="Settings and updates"
    aria-label="Open settings and updates"
    style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 20,
      width: '44px',
      height: '44px',
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.3)',
      background: 'rgba(15,23,42,0.75)',
      color: 'white',
      fontSize: '1.25rem',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)'
    }}
  >
    ⚙
  </button>
);

function App() {
  const [gameState, setGameState] = useState('menu');
  const [selectedGameType, setSelectedGameType] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState(1);
  const [currentContinent, setCurrentContinent] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questionsInRound, setQuestionsInRound] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [usedCountries, setUsedCountries] = useState([]);
  const [highlightedCountry, setHighlightedCountry] = useState(null);
  const [capitalOptions, setCapitalOptions] = useState([]);
  const [flagOptions, setFlagOptions] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [hoveredContinent, setHoveredContinent] = useState(null);
  const [gameCountries, setGameCountries] = useState([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [mistakes, setMistakes] = useState([]);
  const [missedCountries, setMissedCountries] = useState([]);
  const [progress, setProgress] = useState(loadProgress);
  const [reviewMode, setReviewMode] = useState(false);
  const [settingsReturnState, setSettingsReturnState] = useState('menu');
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateAvailable, setUpdateAvailable] = useState(false);

  const audioContextRef = useRef(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const [muted, setMuted] = useState(() => {
    try {
      return localStorage.getItem('geomaster_muted') === 'true';
    } catch {
      return false;
    }
  });
  const mutedRef = useRef(muted);
  useEffect(() => {
    mutedRef.current = muted;
    try {
      localStorage.setItem('geomaster_muted', String(muted));
    } catch {
      /* ignore storage errors (e.g. private mode) */
    }
  }, [muted]);

  const [allTimeBestStreak, setAllTimeBestStreak] = useState(() => {
    try {
      return parseInt(localStorage.getItem('geomaster_best_streak') || '0', 10) || 0;
    } catch {
      return 0;
    }
  });
  useEffect(() => {
    if (bestStreak > allTimeBestStreak) {
      setAllTimeBestStreak(bestStreak);
      try {
        localStorage.setItem('geomaster_best_streak', String(bestStreak));
      } catch {
        /* ignore storage errors */
      }
    }
  }, [bestStreak, allTimeBestStreak]);

  const openSettings = () => {
    setSettingsReturnState(gameState);
    setUpdateStatus('');
    setGameState('settings');
  };

  const checkForUpdates = async () => {
    setUpdateStatus('Checking for updates...');
    setUpdateAvailable(false);

    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/version.json?${Date.now()}`, {
        cache: 'no-store'
      });
      if (!response.ok) throw new Error('Version check failed');
      const latest = await response.json();

      if (latest.version !== APP_VERSION) {
        setUpdateAvailable(true);
        setUpdateStatus(`Version ${latest.version} is ready to install.`);
      } else {
        setUpdateStatus('You already have the latest version.');
      }
    } catch {
      setUpdateStatus('Could not check right now. Please try again when you are online.');
    }
  };

  const installUpdate = async () => {
    setUpdateStatus('Installing the latest version...');
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        await registration?.update();
        const worker = registration?.waiting || registration?.installing;
        worker?.postMessage({ type: 'SKIP_WAITING' });
      }
    } finally {
      window.location.reload();
    }
  };

  const trackAnswer = ({ correct, yourAnswer, correctAnswer }) => {
    const type = gameTypes[selectedGameType].id;
    const continent = continentOrder[currentContinent];
    setProgress((previous) => recordProgressAnswer(previous, {
      correct,
      type,
      continent,
      country: currentQuestion,
      yourAnswer,
      correctAnswer
    }));
  };

  const getAudioContext = useCallback(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }, []);

  const playCorrectSound = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Pleasant ascending "success" chime: C6 -> E6 -> G6 (a major arpeggio)
    const notes = [1046.5, 1318.5, 1568.0];
    const noteDuration = 0.12;
    const peakVolume = 0.08;

    notes.forEach((frequency, index) => {
      const startTime = now + index * 0.09;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(frequency, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peakVolume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration + 0.02);
    });
  }, [getAudioContext]);

  const playWrongSound = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Gentle low "descending" buzz for a wrong answer: G3 -> E3
    const notes = [196.0, 164.8];
    const noteDuration = 0.16;
    const peakVolume = 0.09;

    notes.forEach((frequency, index) => {
      const startTime = now + index * 0.12;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peakVolume, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + noteDuration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration + 0.02);
    });
  }, [getAudioContext]);

  const vibrate = useCallback((pattern) => {
    if (mutedRef.current) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch {
        /* ignore unsupported */
      }
    }
  }, []);

  const getCurrentContinent = () => continents[continentOrder[currentContinent]];

  const generateQuestion = useCallback(() => {
    const availableCountries = gameCountries.filter(c => !usedCountries.includes(c.code));

    let candidateCountries = availableCountries;

    // In countries game, prioritize asking about previously missed countries
    if (selectedGameType === 0 && missedCountries.length > 0) {
      const retryCountries = availableCountries.filter(c => missedCountries.includes(c.code));
      if (retryCountries.length > 0) {
        candidateCountries = retryCountries;
      }
    }

    if (candidateCountries.length === 0) {
      setGameState('complete');
      return;
    }

    const randomCountry = candidateCountries[Math.floor(Math.random() * candidateCountries.length)];
    setCurrentQuestion(randomCountry);
    setHighlightedCountry(null);

    if (selectedGameType === 1) {
      const otherCountries = gameCountries.filter(c => c.code !== randomCountry.code);
      const shuffled = [...otherCountries].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...shuffled.map(c => c.capital), randomCountry.capital].sort(() => Math.random() - 0.5);
      setCapitalOptions(options);
    }

    if (selectedGameType === 2) {
      const otherCountries = gameCountries.filter(c => c.code !== randomCountry.code);
      const shuffled = [...otherCountries].sort(() => Math.random() - 0.5).slice(0, 3);
      const options = [...shuffled, randomCountry].sort(() => Math.random() - 0.5);
      setFlagOptions(options);
    }
  }, [gameCountries, usedCountries, missedCountries, selectedGameType]);

  useEffect(() => {
    if (gameState === 'playing' && !currentQuestion && gameCountries.length > 0) {
      generateQuestion();
    }
  }, [gameState, currentQuestion, gameCountries, generateQuestion]);

  const startGame = () => {
    setReviewMode(false);
    setGameState('selectGameType');
  };

  const selectGameType = (index) => {
    setSelectedGameType(index);
    setGameState('selectDifficulty');
  };

  const selectDifficulty = (index) => {
    setSelectedDifficulty(index);
    setGameState('selectContinent');
  };

  const selectContinent = (index) => {
    setReviewMode(false);
    setCurrentContinent(index);
    
    // Get countries based on difficulty
    const continent = continents[continentOrder[index]];
    const difficulty = difficultyLevels[selectedDifficulty];
    let countries = [...continent.countries];
    
    // Shuffle and limit based on difficulty
    countries = countries.sort(() => Math.random() - 0.5);
    if (difficulty.count && difficulty.count < countries.length) {
      countries = countries.slice(0, difficulty.count);
    }
    
    setGameCountries(countries);
    setScore(0);
    setTotalQuestions(0);
    setQuestionsInRound(0);
    setUsedCountries([]);
    setCurrentQuestion(null);
    setFeedback(null);
    setStreak(0);
    setBestStreak(0);
    setMistakes([]);
    setMissedCountries([]);
    setGameState('playing');
  };

  const startMistakeReview = (type, continentKey) => {
    const typeIndex = gameTypes.findIndex((gameType) => gameType.id === type);
    const continentIndex = continentOrder.indexOf(continentKey);
    const reviewItems = Object.values(progress.mistakeBank).filter(
      (item) => item.type === type && item.continent === continentKey
    );
    const countryCodes = new Set(reviewItems.map((item) => item.country.code));
    const countries = continents[continentKey].countries.filter((country) => countryCodes.has(country.code));

    if (typeIndex < 0 || continentIndex < 0 || countries.length === 0) return;

    setSelectedGameType(typeIndex);
    setCurrentContinent(continentIndex);
    setGameCountries(countries);
    setScore(0);
    setTotalQuestions(0);
    setQuestionsInRound(0);
    setUsedCountries([]);
    setCurrentQuestion(null);
    setFeedback(null);
    setStreak(0);
    setBestStreak(0);
    setMistakes([]);
    setMissedCountries([]);
    setReviewMode(true);
    setGameState('playing');
  };

  const backToMenu = () => {
    setReviewMode(false);
    setGameState('menu');
  };

  const backToGameTypeSelect = () => {
    setGameState('selectGameType');
  };

  const backToDifficultySelect = () => {
    setGameState('selectDifficulty');
  };

  const handleCountryClick = (geo) => {
    if (selectedGameType !== 0 || feedback || !currentQuestion) return;

    const clickedId = geo.id;
    const isCorrect = clickedId === currentQuestion.code;

    if (isCorrect) {
      trackAnswer({
        correct: true,
        yourAnswer: currentQuestion.name,
        correctAnswer: currentQuestion.name
      });
      playCorrectSound();
      vibrate(30);
      setScore(prev => prev + 1);
      setFeedback({ correct: true, message: 'Correct! +1 point' });
      setHighlightedCountry({ code: currentQuestion.code, correct: true });
      // Remove from missed countries when answered correctly
      if (missedCountries.includes(currentQuestion.code)) {
        setMissedCountries(prev => prev.filter(code => code !== currentQuestion.code));
      }
      setUsedCountries(prev => [...prev, currentQuestion.code]);
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
      setQuestionsInRound(prev => prev + 1);
    } else {
      // Find the name of the country that was clicked
      const continent = getCurrentContinent();
      const clickedCountry = continent.countries.find(c => c.code === clickedId);
      const clickedName = clickedCountry ? clickedCountry.name : 'that country';
      trackAnswer({
        correct: false,
        yourAnswer: clickedName,
        correctAnswer: currentQuestion.name
      });

      setFeedback({
        correct: false,
        message: `Wrong! You clicked ${clickedName}. ${currentQuestion.name} is highlighted in green.`
      });
      setHighlightedCountry({ code: currentQuestion.code, correct: false, clickedCode: clickedId });
      playWrongSound();
      vibrate([60, 40, 60]);
      setStreak(0);
      setMistakes(prev => [...prev, {
        country: currentQuestion,
        yourAnswer: clickedName,
        type: 'location'
      }]);
      // Add to missed countries when answered incorrectly
      if (!missedCountries.includes(currentQuestion.code)) {
        setMissedCountries(prev => [...prev, currentQuestion.code]);
      }
      // Don't mark as used so it can be asked again
    }

    setTotalQuestions(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      setHighlightedCountry(null);
      setCurrentQuestion(null);
    }, 2500);
  };

  const handleCapitalAnswer = (capital) => {
    if (feedback) return;
    
    const isCorrect = capital === currentQuestion.capital;

    if (isCorrect) {
      trackAnswer({
        correct: true,
        yourAnswer: capital,
        correctAnswer: currentQuestion.capital
      });
      playCorrectSound();
      vibrate(30);
      setScore(prev => prev + 1);
      setFeedback({ correct: true, message: 'Correct! +1 point' });
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
    } else {
      trackAnswer({
        correct: false,
        yourAnswer: capital,
        correctAnswer: currentQuestion.capital
      });
      setFeedback({ correct: false, message: `Wrong! The capital of ${currentQuestion.name} is ${currentQuestion.capital}` });
      playWrongSound();
      vibrate([60, 40, 60]);
      setStreak(0);
      setMistakes(prev => [...prev, { 
        country: currentQuestion, 
        yourAnswer: capital,
        correctAnswer: currentQuestion.capital,
        type: 'capital'
      }]);
    }

    setUsedCountries(prev => [...prev, currentQuestion.code]);
    setTotalQuestions(prev => prev + 1);
    setQuestionsInRound(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      setCurrentQuestion(null);
    }, 1500);
  };

  const handleFlagAnswer = (country) => {
    if (feedback) return;
    
    const isCorrect = country.code === currentQuestion.code;

    if (isCorrect) {
      trackAnswer({
        correct: true,
        yourAnswer: country.name,
        correctAnswer: currentQuestion.name
      });
      playCorrectSound();
      vibrate(30);
      setScore(prev => prev + 1);
      setFeedback({ correct: true, message: 'Correct! +1 point' });
      setStreak(prev => {
        const newStreak = prev + 1;
        if (newStreak > bestStreak) setBestStreak(newStreak);
        return newStreak;
      });
    } else {
      trackAnswer({
        correct: false,
        yourAnswer: country.name,
        correctAnswer: currentQuestion.name
      });
      setFeedback({
        correct: false,
        message: `Wrong! That's the flag of ${country.name}. We were looking for ${currentQuestion.name}.`
      });
      playWrongSound();
      vibrate([60, 40, 60]);
      setStreak(0);
      setMistakes(prev => [...prev, {
        country: currentQuestion,
        yourAnswer: country.name,
        correctAnswer: currentQuestion.name,
        type: 'flag'
      }]);
    }

    setUsedCountries(prev => [...prev, currentQuestion.code]);
    setTotalQuestions(prev => prev + 1);
    setQuestionsInRound(prev => prev + 1);

    setTimeout(() => {
      setFeedback(null);
      setCurrentQuestion(null);
    }, 1500);
  };

  const getCountryFill = (geo) => {
    const id = geo.id;
    const isInGame = gameCountries.some(c => c.code === id);
    
    // Highlight the correct answer in green
    if (highlightedCountry && highlightedCountry.code === id) {
      return '#22c55e'; // Always green for the correct answer
    }
    
    // Highlight the wrong clicked country in red (only if it exists and is different from correct)
    if (highlightedCountry && highlightedCountry.clickedCode && highlightedCountry.clickedCode === id) {
      return '#ef4444'; // Red for wrong click
    }
    
    if (usedCountries.includes(id)) {
      return '#6366f1';
    }
    
    if (hoveredCountry === id && isInGame) {
      return '#fbbf24';
    }
    
    if (isInGame) {
      return '#3b82f6';
    }
    
    return '#374151';
  };

  const getWorldMapCountryFill = (geo) => {
    const id = geo.id;
    const continentKey = allCountryCodes[id];
    
    if (!continentKey) return '#374151';
    
    if (hoveredContinent === continentKey) {
      return '#fbbf24';
    }
    
    return continentColors[continentKey] || '#374151';
  };

  if (gameState === 'settings') {
    return (
      <div style={screenStyle}>
        <div style={{ ...panelStyle, maxWidth: '560px', margin: '3rem auto', padding: '2rem' }}>
          <h1 style={{ color: 'white', marginBottom: '0.5rem' }}>Settings</h1>
          <p style={{ color: '#93c5fd', marginBottom: '1.5rem' }}>Sound, app information, and updates.</p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold' }}>Sound and vibration</div>
                  <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                    {muted ? 'Currently muted' : 'Currently enabled'}
                  </div>
                </div>
                <button
                  onClick={() => setMuted((value) => !value)}
                  style={{ ...buttonStyle, padding: '0.75rem 1rem', background: '#2563eb' }}
                >
                  {muted ? 'Turn on' : 'Mute'}
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1rem', borderRadius: '1rem' }}>
              <div style={{ color: 'white', fontWeight: 'bold', marginBottom: '0.5rem' }}>App version</div>
              <div style={{ color: '#bfdbfe' }}>GeoMaster {APP_VERSION}</div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Last updated {formatUpdateDate(APP_LAST_UPDATED)}
              </div>
              <button
                onClick={checkForUpdates}
                style={{
                  ...buttonStyle,
                  width: '100%',
                  padding: '0.9rem',
                  marginTop: '1rem',
                  background: 'linear-gradient(90deg, #14b8a6, #10b981)'
                }}
              >
                Check for latest update
              </button>
              {updateStatus && (
                <div style={{
                  color: updateAvailable ? '#fde047' : '#cbd5e1',
                  fontSize: '0.875rem',
                  marginTop: '0.75rem',
                  textAlign: 'center'
                }}>
                  {updateStatus}
                </div>
              )}
              {updateAvailable && (
                <button
                  onClick={installUpdate}
                  style={{ ...buttonStyle, width: '100%', padding: '0.9rem', marginTop: '0.75rem', background: '#7c3aed' }}
                >
                  Install update
                </button>
              )}
            </div>

            <button
              onClick={() => setGameState(settingsReturnState)}
              style={{ ...buttonStyle, padding: '0.9rem', background: 'rgba(255,255,255,0.15)' }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'progress') {
    const mistakeGroups = Object.values(progress.mistakeBank).reduce((groups, item) => {
      const key = `${item.type}:${item.continent}`;
      if (!groups[key]) groups[key] = { type: item.type, continent: item.continent, items: [] };
      groups[key].items.push(item);
      return groups;
    }, {});
    const masteredCountries = Object.values(progress.countries).filter(
      (country) => country.answers >= 3 && accuracyFor(country) >= 80
    ).length;
    const modeEntries = gameTypes.map((type) => ({
      ...type,
      stats: progress.byMode[type.id]
    }));

    return (
      <div style={screenStyle}>
        <SettingsGear onClick={openSettings} />
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', margin: '1rem 0 1.5rem' }}>
            <h1 style={{ color: 'white', fontSize: '2rem' }}>Your Progress</h1>
            <p style={{ color: '#93c5fd' }}>Your results are saved on this device.</p>
          </div>

          <div className="progress-stat-grid">
            {[
              ['Answers', progress.totalAnswers],
              ['Accuracy', `${accuracyFor({ answers: progress.totalAnswers, correct: progress.totalCorrect })}%`],
              ['Mastered', masteredCountries],
              ['To review', Object.keys(progress.mistakeBank).length]
            ].map(([label, value]) => (
              <div key={label} style={{ ...panelStyle, padding: '1rem', textAlign: 'center' }}>
                <div style={{ color: '#fde047', fontSize: '1.75rem', fontWeight: 'bold' }}>{value}</div>
                <div style={{ color: '#bfdbfe', fontSize: '0.8rem' }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ ...panelStyle, padding: '1.25rem', marginTop: '1rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '1rem' }}>Accuracy by mode</h2>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {modeEntries.map((type) => (
                <div key={type.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#e2e8f0', marginBottom: '0.35rem' }}>
                    <span>{type.icon} {type.name}</span>
                    <span>{accuracyFor(type.stats)}% · {type.stats?.answers || 0} answers</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${accuracyFor(type.stats)}%`, height: '100%', background: '#22c55e' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...panelStyle, padding: '1.25rem', marginTop: '1rem' }}>
            <h2 style={{ color: 'white', fontSize: '1.2rem', marginBottom: '0.4rem' }}>Mistake review</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Correct answers remove countries from this list.
            </p>
            {Object.keys(mistakeGroups).length === 0 ? (
              <div style={{ color: '#86efac', padding: '1rem 0' }}>Nothing to review yet. Nice work.</div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {Object.values(mistakeGroups).map((group) => {
                  const type = gameTypes.find((item) => item.id === group.type);
                  return (
                    <div
                      key={`${group.type}:${group.continent}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: '0.9rem',
                        padding: '0.9rem'
                      }}
                    >
                      <div>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>
                          {type?.icon} {type?.name} · {continents[group.continent].name}
                        </div>
                        <div style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                          {group.items.map((item) => item.country.name).join(', ')}
                        </div>
                      </div>
                      <button
                        onClick={() => startMistakeReview(group.type, group.continent)}
                        style={{ ...buttonStyle, flexShrink: 0, padding: '0.7rem 0.9rem', background: '#dc2626' }}
                      >
                        Practice {group.items.length}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', margin: '1rem 0', flexWrap: 'wrap' }}>
            <button
              onClick={backToMenu}
              style={{ ...buttonStyle, flex: 1, minWidth: '180px', padding: '0.9rem', background: '#2563eb' }}
            >
              Back to Home
            </button>
            {progress.totalAnswers > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Reset all saved progress and mistakes?')) {
                    setProgress(resetProgress());
                  }
                }}
                style={{ ...buttonStyle, padding: '0.9rem', background: 'rgba(239,68,68,0.25)', border: '1px solid rgba(248,113,113,0.5)' }}
              >
                Reset progress
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // MENU SCREEN
  if (gameState === 'menu') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0d9488 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <SettingsGear onClick={openSettings} />
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌍</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>GeoMaster</h1>
          <p style={{ color: '#93c5fd', marginBottom: '1.5rem' }}>Test your world geography knowledge!</p>
          
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <h3 style={{ color: 'white', fontWeight: '600', marginBottom: '0.5rem' }}>Game Modes:</h3>
            <div style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>🗺️ <strong>Countries:</strong> Find countries on the map</p>
              <p style={{ marginBottom: '0.5rem' }}>🏛️ <strong>Capitals:</strong> Match capitals to countries</p>
              <p style={{ marginBottom: '0.5rem' }}>🚩 <strong>Flags:</strong> Identify country flags</p>
            </div>
            <p style={{ color: '#7dd3fc', fontSize: '0.75rem', marginTop: '0.75rem' }}>1 point per correct answer!</p>
          </div>

          <button
            onClick={startGame}
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, #14b8a6, #10b981)',
              color: 'white',
              fontWeight: 'bold',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              fontSize: '1.25rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Start Game
          </button>
          <button
            onClick={() => setGameState('progress')}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.13)',
              color: 'white',
              fontWeight: 'bold',
              padding: '0.9rem 1rem',
              borderRadius: '0.75rem',
              fontSize: '1rem',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              marginTop: '0.75rem'
            }}
          >
            View Progress
            {Object.keys(progress.mistakeBank).length > 0 && (
              <span style={{ color: '#fca5a5' }}> · {Object.keys(progress.mistakeBank).length} to review</span>
            )}
          </button>
        </div>
      </div>
    );
  }

  // GAME TYPE SELECTION SCREEN
  if (gameState === 'selectGameType') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0d9488 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <SettingsGear onClick={openSettings} />
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Choose Game Mode</h1>
          <p style={{ color: '#93c5fd', marginBottom: '1.5rem' }}>What do you want to practice?</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {gameTypes.map((type, idx) => (
              <button
                key={type.id}
                onClick={() => selectGameType(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  background: 'rgba(255,255,255,0.1)',
                  border: '2px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '2.5rem' }}>{type.icon}</div>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>{type.name}</div>
                  <div style={{ color: '#93c5fd', fontSize: '0.875rem' }}>{type.description}</div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={backToMenu}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    );
  }

  // DIFFICULTY SELECTION SCREEN
  if (gameState === 'selectDifficulty') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0d9488 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}>
        <SettingsGear onClick={openSettings} />
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '1.5rem',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>Choose Difficulty</h1>
          <p style={{ color: '#93c5fd', marginBottom: '1.5rem' }}>How many countries do you want to practice?</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {difficultyLevels.map((level, idx) => (
              <button
                key={level.id}
                onClick={() => selectDifficulty(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  borderRadius: '1rem',
                  background: idx === 0 ? 'rgba(34, 197, 94, 0.2)' : idx === 1 ? 'rgba(251, 191, 36, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `2px solid ${idx === 0 ? 'rgba(34, 197, 94, 0.4)' : idx === 1 ? 'rgba(251, 191, 36, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textAlign: 'left'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{ fontSize: '2.5rem' }}>{level.icon}</div>
                <div>
                  <div style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>{level.name}</div>
                  <div style={{ color: '#93c5fd', fontSize: '0.875rem' }}>{level.description}</div>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={backToGameTypeSelect}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // CONTINENT SELECTION SCREEN
  if (gameState === 'selectContinent') {
    const selectedType = gameTypes[selectedGameType];
    const selectedDiff = difficultyLevels[selectedDifficulty];
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e293b 100%)',
        padding: '1rem'
      }}>
        <SettingsGear onClick={openSettings} />
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{selectedType.icon}</div>
            <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.25rem' }}>
              {selectedType.name} Quiz
            </h1>
            <p style={{ color: '#93c5fd', marginBottom: '0.5rem' }}>
              Difficulty: {selectedDiff.icon} {selectedDiff.name} ({selectedDiff.description})
            </p>
            <p style={{ color: '#64748b' }}>Choose a continent to start</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            overflow: 'hidden',
            marginBottom: '1rem'
          }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 120 }}
              style={{ width: '100%', height: 'auto' }}
            >
              <ZoomableGroup center={[0, 20]} zoom={1}>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const id = geo.id;
                      const continentKey = allCountryCodes[id];
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getWorldMapCountryFill(geo)}
                          stroke="#1e293b"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: 'none', cursor: continentKey ? 'pointer' : 'default' },
                            hover: { outline: 'none' },
                            pressed: { outline: 'none' }
                          }}
                          onMouseEnter={() => {
                            if (continentKey) setHoveredContinent(continentKey);
                          }}
                          onMouseLeave={() => setHoveredContinent(null)}
                          onClick={() => {
                            if (continentKey) {
                              const index = continentOrder.indexOf(continentKey);
                              if (index !== -1) selectContinent(index);
                            }
                          }}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
          </div>

          {/* Continent Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
            {continentOrder.map((cont, idx) => {
              const countryCount = difficultyLevels[selectedDifficulty].count 
                ? Math.min(difficultyLevels[selectedDifficulty].count, continents[cont].countries.length)
                : continents[cont].countries.length;
              
              return (
                <button
                  key={cont}
                  onClick={() => selectContinent(idx)}
                  style={{
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    background: continentColors[cont],
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                  {continents[cont].name}
                  <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
                    {countryCount} countries
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#3b82f6' }}></div>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Europe</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#f59e0b' }}></div>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Asia</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#10b981' }}></div>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Africa</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#ef4444' }}></div>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>N. America</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#8b5cf6' }}></div>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>S. America</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#ec4899' }}></div>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>Oceania</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={backToDifficultySelect}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '0.5rem',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ← Change Difficulty
            </button>
          </div>
        </div>
      </div>
    );
  }

  // COMPLETE SCREEN
  if (gameState === 'complete') {
    const maxPossible = totalQuestions;
    const percentage = totalQuestions > 0 ? Math.round((score / maxPossible) * 100) : 0;
    const continent = getCurrentContinent();
    const gameType = gameTypes[selectedGameType];
    
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #db2777 100%)',
        padding: '1rem',
        overflowY: 'auto'
      }}>
        <SettingsGear onClick={openSettings} />
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1.5rem',
            padding: '2rem',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '1rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>
              {reviewMode ? 'Review Complete!' : `${continent.name} Complete!`}
            </h1>
            <p style={{ color: '#e9d5ff', marginBottom: '1rem' }}>
              {reviewMode ? `${gameType.name} mistake practice` : `${gameType.name} Quiz`}
            </p>
            
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#fbbf24', marginBottom: '0.5rem' }}>{score}</div>
              <p style={{ color: '#e9d5ff', marginBottom: '1rem' }}>Total Points</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', color: 'white', fontSize: '0.875rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{totalQuestions}</div>
                  <div style={{ color: '#c4b5fd', fontSize: '0.75rem' }}>Questions</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{percentage}%</div>
                  <div style={{ color: '#c4b5fd', fontSize: '0.75rem' }}>Accuracy</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.5rem' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>🔥 {bestStreak}</div>
                  <div style={{ color: '#c4b5fd', fontSize: '0.75rem' }}>Best Streak</div>
                </div>
              </div>
              {bestStreak > 0 && bestStreak >= allTimeBestStreak ? (
                <p style={{ color: '#fbbf24', fontSize: '0.875rem', fontWeight: 'bold', marginTop: '0.75rem' }}>
                  🎉 New personal record!
                </p>
              ) : (
                <p style={{ color: '#c4b5fd', fontSize: '0.75rem', marginTop: '0.75rem' }}>
                  All-time best streak: 🔥 {allTimeBestStreak}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => {
                  setUsedCountries([]);
                  setQuestionsInRound(0);
                  setScore(0);
                  setTotalQuestions(0);
                  setCurrentQuestion(null);
                  setStreak(0);
                  setBestStreak(0);
                  setMistakes([]);
                  let countries = [...gameCountries].sort(() => Math.random() - 0.5);
                  if (!reviewMode) {
                    const continent = continents[continentOrder[currentContinent]];
                    const difficulty = difficultyLevels[selectedDifficulty];
                    countries = [...continent.countries].sort(() => Math.random() - 0.5);
                    if (difficulty.count && difficulty.count < countries.length) {
                      countries = countries.slice(0, difficulty.count);
                    }
                  }
                  setGameCountries(countries);
                  setGameState('playing');
                }}
                style={{
                  background: 'linear-gradient(90deg, #ec4899, #a855f7)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {reviewMode ? 'Review Again' : 'Play Again'}
              </button>
              <button
                onClick={() => setGameState(reviewMode ? 'progress' : 'selectContinent')}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {reviewMode ? 'Back to Progress' : 'Choose Another Continent'}
              </button>
              {!reviewMode && <button
                onClick={backToGameTypeSelect}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Change Game Mode
              </button>}
              {!reviewMode && <button
                onClick={() => setGameState('progress')}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                View Progress
              </button>}
            </div>
          </div>

          {/* Mistakes Review Section */}
          {mistakes.length > 0 && (
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1.5rem',
              padding: '1.5rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h2 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                📝 Review Your Mistakes ({mistakes.length})
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {mistakes.map((mistake, idx) => (
                  <div 
                    key={idx}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '0.75rem',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}
                  >
                    <img 
                      src={`https://flagcdn.com/w40/${mistake.country.flag}.png`}
                      alt={mistake.country.name}
                      style={{ width: '40px', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'white', fontWeight: 'bold' }}>{mistake.country.name}</div>
                      {mistake.type === 'location' && (
                        <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>
                          You clicked: {mistake.yourAnswer}
                        </div>
                      )}
                      {mistake.type === 'capital' && (
                        <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>
                          Capital: <span style={{ color: '#4ade80' }}>{mistake.correctAnswer}</span> (you said: {mistake.yourAnswer})
                        </div>
                      )}
                      {mistake.type === 'flag' && (
                        <div style={{ color: '#fca5a5', fontSize: '0.875rem' }}>
                          You said: {mistake.yourAnswer} (correct: {mistake.correctAnswer})
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // GAME SCREEN
  const continent = getCurrentContinent();
  const gameType = gameTypes[selectedGameType];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e293b 100%)',
      padding: '0.5rem'
    }}>
      <SettingsGear onClick={openSettings} />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Stats */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <button
            onClick={() => setGameState(reviewMode ? 'progress' : 'selectContinent')}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            ← Back
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {/* Mute Toggle */}
            <button
              onClick={() => setMuted(prev => !prev)}
              title={muted ? 'Unmute sounds' : 'Mute sounds'}
              aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '0.375rem 0.625rem',
                cursor: 'pointer',
                fontSize: '1rem',
                lineHeight: 1
              }}
            >
              {muted ? '🔇' : '🔊'}
            </button>
            {/* Streak Counter */}
            {streak > 0 && (
              <div style={{ 
                background: 'linear-gradient(90deg, #f59e0b, #ef4444)', 
                borderRadius: '0.75rem', 
                padding: '0.375rem 0.75rem',
                animation: streak >= 3 ? 'pulse 1s infinite' : 'none'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>🔥 {streak}</span>
              </div>
            )}
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.375rem 0.75rem' }}>
              <span style={{ color: '#fde047', fontSize: '0.75rem' }}>Score </span>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.125rem' }}>{score}</span>
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'white', fontWeight: '600', fontSize: '0.875rem' }}>{continent.name}</div>
            <div style={{ color: '#2dd4bf', fontSize: '0.75rem' }}>
              {reviewMode ? `${gameType.name} Review` : gameType.name}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.375rem 0.75rem' }}>
            <span style={{ color: '#86efac', fontSize: '0.75rem' }}>Progress </span>
            <span style={{ color: 'white', fontWeight: 'bold' }}>{questionsInRound}/{gameCountries.length}</span>
          </div>
        </div>

        {/* Question */}
        {currentQuestion && (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '1rem',
            padding: '0.75rem',
            marginBottom: '0.75rem',
            textAlign: 'center'
          }}>
            {selectedGameType === 0 && (
              <p style={{ color: 'white', fontSize: '1.125rem', margin: 0 }}>
                {gameType.instruction} <span style={{ color: '#2dd4bf', fontWeight: 'bold' }}>{currentQuestion.name}</span>
              </p>
            )}
            {selectedGameType === 1 && (
              <p style={{ color: 'white', fontSize: '1.125rem', margin: 0 }}>
                {gameType.instruction} <span style={{ color: '#2dd4bf', fontWeight: 'bold' }}>{currentQuestion.name}</span>?
              </p>
            )}
            {selectedGameType === 2 && (
              <div>
                <p style={{ color: 'white', fontSize: '1rem', marginBottom: '0.75rem' }}>{gameType.instruction}</p>
                <Flag countryCode={currentQuestion.flag} size={160} />
              </div>
            )}
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div style={{
            borderRadius: '0.75rem',
            padding: '0.5rem',
            marginBottom: '0.75rem',
            textAlign: 'center',
            fontWeight: '600',
            background: feedback.correct ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            color: feedback.correct ? '#4ade80' : '#f87171',
            border: `1px solid ${feedback.correct ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          }}>
            {feedback.message}
          </div>
        )}

        {/* Map for Countries game */}
        {selectedGameType === 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '1rem',
            overflow: 'hidden'
          }}>
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 150 }}
              style={{ width: '100%', height: 'auto' }}
            >
              <ZoomableGroup
                center={continent.center}
                zoom={continent.zoom}
                minZoom={1}
                maxZoom={8}
              >
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const id = geo.id;
                      const isInGame = gameCountries.some(c => c.code === id);
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getCountryFill(geo)}
                          stroke="#1e293b"
                          strokeWidth={0.5}
                          style={{
                            default: { outline: 'none', cursor: isInGame ? 'pointer' : 'default' },
                            hover: { outline: 'none', fill: isInGame ? '#fbbf24' : getCountryFill(geo) },
                            pressed: { outline: 'none' }
                          }}
                          onMouseEnter={() => {
                            if (isInGame) setHoveredCountry(id);
                          }}
                          onMouseLeave={() => setHoveredCountry(null)}
                          onClick={() => handleCountryClick(geo)}
                        />
                      );
                    })
                  }
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            
            {/* Legend */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '0.5rem', fontSize: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#3b82f6' }}></div>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Clickable</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#6366f1' }}></div>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Completed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#374151' }}></div>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Other</span>
              </div>
            </div>
          </div>
        )}

        {/* Missed Countries Section */}
        {selectedGameType === 0 && missedCountries.length > 0 && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '1rem',
            padding: '1rem',
            marginTop: '0.75rem'
          }}>
            <h3 style={{
              color: 'white',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Practice These Countries ({missedCountries.length})
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '0.5rem'
            }}>
              {missedCountries.map(code => {
                const country = gameCountries.find(c => c.code === code);
                if (!country) return null;
                return (
                  <div
                    key={code}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <img
                      src={`https://flagcdn.com/w40/${country.flag}.png`}
                      alt={country.name}
                      style={{ width: '30px', borderRadius: '4px' }}
                    />
                    <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
                      {country.name}
                    </span>
                  </div>
                );
              })}
            </div>
            <p style={{
              color: '#fca5a5',
              fontSize: '0.75rem',
              marginTop: '0.75rem',
              marginBottom: 0
            }}>
              Keep playing until you get 100% correct!
            </p>
          </div>
        )}

        {/* Capital Quiz */}
        {selectedGameType === 1 && currentQuestion && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {capitalOptions.map((capital, idx) => (
              <button
                key={idx}
                onClick={() => handleCapitalAnswer(capital)}
                disabled={!!feedback}
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  border: 'none',
                  cursor: feedback ? 'default' : 'pointer',
                  background: feedback
                    ? capital === currentQuestion.capital ? '#22c55e' : 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0.1)'
                }}
              >
                {capital}
              </button>
            ))}
          </div>
        )}

        {/* Flag Quiz */}
        {selectedGameType === 2 && currentQuestion && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {flagOptions.map((country, idx) => (
              <button
                key={idx}
                onClick={() => handleFlagAnswer(country)}
                disabled={!!feedback}
                style={{
                  padding: '1rem',
                  borderRadius: '0.75rem',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '1.125rem',
                  border: 'none',
                  cursor: feedback ? 'default' : 'pointer',
                  background: feedback
                    ? country.code === currentQuestion.code ? '#22c55e' : 'rgba(255,255,255,0.1)'
                    : 'rgba(255,255,255,0.1)'
                }}
              >
                {country.name}
              </button>
            ))}
          </div>
        )}

        {/* Progress bar */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{
            height: '8px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(questionsInRound / gameCountries.length) * 100}%`,
              background: 'linear-gradient(90deg, #14b8a6, #22c55e)',
              borderRadius: '9999px',
              transition: 'width 0.3s'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
