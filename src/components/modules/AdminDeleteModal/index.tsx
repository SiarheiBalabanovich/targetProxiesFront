import { Label } from "@radix-ui/react-label";
import { Input } from "ui/input.tsx";
import { Button } from "ui/button.tsx";
import { Modal } from "src/components/base/modal";
import React from "react";
import { checkPassword } from "src/core/services/auth";
import { type RegisterOptions, useForm } from "react-hook-form";

interface AdminDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title?: string;
  buttonTitle?: string;
}

interface FormData {
  password: string;
}

export const AdminDeleteModal: React.FC<AdminDeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  title,
  buttonTitle,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<FormData>();

  const nameValidation: RegisterOptions = {
    required: "This field is required",
  };

  const onSubmit = async (data: FormData) => {
    const { password } = data;
    checkPassword(password)
      .then(() => {
        onDelete();
        reset({ password: "" });
      })
      .catch((error) => {
        console.error("Password doesn't match", error.message);
        setError("password", {
          type: "manual",
          message: "Incorrect password",
        });
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      className="max-w-[910px] w-full border-0 px-8 py-10"
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-col justify-start items-center gap-[60px] flex mt-[70px] max-mobile-1:mt-12"
      >
        <div className="flex-col justify-start items-center gap-6 flex">
          <div className="text-[#F7F7F7] text-3xl font-bold font-['Orbitron'] text-center uppercase leading-[33px] max-mobile-1:text-2xl">
            {title || "Do you really want to delete?"}
          </div>
          <Label className="flex w-full flex-col items-center justify-start gap-2  max-w-[430px]">
            <div className="text-[#9B9A9D] text-sm leading-tight">
              Confirm with password
            </div>
            <div className="relative w-full">
              <Input
                type={"password"}
                required
                {...register("password", nameValidation)}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && typeof errors.password.message === "string" && (
              <p className="mt-1 text-red-500">{errors.password.message}</p>
            )}
          </Label>
        </div>
        <div className="flex gap-5 justify-center max-mobile-2:flex-col max-mobile-2:w-full">
          <Button
            variant="secondary"
            onClick={onClose}
            className="max-mobile-2:w-full"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="default"
            className="max-w-[240px] w-full max-mobile-2:max-w-full"
          >
            {buttonTitle || "Yes, delete"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
