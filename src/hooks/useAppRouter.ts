import { createBrowserRouter } from 'react-router-dom'

import { appRoutes } from 'src/routes/Routes.tsx'

export const useAppRouter = (): ReturnType<typeof createBrowserRouter> => {
  return createBrowserRouter(appRoutes, {
    /*basename: import.meta.env.BASE_URL,*/
  })
}
