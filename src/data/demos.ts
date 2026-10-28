import { CareerDemo } from '../types';

export const CAREER_DEMOS: CareerDemo[] = [
  {
    id: "demo_software_dev",
    careerId: "software_dev",
    title: "Starter Coding Task: Student Task Filter Function",
    title_te: "కోడింగ్ టాస్క్: విద్యార్థి టాస్క్ ఫిల్టర్ ఫంక్షన్",
    description: "Write and test a simple JavaScript function that filters completed homework tasks. Experience the direct feedback loop of running code in your browser.",
    category: "Software Development",
    estimatedMinutes: 8,
    type: "code",
    initialCode: `// Task: Return only the tasks that are marked 'completed: true'
function filterCompletedTasks(taskList) {
  // Write your code here
  return taskList.filter(task => task.completed === true);
}

// Test data
const sampleTasks = [
  { id: 1, title: "Math Algebra HW", completed: true },
  { id: 2, title: "Physics Lab Record", completed: false },
  { id: 3, title: "English Essay", completed: true }
];

console.log(filterCompletedTasks(sampleTasks));`,
    testPrompt: "Filter completed homework tasks from an array of objects.",
    expectedOutputHint: "Should output 2 completed task objects (Math Algebra HW & English Essay)."
  },
  {
    id: "demo_data_analyst",
    careerId: "data_analyst",
    title: "Dataset Inspection: Rural Primary Health Center Medicine Supply",
    title_te: "డేటా విశ్లేషణ: ప్రాథమిక ఆరోగ్య కేంద్రాల మందుల నిల్వ",
    description: "Inspect actual medicine stock levels across 4 rural health sub-centers. Identify shortages and calculate which clinic requires an emergency resupply.",
    category: "Data Analytics",
    estimatedMinutes: 6,
    type: "data",
    questionPrompt: "Analyze the PHC inventory table below. Identify which center is below safety threshold (< 30% required stock).",
    dataset: [
      { phc_name: "Kandi Rural PHC", medicine: "Paracetamol 500mg", required_units: 5000, current_units: 4200, status: "Healthy (84%)" },
      { phc_name: "Toopran PHC", medicine: "ORS Packets", required_units: 2000, current_units: 480, status: "CRITICAL SHORTAGE (24%)" },
      { phc_name: "Chegunta PHC", medicine: "Amoxicillin 250mg", required_units: 1500, current_units: 1100, status: "Adequate (73%)" },
      { phc_name: "Gajwel PHC", medicine: "Iron Folic Acid", required_units: 3000, current_units: 2600, status: "Healthy (86%)" }
    ]
  },
  {
    id: "demo_ui_ux_designer",
    careerId: "ui_ux_designer",
    title: "UI/UX Usability Audit: Rural Bus Pass Application Screen",
    title_te: "యూఐ/యూఎక్స్ ఆడిట్: బస్ పాస్ దరఖాస్తు స్క్రీన్ సమీక్ష",
    description: "Review a mock mobile screen designed for rural students. Spot three usability defects (contrast, confusing button text, missing Telugu translation).",
    category: "UI/UX Design",
    estimatedMinutes: 5,
    type: "design_critique",
    questionPrompt: "Select the major usability violations present in this interface to score your design critique instinct."
  },
  {
    id: "demo_agri_scientist",
    careerId: "agri_scientist",
    title: "Soil N-P-K Diagnostic & Fertilizer Calculator",
    title_te: "నేల పోషకాల విశ్లేషణ మరియు ఎరువుల మోతాదు లెక్కింపు",
    description: "Input soil test results for Nitrogen (N), Phosphorus (P), and Potassium (K) to calculate the exact deficiency and recommend organic compost vs Urea dosage.",
    category: "Agriculture & Rural Sciences",
    estimatedMinutes: 7,
    type: "agriculture",
    questionPrompt: "Adjust soil nitrogen and phosphorus values to determine the recommended fertilizer combination for paddy crop."
  },
  {
    id: "demo_solar_electrician",
    careerId: "solar_electrician",
    title: "Rooftop Solar System Sizing Calculator",
    title_te: "రూఫ్‌టాప్ సోలార్ ప్యానెల్ సైజింగ్ కాలిక్యులేటర్",
    description: "Calculate how many 330W solar panels and what inverter capacity are needed for a village school running 4 ceiling fans and 6 LED tube lights.",
    category: "Clean Energy",
    estimatedMinutes: 6,
    type: "solar_calculator",
    questionPrompt: "Enter daily appliance run hours to compute total daily watt-hours, peak sun hours, and required PV system wattage."
  }
];
