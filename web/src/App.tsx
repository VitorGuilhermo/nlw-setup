import { Habit } from './components/Habit';
import './styles/global.css';

function App() {

  return (
    <>
      <Habit completed={7}/>
      <Habit completed={4}/>
      <Habit completed={10}/>
    </>
  )
}

export default App
