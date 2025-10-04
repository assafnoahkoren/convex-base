import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Shell } from './components/Shell';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BoardsList from './pages/Boards/BoardsList';
import BoardViewer from './pages/Boards/BoardViewer';
import BoardEditor from './pages/Boards/BoardEditor';
import BoardHistory from './pages/Boards/BoardHistory';
import DisplaysList from './pages/Displays/DisplaysList';
import DisplayEditor from './pages/Displays/DisplayEditor';

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Shell>
                <Home />
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/boards"
          element={
            <ProtectedRoute>
              <Shell>
                <BoardsList />
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/boards/:boardId/view"
          element={
            <ProtectedRoute>
              <BoardViewer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/boards/:boardId/edit"
          element={
            <ProtectedRoute>
              <BoardEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/boards/:boardId/history"
          element={
            <ProtectedRoute>
              <Shell>
                <BoardHistory />
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/displays"
          element={
            <ProtectedRoute>
              <Shell>
                <DisplaysList />
              </Shell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/displays/:displayId"
          element={
            <ProtectedRoute>
              <Shell>
                <DisplayEditor />
              </Shell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
