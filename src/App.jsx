import {
  listPageLoader,
  profilePageLoader,
  singlePageLoader,
} from "./lib/loaders";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import HomePage from "./pages/homePage/homePage";
import ListPage from "./pages/listPage/listPage";
import SinglePage from "./pages/singlePage/singlePage";
import ProfilePage from "./pages/profilePage/profilePage";
import NewPostPage from "./pages/newPostPage/newPostPage";
import { Layout, RequireAuth } from "./pages/layout/layout";
import ProfileUpdatePage from "./pages/profileUpdatePage/profileUpdatePage";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          loader: listPageLoader,
        },
        {
          path: "/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
        },

        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
