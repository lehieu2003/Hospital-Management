import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { initAxios } from './utils/axio-utils.ts';
import vi from 'dayjs/locale/vi';
import localeData from 'dayjs/plugin/localeData';
import updateLocale from 'dayjs/plugin/updateLocale';
import dayjs from 'dayjs';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
dayjs.extend(localeData);
dayjs.extend(updateLocale);
dayjs.locale(vi);
dayjs.updateLocale('vi', {
    weekdays: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
    weekdaysShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
    months: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
    ],
    weekStart: 1,
});
initAxios();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
