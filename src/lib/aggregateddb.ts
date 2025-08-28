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
    PostgrestVersion: "13.0.4"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      attributes_def: {
        Row: {
          attribute_id: string
          attribute_name: string | null
          attribute_type: string | null
          created_at: string | null
          dataflow_id: string
          id: number
        }
        Insert: {
          attribute_id: string
          attribute_name?: string | null
          attribute_type?: string | null
          created_at?: string | null
          dataflow_id: string
          id?: number
        }
        Update: {
          attribute_id?: string
          attribute_name?: string | null
          attribute_type?: string | null
          created_at?: string | null
          dataflow_id?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "attributes_def_dataflow_id_fkey"
            columns: ["dataflow_id"]
            isOneToOne: false
            referencedRelation: "dataflows"
            referencedColumns: ["id"]
          },
        ]
      }
      dataflows: {
        Row: {
          agency_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
          version: string
        }
        Insert: {
          agency_id?: string
          created_at?: string | null
          description?: string | null
          id: string
          name: string
          updated_at?: string | null
          version?: string
        }
        Update: {
          agency_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          version?: string
        }
        Relationships: []
      }
      dimension_codes: {
        Row: {
          code: string
          created_at: string | null
          dimension_table_id: number
          id: number
          label: string | null
          parent_code: string | null
          sort_order: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          dimension_table_id: number
          id?: number
          label?: string | null
          parent_code?: string | null
          sort_order?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          dimension_table_id?: number
          id?: number
          label?: string | null
          parent_code?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dimension_codes_dimension_table_id_fkey"
            columns: ["dimension_table_id"]
            isOneToOne: false
            referencedRelation: "dimensions"
            referencedColumns: ["id"]
          },
        ]
      }
      dimensions: {
        Row: {
          created_at: string | null
          dataflow_id: string
          dimension_id: string
          dimension_name: string | null
          id: number
          is_time_dimension: boolean | null
          position: number
        }
        Insert: {
          created_at?: string | null
          dataflow_id: string
          dimension_id: string
          dimension_name?: string | null
          id?: number
          is_time_dimension?: boolean | null
          position: number
        }
        Update: {
          created_at?: string | null
          dataflow_id?: string
          dimension_id?: string
          dimension_name?: string | null
          id?: number
          is_time_dimension?: boolean | null
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "dimensions_dataflow_id_fkey"
            columns: ["dataflow_id"]
            isOneToOne: false
            referencedRelation: "dataflows"
            referencedColumns: ["id"]
          },
        ]
      }
      observations: {
        Row: {
          attributes: Json | null
          country_code: string | null
          created_at: string | null
          dataflow_id: string
          id: number
          indicator_code: string | null
          observation_status: string | null
          observation_value: number | null
          series_key: string
          time_period: string | null
          updated_at: string | null
        }
        Insert: {
          attributes?: Json | null
          country_code?: string | null
          created_at?: string | null
          dataflow_id: string
          id?: number
          indicator_code?: string | null
          observation_status?: string | null
          observation_value?: number | null
          series_key: string
          time_period?: string | null
          updated_at?: string | null
        }
        Update: {
          attributes?: Json | null
          country_code?: string | null
          created_at?: string | null
          dataflow_id?: string
          id?: number
          indicator_code?: string | null
          observation_status?: string | null
          observation_value?: number | null
          series_key?: string
          time_period?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "observations_dataflow_id_fkey"
            columns: ["dataflow_id"]
            isOneToOne: false
            referencedRelation: "dataflows"
            referencedColumns: ["id"]
          },
        ]
      }
      query_cache: {
        Row: {
          cache_key: string
          created_at: string | null
          expires_at: string
          id: number
          result_data: Json
        }
        Insert: {
          cache_key: string
          created_at?: string | null
          expires_at: string
          id?: number
          result_data: Json
        }
        Update: {
          cache_key?: string
          created_at?: string | null
          expires_at?: string
          id?: number
          result_data?: Json
        }
        Relationships: []
      }
      sync_log: {
        Row: {
          completed_at: string | null
          dataflow_id: string | null
          error_message: string | null
          id: number
          records_inserted: number | null
          records_processed: number | null
          records_updated: number | null
          started_at: string | null
          status: string | null
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          dataflow_id?: string | null
          error_message?: string | null
          id?: number
          records_inserted?: number | null
          records_processed?: number | null
          records_updated?: number | null
          started_at?: string | null
          status?: string | null
          sync_type?: string
        }
        Update: {
          completed_at?: string | null
          dataflow_id?: string | null
          error_message?: string | null
          id?: number
          records_inserted?: number | null
          records_processed?: number | null
          records_updated?: number | null
          started_at?: string | null
          status?: string | null
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_log_dataflow_id_fkey"
            columns: ["dataflow_id"]
            isOneToOne: false
            referencedRelation: "dataflows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      countries: {
        Row: {
          country_code: string | null
          country_name: string | null
          region_code: string | null
        }
        Relationships: []
      }
      latest_observations: {
        Row: {
          attributes: Json | null
          country_code: string | null
          dataflow_id: string | null
          indicator_code: string | null
          observation_status: string | null
          observation_value: number | null
          time_period: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "observations_dataflow_id_fkey"
            columns: ["dataflow_id"]
            isOneToOne: false
            referencedRelation: "dataflows"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cleanup_expired_cache: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_last_successful_sync: {
        Args: { p_dataflow_id: string }
        Returns: string
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
