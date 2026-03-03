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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      action_programs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      application_methods: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      branches: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          cuit: string | null
          email: string | null
          header_bg_color: string | null
          header_text_color: string | null
          id: string
          name: string
          phone: string | null
          province: string | null
          shift_start: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          cuit?: string | null
          email?: string | null
          header_bg_color?: string | null
          header_text_color?: string | null
          id?: string
          name: string
          phone?: string | null
          province?: string | null
          shift_start?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          cuit?: string | null
          email?: string | null
          header_bg_color?: string | null
          header_text_color?: string | null
          id?: string
          name?: string
          phone?: string | null
          province?: string | null
          shift_start?: string | null
        }
        Relationships: []
      }
      business_sectors: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      cancellation_reasons: {
        Row: {
          chargeable: boolean | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          chargeable?: boolean | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          chargeable?: boolean | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          generated_at: string
          id: string
          pdf_url: string | null
          work_order_id: string
        }
        Insert: {
          certificate_number: string
          generated_at?: string
          id?: string
          pdf_url?: string | null
          work_order_id: string
        }
        Update: {
          certificate_number?: string
          generated_at?: string
          id?: string
          pdf_url?: string | null
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string
          expiry_date: string | null
          id: string
          jurisdiction: string
          name: string
          pest_control: boolean | null
          registration_number: string | null
          tank_cleaning: boolean | null
          technical_director: string | null
        }
        Insert: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          jurisdiction: string
          name: string
          pest_control?: boolean | null
          registration_number?: string | null
          tank_cleaning?: boolean | null
          technical_director?: string | null
        }
        Update: {
          created_at?: string
          expiry_date?: string | null
          id?: string
          jurisdiction?: string
          name?: string
          pest_control?: boolean | null
          registration_number?: string | null
          tank_cleaning?: boolean | null
          technical_director?: string | null
        }
        Relationships: []
      }
      client_sites: {
        Row: {
          address: string | null
          client_id: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          geo_lat: number | null
          geo_lng: number | null
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          client_id: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          geo_lat?: number | null
          geo_lng?: number | null
          id?: string
          name?: string
        }
        Update: {
          address?: string | null
          client_id?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          geo_lat?: number | null
          geo_lng?: number | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_sites_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          contact_name: string | null
          created_at: string
          cuit: string | null
          email: string | null
          geo_lat: number | null
          geo_lng: number | null
          id: string
          name: string
          phone: string | null
          plan: string | null
          status: Database["public"]["Enums"]["client_status"]
          type: string | null
          updated_at: string
          zone: string | null
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          cuit?: string | null
          email?: string | null
          geo_lat?: number | null
          geo_lng?: number | null
          id?: string
          name: string
          phone?: string | null
          plan?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          type?: string | null
          updated_at?: string
          zone?: string | null
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          cuit?: string | null
          email?: string | null
          geo_lat?: number | null
          geo_lng?: number | null
          id?: string
          name?: string
          phone?: string | null
          plan?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          type?: string | null
          updated_at?: string
          zone?: string | null
        }
        Relationships: []
      }
      company_info: {
        Row: {
          address: string | null
          created_at: string
          cuit: string | null
          email: string | null
          id: string
          owner_name: string | null
          phone: string | null
          razon_social: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          cuit?: string | null
          email?: string | null
          id?: string
          owner_name?: string | null
          phone?: string | null
          razon_social?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          cuit?: string | null
          email?: string | null
          id?: string
          owner_name?: string | null
          phone?: string | null
          razon_social?: string
          updated_at?: string
        }
        Relationships: []
      }
      facility_sectors: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      legal_representative: {
        Row: {
          created_at: string
          dni: string | null
          id: string
          name: string
          position: string | null
          signature_url: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          dni?: string | null
          id?: string
          name?: string
          position?: string | null
          signature_url?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          dni?: string | null
          id?: string
          name?: string
          position?: string | null
          signature_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prospects: {
        Row: {
          converted_client_id: string | null
          created_at: string
          id: string
          marketing_tags: string[] | null
          name: string | null
          original_message: string | null
          phone: string
          source: string | null
          status: Database["public"]["Enums"]["prospect_status"]
          updated_at: string
        }
        Insert: {
          converted_client_id?: string | null
          created_at?: string
          id?: string
          marketing_tags?: string[] | null
          name?: string | null
          original_message?: string | null
          phone: string
          source?: string | null
          status?: Database["public"]["Enums"]["prospect_status"]
          updated_at?: string
        }
        Update: {
          converted_client_id?: string | null
          created_at?: string
          id?: string
          marketing_tags?: string[] | null
          name?: string | null
          original_message?: string | null
          phone?: string
          source?: string | null
          status?: Database["public"]["Enums"]["prospect_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "prospects_converted_client_id_fkey"
            columns: ["converted_client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      species: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "species_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "species_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      species_categories: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      supplies: {
        Row: {
          created_at: string
          id: string
          name: string
          stock: number
          type_id: string
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          stock?: number
          type_id: string
          unit?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          stock?: number
          type_id?: string
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplies_type_id_fkey"
            columns: ["type_id"]
            isOneToOne: false
            referencedRelation: "supply_types"
            referencedColumns: ["id"]
          },
        ]
      }
      supply_types: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      technical_directors: {
        Row: {
          created_at: string
          id: string
          license_expiry: string | null
          license_number: string | null
          name: string
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          license_expiry?: string | null
          license_number?: string | null
          name: string
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          license_expiry?: string | null
          license_number?: string | null
          name?: string
          title?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_order_photos: {
        Row: {
          created_at: string
          description: string | null
          id: string
          photo_url: string
          work_order_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          photo_url: string
          work_order_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          photo_url?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_photos_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_supplies: {
        Row: {
          created_at: string
          dosage: string | null
          id: string
          quantity: number
          supply_id: string
          work_order_id: string
        }
        Insert: {
          created_at?: string
          dosage?: string | null
          id?: string
          quantity?: number
          supply_id: string
          work_order_id: string
        }
        Update: {
          created_at?: string
          dosage?: string | null
          id?: string
          quantity?: number
          supply_id?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_supplies_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "supplies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_supplies_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          checklist: Json | null
          client_id: string
          closed_at: string | null
          created_at: string
          flexible_schedule: boolean
          id: string
          notes: string | null
          program_id: string | null
          scheduled_date: string | null
          signature_url: string | null
          site_id: string | null
          species: Json | null
          status: Database["public"]["Enums"]["work_order_status"]
          technician_id: string | null
          updated_at: string
        }
        Insert: {
          checklist?: Json | null
          client_id: string
          closed_at?: string | null
          created_at?: string
          flexible_schedule?: boolean
          id?: string
          notes?: string | null
          program_id?: string | null
          scheduled_date?: string | null
          signature_url?: string | null
          site_id?: string | null
          species?: Json | null
          status?: Database["public"]["Enums"]["work_order_status"]
          technician_id?: string | null
          updated_at?: string
        }
        Update: {
          checklist?: Json | null
          client_id?: string
          closed_at?: string | null
          created_at?: string
          flexible_schedule?: boolean
          id?: string
          notes?: string | null
          program_id?: string | null
          scheduled_date?: string | null
          signature_url?: string | null
          site_id?: string | null
          species?: Json | null
          status?: Database["public"]["Enums"]["work_order_status"]
          technician_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "action_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "client_sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_orders_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      is_supervisor: { Args: never; Returns: boolean }
      is_technician: { Args: never; Returns: boolean }
      owns_work_order: {
        Args: { _user_id: string; _wo_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "tecnico" | "supervisor" | "administrativo"
      client_status: "activo" | "pendiente" | "inactivo"
      prospect_status: "nuevo" | "contactado" | "convertido"
      work_order_status:
        | "pendiente"
        | "en_progreso"
        | "completada"
        | "cancelada"
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
    Enums: {
      app_role: ["admin", "tecnico", "supervisor", "administrativo"],
      client_status: ["activo", "pendiente", "inactivo"],
      prospect_status: ["nuevo", "contactado", "convertido"],
      work_order_status: [
        "pendiente",
        "en_progreso",
        "completada",
        "cancelada",
      ],
    },
  },
} as const
