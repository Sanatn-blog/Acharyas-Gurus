import { Teacher } from '@/lib/types';

export const teachers: Teacher[] = [
  {
    id: 'swami-ananda',
    name: 'Swami Ananda',
    title: 'Senior Spiritual Teacher',
    bio: 'Swami Ananda has dedicated over 30 years to the study and practice of Vedic wisdom. With a deep understanding of ancient scriptures and modern applications, he guides seekers on their journey toward self-realization and inner peace.',
    image: '/api/placeholder/300/300', // Will be replaced with actual images
    specialties: ['Vedic Philosophy', 'Meditation', 'Yoga', 'Sanskrit'],
    yearsOfExperience: 30,
    contactInfo: {
      email: 'swami.ananda@aryasamaj.org',
      website: 'https://swamiananda.org'
    },
    socialMedia: {
      youtube: '@SwamiAnandaTeachings',
      instagram: '@swami_ananda_wisdom'
    },
    joinedDate: '2020-01-15'
  },
  {
    id: 'acharya-priya',
    name: 'Acharya Priya',
    title: 'Teacher of Sacred Texts',
    bio: 'Acharya Priya is a renowned scholar of ancient Indian texts and philosophy. She brings profound insights from the Upanishads, Bhagavad Gita, and other sacred scriptures to help modern practitioners understand timeless wisdom.',
    image: '/api/placeholder/300/300',
    specialties: ['Bhagavad Gita', 'Upanishads', 'Sanskrit Literature', 'Women\'s Spirituality'],
    yearsOfExperience: 25,
    contactInfo: {
      email: 'acharya.priya@aryasamaj.org'
    },
    socialMedia: {
      twitter: '@AcharyaPriya',
      instagram: '@sacred_text_wisdom'
    },
    joinedDate: '2020-03-20'
  },
  {
    id: 'guru-ram',
    name: 'Guru Ram',
    title: 'Meditation Master',
    bio: 'Guru Ram has spent decades mastering various forms of meditation and mindfulness practices. His gentle approach and practical guidance have helped thousands find peace and clarity in their daily lives.',
    image: '/api/placeholder/300/300',
    specialties: ['Mindfulness Meditation', 'Pranayama', 'Stress Relief', 'Daily Practice'],
    yearsOfExperience: 20,
    contactInfo: {
      email: 'guru.ram@aryasamaj.org',
      phone: '+1-555-PEACE-1'
    },
    socialMedia: {
      youtube: '@GuruRamMeditation',
      instagram: '@peaceful_mind_guru'
    },
    joinedDate: '2021-06-10'
  },
  {
    id: 'mata-shakti',
    name: 'Mata Shakti',
    title: 'Divine Feminine Teacher',
    bio: 'Mata Shakti is a devoted teacher who specializes in the divine feminine aspects of spirituality. She guides students in understanding the sacred feminine energy and its role in spiritual awakening and empowerment.',
    image: '/api/placeholder/300/300',
    specialties: ['Divine Feminine', 'Devotion (Bhakti)', 'Sacred Rituals', 'Energy Healing'],
    yearsOfExperience: 18,
    contactInfo: {
      email: 'mata.shakti@aryasamaj.org'
    },
    socialMedia: {
      instagram: '@mata_shakti_divine',
      youtube: '@DivineShaktiWisdom'
    },
    joinedDate: '2021-09-05'
  }
];

export const getTeacherById = (id: string): Teacher | undefined => {
  return teachers.find(teacher => teacher.id === id);
};

export const getTeachersBySpecialty = (specialty: string): Teacher[] => {
  return teachers.filter(teacher => 
    teacher.specialties.some(s => s.toLowerCase().includes(specialty.toLowerCase()))
  );
};