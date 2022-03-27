import * as React from "react";
import * as ReactDOM from "react-dom";
import { Application } from "./application/Application";

setTimeout(render, 0);

function render() {
    ReactDOM.render(
        <Application />,
        document.getElementById("root")
    );
}