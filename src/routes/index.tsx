import { createBrowserRouter } from 'react-router-dom'
import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'
import {
  AboutPage,
  AquaculturePage,
  AnimalsPage,
  ClientsPage,
  ContactPage,
  DashboardPage,
  EmployeesPage,
  ExpensesPage,
  FruitsPage,
  LandingPage,
  LoginPage,
  MaraichagePage,
  MaterialsPage,
  PoultryPage,
  RegisterPage,
  SalesPage,
  SettingsPage,
  StatisticsPage,
  StocksPage,
  UsersPage,
} from './lazy-pages'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'a-propos', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'connexion', element: <LoginPage /> },
      { path: 'inscription', element: <RegisterPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      {
        path: 'utilisateurs',
        element: <UsersPage />,
      },
      {
        path: 'employes',
        element: <EmployeesPage />,
      },
      {
        path: 'maraichage',
        element: <MaraichagePage />,
      },
      {
        path: 'fruits',
        element: <FruitsPage />,
      },
      {
        path: 'elevage',
        element: <AnimalsPage />,
      },
      {
        path: 'aviculture',
        element: <PoultryPage />,
      },
      {
        path: 'aquaculture',
        element: <AquaculturePage />,
      },
      {
        path: 'materiels',
        element: <MaterialsPage />,
      },
      {
        path: 'stocks',
        element: <StocksPage />,
      },
      {
        path: 'clients',
        element: <ClientsPage />,
      },
      {
        path: 'ventes',
        element: <SalesPage />,
      },
      {
        path: 'depenses',
        element: <ExpensesPage />,
      },
      {
        path: 'statistiques',
        element: <StatisticsPage />,
      },
      {
        path: 'parametres',
        element: <SettingsPage />,
      },
    ],
  },
])
