import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import BackToTop from './components/BackToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectOverviewPage = lazy(() => import('./pages/ProjectOverviewPage'));
const PipelinePage = lazy(() => import('./pages/PipelinePage'));
const ExperimentsPage = lazy(() => import('./pages/ExperimentsPage'));
const PublicationsPage = lazy(() => import('./pages/PublicationsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const OrganoidsPage = lazy(() => import('./pages/OrganoidsPage'));
const OrganoidDetailPage = lazy(() => import('./pages/OrganoidDetailPage'));
const PipelineRunsPage = lazy(() => import('./pages/PipelineRunsPage'));
const SegmentationResultsPage = lazy(() => import('./pages/SegmentationResultsPage'));
const ExperimentConfigsPage = lazy(() => import('./pages/ExperimentConfigsPage'));
const ModelVersionsPage = lazy(() => import('./pages/ModelVersionsPage'));
const RunComparisonPage = lazy(() => import('./pages/RunComparisonPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));

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
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Protected Routes - Require Authentication */}
              <Route path="/experiments" element={
                <ProtectedRoute>
                  <ExperimentsPage />
                </ProtectedRoute>
              } />
              <Route path="/organoids" element={
                <ProtectedRoute>
                  <OrganoidsPage />
                </ProtectedRoute>
              } />
              <Route path="/organoids/:id" element={
                <ProtectedRoute>
                  <OrganoidDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/scans/:scanId/runs" element={
                <ProtectedRoute>
                  <PipelineRunsPage />
                </ProtectedRoute>
              } />
              <Route path="/pipeline-runs/:runId/results" element={
                <ProtectedRoute>
                  <SegmentationResultsPage />
                </ProtectedRoute>
              } />
              <Route path="/experiment-configs" element={
                <ProtectedRoute>
                  <ExperimentConfigsPage />
                </ProtectedRoute>
              } />
              <Route path="/model-versions" element={
                <ProtectedRoute>
                  <ModelVersionsPage />
                </ProtectedRoute>
              } />
              <Route path="/compare" element={
                <ProtectedRoute>
                  <RunComparisonPage />
                </ProtectedRoute>
              } />

              {/* Authentication routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <UserProfilePage />
                </ProtectedRoute>
              } />
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
