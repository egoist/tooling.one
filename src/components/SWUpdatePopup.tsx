import * as React from "react";
import { toast } from "react-hot-toast";
import { isWorkboxPresent } from "~/utils/workbox";
import clsx from "clsx";

interface ISWUpdatePopupProps {
  id: string;
  visible: boolean;
}

export function SWUpdatePopup({ id, visible }: ISWUpdatePopupProps) {
  const handleRefresh = () => {
    const wb = window.workbox;
    if (isWorkboxPresent) {
      wb.addEventListener("controlling", (event) => {
        window.location.reload();
      });
      wb.messageSkipWaiting();
      toast.dismiss(id);
    }
  };

  return (
    <div
      role="alert"
      className={clsx(
        visible ? "animate-enter" : "animate-leave",
        "p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md "
      )}
    >
      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
        New content is available
      </h5>

      <div className="flex mt-4 space-x-3 lg:mt-6">
        <button
          aria-label="Refresh content"
          onClick={handleRefresh}
          className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 "
        >
          Refresh
        </button>
        <button
          aria-label="Close"
          onClick={() => toast.dismiss(id)}
          className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 "
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
