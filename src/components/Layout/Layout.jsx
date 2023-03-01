import { Outlet, Link } from "react-router-dom";
import { Avatar, Button, Dropdown, Navbar } from "flowbite-react";
import { useState } from "react";
import 'flowbite';
import {
  HiCalendar,
  HiLink,
  HiViewGridAdd,
  HiUsers,
  HiChartSquareBar,
  HiTemplate,
  HiCollection,
} from "react-icons/hi";
import { HiListBullet } from "react-icons/hi2";
import ScheduleModal from "./ScheduleModal";
import ScheduleMoreModal from "./ScheduleMoreModal";
import ScheduleMultipleModal from "./ScheduleMultipleModal";

const Layout = ({ addedChannels, authorized }) => {
  const [scheduleModal, setScheduleModal] = useState(false);
  const [scheduleMoreModal, setScheduleMoreModal] = useState(false);
  const [scheduleMutipleModalShow, setScheduleMutipleModalShow] =
    useState(false);
    const [toggle,setToggle] = useState(false);



  return (

    <>
    <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
  <div class="px-3 py-3 lg:px-5 lg:pl-3">
    <div class="flex items-center justify-between">
      <div class="flex items-center justify-start">
        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" id="toggleBtn">
        {/* onClick={()=>{setToggle(!toggle)}}  */}
            <span class="sr-only">Open sidebar</span>
            <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
               <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
         </button>
        <a href="https://flowbite.com" class="flex ml-2 md:mr-24">
          <img src="https://flowbite.com/docs/images/logo.svg" class="h-8 mr-3" alt="FlowBite Logo" />
          <span class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap ">Postminder</span>
        </a>
      </div>
      <div class="flex items-center">
          <div class="flex items-center ml-3">
            <div>
              <button type="button" class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                <span class="sr-only">Open user menu</span>
                <img class="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
              </button>
            </div>
            <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
              <div class="px-4 py-3" role="none">
                <p class="text-sm text-gray-900 dark:text-white" role="none">
                  Neil Sims
                </p>
                <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                  neil.sims@flowbite.com
                </p>
              </div>
              <ul class="py-1" role="none">
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</a>
                </li>
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
  </div>
</nav>

<aside id="logo-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar"
style={{ left: toggle? '250px': '0px'}}
>
   <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
     <ul className="space-y-2">
         {authorized ? (
              <>
                {" "}

                <li className="flex m-3 items-center justify-center">
                  <Dropdown label="Schedule a Post" size="lg">
                    <Dropdown.Item
                      onClick={() => {
                        setScheduleModal(true);
                      }}>
                      <button className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span className="ml-3">Schedule a Post</span>
                      </button>
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        setScheduleMutipleModalShow(true);
                      }}>
                      <a
                        href="#"
                        className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span className="ml-3">Schedule Multiple Posts</span>
                      </a>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <a
                        href="#"
                        className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                        <span className="ml-3">Schedule Live Videos</span>
                      </a>
                    </Dropdown.Item>
                  </Dropdown>
                </li>
              </>
            ) : (
              <></>
            )}

            <li>
              <Link
                to="/"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <HiTemplate
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/tasksassigned"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <HiCollection className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Tasks Assigned
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/analytics"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <HiChartSquareBar className="flex-shrink-0 w-7 h-7 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 whitespace-nowrap">Analytics</span>
              </Link>
            </li>
            <li>
              <Link
                to="/calender"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <HiCalendar
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                />
                <span className="flex-1 ml-3 whitespace-nowrap">Calender</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manageteam"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <HiUsers
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Manage Team
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/integrations"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <HiLink
                  className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  fill="currentColor"
                />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Integrations
                </span>
              </Link>
            </li>
          </ul>
   </div>
</aside>

<div class="p-4 sm:ml-64">
<div className="p-4   rounded-lg dark:border-gray-700 mt-14">
          <Outlet />
          <ScheduleModal
            scheduleModal={scheduleModal}
            setScheduleModal={setScheduleModal}
            addedChannels={addedChannels}
          />
          <ScheduleMultipleModal
            scheduleMultipleModalShow={scheduleMutipleModalShow}
            setScheduleMultipleModalShow={setScheduleMutipleModalShow}
            addedChannels={addedChannels}
          />
          <ScheduleMoreModal
            scheduleMoreModal={scheduleMoreModal}
            setScheduleMoreModal={setScheduleMoreModal}
          />
        </div>
</div>
    </>
  );
};

export default Layout;
