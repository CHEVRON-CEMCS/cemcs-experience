import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios, { AxiosError } from 'axios';

interface LoginUser {
  full_name: string;
  home_page: string;
  email: string;
  userType: string;
  baseUrl: string;
}

interface MemberDetails {
  membership_number: string;
  member_name: string;
}

interface FrappeError {
  message: string;
  exception: string;
  exc_type: string;
  exc: string;
  _server_messages?: string;
  _error_message?: string;
}

interface AuthStore {
  loginUser: LoginUser | null;
  memberDetails: MemberDetails | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, baseUrl: string) => Promise<void>;
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

      login: async (email: string, password: string, baseUrl: string) => {
        set({ isLoading: true, error: null });
        try {
          // First, perform login
          const loginResponse = await axios.post('/api/auth/login', { 
            usr: email, 
            pwd: password,
            baseUrl: baseUrl
          });

          // Set initial login state
          set({
            loginUser: {
              full_name: loginResponse.data.full_name,
              home_page: loginResponse.data.home_page,
              email: email,
              baseUrl: baseUrl,
              userType: baseUrl.split('.')[0]
            },
            isAuthenticated: true,
          });

          // Add a small delay to ensure session is established
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Then try to fetch member data if needed
          try {
            const memberListResponse = await axios.get('/api/member', {
              headers: {
                'X-Base-URL': baseUrl
              }
            });

            if (memberListResponse.data.data && memberListResponse.data.data.length > 0) {
              const memberId = memberListResponse.data.data[0].name;

              const memberDetailsResponse = await axios.get(`/api/member/${memberId}`, {
                headers: {
                  'X-Base-URL': baseUrl
                }
              });
              
              const memberData = memberDetailsResponse.data.data;
              
              set({ 
                memberDetails: {
                  membership_number: memberData.membership_number,
                  member_name: memberData.member_name,
                },
              });
            }
          } catch (memberError) {
            console.error('Failed to fetch member details:', memberError);
            // Don't throw here - we still want to consider the login successful
          }

          set({ isLoading: false });
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.data?.message) {
            // Directly use the message from the Frappe response
            set({ 
              error: error.response.data.message,
              isLoading: false,
              isAuthenticated: false,
              loginUser: null,
              memberDetails: null
            });
            throw new Error(error.response.data.message);
          } else {
            // Fallback error message if the expected structure isn't found
            const errorMessage = "Failed to login";
            set({ 
              error: errorMessage,
              isLoading: false,
              isAuthenticated: false,
              loginUser: null,
              memberDetails: null
            });
            throw new Error(errorMessage);
          }
        }
      },

      logout: () => {
        set({ 
          loginUser: null,
          memberDetails: null,
          isAuthenticated: false,
          error: null 
        });
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);