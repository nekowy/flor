const flowerCanvas = document.getElementById("flowerCanvas");
const ctx = flowerCanvas.getContext("2d");

// --- DOM Elements ---
const overlay = document.getElementById("overlay");
const newGardenButton = document.getElementById("new-garden-button");
const continueGardenButton = document.getElementById("continue-garden-button");
const infoPanel = document.getElementById("infoPanel");
const seedSelectorUI = document.getElementById("seedSelector");
const wateringCanToolButton = document.getElementById("wateringCanTool");
const plantingToolButton = document.getElementById("plantingTool");
const maxDaysInfoSpan = document.getElementById("max-days-info");
const timeIndicatorElement = document.getElementById("timeIndicator");
const genericTooltipElement = document.getElementById("genericTooltip");

// --- Game Constants & Config ---
const SOIL_HEIGHT = 80;
const SOIL_COLOR = "#8B4513";
const DAY_DURATION_MS = 60000 * 10; // 1 minute for a full day-night cycle
const SAVE_KEY = "myVirtualGardenGame";
const MAX_INACTIVITY_DAYS = 3;
maxDaysInfoSpan.textContent = MAX_INACTIVITY_DAYS;
const PLANT_TYPES = {
  GENERIC_FLOWER: {
    name: "Flor Normal",
    seedName: "Semente de Flor Normal",
    stages: [
      {
        name: "Muda",
        duration: 200,
        nextStage: 1,
        height: 0.1,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 400,
        nextStage: 2,
        height: 0.6,
        headRadius: 0.02,
        sway: 0.001,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 1,
        headRadius: 0.05,
        canProduceSeeds: true,
        sway: 0.002,
      },
      {
        name: "Murchando",
        duration: 300,
        nextStage: 4,
        height: 0.9,
        headRadius: 0.04,
        sway: 0.0005,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.8,
        headRadius: 0.03,
        sway: 0,
      },
    ],
    maxWater: 100,
    waterConsumptionPerGameHour: 0.2,
    photosynthesisRate: 0.1,
    healthDecreaseRate: 0.5,
    seedDropChance: 0.005,
    neglectSensitivity: 1,
    petalColors: ["#FFC0CB", "#FFB6C1", "#ADD8E6", "#90EE90", "#FFFFE0"],
    centerColor: "#FFD700",
  },
  ROSA: {
    name: "Rosa",
    seedName: "Semente de Rosa",
    stages: [
      {
        name: "Muda",
        duration: 220,
        nextStage: 1,
        height: 0.1,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 450,
        nextStage: 2,
        height: 0.7,
        headRadius: 0.03,
        sway: 0.0012,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 1.2,
        headRadius: 0.07,
        canProduceSeeds: true,
        sway: 0.0022,
      },
      {
        name: "Murchando",
        duration: 320,
        nextStage: 4,
        height: 1.1,
        headRadius: 0.06,
        sway: 0.0006,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 1.0,
        headRadius: 0.05,
        sway: 0,
      },
    ],
    maxWater: 120,
    waterConsumptionPerGameHour: 0.25,
    photosynthesisRate: 0.12,
    healthDecreaseRate: 0.45,
    seedDropChance: 0.004,
    neglectSensitivity: 1.1,
    petalColors: ["#FF0000", "#FF69B4", "#FFFFFF", "#FFFF00", "#FFA500"],
    centerColor: "#FFFF00",
  },
  GIRASSOL: {
    name: "Girassol",
    seedName: "Semente de Girassol",
    stages: [
      {
        name: "Muda",
        duration: 250,
        nextStage: 1,
        height: 0.2,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 500,
        nextStage: 2,
        height: 1.5,
        headRadius: 0.1,
        sway: 0.0008,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 2.5,
        headRadius: 0.2,
        canProduceSeeds: true,
        sway: 0.0015,
      },
      {
        name: "Murchando",
        duration: 350,
        nextStage: 4,
        height: 2.2,
        headRadius: 0.15,
        sway: 0.0004,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 2.0,
        headRadius: 0.1,
        sway: 0,
      },
    ],
    maxWater: 150,
    waterConsumptionPerGameHour: 0.3,
    photosynthesisRate: 0.15,
    healthDecreaseRate: 0.4,
    seedDropChance: 0.006,
    neglectSensitivity: 1.2,
    petalColors: ["#FFD700", "#FFA500"],
    centerColor: "#A0522D",
  },
  TULIPA: {
    name: "Tulipa",
    seedName: "Semente de Tulipa",
    stages: [
      {
        name: "Muda",
        duration: 180,
        nextStage: 1,
        height: 0.08,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 380,
        nextStage: 2,
        height: 0.5,
        headRadius: 0.04,
        sway: 0.001,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.8,
        headRadius: 0.06,
        canProduceSeeds: true,
        sway: 0.0018,
      },
      {
        name: "Murchando",
        duration: 280,
        nextStage: 4,
        height: 0.7,
        headRadius: 0.05,
        sway: 0.0005,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.6,
        headRadius: 0.04,
        sway: 0,
      },
    ],
    maxWater: 90,
    waterConsumptionPerGameHour: 0.18,
    photosynthesisRate: 0.09,
    healthDecreaseRate: 0.55,
    seedDropChance: 0.0045,
    neglectSensitivity: 0.9,
    petalColors: ["#FF0000", "#FFFF00", "#FFC0CB", "#FFFFFF", "#A020F0"],
    centerColor: "#32CD32",
  },
  MARGARIDA: {
    name: "Margarida",
    seedName: "Semente de Margarida",
    stages: [
      {
        name: "Muda",
        duration: 190,
        nextStage: 1,
        height: 0.09,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 390,
        nextStage: 2,
        height: 0.5,
        headRadius: 0.025,
        sway: 0.0011,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.7,
        headRadius: 0.04,
        canProduceSeeds: true,
        sway: 0.002,
      },
      {
        name: "Murchando",
        duration: 290,
        nextStage: 4,
        height: 0.6,
        headRadius: 0.03,
        sway: 0.0005,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.5,
        headRadius: 0.02,
        sway: 0,
      },
    ],
    maxWater: 95,
    waterConsumptionPerGameHour: 0.19,
    photosynthesisRate: 0.11,
    healthDecreaseRate: 0.52,
    seedDropChance: 0.0055,
    neglectSensitivity: 0.95,
    petalColors: ["#FFFFFF", "#FFFACD"],
    centerColor: "#FFD700",
  },
  LIRIO: {
    name: "Lírio",
    seedName: "Semente de Lírio",
    stages: [
      {
        name: "Muda",
        duration: 230,
        nextStage: 1,
        height: 0.12,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 460,
        nextStage: 2,
        height: 0.8,
        headRadius: 0.03,
        sway: 0.001,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 1.3,
        headRadius: 0.06,
        canProduceSeeds: true,
        sway: 0.0015,
      },
      {
        name: "Murchando",
        duration: 330,
        nextStage: 4,
        height: 1.2,
        headRadius: 0.05,
        sway: 0.0004,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 1.1,
        headRadius: 0.04,
        sway: 0,
      },
    ],
    maxWater: 110,
    waterConsumptionPerGameHour: 0.22,
    photosynthesisRate: 0.1,
    healthDecreaseRate: 0.48,
    seedDropChance: 0.004,
    neglectSensitivity: 1.0,
    petalColors: ["#FFFFFF", "#FFDAB9", "#FFB6C1", "#FFFFE0"],
    centerColor: "#FFA500",
  },
  ORQUIDEA: {
    name: "Orquídea",
    seedName: "Semente de Orquídea",
    stages: [
      {
        name: "Muda",
        duration: 280,
        nextStage: 1,
        height: 0.07,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 550,
        nextStage: 2,
        height: 0.4,
        headRadius: 0.02,
        sway: 0.0005,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.6,
        headRadius: 0.04,
        canProduceSeeds: true,
        sway: 0.0008,
      },
      {
        name: "Murchando",
        duration: 380,
        nextStage: 4,
        height: 0.5,
        headRadius: 0.03,
        sway: 0.0002,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.4,
        headRadius: 0.02,
        sway: 0,
      },
    ],
    maxWater: 80,
    waterConsumptionPerGameHour: 0.15,
    photosynthesisRate: 0.08,
    healthDecreaseRate: 0.6,
    seedDropChance: 0.003,
    neglectSensitivity: 1.3,
    petalColors: ["#DA70D6", "#BA55D3", "#FFFFFF", "#FFC0CB", "#E6E6FA"],
    centerColor: "#FFD700",
  },
  LAVANDA: {
    name: "Lavanda",
    seedName: "Semente de Lavanda",
    stages: [
      {
        name: "Muda",
        duration: 200,
        nextStage: 1,
        height: 0.1,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 420,
        nextStage: 2,
        height: 0.5,
        headRadius: 0.03,
        sway: 0.0015,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.7,
        headRadius: 0.05,
        canProduceSeeds: true,
        sway: 0.0025,
      },
      {
        name: "Murchando",
        duration: 300,
        nextStage: 4,
        height: 0.6,
        headRadius: 0.04,
        sway: 0.0007,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.5,
        headRadius: 0.03,
        sway: 0,
      },
    ],
    maxWater: 90,
    waterConsumptionPerGameHour: 0.18,
    photosynthesisRate: 0.12,
    healthDecreaseRate: 0.45,
    seedDropChance: 0.006,
    neglectSensitivity: 0.8,
    petalColors: ["#E6E6FA", "#D8BFD8", "#9370DB"],
    centerColor: "#BDB76B",
  },
  PAPOILA: {
    name: "Papoila",
    seedName: "Semente de Papoila",
    stages: [
      {
        name: "Muda",
        duration: 180,
        nextStage: 1,
        height: 0.1,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 360,
        nextStage: 2,
        height: 0.6,
        headRadius: 0.04,
        sway: 0.0018,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.9,
        headRadius: 0.07,
        canProduceSeeds: true,
        sway: 0.003,
      },
      {
        name: "Murchando",
        duration: 280,
        nextStage: 4,
        height: 0.8,
        headRadius: 0.06,
        sway: 0.001,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.7,
        headRadius: 0.05,
        sway: 0,
      },
    ],
    maxWater: 85,
    waterConsumptionPerGameHour: 0.17,
    photosynthesisRate: 0.13,
    healthDecreaseRate: 0.5,
    seedDropChance: 0.007,
    neglectSensitivity: 0.9,
    petalColors: ["#FF0000", "#FFA500", "#FFC0CB", "#FFFFFF"],
    centerColor: "#000000",
  },
  CRAVO: {
    name: "Cravo",
    seedName: "Semente de Cravo",
    stages: [
      {
        name: "Muda",
        duration: 210,
        nextStage: 1,
        height: 0.11,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 410,
        nextStage: 2,
        height: 0.55,
        headRadius: 0.035,
        sway: 0.001,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.8,
        headRadius: 0.06,
        canProduceSeeds: true,
        sway: 0.0018,
      },
      {
        name: "Murchando",
        duration: 310,
        nextStage: 4,
        height: 0.7,
        headRadius: 0.05,
        sway: 0.0005,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.6,
        headRadius: 0.04,
        sway: 0,
      },
    ],
    maxWater: 100,
    waterConsumptionPerGameHour: 0.2,
    photosynthesisRate: 0.1,
    healthDecreaseRate: 0.5,
    seedDropChance: 0.005,
    neglectSensitivity: 1.0,
    petalColors: ["#FF69B4", "#FF0000", "#FFFFFF", "#FFFF00", "#DDA0DD"],
    centerColor: "#90EE90",
  },
  HIBISCO: {
    name: "Hibisco",
    seedName: "Semente de Hibisco",
    stages: [
      {
        name: "Muda",
        duration: 240,
        nextStage: 1,
        height: 0.15,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 480,
        nextStage: 2,
        height: 0.9,
        headRadius: 0.05,
        sway: 0.001,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 1.4,
        headRadius: 0.1,
        canProduceSeeds: true,
        sway: 0.0016,
      },
      {
        name: "Murchando",
        duration: 340,
        nextStage: 4,
        height: 1.2,
        headRadius: 0.08,
        sway: 0.0004,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 1.0,
        headRadius: 0.06,
        sway: 0,
      },
    ],
    maxWater: 130,
    waterConsumptionPerGameHour: 0.28,
    photosynthesisRate: 0.13,
    healthDecreaseRate: 0.47,
    seedDropChance: 0.004,
    neglectSensitivity: 1.1,
    petalColors: ["#FF0000", "#FF69B4", "#FFA500", "#FFFF00", "#FFFFFF"],
    centerColor: "#DC143C",
  },
  CALENDULA: {
    name: "Calêndula",
    seedName: "Semente de Calêndula",
    stages: [
      {
        name: "Muda",
        duration: 170,
        nextStage: 1,
        height: 0.08,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 350,
        nextStage: 2,
        height: 0.4,
        headRadius: 0.03,
        sway: 0.0012,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.6,
        headRadius: 0.05,
        canProduceSeeds: true,
        sway: 0.0022,
      },
      {
        name: "Murchando",
        duration: 270,
        nextStage: 4,
        height: 0.5,
        headRadius: 0.04,
        sway: 0.0006,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.4,
        headRadius: 0.03,
        sway: 0,
      },
    ],
    maxWater: 90,
    waterConsumptionPerGameHour: 0.18,
    photosynthesisRate: 0.14,
    healthDecreaseRate: 0.4,
    seedDropChance: 0.0065,
    neglectSensitivity: 0.8,
    petalColors: ["#FFA500", "#FFD700", "#FF8C00"],
    centerColor: "#A0522D",
  },
  DENTE_DE_LEAO: {
    name: "Dente-de-Leão",
    seedName: "Semente de Dente-de-Leão",
    stages: [
      {
        name: "Muda",
        duration: 150,
        nextStage: 1,
        height: 0.05,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 300,
        nextStage: 2,
        height: 0.2,
        headRadius: 0.01,
        sway: 0.0005,
      },
      {
        name: "Madura (Flor)",
        duration: 300,
        nextStage: 3,
        height: 0.3,
        headRadius: 0.04,
        sway: 0.001,
        canProduceSeeds: false,
      },
      {
        name: "Murchando (Puffball)",
        duration: 400,
        nextStage: 4,
        height: 0.28,
        headRadius: 0.05,
        sway: 0.0008,
        canProduceSeeds: true,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.1,
        headRadius: 0,
        sway: 0,
      },
    ],
    maxWater: 70,
    waterConsumptionPerGameHour: 0.1,
    photosynthesisRate: 0.15,
    healthDecreaseRate: 0.3,
    seedDropChance: 0.015,
    neglectSensitivity: 0.5,
    petalColors: ["#FFFF00", "#FFEA00"],
    centerColor: "#FFFF00",
  },
  CAMPAINHA_AZUL: {
    name: "Campainha-Azul",
    seedName: "Semente de Campainha-Azul",
    stages: [
      {
        name: "Muda",
        duration: 200,
        nextStage: 1,
        height: 0.08,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 400,
        nextStage: 2,
        height: 0.3,
        headRadius: 0.015,
        sway: 0.0015,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.45,
        headRadius: 0.03,
        canProduceSeeds: true,
        sway: 0.0025,
      },
      {
        name: "Murchando",
        duration: 300,
        nextStage: 4,
        height: 0.4,
        headRadius: 0.025,
        sway: 0.0007,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.3,
        headRadius: 0.01,
        sway: 0,
      },
    ],
    maxWater: 85,
    waterConsumptionPerGameHour: 0.17,
    photosynthesisRate: 0.09,
    healthDecreaseRate: 0.53,
    seedDropChance: 0.005,
    neglectSensitivity: 1.0,
    petalColors: ["#6495ED", "#ADD8E6", "#B0E0E6"],
    centerColor: "#FFFFE0",
  },
  BOCA_DE_LEAO: {
    name: "Boca-de-Leão",
    seedName: "Semente de Boca-de-Leão",
    stages: [
      {
        name: "Muda",
        duration: 220,
        nextStage: 1,
        height: 0.1,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 430,
        nextStage: 2,
        height: 0.6,
        headRadius: 0.02,
        sway: 0.0008,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.9,
        headRadius: 0.04,
        canProduceSeeds: true,
        sway: 0.0012,
      },
      {
        name: "Murchando",
        duration: 320,
        nextStage: 4,
        height: 0.8,
        headRadius: 0.03,
        sway: 0.0003,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.7,
        headRadius: 0.02,
        sway: 0,
      },
    ],
    maxWater: 105,
    waterConsumptionPerGameHour: 0.21,
    photosynthesisRate: 0.11,
    healthDecreaseRate: 0.49,
    seedDropChance: 0.0045,
    neglectSensitivity: 0.9,
    petalColors: [
      "#FFC0CB",
      "#FFFF00",
      "#FF0000",
      "#FFA500",
      "#FFFFFF",
      "#800080",
    ],
    centerColor: "#FFD700",
  },
  PEONIA: {
    name: "Peônia",
    seedName: "Semente de Peônia",
    stages: [
      {
        name: "Muda",
        duration: 260,
        nextStage: 1,
        height: 0.12,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 520,
        nextStage: 2,
        height: 0.7,
        headRadius: 0.04,
        sway: 0.0007,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 1.0,
        headRadius: 0.09,
        canProduceSeeds: true,
        sway: 0.001,
      },
      {
        name: "Murchando",
        duration: 360,
        nextStage: 4,
        height: 0.9,
        headRadius: 0.07,
        sway: 0.0003,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.8,
        headRadius: 0.05,
        sway: 0,
      },
    ],
    maxWater: 125,
    waterConsumptionPerGameHour: 0.26,
    photosynthesisRate: 0.1,
    healthDecreaseRate: 0.5,
    seedDropChance: 0.0035,
    neglectSensitivity: 1.05,
    petalColors: ["#FFC0CB", "#FFB6C1", "#FFFFFF", "#FF69B4", "#FFE4E1"],
    centerColor: "#FFFF00",
  },
  MIOSOTIS: {
    name: "Miosótis",
    seedName: "Semente de Miosótis",
    stages: [
      {
        name: "Muda",
        duration: 160,
        nextStage: 1,
        height: 0.06,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 320,
        nextStage: 2,
        height: 0.15,
        headRadius: 0.01,
        sway: 0.002,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.25,
        headRadius: 0.02,
        canProduceSeeds: true,
        sway: 0.0035,
      },
      {
        name: "Murchando",
        duration: 260,
        nextStage: 4,
        height: 0.2,
        headRadius: 0.015,
        sway: 0.001,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.15,
        headRadius: 0.01,
        sway: 0,
      },
    ],
    maxWater: 75,
    waterConsumptionPerGameHour: 0.16,
    photosynthesisRate: 0.09,
    healthDecreaseRate: 0.58,
    seedDropChance: 0.007,
    neglectSensitivity: 0.85,
    petalColors: ["#ADD8E6", "#87CEEB", "#E0FFFF"],
    centerColor: "#FFFF00",
  },
  VIOLETA: {
    name: "Violeta",
    seedName: "Semente de Violeta",
    stages: [
      {
        name: "Muda",
        duration: 190,
        nextStage: 1,
        height: 0.07,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 370,
        nextStage: 2,
        height: 0.18,
        headRadius: 0.015,
        sway: 0.0015,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.22,
        headRadius: 0.025,
        canProduceSeeds: true,
        sway: 0.002,
      },
      {
        name: "Murchando",
        duration: 290,
        nextStage: 4,
        height: 0.2,
        headRadius: 0.02,
        sway: 0.0005,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.18,
        headRadius: 0.015,
        sway: 0,
      },
    ],
    maxWater: 80,
    waterConsumptionPerGameHour: 0.15,
    photosynthesisRate: 0.08,
    healthDecreaseRate: 0.55,
    seedDropChance: 0.006,
    neglectSensitivity: 0.9,
    petalColors: ["#8A2BE2", "#9400D3", "#BA55D3", "#FFFFFF"],
    centerColor: "#FFFFE0",
  },
  IRIS: {
    name: "Íris",
    seedName: "Semente de Íris",
    stages: [
      {
        name: "Muda",
        duration: 230,
        nextStage: 1,
        height: 0.15,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 470,
        nextStage: 2,
        height: 0.7,
        headRadius: 0.03,
        sway: 0.0009,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 1.0,
        headRadius: 0.06,
        canProduceSeeds: true,
        sway: 0.0013,
      },
      {
        name: "Murchando",
        duration: 330,
        nextStage: 4,
        height: 0.9,
        headRadius: 0.05,
        sway: 0.0004,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.8,
        headRadius: 0.04,
        sway: 0,
      },
    ],
    maxWater: 115,
    waterConsumptionPerGameHour: 0.23,
    photosynthesisRate: 0.11,
    healthDecreaseRate: 0.48,
    seedDropChance: 0.004,
    neglectSensitivity: 1.0,
    petalColors: ["#4B0082", "#8A2BE2", "#FFFF00", "#FFFFFF", "#7F00FF"],
    centerColor: "#FFA500",
  },
  FLOR_DE_CEREJEIRA: {
    name: "Flor de Cerejeira",
    seedName: "Semente de Cerejeira Ornamental",
    stages: [
      {
        name: "Broto",
        duration: 300,
        nextStage: 1,
        height: 0.1,
        headRadius: 0,
        sway: 0.0001,
      },
      {
        name: "Galhos Verdes",
        duration: 600,
        nextStage: 2,
        height: 0.5,
        headRadius: 0.005,
        sway: 0.0005,
      },
      {
        name: "Florescendo",
        duration: 700,
        nextStage: 3,
        height: 0.8,
        headRadius: 0.03,
        sway: 0.001,
        canProduceSeeds: true,
      },
      {
        name: "Pétalas Caindo",
        duration: 200,
        nextStage: 4,
        height: 0.75,
        headRadius: 0.01,
        sway: 0.0008,
      },
      {
        name: "Sem Flores",
        duration: Infinity,
        nextStage: 4,
        height: 0.7,
        headRadius: 0,
        sway: 0.0002,
      },
    ],
    maxWater: 140,
    waterConsumptionPerGameHour: 0.2,
    photosynthesisRate: 0.09,
    healthDecreaseRate: 0.5,
    seedDropChance: 0.002,
    neglectSensitivity: 1.1,
    petalColors: ["#FFB6C1", "#FFC0CB", "#FFFFFF", "#FFE4E1"],
    centerColor: "#FFD700",
  },
  LOTUS: {
    name: "Lótus",
    seedName: "Semente de Lótus",
    stages: [
      {
        name: "Muda",
        duration: 250,
        nextStage: 1,
        height: 0.05,
        headRadius: 0,
        sway: 0,
      },
      {
        name: "Crescendo",
        duration: 500,
        nextStage: 2,
        height: 0.4,
        headRadius: 0.02,
        sway: 0.0005,
      },
      {
        name: "Madura",
        duration: Infinity,
        nextStage: 2,
        height: 0.6,
        headRadius: 0.08,
        canProduceSeeds: true,
        sway: 0.0008,
      },
      {
        name: "Murchando",
        duration: 350,
        nextStage: 4,
        height: 0.5,
        headRadius: 0.06,
        sway: 0.0003,
      },
      {
        name: "Morta",
        duration: Infinity,
        nextStage: 4,
        height: 0.4,
        headRadius: 0.03,
        sway: 0,
      },
    ],
    maxWater: 180,
    waterConsumptionPerGameHour: 0.35,
    photosynthesisRate: 0.12,
    healthDecreaseRate: 0.45,
    seedDropChance: 0.003,
    neglectSensitivity: 1.2,
    petalColors: ["#FFC0CB", "#FFFFFF", "#FFFACD", "#F0E68C"],
    centerColor: "#FFD700",
  },
};
// --- Game State ---
let gameState = {
  plants: [],
  particles: [],
  playerInventory: {
    seeds: {
      GENERIC_FLOWER: 1,
      ROSA: 1,
      GIRASSOL: 1,
      TULIPA: 1,
      MARGARIDA: 1,
      LIRIO: 1,
      ORQUIDEA: 1,
      LAVANDA: 1,
      PAPOILA: 1,
      CRAVO: 1,
      HIBISCO: 1,
      CALENDULA: 1,
      DENTE_DE_LEAO: 1,
      CAMPAINHA_AZUL: 1,
      BOCA_DE_LEAO: 1,
      PEONIA: 1,
      MIOSOTIS: 1,
      VIOLETA: 1,
      IRIS: 1,
      FLOR_DE_CEREJEIRA: 1,
      LOTUS: 1,
    },
  },
  gameTime: 0,
  lastUpdateTimestamp: Date.now(),
  lastSaveTimestamp: Date.now(),
  selectedPlantID: null,
  hoveredPlantID: null,
  mousePosition: { x: 0, y: 0 }, // Will be updated by mouse and touch
  currentTool: null,
  selectedSeedTypeForPlanting: null,
  skyColor: "#87CEEB",
};

let animationFrameId;

// --- Particle System ---
class Particle {
  constructor(x, y, type, options = {}) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.vx = options.vx || (Math.random() - 0.5) * 2;
    this.vy = options.vy || Math.random() * -2 - 1;
    this.gravity = options.gravity || 0.1;
    this.lifespan = options.lifespan || 60;
    this.age = 0;
    this.radius = options.radius || Math.random() * 2 + 1;
    this.color = options.color || "rgba(100, 150, 255, 0.7)";
    this.targetX = options.targetX;
    this.targetY = options.targetY;
    this.alpha = 1;
  }
  update() {
    this.age++;
    if (this.age >= this.lifespan) return true;
    this.alpha = 1 - this.age / this.lifespan;
    if (this.type === "water") {
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      if (this.y > flowerCanvas.height - SOIL_HEIGHT + this.radius) {
        this.vy *= -0.4;
        this.vx *= 0.8;
        this.y = flowerCanvas.height - SOIL_HEIGHT + this.radius;
        if (Math.abs(this.vy) < 0.1) this.lifespan = this.age + 5;
      }
    } else if (this.type === "seed_collect") {
      const dx = this.targetX - this.x,
        dy = this.targetY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 5;
      if (dist < speed) return true;
      this.vx = (dx / dist) * speed;
      this.vy = (dy / dist) * speed;
      this.x += this.vx;
      this.y += this.vy;
    }
    return false;
  }
  draw(ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    if (this.type === "seed_collect") {
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();
    } else {
      ctx.arc(this.x, this.y, this.radius * this.alpha, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
}
function createWaterSplash(x, y, count = 10) {
  for (let i = 0; i < count; i++) {
    gameState.particles.push(
      new Particle(x, y, "water", {
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * -3 - 2,
        radius: Math.random() * 3 + 2,
        lifespan: 30 + Math.random() * 30,
        color: `rgba(${100 + Math.random() * 50}, ${
          150 + Math.random() * 50
        }, 255, ${0.5 + Math.random() * 0.3})`,
      })
    );
  }
}
function createSeedCollectEffect(startX, startY) {
  const seedSelectorRect = seedSelectorUI.getBoundingClientRect();
  const targetX = seedSelectorRect.left + seedSelectorRect.width / 2;
  const targetY = seedSelectorRect.top + seedSelectorRect.height / 2;
  gameState.particles.push(
    new Particle(startX, startY, "seed_collect", {
      targetX: targetX,
      targetY: targetY,
      radius: 4,
      lifespan: 80,
      color: PLANT_TYPES.GENERIC_FLOWER.centerColor, // Generic seed color, consider plant-specific
    })
  );
}

// --- Helper Functions ---
function lerpColor(colorA, colorB, amount) {
  const ar = colorA.r,
    ag = colorA.g,
    ab = colorA.b;
  const br = colorB.r,
    bg = colorB.g,
    bb = colorB.b;
  const r = ar + (br - ar) * amount;
  const g = ag + (bg - ag) * amount;
  const b = ab + (bb - ab) * amount;
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}
function hexToRgb(hex) {
  let bigint = parseInt(hex.slice(1), 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;
  return { r, g, b };
}

const SKY_PHASES = {
  dawn: { r: 255, g: 192, b: 203 },
  day: { r: 135, g: 206, b: 235 },
  dusk: { r: 255, g: 140, b: 0 },
  night: { r: 25, g: 25, b: 112 },
};
function getCurrentSkyAppearance() {
  const timeOfDay = (gameState.gameTime % DAY_DURATION_MS) / DAY_DURATION_MS;
  let color, lightLevel;
  if (timeOfDay < 0.25) {
    color = lerpColor(SKY_PHASES.night, SKY_PHASES.dawn, timeOfDay / 0.25);
    lightLevel = (timeOfDay / 0.25) * 0.5;
  } else if (timeOfDay < 0.5) {
    color = lerpColor(
      SKY_PHASES.dawn,
      SKY_PHASES.day,
      (timeOfDay - 0.25) / 0.25
    );
    lightLevel = 0.3 + ((timeOfDay - 0.25) / 0.25) * 0.7;
  } else if (timeOfDay < 0.75) {
    color = lerpColor(
      SKY_PHASES.day,
      SKY_PHASES.dusk,
      (timeOfDay - 0.5) / 0.25
    );
    lightLevel = 1.0 - ((timeOfDay - 0.5) / 0.25) * 0.7;
  } else {
    color = lerpColor(
      SKY_PHASES.dusk,
      SKY_PHASES.night,
      (timeOfDay - 0.75) / 0.25
    );
    lightLevel = 0.5 * (1 - (timeOfDay - 0.75) / 0.25);
  }
  gameState.skyColor = color;
  return { color, lightLevel: Math.max(0.05, lightLevel) };
}
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

// --- Plant Class ---
class Plant {
  constructor(x, y, typeKey = "GENERIC_FLOWER", existingData = null) {
    this.id = existingData?.id || generateId();
    this.x = x;
    this.y = y;
    this.typeKey = typeKey;
    this.config = PLANT_TYPES[typeKey];
    this.currentStageIndex = existingData?.currentStageIndex || 0;
    this.stageProgress = existingData?.stageProgress || 0;
    this.waterLevel = existingData?.waterLevel || this.config.maxWater * 0.7;
    this.health = existingData?.health || 100;
    this.isAlive =
      existingData?.isAlive !== undefined ? existingData.isAlive : true;
    this.timeOverwatered = existingData?.timeOverwatered || 0;
    this.timeSinceLastCare = existingData?.timeSinceLastCare || 0;
    this.visualHeight = existingData?.visualHeight || 0;
    this.visualHeadRadius = existingData?.visualHeadRadius || 0;
    this.petalColor =
      existingData?.petalColor ||
      this.config.petalColors[
        Math.floor(Math.random() * this.config.petalColors.length)
      ];
    this.swayAngle = 0;
    this.swaySpeed = (Math.random() - 0.5) * 0.02 + 0.01;
    if (this.health <= 0) this.die(false);
  }
  get currentStageData() {
    return this.config.stages[this.currentStageIndex];
  }
  update(deltaTime, lightLevel) {
    if (!this.isAlive) return;
    const gameHoursPassed = deltaTime / (DAY_DURATION_MS / 24);
    this.waterLevel -=
      this.config.waterConsumptionPerGameHour * gameHoursPassed;
    this.waterLevel = Math.max(0, this.waterLevel);
    if (this.currentStageIndex < 3) {
      // Assuming stage 3 is 'Murchando'
      if (this.waterLevel > 20 && lightLevel > 0.2) {
        this.stageProgress +=
          this.config.photosynthesisRate *
          lightLevel *
          (this.waterLevel / this.config.maxWater);
      }
    }
    if (this.waterLevel < 20)
      this.health -=
        this.config.healthDecreaseRate * ((20 - this.waterLevel) / 20);
    else if (this.waterLevel > this.config.maxWater) {
      this.timeOverwatered++;
      if (this.timeOverwatered > 150)
        this.health -= this.config.healthDecreaseRate * 0.5;
    } else {
      this.timeOverwatered = 0;
      if (this.health < 100 && this.waterLevel > 50)
        this.health = Math.min(
          100,
          this.health + this.config.healthDecreaseRate * 0.1
        );
    }
    this.health = Math.max(0, this.health);
    if (this.health <= 0) this.die();
    if (
      this.stageProgress >= this.currentStageData.duration &&
      this.currentStageData.nextStage !== this.currentStageIndex
    ) {
      this.currentStageIndex = this.currentStageData.nextStage;
      this.stageProgress = 0;
    }
    if (this.health < 15 && this.currentStageIndex < 3 && this.isAlive) {
      // Ensure not already wilting or dead
      this.currentStageIndex = 3; // Assuming stage 3 is 'Murchando' for all plants
      this.stageProgress = 0;
    }
    if (
      this.currentStageData.canProduceSeeds &&
      this.health > 70 &&
      Math.random() < this.config.seedDropChance
    ) {
      gameState.playerInventory.seeds[this.typeKey] =
        (gameState.playerInventory.seeds[this.typeKey] || 0) + 1;
      createSeedCollectEffect(
        this.x,
        this.y - this.visualHeight - this.visualHeadRadius - 10
      );
      updateSeedSelector();
    }
    const targetVisualHeight =
      (this.currentStageData.height / 3) *
      (flowerCanvas.height - SOIL_HEIGHT) *
      0.7;
    const targetVisualHeadRadius =
      this.currentStageData.headRadius *
      (flowerCanvas.height - SOIL_HEIGHT) *
      0.1;
    this.visualHeight += (targetVisualHeight - this.visualHeight) * 0.05;
    this.visualHeadRadius +=
      (targetVisualHeadRadius - this.visualHeadRadius) * 0.05;
    if (this.isAlive && this.currentStageData.sway > 0 && this.health > 30) {
      this.swayAngle =
        Math.sin(gameState.gameTime * 0.001 * this.swaySpeed) *
        this.currentStageData.sway *
        (this.visualHeight / targetVisualHeight);
    } else this.swayAngle = 0;
  }
  die(triggerSave = true) {
    this.isAlive = false;
    this.health = 0;
    this.currentStageIndex = 4; // Assuming stage 4 is 'Morta' for all plants
    this.stageProgress = 0;
    this.swayAngle = 0;
    if (triggerSave && gameState.selectedPlantID === this.id) updateInfoPanel();
  }
  water(amount) {
    if (!this.isAlive) return;
    this.waterLevel = Math.min(
      this.config.maxWater * 1.2,
      this.waterLevel + amount
    );
    this.timeSinceLastCare = 0;
  }
  draw(ctx) {
    const stageData = this.currentStageData;
    const stemWidth = Math.max(
      3,
      this.visualHeadRadius * 0.2 + (this.isAlive ? 0 : -1)
    );
    const flowerTopY = this.y - this.visualHeight;
    ctx.save();
    if (this.swayAngle !== 0) {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.swayAngle);
      ctx.translate(-this.x, -this.y);
    }
    const stemColor = this.isAlive
      ? this.health < 30
        ? "#a39071"
        : "#2e7d32"
      : "#4a3B2A";
    ctx.fillStyle = stemColor;
    ctx.fillRect(
      this.x - stemWidth / 2,
      flowerTopY,
      stemWidth,
      this.visualHeight
    );
    if (this.visualHeadRadius > 0 && this.currentStageIndex < 4) {
      // Not dead
      const numPetals = 5 + Math.floor(this.visualHeadRadius / 5);
      const petalHealthFactor = this.isAlive
        ? (this.health / 100) * 0.8 + 0.2
        : 0.3;
      const petalBaseColor = this.isAlive
        ? this.health < 40
          ? tinycolor(this.petalColor).desaturate(40).darken(10).toString()
          : this.petalColor
        : tinycolor(this.petalColor).desaturate(70).darken(30).toString();
      ctx.fillStyle = petalBaseColor;
      for (let i = 0; i < numPetals; i++) {
        const angle = (i / numPetals) * Math.PI * 2;
        ctx.save();
        ctx.translate(this.x, flowerTopY);
        ctx.rotate(angle);
        if (this.isAlive && this.health < 50)
          ctx.rotate(
            (Math.PI / 12) * (1 - this.health / 50) * (i % 2 === 0 ? 1 : -0.5)
          );
        ctx.beginPath();
        const petalLength = this.visualHeadRadius * 2.5 * petalHealthFactor;
        const petalWidth = this.visualHeadRadius * 1.2 * petalHealthFactor;
        ctx.ellipse(
          0,
          -petalLength * 0.6,
          petalWidth * 0.5,
          petalLength * 0.5,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }
      const centerColor = this.isAlive
        ? this.health < 40
          ? tinycolor(this.config.centerColor).desaturate(30).toString()
          : this.config.centerColor
        : tinycolor(this.config.centerColor)
            .desaturate(60)
            .darken(20)
            .toString();
      ctx.fillStyle = centerColor;
      ctx.beginPath();
      ctx.arc(
        this.x,
        flowerTopY,
        this.visualHeadRadius * (this.isAlive ? 1 : 0.8),
        0,
        Math.PI * 2
      );
      ctx.fill();
    } else if (this.currentStageIndex === 4) {
      // Dead
      ctx.fillStyle = "#4a3B2A";
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        const deadPetalRadius =
          (this.visualHeadRadius > 0 ? this.visualHeadRadius : 5) *
          (0.5 + Math.random() * 0.3);
        const angle = Math.random() * Math.PI * 2;
        const offsetX = Math.cos(angle) * deadPetalRadius * 1.5;
        const offsetY =
          Math.sin(angle) * deadPetalRadius * 0.5 + this.visualHeight * 0.05;
        ctx.ellipse(
          this.x + offsetX,
          flowerTopY + this.visualHeight * 0.1 + offsetY,
          deadPetalRadius * 0.8,
          deadPetalRadius * 0.3,
          Math.random() * Math.PI,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      ctx.fillRect(
        this.x - stemWidth / 2,
        this.y - stemWidth * 2,
        stemWidth,
        stemWidth * 2
      ); // Stump
    }
    ctx.restore();
  }
  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      typeKey: this.typeKey,
      currentStageIndex: this.currentStageIndex,
      stageProgress: this.stageProgress,
      waterLevel: this.waterLevel,
      health: this.health,
      isAlive: this.isAlive,
      timeOverwatered: this.timeOverwatered,
      timeSinceLastCare: this.timeSinceLastCare,
      visualHeight: this.visualHeight,
      visualHeadRadius: this.visualHeadRadius,
      petalColor: this.petalColor,
    };
  }
}

// --- Tooltip Drawing Functions ---
function drawPlantTooltip(plant, mouseX, mouseY) {
  if (!plant) return;
  const lines = [
    `${plant.config.name} (${
      plant.isAlive ? plant.currentStageData.name : "Morta"
    })`,
    `Saúde: ${plant.health.toFixed(0)}%`,
    `Água: ${plant.waterLevel.toFixed(0)}/${plant.config.maxWater}`,
  ];
  ctx.font = "12px Inter, sans-serif";
  const padding = 8;
  let maxWidth = 0;
  lines.forEach((line) => {
    maxWidth = Math.max(maxWidth, ctx.measureText(line).width);
  });
  const boxWidth = maxWidth + padding * 2;
  const lineHeight = 14;
  const boxHeight = lines.length * lineHeight + padding * 2 - (lineHeight - 12);
  let tooltipX = mouseX + 15;
  let tooltipY = mouseY + 15;
  if (tooltipX + boxWidth > flowerCanvas.width)
    tooltipX = mouseX - boxWidth - 15;
  if (tooltipY + boxHeight > flowerCanvas.height)
    tooltipY = mouseY - boxHeight - 15;
  tooltipX = Math.max(0, Math.min(tooltipX, flowerCanvas.width - boxWidth)); // Ensure tooltip stays within canvas bounds
  tooltipY = Math.max(0, Math.min(tooltipY, flowerCanvas.height - boxHeight));

  ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1;
  const r = 5;
  ctx.beginPath();
  ctx.moveTo(tooltipX + r, tooltipY);
  ctx.lineTo(tooltipX + boxWidth - r, tooltipY);
  ctx.quadraticCurveTo(
    tooltipX + boxWidth,
    tooltipY,
    tooltipX + boxWidth,
    tooltipY + r
  );
  ctx.lineTo(tooltipX + boxWidth, tooltipY + boxHeight - r);
  ctx.quadraticCurveTo(
    tooltipX + boxWidth,
    tooltipY + boxHeight,
    tooltipX + boxWidth - r,
    tooltipY + boxHeight
  );
  ctx.lineTo(tooltipX + r, tooltipY + boxHeight);
  ctx.quadraticCurveTo(
    tooltipX,
    tooltipY + boxHeight,
    tooltipX,
    tooltipY + boxHeight - r
  );
  ctx.lineTo(tooltipX, tooltipY + r);
  ctx.quadraticCurveTo(tooltipX, tooltipY, tooltipX + r, tooltipY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "white";
  lines.forEach((line, index) => {
    ctx.fillText(
      line,
      tooltipX + padding,
      tooltipY + padding + index * lineHeight + 10
    );
  });
}
function drawSoilTooltip(mouseX, mouseY) {
  const text = "Solo Fértil";
  ctx.font = "12px Inter, sans-serif";
  const padding = 8;
  const textWidth = ctx.measureText(text).width;
  const boxWidth = textWidth + padding * 2;
  const boxHeight = 12 + padding * 2;
  let tooltipX = mouseX + 15;
  let tooltipY = mouseY - boxHeight - 10;
  if (tooltipX + boxWidth > flowerCanvas.width)
    tooltipX = mouseX - boxWidth - 15;
  if (tooltipY < 0) tooltipY = mouseY + 15;
  tooltipX = Math.max(0, Math.min(tooltipX, flowerCanvas.width - boxWidth));
  tooltipY = Math.max(0, Math.min(tooltipY, flowerCanvas.height - boxHeight));

  ctx.fillStyle = "rgba(75, 54, 33, 0.85)";
  ctx.strokeStyle = "rgba(200, 150, 100, 0.5)";
  ctx.lineWidth = 1;
  const r = 5;
  ctx.beginPath();
  ctx.moveTo(tooltipX + r, tooltipY);
  ctx.lineTo(tooltipX + boxWidth - r, tooltipY);
  ctx.quadraticCurveTo(
    tooltipX + boxWidth,
    tooltipY,
    tooltipX + boxWidth,
    tooltipY + r
  );
  ctx.lineTo(tooltipX + boxWidth, tooltipY + boxHeight - r);
  ctx.quadraticCurveTo(
    tooltipX + boxWidth,
    tooltipY + boxHeight,
    tooltipX + boxWidth - r,
    tooltipY + boxHeight
  );
  ctx.lineTo(tooltipX + r, tooltipY + boxHeight);
  ctx.quadraticCurveTo(
    tooltipX,
    tooltipY + boxHeight,
    tooltipX,
    tooltipY + boxHeight - r
  );
  ctx.lineTo(tooltipX, tooltipY + r);
  ctx.quadraticCurveTo(tooltipX, tooltipY, tooltipX + r, tooltipY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "white";
  ctx.fillText(text, tooltipX + padding, tooltipY + padding + 10);
}

// --- Time of Day Naming ---
function getDayPhaseName(hour) {
  if (hour >= 5 && hour < 8) return "Amanhecer";
  if (hour >= 8 && hour < 12) return "Manhã";
  if (hour >= 12 && hour < 17) return "Tarde";
  if (hour >= 17 && hour < 20) return "Entardecer";
  return "Noite";
}

// --- Game Loop & Drawing ---
function gameLoop(timestamp) {
  const deltaTime = timestamp - gameState.lastUpdateTimestamp;
  gameState.lastUpdateTimestamp = timestamp;
  gameState.gameTime += deltaTime;
  const sky = getCurrentSkyAppearance();
  const currentLightLevel = sky.lightLevel;
  const totalMinutesInDay = 24 * 60;
  const gameTimeInCycle = gameState.gameTime % DAY_DURATION_MS;
  const gameMinutesTotal =
    (gameTimeInCycle / DAY_DURATION_MS) * totalMinutesInDay;
  const gameHour = Math.floor((gameMinutesTotal / 60) % 24);
  const gameMinute = Math.floor(gameMinutesTotal % 60);
  const phaseName = getDayPhaseName(gameHour);
  timeIndicatorElement.textContent = `${String(gameHour).padStart(
    2,
    "0"
  )}:${String(gameMinute).padStart(2, "0")} - ${phaseName}`;

  ctx.fillStyle = sky.color;
  ctx.fillRect(0, 0, flowerCanvas.width, flowerCanvas.height);
  ctx.fillStyle = SOIL_COLOR;
  ctx.fillRect(
    0,
    flowerCanvas.height - SOIL_HEIGHT,
    flowerCanvas.width,
    SOIL_HEIGHT
  );

  gameState.plants.forEach((plant) => {
    plant.update(deltaTime, currentLightLevel);
    plant.draw(ctx);
  });
  gameState.particles = gameState.particles.filter((particle) => {
    const remove = particle.update();
    if (!remove) particle.draw(ctx);
    return !remove;
  });

  if (gameState.hoveredPlantID) {
    const plant = gameState.plants.find(
      (p) => p.id === gameState.hoveredPlantID
    );
    if (plant)
      drawPlantTooltip(
        plant,
        gameState.mousePosition.x,
        gameState.mousePosition.y
      );
  } else if (
    gameState.mousePosition.y > flowerCanvas.height - SOIL_HEIGHT &&
    gameState.mousePosition.y < flowerCanvas.height &&
    !gameState.currentTool
  ) {
    drawSoilTooltip(gameState.mousePosition.x, gameState.mousePosition.y);
  }

  if (timestamp - gameState.lastSaveTimestamp > 10000) {
    saveGame();
    gameState.lastSaveTimestamp = timestamp;
  }
  animationFrameId = requestAnimationFrame(gameLoop);
}

// --- UI & Interaction ---
function resizeCanvas() {
  const newWidth = window.innerWidth * 0.95;
  const newHeight = window.innerHeight * 0.95;

  if (flowerCanvas.width !== newWidth || flowerCanvas.height !== newHeight) {
    flowerCanvas.width = newWidth;
    flowerCanvas.height = newHeight;
    flowerCanvas.style.width = newWidth + "px";
    flowerCanvas.style.height = newHeight + "px";
    flowerCanvas.style.minHeight = newHeight + "px";
    flowerCanvas.style.minWidth = newWidth + "px";
    flowerCanvas.style.position = "fixed";
    flowerCanvas.style.top = "10px";
    flowerCanvas.style.left = "10px";
    flowerCanvas.style.border = "1px solid #777";
    flowerCanvas.style.borderRadius = "5px";
  }
}
function updateInfoPanel() {
  const plant = gameState.plants.find(
    (p) => p.id === gameState.selectedPlantID
  );
  if (plant) {
    infoPanel.style.display = "block";
    infoPanel.innerHTML = `
      <p><strong>${
        plant.config.name
      }</strong> <span style="font-size:0.8em; color:#777;">(ID: ${plant.id.substring(
      0,
      4
    )})</span></p>
      <p>Estágio: ${plant.currentStageData.name}</p>
      <p>Saúde: <span style="color:${
        plant.health < 30 ? "red" : plant.health < 60 ? "orange" : "green"
      }">${plant.health.toFixed(1)}%</span></p>
      <p>Água: ${plant.waterLevel.toFixed(1)} / ${plant.config.maxWater}</p>
      <p>${
        plant.isAlive
          ? plant.health < 15
            ? "💔 Quase morrendo!"
            : plant.health < 40
            ? "💛 Murchando"
            : "💚 Saudável"
          : "☠️ Morta"
      }</p>`;
  } else infoPanel.style.display = "none";
}
function updateSeedSelector() {
  seedSelectorUI.innerHTML = "<h4>Plantar Semente:</h4>";
  let hasSeeds = false;
  for (const typeKey in gameState.playerInventory.seeds) {
    const count = gameState.playerInventory.seeds[typeKey];
    if (count > 0) {
      hasSeeds = true;
      const plantConf = PLANT_TYPES[typeKey];
      const btn = document.createElement("button");
      btn.classList.add("seed-button");
      btn.textContent = `${plantConf.seedName} (x${count})`;
      btn.dataset.seedType = typeKey;
      if (
        gameState.currentTool === "planting" &&
        gameState.selectedSeedTypeForPlanting === typeKey
      )
        btn.classList.add("selected");
      btn.onclick = () => {
        // Use onclick for simplicity, will also work for touch taps
        if (gameState.currentTool === "planting") {
          gameState.selectedSeedTypeForPlanting = typeKey;
          document
            .querySelectorAll("#seedSelector .seed-button")
            .forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
        }
      };
      seedSelectorUI.appendChild(btn);
    }
  }
  if (!hasSeeds) seedSelectorUI.innerHTML += "<p>Você não tem sementes.</p>";
}
function setActiveTool(toolName) {
  gameState.currentTool = toolName;
  wateringCanToolButton.classList.toggle("active", toolName === "watering");
  plantingToolButton.classList.toggle("active", toolName === "planting");
  seedSelectorUI.style.display = toolName === "planting" ? "block" : "none";
  flowerCanvas.classList.remove("tool-active-watering", "tool-active-planting");
  if (toolName === "watering")
    flowerCanvas.classList.add("tool-active-watering");
  else if (toolName === "planting")
    flowerCanvas.classList.add("tool-active-planting");
  if (toolName === "planting") updateSeedSelector();
  else gameState.selectedSeedTypeForPlanting = null;
}

// --- Canvas Event Listeners (Mouse and Touch) ---

// Helper to get touch position relative to canvas
function getTouchPos(canvas, touchEvent, useChangedTouches = false) {
  const rect = canvas.getBoundingClientRect();
  const touch = useChangedTouches
    ? touchEvent.changedTouches[0]
    : touchEvent.touches[0];
  if (!touch) return null;
  return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
}

// Helper to find which plant is under the mouse/touch
function getPlantAt(x, y) {
  for (let i = gameState.plants.length - 1; i >= 0; i--) {
    const plant = gameState.plants[i];
    const plantTop = plant.y - plant.visualHeight - plant.visualHeadRadius;
    const plantBottom = plant.y;
    // Make interaction area slightly more generous for touch
    const plantLeniency = Math.max(
      plant.visualHeadRadius,
      plant.currentStageData.sway > 0 ? 25 : 15
    );
    const plantLeft = plant.x - plantLeniency;
    const plantRight = plant.x + plantLeniency;

    if (
      x >= plantLeft &&
      x <= plantRight &&
      y >= plantTop &&
      y <= plantBottom
    ) {
      return plant;
    }
  }
  return null;
}

function updateHoveredPlant() {
  const plant = getPlantAt(
    gameState.mousePosition.x,
    gameState.mousePosition.y
  );
  gameState.hoveredPlantID = plant ? plant.id : null;
}

// Centralized logic for what happens on a click/tap
function processCanvasAction() {
  const clickX = gameState.mousePosition.x;
  const clickY = gameState.mousePosition.y;

  if (gameState.currentTool === "watering") {
    if (clickY > flowerCanvas.height - SOIL_HEIGHT - 20) {
      // Allow watering slightly above soil
      createWaterSplash(
        clickX,
        Math.min(clickY, flowerCanvas.height - SOIL_HEIGHT + 5)
      );
      const waterAmount = 20;
      const waterRadius = 60; // Increased radius for easier tapping on mobile
      gameState.plants.forEach((plant) => {
        const distToPlantBase = Math.sqrt(
          Math.pow(plant.x - clickX, 2) + Math.pow(plant.y - clickY, 2)
        );
        if (
          distToPlantBase < waterRadius &&
          plant.y === flowerCanvas.height - SOIL_HEIGHT
        ) {
          // Ensure plant is on the main soil line
          plant.water(waterAmount);
        }
      });
      if (gameState.selectedPlantID) updateInfoPanel(); // Update panel if selected plant was watered
    }
  } else if (
    gameState.currentTool === "planting" &&
    gameState.selectedSeedTypeForPlanting
  ) {
    if (
      clickY > flowerCanvas.height - SOIL_HEIGHT &&
      clickY < flowerCanvas.height - 10
    ) {
      // Plant in soil
      const seedType = gameState.selectedSeedTypeForPlanting;
      if (gameState.playerInventory.seeds[seedType] > 0) {
        const newPlant = new Plant(
          clickX,
          flowerCanvas.height - SOIL_HEIGHT,
          seedType
        );
        gameState.plants.push(newPlant);
        gameState.playerInventory.seeds[seedType]--;
        updateSeedSelector();
        if (gameState.playerInventory.seeds[seedType] <= 0) {
          gameState.selectedSeedTypeForPlanting = null;
          const nextSeed = Object.keys(gameState.playerInventory.seeds).find(
            (st) => gameState.playerInventory.seeds[st] > 0
          );
          if (nextSeed) gameState.selectedSeedTypeForPlanting = nextSeed;
          else setActiveTool(null); // No more seeds of any type, or just this type
          updateSeedSelector(); // Refresh to show updated counts / selected state
        }
      }
    }
  } else {
    // No tool selected, try to select/deselect a plant
    const clickedPlant = getPlantAt(clickX, clickY);
    if (clickedPlant) {
      gameState.selectedPlantID = clickedPlant.id;
      if (
        clickedPlant.currentStageIndex === 4 &&
        clickedPlant.isAlive === false
      ) {
        // Dead plant clicked
        if (
          confirm("Remover esta planta morta? Ela não pode ser recuperada.")
        ) {
          gameState.plants = gameState.plants.filter(
            (p) => p.id !== clickedPlant.id
          );
          gameState.selectedPlantID = null; // Deselect after removal
        }
      }
    } else {
      gameState.selectedPlantID = null; // Clicked on empty space
    }
    updateInfoPanel();
  }
}

// Mouse Listeners
flowerCanvas.addEventListener("mousemove", (event) => {
  const rect = flowerCanvas.getBoundingClientRect();
  gameState.mousePosition.x = event.clientX - rect.left;
  gameState.mousePosition.y = event.clientY - rect.top;
  updateHoveredPlant();
});

flowerCanvas.addEventListener("mouseleave", () => {
  gameState.hoveredPlantID = null;
});

flowerCanvas.addEventListener("click", (event) => {
  // gameState.mousePosition is already updated by mousemove
  processCanvasAction();
});

// Touch Listeners
flowerCanvas.addEventListener(
  "touchstart",
  (event) => {
    event.preventDefault();
    const touchPos = getTouchPos(flowerCanvas, event);
    if (!touchPos) return;
    gameState.mousePosition.x = touchPos.x;
    gameState.mousePosition.y = touchPos.y;
    updateHoveredPlant(); // Update for immediate feedback (e.g. tooltips)
  },
  { passive: false }
); // passive: false to allow preventDefault

flowerCanvas.addEventListener(
  "touchmove",
  (event) => {
    event.preventDefault();
    const touchPos = getTouchPos(flowerCanvas, event);
    if (!touchPos) return;
    gameState.mousePosition.x = touchPos.x;
    gameState.mousePosition.y = touchPos.y;
    updateHoveredPlant();
  },
  { passive: false }
);

flowerCanvas.addEventListener(
  "touchend",
  (event) => {
    event.preventDefault();
    if (event.changedTouches.length > 0) {
      const touchPos = getTouchPos(flowerCanvas, event, true); // true for changedTouches
      if (!touchPos) return;
      // Set mousePosition to the touchend location for accuracy of the tap
      gameState.mousePosition.x = touchPos.x;
      gameState.mousePosition.y = touchPos.y;
      // updateHoveredPlant(); // Ensure hover is correct for the exact tap point
      processCanvasAction();
    }
  },
  { passive: false }
);

flowerCanvas.addEventListener(
  "touchcancel",
  (event) => {
    event.preventDefault();
    gameState.hoveredPlantID = null; // User's touch was interrupted
  },
  { passive: false }
);

// --- Tool Button & Keyboard Listeners ---
wateringCanToolButton.addEventListener("click", () =>
  setActiveTool(gameState.currentTool === "watering" ? null : "watering")
);
plantingToolButton.addEventListener("click", () =>
  setActiveTool(gameState.currentTool === "planting" ? null : "planting")
);

window.addEventListener("keydown", (e) => {
  if (
    document.activeElement &&
    ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)
  )
    return;
  if (e.key.toLowerCase() === "w") {
    e.preventDefault();
    setActiveTool(gameState.currentTool === "watering" ? null : "watering");
  }
  if (e.key.toLowerCase() === "p") {
    e.preventDefault();
    setActiveTool(gameState.currentTool === "planting" ? null : "planting");
  }
  if (e.key === "Escape") {
    setActiveTool(null);
    gameState.selectedPlantID = null;
    updateInfoPanel();
  }
});

// --- Saving & Loading ---
function saveGame() {
  try {
    const stateToSave = {
      plants: gameState.plants.map((p) => p.toJSON()),
      playerInventory: gameState.playerInventory,
      gameTimeProgress: gameState.gameTime % DAY_DURATION_MS,
      lastRealTimestamp: Date.now(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(stateToSave));
  } catch (e) {
    console.error("Failed to save game:", e);
  }
}
function loadGame() {
  try {
    const savedDataJSON = localStorage.getItem(SAVE_KEY);
    if (!savedDataJSON) return false;
    const savedData = JSON.parse(savedDataJSON);
    gameState.plants = savedData.plants.map(
      (pData) => new Plant(pData.x, pData.y, pData.typeKey, pData)
    );
    gameState.playerInventory = savedData.playerInventory || {
      seeds: {
        GENERIC_FLOWER: 1 /* Add all other seed types here with default 1 if missing */,
      },
    };
    // Ensure all current plant types have at least a 0 count if not in saved data.
    Object.keys(PLANT_TYPES).forEach((typeKey) => {
      if (!(typeKey in gameState.playerInventory.seeds)) {
        gameState.playerInventory.seeds[typeKey] = 0; // Or 1 if you want to give them one
      }
    });

    const lastPlayedRealTimestamp = savedData.lastRealTimestamp || Date.now();
    const now = Date.now();
    const elapsedRealMilliseconds = now - lastPlayedRealTimestamp;
    const elapsedRealDays = elapsedRealMilliseconds / (1000 * 60 * 60 * 24);
    gameState.gameTime = savedData.gameTimeProgress || 0;
    gameState.gameTime += elapsedRealMilliseconds; // Add offline time to game time progression

    gameState.plants.forEach((plant) => {
      plant.timeSinceLastCare =
        (plant.timeSinceLastCare || 0) + elapsedRealDays;
      const neglectThreshold =
        MAX_INACTIVITY_DAYS / (plant.config.neglectSensitivity || 1);
      if (plant.timeSinceLastCare > neglectThreshold && plant.isAlive) {
        plant.die(false);
        console.log(
          `Plant ${plant.config.name} (ID: ${plant.id.substring(
            0,
            4
          )}) died from neglect (${plant.timeSinceLastCare.toFixed(1)} days).`
        );
      } else if (plant.isAlive) {
        const gameHoursElapsedOffline =
          elapsedRealMilliseconds / (DAY_DURATION_MS / 24);
        plant.waterLevel = Math.max(
          0,
          plant.waterLevel -
            plant.config.waterConsumptionPerGameHour * gameHoursElapsedOffline
        );
        if (plant.waterLevel < 20)
          plant.health -=
            plant.config.healthDecreaseRate *
            10 *
            Math.min(1, elapsedRealDays / 2);
        plant.health = Math.max(0, plant.health);
        if (plant.health <= 0) plant.die(false);
      }
    });
    console.log(
      `Loaded game. ${elapsedRealDays.toFixed(
        2
      )} real days passed since last session.`
    );
    return true;
  } catch (e) {
    console.error("Failed to load game:", e);
    localStorage.removeItem(SAVE_KEY);
    return false;
  }
}

// --- Initialization ---
function initGame(isNewGame = false) {
  document.documentElement.requestFullscreen();
  overlay.style.opacity = "0";
  setTimeout(() => {
    overlay.hidden = true;
  }, 500);
  resizeCanvas(); // Initial resize

  if (isNewGame || !loadGame()) {
    console.log("Starting a new garden.");
    gameState.plants = [];
    // Initialize with all seeds available in PLANT_TYPES
    const initialSeeds = {};
    Object.keys(PLANT_TYPES).forEach((typeKey) => {
      initialSeeds[typeKey] = 1;
    });
    gameState.playerInventory = { seeds: initialSeeds };

    gameState.gameTime = DAY_DURATION_MS * 0.3; // Start mid-morning
    gameState.selectedPlantID = null;
    setActiveTool(null);
    gameState.particles = [];
    // Add a couple of generic flowers to start if it's a new game
    if (flowerCanvas.width > 0 && flowerCanvas.height > 0) {
      // Ensure canvas has dimensions
      gameState.plants.push(
        new Plant(flowerCanvas.width * 0.4, flowerCanvas.height - SOIL_HEIGHT)
      );
      gameState.plants.push(
        new Plant(flowerCanvas.width * 0.6, flowerCanvas.height - SOIL_HEIGHT)
      );
    }
    saveGame();
  }

  updateInfoPanel();
  updateSeedSelector();
  gameState.lastUpdateTimestamp = performance.now();
  gameState.lastSaveTimestamp = performance.now();
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  gameLoop(performance.now());
}

// --- Initial Setup ---
newGardenButton.addEventListener("click", () => initGame(true));
continueGardenButton.addEventListener("click", () => initGame(false));
if (!localStorage.getItem(SAVE_KEY)) {
  continueGardenButton.disabled = true;
  continueGardenButton.title = "Nenhum jardim salvo encontrado.";
} else {
  continueGardenButton.disabled = false;
  continueGardenButton.title = "";
}

//window.addEventListener("resize", resizeCanvas);
//window.addEventListener("orientationchange", resizeCanvas); // For mobile orientation changes
window.addEventListener("beforeunload", saveGame);

// Basic tinycolor fallback if the library is not included
if (typeof tinycolor === "undefined") {
  console.warn(
    "tinycolor.js not found. Using basic color manipulation for wilting/dead plants."
  );
  window.tinycolor = (colorStr) => {
    let _color = colorStr;
    const originalInput = colorStr;
    const rgbFromHex = (hex) => {
      if (typeof hex !== "string" || !hex.startsWith("#"))
        return { r: 0, g: 0, b: 0, valid: false };
      let bigint = parseInt(hex.slice(1), 16);
      return {
        r: (bigint >> 16) & 255,
        g: (bigint >> 8) & 255,
        b: bigint & 255,
        valid: true,
      };
    };
    const self = {
      _originalInput: originalInput,
      desaturate: function (amount) {
        const { r, g, b, valid } = rgbFromHex(_color);
        if (!valid && !_color.startsWith("rgb")) return self; // Only process hex or if already rgb
        let currentR = r,
          currentG = g,
          currentB = b;
        if (_color.startsWith("rgb")) {
          const parts = _color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (parts) {
            currentR = parseInt(parts[1]);
            currentG = parseInt(parts[2]);
            currentB = parseInt(parts[3]);
          } else return self;
        }
        const gray = currentR * 0.3 + currentG * 0.59 + currentB * 0.11;
        const factor = amount / 100;
        _color = `rgb(${Math.round(
          currentR * (1 - factor) + gray * factor
        )},${Math.round(currentG * (1 - factor) + gray * factor)},${Math.round(
          currentB * (1 - factor) + gray * factor
        )})`;
        return self;
      },
      darken: function (amount) {
        const { r, g, b, valid } = rgbFromHex(_color);
        if (!valid && !_color.startsWith("rgb")) return self;
        let currentR = r,
          currentG = g,
          currentB = b;
        if (_color.startsWith("rgb")) {
          const parts = _color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (parts) {
            currentR = parseInt(parts[1]);
            currentG = parseInt(parts[2]);
            currentB = parseInt(parts[3]);
          } else return self;
        }
        const factor = amount / 100;
        _color = `rgb(${Math.round(currentR * (1 - factor))},${Math.round(
          currentG * (1 - factor)
        )},${Math.round(currentB * (1 - factor))})`;
        return self;
      },
      toString: function () {
        return _color;
      },
    };
    return self;
  };
}
