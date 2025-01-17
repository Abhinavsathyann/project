export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: string;
          content: string;
          user_id: string;
          username: string;
          created_at: string;
          file_url?: string;
          file_type?: string;
          reactions: Record<string, string[]>;
          reply_to?: string;
          reply_to_content?: string;
          reply_to_username?: string;
        };
        Insert: {
          content: string;
          user_id: string;
          username: string;
          file_url?: string;
          file_type?: string;
          reactions?: Record<string, string[]>;
          reply_to?: string;
          reply_to_content?: string;
          reply_to_username?: string;
        };
      };
    };
  };
}