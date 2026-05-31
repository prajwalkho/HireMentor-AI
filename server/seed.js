/**
 * Database Seed Script — HireMentor AI Suite
 * Run: node seed.js
 *
 * Seeds: Roles, Skills, Courses, CourseInfo, Admin, Students, Enrollments, Exams, MockInterviews
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Role          = require('./src/models/roleModel');
const Skill         = require('./src/models/skillmodel');
const Course        = require('./src/models/courseModel');
const CourseInfo    = require('./src/models/courseInfoModel');
const Auth          = require('./src/models/authmodel');
const Enroll        = require('./src/models/enrollCoursemodel');
const Exam          = require('./src/models/examManagemenModel');
const MockInterview = require('./src/models/mockInterview');
const Certificate   = require('./src/models/certificateModel');

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const hash = (pw) => bcrypt.hash(pw, 10);
const pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];
const rand  = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// ─────────────────────────────────────────────
// Static seed data
// ─────────────────────────────────────────────
const ROLES = [
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer',
  'UI/UX Designer',
  'Machine Learning Engineer',
];

const SKILLS = [
  'JavaScript', 'TypeScript', 'React.js', 'Node.js', 'Express.js',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Python', 'Java',
  'C++', 'HTML5', 'CSS3', 'Tailwind CSS', 'Redux',
  'Git & GitHub', 'Docker', 'AWS', 'REST APIs', 'GraphQL',
  'Next.js', 'Vue.js', 'Angular', 'Flutter', 'Kotlin',
];

const COURSE_TYPES = [
  'Theory', 'Practical', 'Project-Based', 'Workshop', 'Bootcamp',
];

const COURSE_IMAGES = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
  'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400',
  'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400',
];

const COURSE_DEFS = [
  {
    type: 'Full Stack Development',
    courses: [
      {
        title: 'Mastering MERN Stack',
        description: 'Build production-grade full-stack apps with MongoDB, Express, React, and Node.js.',
        overview: 'Covers REST APIs, authentication, state management, deployment, and CI/CD pipelines.',
        videoLinks: ['https://www.youtube.com/watch?v=7CqJlxBYj-M', 'https://www.youtube.com/watch?v=mrHNSanmqQ4'],
        studyMaterials: [
          { title: 'MERN Roadmap', link: 'https://roadmap.sh/full-stack' },
          { title: 'MDN Web Docs', link: 'https://developer.mozilla.org' },
        ],
      },
      {
        title: 'React.js Advanced Patterns',
        description: 'Deep dive into hooks, context, performance tuning, and React architecture patterns.',
        overview: 'Covers custom hooks, render optimization, code splitting, and testing with Jest.',
        videoLinks: ['https://www.youtube.com/watch?v=w7ejDZ8SWv8'],
        studyMaterials: [{ title: 'React Docs', link: 'https://react.dev' }],
      },
    ],
  },
  {
    type: 'Data Science',
    courses: [
      {
        title: 'Data Science Bootcamp',
        description: 'End-to-end data science from EDA to model deployment.',
        overview: 'Learn Python, Pandas, NumPy, Scikit-learn, and Matplotlib with real datasets.',
        videoLinks: ['https://www.youtube.com/watch?v=ua-CiDNNj30'],
        studyMaterials: [{ title: 'Kaggle Learn', link: 'https://www.kaggle.com/learn' }],
      },
      {
        title: 'Machine Learning Fundamentals',
        description: 'Supervised, unsupervised, and reinforcement learning with hands-on projects.',
        overview: 'Regression, classification, clustering, SVMs, and neural networks.',
        videoLinks: ['https://www.youtube.com/watch?v=i_LwzRVP7bg'],
        studyMaterials: [{ title: 'ML Crash Course', link: 'https://developers.google.com/machine-learning/crash-course' }],
      },
    ],
  },
  {
    type: 'Frontend Development',
    courses: [
      {
        title: 'Modern JavaScript ES2024',
        description: 'Master modern JavaScript features and best practices.',
        overview: 'Async/await, modules, closures, prototype chain, decorators, and more.',
        videoLinks: ['https://www.youtube.com/watch?v=PkZNo7MFNFg'],
        studyMaterials: [{ title: 'JavaScript.info', link: 'https://javascript.info' }],
      },
      {
        title: 'CSS Mastery & Tailwind CSS',
        description: 'From Flexbox to Grid to utility-first CSS with Tailwind.',
        overview: 'Covers responsive design, animations, accessibility, and design systems.',
        videoLinks: ['https://www.youtube.com/watch?v=dX3I2ZsfB_8'],
        studyMaterials: [{ title: 'Tailwind Docs', link: 'https://tailwindcss.com/docs' }],
      },
    ],
  },
  {
    type: 'Backend Development',
    courses: [
      {
        title: 'Node.js & Express Deep Dive',
        description: 'Build scalable REST APIs with Node.js and Express framework.',
        overview: 'Middleware, routing, authentication with JWT, file uploads, and error handling.',
        videoLinks: ['https://www.youtube.com/watch?v=Oe421EPjeBE'],
        studyMaterials: [{ title: 'Node.js Docs', link: 'https://nodejs.org/docs' }],
      },
      {
        title: 'MongoDB & Mongoose Mastery',
        description: 'Data modeling, aggregation pipelines, and performance tuning in MongoDB.',
        overview: 'Schema design, indexes, transactions, and Atlas integration.',
        videoLinks: ['https://www.youtube.com/watch?v=ExcRbA7fy_A'],
        studyMaterials: [{ title: 'MongoDB Docs', link: 'https://www.mongodb.com/docs' }],
      },
    ],
  },
  {
    type: 'DevOps',
    courses: [
      {
        title: 'Docker & Kubernetes Essentials',
        description: 'Containerize applications and manage clusters with Kubernetes.',
        overview: 'Docker images, compose, pods, services, deployments, and Helm charts.',
        videoLinks: ['https://www.youtube.com/watch?v=3c-iBn73dDE'],
        studyMaterials: [{ title: 'Docker Docs', link: 'https://docs.docker.com' }],
      },
    ],
  },
];

const STUDENT_DATA = [
  { first_Name: 'Arjun',    last_Name: 'Sharma',    email: 'arjun@student.com',    gender: 'male',   birth_Date: '2001-03-15' },
  { first_Name: 'Priya',    last_Name: 'Patel',     email: 'priya@student.com',    gender: 'female', birth_Date: '2002-07-22' },
  { first_Name: 'Rahul',    last_Name: 'Verma',     email: 'rahul@student.com',    gender: 'male',   birth_Date: '2000-11-08' },
  { first_Name: 'Sneha',    last_Name: 'Nair',      email: 'sneha@student.com',    gender: 'female', birth_Date: '2001-05-30' },
  { first_Name: 'Karthik',  last_Name: 'Reddy',     email: 'karthik@student.com',  gender: 'male',   birth_Date: '2002-01-12' },
  { first_Name: 'Anjali',   last_Name: 'Singh',     email: 'anjali@student.com',   gender: 'female', birth_Date: '2001-09-19' },
  { first_Name: 'Vikram',   last_Name: 'Menon',     email: 'vikram@student.com',   gender: 'male',   birth_Date: '2000-04-25' },
  { first_Name: 'Divya',    last_Name: 'Krishnan',  email: 'divya@student.com',    gender: 'female', birth_Date: '2002-12-03' },
  { first_Name: 'Rohan',    last_Name: 'Gupta',     email: 'rohan@student.com',    gender: 'male',   birth_Date: '2001-06-17' },
  { first_Name: 'Meera',    last_Name: 'Joshi',     email: 'meera@student.com',    gender: 'female', birth_Date: '2000-08-29' },
  { first_Name: 'Aditya',   last_Name: 'Kumar',     email: 'aditya@student.com',   gender: 'male',   birth_Date: '2002-02-14' },
  { first_Name: 'Lakshmi',  last_Name: 'Pillai',    email: 'lakshmi@student.com',  gender: 'female', birth_Date: '2001-10-07' },
  { first_Name: 'Siddharth',last_Name: 'Rao',       email: 'siddharth@student.com',gender: 'male',   birth_Date: '2000-03-21' },
  { first_Name: 'Kavya',    last_Name: 'Iyer',      email: 'kavya@student.com',    gender: 'female', birth_Date: '2002-05-16' },
  { first_Name: 'Naveen',   last_Name: 'Bhat',      email: 'naveen@student.com',   gender: 'male',   birth_Date: '2001-07-04', isBlocked: true },
];

const EXAM_LEVELS   = ['beginner', 'intermediate', 'advanced'];
const EXPERIENCES   = ['0-1 years', '1-2 years', '2-3 years', '3-5 years'];
const MOCK_POSITIONS = [
  'React Developer', 'Node.js Developer', 'Full Stack Engineer',
  'Data Scientist', 'DevOps Engineer', 'Frontend Engineer',
  'Backend Developer', 'ML Engineer',
];

// ─────────────────────────────────────────────
// Main seed function
// ─────────────────────────────────────────────
const seedData = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('✅ Connected to MongoDB\n');

    // ── Clear all collections ──────────────────
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Role.deleteMany({}),
      Skill.deleteMany({}),
      Course.deleteMany({}),
      CourseInfo.deleteMany({}),
      Auth.deleteMany({}),
      Enroll.deleteMany({}),
      Exam.deleteMany({}),
      MockInterview.deleteMany({}),
      Certificate.deleteMany({}),
    ]);
    console.log('   Done clearing.\n');

    // ── 1. Roles ──────────────────────────────
    console.log('🌱 Seeding Roles...');
    const roles = await Role.insertMany(ROLES.map(name => ({ roleName: name })));
    console.log(`   ✔ ${roles.length} roles created`);
    const primaryRole = roles[0]; // Full Stack Developer

    // ── 2. Skills ─────────────────────────────
    console.log('🌱 Seeding Skills...');
    const skills = await Skill.insertMany(SKILLS.map(t => ({ title: t })));
    console.log(`   ✔ ${skills.length} skills created`);

    // ── 3. Courses + CourseInfo ───────────────
    console.log('🌱 Seeding Courses & Course Info...');
    const allCourseInfos = [];

    for (const [defIdx, def] of COURSE_DEFS.entries()) {
      const roleForCourse = roles[defIdx % roles.length];
      const course = await Course.create({
        courseType: def.type,
        roleId: roleForCourse._id,
      });

      for (const [cIdx, ci] of def.courses.entries()) {
        const info = await CourseInfo.create({
          courseId:   course._id,
          roleId:     roleForCourse._id,
          title:      ci.title,
          description:ci.description,
          overview:   ci.overview,
          courseImage:COURSE_IMAGES[(defIdx * 2 + cIdx) % COURSE_IMAGES.length],
          videoLinks: ci.videoLinks,
          studyMaterials: ci.studyMaterials,
          isActive:   true,
        });
        allCourseInfos.push({ course, courseInfo: info, role: roleForCourse });
      }
    }
    console.log(`   ✔ ${COURSE_DEFS.length} courses with ${allCourseInfos.length} modules created`);

    // ── 4. Admin User ─────────────────────────
    console.log('🌱 Seeding Admin...');
    const adminHash = await hash('admin@123');
    await Auth.create({
      first_Name: 'Super',
      last_Name:  'Admin',
      email:      'admin@interviewai.com',
      birth_Date: new Date('1990-01-01'),
      gender:     'other',
      role:       'admin',
      password:   adminHash,
      loginCount: 42,
      lastLogin:  daysAgo(1),
    });
    console.log('   ✔ Admin: admin@interviewai.com / admin@123');

    console.log('🌱 Seeding Admin...');
    const adminHash1 = await hash('Hire@321');
    await Auth.create({
      first_Name: 'Super',
      last_Name:  'Admin',
      email:      'hirementorai@gmail.com',
      birth_Date: new Date('1990-01-01'),
      gender:     'other',
      role:       'admin',
      password:   adminHash1,
      loginCount: 42,
      lastLogin:  daysAgo(1),
    });
    console.log('   ✔ Admin: hirementorai@gmail.com / Hire@321');


    // ── 5. Student Users ──────────────────────
    console.log('🌱 Seeding Students...');
    const studentPw = await hash('student@123');
    const students  = await Auth.insertMany(
      STUDENT_DATA.map((s, i) => ({
        ...s,
        role:       'user',
        password:   studentPw,
        birth_Date: new Date(s.birth_Date),
        loginCount: rand(1, 80),
        lastLogin:  daysAgo(rand(0, 30)),
        isBlocked:  s.isBlocked || false,
      }))
    );
    console.log(`   ✔ ${students.length} students created (password: student@123)`);

    // ── 6. Enrollments ────────────────────────
    console.log('🌱 Seeding Enrollments...');
    const enrollments = [];
    for (const student of students) {
      // Each student enrolls in 2–5 random course modules
      const count    = rand(2, 5);
      const shuffled = [...allCourseInfos].sort(() => 0.5 - Math.random()).slice(0, count);

      for (const { course, courseInfo, role } of shuffled) {
        const theoryDone    = Math.random() > 0.4;
        const practicalDone = theoryDone && Math.random() > 0.5;
        const passed        = theoryDone && Math.random() > 0.35;

        const enroll = await Enroll.create({
          role:              role._id,
          user:              student._id,
          course:            course._id,
          courseOverview:    courseInfo._id,
          status:            passed ? 'Pass' : 'Fail',
          theoryExamStatus:  theoryDone    ? 'completed' : 'pending',
          practicalExamStatus: practicalDone ? 'completed' : 'pending',
          result:            passed ? `${rand(60, 98)}` : `${rand(20, 59)}`,
          resultDate:        theoryDone ? daysAgo(rand(1, 60)) : null,
        });
        enrollments.push({ enroll, student, courseInfo, course, role });
      }
    }
    console.log(`   ✔ ${enrollments.length} enrollments created`);

    // ── 7. Exam Records ───────────────────────
    console.log('🌱 Seeding Exam Records...');

    // Helper: build a sample MCQ question set as JSON string
    const buildQuestionsJson = (title, count = 5) => {
      const pool = [
        {
          question: `What is the primary purpose of ${title}?`,
          options: ['Data storage', 'User interface design', 'Core functionality', 'Networking'],
          rightAnswer: 2,
        },
        {
          question: `Which tool is commonly used in ${title}?`,
          options: ['Photoshop', 'VS Code', 'AutoCAD', 'Excel'],
          rightAnswer: 1,
        },
        {
          question: `What does MVC stand for in ${title} context?`,
          options: ['Model View Controller', 'Main Variable Compiler', 'Module Variant Code', 'Master Visual Component'],
          rightAnswer: 0,
        },
        {
          question: `Which HTTP method is used to retrieve data in a REST API?`,
          options: ['POST', 'PUT', 'GET', 'DELETE'],
          rightAnswer: 2,
        },
        {
          question: `What is the time complexity of binary search?`,
          options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
          rightAnswer: 2,
        },
        {
          question: `In JavaScript, which keyword declares a block-scoped variable?`,
          options: ['var', 'let', 'const', 'Both let and const'],
          rightAnswer: 3,
        },
        {
          question: `Which database is used in the MERN stack?`,
          options: ['MySQL', 'PostgreSQL', 'MongoDB', 'SQLite'],
          rightAnswer: 2,
        },
        {
          question: `What does API stand for?`,
          options: ['Application Programming Interface', 'Advanced Protocol Integration', 'Automated Program Installer', 'Application Process Interface'],
          rightAnswer: 0,
        },
        {
          question: `Which of the following is a NoSQL database?`,
          options: ['MySQL', 'Oracle', 'MongoDB', 'PostgreSQL'],
          rightAnswer: 2,
        },
        {
          question: `What is the use of useEffect in React?`,
          options: ['To style components', 'To handle side effects', 'To create components', 'To manage routing'],
          rightAnswer: 1,
        },
      ];
      return JSON.stringify(pool.slice(0, count));
    };

    let examCount = 0;
    for (const { student, courseInfo } of enrollments) {
      // ~70% of enrollments have an exam attempt
      if (Math.random() > 0.3) {
        const level     = pick(EXAM_LEVELS);
        const completed = Math.random() > 0.2;
        const score     = completed ? rand(30, 100) : null;
        const passed    = completed && score >= 60;
        const qCount    = rand(5, 10);
        const questionsJson = buildQuestionsJson(courseInfo.title, Math.min(qCount, 10));

        // Build userAnswer based on score if completed
        let userAnswer = [];
        if (completed) {
          const qs = JSON.parse(questionsJson);
          const correctCount = Math.round((score / 100) * qs.length);
          userAnswer = qs.map((q, i) => ({
            question:    q.question,
            userAnswer:  i < correctCount ? q.options[q.rightAnswer] : q.options[(q.rightAnswer + 1) % q.options.length],
            rightAnswer: i < correctCount,
          }));
        }

        await Exam.create({
          course:        courseInfo._id,
          user:          student._id,
          questions:     questionsJson,
          status:        completed ? 'completed' : 'pending',
          result:        completed ? (passed ? 'Pass' : 'Fail') : null,
          Score:         completed ? `${score}` : null,
          examLaval:     level,
          jobExperience: pick(EXPERIENCES),
          userAnswer,
        });
        examCount++;
      }
    }
    console.log(`   ✔ ${examCount} exam records created`);

    // ── 8. Mock Interviews ────────────────────
    console.log('🌱 Seeding Mock Interviews...');
    let mockCount = 0;
    for (const student of students) {
      const numMocks = rand(1, 4);
      for (let m = 0; m < numMocks; m++) {
        const position   = pick(MOCK_POSITIONS);
        const experience = pick(EXPERIENCES);
        const questions  = Array.from({ length: 5 }, (_, qi) => ({
          question: `Tell me about your experience with ${position} — Q${qi + 1}`,
          answer:   `This is a sample AI-generated answer for ${position} question ${qi + 1}.`,
        }));

        await MockInterview.create({
          jobPosition:  position,
          jobDesc:      `Looking for a skilled ${position} with ${experience} of relevant experience.`,
          jobExperience: experience,
          createdBy:    student._id,
          mockId:       `MOCK-${student._id.toString().slice(-4).toUpperCase()}-${Date.now()}-${m}`,
          jsonMockResp: JSON.stringify(questions),
          createdAt:    daysAgo(rand(1, 90)).toISOString(),
        });
        mockCount++;
      }
    }
    console.log(`   ✔ ${mockCount} mock interview records created`);

    // ── 9. Certificates ───────────────────────
    console.log('🌱 Seeding Certificates...');
    const genCertId = () => {
      const p1 = Math.random().toString(36).substring(2, 8).toUpperCase();
      const p2 = Date.now().toString(36).toUpperCase().slice(-4);
      return `CERT-${p1}-${p2}`;
    };
    const allExams = await Exam.find({ result: 'Pass' });
    let certCount = 0;
    for (const exam of allExams) {
      const student = students.find(s => s._id.toString() === exam.user.toString());
      const courseInfo = allCourseInfos.find(c => c.courseInfo._id.toString() === exam.course.toString());
      if (!student) continue;
      await Certificate.create({
        certificateId: genCertId(),
        userId:       exam.user,
        examId:       exam._id,
        studentName:  `${student.first_Name} ${student.last_Name}`,
        courseTitle:  courseInfo?.courseInfo?.title || 'Course Completion',
        score:        exam.Score || '0',
        issuedAt:     exam.updatedAt || new Date(),
      });
      certCount++;
    }
    console.log(`   ✔ ${certCount} certificates issued`);

    // ── Summary ───────────────────────────────
    console.log('\n' + '═'.repeat(50));
    console.log('✨  Seeding completed successfully!');
    console.log('═'.repeat(50));
    console.log('\n📋  SEED SUMMARY');
    console.log(`   Roles          : ${roles.length}`);
    console.log(`   Skills         : ${skills.length}`);
    console.log(`   Course Modules : ${allCourseInfos.length}`);
    console.log(`   Admin users    : 1`);
    console.log(`   Student users  : ${students.length}`);
    console.log(`   Enrollments    : ${enrollments.length}`);
    console.log(`   Exam Records   : ${examCount}`);
    console.log(`   Mock Interviews: ${mockCount}`);
    console.log(`   Certificates   : ${certCount}`);
    console.log('\n🔑  LOGIN CREDENTIALS');
    console.log('   Admin   → admin@interviewai.com  / admin@123');
    console.log('   Admin   → hirementorai@gmail.com  / Hire@321');
    console.log('   Student → arjun@student.com      / student@123');
    console.log('   Student → priya@student.com      / student@123');
    console.log('   (all students use: student@123)\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌  Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedData();
