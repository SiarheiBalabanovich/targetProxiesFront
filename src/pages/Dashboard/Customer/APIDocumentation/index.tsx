import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/table";
import React, { useEffect, useState } from "react";
import { pagesList } from "src/core/models/interfaces";
import { getPages } from "src/core/services/pages";
import { Skeleton } from "ui/skeleton.tsx";

const ClientAPIDocumentation: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pages, setPages] = useState<pagesList | null>(null); // Обновите тип состояния

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        try {
          const pagesList = await getPages(token);
          setPages(pagesList);
          setIsLoading(false);
        } catch (error) {
          console.log("getPages - Error");
        }
      }
    })();
  }, []);

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={5} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="API Documentation" />
        <div className="flex flex-col gap-5">
          <div className="text-[#C2C6D1] text-2xl font-medium leading-loose">
            API Integration
          </div>
          {isLoading ? (
            <>
              <Skeleton className="w-full h-[50vh] rounded-xl" />
            </>
          ) : (
            <Accordion
              type="single"
              defaultValue="item-0"
              collapsible
              className="max-w-[1416px] w-full gap-6 flex flex-col text-[#C2C6D1]"
            >
              {pages?.pages.reverse().map((page, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{page.title}</AccordionTrigger>
                  <AccordionContent>
                    <div
                      dangerouslySetInnerHTML={{ __html: page.content }}
                      className="text-[#6F7279] text-sm font-normal leading-tight"
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
              <AccordionItem value="item">
                <AccordionTrigger>Example</AccordionTrigger>
                <AccordionContent>
                  <div className="flex-col justify-start items-start gap-8 flex">
                    <div className="flex-col justify-start items-start gap-8 flex">
                      <div className="text-[#6F7279] text-sm font-normal leading-tight">
                        To get a new randomly generated username and password
                        you need to make a call to the following endpoint:
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
                          <TableRow>
                            <TableHead className="w-[200px] pr-0.5 pl-6 py-3.5">
                              Parameter
                            </TableHead>
                            <TableHead className="w-[250px] pr-0.5 pl-6 py-3.5">
                              Type
                            </TableHead>
                            <TableHead className="pr-0.5 pl-6 py-3.5">
                              Description
                            </TableHead>
                          </TableRow>
                          <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
                        </TableHeader>
                        <TableBody>
                          <TableRow className="bg-[#141927] max-mobile-1:bg-black/0">
                            <TableCell
                              data-label="Parameter"
                              className="pr-0.5 pl-6 py-3.5 text-sm text-[#C2C6D1]"
                            >
                              units
                            </TableCell>
                            <TableCell
                              data-label="Type"
                              className="pr-0.5 pl-6 py-3.5 text-sm text-[#C2C6D1]"
                            >
                              String
                            </TableCell>
                            <TableCell
                              data-label="Description"
                              className="pr-0.5 pl-6 py-3.5 text-sm text-[#C2C6D1]"
                            >
                              <span>
                                Options are either imperial or metric . Whether
                                to return the values in imperial or metric
                                measurements. Imperial will use feet, knots, and
                                fahrenheit. Metric will use centimeters,
                                kilometers per hour, and celsius. metric is the
                                default.
                              </span>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell
                              data-label="Parameter"
                              className="pr-0.5 pl-6 py-3.5 text-sm text-[#C2C6D1]"
                            >
                              days
                            </TableCell>
                            <TableCell
                              data-label="Type"
                              className="pr-0.5 pl-6 py-3.5 text-sm text-[#C2C6D1]"
                            >
                              Integer
                            </TableCell>
                            <TableCell
                              data-label="Description"
                              className="pr-0.5 pl-6 py-3.5 text-sm text-[#C2C6D1]"
                            >
                              The number of days to include in the response.
                              Default is 3.
                            </TableCell>
                          </TableRow>
                          <TableRow className="bg-[#141927] max-mobile-1:bg-black/0">
                            <TableCell
                              data-label="Parameter"
                              className="pr-0.5 pl-6 py-3.5 text-sm text-[#C2C6D1]"
                            >
                              time
                            </TableCell>
                            <TableCell
                              data-label="Type"
                              className="pr-0.5 pl-6 py-3.5 text-sm text-[#C2C6D1]"
                            >
                              Integer. Unix format (ms since 1970) in UTC.
                            </TableCell>
                            <TableCell
                              data-label="Description"
                              className="pr-0.5 pl-6 py-3.5 text-sm text-[#C2C6D1]"
                            >
                              <span>
                                Options are either imperial or metric . Whether
                                to return the values in imperial or metric
                                measurements. Imperial will use feet, knots, and
                                fahrenheit. Metric will use centimeters,
                                kilometers per hour, and celsius. metric is the
                                default.
                              </span>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                      <div className="w-full flex-col justify-start items-start gap-4 flex">
                        <div className="text-[#C2C6D1] text-sm font-normal leading-tight">
                          API Endpoint
                        </div>
                        <div className="w-full px-4 py-3 bg-[#141927] rounded-[7px] justify-start items-center gap-2.5 flex">
                          <code className="text-sm text-[#C2C6D1] leading-tight">
                            {`{"Code": 0,"Success": true,"Msg": "Sucessfully extracted","RequestIp": "request address","Data": [{"ip": "Request address","port": 10951},{"ip": "13.229.125.57","port": 10715}]}`}
                          </code>
                        </div>
                      </div>
                    </div>
                    <div className="w-full justify-between items-start gap-6 flex max-mobile-1:flex-col">
                      <div className="w-full flex-col justify-start items-start gap-4 flex">
                        <div className="text-[#00A2CA] text-sm font-bold leading-tight">
                          Successful API Call
                        </div>
                        <div className="w-full bg-[#040309] min-h-[240px] rounded-[7px] py-3 px-4">
                          <div className="text-[#C2C6D1] text-xs">
                            <div>&#123;</div>
                            <div className="ml-2">
                              "<span className="text-[#DE9948]">status</span>
                              ":{" "}
                              <span className="text-[#31AA7A]">
                                true
                                <br />
                              </span>
                              "<span className="text-[#DE9948]">msg</span>
                              ": “
                              <span className="text-[#31AA7A]">
                                rotation_successful
                              </span>
                              "<br /> "
                              <span className="text-[#DE9948]">portu</span>
                              ": "<span className="text-[#D45858]">3026</span>
                              "<br /> "
                              <span className="text-[#DE9948]">Timestamp</span>
                              ": "
                              <span className="text-[#31AA7A]">11/5/24</span>
                              <span className="text-[#31AA7A]">8:30pm</span>"
                            </div>
                            <div>&#125;</div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full flex-col justify-start items-start gap-4 flex">
                        <div className="text-[#00A2CA] text-sm font-bold leading-tight">
                          Failed API Call
                        </div>
                        <div className="w-full bg-[#040309] min-h-[240px] rounded-[7px] py-3 px-4">
                          <div className="text-[#C2C6D1] text-xs">
                            <div>&#123;</div>
                            <div className="ml-2">
                              "<span className="text-[#DE9948]">status</span>
                              ":{" "}
                              <span className="text-[#31AA7A]">
                                false
                                <br />
                              </span>
                              "<span className="text-[#DE9948]">msg</span>
                              ": “
                              <span className="text-[#31AA7A]">
                                rotation_failed
                              </span>
                              "<br /> "
                              <span className="text-[#DE9948]">portu</span>
                              ": "<span className="text-[#D45858]">3026</span>
                              "<br /> "
                              <span className="text-[#DE9948]">Timestamp</span>
                              ": "
                              <span className="text-[#31AA7A]">11/5/24</span>
                              <span className="text-[#31AA7A]">8:30pm</span>"
                            </div>
                            <div>&#125;</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientAPIDocumentation;
