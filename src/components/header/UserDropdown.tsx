import { useState, useEffect, useSyncExternalStore } from "react";
import { UserRound } from "lucide-react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@apiConfig";
import { Dropdown } from "@components/ui/dropdown/Dropdown";
import FileInput from "@components/form/input/FileInput";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [_token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; username: string } | null>(
    null
  );
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    }

    const storedAvatar = localStorage.getItem("user_avatar");
    if (storedAvatar) setAvatar(storedAvatar);
  }, []);

  async function fetchUser(token: string) {
    try {
      const response = await fetch(`${API_BASE_URL}user/current`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
        },
      });

      if (!response.ok) throw new Error("Ошибка загрузки пользователя");

      const data = await response.json();
      setUser({ name: data.name, username: data.username });
    } catch (error) {
      console.error("Ошибка запроса пользователя:", error);
    }
  }

  function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setAvatar(result);
        localStorage.setItem("user_avatar", result);
      };
      reader.readAsDataURL(file);
    }
  }

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_avatar");
    setToken(null);
    window.location.href = "/";
  };
  function getSnapshot() {
    return navigator.onLine;
  }

  function subscribe(callback: any) {
    const onlineHandler = () => {
      toast.success("Соединение восстановлено. Вы в сети!");
      callback();
    };

    const offlineHandler = () => {
      toast.error("Соединение потеряно. Проверьте интернет!");
      callback();
    };

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-[-10px] overflow-hidden rounded-full w-full h-full">
          {avatar ? (
            <img
              src={avatar}
              alt="User"
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-11 w-11 rounded-full bg-white border border-gray-200 dark:bg-gray-900 dark:hover:bg-gray-800 dark:border-gray-800">
              <UserRound className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
          )}
        </span>

        <div className="flex flex-col mr-2 items-start text-left">
          <span className="font-medium text-gray-900 dark:text-white text-sm">
            {user ? user.name : "Загрузка..."}
          </span>
          <div className="flex items-center gap-1 text-xs">
            {isOnline ? (
              <div className="flex items-center gap-1">
                <p className="h-2 w-2 rounded-full bg-green-500"></p>
                <p className="text-[14px]">Online</p>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <p className="h-2 w-2 rounded-full bg-red-500"></p>
                <p className="text-[14px]">Offline</p>
              </div>
            )}
          </div>
        </div>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="40"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {user ? user.name : "Загрузка..."}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user ? user.username : ""}
          </span>
        </div>

        <FileInput onChange={handleAvatarChange} className="mt-2 mb-4" />

        {/* <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              href="/edit/2"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              <CircleUserRound className="text-gray-500" />
              Личные данный
            </DropdownItem>
          </li>
        </ul> */}

        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 font-medium text-red-600 bg-gray-100 rounded-lg hover:bg-red-100 dark:bg-white/5 dark:hover:bg-red-800"
        >
          Logout
        </button>
      </Dropdown>
    </div>
  );
}
