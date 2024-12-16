import '@/assets/css/main.scss';
import './index.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'aos/dist/aos.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'glightbox/dist/css/glightbox.min.css';
import 'swiper/swiper-bundle.css';

import { Outlet } from 'react-router-dom';

export default function HomeLayout() {
  return (
    <main className='home'>
      <Outlet />
    </main>
  )
}
