import React, { useEffect, useRef, useState } from "react";
import { NotificationIcon } from "src/assets/images/icons/icons-ui.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "ui/popover.tsx";
import { Repeat, ShoppingCart, Tags } from "lucide-react";
import { Button } from "ui/button.tsx";
import { getNotifies, updateNotifies } from "src/core/services/notifies";
import { notifiesListProps } from "src/core/models/interfaces";
import { formatTimeAgo } from "src/core/utils/helpers/formatDate.ts";

interface NotificationWidgetProps {
  admin?: boolean;
}

const NotificationWidget: React.FC<NotificationWidgetProps> = () => {
  const [notifies, setNotifies] = useState<notifiesListProps | null>(null);
  const [readNotifies, setReadNotifies] = useState<Set<number>>(new Set());
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [reset, setReset] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          await getNotifies(token)
            .then((response) => {
              setNotifies(response);
            })
            .catch((error) => {
              console.log(error);
            });
        } catch (error) {
          console.log("getNotifies - Error");
        }
      }
    })();
  }, [reset]);

  const getIcon = (type: string) => {
    switch (type) {
      case "api":
        return <Tags className="w-5.5 h-5.5" />;
      case "buy":
        return <ShoppingCart className="w-5.5 h-5.5" />;
      case "repeat":
        return <Repeat className="w-5.5 h-5.5" />;
      default:
        return <NotificationIcon className="w-5.5 h-5.5" />;
    }
  };

  const markAllAsRead = async () => {
    if (notifies) {
      const token = localStorage.getItem("authToken");
      if (token) {
        const unreadNotifies = notifies.notifies.filter(
          (notify) => !readNotifies.has(notify.id),
        );
        const unreadIds = unreadNotifies.map((notify) => notify.id);
        await Promise.all(unreadIds.map((id) => updateNotifies(token, id)));
        setReadNotifies(new Set([...readNotifies, ...unreadIds]));
        setReset(!reset);
      }
    }
  };

  const isElementInViewport = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  const markVisibleAsRead = async () => {
    if (containerRef.current && notifies) {
      const token = localStorage.getItem("authToken");
      if (token) {
        const visibleNotifies = notifies.notifies.filter((notify, index) => {
          const notifyElement = containerRef.current?.children[
            index
          ] as HTMLElement;
          return (
            notifyElement &&
            isElementInViewport(notifyElement) &&
            !readNotifies.has(notify.id)
          );
        });

        const visibleIds = visibleNotifies.map((notify) => notify.id);
        await Promise.all(visibleIds.map((id) => updateNotifies(token, id)));
        setReadNotifies(new Set([...readNotifies, ...visibleIds]));
      }
    }
  };

  const handleScroll = async () => {
    if (containerRef.current && notifies && !isUpdating) {
      const token = localStorage.getItem("authToken");
      if (token) {
        const visibleNotifies = notifies.notifies.filter((notify, index) => {
          const notifyElement = containerRef.current?.children[
            index
          ] as HTMLElement;
          return (
            notifyElement &&
            isElementInViewport(notifyElement) &&
            !readNotifies.has(notify.id)
          );
        });

        const visibleIds = visibleNotifies.map((notify) => notify.id);
        if (visibleIds.length > 0) {
          setIsUpdating(true);
          await Promise.all(visibleIds.map((id) => updateNotifies(token, id)));
          setReadNotifies(new Set([...readNotifies, ...visibleIds]));
          setIsUpdating(false);
        }
      }
    }
  };

  return (
    <Popover onOpenChange={markVisibleAsRead}>
      <PopoverTrigger>
        <div className="relative">
          <NotificationIcon className="text-[#9B9A9D]" />
          <div
            className={`w-2 h-2 bg-red-500 rounded-full border border-neutral-900 absolute top-0 right-[2px] ${
              notifies && notifies.notifies && notifies.notifies.length > 0
                ? ""
                : "hidden"
            }`}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] py-4 px-0 bg-custom-gradient-3 rounded-xl shadow-custom-4 border border-[#0CF0CF10] justify-start items-start gap-2.5 flex max-mobile-2:w-[300px] max-mobile-2:ml-2.5">
        <div className="w-full flex-col justify-start items-center gap-6 flex">
          <div className="w-full px-4 justify-between items-start flex">
            <div className="text-[#9B9A9D] text-sm font-medium uppercase leading-tight">
              notification
            </div>
            <Button
              variant="link"
              onClick={markAllAsRead}
              className="h-auto p-0 text-blue-500 text-sm font-medium leading-tight"
            >
              Mark all as read
            </Button>
          </div>
          <div className="flex-col justify-start items-start gap-6 flex">
            <div
              className="flex-col justify-start items-start gap-1 flex max-h-[300px] overflow-y-scroll"
              ref={containerRef}
              onScroll={handleScroll}
            >
              {notifies &&
                notifies.notifies.map((notifiesItem, index) => (
                  <div
                    className="w-full p-4 bg-[#141927] justify-start items-center gap-4 flex"
                    key={index}
                  >
                    <div className="min-w-10 w-10 h-10 flex justify-center items-center text-[#C2C6D1] relative bg-[#212A38] rounded-full">
                      {getIcon(notifiesItem.type)}
                      <div className="w-2.5 h-2.5 left-[30px] top-0 absolute bg-[#1B88F6] rounded-full border-2 border-[#0E1626]" />
                    </div>
                    <div className="flex-col justify-start items-start gap-3 flex">
                      <div className="opacity-90 text-[#F7F7F7] text-sm font-medium">
                        {notifiesItem.message}
                      </div>
                      <div className="text-[#9B9A9D] text-xs">
                        {formatTimeAgo(notifiesItem.date_created)}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationWidget;
