export interface DecadeData {
  decade: string;
  sample: number;
  real: number;
  cov: number;
  twv: number;
  vrate: number;
  hconf: number;
  sys_pct: number;
  per_pct: number;
  ap: Record<string, number>;
  af: Record<string, string[]>;
  pp: Record<string, number>;
  pf: Record<string, string[]>;
  warn: string[];
}

export const RAW: DecadeData[] = [
  {
    decade: "1930s",
    sample: 39,
    real: 200,
    cov: 19.5,
    twv: 25,
    vrate: 64,
    hconf: 67,
    sys_pct: 28,
    per_pct: 72,
    ap: {
      criminal_gangster: 16,
      family_antagonist: 16,
      jealous_lover: 28,
      "landlord/zamindar": 12,
      corrupt_politician: 16,
      corporate_villain: 0,
      corrupt_police: 0,
      terrorist: 0,
      colonial_oppressor: 8,
      supernatural: 0,
      patriarchal_system: 0,
      "system/society": 0,
      "religious_extremist/cult_leader": 4
    },
    af: {
      criminal_gangster: ["Chandrasena", "Pujarin"],
      family_antagonist: ["Karma", "Rajrani Meera"],
      jealous_lover: ["Alam Ara", "Karwan-E-Hayat"],
      "landlord/zamindar": ["Chandidas", "Dharmatma"],
      corrupt_politician: ["Hind Kesari", "Hunterwali"],
      colonial_oppressor: ["Al Hilal", "Watan"]
    },
    pp: {
      criminal_individual: 16,
      personal: 44,
      state_political: 16,
      feudal: 12,
      colonial_state: 8,
      other: 4
    },
    pf: {
      personal: ["Alam Ara", "Karma"],
      criminal_individual: ["Chandrasena", "Pujarin"],
      state_political: ["Hind Kesari", "Hunterwali"],
      feudal: ["Chandidas", "Dharmatma"],
      colonial_state: ["Al Hilal", "Watan"]
    },
    warn: []
  },
  {
    decade: "1940s",
    sample: 39,
    real: 250,
    cov: 15.6,
    twv: 17,
    vrate: 44,
    hconf: 64,
    sys_pct: 24,
    per_pct: 76,
    ap: {
      criminal_gangster: 23.5,
      family_antagonist: 23.5,
      jealous_lover: 11.8,
      "landlord/zamindar": 11.8,
      corrupt_politician: 11.8,
      corporate_villain: 5.9,
      corrupt_police: 0,
      terrorist: 0,
      colonial_oppressor: 0,
      supernatural: 5.9,
      patriarchal_system: 0,
      "system/society": 5.9,
      "religious_extremist/cult_leader": 0
    },
    af: {
      criminal_gangster: ["Holi", "Valmiki"],
      family_antagonist: ["Chingari", "Sant Sakhu"],
      jealous_lover: ["Aparadhi", "Barsaat"],
      corporate_villain: ["Padosi"],
      "system/society": ["Achhut"]
    },
    pp: {
      criminal_individual: 23.5,
      personal: 35.3,
      state_political: 11.8,
      corporate_institutional: 11.8,
      feudal: 11.8,
      supernatural: 5.9
    },
    pf: {
      personal: ["Chingari", "Sant Sakhu"],
      criminal_individual: ["Holi", "Valmiki"],
      state_political: ["Achhut", "Hamrahi"],
      feudal: ["Anjaan", "Badi Maa"]
    },
    warn: []
  },
  {
    decade: "1950s",
    sample: 37,
    real: 300,
    cov: 12.3,
    twv: 26,
    vrate: 70,
    hconf: 59,
    sys_pct: 35,
    per_pct: 65,
    ap: {
      criminal_gangster: 11.5,
      family_antagonist: 26.9,
      jealous_lover: 15.4,
      "landlord/zamindar": 7.7,
      corrupt_politician: 11.5,
      corporate_villain: 7.7,
      corrupt_police: 7.7,
      terrorist: 0,
      colonial_oppressor: 7.7,
      supernatural: 3.8,
      patriarchal_system: 0,
      "system/society": 0,
      "religious_extremist/cult_leader": 0
    },
    af: {
      family_antagonist: ["Sazaa", "Amber"],
      jealous_lover: ["Tarana", "Jaal", "Aurat"],
      corrupt_politician: ["Nastik", "Pyaasa"],
      corporate_villain: ["Shree 420", "Anari"],
      corrupt_police: ["Awaara", "Faraar"],
      colonial_oppressor: ["Baaz", "Raj Hath"]
    },
    pp: {
      criminal_individual: 11.5,
      personal: 42.3,
      state_political: 11.5,
      corporate_institutional: 15.4,
      feudal: 7.7,
      colonial_state: 7.7,
      supernatural: 3.8
    },
    pf: {
      personal: ["Sazaa", "Tarana"],
      corporate_institutional: ["Shree 420", "Anari", "Pyaasa"],
      state_political: ["Awaara", "Nastik"],
      colonial_state: ["Baaz", "Raj Hath"]
    },
    warn: []
  },
  {
    decade: "1960s",
    sample: 39,
    real: 400,
    cov: 9.8,
    twv: 21,
    vrate: 54,
    hconf: 56,
    sys_pct: 0,
    per_pct: 100,
    ap: {
      criminal_gangster: 14.3,
      family_antagonist: 33.3,
      jealous_lover: 19,
      "landlord/zamindar": 28.6,
      corrupt_politician: 0,
      corporate_villain: 0,
      corrupt_police: 0,
      terrorist: 4.8,
      colonial_oppressor: 0,
      supernatural: 0,
      patriarchal_system: 0,
      "system/society": 0,
      "religious_extremist/cult_leader": 0
    },
    af: {
      family_antagonist: ["Mughal-e-Azam", "Sehra", "College Girl"],
      "landlord/zamindar": ["Gunga Jumna", "Door Gagan", "Hatey Bazarey"],
      jealous_lover: ["Jab Pyar Kisise Hota Hai", "Bhabhi Ki Chudiyan"],
      criminal_gangster: ["Suraj", "Night in London"]
    },
    pp: {
      criminal_individual: 14.3,
      personal: 52.4,
      feudal: 28.6,
      foreign_threat: 4.8
    },
    pf: {
      personal: ["Mughal-e-Azam", "Jab Pyar"],
      feudal: ["Gunga Jumna", "Door Gagan"],
      criminal_individual: ["Suraj", "Night in London"]
    },
    warn: []
  },
  {
    decade: "1970s",
    sample: 42,
    real: 600,
    cov: 7,
    twv: 27,
    vrate: 64,
    hconf: 62,
    sys_pct: 15,
    per_pct: 85,
    ap: {
      criminal_gangster: 44.4,
      family_antagonist: 11.1,
      jealous_lover: 11.1,
      "landlord/zamindar": 18.5,
      corrupt_politician: 3.7,
      corporate_villain: 3.7,
      corrupt_police: 0,
      terrorist: 0,
      colonial_oppressor: 0,
      supernatural: 0,
      patriarchal_system: 0,
      "system/society": 7.4,
      "religious_extremist/cult_leader": 0
    },
    af: {
      criminal_gangster: ["Sholay", "Yaadon Ki Baaraat", "Don", "Victoria No. 203"],
      "landlord/zamindar": ["Maryada", "Tangewala", "Yeh Gulistan Hamara"],
      "system/society": ["Deewar", "Trishul"],
      family_antagonist: ["Joroo Ka Ghulam", "Bhai Ho To Aisa"]
    },
    pp: {
      criminal_individual: 44.4,
      personal: 22.2,
      state_political: 7.4,
      corporate_institutional: 7.4,
      feudal: 18.5
    },
    pf: {
      criminal_individual: ["Sholay", "Yaadon Ki Baaraat", "Don"],
      feudal: ["Maryada", "Tangewala"],
      personal: ["Rootha Na Karo"],
      state_political: ["Deewar", "Trishul"]
    },
    warn: ["Low coverage (~7% of films that decade)"]
  },
  {
    decade: "1980s",
    sample: 39,
    real: 900,
    cov: 4.3,
    twv: 36,
    vrate: 92,
    hconf: 82,
    sys_pct: 20,
    per_pct: 81,
    ap: {
      criminal_gangster: 38.9,
      family_antagonist: 16.7,
      jealous_lover: 8.3,
      "landlord/zamindar": 11.1,
      corrupt_politician: 2.8,
      corporate_villain: 11.1,
      corrupt_police: 5.6,
      terrorist: 0,
      colonial_oppressor: 0,
      supernatural: 5.6,
      patriarchal_system: 0,
      "system/society": 0,
      "religious_extremist/cult_leader": 0
    },
    af: {
      criminal_gangster: ["Shaan", "Tridev", "Ram Lakhan", "Tezaab"],
      family_antagonist: ["Lakshmi", "Sunny", "Maine Pyar Kiya"],
      corporate_villain: ["Shakka", "Dahshat", "Diljalaa"],
      corrupt_police: ["Ardh Satya", "Nasihat"]
    },
    pp: {
      criminal_individual: 38.9,
      personal: 25,
      state_political: 5.6,
      corporate_institutional: 13.9,
      feudal: 11.1,
      supernatural: 5.6
    },
    pf: {
      criminal_individual: ["Shaan", "Tridev", "Ram Lakhan"],
      corporate_institutional: ["Shakka", "Dahshat"],
      feudal: ["Kudrat", "Rajput"],
      personal: ["Lakshmi", "Sunny"]
    },
    warn: ["92% villain rate — likely curation bias toward action films", "Very low coverage (~4% of all films)"]
  },
  {
    decade: "1990s",
    sample: 44,
    real: 800,
    cov: 5.5,
    twv: 37,
    vrate: 84,
    hconf: 84,
    sys_pct: 24,
    per_pct: 76,
    ap: {
      criminal_gangster: 35.1,
      family_antagonist: 21.6,
      jealous_lover: 5.4,
      "landlord/zamindar": 8.1,
      corrupt_politician: 5.4,
      corporate_villain: 2.7,
      corrupt_police: 16.2,
      terrorist: 2.7,
      colonial_oppressor: 0,
      supernatural: 2.7,
      patriarchal_system: 0,
      "system/society": 0,
      "religious_extremist/cult_leader": 0
    },
    af: {
      criminal_gangster: ["Satya", "Tejaa", "Baaghi"],
      family_antagonist: ["Dilwale Dulhania", "Bol Radha Bol"],
      corrupt_police: ["Appu Raja", "Saathi", "Phoolan Hasina"],
      terrorist: ["Sarfarosh"]
    },
    pp: {
      criminal_individual: 33.3,
      personal: 25.6,
      state_political: 20.5,
      corporate_institutional: 2.6,
      feudal: 7.7,
      foreign_threat: 2.6,
      supernatural: 2.6
    },
    pf: {
      criminal_individual: ["Satya", "Tejaa", "Baaghi"],
      state_political: ["Appu Raja", "Saathi"],
      personal: ["Dilwale Dulhania"],
      feudal: ["Prem Qaidi", "Maharaja"]
    },
    warn: ["84% villain rate — may reflect curation bias"]
  },
  {
    decade: "2000s",
    sample: 62,
    real: 1000,
    cov: 6.2,
    twv: 31,
    vrate: 50,
    hconf: 66,
    sys_pct: 39,
    per_pct: 61,
    ap: {
      criminal_gangster: 32.3,
      family_antagonist: 9.7,
      jealous_lover: 12.9,
      "landlord/zamindar": 0,
      corrupt_politician: 19.4,
      corporate_villain: 12.9,
      corrupt_police: 0,
      terrorist: 3.2,
      colonial_oppressor: 3.2,
      supernatural: 3.2,
      patriarchal_system: 0,
      "system/society": 3.2,
      "religious_extremist/cult_leader": 0
    },
    af: {
      criminal_gangster: ["Company", "Maqbool", "Om Shanti Om"],
      corrupt_politician: ["Rang De Basanti", "Sarkar", "Lage Raho Munna Bhai"],
      corporate_villain: ["Page 3", "Guru", "No Smoking"],
      colonial_oppressor: ["Lagaan"],
      "system/society": ["Swades"]
    },
    pp: {
      criminal_individual: 29,
      personal: 22.6,
      state_political: 16.1,
      corporate_institutional: 22.6,
      foreign_threat: 3.2,
      colonial_state: 3.2,
      supernatural: 3.2
    },
    pf: {
      criminal_individual: ["Company", "Maqbool"],
      corporate_institutional: ["Rang De Basanti", "Page 3", "Guru"],
      state_political: ["Munna Bhai MBBS", "Sarkar"],
      personal: ["Soch", "Kucch To Hai"]
    },
    warn: ["2000s additions may slightly overcount system villains"]
  },
  {
    decade: "2010s",
    sample: 97,
    real: 1500,
    cov: 6.5,
    twv: 64,
    vrate: 66,
    hconf: 81,
    sys_pct: 38,
    per_pct: 61,
    ap: {
      criminal_gangster: 23.4,
      family_antagonist: 10.9,
      jealous_lover: 6.2,
      "landlord/zamindar": 1.6,
      corrupt_politician: 9.4,
      corporate_villain: 7.8,
      corrupt_police: 9.4,
      terrorist: 9.4,
      colonial_oppressor: 0,
      supernatural: 9.4,
      patriarchal_system: 6.2,
      "system/society": 3.1,
      "religious_extremist/cult_leader": 1.6
    },
    af: {
      criminal_gangster: ["Gangs of Wasseypur", "Agneepath", "Animal"],
      corrupt_politician: ["Raajneeti", "Dabangg", "Udta Punjab"],
      corrupt_police: ["Talaash", "Talvar", "Masaan"],
      terrorist: ["Kahaani", "Neerja", "Raazi"],
      patriarchal_system: ["Queen", "NH10", "Pink"],
      supernatural: ["Ra.One", "Krrish 3", "Stree"],
      corporate_villain: ["Dirty Picture", "Bhopal", "Super 30"]
    },
    pp: {
      criminal_individual: 17.2,
      personal: 17.2,
      state_political: 18.8,
      corporate_institutional: 17.2,
      feudal: 1.6,
      foreign_threat: 10.9,
      supernatural: 9.4,
      patriarchal: 6.2,
      other: 1.6
    },
    pf: {
      state_political: ["Raajneeti", "Dabangg", "Talaash"],
      criminal_individual: ["Gangs of Wasseypur", "Agneepath"],
      corporate_institutional: ["Dirty Picture", "Bhopal", "Super 30"],
      foreign_threat: ["Kahaani", "Neerja", "Raazi"],
      supernatural: ["Ra.One", "Krrish 3", "Stree"],
      patriarchal: ["Queen", "NH10", "Pink"]
    },
    warn: []
  },
  {
    decade: "2020s",
    sample: 57,
    real: 600,
    cov: 9.5,
    twv: 40,
    vrate: 70,
    hconf: 96,
    sys_pct: 55,
    per_pct: 45,
    ap: {
      criminal_gangster: 12.5,
      family_antagonist: 5,
      jealous_lover: 0,
      "landlord/zamindar": 0,
      corrupt_politician: 12.5,
      corporate_villain: 7.5,
      corrupt_police: 10,
      terrorist: 22.5,
      colonial_oppressor: 10,
      supernatural: 5,
      patriarchal_system: 5,
      "system/society": 2.5,
      "religious_extremist/cult_leader": 7.5
    },
    af: {
      terrorist: ["Shershaah", "Pathaan", "Sooryavanshi", "Tiger 3"],
      colonial_oppressor: ["RRR", "Tanhaji", "Sardar Udham"],
      corrupt_police: ["Jai Bhim", "Vikram Vedha", "Drishyam 2"],
      corrupt_politician: ["Thalaivii", "Sherni", "Article 370"],
      "religious_extremist/cult_leader": ["The Kashmir Files", "Sirf Ek Bandaa", "Singham Returns"],
      corporate_villain: ["Jawan", "Ram Setu"]
    },
    pp: {
      criminal_individual: 9.8,
      personal: 4.9,
      state_political: 22,
      corporate_institutional: 12.2,
      foreign_threat: 22,
      colonial_state: 9.8,
      supernatural: 4.9,
      patriarchal: 4.9,
      other: 7.3
    },
    pf: {
      foreign_threat: ["Shershaah", "Pathaan", "Sooryavanshi"],
      state_political: ["Jai Bhim", "Thalaivii", "Article 370"],
      corporate_institutional: ["Sherni", "Jawan", "Ram Setu"],
      colonial_state: ["RRR", "Tanhaji", "Sardar Udham"],
      criminal_individual: ["Haseen Dillruba", "Gangubai"]
    },
    warn: ["Weighted toward top box office — OTT and indie underrepresented"]
  }
];

export const ARCHS = [
  "criminal_gangster",
  "terrorist",
  "family_antagonist",
  "jealous_lover",
  "landlord/zamindar",
  "corrupt_politician",
  "corporate_villain",
  "corrupt_police",
  "colonial_oppressor",
  "supernatural",
  "patriarchal_system",
  "system/society",
  "religious_extremist/cult_leader"
];

export const AC: Record<string, string> = {
  criminal_gangster: "#ef4444",   // vivid red (contrast: 5.6:1 against deep charcoal/black)
  terrorist: "#f97316",           // vibrant orange (contrast: 6.0:1)
  family_antagonist: "#f59e0b",   // crisp amber (contrast: 6.8:1)
  jealous_lover: "#ca8a04",       // balanced gold (contrast: 4.8:1)
  "landlord/zamindar": "#fbbf24", // bright bronze-gold (for visual bands, modified from dark brown for high visibility)
  corrupt_politician: "#3b82f6",  // bright blue (contrast: 4.5:1)
  corporate_villain: "#10b981",   // vibrant emerald (contrast: 5.1:1)
  corrupt_police: "#06b6d4",      // bright cyan (contrast: 5.0:1)
  colonial_oppressor: "#a855f7",  // royal purple (contrast: 4.8:1)
  supernatural: "#94a3b8",        // cool slate-gray (contrast: 6.2:1)
  patriarchal_system: "#ec4899",  // soft pink (contrast: 5.2:1)
  "system/society": "#2dd4bf",    // beautiful turquoise (contrast: 6.5:1)
  "religious_extremist/cult_leader": "#d946ef" // vivid magenta (contrast: 5.2:1)
};

export const AL: Record<string, string> = {
  criminal_gangster: "Gangster",
  terrorist: "Terrorist",
  family_antagonist: "Family Opponent",
  jealous_lover: "Jealous Lover",
  "landlord/zamindar": "Zamindar (Landlord)",
  corrupt_politician: "Politician",
  corporate_villain: "Corporate/Business",
  corrupt_police: "Corrupt Police",
  colonial_oppressor: "Colonial Oppressor",
  supernatural: "Supernatural/Gothic",
  patriarchal_system: "Patriarchy",
  "system/society": "Societal/Systemic",
  "religious_extremist/cult_leader": "Religious Extremist"
};

export const POWS = [
  "criminal_individual",
  "personal",
  "state_political",
  "corporate_institutional",
  "feudal",
  "foreign_threat",
  "colonial_state",
  "supernatural",
  "patriarchal",
  "other"
];

export const PC: Record<string, string> = {
  criminal_individual: "#f87171",   // soft vivid red
  personal: "#fbbf24",              // soft golden yellow
  state_political: "#60a5fa",       // medium-light blue
  corporate_institutional: "#34d399", // bright green
  feudal: "#fb923c",                // bright orange
  foreign_threat: "#c084fc",        // lavender purple
  colonial_state: "#f472b6",        // light rose
  supernatural: "#a1a1aa",          // cool zinc (gray)
  patriarchal: "#f43f5e",           // vibrant coral red
  other: "#71717a"                  // neutral gray
};

export const PL: Record<string, string> = {
  criminal_individual: "Criminal Organisation",
  personal: "Personal/Intimate Enmity",
  state_political: "State / Political Corruption",
  corporate_institutional: "Corporate / Institutional",
  feudal: "Feudal / Landed Oppression",
  foreign_threat: "Foreign / External Threat",
  colonial_state: "Colonial State Authority",
  supernatural: "Supernatural / Occult Force",
  patriarchal: "Patriarchal Control",
  other: "Unclassified Systemic"
};
