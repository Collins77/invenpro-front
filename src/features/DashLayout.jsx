import React, { useState } from "react";
import { AudioWaveform, BadgePercent, Bell, Blocks, ChartArea, ChevronsDownUp, ClipboardList, Codepen, CreditCard, LayoutDashboard, List, LogOut, Plus, ScanBarcode, ShoppingBag, SidebarIcon, User, UserPlus, Users, Verified } from "lucide-react";
import { Outlet } from "react-router-dom";

const DashLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // desktop
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // mobile
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);


  // function to handle sidebar toggle from header icon
  const handleSidebarToggle = () => {
    if (window.innerWidth >= 1024) {
      // desktop
      setSidebarOpen(!sidebarOpen);
    } else {
      // mobile
      setMobileSidebarOpen(true);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out p-2 h-full
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          hidden lg:flex flex-col
        `}
      >
        <div className="flex items-center gap-2 border-b border-gray-200 p-1">
          <div className="w-[40px] h-[40px] bg-black text-white flex items-center justify-center rounded-md">
            <h1 className="font-bold">IP</h1>
          </div>
          <h1 className="text-black text-2xl font-bold">InvenPro</h1>
        </div>
        {/* Navigation */}
        <div className="p-2 flex-1 overflow-y-auto">
          <div className="flex flex-col gap-2 mb-3">
            <h1 className="text-sm text-black">Home</h1>
            <a href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
              <LayoutDashboard />
              Dashboard
            </a>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <h1 className="text-sm text-black">Inventory</h1>
            <ul>
              <li>
                <a href="/dashboard/add-stock" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <ScanBarcode />
                  Add Stock
                </a>
              </li>
              <li>
                <a href="/dashboard/products" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <ShoppingBag />
                  All Products
                </a>
              </li>
              <li>
                <a href="/dashboard/out-of-stock" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <Blocks />
                  Out Of Stock Products
                </a>
              </li>
            </ul>
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <h1 className="text-sm text-black">Sales</h1>
            <ul>
              <li>
                <a href="/pos" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <BadgePercent />
                  POS
                </a>
              </li>
              <li>
                <a href="/dashboard/sales" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <ClipboardList />
                  View Sales
                </a>
              </li>
              <li>
                <a href="/dashboard/reports" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <ChartArea />
                  Analytics
                </a>
              </li>
            </ul>
          </div>
          {/* <div className="flex flex-col gap-2 mb-3">
            <h1 className="text-sm text-black">Staff</h1>
            <ul>
              <li>
                <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <UserPlus />
                  Add Staff
                </a>
              </li>
              <li>
                <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <Users />
                  View staff
                </a>
              </li>
            </ul>
          </div> */}
          <div className="flex flex-col gap-2 mb-3">
            <h1 className="text-sm text-black">Settings</h1>
            <ul>
              <li>
                <a href="/dashboard/categories" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <List />
                  Categories
                </a>
              </li>
              <li>
                <a href="/dashboard/brands" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <Codepen />
                  Brands
                </a>
              </li>
              {/* <li>
                <a href="/" className="flex items-center gap-2 text-sm text-gray-500 hover:bg-green-100 rounded-md p-2">
                  <AudioWaveform />
                  System Logs
                </a>
              </li> */}
            </ul>
          </div>
        </div>
        {/* Name and Profile */}
        <div className="border-t border-gray-200 bg-white p-3 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-sm">Collins Muema</h1>
            <p className="text-sm text-gray-500">admin@invenpro.com</p>
          </div>
          <div className="flex gap-2 items-center">
            <Bell className="text-gray-500" size={20} />
            <User className="text-gray-500" size={20} />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar + Overlay */}
      {mobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-30 bg-black/40"
            onClick={() => setMobileSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 z-40 w-1/2 bg-gray-200 shadow-md transition-transform duration-300">
            {/* Empty mobile sidebar */}
          </div>
        </>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : ""
          }`}
      >
        {/* Header */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 h-14">
          <div className="flex items-center gap-4">
            <button onClick={handleSidebarToggle} className="p-1">
              <SidebarIcon size={20} />
            </button>
            <h1 className="font-bold text-2xl">
              Billiards Chillzone
            </h1>
          </div>
          {/* User Profile Dropdown */}
          <div className="relative">
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() => setUserDropdownOpen(prev => !prev)}
            >
              <div className="w-[40px] h-[40px] bg-gray-200 flex items-center justify-center rounded-full">
                <User />
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-sm">Collins Muema</h1>
                <p className="text-gray-500 text-sm">admin@invenpro.com</p>
              </div>
              <ChevronsDownUp className="text-gray-500" size={20} />
            </div>

            {/* Dropdown Menu */}
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-md z-50 p-2">
                <div
                  className="flex gap-2 items-center cursor-pointer border-b border-gray-200"
                >
                  <div className="w-[20px] h-[20px] bg-gray-200 flex items-center justify-center rounded-full">
                    <User />
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-bold text-[12px]">Collins Muema</h1>
                    <p className="text-gray-500 text-[10px]">admin@invenpro.com</p>
                  </div>
                </div>
                <ul className="flex flex-col p-2 gap-2 border-b border-gray-200">
                  <li className="hover:bg-gray-100 rounded cursor-pointer">
                    <a href=""  className="text-gray-500 text-sm flex items-center gap-1">
                      <Verified size={20} />
                      Profile
                    </a>
                  </li>
                  <li className="hover:bg-gray-100 rounded cursor-pointer">
                    <a href=""  className="text-gray-500 text-sm flex items-center gap-1">
                      <CreditCard size={20} />
                      Billing
                    </a>
                  </li>
                  <li className="hover:bg-gray-100 rounded cursor-pointer">
                    <a href=""  className="text-gray-500 text-sm flex items-center gap-1">
                      <Bell size={20} />
                      Notifications
                    </a>
                  </li>   
                </ul>
                <button className="p-2 flex items-center gap-1 text-sm text-gray-500 cursor-pointer">
                  <LogOut size={20} />
                  Log Out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashLayout;
