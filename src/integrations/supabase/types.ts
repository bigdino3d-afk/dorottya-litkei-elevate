export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      availability_blocks: {
        Row: {
          created_at: string
          ends_at: string
          id: string
          reason: string | null
          starts_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          id?: string
          reason?: string | null
          starts_at: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          id?: string
          reason?: string | null
          starts_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      availability_rules: {
        Row: {
          close_minute: number
          closed: boolean
          created_at: string
          id: string
          open_minute: number
          updated_at: string
          weekday: number
        }
        Insert: {
          close_minute?: number
          closed?: boolean
          created_at?: string
          id?: string
          open_minute?: number
          updated_at?: string
          weekday: number
        }
        Update: {
          close_minute?: number
          closed?: boolean
          created_at?: string
          id?: string
          open_minute?: number
          updated_at?: string
          weekday?: number
        }
        Relationships: []
      }
      bookings: {
        Row: {
          client_email: string
          client_name: string
          client_phone: string | null
          coach_response: string | null
          created_at: string
          duration_minutes: number
          ends_at: string
          google_event_id: string | null
          google_event_link: string | null
          id: string
          location: string
          notes: string | null
          service: string
          starts_at: string
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string
        }
        Insert: {
          client_email: string
          client_name: string
          client_phone?: string | null
          coach_response?: string | null
          created_at?: string
          duration_minutes?: number
          ends_at: string
          google_event_id?: string | null
          google_event_link?: string | null
          id?: string
          location?: string
          notes?: string | null
          service: string
          starts_at: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Update: {
          client_email?: string
          client_name?: string
          client_phone?: string | null
          coach_response?: string | null
          created_at?: string
          duration_minutes?: number
          ends_at?: string
          google_event_id?: string | null
          google_event_link?: string | null
          id?: string
          location?: string
          notes?: string | null
          service?: string
          starts_at?: string
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          body: string
          category: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          body?: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          body?: string
          category?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          author_id: string | null
          body: string
          cover_image_url: string | null
          created_at: string
          external_url: string | null
          id: string
          published: boolean
          slug: string
          sort_order: number
          status: string
          summary: string | null
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          author_id?: string | null
          body?: string
          cover_image_url?: string | null
          created_at?: string
          external_url?: string | null
          id?: string
          published?: boolean
          slug: string
          sort_order?: number
          status?: string
          summary?: string | null
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          author_id?: string | null
          body?: string
          cover_image_url?: string | null
          created_at?: string
          external_url?: string | null
          id?: string
          published?: boolean
          slug?: string
          sort_order?: number
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          key: string
          updated_at?: string
          value?: string
        }
        Update: {
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      studio_access: {
        Row: {
          asset_ids: string[]
          categories: string[]
          code_hash: string
          contact_email: string | null
          contact_name: string | null
          created_at: string
          expires_at: string | null
          id: string
          last_opened_at: string | null
          notes: string | null
          open_count: number
          revoked_at: string | null
          studio_name: string
          token: string
          updated_at: string
        }
        Insert: {
          asset_ids?: string[]
          categories?: string[]
          code_hash: string
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          last_opened_at?: string | null
          notes?: string | null
          open_count?: number
          revoked_at?: string | null
          studio_name: string
          token: string
          updated_at?: string
        }
        Update: {
          asset_ids?: string[]
          categories?: string[]
          code_hash?: string
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          last_opened_at?: string | null
          notes?: string | null
          open_count?: number
          revoked_at?: string | null
          studio_name?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
          quote: string
          rating: number
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
          quote: string
          rating?: number
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          quote?: string
          rating?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          currency: string
          description: string | null
          duration_label: string | null
          id: string
          level: string | null
          preview_url: string | null
          price_cents: number
          published: boolean
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          currency?: string
          description?: string | null
          duration_label?: string | null
          id?: string
          level?: string | null
          preview_url?: string | null
          price_cents?: number
          published?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          currency?: string
          description?: string | null
          duration_label?: string | null
          id?: string
          level?: string | null
          preview_url?: string | null
          price_cents?: number
          published?: boolean
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      workshop_assets: {
        Row: {
          asset_type: string
          category: string
          created_at: string
          description: string | null
          file_name: string | null
          height: number | null
          id: string
          instructions: string | null
          language: string
          mime_type: string | null
          preview_path: string | null
          published: boolean
          size_bytes: number | null
          sort_order: number
          storage_path: string | null
          text_content: string | null
          title: string
          updated_at: string
          visibility: string
          width: number | null
          workshop_id: string | null
        }
        Insert: {
          asset_type?: string
          category?: string
          created_at?: string
          description?: string | null
          file_name?: string | null
          height?: number | null
          id?: string
          instructions?: string | null
          language?: string
          mime_type?: string | null
          preview_path?: string | null
          published?: boolean
          size_bytes?: number | null
          sort_order?: number
          storage_path?: string | null
          text_content?: string | null
          title: string
          updated_at?: string
          visibility?: string
          width?: number | null
          workshop_id?: string | null
        }
        Update: {
          asset_type?: string
          category?: string
          created_at?: string
          description?: string | null
          file_name?: string | null
          height?: number | null
          id?: string
          instructions?: string | null
          language?: string
          mime_type?: string | null
          preview_path?: string | null
          published?: boolean
          size_bytes?: number | null
          sort_order?: number
          storage_path?: string | null
          text_content?: string | null
          title?: string
          updated_at?: string
          visibility?: string
          width?: number | null
          workshop_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workshop_assets_workshop_id_fkey"
            columns: ["workshop_id"]
            isOneToOne: false
            referencedRelation: "workshops"
            referencedColumns: ["id"]
          },
        ]
      }
      workshop_inquiries: {
        Row: {
          contact_name: string
          created_at: string
          email: string
          emailed: boolean
          id: string
          message: string | null
          page_slug: string | null
          participants: string | null
          phone: string | null
          preferred_dates: string | null
          status: string
          studio_name: string
          workshop_type: string
        }
        Insert: {
          contact_name: string
          created_at?: string
          email: string
          emailed?: boolean
          id?: string
          message?: string | null
          page_slug?: string | null
          participants?: string | null
          phone?: string | null
          preferred_dates?: string | null
          status?: string
          studio_name: string
          workshop_type: string
        }
        Update: {
          contact_name?: string
          created_at?: string
          email?: string
          emailed?: boolean
          id?: string
          message?: string | null
          page_slug?: string | null
          participants?: string | null
          phone?: string | null
          preferred_dates?: string | null
          status?: string
          studio_name?: string
          workshop_type?: string
        }
        Relationships: []
      }
      workshop_pages: {
        Row: {
          city: string
          country: string
          created_at: string
          credentials: Json
          currency: string
          headline: string | null
          hero_eyebrow: string | null
          hosting_heading: string | null
          hosting_text: string | null
          id: string
          instructor_bio: string | null
          instructor_heading: string | null
          intro: string | null
          languages: string[]
          locale: string
          slug: string
          status: string
          timezone: string
          translations: Json
          updated_at: string
        }
        Insert: {
          city?: string
          country?: string
          created_at?: string
          credentials?: Json
          currency?: string
          headline?: string | null
          hero_eyebrow?: string | null
          hosting_heading?: string | null
          hosting_text?: string | null
          id?: string
          instructor_bio?: string | null
          instructor_heading?: string | null
          intro?: string | null
          languages?: string[]
          locale?: string
          slug: string
          status?: string
          timezone?: string
          translations?: Json
          updated_at?: string
        }
        Update: {
          city?: string
          country?: string
          created_at?: string
          credentials?: Json
          currency?: string
          headline?: string | null
          hero_eyebrow?: string | null
          hosting_heading?: string | null
          hosting_text?: string | null
          id?: string
          instructor_bio?: string | null
          instructor_heading?: string | null
          intro?: string | null
          languages?: string[]
          locale?: string
          slug?: string
          status?: string
          timezone?: string
          translations?: Json
          updated_at?: string
        }
        Relationships: []
      }
      workshops: {
        Row: {
          booking_deadline: string | null
          booking_open: boolean
          booking_url: string | null
          capacity: number | null
          category: string
          contact_email: string | null
          created_at: string
          currency: string
          dates: string | null
          description: string | null
          duration: string | null
          id: string
          learning_objectives: string | null
          location: string | null
          page_id: string | null
          prerequisites: string | null
          price_amount: number | null
          price_note: string | null
          published_fields: string[]
          requirements: string | null
          skill_level: string | null
          sort_order: number
          status: string
          tagline: string | null
          title: string
          translations: Json
          updated_at: string
          venue: string | null
          video_url: string | null
        }
        Insert: {
          booking_deadline?: string | null
          booking_open?: boolean
          booking_url?: string | null
          capacity?: number | null
          category?: string
          contact_email?: string | null
          created_at?: string
          currency?: string
          dates?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          learning_objectives?: string | null
          location?: string | null
          page_id?: string | null
          prerequisites?: string | null
          price_amount?: number | null
          price_note?: string | null
          published_fields?: string[]
          requirements?: string | null
          skill_level?: string | null
          sort_order?: number
          status?: string
          tagline?: string | null
          title: string
          translations?: Json
          updated_at?: string
          venue?: string | null
          video_url?: string | null
        }
        Update: {
          booking_deadline?: string | null
          booking_open?: boolean
          booking_url?: string | null
          capacity?: number | null
          category?: string
          contact_email?: string | null
          created_at?: string
          currency?: string
          dates?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          learning_objectives?: string | null
          location?: string | null
          page_id?: string | null
          prerequisites?: string | null
          price_amount?: number | null
          price_note?: string | null
          published_fields?: string[]
          requirements?: string | null
          skill_level?: string | null
          sort_order?: number
          status?: string
          tagline?: string | null
          title?: string
          translations?: Json
          updated_at?: string
          venue?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workshops_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "workshop_pages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_workshop_page: { Args: { _slug: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_public_asset_object: { Args: { _name: string }; Returns: boolean }
      workshop_public_json: {
        Args: { w: Database["public"]["Tables"]["workshops"]["Row"] }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
      booking_status: "pending" | "approved" | "rejected" | "cancelled"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      booking_status: ["pending", "approved", "rejected", "cancelled"],
    },
  },
} as const
