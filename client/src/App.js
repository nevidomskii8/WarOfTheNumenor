import './App.css';
import Routes from './Routes';
import createStore from './redux/createStore'
import { Provider } from 'react-redux'
import { useAuth } from './hooks/useAuth'
import { AuthContext } from './context/AuthContext';

const store = createStore();

function App() {
  const { token, login, logout, userId, ready } = useAuth();
  const isAuthenticated = !!token

  return (
    <Provider store={store}>
      <AuthContext.Provider value={{ token, login, logout, userId, ready, isAuthenticated }}>
        <Routes />
      </AuthContext.Provider>
    </Provider>
  );
}

export default App;
