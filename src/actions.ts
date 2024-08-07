// import { PasswordItem, Folder } from "./types";
// import { mockData } from "./data";

import { Group } from "jazz-tools";
import { Folder, PasswordItem } from "./schema";

// Mock user data
const mockUser = {
  email: "user@example.com",
  password: "password123",
};

const dispatchLoginEvent = (isLoggedIn: boolean) => {
  window.dispatchEvent(
    new CustomEvent("loginStateChanged", { detail: isLoggedIn })
  );
};

export const login = (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email === mockUser.email && password === mockUser.password) {
        localStorage.setItem("isLoggedIn", "true");
        dispatchLoginEvent(true);
        resolve(true);
      } else {
        resolve(false);
      }
    }, 500);
  });
};

export const logout = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.removeItem("isLoggedIn");
      dispatchLoginEvent(false);
      resolve();
    }, 500);
  });
};

export const register = (email: string, password: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you'd check if the user already exists
      mockUser.email = email;
      mockUser.password = password;
      localStorage.setItem("isLoggedIn", "true");
      dispatchLoginEvent(true);
      resolve(true);
    }, 500);
  });
};

export const saveItem = (item: PasswordItem): Promise<PasswordItem> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const folder = mockData.folders.find((f) => f.name === item.folder);
      if (folder) {
        if (!item._id) {
          item._id = `item${Date.now()}`; // Generate a new ID if not provided
        }
        folder.items.push(item);
      } else {
        const newFolder: Folder = {
          _id: `folder${Date.now()}`, // Generate a new ID for the folder
          name: item.folder,
          items: [{ ...item, _id: `item${Date.now()}` }], // Generate a new ID for the item
        };
        mockData.folders.push(newFolder);
      }
      resolve(item);
    }, 500);
  });
};

export const updateItem = (item: PasswordItem): Promise<PasswordItem> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const folder = mockData.folders.find((f) => f.name === item.folder);
      if (folder) {
        const index = folder.items.findIndex((i) => i._id === item._id);
        if (index !== -1) {
          folder.items[index] = item;
          resolve(item);
        } else {
          reject(new Error("Item not found"));
        }
      } else {
        reject(new Error("Folder not found"));
      }
    }, 500);
  });
};

export const deleteItem = (item: PasswordItem): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const folder = mockData.folders.find((f) => f.name === item.folder);
      if (folder) {
        const index = folder.items.findIndex((i) => i._id === item._id);
        if (index !== -1) {
          folder.items[index] = { ...folder.items[index], deleted: true };
          resolve();
        } else {
          reject(new Error("Item not found"));
        }
      } else {
        reject(new Error("Folder not found"));
      }
    }, 500);
  });
};

export const createFolder = (folderName: string): Promise<Folder> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockData.folders.some((f) => f.name === folderName)) {
        reject(new Error("Folder already exists"));
      } else {
        const newFolder: Folder = {
          _id: `folder${Date.now()}`,
          name: folderName,
          items: [],
        };
        mockData.folders.push(newFolder);
        resolve(newFolder);
      }
    }, 500);
  });
};

export const shareFolder = (
  folderName: string,
  permission: string
): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const inviteLink = `https://example.com/invite?folder=${folderName}&permission=${permission}`;
      resolve(inviteLink);
    }, 500);
  });
};

export const shareItem = (
  item: PasswordItem,
  permission: string
): Promise<string> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const inviteLink = `https://example.com/invite?item=${item.name}&permission=${permission}`;
      resolve(inviteLink);
    }, 500);
  });
};

export const getSharedUsers = (folder: Folder): Promise<string[]> => {
  folder._owner.castAs(Group).members;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(["user1@example.com", "user2@example.com"]);
    }, 500);
  });
};
