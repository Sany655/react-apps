import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './page/Error.js';
import Blog from './page/Blog.js';
import Protected from './page/middlewares/Protected.js';
import Login from './page/login.js';
import Register from './page/register.js';
import Public from './page/middlewares/Public.js';
import Notes from './page/notes.js';
import Friend from './page/friend.js';
import Inbox from './page/inbox.js';
import People from './page/people.js';
import Post from './page/post.js';
import "bootstrap/dist/js/bootstrap.bundle.js";

const root = ReactDOM.createRoot(document.getElementById('root'));

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Protected><Blog /></Protected>,
            },
            {
                path: "/notes",
                element: <Protected><Notes /></Protected>,
            },
            {
                path: "/friend",
                element: <Protected><Friend /></Protected>,
            },
            {
                path: "/inbox",
                element: <Protected><Inbox /></Protected>,
            },
            {
                path: "/people",
                element: <Protected><People /></Protected>,
            },
            {
                path: "/login",
                element: <Public><Login /></Public>
            },
            {
                path: "/register",
                element: <Public><Register /></Public>
            },
        ],
    },
]);

root.render(
    <RouterProvider router={router} />
);

