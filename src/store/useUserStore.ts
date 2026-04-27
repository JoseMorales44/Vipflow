import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';

interface UserState {
  user: any | null;
  org: any | null;
  role: string | null;
  spaces: any[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: any) => void;
  setOrg: (org: any) => void;
  setRole: (role: string) => void;
  setSpaces: (spaces: any[]) => void;
  fetchUserData: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  org: null,
  role: null,
  spaces: [],
  isLoading: true,
  error: null,

  setUser: (user) => set({ user }),
  setOrg: (org) => set({ org }),
  setRole: (role) => set({ role }),
  setSpaces: (spaces) => set({ spaces }),

  fetchUserData: async () => {
    const supabase = createClient();
    set({ isLoading: true, error: null });

    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        set({ user: null, org: null, role: null, spaces: [], isLoading: false });
        return;
      }

      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      // Get org membership
      const { data: membership } = await supabase
        .from('org_members')
        .select('org_id, role, organizations(*)')
        .eq('user_id', authUser.id)
        .limit(1)
        .maybeSingle();

      let currentOrg = null;
      let userRole = 'worker';

      if (membership) {
        // Supabase joins can sometimes return an array even for 1:1 relations in types
        currentOrg = Array.isArray(membership.organizations) 
          ? membership.organizations[0] 
          : membership.organizations;
        userRole = membership.role;
      }

      // 🚨 Fix: If user is the owner_id of the org, ensure they have the owner role
      if (currentOrg && currentOrg.owner_id === authUser.id) {
        userRole = 'owner';
      }

      // Fetch spaces
      let spacesData: any[] = [];
      if (currentOrg) {
        let spacesQuery = supabase
          .from('spaces')
          .select('*')
          .eq('org_id', currentOrg.id)
          .is('deleted_at', null)
          .order('name');
        
        if (userRole === 'worker') {
            const { data: spaceMemberships } = await supabase
                .from('space_members')
                .select('space_id')
                .eq('user_id', authUser.id);
            
            const spaceIds = spaceMemberships?.map(m => m.space_id) || [];
            spacesQuery = spacesQuery.in('id', spaceIds);
        }

        const { data } = await spacesQuery;
        if (data) spacesData = data;
      }

      set({ 
        user: profile, 
        org: currentOrg, 
        role: userRole, 
        spaces: spacesData, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
