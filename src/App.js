import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from './components/auth/Login';
import MediaManager from './components/media/MediaManager';
import AdminDashboard from './components/admin/AdminDashboard';
import TVAdPlayer from './components/tv/TVAdPlayer';
import PlaylistManager from './components/media/PlaylistManager';
import DeviceManager from './components/device/DeviceManager';
// import Sign from './components/SignUp/Sign';
// import Layout from './components/Dashboard/Dashboard';
// import SessionExpired from './components/SessionExpired/SessionExpired';
// import AdminLogin from './components/Admin/Admin';
// import Admindasboard from './components/AdminDashboard/AdminDasboard';
// import VleLayout from './components/VleDashboard/VleDashboard';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        {/* <Route path='/register' element={<Sign />} /> */}
        <Route path='/' element={<Login />} />
        <Route path='/admin-dashboard' element={<AdminDashboard />} />
        <Route path='/admin/media' element={<MediaManager/>} />
        <Route path='/tv-display' element={<TVAdPlayer/>} />
        <Route path='/admin/playlist-manager' element={<PlaylistManager/>} />
        <Route path='/admin/device-manager' element={<DeviceManager/>} />
        <Route path="*" element={<h1 style={{ color: "white" }}>404 Page Not Found</h1>} />
        {/* <Route path='/vledashboard' element={<VleLayout />} />
        <Route path='/dashboard' element={<Layout />} />
        <Route path='/admin' element={<AdminLogin />} />
        <Route path='/sessionexpires' element={<SessionExpired/>}/>
        <Route path='/admindasboard' element={<Admindasboard/>}/> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
