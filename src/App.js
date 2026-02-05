import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import DetailScreen from "./screens/DetailScreen";
import ProjectCreateScreen from "./screens/ProjectCreateScreen";
import TaskCreateScreen from "./screens/TaskCreateScreen";
import UserListScreen from "./screens/UserListScreen";
import UserCreateScreen from "./screens/UserCreateScreen";
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
              <Route path="/users" element={<UserListScreen />} />
              <Route path="/users/create" element={<UserCreateScreen />} />
              <Route path="/project/create" element={<ProjectCreateScreen />} />
              <Route path="/project/:projectId" element={<DetailScreen />} />
              <Route path="/project/:projectId/task/create" element={<TaskCreateScreen />} />
            </Routes>
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
