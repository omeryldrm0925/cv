
'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error('Could not authenticate user. Please check your credentials.');
  }

  revalidatePath('/', 'layout');
  return redirect('/')
}

export async function signup(formData: FormData) {
  const headersList = headers()
  const origin = headersList.get('origin')
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Signup Error:', error);
    throw new Error('Could not create user. The user may already exist or password is too weak.');
  }

  return { message: 'Success! Please check your email to confirm your account.' }
}

export async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    return redirect('/')
}

export async function updateCv(cvData: any) {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const { error } = await supabase.from('cvs').upsert([{
        id: user.id,
        cv_data: cvData,
        updated_at: new Date().toISOString()
    }] as any);

    if (error) {
        console.error('Error updating CV:', error);
        throw new Error('Could not save CV data.');
    }

    revalidatePath('/'); // Refresh the data on the home page
    return { success: true };
}
