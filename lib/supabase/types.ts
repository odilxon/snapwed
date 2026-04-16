export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          plan: string;
          weddings_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          plan?: string;
          weddings_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          plan?: string;
          weddings_count?: number;
          created_at?: string;
        };
      };
      weddings: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          slug: string;
          date: string;
          venue: string | null;
          greeting_text: string | null;
          tasks: WeddingTask[];
          cover_image_url: string | null;
          is_active: boolean;
          max_photos_per_guest: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          slug: string;
          date: string;
          venue?: string | null;
          greeting_text?: string | null;
          tasks?: WeddingTask[];
          cover_image_url?: string | null;
          is_active?: boolean;
          max_photos_per_guest?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          slug?: string;
          date?: string;
          venue?: string | null;
          greeting_text?: string | null;
          tasks?: WeddingTask[];
          cover_image_url?: string | null;
          is_active?: boolean;
          max_photos_per_guest?: number;
          created_at?: string;
        };
      };
      guest_sessions: {
        Row: {
          id: string;
          wedding_id: string;
          guest_name: string | null;
          photos_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          guest_name?: string | null;
          photos_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          guest_name?: string | null;
          photos_count?: number;
          created_at?: string;
        };
      };
      photos: {
        Row: {
          id: string;
          wedding_id: string;
          guest_session_id: string | null;
          storage_path: string;
          thumbnail_path: string | null;
          task_id: string | null;
          is_approved: boolean;
          width: number | null;
          height: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          wedding_id: string;
          guest_session_id?: string | null;
          storage_path: string;
          thumbnail_path?: string | null;
          task_id?: string | null;
          is_approved?: boolean;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          wedding_id?: string;
          guest_session_id?: string | null;
          storage_path?: string;
          thumbnail_path?: string | null;
          task_id?: string | null;
          is_approved?: boolean;
          width?: number | null;
          height?: number | null;
          created_at?: string;
        };
      };
    };
  };
}

export interface WeddingTask {
  id: string;
  title: string;
  emoji: string;
  enabled: boolean;
}
