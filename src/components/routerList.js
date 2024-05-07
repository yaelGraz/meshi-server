import { Route, Switch, Routes, Navigate } from "react-router-dom";
import MyForm from "./MyForm";
import PieChart2 from "./PieChart2";
import Details from "./details";
import { toHaveDisplayValue } from "@testing-library/jest-dom/matchers";


function RoutesList() {
  return (                                                             
    <Routes>
      <Route path="/" element={<Navigate to="/myForm" />}></Route>
      <Route path="/myForm" element={<MyForm />}></Route>
      <Route path="/pie" element={<PieChart2 />}></Route>
      <Route path="/details/:cat/:id" element={<Details />}></Route>
    </Routes>
  );
}
export default RoutesList;
