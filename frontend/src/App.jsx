import { useDispatch, useSelector } from "react-redux";
import ChatPage from "./components/ChatPage";
import EditProfile from "./components/EditProfile";
import Home from "./components/Home";
import Login from "./components/Login";
import MainLayout from "./components/MainLayout";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { io } from "socket.io-client";
import { setOnlineUsers } from "./redux/chatSlice";
import { setSocket } from "./redux/socketSlice";
import { useEffect } from "react";
import { setLikeNotification } from "./redux/rtnSlice";
import ProtectedRoutes from "./components/protectedRoutes";

const BrowserRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile/:id",
        element: <Profile />,
      },
      {
        path: "/account/edit",
        element: <EditProfile />,
      },
      {
        path: "/chat",
        element: <ChatPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const {socket} = useSelector((store) => store.socketio);
  useEffect(() => {
    if (user) {
      const socketio = io("https://mern-social-media-deploy.onrender.com", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio));
      console.log(socketio);
      
      //listen all the events
      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on("notification", (notification)=> {
        dispatch(setLikeNotification(notification));
      })
      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if(socket){
      socket?.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={BrowserRouter} />
    </>
  );
}

export default App;
