import * as React from "react";
import "../css/tailwind.css";
import "../css/main.css";
import toast, { Toaster } from "react-hot-toast";

import { SWUpdatePopup } from "~/components/SWUpdatePopup";
import { isWorkboxPresent } from "~/utils/workbox";

function MyApp({ Component, pageProps }) {
  React.useEffect(() => {
    if (isWorkboxPresent) {
      const wb = window.workbox;

      const promptNewVersionAvailable = (event) => {
        toast.custom((t) => <SWUpdatePopup visible={t.visible} id={t.id} />, {
          position: "top-center",
          duration: 10000,
          id: "sw-worker-update",
        });
      };

      wb.addEventListener("waiting", promptNewVersionAvailable);

      wb.register();
    }
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
