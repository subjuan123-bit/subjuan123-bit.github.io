"use strict";
/* ============================================================
   SITE CONTENT: edit text here. Media files live in /media.
   ============================================================ */
const SITE_MEDIA = {
  avatar: null,                 // e.g. {url:"media/avatar.jpg"}
  videos: {                     // hover videos on project thumbnails
    // "duck-hunt": {url:"media/duck-hunt.mp4"},
    // "drawbridge": {url:"media/drawbridge.mp4"},
  },
  me: [                         // photos in the About me slide
    // {url:"media/me-1.jpg", cap:"Hiking"},
  ],
  photos: {}                    // extra gallery photos per project id
};

const ME = {
  name:"Sebastian Acendra",
  line:"Mechanical Engineering · Georgia Tech · Dec 2026",
  email:"subjuan123@gmail.com",
  city:"Atlanta, GA",
  status:"U.S. Permanent Resident",
};

const ABOUT = [
  "I’m a fourth-year mechanical engineering student at Georgia Tech graduating in December 2026. I’m interested in mechanical design, experimental testing, mechatronics, thermal analysis and I enjoy projects where I can go from analyzing a problem to designing and testing a practical & effective solution!",
  "At GT, I’ve worked on projects involving refrigeration system characterization, vibration mitigation for drone wings using experimental data analysis, and I’ve also had hands-on experience with the EcoCAR team where I got to work on designing mounting components using CAD and evaluated the designs with FEA simulations.",
  "Outside of GT, I enjoy building my experience through independent projects. I’m currently developing a low-cost thermal imaging system utilizing IR sensors, and Python based visualization with simple interpolation to further improve thermal image resolution.",
  "Besides engineering, some of my other interests are competitive gaming, hiking & exploring new places as well as open-sea fishing on occasion!"
];

const ROWS = [
  {id:"capstone", name:"Capstone & Research", items:["duck-hunt","refrigeration","wing-vibration"]},
  {id:"team", name:"Competition Teams", items:["ecocar"]},
  {id:"course", name:"Coursework", items:["kung-fu-machine","sky-rush","hovercraft"]},
  {id:"side", name:"Side Quests", items:["thermal-imager","cyberdeck"]},
  {id:"origin", name:"Where It Started", items:["drawbridge"]},
];

const P = {
"duck-hunt":{
  title:"Drone Duck Hunt", sub:"Scoring blank-fire rifle shots against live drones for Army counter-drone training",
  dates:"Aug 2026 – present", role:"Mechanical Team Lead", team:"6-person interdisciplinary team in a 100+ student capstone",
  where:"Georgia Tech ME 4723 · Army Backed", status:"In progress",
  tags:["Siemens NX","FEA","Raspberry Pi","OpenCV","Electro-mechanical packaging","Field testing"],
  stats:[["$2,047 / $2,500","Prototype budget"],["400–500 g","Recoil at the rail"],["≈3 cm","Scoring error goal at 100 yd"],["< 1 lb","Drone module target"]],
  tile:"img/dh-range1.webp", hero:"img/dh-range1.webp", video:null,
  overview:[
    "Soldiers practice shooting down small drones with blank ammunition, so someone has to tell them whether each blank would have hit. The Army's laser trainer marks wherever the barrel points, which fails against a moving drone. At 100 m a round takes about 0.11 s to arrive, and a drone crossing at 60 mph moves about 10 ft in that time, so a correctly led shot reads as a miss.",
    "Our system measures the engagement instead. A rail-mounted weapon module times each shot from its ignition shock with piezo sensors and uses an infrared camera to find a beacon on the drone. Software then flies a virtual round, bullet drop included, at a drone-sized box, and a red LED on the drone lights up for a hit."
  ],
  role_items:[
    "Lead the mechanical design: module packaging, mounting concepts, and hardware fit for the electro-mechanical assembly.",
    "Coordinate enclosure and mount geometry with the electrical team designing the sensor PCBs.",
    "Used a Raspberry Pi 3 and camera to detect the orientation of an M4 rifle, then CAD-modeled and fabricated the weapon mount.",
    "Helped manage $2,047 of a $2,500 budget across two prototypes.",
    "One of two team members sent to Oregon to field-test the first prototype; now leading bench testing to select the final design."
  ],
  callout:{title:"Oregon field test", items:[
    "The weapon mount held up under full-auto fire with both live and blank rounds.",
    "Ran camera tests for distance and weapon orientation.",
    "With the camera and Raspberry Pi, we could tell where the soldier was aiming and what he was shooting at."
  ]},
  learned:[
    "Recoil reaches about 400–500 g at the rail, so every sensor that defines the bore has to be mounted rigidly. Damping a sensor would decouple it from the bore it is supposed to measure.",
    "Our predicted scoring error is dominated by the 0.3 mrad camera-to-bore hold. That makes accuracy a mechanical problem with a mechanical fix.",
    "Setting up FEA in Siemens NX showed me how sensitive peak stresses are at idealized fixed supports. Those numbers need physical tests behind them.",
    "A commercial rail adapter for under $20 beat machining our own precision interface and freed up time for testing.",
    "Packaging around real circuit boards means measuring connectors and cable exits early, before the enclosure geometry is locked."
  ],
  gallery:[
    ["img/dh-range1.webp","Range test: piezo shot-sensor traces reading live on the laptop"],
    ["img/dh-range2.webp","Firing on the line with the sensor board mounted to the rifle"],
    ["img/dh-night.webp","Night test of the weapon camera and Raspberry Pi tracking a light across a field"],
    ["img/dh-01.webp","Weapon module CAD: top view, and exploded view on the quad rail"],
    ["img/dh-04.webp","Shot timeline: trigger, muzzle emergence, and the intercept window"],
    ["img/dh-09.webp","The five concepts we compared for locating the drone"],
    ["img/dh-19.webp","PETG test case under a 100 N face load in Siemens NX"],
    ["img/dh-25.webp","Aluminum camera clamp under an equivalent-static recoil load"],
    ["img/dh-16.webp","Semester plan through the November 25 deadline"]
  ],
  ach:["lead","boots","fullauto","budget"]
},
"refrigeration":{
  title:"Refrigeration System Characterization", sub:"Finding the biggest lever on a compressor-to-vortex-tube cooling system",
  dates:"Apr – Jul 2026", role:"Thermal systems team member", team:"3-person thermal systems team", where:"Georgia Tech",
  tags:["Thermal analysis","Data acquisition","MATLAB","Curve fitting"],
  stats:[["−42%","Cooling time constant"],["≈ 8 K","Colder steady-state load"],["~33 psi","Supply pressure"],["0.5–2.5 V","Motor sweep"]],
  art:"vortex",
  overview:[
    "We characterized a cooling system in which an onboard compressor feeds a vortex tube, which splits compressed air into a hot stream and a cold stream. The goal was to show the system could run on its own air supply and to find which setting cooled the load fastest and coldest."
  ],
  role_items:[
    "Proved an onboard compressor could replace the building air supply.",
    "Flagged bypass heat paths between the compressor and the vortex tube that were costing cold-side temperature.",
    "Identified supply pressure as the primary cooling lever: raising it to about 33 psi cut the fitted cooling time constant by 42% and lowered the projected steady-state load temperature by about 8 K.",
    "Recommended an operating range from a five-point motor sweep (0.5–2.5 V), trading the lowest cold-air temperature against 8.6% more cold-side airflow."
  ],
  learned:[
    "A fitted time constant turns noisy cooling curves into one number that compares cleanly across settings.",
    "Heat leaking into the plumbing matters as much as the cooler itself.",
    "A recommendation is a trade-off: the coldest air and the most airflow came at different motor voltages."
  ],
  gallery:[], ach:["pressure"]
},
"wing-vibration":{
  title:"Drone Wing Vibration Mitigation", sub:"Tracing a wing-support failure to resonance and tuning it out",
  dates:"Jan – May 2026", role:"Dynamics & vibrations team member", team:"3-person dynamics & vibrations team", where:"Georgia Tech",
  tags:["Vibration testing","Modal analysis","MATLAB","Tuned mass absorber"],
  stats:[["−99.9%","Gain at critical frequency"],["≥ 30 dB","Attenuation"],["4","Test methods"]],
  art:"bode",
  overview:[
    "A drone's wing support kept failing. We tracked the failure to a resonance near the operating speed, then added and tuned a mass absorber on the wing extension to cancel it."
  ],
  role_items:[
    "Diagnosed the root cause of the wing-support failure by triangulating the natural frequency through theory, impulse, white-noise, and sinusoidal testing.",
    "Tuned a wing-extension mass absorber to create an anti-resonance, cutting the displacement-to-force gain by 99.9% at the critical frequency.",
    "Set a new operating range with at least 30 dB of attenuation from the original resonance, keeping the secondary resonances outside the wing's operating range."
  ],
  learned:[
    "Finding the same frequency with several methods is what makes a diagnosis trustworthy.",
    "An absorber cancels one peak and creates two new ones, so the new resonances have to land somewhere harmless.",
    "Reading frequency response in decibels makes it easy to see how much margin a fix really buys."
  ],
  gallery:[], ach:["notch"]
},
"ecocar":{
  title:"Georgia Tech EcoCAR", sub:"High-voltage box mounts and routing for a competition vehicle",
  dates:"Jan – May 2024", role:"Mechanical Design / HV Box Team Member", team:"Georgia Tech EcoCAR team", where:"EcoCAR collegiate competition",
  tags:["Siemens NX","Altair HyperWorks","FEA","Packaging","HV routing"],
  stats:[["4.4 – 8.31","FOS range, first mounts"],["3","Top-mount iterations"],["Mar 15","Build deadline"]],
  tile:"img/ec-12.webp", hero:"img/ec-12.webp",
  overview:[
    "EcoCAR is a collegiate competition in which university teams re-engineer a production vehicle. I worked on the high-voltage boxes: where they sit in the car, how their wiring runs, and the brackets that hold them through real driving loads.",
    "The car had to be built by March 15 and ship to competition in late April, so every bracket had to clear surrounding systems the first time."
  ],
  role_items:[
    "Improved wiring paths on the front HV box and helped mount and retain the HV wiring.",
    "Positioned and routed the rear fuse box around surrounding components.",
    "CAD-modeled custom HV-box mounts for milling, meeting packaging limits and electrical and mechanical clearances without interfering with adjacent systems.",
    "Verified mount load capacity with Altair HyperWorks FEA under vehicle G-force load cases. The first set of mounts showed factors of safety from 4.4 to 8.31.",
    "Designed a new top mount for two new mounting points. The first two iterations failed FEA; the third passed.",
    "Helped assemble the front HV boxes."
  ],
  learned:[
    "Packaging inside a full-vehicle model is mostly about clearances. A mount is done when nothing else moves into its space.",
    "Iterating against FEA early is cheaper than finding a weak bracket on the car.",
    "Build rules from the fabrication side, like keeping welds off a given face, are design constraints from day one.",
    "On a large team, CAD has to stay in sync with the people routing wires around your parts."
  ],
  gallery:[
    ["img/ec-12.webp","Front HV box packaged in the full-vehicle CAD"],
    ["img/ec-13.webp","Mount set under a G-force load case with factor-of-safety labels"],
    ["img/ec-14.webp","Updated top and bottom mounts in HyperWorks"],
    ["img/ec-07.webp","An earlier mount iteration under load"],
    ["img/ec-03.webp","Mount close-up against the HV box"],
    ["img/ec-05.webp","Bracket clearance check"],
    ["img/ec-02.webp","HV box with its lower bracket"]
  ],
  ach:["third"]
},
"kung-fu-machine":{
  title:"Kung Fu Panda Competition Machine", sub:"ME 2110 major project: an Arduino-automated machine for a six-task arena",
  dates:"Spring 2024", role:"Team member", team:"4-person team", where:"Georgia Tech ME 2110",
  tags:["SolidWorks","Arduino","Pneumatics","Laser cutting","3D printing"],
  stats:[["$56.21 / $120","Budget used"],["6","Arena tasks"],["40 s","Run time"]],
  tile:"img/me2110-50.webp", hero:"img/me2110-50.webp",
  overview:[
    "ME 2110's final project: an Arduino-automated machine with 40 seconds to finish six tasks on a themed arena. It had to activate itself, collect baozi into bowls, protect bunny villagers, knock Tai Lung out of its zone, lift Po up the stairs to the Jade Palace, and grab the dragon scroll.",
    "The limits were a 12 × 24 × 18 in envelope, two 120 V outlets, five mousetraps, five rubber bands, and a $120 budget. Our build used drawer slides, pneumatics, a mousetrap-loaded hook, and a lift driven by a 3D-printed motor spool, and it came in at $56.21."
  ],
  role_items:[
    "Wrote the fabrication and testing section of the final report and generated its figures.",
    "Made the final SolidWorks render of the machine."
  ],
  learned:[
    "Mechanisms that work alone can fail together. Our lift worked every time in practice, but in the first competition round its motor code was still commented out from testing.",
    "Test the whole system on the real track, not one mechanism at a time.",
    "Small geometry decides outcomes: a funnel that was too narrow kept the baozi from reaching our bowl.",
    "A risk table for the lift made us test its failure case before we committed to building it."
  ],
  gallery:[
    ["img/me2110-50.webp","Final SolidWorks render of the machine"],
    ["img/me2110-58.webp","Lift mechanism on the drawer slides"],
    ["img/me2110-59.webp","The machine on the arena"],
    ["img/me2110-56.webp","Track-side during a sprint"],
    ["img/me2110-57.webp","Testing on the track"],
    ["img/me2110-60.webp","Front of the build with the wiring"],
    ["img/me2110-61.webp","Side view of the slides"],
    ["img/me2110-49.webp","Concept evaluation matrix: the power lift ranked first"]
  ],
  ach:["render"]
},
"sky-rush":{
  title:"Sky Rush Drone Delivery", sub:"A winch-and-box delivery system for a heavy-lift drone",
  dates:"Feb 2024", role:"Team member", team:"4-person team", where:"Georgia Tech ME 2110 · Studio 2",
  tags:["SolidWorks","House of Quality","Morphological chart","Concept selection"],
  stats:[["18 lb","Perishable payload"],["≈ 0","Descent rate at delivery"],["4","Concepts scored"]],
  tile:"img/me2110-65.webp", hero:"img/me2110-65.webp",
  overview:[
    "A drone-delivery start-up wanted a package mechanism for a heavy-lift drone: carry up to 18 lb of perishables, keep them insulated, and set them down at a descent rate near zero.",
    "We worked through a House of Quality, spec sheet, function tree, morphological chart, and evaluation matrix. The winning concept, Diamond Sky, hangs a custom box from a radio-controlled winch on custom clips under a JOUAV CW-80E. We named the product Sky Rush."
  ],
  role_items:[
    "Built the relationships, directions of improvement, and engineering requirements in the House of Quality.",
    "Helped create and finalize the specification sheet and drew some of the final morphological chart sketches.",
    "Modeled and rendered the Magnet Master and Sky Rush designs in SolidWorks.",
    "Wrote the conclusion and alternative designs sections of the report."
  ],
  learned:[
    "The House of Quality is where vague customer wants turn into measurable targets.",
    "Scoring four concepts side by side made the trade-offs plain: Magnet Master lost on stability, and Bread Basket lost on smooth attach and deploy.",
    "A clear render makes a concept much easier for others to judge."
  ],
  gallery:[
    ["img/me2110-65.webp","Diamond Sky render: winch, hook, and box under the drone"],
    ["img/me2110-66.webp","Concept renders with callouts"],
    ["img/me2110-67.webp","Sky Rush box and drone detail"],
    ["img/me2110-69.webp","Morphological chart of design alternatives"]
  ],
  ach:["house"]
},
"hovercraft":{
  title:"Personal Flight Hovercraft", sub:"A five-person SolidWorks build of a personal flying hovercraft",
  dates:"Fall 2023", role:"Frame designer", team:"5-person team", where:"Georgia Tech ME 1670 · Section D",
  tags:["SolidWorks","Assemblies","Working drawings","Weldments"],
  stats:[["4","Frame parts I owned"],["5","Subsystems"],["1","Shared frame reference"]],
  tile:"img/air-53.webp", hero:"img/air-02.webp",
  overview:[
    "A team CAD project to model a personal flying hovercraft in SolidWorks. Each member owned a subsystem: frame, cabin and buoys, controls, propellers, and wheels. I owned the frame that everything else attached to."
  ],
  role_items:[
    "Modeled the main frame, front frame, back wing, and landing gear.",
    "Built the frame sub-assemblies and exploded view, and made the working drawing.",
    "Set the frame as the reference the rest of the team built their parts from."
  ],
  learned:[
    "Interlocking parts from different people only fit when everyone agrees on interfaces early and keeps talking.",
    "Starting from the frame gave the team one shared answer to how big everything should be.",
    "Drawings and bills of materials are what turn a model into something someone else can build."
  ],
  gallery:[
    ["img/air-02.webp","Full hovercraft render"],
    ["img/air-53.webp","Rendered on the lake"],
    ["img/air-55.webp","Rendered on a dirt road"],
    ["img/air-03.webp","Early concept sketch"],
    ["img/air-08.webp","Frame assembly"],
    ["img/air-09.webp","Frame assembly, side view"],
    ["img/air-04.webp","Front frame"],
    ["img/air-05.webp","Frame member"],
    ["img/air-06.webp","Back wing"],
    ["img/air-07.webp","Landing gear rail"],
    ["img/air-10.webp","My working drawing for the frame"],
    ["img/air-16.webp","Exploded assembly drawing"]
  ],
  ach:["frame"]
},
"thermal-imager":{
  title:"Thermal Imaging Device", sub:"A low-cost handheld thermal camera",
  dates:"Aug 2026 – present", role:"Solo build", team:"Independent project", where:"Personal", status:"In progress",
  tags:["3D printing","CAD","Python","Interpolation"],
  stats:[["Handheld","Form factor"],["Python","Heatmap"]],
  art:"thermal",
  overview:[
    "A handheld thermal imager built on a budget, housed in a custom 3D-printed enclosure."
  ],
  role_items:[
    "Designing the custom 3D-printed enclosure.",
    "Planning a Python heatmap with interpolation to smooth the sensor's image."
  ],
  learned:["Build in progress. Notes will land here as it comes together."],
  gallery:[], ach:["side"]
},
"cyberdeck":{
  title:"Portable Linux Cyberdeck", sub:"A clamshell Linux terminal inside a Pelican hard case",
  dates:"Sep 2026 – present", role:"Solo build", team:"Independent project", where:"Personal", status:"In progress",
  tags:["CAD","3D printing","Linux","Electro-mechanical packaging"],
  stats:[["$100","Budget"],["~5 in","Display"],["Clamshell","Layout"]],
  art:"terminal",
  overview:[
    "A pocketable Linux machine for terminal work, basic coding, and notes: a small display, a compact physical keyboard, and battery power, all packed into a Pelican hard case that opens like a clamshell."
  ],
  role_items:[
    "Designing the clamshell layout inside the Pelican case.",
    "CAD-modeling each electrical module from measured components, including connector exits and cable-bend clearances, so everything fits the case's internal bounds.",
    "Keeping the hardware within a $100 budget."
  ],
  learned:["Build in progress. Notes will land here as it comes together."],
  gallery:[], ach:["side"]
},
"drawbridge":{
  title:"Automated Drawbridge", sub:"A sensor-driven swing bridge that opens for model boats",
  dates:"High school", role:"Team member", team:"5-person team", where:"High school engineering",
  tags:["CAD","Amatrol controls","Pneumatics","Relays","Prototyping"],
  stats:[["120 psi","Air to the gates"],["2","Proximity sensors"],["3","Relays"]],
  tile:"img/br-20.webp", hero:"img/br-15.webp", video:null,
  overview:[
    "We started with a classic drawbridge lifted by air cylinders, then switched to a swing bridge that rotates on a center pivot. It stood out more, and support in the middle let it carry more weight.",
    "An Amatrol trainer ran the sequence. Proximity sensors spot a boat, red and green lights and a buzzer warn traffic, two pneumatic gates close, and a geared motor swings the bridge open and back."
  ],
  role_items:[
    "CAD-modeled the bridge before building it, then built the basswood truss with wall, lower, and top supports.",
    "Wired proximity sensors that could not connect straight to the controller, using relays to give it a clean input.",
    "Reversed the motor's direction with relays so the bridge could swing both ways.",
    "Split 120 psi shop air through two solenoids to drive the gate cylinders.",
    "Cut styrofoam test boats with a hot wire so we could reshape them quickly between tests."
  ],
  learned:[
    "Without an encoder, slowing the motor by dropping voltage cost too much torque. A gearbox gave us slow speed with enough torque.",
    "Relays are the adapter between sensors and controllers that don't speak the same signal.",
    "Hot glue tacks fast and wood glue gives strength; together they held the truss sides that had no flat backing.",
    "Sketch, then CAD, then build: the model settled the design before we cut any wood."
  ],
  gallery:[
    ["img/br-15.webp","CAD of the swing bridge truss"],
    ["img/br-20.webp","The full rig on the bench"],
    ["img/br-21.webp","Bridge, gates, and motor box together"],
    ["img/br-23.webp","Bridge in place over the channel"],
    ["img/br-28.webp","Testing the rig"],
    ["img/br-40.webp","Proximity sensor watching the channel"],
    ["img/br-43.webp","Motor box wiring and air fittings"],
    ["img/br-45.webp","Relays and controller wiring"],
    ["img/br-13.webp","First design sketch"],
    ["img/br-14.webp","Truss elevation sketch"],
    ["img/br-19.webp","Sketch of the final layout"],
    ["img/br-18.webp","Early basswood pieces"]
  ],
  ach:["origin"]
}
};

const ACH = [
  {id:"lead",name:"Squad Leader",g:30,d:"Mechanical Team Lead on an Army-backed capstone",where:{p:"duck-hunt",sec:"role",i:0}},
  {id:"budget",name:"Under Budget",g:20,d:"$2,047 of $2,500 across two prototypes",where:{p:"duck-hunt",sec:"role",i:3}},
  {id:"boots",name:"Boots on the Range",g:50,d:"Field-tested the first Duck Hunt prototype in Oregon",where:{p:"duck-hunt",sec:"field",i:-1}},
  {id:"fullauto",name:"Full Auto, Fully Mounted",g:50,d:"Weapon mount held through full-auto live and blank fire",where:{p:"duck-hunt",sec:"field",i:0}},
  {id:"pressure",name:"Pressure Point",g:30,d:"Cut a cooling time constant by 42%",where:{p:"refrigeration",sec:"role",i:2}},
  {id:"notch",name:"Anti-Resonance",g:40,d:"99.9% gain cut at the critical frequency",where:{p:"wing-vibration",sec:"role",i:1}},
  {id:"third",name:"Third Time's the Charm",g:20,d:"HV-box mounts verified against vehicle G-force loads",where:{p:"ecocar",sec:"role",i:4}},
  {id:"render",name:"Final Render",g:15,d:"Rendered the competition machine in SolidWorks",where:{p:"kung-fu-machine",sec:"role",i:1}},
  {id:"house",name:"House of Quality",g:15,d:"Built the HoQ that framed Sky Rush",where:{p:"sky-rush",sec:"role",i:0}},
  {id:"frame",name:"Load-Bearing",g:20,d:"Designed the frame the hovercraft was built around",where:{p:"hovercraft",sec:"role",i:0}},
  {id:"heat",name:"Heat Seeker",g:10,d:"Building a handheld thermal imager",where:{p:"thermal-imager",sec:"role",i:1}},
  {id:"side",name:"Side Quest",g:10,d:"Packing a Linux cyberdeck into a Pelican case",where:{p:"cyberdeck",sec:"role",i:1}},
  {id:"origin",name:"Origin Story",g:15,d:"First automated build: a sensor-driven swing bridge",where:{p:"drawbridge",sec:"role",i:1}},
  {id:"hello",name:"Nice to Meet You",g:10,d:"Read about life outside engineering",where:{tab:"profile",key:"about"}},
  {id:"bilingual",name:"Bilingual",g:10,d:"Fluent in English and Spanish",where:{tab:"profile",key:"lang"}},
  {id:"gpa",name:"Straight A's",g:20,d:"4.00 GPA in chemical engineering coursework at Georgia State",where:{tab:"profile",key:"gsu"}},
  {id:"paper",name:"Paper Trail",g:10,d:"Opened the full resume",where:{tab:"resume",key:"open"}}
];
const SEC_NAMES={overview:"Overview",role:"My role",field:"Oregon field test",learned:"What I learned"};
const TOTAL_G = ACH.reduce((s,a)=>s+a.g,0);
