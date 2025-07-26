export interface UserInput {
    name: string;
    ageRange: string;
    biggestGoal: string;
    personalityWord: string;
    currentMood: string;
    challenge: string;
    areaOfFocus: string[];
    riskComfortLevel: string;
    dreamDestination: string;
    fateVsPath: string;
  }
  
  export interface ReportData {
    reportId: string;
    input: UserInput;
    isPremium: boolean;
    content?: string; // For free report
    sections?: {
      introduction: string;
      lifePath: string;
      strengths: string;
      actionPlan: string;
      challenges: string;
      aspirationalVision: string;
      conclusion: string;
    }; // For premium report
  }
  
  export enum AgeRange {
    Under18 = 'Under 18',
    Age18_24 = '18-24',
    Age25_34 = '25-34',
    Age35_44 = '35-44',
    Age45Plus = '45+',
  }
  
  export enum BiggestGoal {
    CareerSuccess = 'Career Success',
    PersonalGrowth = 'Personal Growth',
    Relationships = 'Relationships',
    Health = 'Health',
    AdventureTravel = 'Adventure/Travel',
    Other = 'Other',
  }
  
  export enum CurrentMood {
    Excited = 'Excited',
    Curious = 'Curious',
    Stressed = 'Stressed',
    Hopeful = 'Hopeful',
    Other = 'Other',
  }
  
  export enum RiskComfortLevel {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
  }
  
  export enum FateVsPath {
    Fate = 'Fate',
    MyOwnPath = 'My Own Path',
    AMix = 'A Mix',
  }