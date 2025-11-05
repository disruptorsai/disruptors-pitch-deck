import Layout from "./Layout.jsx";

import Home from "./Home";

import TheProblem from "./TheProblem";

import WhyAI from "./WhyAI";

import Dashboard from "./Dashboard";

import Introduction from "./Introduction";

import Diagnostic from "./Diagnostic";

import CaseStudies from "./CaseStudies";

import Capabilities from "./Capabilities";

import Blueprint from "./Blueprint";

import CallToAction from "./CallToAction";

import Pricing from "./Pricing";

// Landing page versions preview
import LandingPreview from "./LandingPreview";

// Presentation viewer pages
import PresentationViewer from "./PresentationViewer";
import PresentationError from "./PresentationError";
import DemoViewer from "./DemoViewer";

// Admin pages
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ClientsManager from "./admin/ClientsManager";
import ClientForm from "./admin/ClientForm";
import SmartClientForm from "./admin/SmartClientForm";
import AccessLinkGenerator from "./admin/AccessLinkGenerator";
import BusinessIntelligence from "./admin/BusinessIntelligence";

import { Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {

    Home: Home,

    TheProblem: TheProblem,

    WhyAI: WhyAI,

    Dashboard: Dashboard,

    Introduction: Introduction,

    Diagnostic: Diagnostic,

    CaseStudies: CaseStudies,

    Capabilities: Capabilities,

    Blueprint: Blueprint,

    CallToAction: CallToAction,

    Pricing: Pricing,

}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);

    // Check if we're on an admin page
    const isAdminPage = location.pathname.startsWith('/admin');

    return (
        <Routes>
            {/* Landing Page Preview - Standalone Route */}
            <Route path="/preview" element={<LandingPreview />} />

            {/* Demo Viewer - For Development/Review Only */}
            <Route path="/demo" element={<DemoViewer />} />

            {/* Presentation Viewer Routes - Token-based access */}
            <Route path="/p/:token" element={<PresentationViewer />} />
            <Route path="/presentation-error" element={<PresentationError />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="clients" element={<ClientsManager />} />
                <Route path="clients/new" element={<SmartClientForm />} />
                <Route path="clients/:id" element={<ClientForm />} />
                <Route path="access-links" element={<AccessLinkGenerator />} />
                <Route path="business-intelligence" element={<BusinessIntelligence />} />
                {/* Placeholder routes for future pages */}
                <Route path="analytics" element={<div className="text-white">Analytics Coming Soon</div>} />
                <Route path="content" element={<div className="text-white">Content Editor Coming Soon</div>} />
                <Route path="settings" element={<div className="text-white">Settings Coming Soon</div>} />
            </Route>

            {/* Public Presentation Routes */}
            <Route path="*" element={
                <Layout currentPageName={currentPage}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/Home" element={<Home />} />
                        <Route path="/Dashboard" element={<Dashboard />} />
                        <Route path="/Introduction" element={<Introduction />} />
                        <Route path="/Diagnostic" element={<Diagnostic />} />
                        <Route path="/CaseStudies" element={<CaseStudies />} />
                        <Route path="/Capabilities" element={<Capabilities />} />
                        <Route path="/Blueprint" element={<Blueprint />} />
                        <Route path="/CallToAction" element={<CallToAction />} />
                        <Route path="/Pricing" element={<Pricing />} />
                    </Routes>
                </Layout>
            } />
        </Routes>
    );
}

// Export PagesContent directly as Pages since Router and AIProvider are now in App.jsx
export default PagesContent;