import React from "react";
import PieChart2 from "./components/PieChart2";
import CustomPieChart from "./components/CustomPieChart";
import HookFormDoc from "./components/HookFormDoc";
import MyForm from "./components/MyForm";
import FormikDoc from "./components/FormikDoc";
import List from "./components/List";
import RoutesList from "./components/routerList";

function App() {
    return (
      <>
      <div className="App" >
        <h1>Meshi</h1>
        <PieChart2 style={{display:'none'}}></PieChart2>
        {/* <List></List> */}
      </div>
      <RoutesList></RoutesList>
      </>
    );
  }
  
  export default App;
