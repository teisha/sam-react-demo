import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';
import Auth from '../Auth/Auth';
import Logout from '../Auth/Logout';

import Error404 from '../components/Errors/Error404';
import HomePage from '../components/HomePage';

import PageLayout from '../layouts/PageLayout';
import Profile from '../components/Profile/Profile';
const Login = React.lazy(() => import('../Auth/Login'));

const appRoutesConfig: RouteObject[] = [
  {
    path: '/index',
    element: <HomePage />,
    errorElement: <Error404 />,
  },
];
/*
    caseSensitive?: AgnosticNonIndexRouteObject["caseSensitive"];
    path?: AgnosticNonIndexRouteObject["path"];
    id?: AgnosticNonIndexRouteObject["id"];
    loader?: AgnosticNonIndexRouteObject["loader"];
    action?: AgnosticNonIndexRouteObject["action"];
    hasErrorBoundary?: AgnosticNonIndexRouteObject["hasErrorBoundary"];
    shouldRevalidate?: AgnosticNonIndexRouteObject["shouldRevalidate"];
    handle?: AgnosticNonIndexRouteObject["handle"];
    index?: false;
    children?: RouteObject[];
    element?: React.ReactNode | null;
    errorElement?: React.ReactNode | null;
*/
const authRoutesConfig: RouteObject[] = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<p> Just a second... </p>}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/logout',
    element: <Logout />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/error-pages/error-404',
    element: <Error404 />,
  },
  {
    path: '/profile',
    element: <Profile color='secondary.dark' />,
  },
];

const allRoutes = [...appRoutesConfig, ...authRoutesConfig].reduce((routeList, currentRoute) => {
  routeList.push(currentRoute);
  return routeList;
}, [] as RouteObject[]);

const catchAllRoute: RouteObject = {
  path: '*',
  element: <Navigate to='/index' replace />,
};

const root: RouteObject = {
  path: '/',
  element: <PageLayout />,
  errorElement: (
    <PageLayout>
      <Error404 />
    </PageLayout>
  ),
  children: [...allRoutes, catchAllRoute],
};

export const router = createBrowserRouter([root]);
