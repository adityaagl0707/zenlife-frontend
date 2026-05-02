import { Finding } from "./api";

export const ORGAN_PARAM_MAP: Record<string, string[]> = {
  "Heart Health": [
    "agatston score (total)","aorta and branches","apoa1","apolipoprotein b",
    "cardia","carotid cimt","carotid plaque score","hdl cholesterol",
    "hdl/ldl ratio","heart rate","homocysteine levels","iliac vessels",
    "ivc and tributaries","lad agatston score","lad calcified plaques","lad volume (mm³)",
    "lck agatston score","lck calcified plaques","lck volume (mm³)","ldl cholesterol",
    "ldl/hdl ratio","lipoprotein (a)","lm agatston score","lm calcified plaques",
    "lm volume (mm³)","neck vessels","non-hdl cholesterol","nt-probnp",
    "other major vessels","p-wave duration","pericardium","pr interval",
    "qrs duration","qt interval (qtc)","rca agatston score","rca calcified plaques",
    "rca volume (mm³)","rhythm","st segment","superior venacava",
    "total cholesterol","total cholesterol / hdl","triglycerides","triglycerides / hdl",
    "vldl cholesterol",
  ],

  "Endocrine & Metabolic Health": [
    "adrenals","android fat","android:gynoid ratio","apolipoprotein b",
    "average blood glucose","bmi","body fat","c-peptide",
    "cortisol","dhea","fasting blood glucose","fat free mass",
    "fat mass index","gynoid fat","hba1c","hdl cholesterol",
    "hdl/ldl ratio","homa-ir","igf-1","insulin",
    "ketone","ldl cholesterol","ldl/hdl ratio","lipoprotein (a)",
    "liver fat %","liver steatosis grade","non-hdl cholesterol","reverse t3",
    "testosterone","thyroid","thyroid lesions","thyroid volume",
    "thyroxine (t4) free","total cholesterol","total cholesterol / hdl","total fat mass",
    "tpo","triglycerides","triglycerides / hdl","triiodothyronine (t3) free",
    "trunk fat mass","trunk:limb fat ratio","tsh","visceral fat level",
    "visceral fat mass","vldl cholesterol",
  ],

  "Liver & Digestive Health": [
    "abdominal wall","afp","albumin","alp",
    "alt","amylase","ast","ast/alt ratio",
    "bilirubin (indirect)","bilirubin direct","bowel","cardia",
    "cbd (common bile duct)","cea","extrahepatic biliary tree","gall bladder content",
    "gallbladder pericholecystic region","gallbladder size","gallbladder wall","ggt",
    "globulin","hepatic veins","intrahepatic biliary radicals","lipase",
    "liver and digestive health: congenital causes","liver and digestive health: degenerative","liver and digestive health: infective-active","liver and digestive health: inflammation",
    "liver and digestive health: ischemic causes","liver and digestive health: post-infective","liver and digestive health: tumours","liver fat %",
    "liver outline & size","liver parenchyma","liver steatosis grade","liver: focal changes",
    "liver: hepatic veins","liver: portal vein","mesentric vessels","nasopharynx",
    "oesophagus","oropharynx","pancreas duct","pancreas outline",
    "pancreatic parenchyma","parotid glands","peri-rectal fat","peripancreatic region",
    "periportal region","perisplenic region","peritoneum","pt / inr",
    "rectum & rectosigmoid","retroperitoneum","serum albumin/globulin","spleen parenchyma",
    "spleen size & outline","splenic hilum","splenic vessels","total bilirubin",
    "total protein",
  ],

  "Brain & Cognitive Health": [
    "basal ganglia","bone, muscle & joint health: congenital causes","bone, muscle & joint health: degenerative","bone, muscle & joint health: infective-active",
    "bone, muscle & joint health: inflammation","bone, muscle & joint health: ischemic causes","bone, muscle & joint health: post-infective","bone, muscle & joint health: traumatic issues",
    "bone, muscle & joint health: tumours","brain: congenital causes","brain: degenerative","brain: infective-active",
    "brain: ischemic causes","brain: post-infective","brain: tumours","cerebral white matter",
    "endocrine and metabolic health: congenital causes","endocrine and metabolic health: degenerative","endocrine and metabolic health: infective-active","endocrine and metabolic health: inflammation",
    "endocrine and metabolic health: ischemic causes","endocrine and metabolic health: post-infective","endocrine and metabolic health: tumours","frontal sinuses",
    "globes","heart health: congenital causes","heart health: degenerative","heart health: infective-active",
    "heart health: inflammation","heart health: ischemic causes","heart health: post-infective","heart health: tumours",
    "homocysteine levels","kidney & urinary health: congenital causes","kidney & urinary health: degenerative","kidney & urinary health: infective-active",
    "kidney & urinary health: inflammation","kidney & urinary health: ischemic causes","kidney & urinary health: post-infective","kidney & urinary health: traumatic issues",
    "kidney & urinary health: tumours","lacrimal glands","maxillary sinuses","meninges",
    "midbrain","optic nerve","orbital fat","orbits",
    "paranasal sinuses","pons","reproductive health: congenital causes","reproductive health: degenerative",
    "reproductive health: infective-active","reproductive health: inflammation","reproductive health: ischemic causes","reproductive health: post-infective",
    "reproductive health: tumours","veins","ventricles","white matter hyperintensity",
  ],

  "Kidney & Urinary Health": [
    "appearance","bacteria","bile pigment","bile salt",
    "blood urea nitrogen (bun)","bun / creatinine ratio","casts","chloride",
    "collecting system","colour","cortico-sinus signals","creatinine",
    "creatinine urine","crystals","cystatin c","egfr",
    "epithelial cells","kidneys size, outline","leucocyte esterase","mesentric vessels",
    "mucus","nitrite","other pelvic viscera","parasite",
    "pelvic cavity","pelvic lymphnodes","pelvic soft tissues","peri-renal fat",
    "peri-renal spaces","ph","potassium","psoas muscles",
    "pth","red blood cells","renal cortical thickness","renal vessels",
    "retroperitoneum","sodium","specific gravity","ua (uric acid)",
    "urea (calculated)","urea/creatinine ratio","ureters","urinary bilirubin",
    "urinary bladder contents","urinary bladder contour","urinary bladder perivesical fat","urinary bladder walls",
    "urinary glucose","urinary leucocytes","urinary microalbumin","urinary protein",
    "urine albumin/creatinine","urine blood","urine ketone","yeast",
  ],

  "Inflammation & Immune Health": [
    "abdominal lymph nodes","anti-tg","basophils","basophils - count",
    "d-dimer","eosinophils","eosinophils - count","esr",
    "fibrinogen","homocysteine levels","hs-crp","ige",
    "left breast: lymphadenopathy","lymphocytes","lymphocytes - count","monocytes",
    "monocytes - count","neck lymphnodes","neutrophils","neutrophils - count",
    "right breast: lymphadenopathy","vitamin e",
  ],

  "General Health, Blood & Nutrients": [
    "abdominal wall","android fat","android:gynoid ratio","basophils",
    "basophils - count","bmi","body fat","calcium",
    "cea","copper","eosinophils","eosinophils - count",
    "ferritin","folate (b9)","gynoid fat","hematocrit",
    "hemoglobin","immature granulocytes","immature granulocytes %","iron",
    "iron % saturation","ldh","lean mass","lymphocytes",
    "lymphocytes - count","magnesium, rbc","mch","mchc",
    "mcv","monocytes","monocytes - count","mpv",
    "neutrophils","neutrophils - count","nucleated rbc","nucleated rbc %",
    "pdw","peritoneum","phosphorus","platelet count",
    "plateletcrit (pct)","plcr","rbc","rdw",
    "rdw-sd","rsmi","selenium","tibc",
    "uibc","visceral fat mass","vitamin a","vitamin b12",
    "vitamin d","vitamin e","wbc","zinc",
  ],

  "Reproductive Health": [
    "ca-125","cervix","cortisol","dhea",
    "endometrium","estradiol (e2)","free testosterone","hpv dna test",
    "other pelvic viscera","ovaries","pap smear","pelvic cavity",
    "pelvic lymphnodes","pelvic soft tissues","pelvic ultrasound","prostate",
    "prostate volume","psa","seminal vesicles","testosterone",
    "uterus",
  ],

  "Bone, Muscle & Joint Health": [
    "appendicular lean mass","asmi","cord, conus","facets",
    "fat free mass","foramina","lean mass","mandible",
    "marrow signals","maxilla","mineral bone density (t-score)","mineral bone density (z-score)",
    "paravertebral muscles","phosphorus","psoas muscles","pth",
    "rsmi","spinal canal","spine curvature","spine: discs",
    "spine: ligaments","spine: signal intensities","total fat mass","total lean mass",
    "trunk fat mass","trunk lean","vertebral bodies","vertebral body alignment",
    "visceral fat level",
  ],

  "Lung & Respiratory Health": [
    "airway condition","copd / emphysema","glottis","lung nodules & masses",
    "lung parenchyma","lung vasculature","lung volume","mediastinal lymph nodes",
    "mediastinum & lymph nodes","neck lymphnodes","pleural cavities","pleural space",
    "pneumonia / infection","pulmonary fibrosis","subglottis","supra-glottis",
  ],

  "Vascular Health": [
    "agatston score (total)","aorta and branches","apoa1","apolipoprotein b",
    "carotid cimt","carotid plaque score","d-dimer","fat mass index",
    "fibrinogen","homa-ir","iliac vessels","ivc and tributaries",
    "lad agatston score","lad calcified plaques","lad volume (mm³)","lck agatston score",
    "lck calcified plaques","lck volume (mm³)","lipoprotein (a)","lm agatston score",
    "lm calcified plaques","lm volume (mm³)","mesentric vessels","neck vessels",
    "nt-probnp","other major vessels","p-wave duration","pt / inr",
    "rca agatston score","rca calcified plaques","rca volume (mm³)","renal vessels",
    "splenic vessels","superior venacava","trunk:limb fat ratio",
  ],

  "Hormonal & Vitality Health": [
    "adrenals","anti-tg","cortisol","dhea",
    "estradiol (e2)","free testosterone","igf-1","psa",
    "reverse t3","shbg","testosterone","thyroid",
    "thyroid lesions","thyroid volume","thyroxine (t4) free","tpo",
    "triiodothyronine (t3) free","tsh",
  ],

  "Mental & Stress Resilience": [
    "basal ganglia","cerebral white matter","cortisol","dhea",
    "meninges","midbrain","pons","ventricles",
    "white matter hyperintensity",
  ],

  "Women's Health": [
    "amh","breast","breast density","breast ultrasound",
    "ca 15-3","ca-125","cervix","dhea-s",
    "endometrial thickness","endometrium","estradiol (e2)","fsh",
    "he4","hpv dna test","left breast: architectural distortion","left breast: asymmetry",
    "left breast: bi-rads category","left breast: calcifications","left breast: mass","left breast: nipple retraction",
    "left breast: skin thickening","lh","mammography","ovaries",
    "overall assessment","pap smear","pelvic ultrasound","progesterone",
    "prolactin","right breast: architectural distortion","right breast: asymmetry","right breast: bi-rads category",
    "right breast: calcifications","right breast: mass","right breast: nipple retraction","right breast: skin thickening",
    "transvaginal ultrasound","uterus",
  ],

  "Men's Health": [
    "free testosterone","prostate","prostate size (if male)","prostate volume",
    "psa","seminal vesicles","shbg","testosterone",
  ],

};

export type SeverityCounts = { critical: number; major: number; minor: number; normal: number };

// ── Canonicalization ────────────────────────────────────────────────────────
// Many parameter names appear in the map under multiple aliases or with minor
// punctuation/spacing differences from how the AI extractor stores them.
// `ALIASES` collapses every synonym → a single canonical name so we can do
// exact-match lookups without losing data.
const ALIASES: Record<string, string> = {
  // Calcium scoring — vendor reports break Agatston by vessel
  "agaston score": "agatston score",
  "agatston score (total)": "agatston score",
  "lad agatston score": "agatston score",
  "lck agatston score": "agatston score",
  "lm agatston score": "agatston score",
  "rca agatston score": "agatston score",
  // Glucose
  "fbs": "fasting blood glucose",
  "glucose": "fasting blood glucose",
  "fasting glucose": "fasting blood glucose",
  "fasting blood sugar": "fasting blood glucose",
  "fasting blood glucose test": "fasting blood glucose",
  // Liver enzymes
  "alk phos": "alp",
  "alkaline phosphatase": "alp",
  // Inflammation
  "crp": "hs-crp",
  "c reactive protein": "hs-crp",
  "c-reactive protein": "hs-crp",
  // CBC differential twin pairs — % and absolute count are the SAME measurement.
  // Collapse to the absolute-count canonical so a pair counts once in organ totals.
  "lymph %": "lymphocytes - count",
  "lymphocyte %": "lymphocytes - count",
  "lymphocytes %": "lymphocytes - count",
  "lymphocyte percentage": "lymphocytes - count",
  "lymphocytes": "lymphocytes - count",
  "neutrophils": "neutrophils - count",
  "monocytes": "monocytes - count",
  "eosinophils": "eosinophils - count",
  "basophils": "basophils - count",
  "immature granulocytes %": "immature granulocytes",
  "nucleated rbc %": "nucleated rbc",
  // Lipids
  "non hdl cholesterol": "non-hdl cholesterol",
  "ldl/hdl ratio": "hdl/ldl ratio",
  // Vascular
  "aorta & branches": "aorta and branches",
  // MRI organ-prefixed variants
  "hepatic veins": "liver: hepatic veins",
  // Bone density spacing typo
  "mineral bone density(t-score)": "mineral bone density (t-score)",
  "mineral bone density(z-score)": "mineral bone density (z-score)",
  // Spine spacing typo (map has space, DB has none)
  "spine: ligaments": "spine:ligaments",
  "spine: signal intensities": "spine:signal intensities",
  // Reproductive / Men's
  "prostate": "prostate size (if male)",
  "prostate volume": "prostate size (if male)",
};

// Rollup labels are radiology category headers (e.g. "Heart Health:
// degenerative") — they're never imported as discrete findings, so they
// inflate the "X not imported" count and mislead the user. Strip them
// from both the total and the matcher.
const ROLLUP_RX = /:\s*(degenerative|post-infective|inflammation|traumatic issues|tumours|infective-active|ischemic causes|congenital causes)\b/i;
const isRollup = (p: string): boolean =>
  ROLLUP_RX.test(p) || p === "general health, blood and nutrients";

const canon = (s: string): string => {
  const k = s.toLowerCase().trim();
  return ALIASES[k] ?? k;
};

const canonicalParamSet = (organName: string): Set<string> => {
  const params = ORGAN_PARAM_MAP[organName] ?? [];
  return new Set(params.filter(p => !isRollup(p)).map(canon));
};

export function organTotalParams(organName: string): number {
  return canonicalParamSet(organName).size;
}

/**
 * How many of this organ's canonical params appear in the report's
 * `ignored_params` list. Used to shrink the displayed denominator so the
 * patient sees an honest "X imported / Y applicable" ratio.
 */
export function organIgnoredCount(organName: string, ignoredParams: string[]): number {
  if (!ignoredParams?.length) return 0;
  const wanted = canonicalParamSet(organName);
  if (!wanted.size) return 0;
  const seen = new Set<string>();
  let n = 0;
  for (const name of ignoredParams) {
    const key = canon(name);
    if (wanted.has(key) && !seen.has(key)) {
      seen.add(key);
      n++;
    }
  }
  return n;
}

export function computeOrganCounts(organName: string, findings: Finding[]): SeverityCounts {
  const counts: SeverityCounts = { critical: 0, major: 0, minor: 0, normal: 0 };
  if (!findings.length) return counts;

  const wanted = canonicalParamSet(organName);
  if (!wanted.size) return counts;

  // Deduplicate by canonical name so multi-vessel rows (e.g. 5 Agatston
  // entries → one "agatston score") don't inflate the count beyond the total.
  const seen = new Set<string>();
  for (const f of findings) {
    const key = canon(f.name);
    if (!wanted.has(key) || seen.has(key)) continue;
    seen.add(key);
    const sev = f.severity as keyof SeverityCounts;
    if (sev in counts) counts[sev]++;
  }
  return counts;
}
