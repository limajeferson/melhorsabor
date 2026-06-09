// ⚠️ ARQUIVO GERADO AUTOMATICAMENTE — não editar manualmente
// Gerado via: supabase gen types typescript --project-id ljboadzbqzutwwogzmbq
// Última atualização: 2026-06-09 (Missão 7)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      user_badges: {
        Row: {
          badge_id: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          badge_id: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_checkins: {
        Row: {
          created_at: string
          date: string
          id: string
          items: string[]
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          items?: string[]
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          items?: string[]
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          academia: string | null
          animo: string | null
          atividade: string | null
          biotipo: string | null
          cozinha: string | null
          created_at: string
          criancas: string | null
          desafio_casa: string | null
          email: string | null
          id: string
          idade_range: string | null
          mp_payment_id: string | null
          mp_preference_id: string | null
          nivel: string | null
          objetivo: string | null
          objetivo_casa: string | null
          pratica: string | null
          publico: string | null
          raw_answers: Json | null
          refeicao: string | null
          restricoes: string[] | null
          restricoes_casa: string[] | null
          rotina_casa: string | null
          selected_plan: string | null
          subscribed_at: string | null
          subscription_status: string
          tamanho_casa: string | null
          tempo_preparo: string | null
          updated_at: string
        }
        Insert: {
          academia?: string | null
          animo?: string | null
          atividade?: string | null
          biotipo?: string | null
          cozinha?: string | null
          created_at?: string
          criancas?: string | null
          desafio_casa?: string | null
          email?: string | null
          id: string
          idade_range?: string | null
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          nivel?: string | null
          objetivo?: string | null
          objetivo_casa?: string | null
          pratica?: string | null
          publico?: string | null
          raw_answers?: Json | null
          refeicao?: string | null
          restricoes?: string[] | null
          restricoes_casa?: string[] | null
          rotina_casa?: string | null
          selected_plan?: string | null
          subscribed_at?: string | null
          subscription_status?: string
          tamanho_casa?: string | null
          tempo_preparo?: string | null
          updated_at?: string
        }
        Update: {
          academia?: string | null
          animo?: string | null
          atividade?: string | null
          biotipo?: string | null
          cozinha?: string | null
          created_at?: string
          criancas?: string | null
          desafio_casa?: string | null
          email?: string | null
          id?: string
          idade_range?: string | null
          mp_payment_id?: string | null
          mp_preference_id?: string | null
          nivel?: string | null
          objetivo?: string | null
          objetivo_casa?: string | null
          pratica?: string | null
          publico?: string | null
          raw_answers?: Json | null
          refeicao?: string | null
          restricoes?: string[] | null
          restricoes_casa?: string[] | null
          rotina_casa?: string | null
          selected_plan?: string | null
          subscribed_at?: string | null
          subscription_status?: string
          tamanho_casa?: string | null
          tempo_preparo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      waitlist_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
