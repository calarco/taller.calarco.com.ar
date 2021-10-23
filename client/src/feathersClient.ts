import feathers from "@feathersjs/client";
import io from "socket.io-client";

const feathersClient = feathers();

feathersClient.configure(
    feathers.socketio(
        io("http://localhost:3030", {
            transports: ["websocket"],
        })
    )
);
feathersClient.configure(
    feathers.authentication({
        storage: window.localStorage,
    })
);

export default feathersClient;
