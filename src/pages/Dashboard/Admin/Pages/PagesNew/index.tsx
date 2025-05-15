import React, { useState } from "react";

import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import { CalendarDays, EyeIcon, Pencil } from "lucide-react";
import { Button } from "ui/button.tsx";
import { Input } from "ui/input.tsx";
import { Editor } from "@tinymce/tinymce-react";
import { CloseSvg } from "src/assets/images/icons/icons-ui.tsx";
import { type RegisterOptions, useForm } from "react-hook-form";
import { createPages } from "src/core/services/pages";
import { getUserInfo } from "src/core/services/auth";
import { Link } from "react-router-dom";
import { cn } from "components/lib/utils.ts";
import { buttonVariants } from "ui/buttonVariants.tsx";
import { toast } from "sonner";

interface FormData {
  title: string;
}

const AdminPagesNew: React.FC = () => {
  const [richText, setRichText] = useState(" ");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // form logic
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const nameValidation: RegisterOptions = {
    required: "This field is required",
  };

  const onSubmit = async (data: FormData) => {
    const { title } = data;

    const token = localStorage.getItem("authToken");

    if (token) {
      const userInfo = await getUserInfo(token);
      try {
        const encodedContent = encodeURIComponent(richText);
        const response = await createPages(
          token,
          userInfo.first_name + " " + userInfo.last_name,
          title,
          encodedContent,
        );
        toast.success("Page created successfully");

        if (response.status === "successful") {
          window.location.href = "/admin/pages";
        }
      } catch (error) {
        console.log("createPages - Error");
      }
    }
  };

  // form logic end

  const handleEditorChange = (content: string) => {
    setRichText(content);
    setWordCount(content.split(/\s+/).filter(Boolean).length);
    setCharCount(content.length);
  };

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={10} admin={true} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="Pages" admin={true} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex items-start gap-6 w-full max-w-[1416px] max-mobile-1:flex-col"
        >
          <div className="flex flex-col gap-9 max-w-[1056px] w-full py-9 px-10 bg-custom-gradient-3 rounded-[7px] max-mobile-1:p-5 max-mobile-1:gap-5">
            <div className="flex flex-col gap-5">
              <div className="text-[#9B9A9D] text-base font-medium uppercase">
                add new page
              </div>
              <div className="relative w-full">
                <Input
                  type="text"
                  required
                  {...register("title", nameValidation)}
                  placeholder="Add headline"
                  className="w-full px-4"
                />
                {errors.title && typeof errors.title.message === "string" && (
                  <p className="mt-1 text-red-500">{errors.title.message}</p>
                )}
              </div>
            </div>
            <div>
              <div className="w-full bg-custom-gradient-5 h-px m-3.5"></div>
              <Editor
                apiKey="3okt4aht0jckr59ig3jas7i190a50tkym155qxq7hpup6435"
                initialValue="<p></p>"
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    "ai preview powerpaste casechange footnotes tinycomments searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed advtemplate codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker mergetags a11ychecker editimage help formatpainter permanentpen pageembed charmap quickbars linkchecker emoticons advtable export mentions typography markdown importword",
                  ],
                  toolbar:
                    "wordcount, undo redo | importword | aidialog aishortcuts | blocks fontsizeinput | bold italic | align numlist bullist | link image | table media pageembed | lineheight  outdent indent | strikethrough forecolor backcolor formatpainter removeformat | charmap emoticons checklist | code fullscreen preview | pagebreak anchor codesample footnotes mergetags | addtemplate inserttemplate | addcomment showcomments | ltr rtl casechange | spellcheckdialog a11ycheck",
                  skin: "oxide-dark",
                  content_css: "dark",
                  content_style:
                    "body { font-family:Open Sans,sans-serif; font-size:14px; color: #C2C6D1; }",
                }}
                onEditorChange={handleEditorChange}
              />
              <div className="w-full bg-custom-gradient-5 h-px m-3.5"></div>
              <div className="flex gap-5 justify-between text-[#6F7279] text-xs">
                <div>
                  {wordCount} words/ {charCount}characters
                </div>
              </div>
            </div>
          </div>
          <div className="w-full max-w-[336px] py-6 px-7 bg-custom-gradient-3 rounded-[7px] max-mobile-1:max-w-full">
            <div className="flex-col justify-start items-start gap-6 flex">
              <div className="text-[#9B9A9D] text-base font-medium uppercase">
                publish
              </div>
              <div className="w-full h-px bg-custom-gradient-5" />
              <div className="w-full flex-col justify-start items-start gap-6 flex">
                <div className="w-full flex-col justify-start items-start gap-4 flex">
                  <div className="w-full justify-between items-start flex text-[#6F7279] text-sm uppercase leading-tight">
                    <div>status</div>
                    <div>visibility</div>
                  </div>
                  <div className="w-full justify-between items-center flex">
                    <div className="justify-start items-center gap-1 flex">
                      <Pencil className="w-5 h-5 text-[#00A2CA]" />
                      <div className="text-[#C2C6D1] font-medium">Draft</div>
                    </div>
                    <div className="justify-start items-center gap-1 flex">
                      <EyeIcon className="w-5 h-5 text-[#00A2CA]" />
                      <div className="text-[#C2C6D1] font-medium">Public</div>
                    </div>
                  </div>
                </div>
                <div className="w-full flex-col justify-start items-start gap-4 flex">
                  <div className="w-full justify-between items-start flex text-[#6F7279] text-sm uppercase leading-tight">
                    <div>published</div>
                  </div>
                  <div className="w-full justify-between items-center flex">
                    <div className="justify-start items-center gap-2 flex">
                      <CalendarDays className="w-5 h-5 text-[#00A2CA]" />
                      <div className="text-[#C2C6D1] font-medium">
                        <div>-</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-5 justify-center w-full">
                <Link
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "xs" }),
                  )}
                  to="/admin/pages"
                >
                  <CloseSvg className="text-[#D45858] w-5 h-5" />
                  <div className="text-[#D45858] text-sm leading-tight">
                    Cancel
                  </div>
                </Link>
                <Button
                  variant="blue"
                  disabled={!watch("title")}
                  type="submit"
                  size="xs"
                  className="w-full"
                >
                  publish
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPagesNew;
