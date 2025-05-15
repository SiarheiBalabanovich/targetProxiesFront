import React, { useEffect, useState } from "react";

import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import { ActiveSubscriptions } from "src/components/modules/ActiveSubscriptions";
import { Payments } from "src/components/modules/Payments";
import { UserBalance } from "src/components/modules/UserBalance";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "ui/accordion.tsx";
import { SubscriptionDetails } from "src/components/modules/SubscriptionDetails";
import { AdminDeleteModal } from "components/modules/AdminDeleteModal";
import { useSelector } from "react-redux";
import { AppState } from "src/store/store.ts";
import { getDetailSubscriptionList } from "src/core/services/detailSubscription";
import { detailSubscription } from "src/core/models/interfaces";
import { deleteSubscription } from "src/core/services/deleteSubscription";
import { Skeleton } from "ui/skeleton.tsx";
import { toast } from "sonner";

const ClientSubscription: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [detailSubscriptionList, setDetailSubscriptionList] = useState<
    detailSubscription[] | null
  >(null);
  const userId = useSelector((state: AppState) => state.userInfo.id);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState(
    "Do you really want to delete?",
  );
  const [deleteButtonTitle, setDeleteButtonTitle] = useState("Yes, delete");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token && userId !== 0) {
        try {
          const activeDetailSubscription = await getDetailSubscriptionList(
            token,
            userId,
          );
          setDetailSubscriptionList(activeDetailSubscription);
          setIsLoading(false);
        } catch (error) {
          console.log("setActiveSubscriptions - Error");
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [userId]);

  const handleCancelSubModal = (id: number, subId: number): void => {
    setDeleteTitle("Do you really want to unsubscribe?");
    setDeleteButtonTitle("Yes, unsubscribe");
    setDeleteModalIsOpen(true);
    document.body.classList.add("overflow-hidden");
    setDeleteId(`${id}/` + `${subId}`);
  };

  const handleCloseModal = (): void => {
    setDeleteModalIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  const handleDelete = (): void => {
    if (deleteId) {
      (async () => {
        const token = localStorage.getItem("authToken");

        if (token) {
          try {
            await deleteSubscription(token, deleteId);
            setIsLoading(true);
            try {
              const activeDetailSubscription = await getDetailSubscriptionList(
                token,
                userId,
              );
              setDetailSubscriptionList(activeDetailSubscription);
              setIsLoading(false);
              toast.success("Subscription has been successfully canceled");
            } catch (error) {
              console.log("discountsList - Error");
            }
            handleCloseModal();
          } catch (error) {
            console.log("deleteDiscount - Error");
          }
        }
      })();
    }
  };

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={4} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="Subscrition" />
        <div className="flex flex-col gap-[54px] w-full max-w-[1416px] max-mobile-1:gap-4">
          {isLoading ? (
            <>
              <Skeleton className="w-full h-[50vh] rounded-xl" />
            </>
          ) : (
            <div className="grid grid-cols-3 gap-x-6 gap-y-9 grid-rows-none max-1500:flex max-1500:flex-col">
              <div className="col-start-1 col-span-3 row-start-1 row-span-1">
                <UserBalance />
              </div>
              <div className="col-start-1 col-span-3 row-start-2 row-span-3">
                <div className="w-full flex flex-col gap-9">
                  <div className="flex flex-col gap-5">
                    <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
                      Subscription Details
                    </div>
                    <Accordion
                      type="single"
                      defaultValue={`order-0`}
                      collapsible
                      className="w-full gap-6 flex flex-col text-[#C2C6D1]"
                    >
                      {detailSubscriptionList ? (
                        detailSubscriptionList.map((item, key) => (
                          <AccordionItem key={key} value={`order-${key}`}>
                            <AccordionTrigger>
                              order #{item.order_id}
                            </AccordionTrigger>
                            <AccordionContent>
                              <SubscriptionDetails
                                detailSubscription={item}
                                handleCancel={() =>
                                  handleCancelSubModal(
                                    item.subscription_id,
                                    item.subscription_item_id,
                                  )
                                }
                              />
                            </AccordionContent>
                          </AccordionItem>
                        ))
                      ) : (
                        <div className="w-full bg-custom-gradient-3 text-center rounded-[7px] px-10 pb-4 max-1650:px-4">
                          <div className="mx-auto">
                            <div className="text-[#C2C6D1] text-base font-medium mt-5">
                              No active subscriptions
                            </div>
                          </div>
                        </div>
                      )}
                    </Accordion>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
                      Active Subscriptions
                    </div>
                    <div className="w-full bg-custom-gradient-3 rounded-[7px] px-10 pb-4 max-1650:px-4">
                      <div className="w-full flex-col justify-start items-center gap-5 flex">
                        <ActiveSubscriptions />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-5">
                    <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
                      Payments
                    </div>
                    <div className="w-full bg-custom-gradient-3 rounded-[7px] px-10 pb-4 max-1650:px-4">
                      <div className="w-full flex-col justify-start items-center gap-[39px] inline-flex">
                        <div className="w-full flex-col justify-start items-start gap-6 flex">
                          <Payments />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <AdminDeleteModal
        isOpen={deleteModalIsOpen}
        onClose={handleCloseModal}
        onDelete={handleDelete}
        title={deleteTitle}
        buttonTitle={deleteButtonTitle}
      />
    </div>
  );
};

export default ClientSubscription;
