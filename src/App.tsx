import React from "react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";

import store from "src/store/store.ts";
import { useAppRouter } from "src/hooks/useAppRouter.ts";

import "src/assets/styles/index.scss";
import { Toaster } from "sonner";

const App: React.FC = () => {
  const appRouter = useAppRouter();

  return (
    <Provider store={store}>
      <div className={"App"}>
        <RouterProvider router={appRouter} />
        <Toaster />
      </div>
    </Provider>
  );
};

export default App;
