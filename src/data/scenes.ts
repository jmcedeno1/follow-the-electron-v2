export type Scene = {
  id: number;
  chapter: string;
  title: string;
  simple: string;
  expert: string;
  startTime: number;
  endTime: number;
  imageSrc: string;
};

export const TOTAL_DURATION = 72;

export const scenes: Scene[] = [
  { id: 1, chapter: 'SCENE 1 / 9', title: 'Energy Source',
    simple: 'It starts at the source: renewables, fossil fuels, or nuclear generate the electricity.',
    expert: 'Wind turbines convert kinetic energy to AC at ~690V, then step up to 110-400 kV for transmission.',
    startTime: 0, endTime: 8, imageSrc: '/heroes/nano_scene_01_source.png' },
  { id: 2, chapter: 'SCENE 2 / 9', title: 'Grid and Distribution',
    simple: 'Power travels across the grid through high-voltage lines and substations.',
    expert: 'Transmission at 110-400 kV minimizes losses. Substations step down to 20 kV (distribution), then 400V (LV) for fast-charging sites.',
    startTime: 8, endTime: 16, imageSrc: '/heroes/nano_scene_02_grid.png' },
  { id: 3, chapter: 'SCENE 3 / 9', title: 'Kempower Power Unit',
    simple: 'A central cabinet converts AC grid power into the DC current batteries need.',
    expert: 'AC/DC converters operate at 98%+ peak efficiency, output 50-600 kW DC at 150-1000V, dynamically allocated.',
    startTime: 16, endTime: 24, imageSrc: '/heroes/nano_scene_03_rectifier.png' },
  { id: 4, chapter: 'SCENE 4 / 9', title: 'Dynamic Power Distribution',
    simple: 'One power unit intelligently feeds multiple charging points at once.',
    expert: 'Real-time DC routing: 600 kW unit serves 4 satellites at 150 kW each, or one at 350 kW while others receive 125 kW.',
    startTime: 24, endTime: 32, imageSrc: '/heroes/nano_scene_04_distribution.png' },
  { id: 5, chapter: 'SCENE 5 / 9', title: 'Satellite and Cable',
    simple: 'The satellite is the slim unit drivers interact with — touchscreen, cable, plug.',
    expert: 'Satellites contain no power conversion. CCS2 cables carry up to 500A at 1000V DC via liquid-cooled conductors.',
    startTime: 32, endTime: 40, imageSrc: '/heroes/nano_scene_05_satellite.png' },
  { id: 6, chapter: 'SCENE 6 / 9', title: 'Vehicle Communication',
    simple: 'Before any power flows, the plug and the car have a digital conversation.',
    expert: 'ISO 15118 handshake: vehicle reports SOC, chemistry, max V/A. Charger responds with available power. ~2-3 sec before contactors close.',
    startTime: 40, endTime: 48, imageSrc: '/heroes/nano_scene_06_communication.png' },
  { id: 7, chapter: 'SCENE 7 / 9', title: 'Battery Pack',
    simple: 'Inside the vehicle, energy is stored chemically in arrays of battery cells.',
    expert: 'Modern packs use 21700 cylindrical or prismatic cells in series-parallel modules. CATL Shenxing III: 10C charge, 0.25 mΩ resistance.',
    startTime: 48, endTime: 56, imageSrc: '/heroes/nano_scene_07_battery.png' },
  { id: 8, chapter: 'SCENE 8 / 9', title: 'Thermal Management',
    simple: 'Fast charging creates heat. Cooling channels remove it before it damages cells.',
    expert: 'Cell Shoulder Cooling routes coolant along cell edges (not under cells), improving heat extraction ~20%. Enables sustained high C-rates.',
    startTime: 56, endTime: 64, imageSrc: '/heroes/nano_scene_08_thermal.png' },
  { id: 9, chapter: 'SCENE 9 / 9', title: 'Charging Complete',
    simple: 'The journey is complete: from grid to battery in minutes, not hours.',
    expert: '77 kWh in 6 min 27 s, +420 km range. Total grid-to-battery efficiency: 92-95%, conversion losses primarily at AC/DC stage.',
    startTime: 64, endTime: 72, imageSrc: '/heroes/nano_scene_09_complete.png' },
];
