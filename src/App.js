import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import { Container } from "react-bootstrap";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <main className='py-3'>
          <Container>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/project/:projectId" element={<DetailScreen />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
