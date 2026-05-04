export type TaskStatus  = 'assigned' | 'in-progress' | 'submitted' | 'completed' | 'failed';
export type TaskType    = 'regular' | 'punishment';
export type ProofStatus = 'pending' | 'approved' | 'rejected';
export type UnlockType  = 'tasks_completed' | 'streak_days' | 'time_on_platform';
export type UserRole    = 'user' | 'admin';

export interface Database {
  public: {
    Tables: {
      users:             { Row: DbUser; Insert: InsertUser; Update: UpdateUser; };
      tasks:             { Row: DbTask; Insert: InsertTask; Update: UpdateTask; };
      proof_submissions: { Row: DbProof; Insert: InsertProof; Update: UpdateProof; };
      messages:          { Row: DbMessage; Insert: InsertMessage; Update: UpdateMessage; };
      rewards:           { Row: DbReward; Insert: InsertReward; Update: UpdateReward; };
      user_rewards:      { Row: DbUserReward; Insert: InsertUserReward; Update: UpdateUserReward; };
      user_stats:        { Row: DbUserStats; Insert: InsertUserStats; Update: UpdateUserStats; };
    };
  };
}

export type DbUser = {
  id: string;
  username: string;
  role: UserRole;
  token: string | null;
  auth_id: string | null;
  last_active: string;
  created_at: string;
};

export type InsertUser = {
  id?: string;
  username: string;
  role?: UserRole;
  token?: string;
  auth_id?: string;
  last_active?: string;
  created_at?: string;
};

export type UpdateUser = Partial<InsertUser>;

export type DbTask = {
  id: string;
  title: string;
  description: string;
  user_id: string;
  created_by: string;
  deadline: string;
  status: TaskStatus;
  type: TaskType;
  created_at: string;
};

export type InsertTask = {
  id?: string;
  title: string;
  description?: string;
  user_id: string;
  created_by: string;
  deadline: string;
  status?: TaskStatus;
  type?: TaskType;
  created_at?: string;
};

export type UpdateTask = Partial<InsertTask>;

export type DbProof = {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  status: ProofStatus;
  admin_note: string | null;
  submitted_at: string;
  reviewed_at: string | null;
};

export type InsertProof = {
  id?: string;
  task_id: string;
  user_id: string;
  content?: string;
  media_urls?: string[];
  status?: ProofStatus;
  admin_note?: string;
  submitted_at?: string;
  reviewed_at?: string;
};

export type UpdateProof = Partial<InsertProof>;

export type DbMessage = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
};

export type InsertMessage = {
  id?: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read?: boolean;
  created_at?: string;
};

export type UpdateMessage = Partial<InsertMessage>;

export type DbReward = {
  id: string;
  title: string;
  description: string;
  unlock_type: UnlockType;
  unlock_value: number;
  icon_url: string | null;
  created_at: string;
};

export type InsertReward = {
  id?: string;
  title: string;
  description?: string;
  unlock_type: UnlockType;
  unlock_value: number;
  icon_url?: string;
  created_at?: string;
};

export type UpdateReward = Partial<InsertReward>;

export type DbUserReward = {
  user_id: string;
  reward_id: string;
  unlocked_at: string;
};

export type InsertUserReward = {
  user_id: string;
  reward_id: string;
  unlocked_at?: string;
};

export type UpdateUserReward = Partial<InsertUserReward>;

export type DbUserStats = {
  user_id: string;
  tasks_completed: number;
  current_streak: number;
  longest_streak: number;
  total_minutes: number;
  last_seen_at: string;
};

export type InsertUserStats = {
  user_id: string;
  tasks_completed?: number;
  current_streak?: number;
  longest_streak?: number;
  total_minutes?: number;
  last_seen_at?: string;
};

export type UpdateUserStats = Partial<InsertUserStats>;

export interface UserSession  { id: string; username: string; role: UserRole; }
export interface ActionResult<T = void> { success: boolean; data?: T; error?: string; }