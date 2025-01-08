import React from "react";
import { Navbar, Menu, Button } from "react-daisyui";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

function ProjectNavbar(props) {
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.removeItem("teacherId");
    props.setTeacherId(null);
    navigate("/");
  }
  function homePage(){
    navigate("/");
  }
  function handleProfile(){
    navigate(`/teacherInfo/${props.teacherId}`)
  }
  return (
    <Navbar className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-opacity-100 bg-base-100 shadow-lg rounded-lg w-3/4 z-50">
      <div className="flex-1">
        <img src="/PICT_Logo.png" alt="Logo" width={60} />
        <Button tag="a" color="ghost" className="normal-case text-xl"
        onClick={homePage}>
          Submission Ticket Manager
        </Button>
      </div>
      <div className="flex-none">
        <Menu horizontal={true} className="px-1">
          <Menu.Item>
            <details>
              <summary>
                <AccountCircleIcon />
              </summary>
              <ul className="p-2 bg-base-100 shadow-lg rounded-lg">
                <li>
                  <button onClick={handleProfile}>Profile</button>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </details>
          </Menu.Item>
        </Menu>
      </div>
    </Navbar>
  );
}

export default ProjectNavbar;
