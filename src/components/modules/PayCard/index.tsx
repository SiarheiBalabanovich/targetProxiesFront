import {
  CardBgIcon,
  DottedIcon,
  MasterCardIcon,
  VisaIcon,
} from "src/assets/images/icons/icons-ui";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "ui/menubar";
import { CreditCard, Trash2 } from "lucide-react";

type PayCardProps = {
  type: "visa" | "mastercard";
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  handleDelete: () => void;
  handleEdit: () => void;
  handleActive: () => void;
  active?: boolean;
};

export const PayCard: React.FC<PayCardProps> = ({
  type,
  cardNumber,
  expiryDate,
  cardName,
  handleDelete,
  active,
}) => {
  return (
    <div
      className={`relative overflow-hidden w-full flex flex-col p-6 gap-8 rounded-xl border-[1px] border-[#00A2CA] ${type == "visa" ? "bg-custom-gradient-10" : "bg-custom-gradient-11"}`}
    >
      <CardBgIcon className="absolute top-0 right-0" />
      <div className="relative flex justify-between w-full">
        <div className="flex gap-3">
          <div>{type == "visa" ? <VisaIcon /> : <MasterCardIcon />}</div>
          {active && (
            <div className="px-2.5 py-1 bg-custom-gradient-9 rounded-[7px] custom-shadow-2 justify-center items-center gap-2.5 flex">
              <div className="w-1.5 h-1.5 bg-[#31AA7A] rounded-full" />
              <div className="text-[#C2C6D1] text-xs font-medium leading-tight">
                Active
              </div>
            </div>
          )}
        </div>
        <div>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger className="ml-auto">
                <DottedIcon className="w-5 h-5 text-[#C2C6D1] cursor-pointer" />
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  <CreditCard className="w-5 h-5 text-[#F7F7F7]" />
                  <div className="text-[#F7F7F7] text-sm leading-tight">
                    Make Active
                  </div>
                </MenubarItem>
                {/*<MenubarItem>*/}
                {/*  <Pencil className="w-5 h-5 text-[#F7F7F7]" />*/}
                {/*  <div className="text-[#F7F7F7] text-sm leading-tight">*/}
                {/*    Edit Card*/}
                {/*  </div>*/}
                {/*</MenubarItem>*/}
                <MenubarItem onClick={() => handleDelete()}>
                  <Trash2 className="text-[#D45858] w-5 h-5" />
                  <div className="text-[#D45858] text-sm leading-tight">
                    Delete Card
                  </div>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
      <div className="relative w-full flex flex-col gap-6">
        <div className="text-[#C2C6D1] text-[22px] font-bold leading-[28px]">
          {cardNumber}
        </div>
        <div className="flex justify-between w-full">
          <div className="flex-col justify-start items-start gap-1.5 flex">
            <div className="text-[#9B9A9D] text-xs leading-none">Name</div>
            <div className="text-[#D8DADF] text-sm leading-tight">
              {cardName}
            </div>
          </div>
          <div className="flex-col justify-start items-start gap-1.5 flex">
            <div className="text-[#9B9A9D] text-xs leading-none">
              Expire Date
            </div>
            <div className="text-[#D8DADF] text-sm leading-tight">
              {expiryDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
