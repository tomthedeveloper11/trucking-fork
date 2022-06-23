import { useState, useEffect } from 'react';
import { useToastContext } from '../lib/toast-context';

interface ButtonConfig {
  className?: string;
  text: string;
}

interface ModalConfig {
  buttonConfig?: ButtonConfig;
  confirmButtonConfig: ButtonConfig;
  onConfirm: () => Promise<void>;
  child: JSX.Element;
  width?: string;
}

export default function Modal({
  buttonConfig,
  confirmButtonConfig,
  onConfirm,
  child,
  width = 'w-96',
}: ModalConfig) {
  const [modalState, setModalState] = useState(buttonConfig ? false : true);
  const addToast = useToastContext();
  const buttonClassName =
    buttonConfig?.className ||
    'bg-green-500 text-white rounded-md px-8 py-2 text-base font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.onclick = (e) => {
        if (e.target === document.getElementById('my-modal')) {
          setModalState(false);
        }
      };
    }
  }, []);

  return (
    <>
      {buttonConfig ? (
        <div className="w-80">
          <button
            className={buttonClassName}
            id="open-btn"
            onClick={() => setModalState(true)}
          >
            {buttonConfig.text}
          </button>
        </div>
      ) : null}

      {modalState ? (
        <div
          className={`fixed block inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full`}
          id="my-modal"
          style={{ zIndex: 1 }}
        >
          <div
            className={`relative top-20 mx-auto p-5 border ${width} shadow-lg rounded-md bg-white`}
          >
            <div className="mt-3">
              <div>{child}</div>
              <div className="items-center px-4 py-3">
                <button
                  id="ok-btn"
                  onClick={() => {
                    onConfirm()
                      .then(() => setModalState(false))
                      .catch((err) => {
                        console.log(err);
                        addToast(err.response.data.message);
                      });
                  }}
                  className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                >
                  {confirmButtonConfig.text}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
