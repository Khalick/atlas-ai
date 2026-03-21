import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabaseClient';
import { Session, User } from '@supabase/supabase-js';

export interface Profile {
    id: string;
    full_name: string;
    earnings: number;
    tasks_completed: number;
    hours_worked: number;
    payment_method: string;
    tax_info?: string;
    payment_address?: string;
    total_answered: number;
    correct_answers: number;
    accuracy: number;
    is_paused: boolean;
    created_at?: string;
}

interface AppContextType {
    session: Session | null;
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    refreshProfile: () => Promise<void>;
    completeTask: (earned: number, correctCount: number, totalCount: number) => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setProfile(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string): Promise<void> => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
        } else {
            setProfile(data as Profile);
        }
        setLoading(false);
    };

    const refreshProfile = async (): Promise<void> => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    const completeTask = async (earned: number, correctCount: number, totalCount: number): Promise<void> => {
        if (!user || !profile) return;

        const newEarnings = Number(profile.earnings) + earned;
        const newTasksCompleted = profile.tasks_completed + 1;
        const newTotalAnswered = profile.total_answered + totalCount;
        const newCorrectAnswers = profile.correct_answers + correctCount;
        const newAccuracy = newTotalAnswered > 0
            ? Number(((newCorrectAnswers / newTotalAnswered) * 100).toFixed(2))
            : 0;

        // Enforce 65% threshold after 20 answers
        const shouldPause = newTotalAnswered >= 20 && newAccuracy < 65;

        const updates = {
            earnings: newEarnings,
            tasks_completed: newTasksCompleted,
            total_answered: newTotalAnswered,
            correct_answers: newCorrectAnswers,
            accuracy: newAccuracy,
            is_paused: shouldPause,
        };

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (error) {
            console.error('Error updating profile:', error);
        } else {
            setProfile({ ...profile, ...updates });
        }
    };

    const updateProfile = async (updates: Partial<Profile>): Promise<void> => {
        if (!user || !profile) return;

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (error) {
            console.error('Error updating profile:', error);
        } else {
            setProfile({ ...profile, ...updates });
        }
    };

    return (
        <AppContext.Provider value={{
            session,
            user,
            profile,
            loading,
            refreshProfile,
            completeTask,
            updateProfile
        }}>
            {children}
        </AppContext.Provider>
    );
};
