import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { DoctorDTO, IdentityUser, PatientDTO } from '@/types';
import { UserProfileDTO } from '@/types';

type UserProfile = IdentityUser & UserProfileDTO & PatientDTO & DoctorDTO;

interface UserState {
    profile?: UserProfile;
    token?: {
        accessToken: string;
        accessTokenExpirationAt: Date;
    };
    isAuthenticated: boolean;
    isFetching: boolean;
    setProfile: (profile: UserProfile) => void;
    setToken: (token: { accessToken: string; expirationAt: Date }) => void;
    setIsFetching: (isFetching: boolean) => void;
    logout: () => void;
}
const INITIAL_STATE: UserState = {
    isAuthenticated: false,
    isFetching: false,
    setProfile: () => {},
    profile: undefined,
    token: undefined,
    setToken: () => {},
    setIsFetching: () => {},
    logout: () => {},
};

const useUserStore = create<UserState>()(
    devtools(
        persist<UserState>(
            (set) => ({
                ...INITIAL_STATE,
                setProfile: (profile) => set({ profile }),
                isAuthenticated: !!localStorage.getItem('token'),
                isFetching: false,
                profile: undefined,
                token: undefined,
                setToken: (token) => {
                    if (token.accessToken) {
                        set({
                            isAuthenticated: true,
                            token: { accessToken: token.accessToken, accessTokenExpirationAt: token.expirationAt },
                        });
                    } else {
                        set({ isAuthenticated: false, token: undefined });
                    }
                },
                setIsFetching: (isFetching) => set({ isFetching }),
                logout: () => {
                    set({ isAuthenticated: false, token: undefined,profile:undefined });
                },
            }),
            { name: 'user-store' }
        )
    )
);

export default useUserStore;

export const useUserProfile = () => useUserStore((state) => state.profile);
export const useIsAuthenticated = () => useUserStore((state) => state.isAuthenticated);
export const useIsFetching = () => useUserStore((state) => state.isFetching);
