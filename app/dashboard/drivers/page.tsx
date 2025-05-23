"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  History,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriverForm from "@/components/driver-form";
import api from "@/lib/API/axios";
import type { Driver } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loader from "@/components/Loader";

export default function DriversPage() {
  const [loading, setLoading] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/transporters/drivers");
      if (res.data.success) {
        setDrivers(res.data.data);
      }
      if (loading) {
        <Loader />;
      }
    } catch (err) {
      console.error("Failed to fetch drivers", err);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-green-100 text-green-800";
      case "moving":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const getMovementStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-green-100 text-green-800";
      case "moving":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const handleViewTrips = (driverId: string) => {};
  const formatStatus = (status: string) =>
    status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  // // Filtered drivers
  // const filteredDrivers = drivers.filter((driver) => {
  //   const fullName =
  //     ${driver.first_name} ${driver.last_name} ${driver.other_name}.toLowerCase();
  //   const matchesSearch = fullName.includes(searchQuery.toLowerCase());
  //   const matchesStatus = statusFilter ? driver.status === statusFilter : true;
  //   return matchesSearch && matchesStatus;
  // });

  return (
    <div className="flex min-h-screen w-full flex-col">
      {loading ? (
        <Loader />
      ) : (
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Drivers</h1>
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingDriver(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Driver
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingDriver ? "Edit Driver" : "Add New Driver"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingDriver
                      ? "Update the driver details below."
                      : "Enter the details for the new driver."}
                  </DialogDescription>
                </DialogHeader>
                <DriverForm
                  onSuccess={() => {
                    fetchDrivers(); // refresh table data without reload
                    setIsFormOpen(false); // close the form dialog
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full items-center gap-2 md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search drivers..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>
                    pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("moving")}>
                    moving
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter("delivered")}
                  >
                    delivered
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Tabs
              defaultValue="grid"
              className="w-full md:w-auto"
              onValueChange={(value) => setViewType(value as "grid" | "list")}
            >
              <TabsList className="grid w-full grid-cols-2 md:w-[200px]">
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {viewType === "grid" ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {drivers.map((driver) => (
                <Card key={driver.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {driver.first_name} {driver.last_name}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className={cn(getStatusBadgeClass(driver.status))}
                      >
                        {formatStatus(driver.status)}
                      </Badge>
                    </div>
                    <CardDescription>ID: {driver.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    {/* <p>Phone: {driver.data.phone_number}</p>
                  <p>Email: {driver.data.email}</p> */}
                    <p>License: {driver.license_number}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/40 p-4 font-medium">
                <div className="col-span-4">Driver</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-3">Moving status</div>
               
                <div className="col-span-2 flex justify-end">Action</div>
              </div>
              {drivers.map((driver) => (
                <div
                  key={driver.id}
                  className="grid grid-cols-12 items-center border-b p-4"
                >
                  <div className="col-span-4">
                    <div className="font-medium">
                      {driver.first_name} {driver.last_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ID: {driver.id}
                    </div>
                  </div>
                  <div className="col-span-3">
                    <Badge
                      variant="outline"
                      className={cn(getStatusBadgeClass(driver.status))}
                    >
                      {formatStatus(driver.status)}
                    </Badge>
                  </div>
                  <div className="col-span-3">
                    {" "}
                    <Badge
                      variant="outline"
                      className={cn(getMovementStatusBadge(driver.status))}
                    >
                      {formatStatus(driver.status)}
                    </Badge>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingDriver(driver);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewTrips(driver.id)}
                        >
                          <History className="mr-2 h-4 w-4" />
                          View Driver
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}
