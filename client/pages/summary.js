"use client";

import Header from "@/components/Header";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/supabase/client';
import axios from 'axios';

const SummaryPage = () => {
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          throw sessionError;
        }

        const response = await axios.get('http://127.0.0.1:8000/summary', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionData.session.access_token}`,
          },
        });
        setSummary(response.data.summary);
      } catch (err) {
        setError('Failed to fetch summary');
        console.error(err);
      }
    };

    if (user) {
      fetchSummary();
    }
  }, [user]);

  return (
    <>
      <Header />
      <div className="overflow-x-hidden overflow-y-hidden flex items-center justify-center min-h-screen">
        <div className="relative mx-auto max-w-screen-xl py-12 sm:py-16 xl:pb-0 bg-gray-100">
          <div className="relative m-10 px-4 sm:px-6 lg:px-4 flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Chat Summary</h1>
            {error && (
              <div className="mb-4 text-red-500">
                {error}
              </div>
            )}
            <div className="flex flex-col items-center w-full max-w-4xl">
              <div className="w-full bg-white rounded-lg p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary</h2>
                <p className="text-gray-600">{summary}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SummaryPage;