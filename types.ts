export enum StageType {
  INVITING = 'Inviting',
  EXPLORING = 'Exploring',
  INFORMATION_EXCHANGE = 'Information Exchange', // Merged Clarifying & Option-by-option
  ELICITING_VALUES = 'Eliciting Values',
  DELIBERATING = 'Deliberating',
  SUPPORTING = 'Supporting'
}

export interface DialogueOption {
  id: string;
  text: string; // The nurse's line
  guidance: string; // Educational hint for the nurse
  correct: boolean;
}

export interface ScenarioStage {
  id: number;
  type: StageType;
  title: string;
  indicators: string[]; // e.g., "Indicator 1, 2"
  nurseScript: string[]; // The ideal script from the PDF
  patientResponse: string; // What the patient says after the nurse speaks
  context: string; // AR context note
  options: DialogueOption[]; // Interactive choices
}

export interface PatientProfile {
  name: string;
  age: number;
  condition: string;
  status: string;
  vitals: {
    hr: number;
    bp: string;
    spo2: number;
  }
  history: string;
  social: string;
}