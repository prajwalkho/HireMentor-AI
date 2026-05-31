  import { Route, Routes } from 'react-router-dom'
  import Main from './auth/Main'
  import UserMain from './pages/Main'
  import Auth from './auth/Auth'
  import ForgotPassword from './auth/ForgotPassword'
  import './App.css'
  import OtpScreen from './auth/OtpScreen'
  import ResetPassword from './auth/ResetPassword'
  import 'react-datepicker/dist/react-datepicker.css'
  import CandidateInformation from './pages/user/CandidateInformation'
  import InterviewProgress from './pages/user/InterviewProgress'
  import ResumeBuilder from './pages/user/ResumeBuilder'
  import EnrollCourse from './pages/user/EnrollCourse'
  import Dashboard from './pages/admin/Dashboard'
  import LiveInterview from './pages/user/LiveInterview'
  import CourseInformation from './pages/admin/CourseInformation'
  import RoleManagement from './pages/admin/RoleManagement'
  import CourseList from './pages/admin/CourseList'
  import SkillManagement from './pages/admin/SkillManagement'
  import UserManagement from './pages/admin/UserManagement'
  import StudentDetails from './pages/admin/StudentDetails'
  import Analytics from './pages/admin/Analytics'
  import CertificateGallery from './pages/user/CertificateGallery'
  import CertificateView from './pages/user/CertificateView'
  import ResumeSeven from './component/resume/ResumeSeven'
  import SelectResume from './component/resume/SelectResume'  
  import ResumeOne from './component/resume/ResumeOne'
  import ResumeTwo from './component/resume/ResumeTwo'
  import ResumeThree from './component/resume/ResumeThree'
  import ResumeFour from './component/resume/ResumeFour'
  import ResumeFive from './component/resume/ResumeFive'
  import ResumeSix from './component/resume/ResumeSix'
  import ResumeEight from './component/resume/ResumeEight'
  import ResumeNine from './component/resume/ResumeNine'
  import EnrollExamScore from './pages/user/EnrollExamScore'
  import EditProfiles from './component/EditProfile/EditProfiles'
  import UpdateProfile from './component/EditProfile/UpdateProfile' 
  import ChangePassword from './component/EditProfile/ChangePassword'
  import AiCareerCoatch from './pages/user/AiCareerCoatch'
  import UserDashboard from './pages/user/UserDashboard'
  import ConfirmInterview from './pages/user/ConfirmInterview'
  import StartInterview from './pages/user/StartInterview'
  import FeedBack from './pages/user/FeedBack'
  import { ProtectedRoute, PublicRoute } from './component/ProtectedRoute'
  import Practical from './pages/user/Practical'
  import EnrollCourseHistory from './pages/user/EnrollCourseHistory'
  import TalkWithAi from './pages/user/TalkWithAi'
  import LandingPage from './pages/LandingPage'
import EnrollCourseInformation from './pages/user/EnrollCourseInformation'
  const App = () => {
    return (
      <>
        <Routes>
          <Route path='/' element={<PublicRoute><LandingPage /></PublicRoute>} />

          {/* auth */}
          <Route path='/auth' element={<PublicRoute><Main /></PublicRoute>}>
            <Route index element={<PublicRoute><Auth /></PublicRoute>} />
            <Route path='send-otp' element={<PublicRoute><ForgotPassword /></PublicRoute>} />
            <Route path='verify-otp' element={<PublicRoute><OtpScreen /></PublicRoute>} />
            <Route path='reset-password' element={<PublicRoute><ResetPassword /></PublicRoute>} />
          </Route>

          {/* admin */}
          <Route path='/admin' element={<ProtectedRoute><UserMain /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path='role-management' element={<RoleManagement />} />
            <Route path='course-list' element={<CourseList />} />
            <Route path='course-info' element={<CourseInformation />} />
            <Route path='edit-profile' element={<EditProfiles />} />
            <Route path='update-profile' element={<UpdateProfile />} />
            <Route path='change-password' element={<ChangePassword />} />
            <Route path='skill-management' element={<SkillManagement />} />
            <Route path='user-management' element={<UserManagement />} />
            <Route path='student/:id' element={<StudentDetails />} />
            <Route path='analytics' element={<Analytics />} />
          </Route>

          {/* user */}
          <Route path='/user' element={<ProtectedRoute><UserMain /></ProtectedRoute>}>
            <Route index element={<UserDashboard />} />
            <Route path='candidate-info' element={<CandidateInformation />} />
            <Route path='enroll-course' element={<EnrollCourse />} />
            <Route path='interview-progress' element={<InterviewProgress />} />
            <Route path='live-interview' element={<LiveInterview />} />
            <Route path='ai-career-coatch' element={<AiCareerCoatch />} />
            <Route path='resume-builder' element={<ResumeBuilder />} />
            <Route path='enroll-course' element={<EnrollCourse />} />
          
            <Route path='resume-one' element={<ResumeOne />} />
            <Route path='resume-two' element={<ResumeTwo />} />
            <Route path='resume-three' element={<ResumeThree />} />
            <Route path='resume-four' element={<ResumeFour />} />
            <Route path='resume-five' element={<ResumeFive />} />
            <Route path='resume-six' element={<ResumeSix />} />
            <Route path='resume-seven' element={<ResumeSeven />} />
            <Route path='resume-eight' element={<ResumeEight />} />
            <Route path='resume-nine' element={<ResumeNine />} />
            <Route path='select-resume' element={<SelectResume />} />
            <Route path='edit-profile' element={<EditProfiles />} />
            <Route path='update-profile' element={<UpdateProfile />} />
            <Route path='change-password' element={<ChangePassword />} />
            <Route path='enroll-course/enroll-course-info/:id' element={<EnrollCourseInformation />} />
            <Route path='enroll-exam-score/:id' element={<EnrollExamScore />} />
            <Route path='start-interview/:id' element={<ConfirmInterview />} />
            <Route path='start-interview/:id/start' element={<StartInterview />} />
            <Route path='feedback/:id' element={<FeedBack />} />
            <Route path='practical-exam' element={<Practical />} />
            <Route path='enroll-course-history' element={<EnrollCourseHistory />} />
            <Route path='talk-with-ai' element={<TalkWithAi />} />
            <Route path='certificates' element={<CertificateGallery />} />
            <Route path='certificate/:id' element={<CertificateView />} />
          </Route>
        
        </Routes>
      </>
    )
  }

  export default App
