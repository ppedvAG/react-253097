import {ReactComponentsExample} from './demo_react_components/ReactComponentsExample';
import {ReactStylingExample} from './demo_react_styling/ReactStylingExample';
import { ReactFormsExample } from "./demo_react_forms/ReactFormsExample";
import './App.css';
import { ReactBackendExample } from './demo_react_backend/ReactBackendExample';
import { ReactRoutingExample } from './demo_react_routing/ReactRoutingExample';
import { BrowserRouter } from 'react-router-dom';
import { ReactContextReduxExample } from './demo_context_redux/ReactContextReduxExample';

function App() {
  return (
    <div className="App">
      {/* Demo React Components*/}
      <ReactComponentsExample></ReactComponentsExample> 
      {/* Demo React Styling*/}
      <ReactStylingExample></ReactStylingExample> 
      {/* Demo React Forms*/}
      <ReactFormsExample></ReactFormsExample> 
      {/* Demo React Backend*/}
      <ReactBackendExample></ReactBackendExample>
      {/* Demo React Routing*/}
      <BrowserRouter>
        <ReactRoutingExample></ReactRoutingExample>
      </BrowserRouter>
      {/* Demo React Context/Redux*/}
      <ReactContextReduxExample></ReactContextReduxExample>
    </div>
  );
}

export default App;
