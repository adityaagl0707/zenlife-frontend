import { Finding } from "./api";

export const ORGAN_PARAM_MAP: Record<string, string[]> = {
  "Heart Health": [
    // Coronary calcium (Agatston by vessel)
    "agatston score (total)","lad agatston score","lad calcified plaques","lad volume (mm³)",
    "lck agatston score","lck calcified plaques","lck volume (mm³)","lm agatston score",
    "lm calcified plaques","lm volume (mm³)","rca agatston score","rca calcified plaques",
    "rca volume (mm³)",
    // Cardiac chamber / ECG
    "heart rate","nt-probnp","p-wave duration","pericardium","pr interval",
    "qrs duration","qt interval (qtc)","rhythm","st segment",
    // Cardiac risk markers (lipid panel + cardiac proteins + homocysteine)
    "apoa1","apolipoprotein b","hdl cholesterol","hdl/ldl ratio","homocysteine levels",
    "ldl cholesterol","ldl/hdl ratio","lipoprotein (a)","non-hdl cholesterol",
    "total cholesterol","total cholesterol / hdl","triglycerides","triglycerides / hdl",
    "vldl cholesterol",
  ],

  "Endocrine & Hormonal Health": [
    // Body composition (DEXA) lives here as the canonical metabolic signal
    "android fat","android:gynoid ratio","bmi","body fat","fat free mass",
    "fat mass index","gynoid fat","total fat mass","trunk fat mass","trunk:limb fat ratio",
    "visceral fat level","visceral fat mass",
    // Glucose / insulin axis
    "average blood glucose","c-peptide","fasting blood glucose","hba1c","homa-ir",
    "insulin","ketone",
    // Thyroid axis
    "anti-tg","reverse t3","thyroid","thyroid lesions","thyroid volume",
    "thyroxine (t4) free","tpo","triiodothyronine (t3) free","tsh",
    // Adrenal / growth (sex hormones moved to Men's / Women's; lipids to Heart)
    "adrenals","cortisol","dhea","igf-1",
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
    "liver: hepatic veins","liver: portal vein","nasopharynx",
    "oesophagus","oropharynx","pancreas duct","pancreas outline",
    "pancreatic parenchyma","parotid glands","peri-rectal fat","peripancreatic region",
    "periportal region","perisplenic region","peritoneum","pt / inr",
    "rectum & rectosigmoid","serum albumin/globulin","spleen parenchyma",
    "spleen size & outline","splenic hilum","total bilirubin","total protein",
  ],

  "Brain & Mental Health": [
    "basal ganglia","brain: congenital causes","brain: degenerative","brain: infective-active",
    "brain: ischemic causes","brain: post-infective","brain: tumours","cerebral white matter",
    "frontal sinuses","globes","lacrimal glands","maxillary sinuses","meninges",
    "midbrain","optic nerve","orbital fat","orbits",
    "paranasal sinuses","pons","veins","ventricles","white matter hyperintensity",
    // Cross-system rollup labels (not real findings; filtered by isRollup)
    "bone, muscle & joint health: congenital causes","bone, muscle & joint health: degenerative",
    "bone, muscle & joint health: infective-active","bone, muscle & joint health: inflammation",
    "bone, muscle & joint health: ischemic causes","bone, muscle & joint health: post-infective",
    "bone, muscle & joint health: traumatic issues","bone, muscle & joint health: tumours",
    "endocrine and metabolic health: congenital causes","endocrine and metabolic health: degenerative",
    "endocrine and metabolic health: infective-active","endocrine and metabolic health: inflammation",
    "endocrine and metabolic health: ischemic causes","endocrine and metabolic health: post-infective",
    "endocrine and metabolic health: tumours","heart health: congenital causes","heart health: degenerative",
    "heart health: infective-active","heart health: inflammation","heart health: ischemic causes",
    "heart health: post-infective","heart health: tumours","kidney & urinary health: congenital causes",
    "kidney & urinary health: degenerative","kidney & urinary health: infective-active",
    "kidney & urinary health: inflammation","kidney & urinary health: ischemic causes",
    "kidney & urinary health: post-infective","kidney & urinary health: traumatic issues",
    "kidney & urinary health: tumours",
  ],

  "Kidney & Urinary Health": [
    "appearance","bacteria","bile pigment","bile salt",
    "blood urea nitrogen (bun)","bun / creatinine ratio","casts","chloride",
    "collecting system","colour","cortico-sinus signals","creatinine",
    "creatinine urine","crystals","cystatin c","egfr",
    "epithelial cells","kidneys size, outline","leucocyte esterase",
    "mucus","nitrite","other pelvic viscera","parasite",
    "pelvic cavity","pelvic lymphnodes","pelvic soft tissues","peri-renal fat",
    "peri-renal spaces","ph","potassium",
    "pth","red blood cells","renal cortical thickness",
    "retroperitoneum","sodium","specific gravity","ua (uric acid)",
    "urea (calculated)","urea/creatinine ratio","ureters","urinary bilirubin",
    "urinary bladder contents","urinary bladder contour","urinary bladder perivesical fat","urinary bladder walls",
    "urinary glucose","urinary leucocytes","urinary microalbumin","urinary protein",
    "urine albumin/creatinine","urine blood","urine ketone","yeast",
  ],

  "Blood, Immunity & Nutrition": [
    // CBC + differential
    "rbc","wbc","hemoglobin","hematocrit","mcv","rdw","rdw-sd","mch","mchc",
    "platelet count","plateletcrit (pct)","mpv","pdw","plcr",
    "nucleated rbc","nucleated rbc %","immature granulocytes","immature granulocytes %",
    "basophils","basophils - count","eosinophils","eosinophils - count",
    "lymphocytes","lymphocytes - count","monocytes","monocytes - count",
    "neutrophils","neutrophils - count",
    // Inflammation / immunity (vascular clotting markers moved to Vascular)
    "abdominal lymph nodes","esr","hs-crp","ige",
    "left breast: lymphadenopathy","right breast: lymphadenopathy","neck lymphnodes",
    // Iron studies
    "ferritin","iron","iron % saturation","tibc","uibc",
    // Vitamins & minerals
    "calcium","copper","folate (b9)","ldh","magnesium, rbc",
    "selenium","vitamin a","vitamin b12","vitamin d","vitamin e","zinc",
  ],

  "Bone, Muscle & Joint Health": [
    "appendicular lean mass","asmi","cord, conus","facets",
    "foramina","lean mass","mandible","marrow signals","maxilla",
    "mineral bone density (t-score)","mineral bone density (z-score)",
    "paravertebral muscles","phosphorus","psoas muscles","rsmi",
    "spinal canal","spine curvature","spine: discs",
    "spine: ligaments","spine: signal intensities","total lean mass",
    "trunk lean","vertebral bodies","vertebral body alignment",
  ],

  "Lung & Respiratory Health": [
    "airway condition","copd / emphysema","glottis","lung nodules & masses",
    "lung parenchyma","lung vasculature","lung volume","mediastinal lymph nodes",
    "mediastinum & lymph nodes","pleural cavities","pleural space",
    "pneumonia / infection","pulmonary fibrosis","subglottis","supra-glottis",
  ],

  "Vascular Health": [
    // Peripheral vessels (coronary calcium lives under Heart Health)
    "aorta and branches","carotid cimt","carotid plaque score","iliac vessels",
    "ivc and tributaries","mesentric vessels","neck vessels","other major vessels",
    "renal vessels","splenic vessels","superior venacava",
    // Clotting / thrombosis markers
    "d-dimer","fibrinogen",
  ],

  // Hormonal & Vitality Health merged into Endocrine & Hormonal Health
  // Mental & Stress Resilience merged into Brain & Mental Health
  // Inflammation & Immune Health merged into Blood, Immunity & Nutrition

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
 * Params that don't apply to this patient's gender. Mirrors backend
 * SECTION_PARAMETERS gender flags — used to shrink frontend organ totals
 * and pre-filter UI lists. Lowercase canonical names.
 */
const FEMALE_ONLY = new Set([
  "amh","breast","breast ultrasound","ca 15-3","cervix","dhea-s",
  "endometrial thickness","endometrium","fsh","he4","hpv dna test","lh",
  "mammography","ovaries","pap smear","pelvic ultrasound","progesterone",
  "prolactin","transvaginal ultrasound","uterus",
].map(canon));
const MALE_ONLY = new Set([
  "psa","prostate volume","prostate size (if male)","seminal vesicles",
].map(canon));

export function genderExcludedNames(gender?: string): Set<string> {
  const g = (gender || "").toUpperCase();
  if (g === "M" || g === "MALE") return FEMALE_ONLY;
  if (g === "F" || g === "FEMALE") return MALE_ONLY;
  return new Set();
}

/** Canonical param count for an organ, with gender-inapplicable params removed. */
export function organApplicableTotal(organName: string, gender?: string): number {
  const excluded = genderExcludedNames(gender);
  if (!excluded.size) return organTotalParams(organName);
  const wanted = canonicalParamSet(organName);
  let n = 0;
  for (const p of wanted) if (!excluded.has(p)) n++;
  return n;
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
