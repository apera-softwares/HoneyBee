"use client";
import React, { useEffect, useState } from "react";
import Button from "../ui/button/Button";
import { Modal } from "../ui/modal";
import { Users1 } from "../../icons/index";
import { FORM_INPUT_CLASS } from "@/constant/constantClassName";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import toast,{Toaster} from "react-hot-toast";
import { fetchTeams } from "@/lib/redux/slices/teamManagementSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { BACKEND_API } from "@/api";
import { fetchUserProfile } from "@/lib/redux/slices/loginPersonProfile";

interface ChangeTeamModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const ChangeTeamModal: React.FC<ChangeTeamModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const ITEM_PER_PAGE = 10;
  const [searchText, setSearchText] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [loading,setLoading] = useState<boolean>(false);
  const { user:loggedInUser } = useAppSelector((state) => state.user);
  const { teams } = useAppSelector((state) => state.TeamManagement);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      getTeams();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText, dispatch]);

  const getTeams = async () => {
    if (selectedTeam) return;
    try {
      const payload = {
        name: searchText.trim(),
        page: 1,
        limit: ITEM_PER_PAGE,
      };
      const res = await dispatch(fetchTeams(payload)).unwrap();

      console.log("response of get teams", res);
    } catch (error: any) {
      console.log(error?.message || "Failed to fetch products");
    }
  };

  const handleChangeTeam = async () => {

    if (!selectedTeam) {
      toast.error("Please select a team");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        teamId: selectedTeam.id,
      };

      const token = loggedInUser?.token;
      const response = await axios.post(
        `${BACKEND_API}team/changeTeam`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      console.log("team change response data", response.data);
      toast.success("Team changed successfully");
      await dispatch(fetchUserProfile());
      handleCloseModal();
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error changing team ",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data?.message || "Failed to Change team"
        );
      } else {
        toast.error("Failed to change team");
      }
    } finally {
        
     setLoading(false);

    }
  };



  const handleSelectTeam = (teamData: any) => {
    if (teamData) {
      setSelectedTeam(teamData);
      setSearchText("");
      return;
    }
    setSelectedTeam(null);
    setSearchText("");
  };

  const clear = () => {
    setSearchText("");
    setSelectedTeam(null);
  };

  const handleCloseModal = () => {
    clear();
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={()=>{
        if(!loading){
          handleCloseModal();
        }
      }}
      className="max-w-[700px] p-6 lg:p-10 pt-10 "
    >
      <Toaster />

      <div className="w-full  ">
        <div className="flex items-center gap-4  mb-6 lg:mb-8">
          <span className="bg-primary p-1 sm:p-2 flex justify-center items-center rounded-full">
            <Users1 />
          </span>
          <div className="">
            <h5 className="font-semibold text-gray-800 text-xl sm:text-2xl lg:text-3xl dark:text-white/90">
              Change Team
            </h5>
          </div>
        </div>

        <div className="w-full mb-6">
          <div className="w-full">
            <label className="block font-medium mb-1">Team</label>
            <input
              type="text"
              placeholder="search team "
              className={`${FORM_INPUT_CLASS} mb-2`}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {teams && !selectedTeam && (
              <div className="w-full mt-1">
                <ul className="w-full bg-white border border-gray-200 rounded shadow max-h-52 overflow-auto">
                  {teams.length > 0 ? (
                    teams.map((team) => (
                      <li
                        key={team?.id}
                        onClick={() => handleSelectTeam(team)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {team?.name || ""}
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-gray-500 cursor-default">
                      No team found
                    </li>
                  )}
                </ul>
              </div>
            )}

            {selectedTeam && (
              <div className="p-3 border rounded-md bg-gray-50 flex justify-between  items-center gap-2 ">
                <div className="">
                  <p className="text-sm text-gray-500">
                    {selectedTeam?.name || ""}
                  </p>
                </div>
                <button
                  className="text-red-500 hover:text-red-700 "
                  onClick={() => handleSelectTeam(null)}
                >
                  <RxCross2 className="h-6 w-6" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end w-full gap-3">
          <Button disabled={loading} size="sm" onClick={handleChangeTeam}>
            Save Changes
          </Button>
          <Button disabled={loading}  size="sm" variant="outline" onClick={handleCloseModal}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeTeamModal;
