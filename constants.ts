import { Subject } from './types';

const ENTIRE_SUBJECT = "Entire Subject";

export const TOPICS: Record<Subject, string[]> = {
  [Subject.Anatomy]: [
    ENTIRE_SUBJECT,
    "Superior Extremity",
    "Inferior Extremity",
    "Thorax",
    "Abdomen",
    "Head and Neck",
    "Neuro-Anatomy",
    "General Anatomy, Embryology & Genetics",
  ],
  [Subject.Physiology]: [
    ENTIRE_SUBJECT,
    "General & Nerve Muscle Physiology",
    "Blood",
    "Respiratory System",
    "Cardiovascular System",
    "Gastro-intestinal System",
    "Excretory System",
    "Reproductive System",
    "Endocrine System",
    "Central Nervous System",
    "Special Senses",
  ],
  [Subject.Biochemistry]: [
    ENTIRE_SUBJECT,
    "Carbohydrate Chemistry & Metabolism",
    "Lipid Chemistry & Metabolism",
    "Protein Chemistry & Metabolism",
    "Nucleotide Chemistry & Metabolism",
    "Enzymes & Clinical Function Tests",
    "Molecular Biology & Genetics",
    "Vitamins, Minerals & Antioxidants",
  ],
};