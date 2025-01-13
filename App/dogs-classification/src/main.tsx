import { createRoot } from 'react-dom/client';
import App from './App';

document.body.innerHTML = '<div id="app"></div>';

const root = createRoot(document.getElementById('app') as HTMLElement);
root.render(<div style={{ backgroundColor: 'rgb(17, 68, 116)', height: '100vh' }}><App/></div>);
