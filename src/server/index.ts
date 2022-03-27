import colors from "colors";
import { expressServer } from "./server/server";

colors.setTheme({
    info: "green"
});

console.log('ok'.blue);

expressServer()