// store/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'

interface LoginUser {
  full_name: string;
  home_page: string;
  email: string;
}

interface MemberDetails {
  membership_number: string;
  member_name: string;
}

interface AuthStore {
  loginUser: LoginUser | null;
  memberDetails: MemberDetails | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthStore>(
    (set) => ({
      loginUser: null,
      memberDetails: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // First, perform login
          const loginResponse = await axios.post('/api/auth/login', { 
            usr: email, 
            pwd: password 
          })

          // Set initial login state
          set({
            loginUser: {
              full_name: loginResponse.data.full_name,
              home_page: loginResponse.data.home_page,
              email: email,
            },
            isAuthenticated: true,
          })

          // Add a small delay to ensure session is established
          await new Promise(resolve => setTimeout(resolve, 1000))

          // Then try to fetch member data
          try {
            const memberListResponse = await axios.get('/api/member')
            if (memberListResponse.data.data && memberListResponse.data.data.length > 0) {
              const memberId = memberListResponse.data.data[0].name

              const memberDetailsResponse = await axios.get(`/api/member/${memberId}`)
              const memberData = memberDetailsResponse.data.data
              
              set({ 
                memberDetails: {
                  membership_number: memberData.membership_number,
                  member_name: memberData.member_name,
                },
              })
            }
          } catch (memberError) {
            console.error('Failed to fetch member details:', memberError)
            // Don't throw here - we still want to consider the login successful
          }

          set({ isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to login',
            isLoading: false,
            isAuthenticated: false,
            loginUser: null,
            memberDetails: null
          })
          throw error
        }
      },

      logout: () => {
        set({ 
          loginUser: null,
          memberDetails: null,
          isAuthenticated: false 
        })
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)