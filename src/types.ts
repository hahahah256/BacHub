export interface Topic {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface Question {
  id: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  explanation: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link';
  url: string;
}

export interface ExamData {
  topics: Topic[];
  sample_questions: Question[];
  resources: Resource[];
}
