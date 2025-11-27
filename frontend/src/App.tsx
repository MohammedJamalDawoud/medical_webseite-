import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import BackToTop from './components/BackToTop';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectOverviewPage = lazy(() => import('./pages/ProjectOverviewPage'));
const PipelinePage = lazy(() => import('./pages/PipelinePage'));
const ExperimentsPage = lazy(() => import('./pages/ExperimentsPage'));
const PublicationsPage = lazy(() => import('./pages/PublicationsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/project" element={<ProjectOverviewPage />} />
              <Route path="/pipeline" element={<PipelinePage />} />
              <Route path="/experiments" element={<ExperimentsPage />} />
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
