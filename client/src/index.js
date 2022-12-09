import React from "react";
import ReactDOM from 'react-dom/client';
import { Calendar } from "./Calendar.js";
import "./calendar.css"


const calendarDays = ["Mon 28/11", "Tue 29/11", "Wed 30/11", "Thu 01/12"];
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Calendar days={calendarDays} />);