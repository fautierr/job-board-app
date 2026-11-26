import { Navigate, Route, Routes } from 'react-router-dom'
import { GuestOnly } from './guards/GuestOnly'
import { RequireAuth } from './guards/RequireAuth'
import { RequireRole } from './guards/RequireRole'
import { AuthLayout } from './layouts/AuthLayout'
import { CandidateLayout } from './layouts/CandidateLayout'
import { EmployerLayout } from './layouts/EmployerLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { NotFoundPage } from '../pages/NotFoundPage'
import { OffersPage } from '../pages/OffersPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { CandidateApplicationsPage } from '../pages/candidate/ApplicationsPage'
import { EditOfferPage } from '../pages/employer/EditOfferPage'
import { NewOfferPage } from '../pages/employer/NewOfferPage'
import { EmployerOffersPage } from '../pages/employer/OffersPage'
import { OfferApplicationsPage } from '../pages/employer/OfferApplicationsPage'

const candidateRoles = ['CANDIDATE'] as const
const employerRoles = ['EMPLOYER'] as const

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/offers" replace />} />

      <Route element={<PublicLayout />}>
        <Route path="offers/:offerId?" element={<OffersPage />} />
      </Route>

      <Route element={<GuestOnly />}>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route path="candidate" element={<RequireRole roles={candidateRoles} />}>
          <Route element={<CandidateLayout />}>
            <Route path="applications" element={<CandidateApplicationsPage />} />
          </Route>
        </Route>

        <Route path="employer" element={<RequireRole roles={employerRoles} />}>
          <Route element={<EmployerLayout />}>
            <Route path="offers" element={<EmployerOffersPage />} />
            <Route path="offers/new" element={<NewOfferPage />} />
            <Route path="offers/:offerId/edit" element={<EditOfferPage />} />
            <Route
              path="offers/:offerId/applications"
              element={<OfferApplicationsPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
