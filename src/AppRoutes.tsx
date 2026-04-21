import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import Home from './Home';
import EditProfile from './EditProfile';
import NotFound from './NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <PrivateRoute path='/edit-profile' element={<EditProfile />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;