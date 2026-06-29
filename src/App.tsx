import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './components/admin/AdminLogin';
import { CardEditor } from './components/admin/CardEditor';
import { isLoggedIn } from './config/localAuth';
import { Navbar } from './components/Navbar';
import ReadingPage from './pages/ReadingPage';
import { HomePage } from './pages/HomePage';
import { BibliotheekPage } from './pages/BibliotheekPage';
import { FlashcardsPage } from './pages/FlashcardsPage';
import { QuizPage } from './pages/QuizPage';
import { LessenPage } from './pages/LessenPage';
import { InvoerPage } from './pages/InvoerPage';
import { LessenPage as PendelLessenPage } from './pages/pendel/LessenPage';
import { SchijvenPage } from './pages/pendel/SchijvenPage';
import { QuizPage as PendelQuizPage } from './pages/pendel/QuizPage';
import { OefeningenPage } from './pages/pendel/OefeningenPage';
import { ChakrasPage } from './pages/pendel/ChakrasPage';
import { HoroscoopPage } from './pages/HoroscoopPage';
import { MaanfasePage } from './pages/MaanfasePage';
import { NatalChartPage } from './pages/NatalChartPage';
import { NumerologieAnalysePage } from './pages/numerologie/NumerologieAnalysePage';
import { NumerologieHuisnummerPage } from './pages/numerologie/NumerologieHuisnummerPage';
import { NumerologieLevenspadPage } from './pages/numerologie/NumerologieLevenspadPage';
import { NumerologieNaamAnalysePage } from './pages/numerologie/NumerologieNaamAnalysePage';
import { NumerologieExpressiegetalPage } from './pages/numerologie/NumerologieExpressiegetalPage';
import { NumerologieBestuursgetalPage } from './pages/numerologie/NumerologieBestuursgetalPage';
import { NumerologieMobielNummerPage } from './pages/numerologie/NumerologieMobielNummerPage';
import { LenormandBibliotheekPage } from './pages/lenormand/LenormandBibliotheekPage';
import { LenormandLezingPage } from './pages/lenormand/LenormandLezingPage';
import { LenormandFlashcardsPage } from './pages/lenormand/LenormandFlashcardsPage';
import { LenormandQuizPage } from './pages/lenormand/LenormandQuizPage';
import { KristallenPage } from './pages/KristallenPage';
import { RituelenPage } from './pages/RituelenPage';
import { CompatibiliteitPage } from './pages/CompatibiliteitPage';
import { ApiDocsPage } from './pages/ApiDocsPage';
import { CursusModule01Page } from './pages/numerologie/CursusModule01Page';
import { CursusHubPage } from './pages/cursus/CursusHubPage';
import { CursusModule02Page } from './pages/cursus/CursusModule02Page';
import { CursusModule03Page } from './pages/cursus/CursusModule03Page';
import { CursusModule04Page } from './pages/cursus/CursusModule04Page';
import { CursusModule05Page } from './pages/cursus/CursusModule05Page';
import { CursusModule06Page } from './pages/cursus/CursusModule06Page';
import { CursusModule07Page } from './pages/cursus/CursusModule07Page';
import { CursusModule08Page } from './pages/cursus/CursusModule08Page';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isLoggedIn()) return <Navigate to="/admin" replace />;
  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminLogin />} />
        <Route
          path="/admin/cards"
          element={
            <ProtectedRoute>
              <CardEditor />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/reading/:type" element={<Layout><ReadingPage /></Layout>} />
        <Route path="/bibliotheek" element={<Layout><BibliotheekPage /></Layout>} />
        <Route path="/flashcards" element={<Layout><FlashcardsPage /></Layout>} />
        <Route path="/quiz" element={<Layout><QuizPage /></Layout>} />
        <Route path="/lessen" element={<Layout><LessenPage /></Layout>} />
        <Route path="/invoer" element={<Layout><InvoerPage /></Layout>} />
        <Route path="/pendel/lessen" element={<Layout><PendelLessenPage /></Layout>} />
        <Route path="/pendel/schijven" element={<Layout><SchijvenPage /></Layout>} />
        <Route path="/pendel/quiz" element={<Layout><PendelQuizPage /></Layout>} />
        <Route path="/pendel/oefeningen" element={<Layout><OefeningenPage /></Layout>} />
        <Route path="/pendel/chakras" element={<Layout><ChakrasPage /></Layout>} />
        <Route path="/sterrenbeelden" element={<Layout><HoroscoopPage /></Layout>} />
        <Route path="/maanfase" element={<Layout><MaanfasePage /></Layout>} />
        <Route path="/natal" element={<Layout><NatalChartPage /></Layout>} />
        <Route path="/numerologie" element={<Layout><NumerologieAnalysePage /></Layout>} />
        <Route path="/numerologie/analyse" element={<Layout><NumerologieAnalysePage /></Layout>} />
        <Route path="/numerologie/huisnummer" element={<Layout><NumerologieHuisnummerPage /></Layout>} />
        <Route path="/numerologie/levenspad" element={<Layout><NumerologieLevenspadPage /></Layout>} />
        <Route path="/numerologie/naam-analyse" element={<Layout><NumerologieNaamAnalysePage /></Layout>} />
        <Route path="/numerologie/expressiegetal" element={<Layout><NumerologieExpressiegetalPage /></Layout>} />
        <Route path="/numerologie/bestuursgetal" element={<Layout><NumerologieBestuursgetalPage /></Layout>} />
        <Route path="/numerologie/mobiel-nummer" element={<Layout><NumerologieMobielNummerPage /></Layout>} />
        <Route path="/lenormand" element={<Layout><LenormandLezingPage /></Layout>} />
        <Route path="/lenormand/leggingen" element={<Layout><LenormandLezingPage /></Layout>} />
        <Route path="/lenormand/bibliotheek" element={<Layout><LenormandBibliotheekPage /></Layout>} />
        <Route path="/lenormand/flashcards" element={<Layout><LenormandFlashcardsPage /></Layout>} />
        <Route path="/lenormand/quiz" element={<Layout><LenormandQuizPage /></Layout>} />
        <Route path="/kristallen" element={<Layout><KristallenPage /></Layout>} />
        <Route path="/rituelen" element={<Layout><RituelenPage /></Layout>} />
        <Route path="/compatibiliteit" element={<Layout><CompatibiliteitPage /></Layout>} />
        <Route path="/api-docs" element={<Layout><ApiDocsPage /></Layout>} />
        <Route path="/numerologie/cursus/module-01" element={<Layout><CursusModule01Page /></Layout>} />
        <Route path="/cursus" element={<Layout><CursusHubPage /></Layout>} />
        <Route path="/cursus/module-01" element={<Layout><CursusModule01Page /></Layout>} />
        <Route path="/cursus/module-02" element={<Layout><CursusModule02Page /></Layout>} />
        <Route path="/cursus/module-03" element={<Layout><CursusModule03Page /></Layout>} />
        <Route path="/cursus/module-04" element={<Layout><CursusModule04Page /></Layout>} />
        <Route path="/cursus/module-05" element={<Layout><CursusModule05Page /></Layout>} />
        <Route path="/cursus/module-06" element={<Layout><CursusModule06Page /></Layout>} />
        <Route path="/cursus/module-07" element={<Layout><CursusModule07Page /></Layout>} />
        <Route path="/cursus/module-08" element={<Layout><CursusModule08Page /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
