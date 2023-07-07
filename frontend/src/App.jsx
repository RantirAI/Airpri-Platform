import { Provider } from 'react-redux'
import Routes from './Routes'
import store from './redux/store'
import { DarkThemeToggle, Flowbite } from 'flowbite-react';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <Provider store={store}>
      <Flowbite>
        <DarkThemeToggle className='fixed top-2 right-2' />
        <Routes />
      </Flowbite>
      <ToastContainer />
    </Provider>
  );
}

export default App