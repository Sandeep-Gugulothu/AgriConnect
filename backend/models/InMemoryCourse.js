// In-memory storage
let courses = [
  {
    _id: 1,
    title: 'Modern Farming Techniques',
    description: 'Learn sustainable and efficient farming methods',
    category: 'farming',
    level: 'beginner',
    duration: 120,
    enrollments: 45,
    content: [
      { title: 'Introduction to Modern Farming', text: 'Overview of modern techniques' }
    ]
  },
  {
    _id: 2,
    title: 'Financial Literacy for Farmers',
    description: 'Understand banking, loans, and financial planning',
    category: 'finance',
    level: 'intermediate',
    duration: 90,
    enrollments: 32,
    content: [
      { title: 'Banking Basics', text: 'Understanding bank accounts and loans' }
    ]
  },
  {
    _id: 3,
    title: 'Digital Marketing for Agriculture',
    description: 'Sell your products online and reach more customers',
    category: 'marketing',
    level: 'advanced',
    duration: 150,
    enrollments: 28,
    content: [
      { title: 'Online Marketing Basics', text: 'Getting started with digital marketing' }
    ]
  }
];

class InMemoryCourse {
  static async find() {
    return courses;
  }

  static async findById(id) {
    return courses.find(course => course._id == id);
  }
}

module.exports = InMemoryCourse;