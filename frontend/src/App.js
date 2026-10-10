import React from 'react';
import { Toaster } from 'sonner';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import { AuthProvider } from './staff/AuthContext';
import RequireAuth from './staff/RequireAuth';
import StaffLogin from './staff/pages/StaffLogin';
import StaffRegister from './staff/pages/StaffRegister';
import StaffHome from './staff/pages/StaffHome';

// The public marketing site — navbar + footer around the content pages.
function PublicSite() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster richColors position="top-right" />
        <Routes>
          {/* Staff field-reporting portal — no public chrome */}
          <Route path="/staff" element={<StaffLogin />} />
          <Route path="/staff/register" element={<StaffRegister />} />
          <Route path="/staff/app" element={<RequireAuth><StaffHome /></RequireAuth>} />
          {/* Public marketing site */}
          <Route path="/*" element={<PublicSite />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
