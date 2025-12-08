const dummy_questions = [
  {
    id: "8229c81d-f832-4b45-b3bc-d99c28a36aa6",
    text: "What is a semiconductor?",
    type: "multiple_choice_questions",
    difficulty: "easy",
    choices: [
      "A material that conducts electricity perfectly",
      "A material with conductivity between a conductor and an insulator",
      "A material that blocks all electricity",
      "A material that amplifies electricity",
    ],
    answer: "A material with conductivity between a conductor and an insulator",
    answerIdx: 1,
    explanation:
      "Semiconductors have conductivity between conductors and insulators, allowing controlled electrical behavior.",
  },
  {
    id: "13111e21-391c-4fc0-9c7f-5f6f465a0584",
    text: "Which of the following is a common semiconductor material?",
    type: "multiple_choice_questions",
    difficulty: "easy",
    choices: ["Copper", "Silicon", "Rubber", "Glass"],
    answer: "Silicon",
    answerIdx: 1,
    explanation:
      "Silicon is the most widely used semiconductor material due to its abundance and suitable properties.",
  },
  {
    id: "91661d6f-2a40-4329-bea2-717a9b482c71",
    text: "What is doping in semiconductors?",
    type: "multiple_choice_questions",
    difficulty: "medium",
    choices: [
      "Adding impurities to change conductivity",
      "Heating the semiconductor to increase conductivity",
      "Cooling the semiconductor to decrease conductivity",
      "Applying a magnetic field",
    ],
    answer: "Adding impurities to change conductivity",
    answerIdx: 0,
    explanation:
      "Doping involves adding impurities to a semiconductor to modify its electrical conductivity.",
  },
  {
    id: "fa508804-7e8e-4e2a-8255-bb3b4dae21be",
    text: "What are the two main types of doped semiconductors?",
    type: "multiple_choice_questions",
    difficulty: "medium",
    choices: [
      "Positive and Negative",
      "N-type and P-type",
      "High and Low",
      "Red and Blue",
    ],
    answer: "N-type and P-type",
    answerIdx: 1,
    explanation:
      "Semiconductors are doped to create N-type (excess electrons) and P-type (excess holes) materials.",
  },
  {
    id: "105eb1e1-b4f9-49aa-be91-ae1d18385bed",
    text: "What is a diode?",
    type: "multiple_choice_questions",
    difficulty: "easy",
    choices: [
      "A two-terminal semiconductor device that conducts primarily in one direction",
      "A three-terminal semiconductor device that amplifies signals",
      "A device that stores electrical energy",
      "A device that resists the flow of current",
    ],
    answer:
      "A two-terminal semiconductor device that conducts primarily in one direction",
    answerIdx: 0,
    explanation:
      "A diode allows current to flow easily in one direction and restricts it in the opposite direction.",
  },
  {
    id: "fec2b6af-432c-4de5-881c-7d7f9718c30d",
    text: "What is a transistor?",
    type: "multiple_choice_questions",
    difficulty: "medium",
    choices: [
      "A two-terminal device that controls current flow",
      "A three-terminal device that amplifies or switches electronic signals and electrical power",
      "A device that stores electrical energy",
      "A device that converts AC to DC",
    ],
    answer:
      "A three-terminal device that amplifies or switches electronic signals and electrical power",
    answerIdx: 1,
    explanation:
      "Transistors are fundamental building blocks of modern electronics, used for amplification and switching.",
  },
  {
    id: "06d71a90-b45a-4883-a6cd-cadf1e167bd4",
    text: "Which of the following is an application of semiconductors?",
    type: "multiple_choice_questions",
    difficulty: "easy",
    choices: [
      "Cooking food",
      "Lighting a room",
      "Electronic devices like computers and smartphones",
      "Building bridges",
    ],
    answer: "Electronic devices like computers and smartphones",
    answerIdx: 2,
    explanation:
      "Semiconductors are essential components in almost all modern electronic devices.",
  },
  {
    id: "ae79e5c2-fa87-4a86-b8c9-70a672fd704d",
    text: "What is an integrated circuit (IC)?",
    type: "multiple_choice_questions",
    difficulty: "medium",
    choices: [
      "A single resistor",
      "A complete electronic circuit on a small semiconductor chip",
      "A large capacitor",
      "A type of battery",
    ],
    answer: "A complete electronic circuit on a small semiconductor chip",
    answerIdx: 1,
    explanation:
      "ICs, also known as microchips, contain numerous components on a single chip, enabling complex functions.",
  },
  {
    id: "a0e0106b-1e19-4f99-b843-63b1f8b67113",
    text: "What is the primary advantage of using semiconductors in electronics?",
    type: "multiple_choice_questions",
    difficulty: "hard",
    choices: [
      "High cost",
      "Small size, low power consumption, and high reliability",
      "Large size and high power consumption",
      "Limited availability",
    ],
    answer: "Small size, low power consumption, and high reliability",
    answerIdx: 1,
    explanation:
      "Semiconductors enable miniaturization, energy efficiency, and robust performance in electronic devices.",
  },
  {
    id: "42da1d6d-6cd5-474f-a1d6-6ff1b9456403",
    text: "What is the energy band gap in a semiconductor?",
    type: "multiple_choice_questions",
    difficulty: "medium",
    choices: [
      "The range of energy levels that electrons can occupy",
      "The forbidden energy range where no electrons can exist",
      "The energy required to break a chemical bond",
      "The energy released when an electron moves to a lower energy level",
    ],
    answer: "The forbidden energy range where no electrons can exist",
    answerIdx: 1,
    explanation:
      "The band gap is a crucial property that determines the electrical behavior of a semiconductor.",
  },
  {
    id: "dac15a60-1364-4799-a0be-d48e5df96fc1",
    text: "What is the purpose of a rectifier circuit?",
    type: "multiple_choice_questions",
    difficulty: "easy",
    choices: [
      "To amplify a signal",
      "To convert AC voltage to DC voltage",
      "To convert DC voltage to AC voltage",
      "To store electrical energy",
    ],
    answer: "To convert AC voltage to DC voltage",
    answerIdx: 1,
    explanation:
      "Rectifiers use diodes to convert alternating current (AC) to direct current (DC).",
  },
  {
    id: "55055406-8481-4f8f-96aa-b3e3638e5144",
    text: "What is the function of a capacitor in a circuit?",
    type: "multiple_choice_questions",
    difficulty: "medium",
    choices: [
      "To amplify a signal",
      "To store electrical energy",
      "To resist the flow of current",
      "To convert AC to DC",
    ],
    answer: "To store electrical energy",
    answerIdx: 1,
    explanation: "Capacitors store electrical energy in an electric field.",
  },
  {
    id: "23f7a052-2b34-468d-9d6e-b1f6db891c48",
    text: "What is the role of an inductor in a circuit?",
    type: "multiple_choice_questions",
    difficulty: "medium",
    choices: [
      "To store electrical energy in a magnetic field",
      "To store electrical energy in an electric field",
      "To resist the flow of current",
      "To amplify a signal",
    ],
    answer: "To store electrical energy in a magnetic field",
    answerIdx: 0,
    explanation:
      "Inductors store energy in a magnetic field when current flows through them.",
  },
  {
    id: "a928a9eb-2b43-4593-830b-2f98ba53408f",
    text: "What is Moore's Law?",
    type: "multiple_choice_questions",
    difficulty: "hard",
    choices: [
      "The observation that the number of transistors on a microchip doubles about every two years",
      "The principle that energy cannot be created or destroyed",
      "The law of supply and demand",
      "The theory of relativity",
    ],
    answer:
      "The observation that the number of transistors on a microchip doubles about every two years",
    answerIdx: 0,
    explanation:
      "Moore's Law has driven the rapid advancement of computing power over the decades.",
  },
  {
    id: "db870f42-0949-46fe-ad9c-beb0d37bfac4",
    text: "What is the purpose of a heat sink in electronic devices?",
    type: "multiple_choice_questions",
    difficulty: "medium",
    choices: [
      "To generate heat",
      "To dissipate heat away from electronic components",
      "To store electrical energy",
      "To amplify signals",
    ],
    answer: "To dissipate heat away from electronic components",
    answerIdx: 1,
    explanation:
      "Heat sinks prevent overheating and damage to sensitive electronic components.",
  },
  {
    id: "afdf64f8-ad5c-4293-a0fc-435ae0c9ad28",
    text: "What is a LED (Light Emitting Diode)?",
    type: "multiple_choice_questions",
    difficulty: "easy",
    choices: [
      "A type of resistor",
      "A semiconductor light source",
      "A type of capacitor",
      "A type of inductor",
    ],
    answer: "A semiconductor light source",
    answerIdx: 1,
    explanation: "LEDs emit light when current passes through them.",
  },
  {
    id: "b72d2928-dd8f-42da-b382-9a080a4c848b",
    text: "What is the function of a microcontroller?",
    type: "multiple_choice_questions",
    difficulty: "medium",
    choices: [
      "To control other electronic components",
      "To amplify signals",
      "To store electrical energy",
      "To convert AC to DC",
    ],
    answer: "To control other electronic components",
    answerIdx: 0,
    explanation:
      "Microcontrollers are small computers on a chip, used to control various devices and systems.",
  },
  {
    id: "a2906dc3-896a-4948-8e81-0d9e3ea1c35f",
    text: "What is the Hall effect in semiconductors?",
    type: "multiple_choice_questions",
    difficulty: "hard",
    choices: [
      "The production of a voltage difference across an electrical conductor, transverse to an electric current and a magnetic field applied perpendicular to the current.",
      "The increase in resistance of a semiconductor when exposed to light",
      "The decrease in resistance of a semiconductor when heated",
      "The emission of light from a semiconductor when current passes through it",
    ],
    answer:
      "The production of a voltage difference across an electrical conductor, transverse to an electric current and a magnetic field applied perpendicular to the current.",
    answerIdx: 0,
    explanation:
      "The Hall effect is used to measure the carrier concentration and type in semiconductors.",
  },
  {
    id: "637ffc2e-fc8f-4846-9c46-5a7625bb4068",
    text: "What is the purpose of a filter circuit?",
    type: "multiple_choice_questions",
    difficulty: "medium",
    choices: [
      "To amplify a signal",
      "To remove unwanted frequencies from a signal",
      "To store electrical energy",
      "To convert AC to DC",
    ],
    answer: "To remove unwanted frequencies from a signal",
    answerIdx: 1,
    explanation:
      "Filter circuits are used to pass desired frequencies while attenuating unwanted frequencies.",
  },
  {
    id: "8170d683-8c1e-41e1-ac09-d520811efc51",
    text: "What is quantum tunneling in semiconductors?",
    type: "multiple_choice_questions",
    difficulty: "hard",
    choices: [
      "The phenomenon where electrons can pass through a potential barrier even if they do not have enough energy to overcome it classically",
      "The phenomenon where electrons move at the speed of light",
      "The phenomenon where electrons lose energy due to collisions",
      "The phenomenon where electrons are trapped in a potential well",
    ],
    answer:
      "The phenomenon where electrons can pass through a potential barrier even if they do not have enough energy to overcome it classically",
    answerIdx: 0,
    explanation:
      "Quantum tunneling is a quantum mechanical effect that plays a role in some semiconductor devices.",
  },
];
export default dummy_questions;
