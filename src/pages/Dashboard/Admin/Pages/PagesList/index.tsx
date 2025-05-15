import React, { useEffect, useState } from "react";

import Sidebar from "src/components/modules/Sidebar";
import Header from "src/components/modules/Header";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui/select.tsx";
import { Label } from "@radix-ui/react-label";
import { Pencil, Search, Trash2 } from "lucide-react";
import { Input } from "ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/table.tsx";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "ui/menubar.tsx";
import { DottedIcon } from "src/assets/images/icons/icons-ui.tsx";
import { Link } from "react-router-dom";
import { AdminDeleteModal } from "src/components/modules/AdminDeleteModal";
import { pagesList } from "src/core/models/interfaces";
import { deletePage, getPages } from "src/core/services/pages";
import { Skeleton } from "ui/skeleton.tsx";

const AdminPagesList: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pages, setPages] = useState<pagesList | null>(null); // Обновите тип состояния
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // Добавлено состояние для поискового запроса

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredPages = pages?.pages.filter((page) =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = (): void => {
    if (deleteId) {
      (async () => {
        const token = localStorage.getItem("authToken");

        if (token) {
          try {
            await deletePage(token, deleteId);

            try {
              const pagesList = await getPages(token, true);
              setPages(pagesList);
            } catch (error) {
              console.log("pagesList - Error");
            }
            handleCloseModal();
          } catch (error) {
            console.log("deletePage - Error");
          }
        }
      })();
    }
  };

  const handleActivateClick = (id: number): void => {
    setModalIsOpen(true);
    setDeleteId(id);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseModal = (): void => {
    setModalIsOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  const pagesReverse = (): void => {
    setPages((prevState) => {
      if (prevState === null) {
        return null;
      }
      const { pages, total } = prevState;
      return {
        ...prevState,
        pages: [...pages].reverse(),
        ...(typeof total === "number" ? { total } : {}),
      };
    });
  };

  return (
    <div className="flex min-h-lvh bg-[#0E0E16]">
      <Sidebar activeMenu={10} admin={true} />
      <div className="w-full pt-[27px] pb-[110px] px-5 flex flex-col gap-[40px] lg:px-10 xl:px-12 2xl:px-14 overflow-x-hidden">
        <Header title="Pages" admin={true} />
        <div className="flex flex-col w-full max-w-[1416px]">
          <div className="w-full bg-custom-gradient-3 rounded-[7px] px-4 py-5 gap-7 flex flex-col justify-start items-start xl:px-7 max-mobile-2:gap-0">
            <div className="w-full flex flex-col gap-5">
              <div className="justify-between items-start flex w-full gap-5 max-mobile-2:flex-col">
                <div className="text-[#9B9A9D] text-base font-medium uppercase">
                  page management
                </div>
                <Select
                  defaultValue="Newest first"
                  onValueChange={pagesReverse}
                >
                  <SelectTrigger className="w-[124px] h-8 px-3 py-1.5 gap-2 text-xs max-mobile-2:w-full">
                    <SelectValue placeholder="Newest first" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Newest first">Newest first</SelectItem>
                      <SelectItem value="Newest last">Newest last</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="justify-between items-end flex w-full gap-5 max-mobile-2:flex-col">
                <Link
                  to="new"
                  className="whitespace-nowrap rounded-[7px] font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-transparent border-[1px] border-[#00A2CA] text-[#C2C6D1] hover:bg-transparent/80 h-10 px-4 py-2.5 text-sm uppercase flex items-center justify-center max-mobile-2:w-full"
                >
                  add new page
                </Link>
                <Label className="flex w-full flex-col items-start justify-start max-w-[444px] max-mobile-2:max-w-full">
                  <div className="relative w-full">
                    <button
                      type={"button"}
                      className="absolute left-0-0 top-0 p-2.5 border-none bg-transparent"
                    >
                      <Search className="text-[#6F7279] w-5 h-5" />
                    </button>
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="py-2.5 pr-3 pl-10 h-10"
                      placeholder="Search page"
                    />
                  </div>
                </Label>
              </div>
            </div>
            <div className="w-full flex-col justify-start items-center gap-[39px] inline-flex">
              {isLoading ? (
                <>
                  <Skeleton className="w-full h-[204px] rounded-xl" />
                </>
              ) : (
                <div className="w-full flex-col justify-start items-start gap-6 flex max-mobile-2:gap-2">
                  <Table className="w-full">
                    <TableHeader>
                      <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
                      <TableRow>
                        <TableHead className="py-2.5 h-[60px]">name</TableHead>
                        <TableHead className="py-2.5 h-[60px]">
                          author
                        </TableHead>
                        <TableHead className="py-2.5 h-[60px]">date</TableHead>
                        <TableHead className="py-2.5 h-[60px] text-right">
                          ACTION
                        </TableHead>
                      </TableRow>
                      <TableRow className="absolute w-full h-px bg-custom-gradient-5" />
                    </TableHeader>
                    <TableBody>
                      {filteredPages?.map((page, index) => (
                        <TableRow key={index}>
                          <TableCell
                            data-label="name"
                            className="h-[72px] text-[#C2C6D1] text-base font-medium"
                          >
                            <span>{page.title}</span>
                          </TableCell>
                          <TableCell
                            data-label="author"
                            className="h-[72px] text-[#9B9A9D] text-base"
                          >
                            {page.name}
                          </TableCell>
                          <TableCell
                            data-label="date"
                            className="h-[72px] text-[#C2C6D1] text-base"
                          >
                            {page.date_created}
                          </TableCell>
                          <TableCell
                            data-label="ACTION"
                            className="h-[72px] text-right"
                          >
                            <Menubar className="justify-end pr-4">
                              <MenubarMenu>
                                <MenubarTrigger className="ml-auto">
                                  <DottedIcon className="w-5 h-5 text-[#C2C6D1] cursor-pointer" />
                                </MenubarTrigger>
                                <MenubarContent>
                                  <MenubarItem className="p-0 [&_a]:px-5 [&_a]:py-2.5">
                                    <Link
                                      to={`${page.id}`}
                                      className="flex gap-2.5 w-full"
                                    >
                                      <Pencil className="w-5 h-5 text-[#F7F7F7]" />
                                      <div className="text-[#F7F7F7] text-sm leading-tight">
                                        Edit
                                      </div>
                                    </Link>
                                  </MenubarItem>
                                  <MenubarItem
                                    onClick={() => handleActivateClick(page.id)}
                                  >
                                    <Trash2 className="text-[#D45858] w-5 h-5" />
                                    <div className="text-[#D45858] text-sm leading-tight">
                                      Delete
                                    </div>
                                  </MenubarItem>
                                </MenubarContent>
                              </MenubarMenu>
                            </Menubar>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AdminDeleteModal
        isOpen={modalIsOpen}
        onClose={handleCloseModal}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminPagesList;
