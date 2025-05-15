import React, { useEffect, useRef } from "react";
import { Transition } from "react-transition-group";
import { CloseSvg } from "src/assets/images/icons/icons-ui.tsx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  background?: string;
  marginNo?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  background,
  marginNo,
}) => {
  const nodeRef = useRef(null);

  const handleClose = (event: React.MouseEvent): void => {
    event.stopPropagation();
    onClose();
  };

  const handleInnerClick = (event: React.MouseEvent): void => {
    event.stopPropagation();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <Transition in={isOpen} timeout={350} unmountOnExit nodeRef={nodeRef}>
      {(state) => (
        <div
          className={`fixed inset-0 z-50 overflow-y-auto bg-black/75 transition-opacity ${state}`}
        >
          <div
            className="absolute top-0 flex min-h-screen w-full items-center justify-center"
            onClick={handleClose}
          >
            <div
              className={`relative rounded-[7px] border border-cyan-500 border-opacity-50 backdrop-blur-[10px] transition-all max-mobile-1:px-4 max-mobile-1:py-6 ${className} ${background ? background : "bg-custom-gradient-3"} ${marginNo ? "m-0" : "m-5"}`}
              onClick={handleInnerClick}
            >
              <button
                className="w-11 h-11 absolute right-11 top-7 inline-flex size-6 cursor-pointer items-center justify-center rounded-3xl border-none bg-zinc-800/5 p-0 text-black max-mobile-1:right-3 max-mobile-1:top-3 max-mobile-1:w-9 max-mobile-1:h-9"
                onClick={onClose}
              >
                <CloseSvg className="text-[#6F7279]" />
              </button>
              {children}
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};
