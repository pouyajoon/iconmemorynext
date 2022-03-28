import * as React from "react";
import * as ReactDOM from "react-dom";
import { Application } from "./application/Application";


function render() {
    ReactDOM.render(
        <Application />,
        document.getElementById("root")
    );
}

render();