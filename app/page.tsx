
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import CV from '@/components/CV';

type CVData = {
    name: string;
    title: string;
    summary: string;
    photo: string;
    contactInfo: any[];
    experience: any[];
    volunteerExperience: any[];
    skills: any[];
    education: any[];
    interests: any[];
    languages: any[];
    references: any[];
};

// This is the default data for new users or when no data is found.
const initialCVData: CVData = {
    name: 'Ömer Yıldırım',
    title: 'Frontend Developer & UI/UX Enthusiast',
    summary: 'Seeking to leverage my experience in agile environments and passion for creating seamless user experiences in a dynamic frontend development role.',
    photo: 'https://i.imgur.com/ZslTKNB.jpeg',
    contactInfo: [
        { id: 1, type: 'email', value: 'omeryldrm0925@gmail.com', icon: 'fa-solid fa-envelope' },
        { id: 2, type: 'phone', value: '+90 505 095 7822', icon: 'fa-solid fa-phone' },
        { id: 3, type: 'linkedin', value: 'https://www.linkedin.com/in/ömer-yıldırım-4b7067192', icon: 'fa-brands fa-linkedin' }
    ],
    experience: [
        { id: 1, title: 'Assistant Specialist', company: 'Türkiye İş Bankası', startDate: '2025-04-01', endDate: '', ongoing: true, description: ['Worked in agile team using Jira for task tracking.', 'Assisted in PO processes for the BCH banking product.', 'Coordinated with develop team during sprints.', 'Provided real-time support to the branches.'] },
        { id: 2, title: 'Global E-Commerce Specialist', company: 'Nocturne', startDate: '2024-11-01', endDate: '2025-03-01', ongoing: false, description: ['Managed US and UAE marketplace operations.', 'Designed apps through Python to fasten daily processes.', 'Tracked tasks via Monday.com.', 'Supported Google & Meta ads with agency.', 'Handled end-to-end product publish process.'] },
    ],
    volunteerExperience: [
        { id: 1, title: 'Exchange Student', company: 'Work and Travel', startDate: '2023-06-01', endDate: '2023-09-01', ongoing: false, description: ['Improving my English speaking skills to perfection.', 'Working on different sectors for hours to get disciplined.', 'Time and money management.'] },
        { id: 2, title: 'Founder & President', company: 'Bilgi Career Club', startDate: '2022-10-01', endDate: '2024-06-01', ongoing: false, description: ['Project and team management experiences as a founder president.', 'Getting contact with great leaders from varied companies.', 'Improving my presentation and communication skills.'] },
    ],
    skills: [
        { id: 1, name: 'MS Office', level: 5, icon: 'fa-solid fa-file-word' },
        { id: 2, name: 'ERP Systems', level: 4, icon: 'fa-solid fa-sitemap' },
        { id: 3, name: 'YouTrack', level: 4, icon: 'fa-solid fa-bug' },
        { id: 4, name: 'Monday.com', level: 5, icon: 'fa-solid fa-calendar-days' },
        { id: 5, name: 'Product Management', level: 3, icon: 'fa-solid fa-box-archive' },
        { id: 6, name: 'Shopify', level: 4, icon: 'fa-brands fa-shopify' },
        { id: 7, name: 'Canva', level: 5, icon: 'fa-solid fa-palette' },
        { id: 8, name: 'Jira', level: 4, icon: 'fa-brands fa-jira' },
        { id: 9, name: 'CRM', level: 3, icon: 'fa-solid fa-users-gear' },
        { id: 10, name: 'Notion', level: 5, icon: 'fa-solid fa-book-open' },
        { id: 11, name: 'Ad Management', level: 3, icon: 'fa-solid fa-bullhorn' },
        { id: 12, name: 'Python', level: 2, icon: 'fa-brands fa-python' },
    ],
    education: [
        { id: 1, degree: 'International Relations (%100 Scholarship)', school: 'Bilgi University', startDate: '2019-09-01', endDate: '2024-06-01', ongoing: false, description:[] },
        { id: 2, degree: 'High School', school: 'İbrahim Hakkı Fen Lisesi', startDate: '2015-09-01', endDate: '2019-06-01', ongoing: false, description:[] }
    ],
    interests: [
        { id: 1, name: 'Games', icon: 'fa-solid fa-gamepad' },
        { id: 2, name: 'Football', icon: 'fa-solid fa-futbol' },
        { id: 3, name: 'Cinema', icon: 'fa-solid fa-film' },
        { id: 4, name: 'Fitness', icon: 'fa-solid fa-dumbbell' },
        { id: 5, name: 'Swimming', icon: 'fa-solid fa-person-swimming' },
        { id: 6, name: 'Photography', icon: 'fa-solid fa-camera-retro' },
        { id: 7, name: 'Camping', icon: 'fa-solid fa-campground' },
        { id: 8, name: 'Keeping a Diary', icon: 'fa-solid fa-book' },
    ],
    languages: [
        { id: 1, name: 'Turkish', level: 'Native' },
        { id: 2, name: 'English', level: 'Fluent' }
    ],
    references: [
        { id: 1, name: 'Burak Akbulat', title: 'Sales Manager of Nocturne', phone: '0549 576 54 44', email: 'burak.akbulat@example.com' },
        { id: 2, name: 'Onur Ahmet', title: 'CEO of Profeed', phone: '0533 668 93 15', email: 'onur.ahmet@example.com' },
    ]
  };

export default async function Index() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let cvData: CVData = initialCVData;

  if (user) {
    const { data: userCV } = await supabase
      .from('cvs')
      .select('cv_data')
      .eq('id', user.id)
      .single();

    if (userCV && userCV.cv_data) {
      // It's important to merge with initial data to ensure all keys exist
      // even if the stored data is partial.
      cvData = { ...initialCVData, ...(userCV.cv_data as Partial<CVData>) };
    }
  }

  return <CV initialData={cvData} user={user} />;
}
