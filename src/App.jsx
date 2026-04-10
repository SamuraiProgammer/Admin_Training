import { BrowserRouter, Navigate, Outlet, Route, Routes, } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import AddCourse from "./pages/AddCourse";
import CourseDetail from "./pages/CourseDetail";
import CourseView from "./pages/CourseView";
import AdminLogin from "./pages/AdminLogin";
import StudentList from "./pages/StudentList";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import OffersHome from "./pages/OffersHome";
import OfferEditor from "./pages/OfferEditor";
import OfferRegistrations from "./pages/OfferRegistrations";

// PrivateRoute component for protecting routes
function PrivateRoute() {
  const currentUser = useSelector((state) => state?.userDetails?.currentUser);

  return currentUser ? <Outlet /> : <Navigate to="/" replace />;
}

// Redirect based on login state
function LoginRedirect() {
  const currentUser = useSelector((state) => state?.userDetails?.currentUser);

  return currentUser ? <Navigate to="/home" replace /> : <AdminLogin />;
}

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

function App() {
  const currentUser = useSelector((state) => state?.userDetails?.currentUser);

  useEffect(() => {
    if (currentUser?.token) {
      axios.defaults.headers.common.Authorization = `Bearer ${currentUser.token}`;
      return;
    }

    delete axios.defaults.headers.common.Authorization;
  }, [currentUser]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route (Login) */}
        <Route path="/" element={<LoginRedirect />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/offers" element={<OffersHome />} />
            <Route path="/offers/new" element={<OfferEditor />} />
            <Route path="/offers/:id/edit" element={<OfferEditor />} />
            <Route path="/offers/:id/registrations" element={<OfferRegistrations />} />
            <Route path="/add-course" element={<AddCourse />} />
            <Route path="/add-course/:id" element={<AddCourse />} />
            <Route path="/course-detail/add/:id" element={<CourseDetail />} />
            <Route path="/course-detail/edit/:id" element={<CourseDetail />} />
            <Route path="/course-view/:id" element={<CourseView />} />
            <Route path="/student-list" element={<StudentList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;






// import { BrowserRouter, Navigate, Outlet, Route, Routes, } from "react-router-dom";
// import "./App.css";
// import Home from "./pages/Home";
// import AddCourse from "./pages/AddCourse";
// import CourseDetail from "./pages/CourseDetail";
// import CourseView from "./pages/CourseView";
// import AdminLogin from "./pages/AdminLogin";
// import { Toaster } from "react-hot-toast";
// import StudentList from "./pages/StudentList";
// import Navbar from "./components/Navbar";
// import { useSelector } from "react-redux";

// // PrivateRoute component for protecting routes
// function PrivateRoute() {
//   const currentUser = useSelector((state) => state?.userDetails?.currentUser);

//   return currentUser ? <Outlet /> : <Navigate to="/" replace />;
// }

// // Redirect based on login state
// function LoginRedirect() {
//   const currentUser = useSelector((state) => state?.userDetails?.currentUser);

//   return currentUser ? <Navigate to="/home" replace /> : <AdminLogin />;
// }

// const Layout = () => {
//   return (
//     <>
//       <Navbar />
//       <Outlet />
//     </>
//   );
// };

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Public Route (Login) */}
//         {/* <Route path="/" element={<LoginRedirect />} /> */}

//         {/* Protected Routes */}
//         {/* <Route element={<PrivateRoute />}> */}
//           <Route element={<Layout />}>
//             <Route path="/home" element={<Home />} />
//             <Route path="/add-course" element={<AddCourse />} />
//             <Route path="/add-course/:id" element={<AddCourse />} />
//             <Route path="/course-detail/:id" element={<CourseDetail />} />
//             <Route path="/course-view/:id" element={<CourseView />} />
//             <Route path="/student-list" element={<StudentList />} />
//           </Route>
//         {/* </Route> */}
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

