export interface Option {
    option: string;
    value: string;
}

export interface Question {
    id: string;
    level: number;
    question_text: string;
    options: Option[];
    correctAnswer: string;
    explanation: string;
    hint?: string;
    topic?: string;
    description?: string;
    correct_option?: string;
    // Original API fields might still be present if passed around, but for UI we focus on these
    answer?: string;
    option1?: string;
    option2?: string;
    option3?: string;
    option4?: string;
}
