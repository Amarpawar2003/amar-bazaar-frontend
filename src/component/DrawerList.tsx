import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface MenuItem {
  name: string;
  path: string;
  icon: any;
  activeIcon: any;
}

interface DrawerListProps {
  menu: MenuItem[];
  menu2: MenuItem[];
  toggleDrawer: () => void;
}

const DrawerList = ({
  menu,
  menu2,
  toggleDrawer,
}: DrawerListProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="h-full">
      <div className="flex flex-col justify-between h-full w-full border-r py-5">

        <div>
          <div className="space-y-2">
            {menu.map((item, index: number) => {
              return (
                <div
                  className={`pr-9 cursor-pointer ${
                    location.pathname === item.path
                      ? "bg-primary-color text-white"
                      : ""
                  }`}
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                  }}
                >
                  <div className="flex items-center">
                    <ListItemIcon>
                      {location.pathname === item.path
                        ? item.activeIcon
                        : item.icon}
                    </ListItemIcon>

                    <ListItemText primary={item.name} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Divider/>


        <div className="space-y-2">
          {menu2.map((item, index: number) => {
            return (
              <div
                className={`pr-9 cursor-pointer ${
                  location.pathname === item.path
                    ? "bg-primary-color text-white"
                    : ""
                }`}
                key={index}
                onClick={() => {
                  navigate(item.path);
                }}
              >
                <div className="flex items-center">
                  <ListItemIcon>
                    {location.pathname === item.path
                      ? item.activeIcon
                      : item.icon}
                  </ListItemIcon>

                  <ListItemText primary={item.name} />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default DrawerList;