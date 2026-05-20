import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import AnimeList from "./pages/anime/AnimeList";
import AnimeAdd from "./pages/anime/AnimeAdd";
import AnimeDetail from "./pages/anime/AnimeDetail";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import MovieList from "./pages/movies/MovieList";
import MovieAdd from "./pages/movies/MovieAdd";
import MovieDetail from "./pages/movies/MovieDetail";
import SeriesList from "./pages/series/SeriesList";
import SeriesAdd from "./pages/series/SeriesAdd";
import SeriesDetail from "./pages/series/SeriesDetail";
import LinkList from "./pages/links/LinkList";
import LinkAdd from "./pages/links/LinkAdd";
import LinkDetail from "./pages/links/LinkDetail";
import CodeList from "./pages/codes/CodeList";
import CodeAdd from "./pages/codes/CodeAdd";
import CodeDetail from "./pages/codes/CodeDetail";

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <Layout>{children}</Layout>
  </ProtectedRoute>
);

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
  { path: "/dashboard", element: <ProtectedLayout><Dashboard /></ProtectedLayout> },
  { path: "/anime", element: <ProtectedLayout><AnimeList /></ProtectedLayout> },
  { path: "/anime/add", element: <ProtectedLayout><AnimeAdd /></ProtectedLayout> },
  { path: "/anime/:id", element: <ProtectedLayout><AnimeDetail /></ProtectedLayout> },
  { path: "/movies", element: <ProtectedLayout><MovieList /></ProtectedLayout> },
  { path: "/movies/add", element: <ProtectedLayout><MovieAdd /></ProtectedLayout> },
  { path: "/movies/:id", element: <ProtectedLayout><MovieDetail /></ProtectedLayout> },
  { path: "/series", element: <ProtectedLayout><SeriesList /></ProtectedLayout> },
  { path: "/series/add", element: <ProtectedLayout><SeriesAdd /></ProtectedLayout> },
  { path: "/series/:id", element: <ProtectedLayout><SeriesDetail /></ProtectedLayout> },
  { path: "/links", element: <ProtectedLayout><LinkList /></ProtectedLayout> },
  { path: "/links/add", element: <ProtectedLayout><LinkAdd /></ProtectedLayout> },
  { path: "/links/:id", element: <ProtectedLayout><LinkDetail /></ProtectedLayout> },
  { path: "/codes", element: <ProtectedLayout><CodeList /></ProtectedLayout> },
  { path: "/codes/add", element: <ProtectedLayout><CodeAdd /></ProtectedLayout> },
  { path: "/codes/:id", element: <ProtectedLayout><CodeDetail /></ProtectedLayout> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}