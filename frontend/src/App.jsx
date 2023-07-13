import { Provider } from 'react-redux'
import Routes from './Routes'
import store from './redux/store'
import { Flowbite } from 'flowbite-react';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  return (
    <Provider store={store}>
      <Flowbite>
        <Routes />
      </Flowbite>
      <ToastContainer />
    </Provider>
  );
}

export default App