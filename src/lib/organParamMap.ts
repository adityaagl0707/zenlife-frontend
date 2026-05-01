import { Finding } from "./api";

export const ORGAN_PARAM_MAP: Record<string, string[]> = {
  "Heart Health": [
    "agaston score","agatston score","ldl cholesterol","homocysteine levels",
    "total cholesterol","hdl cholesterol","triglycerides","non-hdl cholesterol",
    "vldl cholesterol","triglycerides / hdl","total cholesterol / hdl","hdl/ldl ratio",
    "lipoprotein (a)","apolipoprotein b","ldl/hdl ratio","st segment",
    "iliac vessels","aorta & branches","superior venacava","pericardium",
    "heart health: degenerative","heart health: post-infective","heart health: inflammation",
    "heart health: traumatic issues","ivc and tributaries","other major vessels",
    "aorta and branches","cardia","neck vessels","heart health: tumours",
    "heart health: infective-active","heart health: ischemic causes",
    "heart health: congenital causes","heart rate","qt interval (qtc)",
    "rhythm","qrs duration","pr interval","nt-probnp","p-wave duration",
  ],

  "Endocrine & Metabolic Health": [
    "gynoid fat","visceral fat mass","ldl cholesterol","fasting blood glucose test",
    "glucose","fasting glucose","fasting blood sugar","fbs",
    "total cholesterol","hdl cholesterol","triglycerides","non-hdl cholesterol",
    "cortisol","dhea","vldl cholesterol","triglycerides / hdl",
    "total cholesterol / hdl","hdl/ldl ratio","android:gynoid ratio","android fat",
    "bmi","body fat","tpo","insulin","hba1c","ketone","tsh",
    "thyroxine (t4) free","triiodothyronine (t3) free","average blood glucose",
    "testosterone","lipoprotein (a)","apolipoprotein b","ldl/hdl ratio",
    "endocrine and metabolic health: degenerative","endocrine and metabolic health: post-infective",
    "endocrine and metabolic health: inflammation","endocrine and metabolic health: traumatic issues",
    "adrenals","thyroid","endocrine and metabolic health: tumours",
    "endocrine and metabolic health: infective-active","endocrine and metabolic health: ischemic causes",
    "endocrine and metabolic health: congenital causes",
    "c-peptide","homa-ir","igf-1","reverse t3","fat mass index","trunk:limb fat ratio",
    "liver steatosis grade","liver fat %",
  ],

  "Liver & Digestive Health": [
    "ast","total protein","globulin","alt","abdominal wall","ggt",
    "bilirubin (indirect)","serum albumin/globulin","albumin","total bilirubin",
    "bilirubin direct","alp","alkaline phosphatase","alk phos","lipase","amylase","ast/alt ratio",
    "mesentric vessels","peritoneum","retroperitoneum","cardia","peri-rectal fat",
    "rectum & rectosigmoid","perisplenic region","splenic vessels","peripancreatic region",
    "liver parenchyma","extrahepatic biliary tree","liver and digestive health: degenerative",
    "liver and digestive health: traumatic issues","liver and digestive health: post-infective",
    "liver and digestive health: inflammation","pancreatic parenchyma","bowel",
    "splenic hilum","spleen parenchyma","spleen size & outline","pancreas outline",
    "pancreas duct","gallbladder pericholecystic region","gall bladder content",
    "periportal region","hepatic veins","oesophagus","parotid glands",
    "oropharynx","nasopharynx","liver and digestive health: tumours",
    "liver and digestive health: infective-active","liver and digestive health: ischemic causes",
    "liver and digestive health: congenital causes","intrahepatic biliary radicals",
    "afp","cea","liver steatosis grade","liver fat %","pt / inr",
  ],

  "Brain & Cognitive Health": [
    "homocysteine levels","brain: ischemic causes","cerebral white matter",
    "brain: degenerative","brain: post-infective","brain: infective-active",
    "brain: congenital causes","lacrimal glands","orbital fat","optic nerve",
    "globes","orbits","maxillary sinuses","frontal sinuses","paranasal sinuses",
    "veins","meninges","pons","midbrain","ventricles","basal ganglia",
    "white matter hyperintensity",
  ],

  "Kidney & Urinary Health": [
    "creatinine","ua (uric acid)","urinary bladder walls","urine albumin/creatinine",
    "blood urea nitrogen (bun)","sodium","potassium","bun / creatinine ratio",
    "chloride","egfr","urea/creatinine ratio","urea (calculated)",
    "urinary microalbumin","urinary leucocytes","mucus","parasite","urine ketone",
    "epithelial cells","crystals","colour","casts","bile salt","bile pigment",
    "ph","urinary protein","red blood cells","yeast","bacteria",
    "urinary bilirubin","urine blood","urinary glucose","creatinine urine",
    "leucocyte esterase","nitrite","specific gravity","appearance",
    "pelvic lymphnodes","pelvic cavity","pelvic soft tissues","other pelvic viscera",
    "mesentric vessels","psoas muscles","retroperitoneum","urinary bladder contents",
    "ureters","peri-renal fat","cortico-sinus signals",
    "kidney & urinary health: degenerative","kidney & urinary health: post-infective",
    "kidney & urinary health: inflammation","kidney & urinary health: congenital causes",
    "urinary bladder perivesical fat","urinary bladder contour","peri-renal spaces",
    "renal vessels","collecting system","kidneys size, outline",
    "kidney & urinary health: tumours","kidney & urinary health: infective-active",
    "kidney & urinary health: ischemic causes","kidney & urinary health: traumatic issues",
    "cystatin c","pth","renal cortical thickness",
  ],

  "Inflammation & Immune Health": [
    "homocysteine levels","basophils","monocytes","lymphocytes","eosinophils",
    "ige","neck lymphnodes","basophils - count","monocytes - count",
    "lymphocytes - count","eosinophils - count","hs-crp","crp","c-reactive protein",
    "c reactive protein","neutrophils","neutrophils - count",
    "lymphocyte %","lymphocyte percentage","lymphocytes %","lymph %",
    "fibrinogen","esr","d-dimer","anti-tg","vitamin e",
  ],

  "General Health, Blood & Nutrients": [
    "gynoid fat","visceral fat mass","basophils","monocytes","lymphocytes",
    "eosinophils","vitamin d","copper","folate (b9)","android:gynoid ratio",
    "android fat","bmi","body fat","abdominal wall","iron % saturation",
    "rbc","calcium","leukocytes","iron","tibc","vitamin a","zinc",
    "selenium","wbc","mpv","hemoglobin","platelet count","hematocrit",
    "mcv","rdw","mch","mchc","uibc","basophils - count","plateletcrit (pct)",
    "nucleated rbc %","nucleated rbc","immature granulocytes %",
    "immature granulocytes","rdw-sd","plcr","pdw","monocytes - count",
    "lymphocytes - count","eosinophils - count","vitamin b12","neutrophils",
    "magnesium, rbc","ferritin","neutrophils - count","rsmi","lean mass",
    "peritoneum","general health, blood and nutrients",
    "lymphocyte %","lymphocyte percentage","lymphocytes %","lymph %",
    "phosphorus","vitamin e","ldh","cea",
  ],

  "Reproductive Health": [
    "cortisol","dhea","psa","testosterone","pelvic lymphnodes",
    "reproductive health: degenerative","reproductive health: post-infective",
    "reproductive health: inflammation","reproductive health: traumatic issues",
    "pelvic cavity","pelvic soft tissues","other pelvic viscera",
    "reproductive health: tumours","reproductive health: infective-active",
    "reproductive health: ischemic causes","reproductive health: congenital causes",
    "free testosterone","estradiol (e2)","shbg","prostate volume","ca-125",
  ],

  "Bone, Muscle & Joint Health": [
    "spine: discs","spine curvature","mineral bone density(z-score)",
    "mineral bone density(t-score)","rsmi","lean mass","psoas muscles",
    "mandible","maxilla","bone, muscle & joint health: post-infective",
    "bone, muscle & joint health: inflammation","bone, muscle & joint health: traumatic issues",
    "bone, muscle & joint health: degenerative","bone, muscle & joint health: tumours",
    "bone, muscle & joint health: infective-active","bone, muscle & joint health: ischemic causes",
    "bone, muscle & joint health: congenital causes","cord, conus",
    "paravertebral muscles","facets","spine: ligaments","marrow signals",
    "vertebral body alignment","vertebral bodies","spinal canal","foramina",
    "spine: signal intensities","pth","phosphorus","asmi","fat mass index","trunk:limb fat ratio",
  ],

  "Lung & Respiratory Health": [
    "neck lymphnodes","pulmonary fibrosis","copd / emphysema","lung vasculature",
    "airway condition","lung volume","pneumonia / infection",
    "mediastinum & lymph nodes","pleural space","lung nodules & masses",
    "lung parenchyma","mediastinal lymph nodes","subglottis",
    "lung and respiratory health: degenerative","lung and respiratory health: post-infective",
    "lung and respiratory health: inflammation","lung and respiratory health: congenital causes",
    "pleural cavities","glottis","supra-glottis","lung and respiratory health: tumours",
    "lung and respiratory health: infective-active","lung and respiratory health: ischemic causes",
    "lung and respiratory health: traumatic issues",
  ],

  // ── 3 New Organ Systems ────────────────────────────────────────────────
  "Vascular Health": [
    "aorta & branches","aorta and branches","iliac vessels","neck vessels",
    "superior venacava","ivc and tributaries","other major vessels",
    "renal vessels","mesentric vessels","splenic vessels",
    "carotid cimt","carotid plaque score",
    "agatston score","agaston score","lipoprotein (a)","apolipoprotein b","apoa1",
    "fibrinogen","d-dimer","nt-probnp","pt / inr",
    "fat mass index","trunk:limb fat ratio","homa-ir",
    "p-wave duration",
  ],

  "Hormonal & Vitality Health": [
    "testosterone","free testosterone","estradiol (e2)","shbg",
    "dhea","igf-1","cortisol","cortisol (urine)",
    "tsh","thyroxine (t4) free","triiodothyronine (t3) free","reverse t3",
    "tpo","anti-tg",
    "thyroid","adrenals",
    "psa","ca-125",
    "endocrine and metabolic health: degenerative",
    "endocrine and metabolic health: post-infective",
    "endocrine and metabolic health: inflammation",
    "endocrine and metabolic health: tumours",
    "endocrine and metabolic health: infective-active",
    "endocrine and metabolic health: ischemic causes",
    "endocrine and metabolic health: congenital causes",
  ],

  "Mental & Stress Resilience": [
    "cortisol","dhea","nt-probnp",
    "cerebral white matter","white matter hyperintensity",
    "brain: ischemic causes","brain: degenerative",
    "basal ganglia","ventricles","midbrain","pons","meninges",
  ],

  // ── Gender-specific organ systems ──────────────────────────────────────────
  "Women's Health": [
    "pap smear","hpv dna test","mammography","breast ultrasound",
    "transvaginal ultrasound","endometrial thickness","pelvic ultrasound",
    "ca-125","he4","ca 15-3","fsh","lh","progesterone","prolactin",
    "amh","estradiol (e2)","dhea-s","uterus","ovaries","cervix",
    "endometrium","breast",
  ],

  "Men's Health": [
    "psa","prostate volume","testosterone","free testosterone",
    "shbg","prostate","seminal vesicles",
  ],
};

export type SeverityCounts = { critical: number; major: number; minor: number; normal: number };

export function organTotalParams(organName: string): number {
  return new Set(ORGAN_PARAM_MAP[organName] ?? []).size;
}

export function computeOrganCounts(organName: string, findings: Finding[]): SeverityCounts {
  const params = ORGAN_PARAM_MAP[organName];
  if (!params || !findings.length) return { critical: 0, major: 0, minor: 0, normal: 0 };

  const paramSet = new Set(params);
  const counts: SeverityCounts = { critical: 0, major: 0, minor: 0, normal: 0 };

  for (const f of findings) {
    const key = f.name.toLowerCase().trim();
    if (paramSet.has(key)) {
      const sev = f.severity as keyof SeverityCounts;
      if (sev in counts) counts[sev]++;
    }
  }
  return counts;
}
