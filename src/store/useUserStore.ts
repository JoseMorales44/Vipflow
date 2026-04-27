import { create } from 'zustand';
import { createClient } from '@/lib/supabase/client';
import { Tables } from '@/types/database';

type Profile = Tables<'profiles'>;
type Organization = Tables<'organizations'>;
type Space = Tables<'spaces'>;

interface UserState {
  user: Profile | null;
  org: Organization | null;
  role: string | null;
  spaces: Space[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: Profile | null) => void;
  setOrg: (org: Organization | null) => void;
  setRole: (role: string | null) => void;
  setSpaces: (spaces: Space[]) => void;
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
        currentOrg = Array.isArray(membership.organizations) 
          ? membership.organizations[0] 
          : membership.organizations;
        userRole = membership.role || 'worker';
      }

      // Most reliable ownership check: query organizations directly by owner_id
      if (currentOrg) {
        const { data: ownedOrg } = await supabase
          .from('organizations')
          .select('owner_id')
          .eq('id', (currentOrg as { id: string }).id)
          .single();

        if (ownedOrg?.owner_id === authUser.id) {
          userRole = 'owner';
        }
      }

      // Fallback: check if any org lists this user as owner
      if (userRole !== 'owner') {
        const { data: ownedOrgs } = await supabase
          .from('organizations')
          .select('*')
          .eq('owner_id', authUser.id)
          .limit(1)
          .maybeSingle();
        if (ownedOrgs) {
          currentOrg = ownedOrgs;
          userRole = 'owner';
        }
      }

      // Fetch spaces
      let spacesData: Space[] = [];
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
        user: profile as Profile, 
        org: currentOrg as Organization, 
        role: userRole, 
        spaces: spacesData, 
        isLoading: false 
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      set({ error: message, isLoading: false });
    }
  },
}));
