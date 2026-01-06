// Database types for Learning Module
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: "admin" | "deaf" | "non-deaf";
          proficiency_level: "Beginner" | "Intermediate" | "Advanced" | null;
          profile_picture_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email: string;
          role?: "admin" | "deaf" | "non-deaf";
          proficiency_level?: "Beginner" | "Intermediate" | "Advanced" | null;
          profile_picture_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          role?: "admin" | "deaf" | "non-deaf";
          proficiency_level?: "Beginner" | "Intermediate" | "Advanced" | null;
          profile_picture_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      tutorials: {
        Row: {
          id: string;
          title: string;
          description: string;
          thumbnail_url: string | null;
          video_url: string;
          level: "beginner" | "intermediate" | "advanced";
          language: "ASL" | "MSL";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          thumbnail_url?: string | null;
          video_url: string;
          level: "beginner" | "intermediate" | "advanced";
          language: "ASL" | "MSL";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          thumbnail_url?: string | null;
          video_url?: string;
          level?: "beginner" | "intermediate" | "advanced";
          language?: "ASL" | "MSL";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      materials: {
        Row: {
          id: string;
          title: string;
          description: string;
          type: string;
          file_size: number | null;
          download_url: string;
          file_path: string | null;
          level: "beginner" | "intermediate" | "advanced";
          language: "ASL" | "MSL";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          type: string;
          file_size?: number | null;
          download_url: string;
          file_path?: string | null;
          level: "beginner" | "intermediate" | "advanced";
          language: "ASL" | "MSL";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          type?: string;
          file_size?: number | null;
          download_url?: string;
          file_path?: string | null;
          level?: "beginner" | "intermediate" | "advanced";
          language?: "ASL" | "MSL";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_sets: {
        Row: {
          id: string;
          title: string;
          description: string;
          level: "beginner" | "intermediate" | "advanced";
          language: "ASL" | "MSL";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          level?: "beginner" | "intermediate" | "advanced";
          language: "ASL" | "MSL";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          level?: "beginner" | "intermediate" | "advanced";
          language?: "ASL" | "MSL";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_questions: {
        Row: {
          id: string;
          quiz_set_id: string;
          question: string;
          options: string[];
          correct_answer: string;
          explanation: string | null;
          video_url: string | null;
          image_url: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          quiz_set_id: string;
          question: string;
          options: string[];
          correct_answer: string;
          explanation?: string | null;
          video_url?: string | null;
          image_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          quiz_set_id?: string;
          question?: string;
          options?: string[];
          correct_answer?: string;
          explanation?: string | null;
          video_url?: string | null;
          image_url?: string | null;
          order_index?: number;
          created_at?: string;
        };
      };
      tutorial_progress: {
        Row: {
          id: string;
          user_id: string;
          tutorial_id: string;
          status: "started" | "completed";
          last_watched_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tutorial_id: string;
          status?: "started" | "completed";
          last_watched_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tutorial_id?: string;
          status?: "started" | "completed";
          last_watched_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      quiz_progress: {
        Row: {
          id: string;
          user_id: string;
          quiz_set_id: string;
          completed: boolean;
          score: number;
          total_questions: number;
          last_attempted_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          quiz_set_id: string;
          completed?: boolean;
          score?: number;
          total_questions?: number;
          last_attempted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          quiz_set_id?: string;
          completed?: boolean;
          score?: number;
          total_questions?: number;
          last_attempted_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      proficiency_tests: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      proficiency_test_questions: {
        Row: {
          id: string;
          test_id: string;
          question_text: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          test_id: string;
          question_text: string;
          order_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          test_id?: string;
          question_text?: string;
          order_index?: number;
          created_at?: string;
        };
      };
      proficiency_test_question_choices: {
        Row: {
          id: string;
          question_id: string;
          choice_text: string;
          is_correct: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          choice_text: string;
          is_correct?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          choice_text?: string;
          is_correct?: boolean;
          created_at?: string;
        };
      };
      proficiency_test_attempts: {
        Row: {
          id: string;
          user_id: string;
          test_id: string;
          score: number | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_id: string;
          score?: number | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_id?: string;
          score?: number | null;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      proficiency_test_attempt_answers: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          choice_id: string;
          is_correct: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          choice_id: string;
          is_correct: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          attempt_id?: string;
          question_id?: string;
          choice_id?: string;
          is_correct?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      proficiency_level: "Beginner" | "Intermediate" | "Advanced";
    };
  };
}

// Convenience types
export type UserProfile = Database["public"]["Tables"]["user_profiles"]["Row"];
export type Tutorial = Database["public"]["Tables"]["tutorials"]["Row"];
export type Material = Database["public"]["Tables"]["materials"]["Row"];
export type QuizSet = Database["public"]["Tables"]["quiz_sets"]["Row"];
export type QuizQuestion =
  Database["public"]["Tables"]["quiz_questions"]["Row"];
export type TutorialProgress =
  Database["public"]["Tables"]["tutorial_progress"]["Row"];
export type QuizProgress = Database["public"]["Tables"]["quiz_progress"]["Row"];
export type ProficiencyTest =
  Database["public"]["Tables"]["proficiency_tests"]["Row"];
export type ProficiencyTestQuestion =
  Database["public"]["Tables"]["proficiency_test_questions"]["Row"];
export type ProficiencyTestQuestionChoice =
  Database["public"]["Tables"]["proficiency_test_question_choices"]["Row"];
export type ProficiencyTestAttempt =
  Database["public"]["Tables"]["proficiency_test_attempts"]["Row"];
export type ProficiencyTestAttemptAnswer =
  Database["public"]["Tables"]["proficiency_test_attempt_answers"]["Row"];

// Extended types with additional computed properties
export interface TutorialWithProgress extends Tutorial {
  status?: "not-started" | "started" | "completed";
  questionCount?: number;
}

export interface QuizSetWithProgress extends QuizSet {
  questionCount: number;
  progress?: QuizProgress;
}

export interface QuizSetWithQuestions extends QuizSet {
  questions: QuizQuestion[];
  questionCount: number;
}
